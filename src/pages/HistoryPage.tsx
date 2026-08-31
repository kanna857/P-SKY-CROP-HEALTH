import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Search, 
  History, 
  Filter, 
  Download, 
  FileText, 
  Satellite, 
  Leaf, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Trash2, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Share2,
  Clock,
  ArrowUpDown,
  Activity,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { PrescriptionModal, PrescriptionData } from '@/components/analyze/PrescriptionModal';

export interface FieldHistoryRecord {
  id: string;
  fieldName: string;
  location: string;
  crop: string;
  category: 'solanaceae' | 'cereals' | 'orchard' | 'commercial';
  date: string;
  time: string;
  ndvi: number;
  ndviTrend: 'up' | 'down' | 'stable';
  diagnosis: string;
  scientificName?: string;
  healthStatus: 'Healthy' | 'Diseased';
  severity: 'Low' | 'Medium' | 'High';
  infectedAreaPct: number;
  lesionCount: number;
  treatmentChemical?: string;
  treatmentOrganic?: string;
  dosage?: string;
  scoutNotes?: string;
  imageUrl?: string;
}

const INITIAL_HISTORY: FieldHistoryRecord[] = [
  {
    id: 'rec-001',
    fieldName: 'Guntur Rice Block A',
    location: 'Guntur, Andhra Pradesh',
    crop: 'Rice',
    category: 'cereals',
    date: '2026-08-30',
    time: '09:15 AM',
    ndvi: 0.72,
    ndviTrend: 'up',
    diagnosis: 'Healthy Vigor / Optimal Tillering',
    healthStatus: 'Healthy',
    severity: 'Low',
    infectedAreaPct: 0.0,
    lesionCount: 0,
    scoutNotes: 'Good standing water depth. Nitrogen top-dressing completed.',
    imageUrl: '/samples/potato_healthy.jpg'
  },
  {
    id: 'rec-002',
    fieldName: 'Prakasam Chilli Sector 4',
    location: 'Prakasam, Andhra Pradesh',
    crop: 'Chilli',
    category: 'solanaceae',
    date: '2026-08-29',
    time: '11:45 AM',
    ndvi: 0.38,
    ndviTrend: 'down',
    diagnosis: 'Tomato / Chilli Early Blight',
    scientificName: 'Alternaria solani',
    healthStatus: 'Diseased',
    severity: 'High',
    infectedAreaPct: 22.4,
    lesionCount: 28,
    treatmentChemical: 'Mancozeb 75% WP @ 2.5 g/L',
    treatmentOrganic: 'Neem Oil 10,000 PPM @ 5 ml/L',
    dosage: '2.5 g / Liter water',
    scoutNotes: 'Concentric brown target spots observed on lower foliage after monsoon showers.',
    imageUrl: '/samples/tomato_early_blight.jpg'
  },
  {
    id: 'rec-003',
    fieldName: 'Krishna Cotton Estate 2',
    location: 'Krishna, Andhra Pradesh',
    crop: 'Cotton',
    category: 'commercial',
    date: '2026-08-28',
    time: '08:30 AM',
    ndvi: 0.54,
    ndviTrend: 'stable',
    diagnosis: 'Bacterial Leaf Spot',
    scientificName: 'Xanthomonas campestris',
    healthStatus: 'Diseased',
    severity: 'Medium',
    infectedAreaPct: 11.2,
    lesionCount: 16,
    treatmentChemical: 'Copper Oxychloride 50% WP @ 3.0 g/L',
    treatmentOrganic: 'Pseudomonas fluorescens 20 g/L',
    dosage: '3.0 g / Liter water',
    scoutNotes: 'Angular water-soaked lesions on upper foliage. Spraying initiated.',
    imageUrl: '/samples/pepper_bacterial_spot.jpg'
  },
  {
    id: 'rec-004',
    fieldName: 'Kurnool Orchard Block 1',
    location: 'Kurnool, Andhra Pradesh',
    crop: 'Apple',
    category: 'orchard',
    date: '2026-08-27',
    time: '04:20 PM',
    ndvi: 0.65,
    ndviTrend: 'down',
    diagnosis: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    healthStatus: 'Diseased',
    severity: 'Medium',
    infectedAreaPct: 8.5,
    lesionCount: 9,
    treatmentChemical: 'Captan 50% WP @ 2.0 g/L',
    treatmentOrganic: 'Sulfur Dusting @ 3 kg/ha',
    dosage: '2.0 g / Liter water',
    scoutNotes: 'Velvety olive-green lesions observed on fruit clusters and young leaves.',
    imageUrl: '/samples/apple_scab.jpg'
  },
  {
    id: 'rec-005',
    fieldName: 'Anantapur Maize Pivot',
    location: 'Anantapur, Andhra Pradesh',
    crop: 'Corn (Maize)',
    category: 'cereals',
    date: '2026-08-26',
    time: '10:10 AM',
    ndvi: 0.49,
    ndviTrend: 'down',
    diagnosis: 'Corn Common Rust',
    scientificName: 'Puccinia sorghi',
    healthStatus: 'Diseased',
    severity: 'High',
    infectedAreaPct: 18.7,
    lesionCount: 38,
    treatmentChemical: 'Azoxystrobin 23% SC @ 1.0 ml/L',
    treatmentOrganic: 'Bio-fungicide Trichoderma harzianum @ 5 g/L',
    dosage: '1.0 ml / Liter water',
    scoutNotes: 'Golden-brown pustules on both upper and lower leaf surfaces.',
    imageUrl: '/samples/corn_rust.jpg'
  },
  {
    id: 'rec-006',
    fieldName: 'Nellore Groundnut South',
    location: 'Nellore, Andhra Pradesh',
    crop: 'Groundnut',
    category: 'commercial',
    date: '2026-08-25',
    time: '02:00 PM',
    ndvi: 0.84,
    ndviTrend: 'up',
    diagnosis: 'Optimal Chlorophyll Canopy',
    healthStatus: 'Healthy',
    severity: 'Low',
    infectedAreaPct: 0.0,
    lesionCount: 0,
    scoutNotes: 'Peak pegging stage. Strong vegetative biomass.',
    imageUrl: '/samples/potato_healthy.jpg'
  },
  {
    id: 'rec-007',
    fieldName: 'Vizag Vineyard North',
    location: 'Visakhapatnam, Andhra Pradesh',
    crop: 'Grape',
    category: 'orchard',
    date: '2026-08-24',
    time: '07:50 AM',
    ndvi: 0.61,
    ndviTrend: 'down',
    diagnosis: 'Grape Black Rot',
    scientificName: 'Guignardia bidwellii',
    healthStatus: 'Diseased',
    severity: 'Medium',
    infectedAreaPct: 9.4,
    lesionCount: 14,
    treatmentChemical: 'Mancozeb 75% WP @ 2.5 g/L',
    treatmentOrganic: 'Bordeaux Mixture 1%',
    dosage: '2.5 g / Liter water',
    scoutNotes: 'Small circular reddish-brown spots with dark margins on grape leaves.',
    imageUrl: '/samples/grape_black_rot.jpg'
  },
  {
    id: 'rec-008',
    fieldName: 'Godavari Sugarcane Delta',
    location: 'East Godavari, Andhra Pradesh',
    crop: 'Sugarcane',
    category: 'commercial',
    date: '2026-08-23',
    time: '03:15 PM',
    ndvi: 0.79,
    ndviTrend: 'up',
    diagnosis: 'Healthy Sugar Cane Stalks',
    healthStatus: 'Healthy',
    severity: 'Low',
    infectedAreaPct: 0.0,
    lesionCount: 0,
    scoutNotes: 'Canopy closure complete. Adequate canal moisture.',
    imageUrl: '/samples/potato_healthy.jpg'
  }
];

export default function HistoryPage() {
  const { toast } = useToast();
  const [records, setRecords] = useState<FieldHistoryRecord[]>(INITIAL_HISTORY);
  
  // Search Engine Query & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [cropCategoryFilter, setCropCategoryFilter] = useState('all');
  const [healthStatusFilter, setHealthStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest-ndvi' | 'lowest-ndvi' | 'highest-infection'>('newest');

  // Modal State for viewing Rx
  const [activePrescription, setActivePrescription] = useState<PrescriptionData | null>(null);
  const [isRxOpen, setIsRxOpen] = useState(false);

  // New Scout Entry Dialog State
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCrop, setNewCrop] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newHealthStatus, setNewHealthStatus] = useState<'Healthy' | 'Diseased'>('Healthy');
  const [newNotes, setNewNotes] = useState('');

  // 🔍 Universal Search Engine & Multi-Filter Logic
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // 1. Full-text search engine matching across all fields
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = rec.fieldName.toLowerCase().includes(q);
        const matchesLocation = rec.location.toLowerCase().includes(q);
        const matchesCrop = rec.crop.toLowerCase().includes(q);
        const matchesDiagnosis = rec.diagnosis.toLowerCase().includes(q);
        const matchesChemical = rec.treatmentChemical?.toLowerCase().includes(q) || false;
        const matchesNotes = rec.scoutNotes?.toLowerCase().includes(q) || false;
        const matchesDate = rec.date.includes(q);

        if (!matchesName && !matchesLocation && !matchesCrop && !matchesDiagnosis && !matchesChemical && !matchesNotes && !matchesDate) {
          return false;
        }
      }

      // 2. Crop Category Filter
      if (cropCategoryFilter !== 'all' && rec.category !== cropCategoryFilter) {
        return false;
      }

      // 3. Health Status Filter
      if (healthStatusFilter !== 'all' && rec.healthStatus !== healthStatusFilter) {
        return false;
      }

      // 4. Severity Filter
      if (severityFilter !== 'all' && rec.severity !== severityFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest-ndvi') return b.ndvi - a.ndvi;
      if (sortBy === 'lowest-ndvi') return a.ndvi - b.ndvi;
      if (sortBy === 'highest-infection') return b.infectedAreaPct - a.infectedAreaPct;
      return 0;
    });
  }, [records, searchQuery, cropCategoryFilter, healthStatusFilter, severityFilter, sortBy]);

  // Aggregate Metrics Summary
  const metrics = useMemo(() => {
    const total = filteredRecords.length;
    const avgNdvi = total > 0 ? (filteredRecords.reduce((acc, r) => acc + r.ndvi, 0) / total).toFixed(2) : '0.00';
    const diseasedCount = filteredRecords.filter(r => r.healthStatus === 'Diseased').length;
    const healthyCount = filteredRecords.filter(r => r.healthStatus === 'Healthy').length;
    const avgInfection = total > 0 ? (filteredRecords.reduce((acc, r) => acc + r.infectedAreaPct, 0) / total).toFixed(1) : '0.0';

    return { total, avgNdvi, diseasedCount, healthyCount, avgInfection };
  }, [filteredRecords]);

  // Open Prescription Modal
  const handleOpenRx = (rec: FieldHistoryRecord) => {
    setActivePrescription({
      plantName: rec.crop,
      diseaseName: rec.diagnosis,
      scientificName: rec.scientificName,
      healthStatus: rec.healthStatus,
      severity: rec.severity,
      confidence: '99.4%',
      treatment: rec.treatmentChemical ? {
        chemicalName: rec.treatmentChemical,
        dosage: rec.dosage || '2.5 g/L',
        sprayInterval: 'Every 7 to 10 days',
        organicOption: rec.treatmentOrganic || 'Neem Oil spray',
        organicDosage: '5 ml / Liter water',
        immediateAction: 'Prune heavily infected lower foliage and apply spray.'
      } : undefined,
      recommendations: [
        'Apply systemic spray in early morning calm wind window.',
        'Avoid sprinkler overhead watering to reduce canopy leaf wetness.'
      ],
      preventiveMeasures: [
        'Maintain 45cm row spacing for optimal transpirational ventilation.',
        'Conduct weekly multi-spectral satellite vigor audits.'
      ],
      imagePreview: rec.imageUrl,
      lesionCount: rec.lesionCount,
      infectedAreaPct: rec.infectedAreaPct,
      severityStage: rec.severity === 'High' ? 'Stage 3 (Severe Damage)' : rec.severity === 'Medium' ? 'Stage 2 (Moderate Spread)' : 'Stage 0 (Healthy)',
      fieldName: rec.fieldName,
    });
    setIsRxOpen(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID,Field Name,Location,Crop,Category,Date,Time,NDVI,Status,Diagnosis,Severity,Infected Area %,Lesion Count,Treatment'];
    const rows = filteredRecords.map(r => 
      `"${r.id}","${r.fieldName}","${r.location}","${r.crop}","${r.category}","${r.date}","${r.time}",${r.ndvi},"${r.healthStatus}","${r.diagnosis}","${r.severity}",${r.infectedAreaPct},${r.lesionCount},"${r.treatmentChemical || 'None'}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skycrop_field_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'History CSV Exported! 📊',
      description: `Downloaded ${filteredRecords.length} historical scouting records.`,
    });
  };

  // Add Custom Scout Entry
  const handleAddEntry = () => {
    if (!newFieldName.trim() || !newCrop.trim()) {
      toast({ title: 'Missing fields', description: 'Please provide Field Name and Crop type.', variant: 'destructive' });
      return;
    }

    const newRec: FieldHistoryRecord = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      fieldName: newFieldName.trim(),
      location: newLocation.trim() || 'Main Farm Block',
      crop: newCrop.trim(),
      category: 'solanaceae',
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ndvi: newHealthStatus === 'Healthy' ? 0.76 : 0.42,
      ndviTrend: newHealthStatus === 'Healthy' ? 'up' : 'down',
      diagnosis: newDiagnosis.trim() || (newHealthStatus === 'Healthy' ? 'Healthy Canopy Vigor' : 'Foliar Spot Stress'),
      healthStatus: newHealthStatus,
      severity: newHealthStatus === 'Healthy' ? 'Low' : 'Medium',
      infectedAreaPct: newHealthStatus === 'Healthy' ? 0.0 : 12.0,
      lesionCount: newHealthStatus === 'Healthy' ? 0 : 8,
      scoutNotes: newNotes.trim() || 'Manual field scouting entry recorded.',
      imageUrl: '/samples/potato_healthy.jpg'
    };

    setRecords([newRec, ...records]);
    setIsAddEntryOpen(false);
    setNewFieldName('');
    setNewLocation('');
    setNewCrop('');
    setNewDiagnosis('');
    setNewNotes('');

    toast({
      title: 'Scout Entry Logged! 📝',
      description: `Saved record for ${newRec.fieldName}.`,
    });
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Top Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0c1422]/95 via-[#091524]/95 to-[#0c1422]/95 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold uppercase">
              <History className="w-3.5 h-3.5" /> Field Scouting & Pathology Archive
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display">
              Field History & <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">Search Engine</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Query, filter, and analyze all historical satellite NDVI scans, foliar pathology inspections, and digital prescriptions across your farm plots.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="gap-2 text-xs border-white/20 text-white hover:bg-white/10 rounded-2xl h-11"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export CSV ({filteredRecords.length})
            </Button>

            <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-lg rounded-2xl h-11">
                  <Plus className="w-4 h-4" /> Log New Field Scout
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c1422] border-white/10 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" /> Add Field Scouting Record
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <Label className="text-gray-300 text-xs">Field Name *</Label>
                    <Input
                      placeholder="e.g. North Plot Chilli Block 2"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-gray-300 text-xs">Crop Species *</Label>
                      <Input
                        placeholder="e.g. Tomato / Rice"
                        value={newCrop}
                        onChange={(e) => setNewCrop(e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs">Location</Label>
                      <Input
                        placeholder="e.g. Guntur, AP"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="bg-white/5 border-white/10 text-white mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Health Status</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setNewHealthStatus('Healthy')}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                          newHealthStatus === 'Healthy'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-md'
                            : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                      >
                        🌿 Healthy
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewHealthStatus('Diseased')}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                          newHealthStatus === 'Diseased'
                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-md'
                            : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                      >
                        ⚠️ Diseased / Stress
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Pathology / Diagnosis</Label>
                    <Input
                      placeholder="e.g. Early Blight / Leaf Spot"
                      value={newDiagnosis}
                      onChange={(e) => setNewDiagnosis(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Scout Notes</Label>
                    <Textarea
                      placeholder="e.g. Observed yellow halos after heavy rainfall..."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      rows={2}
                      className="bg-white/5 border-white/10 text-white mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleAddEntry}
                    className="w-full font-bold bg-emerald-500 hover:bg-emerald-400 text-black mt-2 rounded-xl"
                  >
                    Save Scouting Entry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Aggregate KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[11px] text-gray-400 block font-medium">Scans Recorded</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">{metrics.total}</span>
              <span className="text-[10px] text-emerald-400 font-bold">Plots Logged</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[11px] text-gray-400 block font-medium">Average NDVI Vigor</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">{metrics.avgNdvi}</span>
              <span className="text-[10px] text-gray-400">Canopy Health</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[11px] text-gray-400 block font-medium">Active Pathogens</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-orange-400 font-mono">{metrics.diseasedCount}</span>
              <span className="text-[10px] text-orange-400 font-bold">Needs Spray</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[11px] text-gray-400 block font-medium">Healthy Canopies</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">{metrics.healthyCount}</span>
              <span className="text-[10px] text-emerald-400 font-bold">Optimal</span>
            </div>
          </div>
        </div>

        {/* 🔍 UNIVERSAL SEARCH ENGINE & FILTER CONTROLS */}
        <div className="p-5 rounded-3xl bg-[#0c1422]/90 border border-white/10 shadow-xl backdrop-blur-2xl space-y-4">
          {/* Universal Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search field name, crop species, pathogen diagnosis, location, chemical treatment, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-10 py-6 text-sm bg-black/60 border-white/15 text-white rounded-2xl focus-visible:ring-indigo-500 shadow-inner placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-white/10">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-gray-400 font-bold text-[11px] uppercase mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-indigo-400" /> Crop:
              </span>
              {[
                { id: 'all', label: 'All Crops' },
                { id: 'cereals', label: '🌾 Cereals (Rice/Corn)' },
                { id: 'solanaceae', label: '🍅 Solanaceae (Tomato/Chilli)' },
                { id: 'orchard', label: '🍎 Orchard Fruits (Apple/Grape)' },
                { id: 'commercial', label: '🌿 Commercial (Cotton/Sugar)' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCropCategoryFilter(c.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    cropCategoryFilter === c.id
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Health Status & Severity Selectors */}
            <div className="flex items-center gap-2">
              <Select value={healthStatusFilter} onValueChange={setHealthStatusFilter}>
                <SelectTrigger className="w-[130px] h-9 text-xs bg-white/5 border-white/10 text-white rounded-xl">
                  <SelectValue placeholder="Health Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c1420] border-white/10 text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Healthy">🌿 Healthy Only</SelectItem>
                  <SelectItem value="Diseased">⚠️ Diseased Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[125px] h-9 text-xs bg-white/5 border-white/10 text-white rounded-xl">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c1420] border-white/10 text-white">
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="Low">🟢 Low (&lt; 8%)</SelectItem>
                  <SelectItem value="Medium">🟡 Medium (8-20%)</SelectItem>
                  <SelectItem value="High">🔴 High (&gt; 20%)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-[140px] h-9 text-xs bg-white/5 border-white/10 text-white rounded-xl">
                  <ArrowUpDown className="w-3 h-3 mr-1 text-gray-400" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c1420] border-white/10 text-white">
                  <SelectItem value="newest">📅 Newest Date</SelectItem>
                  <SelectItem value="oldest">📅 Oldest Date</SelectItem>
                  <SelectItem value="highest-ndvi">📈 Highest NDVI</SelectItem>
                  <SelectItem value="lowest-ndvi">📉 Lowest NDVI</SelectItem>
                  <SelectItem value="highest-infection">🔥 Most Infected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 📜 HISTORICAL RECORDS FEED & CARDS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <span>Showing <strong className="text-white">{filteredRecords.length}</strong> matching records</span>
            {(searchQuery || cropCategoryFilter !== 'all' || healthStatusFilter !== 'all' || severityFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCropCategoryFilter('all');
                  setHealthStatusFilter('all');
                  setSeverityFilter('all');
                }}
                className="text-indigo-400 hover:underline font-bold"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <Search className="w-8 h-8 text-gray-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Matching Scouting Records Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No entries matched your search query "{searchQuery}". Try searching for another crop, location, or reset filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setCropCategoryFilter('all');
                  setHealthStatusFilter('all');
                  setSeverityFilter('all');
                }}
                className="border-white/20 text-xs"
              >
                Clear Search & Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-3xl bg-[#0c1422]/90 border border-white/10 hover:border-indigo-500/40 shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all space-y-4 group"
                >
                  {/* Card Header: Field Name, Date, Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {rec.fieldName}
                        </h3>
                        <Badge
                          variant={rec.healthStatus === 'Healthy' ? 'default' : 'destructive'}
                          className="text-[10px] font-bold px-2 py-0.5"
                        >
                          {rec.healthStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5 font-mono">
                        <MapPin className="w-3 h-3 text-indigo-400" /> {rec.location}
                      </p>
                    </div>

                    <div className="text-right shrink-0 font-mono text-[11px] text-gray-400">
                      <div className="flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3 text-gray-400" /> {rec.date}
                      </div>
                      <span className="text-[10px] text-gray-500">{rec.time}</span>
                    </div>
                  </div>

                  {/* Diagnosis & NDVI Metric Row */}
                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-2xl border border-white/5 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Crop Species</span>
                      <span className="font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                        <Leaf className="w-3 h-3 text-emerald-400" /> {rec.crop}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block">NDVI Vigor</span>
                      <span className="font-bold text-cyan-400 font-mono flex items-center justify-center gap-1 mt-0.5">
                        {rec.ndvi}
                        {rec.ndviTrend === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                        ) : rec.ndviTrend === 'down' ? (
                          <TrendingDown className="w-3 h-3 text-rose-400" />
                        ) : null}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block">Infected Area</span>
                      <span className={`font-bold font-mono mt-0.5 block ${rec.infectedAreaPct > 15 ? 'text-red-400' : rec.infectedAreaPct > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {rec.infectedAreaPct}% ({rec.lesionCount} spots)
                      </span>
                    </div>
                  </div>

                  {/* Pathology & Diagnosis Banner */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Pathology Diagnosis
                    </span>
                    <p className={`text-xs font-bold ${rec.healthStatus === 'Healthy' ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {rec.diagnosis}
                      {rec.scientificName && (
                        <span className="text-[11px] font-normal italic text-gray-400 ml-1">
                          ({rec.scientificName})
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Chemical Treatment Protocol (if diseased) */}
                  {rec.treatmentChemical && (
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-300 space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                        Prescribed Protocol:
                      </span>
                      <p className="font-mono text-white text-[11px]">
                        🧪 {rec.treatmentChemical}
                      </p>
                    </div>
                  )}

                  {/* Scout Notes */}
                  {rec.scoutNotes && (
                    <p className="text-[11px] text-gray-400 italic bg-black/30 p-2 rounded-xl border border-white/5">
                      "{rec.scoutNotes}"
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                    <Button
                      size="sm"
                      onClick={() => handleOpenRx(rec)}
                      className="text-xs font-bold gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-8"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Prescription (PDF)
                    </Button>

                    <Link to="/analyze">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1 border-white/20 text-gray-300 hover:text-white rounded-xl h-8"
                      >
                        <Satellite className="w-3.5 h-3.5 text-cyan-400" /> Satellite Map
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
