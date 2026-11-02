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

export function getSpeechRecognitionLocale(lang: string, outputLang?: string): string {
  if (outputLang === 'darija') return 'ar-MA';
  const l = (lang || 'ar').toLowerCase().split('-')[0];
  switch (l) {
    case 'ar':
      return 'ar-SA';
    case 'fr':
      return 'fr-FR';
    case 'en':
      return 'en-US';
    case 'es':
      return 'es-ES';
    case 'de':
      return 'de-DE';
    case 'it':
      return 'it-IT';
    case 'pt':
      return 'pt-BR';
    case 'tr':
      return 'tr-TR';
    case 'ru':
      return 'ru-RU';
    case 'ja':
      return 'ja-JP';
    case 'zh':
      return 'zh-CN';
    case 'hi':
      return 'hi-IN';
    case 'ko':
      return 'ko-KR';
    case 'nl':
      return 'nl-NL';
    case 'pl':
      return 'pl-PL';
    case 'id':
      return 'id-ID';
    default:
      return 'ar-SA';
  }
}

export function useSpeechRecognition({ onTranscriptChange, lang = 'ar-SA' }: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  const isManuallyStoppedRef = useRef(false);
  const currentLangRef = useRef(lang);

  // Persistent accumulator across recognition restarts (silence pauses in Chrome)
  const accumulatedFinalRef = useRef('');
  const currentSessionFinalRef = useRef('');

  useEffect(() => {
    currentLangRef.current = lang;
  }, [lang]);

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
  }, [onTranscriptChange]);

  // Initial check for Web Speech API support and permission status
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;
    setIsSupported(!!SpeechRecognition);

    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          setPermissionState(permissionStatus.state as any);
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state as any);
          };
        })
        .catch(() => {
          // Permissions API query not supported for microphone in this browser
        });
    }
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
    accumulatedFinalRef.current = '';
    currentSessionFinalRef.current = '';
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

      // Abort any existing instance before starting fresh
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
        recognitionRef.current = null;
      }
      cleanupAudio();

      // Reset accumulators
      accumulatedFinalRef.current = '';
      currentSessionFinalRef.current = '';
      setTranscript('');
      setInterimText('');
      setErrorMessage(null);
      isManuallyStoppedRef.current = false;

      // 1. Explicitly request microphone access via getUserMedia to prompt permissions cleanly
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          setPermissionState('granted');

          // Set up audio frequency analyser for visual waveform
          try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const audioCtx = new AudioCtx();
              audioContextRef.current = audioCtx;
              const sourceNode = audioCtx.createMediaStreamSource(stream);
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 64;
              analyser.smoothingTimeConstant = 0.8;
              sourceNode.connect(analyser);

              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              const updateLevel = () => {
                if (!analyser || isManuallyStoppedRef.current) return;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                  sum += dataArray[i];
                }
                const avg = sum / dataArray.length;
                // Scale to 0-100 range
                setAudioLevel(Math.min(Math.round((avg / 128) * 100), 100));
                animationFrameRef.current = requestAnimationFrame(updateLevel);
              };
              updateLevel();
            }
          } catch (audioErr) {
            console.warn('AudioContext level visualization setup skipped:', audioErr);
          }
        } catch (mediaErr: any) {
          console.warn('Microphone permission request result:', mediaErr);
          if (
            mediaErr?.name === 'NotAllowedError' ||
            mediaErr?.name === 'PermissionDeniedError' ||
            mediaErr?.message?.toLowerCase().includes('denied') ||
            mediaErr?.message?.toLowerCase().includes('permission')
          ) {
            setPermissionState('denied');
            setErrorMessage('permission-denied');
            setIsListening(false);
            cleanupAudio();
            return;
          }
          // For other device errors (e.g. NotFoundError), still attempt SpeechRecognition
        }
      }

      // 2. Instantiate and launch SpeechRecognition
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        const targetLocale = customLang || currentLangRef.current || 'ar-SA';
        recognition.lang = targetLocale;

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
          isManuallyStoppedRef.current = false;
        };

        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          let sessionFinal = '';
          let sessionInterim = '';

          for (let i = 0; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item && item[0]) {
              if (item.isFinal) {
                sessionFinal += item[0].transcript + ' ';
              } else {
                sessionInterim += item[0].transcript;
              }
            }
          }

          currentSessionFinalRef.current = sessionFinal;

          // Combine persistent accumulated text from previous pauses + current session text
          const fullFinal = (accumulatedFinalRef.current + ' ' + sessionFinal).trim();
          const fullCombined = (fullFinal + ' ' + sessionInterim).trim();

          setTranscript(fullFinal);
          setInterimText(sessionInterim.trim());

          // Send live dictated text to parent component
          onTranscriptChangeRef.current?.(fullCombined, sessionInterim.length === 0);
        };

        recognition.onerror = (event: SpeechRecognitionErrorLike) => {
          console.warn('SpeechRecognition error event:', event.error);
          if (event.error === 'no-speech') {
            // Silence timeout — do not stop unless manually stopped
            return;
          }
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setPermissionState('denied');
            setErrorMessage('permission-denied');
            setIsListening(false);
            cleanupAudio();
            return;
          }
          if (event.error === 'aborted') {
            // Ignored if caused by manual stop
            return;
          }
          setErrorMessage(event.error);
          setIsListening(false);
          cleanupAudio();
        };

        recognition.onend = () => {
          // If browser closed the session automatically (silence) and user didn't manually stop:
          if (!isManuallyStoppedRef.current) {
            // Save what we have accumulated so far
            if (currentSessionFinalRef.current) {
              accumulatedFinalRef.current = (accumulatedFinalRef.current + ' ' + currentSessionFinalRef.current).trim();
              currentSessionFinalRef.current = '';
            }
            try {
              recognition.start();
              return;
            } catch {
              // Failed to restart automatically, conclude gracefully
            }
          }
          setIsListening(false);
          setInterimText('');
          cleanupAudio();
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.warn('Speech recognition start failed:', err);
        setErrorMessage(err?.message || 'start-failed');
        setIsListening(false);
        cleanupAudio();
      }
    },
    [cleanupAudio]
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
    permissionState,
    clearError: () => setErrorMessage(null),
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
}
