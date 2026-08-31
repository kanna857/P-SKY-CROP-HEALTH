import { useState, useRef, useCallback } from 'react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', label: 'English', flag: '🇮🇳' },
  { code: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te-IN', label: 'తెలుగు', flag: '🌾' },
  { code: 'ta-IN', label: 'தமிழ்', flag: '🌴' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ', flag: '🌿' },
  { code: 'mr-IN', label: 'मराठी', flag: '🏔️' },
  { code: 'bn-IN', label: 'বাংলা', flag: '🌊' },
  { code: 'gu-IN', label: 'ગુજરાતી', flag: '☀️' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', flag: '🌱' },
];

interface UseVoiceOptions {
  language: string;
  onResult: (transcript: string) => void;
}

export function useVoice({ language, onResult }: UseVoiceOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis) return;

      // Strip markdown formatting for clean speech
      const clean = text
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/- /g, '')
        .replace(/\n+/g, '. ');

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      // Pick best available voice for language
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang.startsWith(language.split('-')[0]));
      if (match) utterance.voice = match;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking };
}
