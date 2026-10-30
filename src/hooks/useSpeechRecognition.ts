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

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
  }, [onTranscriptChange]);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

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
          // Normal timeout on silence - do not treat as fatal error
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
    } catch {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [lang]);

  const startListening = useCallback(
    (customLang?: string) => {
      if (!recognitionRef.current) {
        setErrorMessage('not-supported');
        return;
      }
      try {
        if (customLang && recognitionRef.current) {
          recognitionRef.current.lang = customLang;
        }
        setErrorMessage(null);
        setTranscript('');
        setInterimText('');
        isManuallyStoppedRef.current = false;
        recognitionRef.current.start();
      } catch (err: any) {
        if (err?.name === 'InvalidStateError') {
          try {
            recognitionRef.current.stop();
            setTimeout(() => {
              try {
                recognitionRef.current.start();
              } catch {}
            }, 120);
          } catch {}
        } else {
          console.warn('Speech recognition start error:', err);
        }
      }
    },
    []
  );

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
