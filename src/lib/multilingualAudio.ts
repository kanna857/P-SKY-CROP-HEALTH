/**
 * Universal Multilingual Audio & Speech Synthesis Engine
 * Provides native high-fidelity neural audio for:
 * Telugu (te), Hindi (hi), Tamil (ta), Kannada (kn), Marathi (mr),
 * Punjabi (pa), Bengali (bn), Spanish (es), and English (en).
 *
 * Primary: High-fidelity streaming neural TTS via backend /tts endpoint
 * Fallback: Web Speech API (speechSynthesis)
 */

export interface PlaySpeechOptions {
  text: string;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

let activeAudio: HTMLAudioElement | null = null;
let activeController: { cancel: () => void } | null = null;

// Map arbitrary language codes / BCP-47 tags to ISO-639-1 two-letter codes
export function normalizeLanguageCode(lang?: string): string {
  if (!lang) return 'en';
  const clean = lang.toLowerCase().replace('_', '-').trim();
  const primary = clean.split('-')[0];

  const validCodes = ['te', 'hi', 'ta', 'kn', 'mr', 'pa', 'bn', 'es', 'en'];
  if (validCodes.includes(primary)) {
    return primary;
  }
  return 'en';
}

// Clean text for speech synthesis (strip markdown, asterisks, bullet points, URLs)
export function cleanSpeechText(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[•●▪▫■◆★]/g, '')
    .replace(/[-–—]\s/g, ' ')
    .replace(/[\n\r]+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Stop any active audio element or Web Speech synthesis immediately
 */
export function stopCurrentSpeech(): void {
  if (activeController) {
    try {
      activeController.cancel();
    } catch {}
    activeController = null;
  }

  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.src = '';
      activeAudio.onplay = null;
      activeAudio.onended = null;
      activeAudio.onerror = null;
    } catch {}
    activeAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Play speech in the requested language
 */
export function playMultilingualSpeech({
  text,
  lang = 'en',
  onStart,
  onEnd,
  onError,
}: PlaySpeechOptions): { stop: () => void } {
  // Always stop previous speech before starting new one
  stopCurrentSpeech();

  const cleanText = cleanSpeechText(text);
  if (!cleanText) {
    onEnd?.();
    return { stop: () => {} };
  }

  const langCode = normalizeLanguageCode(lang);
  let isCancelled = false;

  const controller = {
    cancel: () => {
      isCancelled = true;
      stopCurrentSpeech();
    },
  };
  activeController = controller;

  // 1. Primary Method: High-Fidelity Neural TTS via Backend Server
  const backendBase = 'http://localhost:8000';
  const ttsUrl = `${backendBase}/tts?lang=${encodeURIComponent(langCode)}&text=${encodeURIComponent(cleanText)}`;

  const audio = new Audio();
  activeAudio = audio;

  let hasStarted = false;

  audio.onplay = () => {
    if (isCancelled) return;
    hasStarted = true;
    onStart?.();
  };

  audio.onended = () => {
    if (isCancelled) return;
    if (activeAudio === audio) {
      activeAudio = null;
    }
    onEnd?.();
  };

  audio.onerror = () => {
    if (isCancelled) return;
    console.warn(`Backend /tts streaming failed for language "${langCode}". Falling back to browser SpeechSynthesis.`);
    if (activeAudio === audio) {
      activeAudio = null;
    }

    // 2. Fallback Method: Browser SpeechSynthesis
    fallbackToSpeechSynthesis(cleanText, langCode, {
      onStart: () => {
        if (!hasStarted && !isCancelled) {
          hasStarted = true;
          onStart?.();
        }
      },
      onEnd: () => {
        if (!isCancelled) onEnd?.();
      },
      onError: (err) => {
        if (!isCancelled) {
          onError?.(err);
          onEnd?.();
        }
      },
    });
  };

  // Trigger audio playback
  audio.src = ttsUrl;
  audio.load();
  audio.play().catch((err) => {
    if (isCancelled) return;
    console.warn('Audio play() failed or was blocked by browser policy:', err);
    // Try fallback
    if (audio.onerror) {
      (audio.onerror as any)(err);
    }
  });

  return {
    stop: () => {
      controller.cancel();
    },
  };
}

/**
 * Fallback to browser Web Speech API
 */
function fallbackToSpeechSynthesis(
  text: string,
  langCode: string,
  callbacks: { onStart?: () => void; onEnd?: () => void; onError?: (err: any) => void }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    callbacks.onError?.('SpeechSynthesis not available');
    return;
  }

  try {
    window.speechSynthesis.cancel();
    try {
      window.speechSynthesis.resume();
    } catch {}

    const utterance = new SpeechSynthesisUtterance(text);

    const bcp47Map: Record<string, string> = {
      te: 'te-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      mr: 'mr-IN',
      pa: 'pa-IN',
      bn: 'bn-IN',
      es: 'es-ES',
      en: 'en-IN',
    };

    utterance.lang = bcp47Map[langCode] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Only set voice if it ACTUALLY matches the target language!
    // Never fall back to an English voice for non-English languages!
    const exactVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().replace('_', '-').startsWith(langCode) ||
        (v.name.toLowerCase().includes(langCode) && !v.name.toLowerCase().includes('english'))
    );

    if (exactVoice) {
      utterance.voice = exactVoice;
    } else if (langCode === 'en') {
      const enVoice = voices.find((v) => v.lang.includes('IN') || v.lang.includes('en'));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onstart = () => callbacks.onStart?.();
    utterance.onend = () => callbacks.onEnd?.();
    utterance.onerror = (e) => callbacks.onError?.(e);

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    callbacks.onError?.(err);
  }
}
