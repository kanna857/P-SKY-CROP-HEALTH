import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { executeGoogleAgSearch, AgKnowledgeItem, AGRICULTURAL_KNOWLEDGE_BASE } from '@/lib/agKnowledgeData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Sparkles,
  Leaf,
  Filter,
  Copy,
  Check,
  FileText,
  HelpCircle,
  X,
  ExternalLink,
  BookOpen,
  Sprout,
  ShieldCheck,
  Droplets,
  ArrowRight,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PrescriptionModal, PrescriptionData } from '@/components/analyze/PrescriptionModal';

const QUICK_SEARCH_EXAMPLES = [
  { label: 'Wheat Rust (Exact)', query: 'wheat "leaf rust"' },
  { label: 'Tomato Blight (No Rust)', query: 'tomato "blight" -rust' },
  { label: 'Maize Nitrogen OR Compost', query: 'maize "nitrogen" OR compost' },
  { label: 'Cotton Bollworm', query: 'cotton "bollworm" -chemical' },
  { label: 'Rice Blast Fungicide', query: 'rice "blast" fungicide' },
];

const TOPIC_FILTERS = [
  'All',
  'Pathogen Diagnostics',
  'Soil & Fertilizer',
  'Pest Management',
  'Irrigation Scheduling',
];

export default function AgSearchEngine() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AgKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);

  // Prescription modal state
  const [activePrescription, setActivePrescription] = useState<PrescriptionData | null>(null);
  const [isRxOpen, setIsRxOpen] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);

    try {
      const items = await executeGoogleAgSearch(searchQuery);
      setResults(items);
    } catch (err) {
      console.error('Search failed:', err);
      toast({
        title: 'Search Error',
        description: 'Could not complete search query. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Execute initial search if URL contains query parameter
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    } else {
      // Default: show popular knowledge entries
      setResults(AGRICULTURAL_KNOWLEDGE_BASE.slice(0, 6));
    }
  }, [initialQuery, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query });
    performSearch(query);
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    setSearchParams({ q: exampleQuery });
    performSearch(exampleQuery);
  };

  const handleCopyContent = (item: AgKnowledgeItem) => {
    const text = `[P-SKY AG KNOWLEDGE] ${item.crop_name} (${item.scientific_name || ''})\nTopic: ${item.topic} - ${item.sub_category || ''}\n\n${item.content}\nTags: #${item.tags.join(' #')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    toast({
      title: 'Manual Copied',
      description: `Copied agronomic manual for ${item.crop_name} to clipboard.`,
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleGenerateRx = (item: AgKnowledgeItem) => {
    const rxData: PrescriptionData = {
      plantName: item.crop_name,
      diseaseName: item.sub_category || item.topic,
      healthStatus: 'Attention Needed',
      confidence: '96.8%',
      severity: 'Medium',
      treatment: {
        chemicalName: item.content.includes('spray') || item.content.includes('Spray') ? 'Targeted Agronomic Application' : 'Nutrient Protocol',
        organicOption: 'Neem Oil / Bio-inoculant',
        dosage: 'Refer to Agronomic Manual specifications',
        organicDosage: '3-5 ml/L of water',
        sprayInterval: '7-10 days depending on severity',
        immediateAction: 'Isolate affected plants and balance irrigation schedule.'
      },
      preventiveMeasures: [
        'Maintain balanced irrigation scheduling',
        'Crop rotation and debris sanitation',
        'Regular field monitoring for early symptom emergence'
      ],
      recommendations: [item.content.slice(0, 200) + '...'],
      date: new Date().toISOString().split('T')[0],
      farmName: `${item.crop_name} Production Zone`,
      acreage: 10
    };
    setActivePrescription(rxData);
    setIsRxOpen(true);
  };

  // Filtered results by topic
  const filteredResults = useMemo(() => {
    if (selectedTopic === 'All') return results;
    return results.filter((item) => item.topic.toLowerCase() === selectedTopic.toLowerCase());
  }, [results, selectedTopic]);

  return (
    <div className="w-full space-y-5 animate-fade-in pb-12">
      {/* Main Google-Style Search Form */}
      <div className="relative glass-card bg-[#0a121e]/90 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.6)] space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g., "leaf rust" wheat -stripe OR tomato "blight"'
              className="w-full pl-11 pr-10 py-3.5 h-12 bg-black/60 border-white/15 text-white placeholder:text-gray-500 rounded-2xl text-base shadow-inner focus-visible:ring-emerald-500 font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults(AGRICULTURAL_KNOWLEDGE_BASE.slice(0, 6));
                  setSearchParams({});
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 px-7 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-lg shadow-emerald-500/20 text-sm flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Google Ag Search
              </>
            )}
          </Button>
        </form>

        {/* Google Syntax Helper Buttons & Tips */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-1.5 text-gray-400">
            <span className="font-mono text-[11px] text-gray-300 font-bold">Google Operators:</span>
            <button
              type="button"
              onClick={() => setQuery((prev) => `${prev} "exact phrase"`)}
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-emerald-300 border border-white/10 font-mono text-[11px]"
              title='Exact phrase in quotes'
            >
              "quotes"
            </button>
            <button
              type="button"
              onClick={() => setQuery((prev) => `${prev} -exclude`)}
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-rose-300 border border-white/10 font-mono text-[11px]"
              title='Minus to exclude a term'
            >
              -minus
            </button>
            <button
              type="button"
              onClick={() => setQuery((prev) => `${prev} OR `)}
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 font-mono text-[11px]"
              title='Boolean OR condition'
            >
              OR
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowSyntaxHelp(!showSyntaxHelp)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showSyntaxHelp ? 'Hide Syntax Guide' : 'How Syntax Works'}
          </button>
        </div>

        {/* Expanded Syntax Guide Callout */}
        {showSyntaxHelp && (
          <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-gray-300 space-y-1.5 animate-in fade-in">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Google-Style Parser Rules:
            </div>
            <ul className="list-disc pl-5 space-y-0.5 font-mono text-[11px] text-gray-300">
              <li><strong className="text-white">tomato "blight" -rust</strong>: Finds tomato guides with exact phrase "blight", excluding any containing "rust".</li>
              <li><strong className="text-white">maize "nitrogen" OR compost</strong>: Finds maize guides containing either "nitrogen" or "compost".</li>
              <li><strong className="text-white">wheat "crown root"</strong>: Finds wheat manuals containing the exact consecutive phrase "crown root".</li>
            </ul>
          </div>
        )}
      </div>

      {/* Quick Search Example Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Suggestions:
        </span>
        {QUICK_SEARCH_EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => handleExampleClick(ex.query)}
            className="px-2.5 py-1 rounded-xl bg-[#0e1726] hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 text-xs font-mono transition-all"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
        {TOPIC_FILTERS.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedTopic === topic
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Search Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono px-1">
          <span>
            Showing <strong className="text-white">{filteredResults.length}</strong> matching agricultural manuals
          </span>
          {initialQuery && (
            <span>
              Query: <strong className="text-emerald-400">"{initialQuery}"</strong>
            </span>
          )}
        </div>

        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <article
              key={item.id}
              className="p-5 rounded-3xl bg-[#0a121e]/95 border border-white/10 shadow-xl hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all space-y-3 group"
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] uppercase tracking-wider font-mono">
                    {item.topic}
                  </Badge>
                  {item.sub_category && (
                    <span className="text-xs font-semibold text-cyan-300">
                      • {item.sub_category}
                    </span>
                  )}
                </div>

                {item.relevance_rank !== undefined && (
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-gray-400">Relevance:</span>
                    <span className="font-bold text-emerald-400">
                      {Math.round(item.relevance_rank * 100)}%
                    </span>
                    <div className="w-12 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${Math.round(item.relevance_rank * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Scientific Taxonomy */}
              <div>
                <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                  {item.crop_name}
                  {item.scientific_name && (
                    <span className="text-sm font-normal text-gray-400 italic font-serif">
                      ({item.scientific_name})
                    </span>
                  )}
                </h3>
              </div>

              {/* Comprehensive Content Manual */}
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-sans bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
                {item.content}
              </p>

              {/* Tags & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleExampleClick(tag)}
                      className="px-2.5 py-0.5 rounded-full bg-black/40 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-300 border border-white/10 text-[11px] font-mono transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyContent(item)}
                    className="h-8 text-xs border-white/15 text-gray-300 hover:text-white rounded-xl flex items-center gap-1.5"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Manual
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleGenerateRx(item)}
                    className="h-8 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Generate Prescription
                  </Button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center p-12 glass-card bg-[#0a121e]/80 rounded-3xl border border-white/10 space-y-3">
            <BookOpen className="w-10 h-10 text-gray-500 mx-auto" />
            <h4 className="text-lg font-bold text-white">No Agricultural Manuals Found</h4>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              No records matched the query syntax: <code className="text-emerald-400">{query}</code>. Try removing quotes or exclusion terms.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery('');
                setResults(AGRICULTURAL_KNOWLEDGE_BASE.slice(0, 6));
                setSearchParams({});
              }}
              className="mt-2 text-xs"
            >
              Reset to All Manuals
            </Button>
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      {activePrescription && (
        <PrescriptionModal
          data={activePrescription}
          isOpen={isRxOpen}
          onClose={() => setIsRxOpen(false)}
        />
      )}
    </div>
  );
}
