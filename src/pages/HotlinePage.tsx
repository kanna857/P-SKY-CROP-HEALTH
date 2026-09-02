import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Globe, 
  Send,
  MessageSquare,
  Check,
  Hand,
  Radio,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { 
  DOCTOR_PROFILES, 
  VoiceDoctorProfile, 
  generateDoctorSpeechResponse, 
  HotlineMessage 
} from '@/lib/voiceHotlineEngine';
import { useToast } from '@/hooks/use-toast';
import { playMultilingualSpeech, stopCurrentSpeech } from '@/lib/multilingualAudio';

type SupportedLang = 'en' | 'hi' | 'pa' | 'te' | 'ta' | 'mr' | 'kn' | 'bn' | 'es';

export default function HotlinePage() {
  const { toast } = useToast();
  const [activeDoctor, setActiveDoctor] = useState<VoiceDoctorProfile>(DOCTOR_PROFILES[0]);
  const [selectedLang, setSelectedLang] = useState<SupportedLang>('en');
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [callDurationSec, setCallDurationSec] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [textInput, setTextInput] = useState<string>('');
  const [liveSpokenWords, setLiveSpokenWords] = useState<string>('');
  const [messages, setMessages] = useState<HotlineMessage[]>([]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const speechWatchdogRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Synchronous State Reference Guards
  const isCallActiveRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);
  const activeLangRef = useRef<SupportedLang>('en');
  const capturedSpeechRef = useRef<string>('');

  useEffect(() => { isCallActiveRef.current = isCallActive; }, [isCallActive]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { isProcessingRef.current = isProcessing; }, [isProcessing]);
  useEffect(() => { activeLangRef.current = selectedLang; }, [selectedLang]);

  // Auto-scroll transcript to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveSpokenWords]);

  // Call duration counter
  useEffect(() => {
    let interval: any = null;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDurationSec(prev => prev + 1);
      }, 1000);
    } else {
      setCallDurationSec(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      } catch {}
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudioAndRecognition();
      stopMicAudioAnalyser();
    };
  }, []);

  // Setup real-time microphone volume visualizer
  const startMicAudioAnalyser = async () => {
    if (audioContextRef.current || !navigator.mediaDevices?.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!isCallActiveRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Normalize to 0-100 scale
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicVolume(normalized);
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn('Microphone audio analyser unavailable:', err);
    }
  };

  const stopMicAudioAnalyser = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
    setMicVolume(0);
  };

  // Fully stop all audio playback, recognition, and timers
  const stopAllAudioAndRecognition = useCallback(() => {
    stopCurrentSpeech();
    if (speechWatchdogRef.current) {
      clearTimeout(speechWatchdogRef.current);
      speechWatchdogRef.current = null;
    }
    if (synthRef.current) {
      try { synthRef.current.cancel(); } catch {}
    }
    if (recognitionRef.current) {
      try { 
        recognitionRef.current.onend = null;
        recognitionRef.current.abort(); 
      } catch {}
      recognitionRef.current = null;
    }
    setIsSpeaking(false);
    setIsListening(false);
    setIsProcessing(false);
    isSpeakingRef.current = false;
    isProcessingRef.current = false;
  }, []);

  // Handle Process User Query (from voice, text input, or quick pills)
  const handleProcessUserQuery = useCallback(async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || trimmed.length < 2) return;

    // Lock recognition while doctor processes
    setIsProcessing(true);
    isProcessingRef.current = true;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    const userMsg: HotlineMessage = {
      id: `user-${Date.now()}`,
      sender: 'farmer',
      text: trimmed,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    setLiveSpokenWords('');
    capturedSpeechRef.current = '';

    let reply = '';
    try {
      const res = await fetch('http://localhost:8000/ask-agronomist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          language: selectedLang,
          doctor_id: activeDoctor.id
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.answer) {
          reply = data.answer;
        }
      }
    } catch (err) {
      console.warn('Backend agronomist query fallback to local engine:', err);
    }

    if (!reply) {
      reply = generateDoctorSpeechResponse(trimmed, selectedLang);
    }

    const doctorMsg: HotlineMessage = {
      id: `doc-${Date.now()}`,
      sender: 'doctor',
      text: reply,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, doctorMsg]);
    setIsProcessing(false);
    isProcessingRef.current = false;

    // Doctor speaks prescription
    speakDoctorResponse(reply);
  }, [activeDoctor.id, selectedLang]);

  // Start a clean, glitch-free voice recognition session
  const startCleanListeningSession = useCallback(() => {
    if (!isCallActiveRef.current || isMutedRef.current || isSpeakingRef.current || isProcessingRef.current) {
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: 'Microphone API Unavailable',
        description: 'Web Speech is not supported in this browser. Please use the quick buttons or type below.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const langMap: Record<SupportedLang, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        pa: 'pa-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        mr: 'mr-IN',
        kn: 'kn-IN',
        bn: 'bn-IN',
        es: 'es-ES'
      };

      recognition.lang = langMap[activeLangRef.current] || 'en-IN';
      // Use continuous = false to prevent Chrome's rapid no-speech disconnect loop!
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      capturedSpeechRef.current = '';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        if (isSpeakingRef.current || isProcessingRef.current) return;

        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalText += res[0].transcript;
          } else {
            interimText += res[0].transcript;
          }
        }

        const recognized = (finalText || interimText).trim();
        if (recognized) {
          capturedSpeechRef.current = recognized;
          setLiveSpokenWords(recognized);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setIsListening(false);
          toast({
            title: 'Microphone Permission Needed',
            description: 'Please allow microphone access in your address bar to speak.',
            variant: 'destructive',
          });
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('Speech recognition status:', event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // If we captured speech, auto-submit it cleanly
        if (capturedSpeechRef.current.trim()) {
          const toSubmit = capturedSpeechRef.current.trim();
          capturedSpeechRef.current = '';
          setLiveSpokenWords('');
          handleProcessUserQuery(toSubmit);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Recognition start exception:', err);
      setIsListening(false);
    }
  }, [handleProcessUserQuery, toast]);

  // Doctor speech completion callback
  const handleAiSpeechCompleted = useCallback(() => {
    if (speechWatchdogRef.current) {
      clearTimeout(speechWatchdogRef.current);
      speechWatchdogRef.current = null;
    }

    setIsSpeaking(false);
    isSpeakingRef.current = false;

    // Inform farmer they can speak
    toast({
      title: '🎙️ Doctor Finished • Speak Now',
      description: 'Tap "Click to Speak" or ask any question.',
    });
  }, [toast]);

  // Doctor voice playback engine
  const speakDoctorResponse = useCallback((text: string) => {
    if (!isSpeakerOn) {
      handleAiSpeechCompleted();
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    setIsSpeaking(true);
    isSpeakingRef.current = true;
    setIsListening(false);
    setLiveSpokenWords('');
    capturedSpeechRef.current = '';

    // Stop previous audio
    stopCurrentSpeech();

    // Stream high-fidelity native vernacular audio for all 9 regional languages
    playMultilingualSpeech({
      text,
      lang: selectedLang,
      onStart: () => {
        setIsSpeaking(true);
        isSpeakingRef.current = true;
        setIsListening(false);
      },
      onEnd: () => {
        handleAiSpeechCompleted();
      },
      onError: (err) => {
        console.warn('Speech playback issue:', err);
        handleAiSpeechCompleted();
      }
    });
  }, [handleAiSpeechCompleted, isSpeakerOn, selectedLang]);

  // Start Call Handler
  const handleStartCall = () => {
    stopAllAudioAndRecognition();

    setIsCallActive(true);
    setIsMuted(false);
    isCallActiveRef.current = true;
    isMutedRef.current = false;

    startMicAudioAnalyser();

    const greeting = activeDoctor.greetingText[selectedLang] || activeDoctor.greetingText.en;

    const initialMsg: HotlineMessage = {
      id: `msg-${Date.now()}`,
      sender: 'doctor',
      text: greeting,
      timestamp: 'Just now'
    };

    setMessages([initialMsg]);
    speakDoctorResponse(greeting);

    toast({
      title: `Connected with ${activeDoctor.name} 📞`,
      description: 'Call is live. Doctor is introducing themselves.',
    });
  };

  // End Call Handler
  const handleEndCall = () => {
    stopAllAudioAndRecognition();
    stopMicAudioAnalyser();
    setIsCallActive(false);
    isCallActiveRef.current = false;
    setLiveSpokenWords('');
    capturedSpeechRef.current = '';

    toast({
      title: 'Call Disconnected',
      description: `Duration: ${formatDuration(callDurationSec)}`
    });
  };

  // Push-to-Talk / Tap to Speak Button: Starts listening to farmer directly
  const handleTapToSpeak = () => {
    if (!isCallActive) {
      handleStartCall();
      return;
    }

    // Stop doctor speech immediately
    stopCurrentSpeech();
    if (synthRef.current) {
      try { synthRef.current.cancel(); } catch {}
    }
    if (speechWatchdogRef.current) {
      clearTimeout(speechWatchdogRef.current);
    }

    setIsSpeaking(false);
    isSpeakingRef.current = false;
    setIsProcessing(false);
    isProcessingRef.current = false;
    setIsMuted(false);
    isMutedRef.current = false;

    // If already listening, submit what we have
    if (isListening) {
      if (capturedSpeechRef.current.trim()) {
        const toSubmit = capturedSpeechRef.current.trim();
        capturedSpeechRef.current = '';
        setLiveSpokenWords('');
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch {}
        }
        handleProcessUserQuery(toSubmit);
      } else {
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch {}
        }
        setIsListening(false);
      }
      return;
    }

    // Start fresh recognition session
    startCleanListeningSession();
    toast({
      title: '🎙️ Listening... Speak Now',
      description: 'Speak your question clearly into the microphone.',
    });
  };

  // Toggle Mute
  const handleToggleMic = () => {
    if (!isCallActive) {
      handleStartCall();
      return;
    }

    if (!isMuted) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      setIsMuted(true);
      isMutedRef.current = true;
      toast({
        title: 'Microphone Muted 🔇',
        description: 'Microphone is temporarily disabled.',
      });
    } else {
      setIsMuted(false);
      isMutedRef.current = false;
      toast({
        title: 'Microphone Unmuted',
        description: 'Tap "Click to Speak" whenever you want to talk.',
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Top Title Banner */}
        <div className="p-6 rounded-3xl bg-[#0c1422]/95 border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.12)] backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <Phone className="w-5 h-5 animate-pulse" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                Kisan Voice Hotline: <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">Call AI Agronomist</span>
              </h1>
            </div>
            <p className="text-xs text-gray-300 font-mono mt-1">
              Live Spoken Agro-Clinic with Push-to-Talk & Real-Time Prescription Transcript
            </p>
          </div>

          {/* Regional Language Selector */}
          <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-2xl border border-white/10">
            <Globe className="w-4 h-4 text-emerald-400 ml-2" />
            <select
              value={selectedLang}
              onChange={(e) => {
                const newLang = e.target.value as SupportedLang;
                setSelectedLang(newLang);
                if (isCallActive) {
                  toast({
                    title: `Language: ${newLang.toUpperCase()}`,
                    description: 'Doctor will respond in your chosen language.'
                  });
                }
              }}
              className="bg-transparent text-white text-xs font-mono font-bold px-2 py-1 outline-none cursor-pointer"
            >
              <option value="en" className="bg-[#0b121e]">English (Indian)</option>
              <option value="hi" className="bg-[#0b121e]">हिन्दी (Hindi)</option>
              <option value="pa" className="bg-[#0b121e]">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="te" className="bg-[#0b121e]">తెలుగు (Telugu)</option>
              <option value="ta" className="bg-[#0b121e]">தமிழ் (Tamil)</option>
              <option value="kn" className="bg-[#0b121e]">ಕನ್ನಡ (Kannada)</option>
              <option value="mr" className="bg-[#0b121e]">मराठी (Marathi)</option>
              <option value="bn" className="bg-[#0b121e]">বাংলা (Bengali)</option>
              <option value="es" className="bg-[#0b121e]">Español (Spanish)</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Phone Interface (5 Cols) + Live Conversation Transcript (7 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Smartphone Call Interface (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative p-6 sm:p-8 rounded-[40px] bg-gradient-to-b from-[#101b2d] via-[#09111c] to-[#060a10] border-2 border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center space-y-5 overflow-hidden">
              
              {/* Top Speaker Notch */}
              <div className="w-20 h-3 rounded-full bg-black/80 mx-auto border border-white/10" />

              {/* Dynamic Call Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-black/60 border border-white/15">
                {isCallActive ? (
                  isSpeaking ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-cyan-300">DOCTOR SPEAKING • {formatDuration(callDurationSec)}</span>
                    </>
                  ) : isProcessing ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-amber-300">PREPARING PRESCRIPTION...</span>
                    </>
                  ) : isListening ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400">LISTENING TO YOU • SPEAK NOW</span>
                    </>
                  ) : isMuted ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-amber-400">MICROPHONE MUTED</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-emerald-400">CALL ACTIVE • TAP TO SPEAK</span>
                    </>
                  )
                ) : (
                  <span className="text-gray-400">HOTLINE STANDBY • TOLL FREE</span>
                )}
              </div>

              {/* Doctor Avatar with Pulsing Ring */}
              <div className="relative mx-auto w-28 h-28">
                {isSpeaking && (
                  <div className="absolute -inset-2 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" />
                )}
                {isListening && (
                  <div className="absolute -inset-2 rounded-full bg-emerald-400/25 animate-pulse pointer-events-none" />
                )}
                <div className={`w-full h-full rounded-full p-1 shadow-2xl transition-all duration-300 ${
                  isSpeaking 
                    ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 shadow-[0_0_35px_rgba(6,182,212,0.5)] scale-105'
                    : isListening
                    ? 'bg-gradient-to-tr from-emerald-400 to-green-300 shadow-[0_0_35px_rgba(16,185,129,0.5)] scale-105'
                    : 'bg-white/10'
                }`}>
                  <img
                    src={activeDoctor.avatar}
                    alt={activeDoctor.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Doctor Details */}
              <div className="space-y-0.5">
                <h3 className="text-xl font-bold text-white font-display">
                  {activeDoctor.name}
                </h3>
                <p className="text-xs text-emerald-400 font-mono">
                  {activeDoctor.specialty}
                </p>
                <p className="text-[11px] text-gray-400 font-mono">
                  Ext: {activeDoctor.phoneExtension}
                </p>
              </div>

              {/* Live Spoken Words Preview */}
              {isCallActive && (isListening || liveSpokenWords) && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-black border border-emerald-500/40 text-xs font-mono text-emerald-300 space-y-2 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                      <span>{isListening ? 'HEARING YOUR VOICE...' : 'CAPTURED QUESTION'}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono">
                      {selectedLang}
                    </span>
                  </div>

                  {liveSpokenWords ? (
                    <div className="space-y-2">
                      <div className="text-white font-sans text-xs font-semibold italic bg-black/60 p-2.5 rounded-xl border border-white/10 text-left">
                        "{liveSpokenWords}"
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const toSend = liveSpokenWords;
                          setLiveSpokenWords('');
                          handleProcessUserQuery(toSend);
                        }}
                        className="w-full py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Check className="w-4 h-4" /> Send This Question Now
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-300 text-left py-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span>Speak your question now... tap "Done" when finished.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Interrupt banner while doctor is speaking */}
              {isCallActive && isSpeaking && (
                <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-2 text-xs">
                  <span className="text-cyan-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <Volume2 className="w-4 h-4 animate-bounce text-cyan-400" />
                    Doctor speaking...
                  </span>
                  <button
                    type="button"
                    onClick={handleTapToSpeak}
                    className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[11px] font-bold border border-emerald-500/40 transition-all"
                  >
                    Interrupt & Speak
                  </button>
                </div>
              )}

              {/* Real-time Dynamic Audio Visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-10 py-1">
                {[30, 60, 90, 50, 80, 100, 75, 45, 85, 55, 70, 40].map((baseHeight, i) => {
                  const dynamicHeight = isListening && micVolume > 5
                    ? Math.min(100, Math.max(20, Math.round(micVolume * 1.2 * ((i % 3) + 0.8))))
                    : isSpeaking
                    ? baseHeight
                    : 20;

                  return (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-100 ${
                        isSpeaking
                          ? 'bg-gradient-to-t from-cyan-400 to-emerald-300 animate-pulse'
                          : isListening
                          ? 'bg-gradient-to-t from-emerald-400 to-green-300'
                          : 'bg-white/10'
                      }`}
                      style={{
                        height: `${dynamicHeight}%`,
                        animationDelay: `${i * 0.08}s`
                      }}
                    />
                  );
                })}
              </div>

              {/* Primary Call Controls */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {/* Mute Button */}
                <button
                  onClick={handleToggleMic}
                  disabled={!isCallActive}
                  className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 text-xs font-mono transition-all border ${
                    isMuted
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
                  }`}
                  title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                >
                  {isMuted ? <MicOff className="w-5 h-5 text-amber-400" /> : <Mic className="w-5 h-5" />}
                  <span className="text-[10px]">{isMuted ? 'Muted' : 'Mute'}</span>
                </button>

                {/* Primary Tap to Speak Button */}
                <button
                  onClick={handleTapToSpeak}
                  disabled={!isCallActive}
                  className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 text-xs font-mono transition-all border ${
                    isListening
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.6)] font-bold scale-105'
                      : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                  title="Click to speak your question"
                >
                  <Hand className="w-5 h-5" />
                  <span className="text-[10px] font-bold">{isListening ? 'Done Speaking' : 'Click to Speak'}</span>
                </button>

                {/* Speaker Toggle */}
                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  disabled={!isCallActive}
                  className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 text-xs font-mono transition-all border ${
                    !isSpeakerOn
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
                  }`}
                  title={isSpeakerOn ? "Turn Speaker Off" : "Turn Speaker On"}
                >
                  {isSpeakerOn ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-rose-400" />}
                  <span className="text-[10px]">{isSpeakerOn ? 'Speaker ON' : 'Speaker OFF'}</span>
                </button>
              </div>

              {/* Big Start / End Call Button */}
              <div className="pt-1">
                {isCallActive ? (
                  <button
                    onClick={handleEndCall}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all hover:scale-[1.02]"
                  >
                    <PhoneOff className="w-5 h-5" />
                    <span>END CALL NOW</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartCall}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-mono font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02]"
                  >
                    <Phone className="w-5 h-5" />
                    <span>START FREE CALL</span>
                  </button>
                )}
              </div>

            </div>

            {/* Specialist Speed Dial Cards */}
            <div className="p-4 rounded-3xl bg-[#0c1422]/90 border border-white/10 space-y-2">
              <span className="text-[11px] font-mono text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Emergency Speed Dial Specialists:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {DOCTOR_PROFILES.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveDoctor(doc);
                      if (isCallActive) {
                        toast({ title: `Switched to ${doc.name}` });
                      }
                    }}
                    className={`p-2 rounded-2xl border text-center transition-all text-xs font-mono ${
                      activeDoctor.id === doc.id
                        ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="truncate font-semibold">{doc.name.split(' ')[1]}</div>
                    <div className="text-[9px] text-gray-400 truncate">{doc.specialty.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Spoken Transcript & Quick Questions (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-[#0c1422]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4 min-h-[500px] flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-extrabold text-white text-sm font-display">
                      Live Spoken Audio Transcript
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    REAL-TIME SYNC
                  </span>
                </div>

                {/* Conversation History */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${msg.sender === 'farmer' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.sender === 'doctor' && (
                          <img
                            src={activeDoctor.avatar}
                            alt="Doctor"
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-500/40 mt-1"
                          />
                        )}
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                            msg.sender === 'farmer'
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md'
                              : 'bg-black/50 border border-white/10 text-gray-200 rounded-bl-none shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-gray-400 mb-1">
                            <span className="font-bold text-white">
                              {msg.sender === 'farmer' ? 'You (Farmer)' : activeDoctor.name}
                            </span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center text-gray-500 font-mono space-y-2">
                      <Phone className="w-8 h-8 text-gray-600 mx-auto" />
                      <p className="text-xs">Press "START FREE CALL" to connect with the Agronomist.</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Typed Message Fallback Input & Quick Questions */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!isCallActive) {
                      handleStartCall();
                    }
                    handleProcessUserQuery(textInput);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={isCallActive ? "Or type your crop question here (press Enter)..." : "Type question & auto-start call..."}
                    className="flex-1 bg-black/60 border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder:text-gray-500 outline-none focus:border-emerald-400 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold transition-all shadow-md"
                    title="Send Question"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Topic Question Chips */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-gray-400 block">Tap any question to ask immediately:</span>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-gray-400">
                    {[
                      'వరి అగ్గితెగులు నివారణ మందు ఏమిటి?',
                      'పత్తిలో గులాబీ రంగు పురుగు మందు',
                      'ఆకులు పసుపు రంగులోకి మారుతున్నాయి',
                      'कपास में गुलाबी सुंडी का इलाज बताएं',
                      'धान में ब्लास्ट रोग की दवा क्या है?',
                      'टमाटर में पत्ती मुड़न रोग का उपाय',
                      'Tomato leaf curl and thrips remedy',
                      'Wheat rust fungicide spray dosage',
                      'Cotton pink bollworm chemical spray',
                      'What fertilizer to spray for yellow leaves?'
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          if (!isCallActive) handleStartCall();
                          handleProcessUserQuery(chip);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/25 text-gray-200 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 transition-all text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}
