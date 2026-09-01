import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Droplets,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  FileText,
  Share2,
  Sparkles,
  Video,
  BarChart2,
  Pill,
  Clock,
  AlertCircle,
  Scan,
  Calculator,
  Gauge,
  CheckCircle2,
  ChevronRight,
  Eye,
  Sliders,
  Layers,
  HelpCircle,
  ShieldCheck,
  Thermometer,
  Columns,
  Flame,
  Zap,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getCropDiseaseInfo, TreatmentProtocol } from '@/lib/cropDiseaseData';
import { runInBrowserOfflineInference } from '@/lib/offlineInference';
import { PrescriptionModal, PrescriptionData } from './PrescriptionModal';
import { LiveCameraScanner } from './LiveCameraScanner';
import { LesionSpot } from '@/lib/types';
import { LesionSvgOverlay } from './LesionSvgOverlay';
import { queueDiseaseReportOffline } from '@/lib/offlineQueue';

export interface PredictionCandidate {
  raw_class: string;
  plant: string;
  issue: string;
  confidence: number;
  percentage: number;
}

export interface DiagnosisResult {
  plantName?: string;
  diseaseName?: string;
  scientificName?: string;
  healthStatus?: string;
  diseases?: { name: string; confidence: string; description: string }[];
  pests?: { name: string; confidence: string; description: string }[];
  nutrientIssues?: { nutrient: string; severity: string }[];
  environmentalStress?: string[];
  severityScore?: number;
  overallDiagnosis?: string;
  treatment?: TreatmentProtocol;
  recommendations?: string[];
  preventiveMeasures?: string[];
  topPredictions?: PredictionCandidate[];
  rawConfidence?: number;
  rawClass?: string;
  thermalIronbow?: string;
  thermalJet?: string;
  thermalInferno?: string;
  lesionCount?: number;
  infectedAreaPct?: number;
  severityStage?: string;
  lesionSpots?: LesionSpot[];
  isOfflineEdge?: boolean;
}

interface CameraUploadProps {
  cropType?: string;
  fieldName?: string;
  sampleImageTrigger?: { file: File; preview: string } | null;
}

const BACKEND_URL = 'http://localhost:8000';

type ScanStage = 'upload' | 'scanning' | 'detecting' | 'result';
type ThermalPalette = 'flir' | 'jet' | 'inferno';
type LayoutMode = 'side-by-side' | 'overlay';

export function CameraUpload({ cropType, fieldName, sampleImageTrigger }: CameraUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStage, setScanStage] = useState<ScanStage>('upload');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Animated Confidence Display Counter
  const [displayConfidence, setDisplayConfidence] = useState(0);

  // View Layout & Thermal Controls
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('side-by-side');
  const [thermalPalette, setThermalPalette] = useState<ThermalPalette>('flir');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.75);
  const [showLesionOverlay, setShowLesionOverlay] = useState<boolean>(true);

  // Dosage Calculator State
  const [tankLiters, setTankLiters] = useState<number>(15);

  // Voice Readout States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<'en-IN' | 'hi-IN' | 'te-IN' | 'ta-IN' | 'kn-IN' | 'mr-IN' | 'bn-IN' | 'es-ES'>('en-IN');

  // Prescription Modal State
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

  // Live Camera Scanner State
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/predict`, { method: 'HEAD' });
        setBackendOnline(res.status !== 0);
      } catch {
        setBackendOnline(false);
      }
    };
    checkBackend();
  }, []);

  const runDiagnosisOnFile = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setScanStage('scanning');
    setDiagnosis(null);
    setDisplayConfidence(0);

    try {
      setTimeout(() => setScanStage('detecting'), 600);

      let data: any = null;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${BACKEND_URL}/predict`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          data = await response.json();
          setBackendOnline(true);
        } else {
          throw new Error('Backend HTTP error');
        }
      } catch (backendErr) {
        console.warn('Backend unavailable, falling back to In-Browser Edge AI:', backendErr);
        setBackendOnline(false);
        data = await runInBrowserOfflineInference(file);
      }

      const classKey = data.raw_class || data.disease;
      const diseaseInfo = getCropDiseaseInfo(classKey);

      let result: DiagnosisResult;

      if (diseaseInfo) {
        result = {
          plantName: diseaseInfo.plantName,
          diseaseName: diseaseInfo.diseaseName,
          scientificName: diseaseInfo.scientificName,
          healthStatus: diseaseInfo.isHealthy ? 'Healthy' : 'Diseased',
          overallDiagnosis: diseaseInfo.isHealthy
            ? 'The plant foliage exhibits optimal cellular chlorophyll and cool thermal signature.'
            : `Thermal heatmap highlights active pathogen damage for ${diseaseInfo.diseaseName}.`,
          severityScore: diseaseInfo.severity === 'High' ? 8 : diseaseInfo.severity === 'Medium' ? 5 : 2,
          treatment: diseaseInfo.treatment,
          recommendations: diseaseInfo.recommendations,
          preventiveMeasures: diseaseInfo.preventiveMeasures,
          rawConfidence: data.confidence,
          rawClass: classKey,
          topPredictions: data.top_predictions || [],
          thermalIronbow: data.thermal_ironbow || data.gradcam_heatmap,
          thermalJet: data.thermal_jet,
          thermalInferno: data.thermal_inferno,
          lesionCount: data.lesion_count ?? 0,
          infectedAreaPct: data.infected_area_pct ?? 0.0,
          severityStage: data.severity_stage ?? (diseaseInfo.isHealthy ? 'Stage 0 (Healthy)' : 'Stage 2 (Moderate Spread)'),
          lesionSpots: data.lesion_spots || data.lesion_boxes || [],
          isOfflineEdge: data.is_offline_edge || false,
          diseases: !diseaseInfo.isHealthy ? [{
            name: diseaseInfo.diseaseName,
            confidence: `${(data.confidence * 100).toFixed(1)}%`,
            description: 'Detected using PyTorch MobileNetV3 with Thermal Pathology Mapping.'
          }] : [],
        };
      } else {
        let plantName = 'Unknown Plant';
        let diseasePart = 'Unknown Disease';
        const isHealthy = data.disease.toLowerCase().includes('healthy') || (data.issue && data.issue.toLowerCase().includes('none detected'));

        if (data.disease.includes(' - ')) {
          const parts = data.disease.split(' - ');
          plantName = parts[0];
          diseasePart = parts[1];
        } else {
          plantName = data.disease.replace(/_+/g, ' ').trim();
          diseasePart = isHealthy ? 'Healthy' : data.issue || data.disease;
        }

        result = {
          plantName,
          diseaseName: diseasePart,
          healthStatus: isHealthy ? 'Healthy' : 'Diseased',
          overallDiagnosis: isHealthy ? 'The plant appears healthy with normal cool foliage.' : `High likelihood of ${diseasePart}.`,
          severityScore: data.severity === 'High' ? 8 : data.severity === 'Medium' ? 5 : 2,
          recommendations: [data.recommendation || 'Consult local agricultural extension.', 'Monitor crop daily for changes.'],
          preventiveMeasures: ['Ensure proper spacing for air circulation.', 'Avoid overhead watering.'],
          rawConfidence: data.confidence,
          rawClass: classKey,
          topPredictions: data.top_predictions || [],
          thermalIronbow: data.thermal_ironbow || data.gradcam_heatmap,
          thermalJet: data.thermal_jet,
          thermalInferno: data.thermal_inferno,
          lesionCount: data.lesion_count ?? 0,
          infectedAreaPct: data.infected_area_pct ?? 0.0,
          severityStage: data.severity_stage ?? (isHealthy ? 'Stage 0 (Healthy)' : 'Stage 2 (Moderate Spread)'),
          lesionSpots: data.lesion_spots || data.lesion_boxes || [],
          isOfflineEdge: data.is_offline_edge || false,
          diseases: !isHealthy ? [{
            name: diseasePart,
            confidence: `${(data.confidence * 100).toFixed(1)}%`,
            description: 'Detected using PyTorch MobileNetV3 with Thermal Pathology Mapping.'
          }] : [],
        };
      }

      setDiagnosis(result);
      setScanStage('result');

      const targetConfidence = Math.round((data.confidence || 0.96) * 100);
      let current = 0;
      const timer = setInterval(() => {
        current += 4;
        if (current >= targetConfidence) {
          setDisplayConfidence(targetConfidence);
          clearInterval(timer);
        } else {
          setDisplayConfidence(current);
        }
      }, 20);

      toast({
        title: result.isOfflineEdge ? 'Edge AI Thermal Scan (Offline) 📴' : 'Thermal Heatmap Scan Complete! 🔥',
        description: `Identified ${result.plantName} with ${(data.confidence * 100).toFixed(1)}% confidence.`,
      });

      // Queue offline disease report if in remote field mode
      if (result.isOfflineEdge || !navigator.onLine) {
        try {
          await queueDiseaseReportOffline({
            plantName: result.plantName || 'Crop Leaf',
            diseaseName: result.diseaseName || 'Scanned Issue',
            severity: result.severityScore ? (result.severityScore >= 7 ? 'High' : 'Medium') : 'Medium',
            confidence: data.confidence || 0.95,
            lesionCount: result.lesionCount || 0,
            infectedAreaPct: result.infectedAreaPct || 0,
            recommendation: result.recommendations?.[0] || 'Monitor crop daily.',
            imagePreview: preview || undefined,
          });
        } catch (queueErr) {
          console.warn('Could not queue disease report offline:', queueErr);
        }
      }
    } catch (err: unknown) {
      console.error('Diagnosis error:', err);
      setScanStage('upload');
      toast({
        title: 'Diagnosis Failed',
        description: err instanceof Error ? err.message : 'Unknown error during analysis.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  // Handle sample trigger
  useEffect(() => {
    if (sampleImageTrigger) {
      setSelectedFile(sampleImageTrigger.file);
      setPreview(sampleImageTrigger.preview);
      runDiagnosisOnFile(sampleImageTrigger.file);
    }
  }, [sampleImageTrigger, runDiagnosisOnFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image file.', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreview(dataUrl);
      setSelectedFile(file);
      setDiagnosis(null);
      setScanStage('upload');
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
    setDiagnosis(null);
    setDescription('');
    setScanStage('upload');
    stopAudio();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLiveCapture = (file: File, previewUrl: string) => {
    setSelectedFile(file);
    setPreview(previewUrl);
    runDiagnosisOnFile(file);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      toast({ title: 'Audio Unsupported', description: 'Speech synthesis is not supported on this browser.', variant: 'destructive' });
      return;
    }

    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    if (!diagnosis) return;

    const plant = diagnosis.plantName || 'Crop';
    const disease = diagnosis.diseases?.[0]?.name || (diagnosis.healthStatus === 'Healthy' ? 'Healthy plant' : 'Infection detected');
    const chemical = diagnosis.treatment?.chemicalName || '';
    const dosage = diagnosis.treatment?.dosage || '';
    const recs = (diagnosis.recommendations || []).slice(0, 2).join('. ');

    let speechText = '';

    if (speechLanguage === 'hi-IN') {
      speechText = `पौधे का नाम: ${plant}. रोग निदान: ${disease}. स्थिति: ${diagnosis.healthStatus === 'Healthy' ? 'स्वस्थ' : 'संक्रमित'}. अनुशंसित दवा: ${chemical}. खुराक: ${dosage}. उपचार: ${recs}`;
    } else if (speechLanguage === 'te-IN') {
      speechText = `మొక్క: ${plant}. వ్యాధి: ${disease}. పరిస్థితి: ${diagnosis.healthStatus === 'Healthy' ? 'ఆరోగ్యకరమైనది' : 'వ్యాధి సోకింది'}. మందు: ${chemical}. మోతాదు: ${dosage}. నివారణ: ${recs}`;
    } else if (speechLanguage === 'ta-IN') {
      speechText = `பயிர்: ${plant}. நோய் கண்டறிதல்: ${disease}. பரிந்துரைக்கப்பட்ட மருந்து: ${chemical}. அளவு: ${dosage}. சிகிச்சை: ${recs}`;
    } else {
      speechText = `Crop diagnosis result. Plant: ${plant}. Condition: ${disease}. Status: ${diagnosis.healthStatus}. Treatment: ${chemical}. Dosage: ${dosage}. Recommendations: ${recs}`;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = speechLanguage;
    utterance.rate = 0.92;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const prescriptionData: PrescriptionData | null = diagnosis ? {
    plantName: diagnosis.plantName || 'Crop',
    diseaseName: diagnosis.diseaseName || (diagnosis.healthStatus === 'Healthy' ? 'Healthy Foliage' : 'Unspecified Condition'),
    scientificName: diagnosis.scientificName,
    healthStatus: diagnosis.healthStatus || 'Diseased',
    severity: diagnosis.severityScore && diagnosis.severityScore > 6 ? 'High' : (diagnosis.severityScore && diagnosis.severityScore > 3 ? 'Medium' : 'Low'),
    confidence: diagnosis.diseases?.[0]?.confidence || `${((diagnosis.rawConfidence || 0.95) * 100).toFixed(1)}%`,
    treatment: diagnosis.treatment,
    recommendations: diagnosis.recommendations || ['Follow standard organic fungicide spray.'],
    preventiveMeasures: diagnosis.preventiveMeasures || ['Ensure proper soil aeration and canopy spacing.'],
    imagePreview: preview,
    lesionCount: diagnosis.lesionCount,
    infectedAreaPct: diagnosis.infectedAreaPct,
    severityStage: diagnosis.severityStage,
    fieldName: fieldName || 'Main Field Block',
  } : null;

  // Active Thermal Layer Source
  const getActiveThermalSource = () => {
    if (!diagnosis) return preview;
    if (thermalPalette === 'flir') return diagnosis.thermalIronbow;
    if (thermalPalette === 'jet') return diagnosis.thermalJet || diagnosis.thermalIronbow;
    if (thermalPalette === 'inferno') return diagnosis.thermalInferno || diagnosis.thermalIronbow;
    return diagnosis.thermalIronbow || preview;
  };

  return (
    <>
      <div className="p-6 rounded-3xl bg-[#0c1422]/90 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl space-y-4">
        {/* Card Header with Status & Stage Flow Indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-orange-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Thermometer className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                Foliage & Thermal Heat Diagnostic Studio
                {backendOnline === false ? (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/40 text-[10px] gap-1">
                    <WifiOff className="w-3 h-3" /> Offline Edge
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/40 text-[10px] gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" /> Thermal AI Online
                  </Badge>
                )}
              </h3>
            </div>
          </div>

          {/* Stage Flow Indicator */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-black/40 px-3 py-1 rounded-full border border-white/10">
            <span className={scanStage === 'upload' ? 'text-emerald-400 font-extrabold' : 'text-gray-400'}>UPLOAD</span>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className={scanStage === 'scanning' ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-gray-400'}>SCAN</span>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className={scanStage === 'detecting' ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-gray-400'}>THERMAL AI</span>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className={scanStage === 'result' ? 'text-emerald-400 font-extrabold' : 'text-gray-400'}>DIAGNOSIS</span>
          </div>
        </div>

        {/* Upload / Live Camera Buttons */}
        {!preview ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 min-h-[140px] group shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors group-hover:scale-110 duration-200">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Upload Foliage Photo</p>
                <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP up to 20MB</p>
              </div>
            </div>

            <div
              onClick={() => setIsScannerOpen(true)}
              className="p-6 rounded-2xl border border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/35 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 min-h-[140px] group shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse group-hover:scale-110 duration-200">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400">Open Live Scanner</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Real-time camera foliar inspection</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* SIDE-BY-SIDE DUAL VIEW: Left Original Leaf + Right Thermal Heatmap (NO bounding boxes) */}
            {layoutMode === 'side-by-side' && diagnosis ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 relative">
                {/* Left Panel: Clean Original Leaf */}
                <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/80 aspect-video flex items-center justify-center group select-none">
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-xl border border-white/10">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Original Leaf</span>
                  </div>

                  <img src={preview} alt="Original Leaf" className="w-full h-full object-contain" />

                  {/* Interactive OpenCV Lesion Component SVG Overlay */}
                  {diagnosis && diagnosis.lesionSpots && diagnosis.lesionSpots.length > 0 && (
                    <LesionSvgOverlay spots={diagnosis.lesionSpots} enabled={showLesionOverlay} />
                  )}
                </div>

                {/* Right Panel: Thermal Heatmap (Shows Where It Hurts) */}
                <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-black/80 aspect-video flex items-center justify-center group select-none">
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-xl border border-amber-500/30">
                    <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Thermal Heatmap</span>
                  </div>

                  <img
                    src={getActiveThermalSource() || preview}
                    alt="Thermal Heatmap"
                    className="w-full h-full object-contain"
                  />

                  {/* Clear Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2.5 right-2.5 rounded-full shadow-lg bg-black/80 hover:bg-destructive h-8 w-8 transition-transform hover:scale-110 z-30 border border-white/10"
                    onClick={handleClear}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Single Overlay View Mode */
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/70 aspect-video max-h-80 flex items-center justify-center group select-none">
                <img src={preview} alt="Original Leaf" className="w-full h-full object-contain" />

                {diagnosis && (
                  <div
                    className="absolute inset-0 transition-opacity duration-300 pointer-events-none flex items-center justify-center"
                    style={{ opacity: overlayOpacity }}
                  >
                    <img
                      src={getActiveThermalSource() || preview}
                      alt="Thermal Heatmap"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Interactive OpenCV Lesion Component SVG Overlay */}
                {diagnosis && diagnosis.lesionSpots && diagnosis.lesionSpots.length > 0 && (
                  <LesionSvgOverlay spots={diagnosis.lesionSpots} enabled={showLesionOverlay} />
                )}

                {/* Laser Scanning Animation */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(16,185,129,1)] animate-scan relative">
                      <span className="absolute top-1/2 left-[30%] -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(74,222,128,1)] animate-ping" />
                      <span className="absolute top-1/2 left-[70%] -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(74,222,128,1)]" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <span className="px-4 py-2 rounded-2xl bg-black/85 text-emerald-400 text-xs font-mono font-bold tracking-wider animate-pulse border border-emerald-500/40 shadow-2xl">
                        {scanStage === 'scanning' ? '🌿 EXTRACTING FOLIAR FEATURES...' : '🔥 GENERATING THERMAL HEATMAP...'}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2.5 right-2.5 rounded-full shadow-lg bg-black/80 hover:bg-destructive h-8 w-8 transition-transform hover:scale-110 z-30 border border-white/10"
                  onClick={handleClear}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Thermal Palette & Display Mode Toolbar (when diagnosed) */}
            {diagnosis && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* View Mode: Side-by-Side vs Overlay */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-medium flex items-center gap-1 text-[11px]">
                      <Columns className="w-3.5 h-3.5 text-emerald-400" /> View:
                    </span>
                    <div className="flex bg-black/60 p-0.5 rounded-xl border border-white/10">
                      <button
                        onClick={() => setLayoutMode('side-by-side')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          layoutMode === 'side-by-side'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        👥 Side-by-Side
                      </button>
                      <button
                        onClick={() => setLayoutMode('overlay')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          layoutMode === 'overlay'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        🔲 Overlay
                      </button>
                    </div>
                  </div>

                  {/* Interactive OpenCV Lesion Spots Toggle */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowLesionOverlay(!showLesionOverlay)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border flex items-center gap-1.5 ${
                        showLesionOverlay
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-black/60 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Interactive Lesions
                      {diagnosis.lesionSpots && diagnosis.lesionSpots.length > 0 && (
                        <span className="bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                          {diagnosis.lesionSpots.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Thermal Colormap Switcher */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-medium flex items-center gap-1 text-[11px]">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> Palette:
                    </span>
                    <div className="flex bg-black/60 p-0.5 rounded-xl border border-white/10">
                      <button
                        onClick={() => setThermalPalette('flir')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          thermalPalette === 'flir'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        🔥 FLIR Ironbow
                      </button>
                      <button
                        onClick={() => setThermalPalette('jet')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          thermalPalette === 'jet'
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-black shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        🌈 Turbo / JET
                      </button>
                      <button
                        onClick={() => setThermalPalette('inferno')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          thermalPalette === 'inferno'
                            ? 'bg-gradient-to-r from-rose-500 to-amber-400 text-black shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        ⚡ Hot Metal
                      </button>
                    </div>
                  </div>

                  {/* Overlay Opacity Slider */}
                  {layoutMode === 'overlay' && (
                    <div className="flex items-center gap-2 w-full sm:w-36">
                      <span className="text-[10px] text-gray-400">Alpha:</span>
                      <Slider
                        value={[overlayOpacity * 100]}
                        onValueChange={(val) => setOverlayOpacity(val[0] / 100)}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        {Math.round(overlayOpacity * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Thermal Color Legend */}
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <div className="h-2 rounded-full overflow-hidden flex bg-black/60 shadow-inner">
                    <div className="flex-1 bg-indigo-900" />
                    <div className="flex-1 bg-purple-700" />
                    <div className="flex-1 bg-rose-600" />
                    <div className="flex-1 bg-amber-500" />
                    <div className="flex-1 bg-yellow-300" />
                    <div className="flex-1 bg-white" />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-gray-400">
                    <span className="text-blue-400 font-bold">❄️ Blue: Cool/Healthy</span>
                    <span className="text-amber-400 font-bold">⚡ Yellow/Amber: Warning Zone</span>
                    <span className="text-red-400 font-bold">🔥 Red/Hot: Diseased Spot</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

        {/* Symptoms Textarea */}
        {!diagnosis && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <Label className="text-[11px] text-gray-400">Farmer Notes / Symptoms (Optional)</Label>
              <span className="text-[10px] text-gray-400">{description.length}/500</span>
            </div>
            <Textarea
              placeholder="e.g. Concentric brown rings noticed on lower foliage after recent rains..."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              rows={2}
              className="text-xs bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500 placeholder:text-gray-500"
            />
          </div>
        )}

        {/* Run AI Disease Diagnosis Button */}
        {!diagnosis && (
          <Button
            onClick={() => selectedFile && runDiagnosisOnFile(selectedFile)}
            disabled={!selectedFile || isAnalyzing}
            className="w-full font-bold text-xs py-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.01]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating Thermal Heatmap & Pathology Diagnosis...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Run AI Diagnosis & Thermal Heatmap
              </>
            )}
          </Button>
        )}

        {/* Diagnosis Results Section */}
        {diagnosis && (
          <div className="space-y-4 pt-3 border-t border-white/10 animate-in fade-in-50 duration-500">
            {/* Primary Result Banner */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                diagnosis.healthStatus === 'Healthy'
                  ? 'bg-emerald-950/25 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                  : 'bg-orange-950/25 border-orange-500/40 shadow-[0_0_25px_rgba(249,115,22,0.15)]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Plant Species
                  </span>
                  <h4 className="text-lg font-bold text-white font-display mt-0.5">{diagnosis.plantName}</h4>
                </div>

                <div className="flex items-center gap-1.5">
                  {diagnosis.isOfflineEdge && (
                    <Badge variant="outline" className="text-amber-400 border-amber-400/40 text-[10px]">
                      Offline Edge
                    </Badge>
                  )}
                  <Badge
                    variant={diagnosis.healthStatus === 'Healthy' ? 'default' : 'destructive'}
                    className="text-xs font-bold px-3 py-1 shadow-md"
                  >
                    {diagnosis.healthStatus}
                  </Badge>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle
                    className={`w-3.5 h-3.5 ${
                      diagnosis.healthStatus === 'Healthy' ? 'text-emerald-400' : 'text-orange-400'
                    }`}
                  />
                  Primary Pathology Diagnosis
                </span>
                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-base font-bold mt-0.5 ${
                      diagnosis.healthStatus === 'Healthy' ? 'text-emerald-400' : 'text-orange-400'
                    }`}
                  >
                    {diagnosis.diseases && diagnosis.diseases.length > 0
                      ? diagnosis.diseases[0].name
                      : 'Healthy Foliage / No Pathogen Detected'}
                  </p>
                  {diagnosis.scientificName && (
                    <span className="text-xs italic text-gray-400">({diagnosis.scientificName})</span>
                  )}
                </div>
              </div>

              {/* Thermal Heat & Lesion Quantification KPI Row */}
              {diagnosis.healthStatus !== 'Healthy' && (
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Lesion Count</span>
                    <span className="text-sm font-bold text-red-400 font-mono">
                      {diagnosis.lesionCount || 0} spots
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Infected Area</span>
                    <span className="text-sm font-bold text-orange-400 font-mono">
                      {diagnosis.infectedAreaPct || 0}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Severity Tier</span>
                    <span className="text-xs font-bold text-yellow-400">
                      {diagnosis.severityStage || 'Stage 2'}
                    </span>
                  </div>
                </div>
              )}

              {/* Multilingual Voice Readout Bar */}
              <div className="flex items-center justify-between gap-2 pt-2 mt-3 border-t border-white/10 bg-black/50 p-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isPlayingAudio ? 'destructive' : 'outline'}
                    className="gap-1.5 text-xs font-semibold h-8 border-white/20"
                    onClick={handleToggleVoice}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 animate-pulse" /> Stop Voice
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Listen Audio
                      </>
                    )}
                  </Button>

                  {isPlayingAudio && (
                    <div className="flex items-center gap-1 px-2">
                      <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.4s' }} />
                      <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                      <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.3s' }} />
                      <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.5s' }} />
                    </div>
                  )}

                  <Select value={speechLanguage} onValueChange={(val: any) => setSpeechLanguage(val)}>
                    <SelectTrigger className="w-[125px] h-8 text-xs bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0c1420] border-white/10 text-white">
                      <SelectItem value="en-IN">🇬🇧 English</SelectItem>
                      <SelectItem value="hi-IN">🇮🇳 हिन्दी</SelectItem>
                      <SelectItem value="te-IN">🌾 తెలుగు</SelectItem>
                      <SelectItem value="ta-IN">🌴 தமிழ்</SelectItem>
                      <SelectItem value="kn-IN">🌿 ಕನ್ನಡ</SelectItem>
                      <SelectItem value="mr-IN">🏔️ मराठी</SelectItem>
                      <SelectItem value="bn-IN">🌊 বাংলা</SelectItem>
                      <SelectItem value="es-ES">🇪🇸 Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-[10px] text-gray-400 hidden sm:inline font-mono">
                  🔊 Voice Assistant
                </span>
              </div>
            </div>

            {/* Treatment Protocols & Tank Dosage Calculator */}
            {diagnosis.treatment && diagnosis.healthStatus !== 'Healthy' && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Pill className="w-4 h-4" /> Recommended Treatment Protocols
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-emerald-500/30 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-400">Chemical Control</span>
                    <p className="text-xs font-bold text-white">{diagnosis.treatment.chemicalName}</p>
                    <p className="text-[11px] text-gray-300">
                      <strong className="text-emerald-400">Dosage:</strong> {diagnosis.treatment.dosage}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      <strong>Interval:</strong> {diagnosis.treatment.sprayInterval}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-green-500/30 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-green-400">Organic Alternative</span>
                    <p className="text-xs font-bold text-white">{diagnosis.treatment.organicOption}</p>
                    <p className="text-[11px] text-gray-300">
                      <strong className="text-green-400">Dosage:</strong> {diagnosis.treatment.organicDosage}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      <strong>Action:</strong> {diagnosis.treatment.immediateAction}
                    </p>
                  </div>
                </div>

                {/* Tank Dosage Calculator */}
                <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Tank Spray Dilution Calculator
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[15, 100, 200].map((liters) => (
                        <button
                          key={liters}
                          onClick={() => setTankLiters(liters)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                            tankLiters === liters
                              ? 'bg-emerald-500 text-black'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {liters}L
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-black/40 text-xs text-gray-200 flex items-center justify-between">
                    <span>
                      Mix for <strong className="text-emerald-400">{tankLiters} Liters</strong> water:
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ~{(tankLiters * 2.5).toFixed(1)} grams / ml
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Top-5 Candidate Probabilities */}
            {diagnosis.topPredictions && diagnosis.topPredictions.length > 0 && (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-400" /> Softmax Probabilities
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    Primary: {displayConfidence}%
                  </span>
                </div>

                <div className="space-y-2">
                  {diagnosis.topPredictions.slice(0, 4).map((cand, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="truncate max-w-[200px] text-gray-300">
                          {idx + 1}. {cand.plant} {cand.issue}
                        </span>
                        <span className={idx === 0 ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
                          {idx === 0 ? `${displayConfidence}%` : `${cand.percentage}%`}
                        </span>
                      </div>
                      <Progress
                        value={idx === 0 ? displayConfidence : cand.percentage}
                        className="h-1.5 bg-white/10 transition-all duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* Step 5: Direct Link to Google-Style Ag Search Engine with pre-populated exact query */}
              <Link
                to={`/search?q=${encodeURIComponent(`${diagnosis.plantName.toLowerCase()} "${diagnosis.diseaseName.toLowerCase()}"`)}`}
                className="w-full block"
              >
                <Button
                  variant="outline"
                  className="w-full gap-2 text-xs border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold h-9 rounded-xl shadow-sm"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  Search Ag Manuals: {diagnosis.plantName.toLowerCase()} "{diagnosis.diseaseName.toLowerCase()}"
                </Button>
              </Link>

              <div className="flex flex-wrap gap-2">
                <Button
                  className="flex-1 gap-2 font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg"
                  onClick={() => setIsPrescriptionOpen(true)}
                >
                  <FileText className="w-4 h-4" /> Download Official Agronomist Report (PDF)
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 text-xs border-green-500/40 text-green-400 hover:bg-green-500/10"
                  onClick={() => setIsPrescriptionOpen(true)}
                >
                  <Share2 className="w-4 h-4" /> WhatsApp
                </Button>

                <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white" onClick={handleClear}>
                  Scan Another
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        data={prescriptionData}
      />

      {/* Live Camera Scanner Modal */}
      <LiveCameraScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onCapture={handleLiveCapture} />
    </>
  );
}
