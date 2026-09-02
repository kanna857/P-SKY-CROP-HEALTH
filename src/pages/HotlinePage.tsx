import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe, 
  User, 
  ShieldCheck, 
  Send,
  MessageSquare,
  Activity,
  Zap,
  Check
} from 'lucide-react';
import { 
  DOCTOR_PROFILES, 
  VoiceDoctorProfile, 
  generateDoctorSpeechResponse, 
  HotlineMessage 
} from '@/lib/voiceHotlineEngine';
import { useToast } from '@/hooks/use-toast';

type SupportedLang = 'en' | 'hi' | 'pa' | 'te' | 'ta' | 'mr';

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
  const [textInput, setTextInput] = useState<string>('');
  const [liveSpokenWords, setLiveSpokenWords] = useState<string>('');
  const [messages, setMessages] = useState<HotlineMessage[]>([]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isCallActiveRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeLangRef = useRef<SupportedLang>('en');

  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    activeLangRef.current = selectedLang;
  }, [selectedLang]);

  // Timer for call duration
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
    }
  }, []);

  // Continuous speech listener with silence detection & auto-response
  const startListeningLoop = () => {
    if (!isCallActiveRef.current || isMutedRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: 'Microphone Not Supported',
        description: 'Please use Google Chrome, Edge, or type in the box below.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const langMap: Record<SupportedLang, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        pa: 'pa-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        mr: 'mr-IN'
      };

      recognition.lang = langMap[activeLangRef.current] || 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let capturedSpeech = '';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
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

        const currentWords = (finalText || interimText).trim();
        if (currentWords) {
          capturedSpeech = currentWords;
          setLiveSpokenWords(currentWords);

          // Reset silence timer on every new speech chunk
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Auto-commit query when user pauses speaking for 1.3 seconds
          silenceTimerRef.current = setTimeout(() => {
            if (capturedSpeech.trim()) {
              const queryToSend = capturedSpeech.trim();
              capturedSpeech = '';
              setLiveSpokenWords('');
              try { recognition.stop(); } catch {}
              handleProcessUserQuery(queryToSend);
            }
          }, 1300);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
          toast({
            title: 'Microphone Permission Needed',
            description: 'Please click the lock icon in your browser address bar to allow microphone, or type your question below.',
            variant: 'destructive',
          });
        } else if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // If call is still active and AI is not speaking and user is not muted, restart listening smoothly
        if (isCallActiveRef.current && !isMutedRef.current && !synthRef.current?.speaking) {
          setTimeout(() => {
            if (isCallActiveRef.current && !isMutedRef.current && !synthRef.current?.speaking) {
              try { recognition.start(); } catch {}
            }
          }, 350);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Recognition start exception:', err);
      setIsListening(false);
    }
  };

  // Fallback to Web Speech API
  const fallbackBrowserSpeech = (cleanText: string) => {
    if (!synthRef.current) {
      setIsSpeaking(false);
      if (isCallActiveRef.current && !isMutedRef.current) {
        startListeningLoop();
      }
      return;
    }

    try {
      synthRef.current.cancel();
      try { synthRef.current.resume(); } catch {}

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const langMap: Record<SupportedLang, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        pa: 'hi-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        mr: 'mr-IN'
      };

      utterance.lang = langMap[selectedLang] || 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = synthRef.current.getVoices();
      const matchVoice = voices.find(v => v.lang.toLowerCase().startsWith(selectedLang)) ||
                         voices.find(v => v.lang.includes('IN') || v.lang.includes('India'));
      if (matchVoice) {
        utterance.voice = matchVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsListening(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (isCallActiveRef.current && !isMutedRef.current) {
          setTimeout(() => startListeningLoop(), 350);
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        if (isCallActiveRef.current && !isMutedRef.current) {
          setTimeout(() => startListeningLoop(), 350);
        }
      };

      synthRef.current.speak(utterance);
    } catch {
      setIsSpeaking(false);
      if (isCallActiveRef.current && !isMutedRef.current) {
        startListeningLoop();
      }
    }
  };

  // Text-To-Speech function with Native Google TTS Audio streaming + Web Speech API fallback
  const speakText = async (text: string) => {
    if (!isSpeakerOn) {
      setTimeout(() => {
        if (isCallActiveRef.current && !isMutedRef.current) {
          startListeningLoop();
        }
      }, 500);
      return;
    }

    // Stop any existing speech or audio
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch {}
    }
    if (synthRef.current) {
      try { synthRef.current.cancel(); } catch {}
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }

    setIsSpeaking(true);
    setIsListening(false);

    const cleanText = text.replace(/[*_#•\n]/g, ' ').replace(/\s+/g, ' ').trim();

    // Strategy 1: Fluent regional Google TTS Audio Stream (te, hi, ta, mr, pa, en)
    try {
      const langCodeMap: Record<string, string> = {
        te: 'te',
        hi: 'hi',
        ta: 'ta',
        mr: 'mr',
        pa: 'pa',
        en: 'en'
      };
      const ttsLang = langCodeMap[selectedLang] || 'en';
      // Deliver the first 190 characters in clear, natural native pronunciation
      const speakSlice = cleanText.length > 190 ? cleanText.slice(0, 190) : cleanText;
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodeURIComponent(speakSlice)}`;

      const audio = new Audio(ttsUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        setIsListening(false);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        if (isCallActiveRef.current && !isMutedRef.current) {
          setTimeout(() => startListeningLoop(), 350);
        }
      };

      audio.onerror = () => {
        console.warn('Audio stream error, falling back to browser Web Speech API');
        fallbackBrowserSpeech(cleanText);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play prevented or blocked:', err);
          fallbackBrowserSpeech(cleanText);
        });
      }
    } catch (err) {
      console.warn('Google TTS exception, using Web Speech fallback:', err);
      fallbackBrowserSpeech(cleanText);
    }
  };

  // Start Call Handler
  const handleStartCall = async () => {
    setIsCallActive(true);
    setIsMuted(false);
    isCallActiveRef.current = true;
    isMutedRef.current = false;

    // Prompt for microphone permission up front
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
      } catch (err) {
        console.warn('Microphone permission warning:', err);
      }
    }

    const greeting = activeDoctor.greetingText[selectedLang] || activeDoctor.greetingText.en;

    const initialMsg: HotlineMessage = {
      id: `msg-${Date.now()}`,
      sender: 'doctor',
      text: greeting,
      timestamp: 'Just now'
    };

    setMessages([initialMsg]);
    speakText(greeting);

    toast({
      title: `Connected to ${activeDoctor.name}`,
      description: 'Call is live. The AI is listening to your microphone automatically.',
    });
  };

  // End Call Handler
  const handleEndCall = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch {}
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsCallActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    isCallActiveRef.current = false;
    toast({
      title: 'Call Ended',
      description: `Duration: ${formatDuration(callDurationSec)}`
    });
  };

  // Speech Recognition Toggle
  const handleToggleMic = () => {
    if (!isCallActive) {
      handleStartCall();
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      setIsMuted(true);
      toast({
        title: 'Microphone Muted',
        description: 'Tap mic button again to resume listening.',
      });
    } else {
      setIsMuted(false);
      startListeningLoop();
      toast({
        title: '🎙️ Listening... Speak Now',
        description: 'Ask any question in your language.'
      });
    }
  };

  // Process Query (from voice or text input)
  const handleProcessUserQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }

    const userMsg: HotlineMessage = {
      id: `user-${Date.now()}`,
      sender: 'farmer',
      text: queryText,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    setLiveSpokenWords('');

    // Fetch Agronomist response from FastAPI backend or comprehensive local brain
    let reply = '';
    try {
      const res = await fetch('http://localhost:8000/ask-agronomist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
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

    // Comprehensive client-side fallback
    if (!reply) {
      reply = generateDoctorSpeechResponse(queryText, selectedLang);
    }

    const doctorMsg: HotlineMessage = {
      id: `doc-${Date.now()}`,
      sender: 'doctor',
      text: reply,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, doctorMsg]);
    speakText(reply);
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
              Interactive 24/7 Spoken Voice Consultation in Regional Indian & Global Languages
            </p>
          </div>

          {/* Regional Language Selector */}
          <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-2xl border border-white/10">
            <Globe className="w-4 h-4 text-emerald-400 ml-2" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as any)}
              className="bg-transparent text-white text-xs font-mono font-bold px-2 py-1 outline-none cursor-pointer"
            >
              <option value="en" className="bg-[#0b121e]">English (Indian)</option>
              <option value="hi" className="bg-[#0b121e]">हिन्दी (Hindi)</option>
              <option value="pa" className="bg-[#0b121e]">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="te" className="bg-[#0b121e]">తెలుగు (Telugu)</option>
              <option value="ta" className="bg-[#0b121e]">தமிழ் (Tamil)</option>
              <option value="mr" className="bg-[#0b121e]">मराठी (Marathi)</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Dialer Phone Interface (5 Cols) + Live Conversation Transcript (7 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Smartphone Call Interface (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative p-6 sm:p-8 rounded-[40px] bg-gradient-to-b from-[#101b2d] via-[#09111c] to-[#060a10] border-2 border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center space-y-6 overflow-hidden">
              
              {/* Top Speaker / Camera Notch */}
              <div className="w-20 h-4 rounded-full bg-black/80 mx-auto border border-white/10 mb-2" />

              {/* Call Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10">
                {isCallActive ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-emerald-400">CALL ACTIVE • {formatDuration(callDurationSec)}</span>
                  </>
                ) : (
                  <span className="text-gray-400">HOTLINE STANDBY • TOLL FREE</span>
                )}
              </div>

              {/* Doctor Avatar with Pulsing Audio Ring */}
              <div className="relative mx-auto w-28 h-28">
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-rose-500 animate-ping opacity-30 pointer-events-none" />
                )}
                <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <img
                    src={activeDoctor.avatar}
                    alt={activeDoctor.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Doctor Details */}
              <div className="space-y-1">
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

              {/* Live Spoken Speech Display Badge */}
              {isListening && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/60 to-[#180a14] border border-rose-500/50 text-xs font-mono text-rose-300 animate-pulse space-y-2 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>LISTENING IN REAL-TIME</span>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono">
                      {selectedLang}
                    </span>
                  </div>
                  {liveSpokenWords ? (
                    <div className="space-y-1.5">
                      <div className="text-white font-sans text-xs font-semibold italic bg-black/60 p-2.5 rounded-xl border border-white/10 text-left">
                        "{liveSpokenWords}"
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const toSend = liveSpokenWords;
                          setLiveSpokenWords('');
                          try { recognitionRef.current?.stop(); } catch {}
                          handleProcessUserQuery(toSend);
                        }}
                        className="w-full py-1.5 text-[11px] font-bold bg-rose-500 hover:bg-rose-400 text-white rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" /> Submit Spoken Question
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-300 text-left">
                      Speak your question into microphone now...
                    </div>
                  )}
                </div>
              )}

              {/* Dancing Audio Waveform Visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-10 py-1">
                {[40, 75, 95, 60, 85, 100, 70, 50, 90, 65, 80, 45].map((height, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isSpeaking
                        ? 'bg-gradient-to-t from-emerald-400 to-cyan-300 animate-pulse'
                        : isListening
                        ? 'bg-gradient-to-t from-rose-500 to-amber-400 animate-pulse'
                        : 'bg-white/10'
                    }`}
                    style={{
                      height: isSpeaking || isListening ? `${height}%` : '20%',
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>

              {/* Call Control Action Buttons */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {/* Mute */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={!isCallActive}
                  className={`p-4 rounded-3xl flex flex-col items-center gap-1 text-xs font-mono transition-all border ${
                    isMuted
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span className="text-[10px]">{isMuted ? 'Muted' : 'Mute'}</span>
                </button>

                {/* Primary Voice Mic (Push to Speak) */}
                <button
                  onClick={handleToggleMic}
                  disabled={!isCallActive}
                  className={`p-4 rounded-3xl flex flex-col items-center gap-1 text-xs font-mono transition-all border ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.6)] animate-pulse'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white border-emerald-400/50 shadow-md hover:scale-105'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span className="text-[10px] font-bold">{isListening ? 'Listening...' : 'Speak Voice'}</span>
                </button>

                {/* Speaker Toggle */}
                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  disabled={!isCallActive}
                  className={`p-4 rounded-3xl flex flex-col items-center gap-1 text-xs font-mono transition-all border ${
                    !isSpeakerOn
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isSpeakerOn ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5" />}
                  <span className="text-[10px]">{isSpeakerOn ? 'Speaker ON' : 'Speaker OFF'}</span>
                </button>
              </div>

              {/* Big Green Start / Red End Call Button */}
              <div className="pt-2">
                {isCallActive ? (
                  <button
                    onClick={handleEndCall}
                    className="w-full py-4 rounded-3xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all hover:scale-105"
                  >
                    <PhoneOff className="w-5 h-5" />
                    <span>END CALL NOW</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartCall}
                    className="w-full py-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-mono font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
                  >
                    <Phone className="w-5 h-5" />
                    <span>START FREE CALL</span>
                  </button>
                )}
              </div>

            </div>

            {/* Quick Speed-Dial Specialists */}
            <div className="p-4 rounded-3xl bg-[#0c1422]/90 border border-white/10 space-y-2">
              <span className="text-[11px] font-mono text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Emergency Speed Dial Desks:
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

          {/* Right Column: Live Spoken Transcript & Typed Query (7 Cols) */}
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
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-500/40"
                          />
                        )}
                        <div
                          className={`max-w-md p-3.5 rounded-3xl text-xs leading-relaxed font-sans ${
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
                </div>
              </div>

              {/* Typed Message Fallback Input */}
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
                    placeholder={isCallActive ? "Or type your crop question here..." : "Type question & auto-start call..."}
                    className="flex-1 bg-black/60 border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder:text-gray-500 outline-none focus:border-emerald-400 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Topic Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono text-gray-400">
                  <span>Quick Questions:</span>
                  {[
                    'నా పొలంలో సమస్య ఏమిటి?',
                    'పత్తిలో గులాబీ రంగు పురుగు మందు ఏమిటి?',
                    'వరి అగ్గితెగులు నివారణ',
                    'ఆకులు పసుపు రంగులోకి మారుతున్నాయి',
                    'పూత రాలకుండా ఏ మందు పిచికారీ చేయాలి?',
                    'खेत में क्या समस्या है?',
                    'कपास में गुलाबी सुंडी का इलाज',
                    'धान में ब्लास्ट रोग की दवा',
                    'What is the problem in my field?',
                    'Cotton pink bollworm spray dosage',
                    'Tomato leaf curl remedy',
                    'Wheat rust spray dosage',
                    'Today APMC mandi rates',
                    'Is spray safe today?'
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        if (!isCallActive) handleStartCall();
                        handleProcessUserQuery(chip);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 border border-white/10 transition-colors"
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
    </Layout>
  );
}
