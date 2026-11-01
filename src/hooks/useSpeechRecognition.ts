import { useState, useEffect, useRef, useCallback } from 'react';

// SpeechRecognition type declarations for browsers
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorLike {
  error: string;
  message?: string;
}

export interface UseSpeechRecognitionOptions {
  onTranscriptChange?: (spokenText: string, isFinal: boolean) => void;
  lang?: string;
}

export function useSpeechRecognition({ onTranscriptChange, lang = 'ar-SA' }: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  const isManuallyStoppedRef = useRef(false);
  const currentLangRef = useRef(lang);

  useEffect(() => {
    currentLangRef.current = lang;
  }, [lang]);

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
  }, [onTranscriptChange]);

  // Initial check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    cleanupAudio();
    setIsListening(false);
    setInterimText('');
  }, [cleanupAudio]);

  const startListening = useCallback(
    async (customLang?: string) => {
      const SpeechRecognition =
        typeof window !== 'undefined'
          ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
          : null;

      if (!SpeechRecognition) {
        setErrorMessage('not-supported');
        setIsSupported(false);
        return;
      }

      // Abort existing instance before starting a new one
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
        recognitionRef.current = null;
      }
      cleanupAudio();

      // Request microphone access explicitly to trigger browser permission modal
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;

          // Set up audio visualizer analyser
          try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const audioCtx = new AudioCtx();
              audioContextRef.current = audioCtx;
              const sourceNode = audioCtx.createMediaStreamSource(stream);
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 64;
              sourceNode.connect(analyser);

              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              const updateLevel = () => {
                if (!analyser) return;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                  sum += dataArray[i];
                }
                const avg = sum / dataArray.length;
                setAudioLevel(Math.min(Math.round((avg / 128) * 100), 100));
                animationFrameRef.current = requestAnimationFrame(updateLevel);
              };
              updateLevel();
            }
          } catch (audioErr) {
            console.warn('AudioContext level visualization setup skipped:', audioErr);
          }
        } catch (mediaErr: any) {
          console.warn('Microphone permission request error:', mediaErr);
          if (
            mediaErr?.name === 'NotAllowedError' ||
            mediaErr?.name === 'PermissionDeniedError' ||
            mediaErr?.message?.includes('denied')
          ) {
            setErrorMessage('permission-denied');
            setIsListening(false);
            cleanupAudio();
            return;
          }
        }
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = customLang || currentLangRef.current || 'ar-SA';

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
          isManuallyStoppedRef.current = false;
        };

        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = 0; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item && item[0]) {
              if (item.isFinal) {
                finalTranscript += item[0].transcript + ' ';
              } else {
                interimTranscript += item[0].transcript;
              }
            }
          }

          const fullSpoken = (finalTranscript + interimTranscript).trim();
          setTranscript(finalTranscript.trim());
          setInterimText(interimTranscript.trim());
          onTranscriptChangeRef.current?.(fullSpoken, interimTranscript.length === 0);
        };

        recognition.onerror = (event: SpeechRecognitionErrorLike) => {
          if (event.error === 'no-speech') {
            // Silence timeout — keep listening if user hasn't explicitly stopped
            return;
          }
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setErrorMessage('permission-denied');
          } else {
            setErrorMessage(event.error);
          }
          setIsListening(false);
          cleanupAudio();
        };

        recognition.onend = () => {
          // If not manually stopped, keep listening or stop gracefully
          if (!isManuallyStoppedRef.current && isListening) {
            try {
              recognition.start();
              return;
            } catch {}
          }
          setIsListening(false);
          setInterimText('');
          cleanupAudio();
        };

        recognitionRef.current = recognition;
        setErrorMessage(null);
        setTranscript('');
        setInterimText('');
        isManuallyStoppedRef.current = false;
        recognition.start();
      } catch (err: any) {
        console.warn('Speech recognition start failed:', err);
        setErrorMessage(err?.message || 'start-failed');
        setIsListening(false);
        cleanupAudio();
      }
    },
    [cleanupAudio, isListening]
  );

  const toggleListening = useCallback(
    (customLang?: string) => {
      if (isListening) {
        stopListening();
      } else {
        startListening(customLang);
      }
    },
    [isListening, startListening, stopListening]
  );

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    isListening,
    transcript,
    interimText,
    errorMessage,
    audioLevel,
    clearError: () => setErrorMessage(null),
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
}
