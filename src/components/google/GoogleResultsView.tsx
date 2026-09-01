import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Camera, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Sun, 
  Moon, 
  Grid, 
  Image as ImageIcon, 
  Video, 
  Newspaper, 
  BookOpen, 
  SlidersHorizontal,
  ExternalLink,
  Loader2,
  Clock,
  ShieldAlert,
  Droplets,
  Sprout
} from 'lucide-react';
import { SearchResponse, getSearchSuggestions } from '@/lib/generalSearchEngine';
import { GoogleDirectAnswers } from './GoogleDirectAnswers';
import { GoogleKnowledgePanel } from './GoogleKnowledgePanel';

interface GoogleResultsViewProps {
  response: SearchResponse | null;
  loading: boolean;
  onSearch: (q: string) => void;
  onResetHome: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const GoogleResultsView: React.FC<GoogleResultsViewProps> = ({
  response,
  loading,
  onSearch,
  onResetHome,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [inputVal, setInputVal] = useState(response?.query || '');
  const [activeCategory, setActiveCategory] = useState<'all' | 'pathology' | 'fertilizer' | 'irrigation' | 'images'>('all');
  const [expandedPaaIndex, setExpandedPaaIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredResults = (response?.results || []).filter(item => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'pathology') {
      return item.category === 'Plant Pathology' || /blight|rust|disease|pathogen|spot|fungi|virus|rot|scab|mildew|canker/i.test(item.title + ' ' + item.snippet);
    }
    if (activeCategory === 'fertilizer') {
      return item.category === 'Soil & Fertilizer' || /fertilizer|soil|urea|dap|npk|nitrogen|phosphorus|potassium|lime|nutrient|ph/i.test(item.title + ' ' + item.snippet);
    }
    if (activeCategory === 'irrigation') {
      return item.category === 'Irrigation & Water' || /irrigation|water|drip|sprinkler|moisture|cri|awd|drainage/i.test(item.title + ' ' + item.snippet);
    }
    return true;
  });

  useEffect(() => {
    if (response?.query) {
      setInputVal(response.query);
    }
  }, [response?.query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setShowSuggestions(false);
    onSearch(inputVal);
  };

  const handlePaaToggle = (idx: number) => {
    setExpandedPaaIndex(expandedPaaIndex === idx ? null : idx);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-[#060a10] text-gray-200' : 'bg-white text-gray-900'
    }`}>
      {/* Sticky Google Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        isDarkMode ? 'bg-[#080d16]/95 border-white/10' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo + Search Bar */}
          <div className="flex items-center gap-4 sm:gap-8 flex-1 max-w-3xl">
            {/* Clickable SkyCrop Logo */}
            <button
              onClick={onResetHome}
              className="text-2xl sm:text-3xl font-display font-medium tracking-tight shrink-0 select-none hover:opacity-90 transition-opacity flex items-center"
            >
              <span className="text-[#34A853]">S</span>
              <span className="text-[#4285F4]">k</span>
              <span className="text-[#FBBC05]">y</span>
              <span className="text-[#34A853]">C</span>
              <span className="text-[#EA4335]">r</span>
              <span className="text-[#4285F4]">o</span>
              <span className="text-[#FBBC05]">p</span>
            </button>

            {/* Rounded Search Input Bar */}
            <div className="relative flex-1">
              <form onSubmit={handleSubmit} className="relative w-full">
                <div className={`flex items-center h-11 px-4 rounded-full border transition-all shadow-sm focus-within:shadow-md ${
                  isDarkMode 
                    ? 'bg-[#182232] border-white/20 focus-within:border-blue-400' 
                    : 'bg-white border-gray-300 focus-within:border-blue-500'
                }`}>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => {
                      setInputVal(e.target.value);
                      if (e.target.value.trim().length > 1) {
                        setSuggestions(getSearchSuggestions(e.target.value));
                        setShowSuggestions(true);
                      }
                    }}
                    placeholder="Search SkySearch..."
                    className={`w-full bg-transparent border-none outline-none text-sm font-normal ${
                      isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'
                    }`}
                  />

                  {inputVal && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputVal('');
                        setShowSuggestions(false);
                      }}
                      className="p-1 text-gray-400 hover:text-white mr-1.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 shrink-0 pl-1.5 border-l border-white/10">
                    <button
                      type="button"
                      onClick={() => onSearch('Wheat Crown Root Initiation')}
                      className="p-1 text-[#4285F4] hover:scale-110 transition-transform"
                      title="Voice Agronomy Search"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSearch('Potato Late Blight')}
                      className="p-1 text-gray-400 hover:text-[#FBBC05] hover:scale-110 transition-transform"
                      title="Crop Pathology Search"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      className="p-1 text-[#4285F4] hover:text-blue-300"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-1 py-2 rounded-2xl border shadow-xl z-50 text-left backdrop-blur-xl ${
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
                      className={`w-full px-4 py-2 flex items-center gap-2.5 text-xs transition-colors text-left ${
                        isDarkMode ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode ? 'bg-white/10 text-amber-300 hover:bg-white/15' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button className={`p-2 rounded-full transition-colors hidden sm:block ${
              isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Grid className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 p-[2px] cursor-pointer">
              <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-xs ${
                isDarkMode ? 'bg-[#0c1420] text-white' : 'bg-white text-gray-800'
              }`}>
                S
              </div>
            </div>
          </div>
        </div>

        {/* Google Category Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-medium border-t border-white/5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-6">
            {[
              { id: 'all', label: 'All Agronomy', icon: Search },
              { id: 'pathology', label: 'Plant Diseases', icon: ShieldAlert },
              { id: 'fertilizer', label: 'Fertilizers & Soil', icon: Sparkles },
              { id: 'irrigation', label: 'Irrigation & Water', icon: Droplets },
              { id: 'images', label: 'Crop Visuals', icon: ImageIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`flex items-center gap-1.5 py-3 border-b-2 transition-all font-medium whitespace-nowrap ${
                    isActive
                      ? 'border-[#4285F4] text-[#4285F4] font-semibold'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button className="flex items-center gap-1 text-gray-400 hover:text-white py-3 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tools</span>
          </button>
        </div>
      </header>

      {/* Main Results Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex-1 w-full space-y-6">
        {/* Loading Spinner Indicator */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#4285F4] animate-spin mx-auto" />
            <p className="text-sm text-gray-400 font-mono">Fetching universal web knowledge...</p>
          </div>
        ) : response ? (
          <>
            {/* Search Statistics Line */}
            <div className="text-xs text-gray-400 font-mono pt-1">
              About {response.totalResultsCount} results ({response.searchTimeSeconds} seconds)
            </div>

            {/* Direct Answer Widget (Calculator, Weather, Dictionary, Unit Converter) */}
            {response.directAnswer && (
              <GoogleDirectAnswers
                directAnswer={response.directAnswer}
                onSearchQuery={onSearch}
              />
            )}

            {/* Desktop Two-Column Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Column: Organic Results + People Also Ask */}
              <div className="flex-1 max-w-3xl space-y-7">
                {/* People Also Ask Accordion (Placed after first result or right at top) */}
                {response.peopleAlsoAsk && response.peopleAlsoAsk.length > 0 && (
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDarkMode ? 'bg-[#0c1422]/90 border-white/10' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> People also ask
                    </h3>
                    <div className="divide-y divide-white/10 text-xs">
                      {response.peopleAlsoAsk.map((paa, idx) => (
                        <div key={idx} className="py-2.5">
                          <button
                            onClick={() => handlePaaToggle(idx)}
                            className="w-full flex items-center justify-between text-left font-medium text-gray-200 hover:text-white py-1"
                          >
                            <span>{paa.question}</span>
                            {expandedPaaIndex === idx ? (
                              <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                            )}
                          </button>

                          {expandedPaaIndex === idx && (
                            <div className="pt-2 text-gray-300 leading-relaxed space-y-2 animate-in fade-in">
                              <p className="text-xs font-sans bg-black/40 p-3 rounded-xl border border-white/5">
                                {paa.answer}
                              </p>
                              <div className="text-[11px] text-gray-400 font-mono">
                                Source:{' '}
                                <a
                                  href={paa.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline inline-flex items-center gap-0.5"
                                >
                                  {paa.sourceTitle} <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Organic Search Results List */}
                <div className="space-y-6">
                  {filteredResults.map((item) => (
                    <article key={item.id} className="space-y-1.5 group p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all">
                      {/* URL Breadcrumb & Agronomy Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-mono">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">
                          {item.cropName ? item.cropName.charAt(0) : item.title.charAt(0)}
                        </div>
                        <span className="truncate max-w-md">{item.displayUrl}</span>
                        {item.isVerifiedAgProtocol && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            🌿 Verified Agronomic Protocol
                          </span>
                        )}
                        {item.category && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Clickable Title Link */}
                      <h3 className="text-xl font-normal leading-snug">
                        <a
                          href={item.url}
                          target={item.url.startsWith('/') ? undefined : '_blank'}
                          rel={item.url.startsWith('/') ? undefined : 'noopener noreferrer'}
                          className="text-[#8ab4f8] hover:underline font-medium group-hover:text-emerald-300 transition-colors"
                        >
                          {item.title}
                        </a>
                      </h3>

                      {/* Snippet Content */}
                      <p className="text-sm text-gray-300 leading-relaxed font-sans pt-0.5">
                        {item.date && (
                          <span className="text-emerald-400 font-mono mr-1.5 text-xs font-semibold">[{item.date}]</span>
                        )}
                        {item.snippet}
                      </p>

                      {/* Treatment Action Quick Bar for Diseases */}
                      {item.treatmentSummary && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 font-mono flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate"><strong>Prescription:</strong> {item.treatmentSummary}</span>
                          </div>
                          <a
                            href="/diagnose"
                            className="px-2.5 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] shrink-0 font-bold hover:scale-105 transition-all"
                          >
                            Open Diagnostic Tool &rarr;
                          </a>
                        </div>
                      )}

                      {/* Sitelinks Jump Links */}
                      {item.sitelinks && item.sitelinks.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 pl-3 border-l-2 border-white/10 mt-2">
                          {item.sitelinks.map((link, lIdx) => (
                            <div key={lIdx} className="text-xs space-y-0.5">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline font-medium block truncate"
                              >
                                {link.title}
                              </a>
                              {link.snippet && (
                                <span className="text-[11px] text-gray-400 line-clamp-1">
                                  {link.snippet}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                {/* Related Searches Section */}
                {response.relatedSearches && response.relatedSearches.length > 0 && (
                  <div className="pt-6 border-t border-white/10 space-y-3">
                    <h4 className="text-sm font-bold text-white">Related searches</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {response.relatedSearches.map((rel, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSearch(rel)}
                          className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-mono text-left transition-colors border ${
                            isDarkMode
                              ? 'bg-[#0c1422]/90 hover:bg-[#121c2e] text-gray-200 border-white/10'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'
                          }`}
                        >
                          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{rel}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Iconic SkySearch Pagination Bar */}
                <div className="py-10 text-center select-none border-t border-white/10 space-y-4">
                  <div className="text-4xl font-display font-bold tracking-tight inline-flex items-center gap-0.5">
                    <span className="text-[#4285F4]">S</span>
                    <span className="text-[#EA4335]">k</span>
                    <span className="text-[#FBBC05]">y</span>
                    <span className="text-[#4285F4]">S</span>
                    <span className="text-[#34A853]">e</span>
                    <span className="text-[#EA4335]">a</span>
                    <span className="text-[#4285F4]">r</span>
                    <span className="text-[#34A853]">c</span>
                    <span className="text-[#FBBC05]">h</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-xs font-mono text-gray-400">
                    {[1, 2, 3, 4, 5].map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          currentPage === page
                            ? 'bg-[#4285F4] text-white font-bold'
                            : 'hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="text-[#4285F4] hover:underline ml-2"
                    >
                      Next &gt;
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Knowledge Graph Panel */}
              {response.knowledgeEntity && (
                <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
                  <GoogleKnowledgePanel
                    entity={response.knowledgeEntity}
                    onSearchQuery={onSearch}
                  />
                </div>
              )}
            </div>
          </>
        ) : null}
      </main>

      {/* Results Footer */}
      <footer className={`mt-auto text-xs border-t ${
        isDarkMode ? 'bg-[#09101a] border-white/10 text-gray-400' : 'bg-[#f2f2f2] border-gray-200 text-gray-600'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span>Help</span>
            <span>Send feedback</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400">
            🌾 P-SKY Crop Health • Dedicated Agricultural Intelligence Engine
          </span>
        </div>
      </footer>
    </div>
  );
};
