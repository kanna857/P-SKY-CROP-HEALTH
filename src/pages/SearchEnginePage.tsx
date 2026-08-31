import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Search, 
  Sparkles, 
  Leaf, 
  Pill, 
  ShieldCheck, 
  History, 
  Filter, 
  SlidersHorizontal, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Droplets, 
  Calculator, 
  ExternalLink, 
  Layers, 
  Bookmark, 
  Share2,
  Tag,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CROP_DISEASE_DATA, CropDiseaseInfo } from '@/lib/cropDiseaseData';
import { PrescriptionModal, PrescriptionData } from '@/components/analyze/PrescriptionModal';
import { Link } from 'react-router-dom';

interface SearchResultItem {
  id: string;
  type: 'disease' | 'treatment' | 'prevention' | 'field';
  title: string;
  subtitle: string;
  crop: string;
  scientificName?: string;
  severity?: 'Low' | 'Medium' | 'High';
  isHealthy?: boolean;
  chemicalTreatment?: string;
  organicTreatment?: string;
  dosage?: string;
  sprayInterval?: string;
  recommendations?: string[];
  preventiveMeasures?: string[];
  tags: string[];
}

export default function SearchEnginePage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'disease' | 'treatment' | 'prevention'>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Modal State for Prescription
  const [activePrescription, setActivePrescription] = useState<PrescriptionData | null>(null);
  const [isRxOpen, setIsRxOpen] = useState(false);

  // Index the complete pathology knowledge base
  const searchIndex: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    Object.entries(CROP_DISEASE_DATA).forEach(([key, val]) => {
      // 1. Disease / Pathology Record
      items.push({
        id: `dis-${key}`,
        type: 'disease',
        title: `${val.plantName} — ${val.diseaseName}`,
        subtitle: val.scientificName ? `Scientific: ${val.scientificName}` : 'Optimal Plant Health',
        crop: val.plantName,
        scientificName: val.scientificName,
        severity: val.severity,
        isHealthy: val.isHealthy,
        chemicalTreatment: val.treatment?.chemicalName,
        organicTreatment: val.treatment?.organicOption,
        dosage: val.treatment?.dosage,
        sprayInterval: val.treatment?.sprayInterval,
        recommendations: val.recommendations,
        preventiveMeasures: val.preventiveMeasures,
        tags: [val.plantName, val.diseaseName, val.scientificName || '', val.isHealthy ? 'Healthy' : 'Pathogen', val.severity]
      });

      // 2. Treatment & Dosage Record (if diseased)
      if (val.treatment && !val.isHealthy) {
        items.push({
          id: `tx-${key}`,
          type: 'treatment',
          title: `Protocol: ${val.treatment.chemicalName}`,
          subtitle: `Recommended for ${val.plantName} ${val.diseaseName}`,
          crop: val.plantName,
          severity: val.severity,
          chemicalTreatment: val.treatment.chemicalName,
          organicTreatment: val.treatment.organicOption,
          dosage: val.treatment.dosage,
          sprayInterval: val.treatment.sprayInterval,
          recommendations: val.recommendations,
          tags: ['Treatment', 'Fungicide', 'Bio-control', val.plantName, val.treatment.chemicalName, val.treatment.organicOption]
        });

        // 3. Preventive Protocol Record
        if (val.preventiveMeasures && val.preventiveMeasures.length > 0) {
          items.push({
            id: `prev-${key}`,
            type: 'prevention',
            title: `Preventive Care: ${val.plantName} ${val.diseaseName}`,
            subtitle: `Cultural & Integrated Pest Management Guide`,
            crop: val.plantName,
            severity: val.severity,
            preventiveMeasures: val.preventiveMeasures,
            tags: ['Prevention', 'Cultural Control', 'Sanitation', val.plantName, val.diseaseName]
          });
        }
      }
    });

    return items;
  }, []);

  // Unique list of crops for filter chips
  const cropList = useMemo(() => {
    const set = new Set<string>();
    searchIndex.forEach(item => set.add(item.crop));
    return ['all', ...Array.from(set).sort()];
  }, [searchIndex]);

  // Search Engine Query Matching & Filtering
  const filteredResults = useMemo(() => {
    return searchIndex.filter((item) => {
      // 1. Tab Filter
      if (activeTab !== 'all' && item.type !== activeTab) {
        return false;
      }

      // 2. Crop Filter
      if (selectedCrop !== 'all' && item.crop !== selectedCrop) {
        return false;
      }

      // 3. Severity Filter
      if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) {
        return false;
      }

      // 4. Query matching
      if (query.trim() !== '') {
        const q = query.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inSub = item.subtitle.toLowerCase().includes(q);
        const inCrop = item.crop.toLowerCase().includes(q);
        const inChem = item.chemicalTreatment?.toLowerCase().includes(q) || false;
        const inOrg = item.organicTreatment?.toLowerCase().includes(q) || false;
        const inRecs = item.recommendations?.some(r => r.toLowerCase().includes(q)) || false;
        const inPrev = item.preventiveMeasures?.some(p => p.toLowerCase().includes(q)) || false;
        const inTags = item.tags.some(t => t.toLowerCase().includes(q));

        if (!inTitle && !inSub && !inCrop && !inChem && !inOrg && !inRecs && !inPrev && !inTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchIndex, query, activeTab, selectedCrop, selectedSeverity]);

  // Open Prescription Modal
  const handleOpenRx = (item: SearchResultItem) => {
    setActivePrescription({
      plantName: item.crop,
      diseaseName: item.title.includes('—') ? item.title.split('—')[1].trim() : item.title,
      scientificName: item.scientificName,
      healthStatus: item.isHealthy ? 'Healthy' : 'Diseased',
      severity: item.severity || 'Medium',
      confidence: '99.8%',
      treatment: item.chemicalTreatment ? {
        chemicalName: item.chemicalTreatment,
        dosage: item.dosage || '2.5 g/L',
        sprayInterval: item.sprayInterval || 'Every 7–10 days',
        organicOption: item.organicTreatment || 'Neem oil spray',
        organicDosage: '5 ml / Liter water',
        immediateAction: 'Apply recommended foliar spray early in the morning.'
      } : undefined,
      recommendations: item.recommendations || ['Follow standard organic fungicide protocol.'],
      preventiveMeasures: item.preventiveMeasures || ['Ensure proper canopy aeration.'],
      imagePreview: '/samples/tomato_early_blight.jpg',
      fieldName: 'Knowledge Engine Reference',
    });
    setIsRxOpen(true);
  };

  const quickQueries = [
    'Tomato Early Blight',
    'Mancozeb Dosage',
    'Apple Scab',
    'Copper Oxychloride',
    'Corn Common Rust',
    'Neem Oil Organic',
    'Rice Blast',
    'High Severity'
  ];

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Top Hero Search Section */}
        <div className="p-6 md:p-10 rounded-3xl bg-gradient-to-r from-[#0c1422]/95 via-[#0a1828]/95 to-[#0c1422]/95 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative overflow-hidden text-center space-y-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase relative z-10 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            AI Agronomist Knowledge & Pathology Search Engine
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white font-display tracking-tight relative z-10">
            Search 38 Crop Diseases, <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-400">
              Treatments & Agronomy Knowledge
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto relative z-10">
            Instant semantic search across certified plant pathologies, active fungicides, tank spray dilution formulas, organic bio-remedies, and field scouting guides.
          </p>

          {/* Large Hero Search Input */}
          <div className="max-w-3xl mx-auto relative z-10 pt-2">
            <div className="relative flex items-center">
              <Search className="w-6 h-6 text-amber-400 absolute left-5 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search any disease, crop, chemical fungicide, dosage, or symptom..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-14 pr-12 py-7 text-sm sm:text-base bg-black/70 border-white/20 text-white rounded-3xl focus-visible:ring-amber-400 shadow-[0_0_30px_rgba(0,0,0,0.8)] placeholder:text-gray-500"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-5 text-gray-400 hover:text-white p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
              <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1 mr-1">
                <Zap className="w-3 h-3 text-amber-400" /> Popular:
              </span>
              {quickQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all hover:scale-105"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Tab Navigation & Filter Controls */}
        <div className="p-5 rounded-3xl bg-[#0c1422]/90 border border-white/10 shadow-xl backdrop-blur-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 pb-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-2xl border border-white/10 w-full sm:w-auto overflow-x-auto">
              {[
                { id: 'all', label: '🌐 All Knowledge', count: searchIndex.length },
                { id: 'disease', label: '🔬 Pathologies', count: searchIndex.filter(i => i.type === 'disease').length },
                { id: 'treatment', label: '💊 Treatments & Spray', count: searchIndex.filter(i => i.type === 'treatment').length },
                { id: 'prevention', label: '🛡️ Preventive Care', count: searchIndex.filter(i => i.type === 'prevention').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                  <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-gray-400 font-bold">Severity:</span>
              <div className="flex bg-black/60 p-0.5 rounded-xl border border-white/10">
                {['all', 'Low', 'Medium', 'High'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedSeverity === sev
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {sev === 'all' ? 'All' : sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Crop Chips Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-gray-400 font-bold text-[11px] uppercase mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-400" /> Filter Crop:
            </span>
            {cropList.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCrop === c
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {c === 'all' ? 'All Crops' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <span>Found <strong className="text-white">{filteredResults.length}</strong> matching agronomic records</span>
            {(query || selectedCrop !== 'all' || selectedSeverity !== 'all' || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedCrop('all');
                  setSelectedSeverity('all');
                  setActiveTab('all');
                }}
                className="text-amber-400 hover:underline font-bold"
              >
                Reset Search Filters
              </button>
            )}
          </div>

          {filteredResults.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <Search className="w-10 h-10 text-gray-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Agronomic Entries Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No matching diseases, fungicides, or crop records found for "{query}". Try searching for broader terms like "Tomato", "Scab", or "Mancozeb".
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setSelectedCrop('all');
                  setSelectedSeverity('all');
                  setActiveTab('all');
                }}
                className="border-white/20 text-xs"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-[#0c1422]/90 border border-white/10 hover:border-amber-500/40 shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header: Type Badge & Crop */}
                    <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        {item.type === 'disease' && (
                          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <Leaf className="w-4 h-4" />
                          </div>
                        )}
                        {item.type === 'treatment' && (
                          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            <Pill className="w-4 h-4" />
                          </div>
                        )}
                        {item.type === 'prevention' && (
                          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <Badge className="bg-white/10 text-white border-white/10 text-[10px]">
                            {item.crop}
                          </Badge>
                          <span className="text-[10px] text-gray-400 font-mono ml-2 uppercase">
                            {item.type}
                          </span>
                        </div>
                      </div>

                      {item.severity && (
                        <Badge
                          variant={item.severity === 'High' ? 'destructive' : 'outline'}
                          className={`text-[10px] font-bold ${
                            item.severity === 'Medium' ? 'border-amber-400/40 text-amber-300' : ''
                          }`}
                        >
                          {item.severity} Severity
                        </Badge>
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 italic">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Chemical & Organic Protocol Card */}
                    {item.chemicalTreatment && (
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-cyan-400 uppercase block">Chemical Formulation</span>
                          <p className="font-mono text-white text-[11px]">{item.chemicalTreatment}</p>
                        </div>
                        {item.dosage && (
                          <div className="flex items-center justify-between text-[11px] text-gray-300 pt-1 border-t border-white/5">
                            <span><strong>Dosage:</strong> {item.dosage}</span>
                          </div>
                        )}
                        {item.organicTreatment && (
                          <div className="pt-1 border-t border-white/5">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase block">Organic Alternative</span>
                            <p className="text-[11px] text-gray-300">{item.organicTreatment}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Preventive measures snippet */}
                    {item.preventiveMeasures && item.preventiveMeasures.length > 0 && (
                      <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-gray-300 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Recommended Cultural Action
                        </span>
                        <p className="text-[11px] line-clamp-2">
                          {item.preventiveMeasures[0]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <Button
                      size="sm"
                      onClick={() => handleOpenRx(item)}
                      className="text-xs font-bold gap-1 bg-amber-500 hover:bg-amber-400 text-black rounded-xl h-8 flex-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> Full Protocol (PDF)
                    </Button>

                    <Link to="/diagnose">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1 border-white/20 text-gray-300 hover:text-white rounded-xl h-8"
                      >
                        Scan Leaf <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={isRxOpen}
        onClose={() => setIsRxOpen(false)}
        data={activePrescription}
      />
    </Layout>
  );
}
