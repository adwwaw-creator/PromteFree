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

  const recognitionRef = useRef<any>(null);
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

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const startListening = useCallback((customLang?: string) => {
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
          // Silence timeout — keep listening if not manually stopped
          return;
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('permission-denied');
        } else {
          setErrorMessage(event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
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
    }
  }, []);

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
    };
  }, []);

  return {
    isListening,
    transcript,
    interimText,
    errorMessage,
    clearError: () => setErrorMessage(null),
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
}
