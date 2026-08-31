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
  onResult: (transcript: string) => void;
}

export function useVoice({ language, onResult }: UseVoiceOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const recognitionRef = useRef<any>(null);
  const levelIntervalRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        // Simulate animated audio waveform levels while listening
        levelIntervalRef.current = setInterval(() => {
          setAudioLevel(Math.random() * 0.8 + 0.2);
        }, 100);
      };

      recognition.onend = () => {
        setIsListening(false);
        setAudioLevel(0);
        if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition notice:', e?.error);
        setIsListening(false);
        setAudioLevel(0);
        if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
      };

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult && lastResult[0]) {
          const transcript = lastResult[0].transcript;
          if (lastResult.isFinal) {
            onResult(transcript);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
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
      utterance.lang = language;
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(
        (v) => v.lang.toLowerCase() === language.toLowerCase() || v.lang.startsWith(language.split('-')[0])
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
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    audioLevel,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  };
}
