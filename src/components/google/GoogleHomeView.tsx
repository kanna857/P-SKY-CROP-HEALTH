import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Camera, 
  X, 
  Clock, 
  Grid, 
  Sparkles, 
  Sun, 
  Moon, 
  Globe,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { getSearchSuggestions } from '@/lib/generalSearchEngine';
import { Button } from '@/components/ui/button';

interface GoogleHomeViewProps {
  onSearch: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const TRENDING_TOPICS = [
  'Tomato Early Blight',
  'Wheat Nitrogen Schedule',
  'Rice Blast Fungicide',
  'Cotton Pink Bollworm',
  'Drip Fertigation Schedule',
  'NPK Fertilizer Calculator',
  'Potato Late Blight',
  'Soil pH & Lime Requirements',
  'Neem Oil Bio-Pesticide',
  'NDVI Satellite Crop Vigor'
];

const OFFERED_LANGUAGES = [
  'हिन्दी',
  'বাংলা',
  'తెలుగు',
  'मराठी',
  'தமிழ்',
  'ગુજરાતી',
  'ಕನ್ನಡ',
  'മലയാളം',
  'ਪੰਜਾਬੀ'
];

export const GoogleHomeView: React.FC<GoogleHomeViewProps> = ({
  onSearch,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [inputVal, setInputVal] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  // Handle typing suggestions
  useEffect(() => {
    if (inputVal.trim().length > 1) {
      const items = getSearchSuggestions(inputVal);
      setSuggestions(items);
      setShowSuggestions(items.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputVal]);

  // Click outside to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSearch(inputVal);
  };

  const handleFeelingLucky = () => {
    if (inputVal.trim()) {
      onSearch(inputVal);
    } else {
      const luckyQuery = TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)];
      onSearch(luckyQuery);
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Use Web Speech API if supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(transcript);
        setIsListening(false);
        onSearch(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      setTimeout(() => {
        setIsListening(false);
        setInputVal('Wheat Crown Root Initiation');
        onSearch('Wheat Crown Root Initiation');
      }, 1400);
    }
  };

  return (
    <div className={`min-h-[85vh] flex flex-col justify-between transition-colors duration-300 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`}>
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">About</span>
          <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Store</span>
        </div>

        <div className="flex items-center gap-3.5">
          <span className="text-xs text-gray-400 hover:text-white cursor-pointer transition-colors hidden sm:inline">Gmail</span>
          <span className="text-xs text-gray-400 hover:text-white cursor-pointer transition-colors hidden sm:inline">Images</span>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? 'bg-white/10 text-amber-300 hover:bg-white/15' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Google Apps 9-dots icon */}
          <button className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <Grid className="w-4 h-4" />
          </button>

          {/* Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-emerald-400 to-amber-400 p-[2px] cursor-pointer shadow-md">
            <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-xs ${
              isDarkMode ? 'bg-[#0c1420] text-white' : 'bg-white text-gray-800'
            }`}>
              S
            </div>
          </div>
        </div>
      </header>

      {/* Main Center Search Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full -mt-8 space-y-7 text-center">
        {/* Authentic Multi-Color SkySearch Logo with Radiant Halo */}
        <div className="select-none py-2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/15 via-amber-500/20 to-teal-500/20 blur-3xl rounded-full pointer-events-none -z-10" />
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-medium tracking-tight flex items-center justify-center drop-shadow-[0_0_25px_rgba(16,185,129,0.25)]">
            <span className="text-[#34A853]">S</span>
            <span className="text-[#4285F4]">k</span>
            <span className="text-[#FBBC05]">y</span>
            <span className="text-[#34A853]">C</span>
            <span className="text-[#EA4335]">r</span>
            <span className="text-[#4285F4]">o</span>
            <span className="text-[#FBBC05]">p</span>
          </h1>
          <p className="text-xs sm:text-sm font-mono mt-1 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-bold">
            🌾 Universal Agricultural Knowledge & Precision Agronomy Search Engine
          </p>
          <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            <span>Strictly Filtered for Crops, Plant Pathology, Fertilizers & Farming</span>
          </div>
        </div>

        {/* Search Box Console */}
        <div ref={containerRef} className="w-full relative">
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className={`flex items-center w-full h-12 sm:h-14 px-5 rounded-full border transition-all duration-300 shadow-lg ${
              isDarkMode 
                ? 'bg-[#182232]/95 border-white/20 hover:border-emerald-400/60 focus-within:border-transparent focus-within:ring-2 focus-within:ring-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]' 
                : 'bg-white border-gray-300 hover:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400 shadow-md'
            }`}>
              <Search className="w-5 h-5 text-emerald-400 shrink-0 mr-3.5" />
              
              <input
                ref={searchInputRef}
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Search crops, plant diseases, fertilizers, soil health, pests, NDVI, irrigation..."
                className={`w-full bg-transparent border-none outline-none text-sm sm:text-base font-normal ${
                  isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'
                }`}
                autoFocus
              />

              {inputVal && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 text-gray-400 hover:text-white mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-center gap-2 shrink-0 pl-2 border-l border-white/10">
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-full hover:scale-110 transition-transform ${
                    isListening ? 'animate-pulse text-rose-500' : 'text-[#4285F4] hover:text-blue-400'
                  }`}
                  title="Search by voice"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => onSearch('Potato Late Blight')}
                  className="p-1.5 text-gray-400 hover:text-[#FBBC05] hover:scale-110 transition-transform"
                  title="Search crop disease visual"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Live Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-1.5 py-2 rounded-2xl border shadow-2xl z-50 text-left backdrop-blur-xl ${
              isDarkMode ? 'bg-[#182232] border-white/20' : 'bg-white border-gray-200'
            }`}>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputVal(s);
                    setShowSuggestions(false);
                    onSearch(s);
                  }}
                  className={`w-full px-5 py-2.5 flex items-center gap-3 text-sm transition-colors text-left ${
                    isDarkMode ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Agricultural Category Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
          {[
            { label: '🌾 Field Crops', query: 'Wheat Rice Maize Cotton' },
            { label: '🌿 Plant Pathology', query: 'Tomato Early Blight Late Blight' },
            { label: '🧪 Fertilizers & NPK', query: 'Urea DAP NPK Fertilizer Dosage' },
            { label: '💧 Drip & Irrigation', query: 'Drip Irrigation Fertigation Scheduling' },
            { label: '🪲 Pest Control', query: 'Pink Bollworm Fall Armyworm Neem Oil' },
            { label: '🛰️ Satellite NDVI', query: 'NDVI Vegetation Index Sentinel-2' },
          ].map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => onSearch(cat.query)}
              className="px-3 py-1 rounded-full text-[11px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all hover:scale-105"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vibrant Multi-Color Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Button
            onClick={handleSubmit as any}
            className="px-6 py-2.5 h-11 text-xs sm:text-sm font-bold rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 text-white hover:from-emerald-500 hover:to-blue-500 transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-105"
          >
            SkySearch Agriculture
          </Button>

          <Button
            onClick={handleFeelingLucky}
            className="px-6 py-2.5 h-11 text-xs sm:text-sm font-bold rounded-xl border border-purple-500/40 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 text-white hover:opacity-95 transition-all shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:scale-105"
          >
            I'm Feeling Lucky
          </Button>
        </div>

        {/* Google Multilingual Support Strip */}
        <div className="text-xs text-gray-400 flex flex-wrap items-center justify-center gap-2 pt-2">
          <span>SkySearch offered in:</span>
          {OFFERED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => onSearch(`${lang} language`)}
              className="text-[#4285F4] hover:underline cursor-pointer"
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Vibrant Trending Global Topics Pills */}
        <div className="pt-4 space-y-2.5">
          <span className="text-[11px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Popular agricultural queries:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-xl">
            {TRENDING_TOPICS.map((topic, idx) => {
              const colorPills = [
                'border-cyan-500/40 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.2)]',
                'border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
                'border-purple-500/40 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
                'border-rose-500/40 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
                'border-emerald-500/40 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
                'border-teal-500/40 text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 shadow-[0_0_12px_rgba(20,184,166,0.2)]',
              ];
              const pillStyle = colorPills[idx % colorPills.length];

              return (
                <button
                  key={topic}
                  onClick={() => onSearch(topic)}
                  className={`px-3.5 py-1 rounded-full text-xs font-mono font-medium transition-all hover:scale-105 border ${pillStyle}`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Classic Google Footer */}
      <footer className={`mt-12 text-xs border-t ${
        isDarkMode ? 'bg-[#09101a] border-white/10 text-gray-400' : 'bg-[#f2f2f2] border-gray-200 text-gray-600'
      }`}>
        <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
          <span>India • Farming Zones & Precision Telemetry • GPS Linked</span>
          <span className="font-mono text-[11px] text-emerald-400">🌾 Dedicated Agricultural Engine Connected</span>
        </div>

        <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">About</span>
            <span className="hover:underline cursor-pointer">Advertising</span>
            <span className="hover:underline cursor-pointer">Business</span>
            <span className="hover:underline cursor-pointer">How Search works</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span className="hover:underline cursor-pointer">Settings</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
