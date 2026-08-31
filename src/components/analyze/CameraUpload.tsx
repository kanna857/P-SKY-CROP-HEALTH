import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, X, Loader2, AlertTriangle, CheckCircle, Leaf, Droplets, Wifi, WifiOff, Volume2, VolumeX, FileText, Share2, Sparkles, Video, BarChart2, Pill, Clock, AlertCircle, Scan, Calculator, Gauge, Flame, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getCropDiseaseInfo, TreatmentProtocol } from '@/lib/cropDiseaseData';
import { PrescriptionModal, PrescriptionData } from './PrescriptionModal';
import { LiveCameraScanner } from './LiveCameraScanner';

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
}

interface CameraUploadProps {
  cropType?: string;
  fieldName?: string;
  sampleImageTrigger?: { file: File; preview: string } | null;
}

const BACKEND_URL = 'http://localhost:8000';

type ScanStage = 'upload' | 'scanning' | 'detecting' | 'result';

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

  // Dosage Calculator State
  const [tankLiters, setTankLiters] = useState<number>(15);

  // Voice Readout States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<'en-IN' | 'hi-IN' | 'te-IN' | 'ta-IN'>('en-IN');

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
      // Stage 1 -> Stage 2 (Detecting)
      setTimeout(() => setScanStage('detecting'), 600);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
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
            ? 'The plant appears healthy.'
            : `High likelihood of ${diseaseInfo.diseaseName}.`,
          severityScore: diseaseInfo.severity === 'High' ? 8 : (diseaseInfo.severity === 'Medium' ? 5 : 2),
          treatment: diseaseInfo.treatment,
          recommendations: diseaseInfo.recommendations,
          preventiveMeasures: diseaseInfo.preventiveMeasures,
          rawConfidence: data.confidence,
          rawClass: classKey,
          topPredictions: data.top_predictions || [],
          diseases: !diseaseInfo.isHealthy ? [{
            name: diseaseInfo.diseaseName,
            confidence: `${(data.confidence * 100).toFixed(1)}%`,
            description: 'Detected using custom PyTorch MobileNetV3 model.'
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
          plantName: plantName,
          diseaseName: diseasePart,
          healthStatus: isHealthy ? 'Healthy' : 'Diseased',
          overallDiagnosis: isHealthy ? 'The plant appears healthy.' : `High likelihood of ${diseasePart}.`,
          severityScore: data.severity === 'High' ? 8 : (data.severity === 'Medium' ? 5 : 2),
          recommendations: [data.recommendation || 'Consult local agricultural extension.', 'Monitor crop daily for changes.'],
          preventiveMeasures: ['Ensure proper spacing for air circulation.', 'Avoid overhead watering.'],
          rawConfidence: data.confidence,
          rawClass: classKey,
          topPredictions: data.top_predictions || [],
          diseases: !isHealthy ? [{
            name: diseasePart,
            confidence: `${(data.confidence * 100).toFixed(1)}%`,
            description: 'Detected using custom PyTorch MobileNetV3 model.'
          }] : [],
        };
      }

      setDiagnosis(result);
      setScanStage('result');

      // Smooth count-up animation for confidence score
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
        title: 'Diagnosis Complete! 🌿',
        description: `Identified ${result.plantName} with ${(data.confidence * 100).toFixed(1)}% confidence.`,
      });
    } catch (err: unknown) {
      console.error('Diagnosis error:', err);
      setScanStage('upload');
      const isNetworkError = err instanceof TypeError && err.message.includes('fetch');
      const errorMessage = isNetworkError
        ? 'Cannot connect to AI backend. Ensure server is running on port 8000.'
        : (err instanceof Error ? err.message : 'Unknown error. Please try again.');
      setBackendOnline(false);
      toast({ title: 'Diagnosis Failed', description: errorMessage, variant: 'destructive' });
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
    utterance.rate = 0.95;

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
    preventiveMeasures: diagnosis.preventiveMeasures || ['Ensure soil drainage.'],
    imagePreview: preview,
    fieldName: fieldName || 'Main Field Block',
  } : null;

  return (
    <>
      <div className="p-6 rounded-3xl bg-[#0c1420]/85 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
        {/* Card Header with Status & Stage Flow Indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              AI Leaf Disease Scanner
            </h3>
          </div>

          {/* Signature Stage Flow: UPLOAD -> SCANNING -> AI DETECTING -> RESULT */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className={scanStage === 'upload' ? 'text-emerald-400 font-extrabold' : 'text-gray-400'}>UPLOAD</span>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <span className={scanStage === 'scanning' ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-gray-400'}>SCAN</span>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <span className={scanStage === 'detecting' ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-gray-400'}>AI DETECT</span>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <span className={scanStage === 'result' ? 'text-emerald-400 font-extrabold' : 'text-gray-400'}>RESULT</span>
          </div>
        </div>

        {/* Dual Upload & Live Camera Boxes */}
        {!preview ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* Box 1: Upload Leaf Photo */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 min-h-[140px] group shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors group-hover:scale-110 duration-200">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Upload Leaf Photo</p>
                <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP up to 20MB</p>
              </div>
            </div>

            {/* Box 2: Open Live Camera */}
            <div
              onClick={() => setIsScannerOpen(true)}
              className="p-6 rounded-2xl border border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/35 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 min-h-[140px] group shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse group-hover:scale-110 duration-200">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400">Open Live Camera</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Scan field leaves with phone / webcam</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
            <img src={preview} alt="Crop Scan" className="w-full h-56 object-cover" />

            {/* Laser Scanning Line with Attracted Spore Particles */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(16,185,129,1)] animate-scan relative">
                  {/* Attracted Spore Glow Beads along the laser line */}
                  <span className="absolute top-1/2 left-[30%] -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(74,222,128,1)] animate-ping" />
                  <span className="absolute top-1/2 left-[70%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(74,222,128,1)]" />
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-black/80 text-emerald-400 text-xs font-mono font-bold tracking-wider animate-pulse border border-emerald-500/40 shadow-xl">
                    {scanStage === 'scanning' ? '🌿 EXTRACTING FOLIAR FEATURES...' : '🔬 NEURAL PATHOLOGY MATCHING...'}
                  </span>
                </div>
              </div>
            )}

            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2.5 right-2.5 rounded-full shadow-lg bg-black/70 hover:bg-destructive h-8 w-8 transition-transform hover:scale-110"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Symptoms Textarea */}
        {!diagnosis && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <Label className="text-[11px] text-gray-400">Farmer Notes / Symptoms (Optional)</Label>
              <span className="text-[10px] text-gray-400">{description.length}/500</span>
            </div>
            <Textarea
              placeholder="e.g. Yellow spots appeared 3 days ago, lower canopy leaves wilting..."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              rows={2}
              className="text-xs bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-emerald-500 placeholder:text-gray-400"
            />
          </div>
        )}

        {/* Run AI Disease Diagnosis Button */}
        {!diagnosis && (
          <Button
            onClick={() => selectedFile && runDiagnosisOnFile(selectedFile)}
            disabled={!selectedFile || isAnalyzing}
            className="w-full font-bold text-xs py-6 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.01]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Analyzing with Deep Convolutional Neural Network...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Run AI Disease Diagnosis
              </>
            )}
          </Button>
        )}

        {/* Diagnosis Results Section with Healthy/Diseased Glow */}
        {diagnosis && (
          <div className="space-y-4 pt-3 border-t border-white/10 animate-in fade-in-50 duration-500">
            {/* Primary Result Banner */}
            <div className={`p-4 rounded-2xl border transition-all ${
              diagnosis.healthStatus === 'Healthy'
                ? 'bg-emerald-950/20 border-emerald-500/40 animate-healthy-pulse'
                : 'bg-orange-950/20 border-orange-500/40 animate-warning-pulse'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400 animate-leaf-sway" /> Plant Species
                  </span>
                  <h4 className="text-lg font-bold text-white font-display mt-0.5">{diagnosis.plantName}</h4>
                </div>

                <Badge
                  variant={diagnosis.healthStatus === 'Healthy' ? 'default' : 'destructive'}
                  className="text-xs font-bold px-3 py-1 shadow-md"
                >
                  {diagnosis.healthStatus}
                </Badge>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className={`w-3.5 h-3.5 ${diagnosis.healthStatus === 'Healthy' ? 'text-emerald-400' : 'text-orange-400'}`} />
                  Primary Diagnosis
                </span>
                <div className="flex items-baseline gap-2">
                  <p className={`text-base font-bold mt-0.5 ${diagnosis.healthStatus === 'Healthy' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {diagnosis.diseases && diagnosis.diseases.length > 0 ? diagnosis.diseases[0].name : 'Healthy Foliage / No Pathogen'}
                  </p>
                  {diagnosis.scientificName && (
                    <span className="text-xs italic text-gray-400">({diagnosis.scientificName})</span>
                  )}
                </div>
              </div>

              {/* Multilingual Voice Readout Bar with Sound Wave Equalizer */}
              <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-white/10 bg-black/40 p-2.5 rounded-xl">
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

                  {/* Equalizer Sound Waves Animation */}
                  {isPlayingAudio && (
                    <div className="flex items-center gap-1 px-2">
                      <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.4s' }} />
                      <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                      <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.3s' }} />
                      <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.5s' }} />
                    </div>
                  )}

                  <Select value={speechLanguage} onValueChange={(val: any) => setSpeechLanguage(val)}>
                    <SelectTrigger className="w-[110px] h-8 text-xs bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0c1420] border-white/10 text-white">
                      <SelectItem value="en-IN">🇬🇧 English</SelectItem>
                      <SelectItem value="hi-IN">🇮🇳 हिन्दी</SelectItem>
                      <SelectItem value="te-IN">🇮🇳 తెలుగు</SelectItem>
                      <SelectItem value="ta-IN">🇮🇳 தமிழ்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-[10px] text-gray-400 hidden sm:inline font-mono">
                  🔊 Voice Readout
                </span>
              </div>
            </div>

            {/* Exact Treatment Protocols & Tank Dosage Calculator */}
            {diagnosis.treatment && diagnosis.healthStatus !== 'Healthy' && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Pill className="w-4 h-4" /> Recommended Treatment Protocols
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-emerald-500/30 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-400">Chemical Control</span>
                    <p className="text-xs font-bold text-white">{diagnosis.treatment.chemicalName}</p>
                    <p className="text-[11px] text-gray-300"><strong className="text-emerald-400">Dosage:</strong> {diagnosis.treatment.dosage}</p>
                  </div>

                  <div className="bg-white/5 border border-green-500/30 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-green-400">Organic Alternative</span>
                    <p className="text-xs font-bold text-white">{diagnosis.treatment.organicOption}</p>
                    <p className="text-[11px] text-gray-300"><strong className="text-green-400">Dosage:</strong> {diagnosis.treatment.organicDosage}</p>
                  </div>
                </div>

                {/* Interactive Knapsack Tank Dosage Calculator */}
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

            {/* Top-5 Candidate Breakdown with Animated Counting Progress Bars */}
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
                      <Progress value={idx === 0 ? displayConfidence : cand.percentage} className="h-1.5 bg-white/10 transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                className="flex-1 gap-2 font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg"
                onClick={() => setIsPrescriptionOpen(true)}
              >
                <FileText className="w-4 h-4" /> Download Prescription
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
        )}
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        data={prescriptionData}
      />

      {/* Live Camera Scanner Modal */}
      <LiveCameraScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onCapture={handleLiveCapture}
      />
    </>
  );
}
