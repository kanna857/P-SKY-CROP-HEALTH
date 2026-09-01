import { useState, useRef, useCallback, useEffect } from 'react';

export interface VoiceLanguage {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: VoiceLanguage[] = [
  { code: 'en-IN', label: 'English (India)', nativeLabel: 'English', flag: '🇮🇳' },
  { code: 'hi-IN', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te-IN', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🌾' },
  { code: 'ta-IN', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🌴' },
  { code: 'kn-IN', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🌿' },
  { code: 'mr-IN', label: 'Marathi', nativeLabel: 'मराठी', flag: '🏔️' },
  { code: 'bn-IN', label: 'Bengali', nativeLabel: 'বাংলা', flag: '🌊' },
  { code: 'es-ES', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
];

interface UseVoiceOptions {
  language: string;
  onResult: (transcript: string, isFinal?: boolean) => void;
}

export function useVoice({ language, onResult }: UseVoiceOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const levelIntervalRef = useRef<any>(null);

  const startListening = useCallback(async () => {
    setVoiceError(null);
    setLiveTranscript('');

    // 1. Explicitly request microphone access if mediaDevices is available
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close stream immediately so SpeechRecognition can take exclusive control of microphone
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        console.warn('Microphone access issue:', err);
        const msg = 'Microphone access was denied or not found. Please enable microphone permissions in your browser address bar.';
        setVoiceError(msg);
        alert(msg);
        return;
      }
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const msg = 'Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.';
      setVoiceError(msg);
      alert(msg);
      return;
    }

    try {
      // Abort any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language || 'en-IN';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
        if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
        levelIntervalRef.current = setInterval(() => {
          setAudioLevel(Math.random() * 0.8 + 0.2);
        }, 100);
      };

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }

        const currentSpoken = (finalText || interimText).trim();
        if (currentSpoken) {
          setLiveTranscript(currentSpoken);
          onResult(currentSpoken, !!finalText);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition status:', e?.error);
        if (e?.error === 'not-allowed') {
          setVoiceError('Microphone permission blocked. Click the lock/settings icon in your address bar to allow.');
        } else if (e?.error === 'no-speech') {
          // No speech detected yet, keep listening or finish gently
        } else if (e?.error === 'audio-capture') {
          setVoiceError('No microphone detected on your system. Please plug in a microphone.');
        }
        if (e?.error !== 'no-speech') {
          setIsListening(false);
          setAudioLevel(0);
          if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setAudioLevel(0);
        if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Error starting recognition:', err);
      setVoiceError(err.message || 'Error activating microphone.');
      setIsListening(false);
    }
  }, [language, onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    setAudioLevel(0);
    if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;

      // Clean markdown and special symbols for natural speech
      const clean = text
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/•/g, '')
        .replace(/- /g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/\n+/g, '. ');

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = language || 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(
        (v) =>
          v.lang.toLowerCase() === (language || '').toLowerCase() ||
          v.lang.startsWith((language || 'en').split('-')[0])
      );
      if (match) utterance.voice = match;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    return () => {
      if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    audioLevel,
    liveTranscript,
    voiceError,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  };
}
