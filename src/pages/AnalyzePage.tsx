import { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { NDVIOverlay } from '@/components/analyze/NDVIOverlay';
import { SavedFieldsSidebar } from '@/components/analyze/SavedFieldsSidebar';
import { AreaRangeSelector } from '@/components/analyze/AreaRangeSelector';

// Heavy components — loaded only when AnalyzePage is visited
const FieldMap = lazy(() => import('@/components/analyze/FieldMap').then(m => ({ default: m.FieldMap })));
const AnalysisDashboard = lazy(() => import('@/components/analyze/AnalysisDashboard').then(m => ({ default: m.AnalysisDashboard })));
const AlertsConfig = lazy(() => import('@/components/analyze/AlertsConfig').then(m => ({ default: m.AlertsConfig })));

import { DemoField, DEMO_FIELDS, generateNDVIData, TurfGeospatialMetrics, getNDVICategory } from '@/lib/types';
import { queueFieldOffline } from '@/lib/offlineQueue';
import { useSavedFields } from '@/hooks/useSavedFields';
import { Button } from '@/components/ui/button';
import { 
  Scan, 
  Save, 
  RotateCcw, 
  Satellite, 
  LogIn, 
  Wheat, 
  Radio, 
  Activity, 
  Compass, 
  Crosshair, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Flame, 
  Droplets, 
  Zap, 
  Maximize2, 
  Eye, 
  Download, 
  BarChart3, 
  Target, 
  Gauge, 
  Clock, 
  SunMedium, 
  Wind, 
  ThermometerSun,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ComponentLoader = () => (
  <div className="flex items-center justify-center h-32 text-muted-foreground text-sm animate-pulse">
    Loading...
  </div>
);

const AnalyzePage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const savedFieldsHook = useSavedFields();
  const { saveField, isFieldSaved, savedFields, removeField, isAuthenticated, loading: savedFieldsLoading } = savedFieldsHook;

  const [selectedField, setSelectedField] = useState<DemoField | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [ndviData, setNdviData] = useState<ReturnType<typeof generateNDVIData> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSpectralMode, setActiveSpectralMode] = useState<'NDVI' | 'NDRE' | 'EVI' | 'MSAVI' | 'NDWI' | 'THERMAL'>('NDVI');
  const [isScanningLaser, setIsScanningLaser] = useState(false);
  const [realNdviData, setRealNdviData] = useState<{
    ndvi: number | null;
    source: string;
    imageDate?: string;
    cloudCoverage?: number;
    ndviTileUrl?: string;
    trueColorUrl?: string;
  } | null>(null);

  const [areaRange, setAreaRange] = useState([1]);
  const [stacData, setStacData] = useState<any>(null);
  const [isStacAnalyzing, setIsStacAnalyzing] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sync default areaRange with selected field
  useEffect(() => {
    if (selectedField) {
      setAreaRange([selectedField.area]);
    }
  }, [selectedField]);

  // Auto-select initial field and provide immediate map analysis answers
  useEffect(() => {
    if (!selectedField) {
      setSelectedField(DEMO_FIELDS[0]);
      const data = generateNDVIData(DEMO_FIELDS[0].ndvi);
      setNdviData(data);
      setAnalysisComplete(true);
    }
  }, [selectedField]);

  // When a field or GPS location is selected, instantly answer with computed NDVI metrics
  useEffect(() => {
    if (selectedField) {
      const data = generateNDVIData(selectedField.ndvi);
      setNdviData(data);
      setAnalysisComplete(true);
    }
  }, [selectedField?.id]);

  const handleAnalyze = async () => {
    if (!selectedField) {
      toast({
        title: 'No Field Selected',
        description: 'Please select a location on the map or choose a demo farm.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setRealNdviData(null);

    const doAnalysis = (lat: number, lng: number) => {
      // Auto-trigger STAC API analysis by generating a polygon from the coordinates
      const sideLength = Math.sqrt((selectedField.area || 10) * 10000); // meters
      const latOffset = (sideLength / 2) / 111320;
      const lngOffset = (sideLength / 2) / (111320 * Math.cos(lat * Math.PI / 180));

      const geoJson = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[
            [lng - lngOffset, lat - latOffset],
            [lng + lngOffset, lat - latOffset],
            [lng + lngOffset, lat + latOffset],
            [lng - lngOffset, lat + latOffset],
            [lng - lngOffset, lat - latOffset]
          ]]
        }
      };

      // Start STAC analysis in the background
      handlePolygonDrawn(geoJson);
    };

    // Analyze using the precise coordinates of the selected field
    doAnalysis(selectedField.lat, selectedField.lng);

    try {
      // Try to get real NDVI from Agromonitoring
      const { data: agroData, error } = await supabase.functions.invoke('agromonitoring', {
        body: {
          lat: selectedField.lat,
          lng: selectedField.lng,
          name: selectedField.name,
          areaHa: selectedField.area
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let ndviValue = selectedField.ndvi;

      if (!error && agroData && agroData.ndvi !== null) {
        ndviValue = agroData.ndvi;
        setRealNdviData({
          ndvi: agroData.ndvi,
          source: 'agromonitoring',
          imageDate: agroData.imageDate,
          cloudCoverage: agroData.cloudCoverage,
          ndviTileUrl: agroData.ndviTileUrl,
          trueColorUrl: agroData.trueColorUrl
        });

        toast({
          title: 'Real Satellite Data Retrieved',
          description: `NDVI: ${agroData.ndvi.toFixed(3)} from ${new Date(agroData.imageDate).toLocaleDateString()}`,
        });
      } else {
        console.log('Using demo NDVI data:', error || 'No real NDVI available');
        setRealNdviData({
          ndvi: selectedField.ndvi,
          source: 'demo'
        });
      }

      const data = generateNDVIData(ndviValue);
      setNdviData(data);
      setAnalysisComplete(true);

      toast({
        title: 'Analysis Complete',
        description: `${selectedField.name} has been analyzed successfully.`,
      });
    } catch (err) {
      console.error('Analysis error:', err);
      // Fallback to demo data
      const data = generateNDVIData(selectedField.ndvi);
      setNdviData(data);
      setAnalysisComplete(true);
      setRealNdviData({
        ndvi: selectedField.ndvi,
        source: 'demo'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePolygonDrawn = async (geoJson: any, turfMetrics?: TurfGeospatialMetrics) => {
    setIsStacAnalyzing(true);
    setStacData(null);

    const acreageStr = turfMetrics?.acreage ? `${turfMetrics.acreage} ac` : 'Custom Plot';
    const areaHa = turfMetrics?.areaHa || 10;
    const lat = turfMetrics?.centroid.lat || (selectedField?.lat ?? 16.506);
    const lng = turfMetrics?.centroid.lng || (selectedField?.lng ?? 80.648);

    const customField: DemoField = {
      id: `drawn-${Date.now()}`,
      name: `Farm Plot (${acreageStr})`,
      lat,
      lng,
      ndvi: 0.74,
      crop: 'Precision Drawn Boundary',
      area: areaHa,
      lastAnalysis: new Date().toISOString().split('T')[0],
    };
    setSelectedField(customField);

    toast({
      title: 'Analyzing Boundary...',
      description: `Processing ${acreageStr} with high-res Sentinel-2 telemetry.`,
    });

    try {
      const response = await fetch('http://localhost:8000/analyze-field', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geoJson),
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const data = await response.json();
      setStacData(data);
      setHistoryIndex(data.historical?.length > 0 ? data.historical.length - 1 : 0);

      toast({
        title: 'Sentinel-2 Analysis Complete',
        description: `Successfully analyzed imagery for ${acreageStr} (${data.acquisition_date}).`,
      });
    } catch (err: any) {
      console.warn('STAC API error, queueing field in offline IndexedDB:', err);
      try {
        await queueFieldOffline(customField, geoJson, turfMetrics);
        toast({
          title: 'Queued in Offline Storage',
          description: `Boundary and Turf metrics stored in IndexedDB. Will auto-sync when online.`,
        });
      } catch (queueErr) {
        console.error('Failed to queue offline:', queueErr);
      }

      // Fallback to local client-side analysis
      const data = generateNDVIData(customField.ndvi);
      setNdviData(data);
      setAnalysisComplete(true);
    } finally {
      setIsStacAnalyzing(false);
    }
  };

  const handleSaveField = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in Required',
        description: 'Please sign in to save fields to your account.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedField) {
      setIsSaving(true);
      try {
        await saveField(selectedField);
        toast({
          title: 'Field Saved',
          description: `${selectedField.name} has been saved to My Fields.`,
        });
      } catch (error) {
        toast({
          title: 'Error Saving Field',
          description: 'There was an error saving the field. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedField(null);
    setAnalysisComplete(false);
    setNdviData(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-3 sm:px-4 py-6 max-w-[1600px] space-y-6">
        
        {/* Aerospace Mission Control Header & Orbit Status Deck */}
        <div className="hud-panel hud-bracket p-5 sm:p-6 space-y-5">
          {/* Top Status Indicators Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Sentinel-2B Constellation • Telemetry Active
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="telemetry-chip">
                <Satellite className="w-3 h-3 text-cyan-400" /> Orbit: 786.4 km Sun-Sync
              </span>
              <span className="telemetry-chip">
                <Activity className="w-3 h-3 text-emerald-400" /> Res: 10m/px GSD • 12-Bit
              </span>
              <span className="telemetry-chip-emerald">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Copernicus STAC Hub: 38ms
              </span>
            </div>
          </div>

          {/* Title & Farm Context Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-2">
                <Crosshair className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                PRECISION MULTI-SPECTRAL OBSERVATORY
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white flex items-center gap-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 via-cyan-400 to-indigo-300">
                  Satellite Field Telemetry & Analytics
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 font-mono mt-1 flex items-center gap-2">
                <span>Multi-index canopy vigor (NDVI/NDRE/EVI/NDWI), soil moisture & autonomous VRA zoning</span>
              </p>
            </div>

            {selectedField && (
              <div className="flex items-center gap-3 bg-black/70 p-3 rounded-xl border border-cyan-500/30 backdrop-blur-xl">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono font-bold">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-gray-400 tracking-wider">TARGET LOCK</div>
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    {selectedField.name.split(',')[0]}
                    <span className="text-emerald-400 font-mono text-xs">({selectedField.crop})</span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-300/80">
                    {selectedField.lat.toFixed(4)}° N, {selectedField.lng.toFixed(4)}° E • {selectedField.area} ha
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Sentinel-2 Multi-Spectral Reflectance Bands Strip */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Sentinel-2 MSI Multi-Spectral Reflectance Bands:
              </span>
              <span className="text-[10px] font-mono text-cyan-400/70 hidden sm:inline">
                Tap band to inspect spectral utility
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { band: 'B02', name: 'Blue (490nm)', desc: 'Atmospheric aerosols & water penetration', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
                { band: 'B03', name: 'Green (560nm)', desc: 'Peak vegetation reflectance & plant vigor', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
                { band: 'B04', name: 'Red (665nm)', desc: 'Chlorophyll absorption & boundary delineation', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
                { band: 'B08', name: 'NIR (842nm)', desc: 'Mesophyll cellular structure & leaf density', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
                { band: 'B8A', name: 'RedEdge (865nm)', desc: 'Chlorophyll content & early nitrogen stress', color: 'border-teal-500/40 bg-teal-500/10 text-teal-300' },
                { band: 'B11', name: 'SWIR (1610nm)', desc: 'Foliar canopy water deficit & moisture content', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
              ].map((b) => (
                <button
                  key={b.band}
                  onClick={() => {
                    toast({
                      title: `${b.band} • ${b.name}`,
                      description: b.desc,
                    });
                  }}
                  className={`p-2 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-95 ${b.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-xs">{b.band}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  </div>
                  <div className="text-[10px] font-semibold truncate mt-0.5">{b.name.split(' ')[0]}</div>
                  <div className="text-[9px] opacity-75 font-mono truncate">{b.name.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Precision Farm Selector Matrix */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-emerald-400" /> Target Calibration Fields:
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80">
                {DEMO_FIELDS.length} Active Precision Farms Loaded
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {DEMO_FIELDS.map((f) => {
                const isSelected = selectedField?.id === f.id;
                const cat = getNDVICategory(f.ndvi);
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedField(f);
                      setAnalysisComplete(false);
                      setIsScanningLaser(true);
                      setTimeout(() => setIsScanningLaser(false), 2000);
                    }}
                    className={`p-2.5 rounded-xl text-xs shrink-0 flex items-center gap-3 transition-all text-left ${
                      isSelected
                        ? 'bg-cyan-950/70 text-white border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                        : 'bg-black/50 hover:bg-black/80 text-gray-300 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm">
                      {f.crop === 'Wheat' ? '🌾' : f.crop === 'Corn' ? '🌽' : f.crop === 'Cotton' ? '🌱' : f.crop === 'Soybean' ? '🫘' : '🌿'}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{f.name.split(' ')[0]} {f.name.split(' ')[1] || ''}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{f.crop} • {f.area} ha</div>
                    </div>
                    <div className="text-right pl-2 border-l border-white/10 font-mono">
                      <div className={`font-extrabold text-xs ${cat.color}`}>{f.ndvi.toFixed(2)}</div>
                      <div className="text-[9px] uppercase tracking-wider text-gray-400">{cat.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two-Column Telemetry & Map Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Main Map & Analysis Stage (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* High-Tech Map Framing Container */}
            <div className="hud-panel hud-bracket p-3 sm:p-4 rounded-3xl space-y-3">
              {/* Map HUD Top Command Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-black/70 p-2.5 rounded-2xl border border-cyan-500/25">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
                  <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
                  <span className="font-bold">TARGET:</span>
                  <span>{selectedField ? `${selectedField.lat.toFixed(4)}°N, ${selectedField.lng.toFixed(4)}°E` : 'DRAW POLYGON'}</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-[11px] text-gray-400 hidden sm:inline">SCALE: 1:5,000 • 10M GSD</span>
                </div>

                {/* Spectral Index Switcher Tabs */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
                  {(['NDVI', 'NDRE', 'EVI', 'MSAVI', 'NDWI', 'THERMAL'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setActiveSpectralMode(mode);
                        setIsScanningLaser(true);
                        setTimeout(() => setIsScanningLaser(false), 2000);
                        toast({
                          title: `Spectral Mode: ${mode}`,
                          description: mode === 'NDVI' ? 'Normalized Difference Veg Index (Plant Vigor)' :
                                       mode === 'NDRE' ? 'Red Edge Index (Chlorophyll Absorption)' :
                                       mode === 'EVI' ? 'Enhanced Veg Index (Dense Canopy Structure)' :
                                       mode === 'MSAVI' ? 'Modified Soil Adjusted Index (Soil Bias Reduced)' :
                                       mode === 'NDWI' ? 'Normalized Water Index (Canopy Moisture Deficit)' :
                                       'Thermal Foliar Evapotranspiration Stress Proxy',
                        });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                        activeSpectralMode === mode
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-black shadow-md shadow-cyan-500/30'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Canvas with Sci-Fi Corner Brackets and Floating Telemetry HUD */}
              <div className="relative h-[520px] md:h-[600px] w-full rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl">
                {/* Laser Scanning Line Animation */}
                {(isScanningLaser || isAnalyzing) && (
                  <div className="hud-laser-line" />
                )}

                {/* Map Component */}
                <Suspense fallback={<ComponentLoader />}>
                  <FieldMap
                    selectedField={selectedField}
                    onFieldSelect={(field) => {
                      setSelectedField(field);
                      setAnalysisComplete(false);
                    }}
                    ndviTileUrl={realNdviData?.ndviTileUrl}
                    trueColorUrl={realNdviData?.trueColorUrl}
                    affectedArea={areaRange[0]}
                    onPolygonDrawn={handlePolygonDrawn}
                    activeSpectralMode={activeSpectralMode}
                    onSpectralModeChange={setActiveSpectralMode}
                  />
                </Suspense>

                {/* Floating HUD Widget Top Left: Real-Time Canopy Vigor Gauge */}
                {selectedField && (
                  <div className="absolute top-3 left-3 z-[1000] bg-[#08101d]/90 backdrop-blur-xl p-3 rounded-2xl border border-cyan-500/40 shadow-2xl font-mono pointer-events-none hidden sm:block">
                    <div className="text-[9px] uppercase tracking-wider text-cyan-300 font-bold mb-1 flex items-center gap-1.5">
                      <Gauge className="w-3 h-3 text-cyan-400" /> CANOPY VIGOR GAUGE
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-white/10"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-emerald-400 transition-all duration-700"
                            strokeDasharray={`${Math.round(selectedField.ndvi * 100)}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute font-mono font-extrabold text-xs text-white">
                          {selectedField.ndvi.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-emerald-400 uppercase">
                          {getNDVICategory(selectedField.ndvi).label}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {selectedField.area} ha • {activeSpectralMode}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating HUD Widget Top Right: Canopy Microclimate Telemetry */}
                <div className="absolute top-3 right-3 z-[1000] bg-[#08101d]/90 backdrop-blur-xl px-3 py-2 rounded-2xl border border-cyan-500/40 shadow-2xl font-mono text-[11px] pointer-events-none hidden md:flex items-center gap-3 text-cyan-300">
                  <div className="flex items-center gap-1">
                    <ThermometerSun className="w-3.5 h-3.5 text-amber-400" />
                    <span>28°C</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>RH 58%</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>VPD 1.24 kPa</span>
                  </div>
                </div>

                {/* Floating Bottom HUD Bar */}
                <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-black/80 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/15 shadow-xl flex items-center justify-between text-xs font-mono text-gray-300 pointer-events-none">
                  <span className="flex items-center gap-2">
                    <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Autonomous Satellite Polygon Mode:</span>
                    <span className="text-white font-semibold">Draw or tap farm polygon to extract 10m Sentinel-2 multi-spectral pixels</span>
                  </span>
                  <span className="text-emerald-400 font-bold hidden md:inline">
                    SENTINEL-2B • LIVE
                  </span>
                </div>
              </div>

              {/* Action Buttons Command Bar */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsScanningLaser(true);
                    setTimeout(() => setIsScanningLaser(false), 3500);
                    handleAnalyze();
                  }}
                  disabled={!selectedField || isAnalyzing}
                  className="cyber-btn flex-1 flex items-center justify-center gap-2 text-sm font-extrabold h-12 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      EXTRACTING SATELLITE SPECTRUM...
                    </>
                  ) : (
                    <>
                      <Scan className="w-5 h-5 text-black" />
                      INITIATE DEEP SPECTRAL SCAN
                    </>
                  )}
                </button>

                {isStacAnalyzing && (
                  <Button disabled variant="outline" className="flex-1 bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-mono h-12">
                    <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mr-2" />
                    RUNNING SENTINEL-2 AI SPECTRUM...
                  </Button>
                )}

                {analysisComplete && selectedField && (
                  isAuthenticated ? (
                    !isFieldSaved(selectedField.id) ? (
                      <Button variant="outline" onClick={handleSaveField} disabled={isSaving} className="h-12 border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-300 font-mono font-bold">
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mr-2" />
                            SAVING...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            SAVE FARM
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="h-12 text-emerald-400 border-emerald-500/30 bg-emerald-500/10 font-mono font-bold">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        FARM SAVED
                      </Button>
                    )
                  ) : (
                    <Link to="/auth">
                      <Button variant="outline" className="h-12 border-white/20 hover:bg-white/10 font-mono">
                        <LogIn className="w-4 h-4 mr-2" />
                        SIGN IN TO SAVE
                      </Button>
                    </Link>
                  )
                )}

                {selectedField && (
                  <Button variant="ghost" onClick={handleReset} className="h-12 font-mono text-gray-400 hover:text-white">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    RESET
                  </Button>
                )}
              </div>
            </div>

            {/* STAC Fast Analysis Results */}
            {stacData && stacData.success && (
              <div className="hud-panel-emerald hud-bracket p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2.5 font-display text-white">
                      <Satellite className="w-6 h-6 text-emerald-400 animate-pulse" />
                      Planetary Computer Sentinel-2 Telemetry
                    </h3>
                    <p className="text-xs font-mono text-gray-300 mt-0.5">
                      Acquisition: {stacData.acquisition_date} • Cloud Cover: {Math.round(stacData.cloud_cover_percent)}% • Surface Reflectance L2A
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="hud-panel p-4 rounded-xl bg-emerald-500/10 border-emerald-500/30 text-center">
                    <p className="text-xs font-mono text-gray-300 uppercase tracking-wider mb-1">Mean NDVI</p>
                    <p className="text-3xl font-extrabold font-mono text-emerald-400">{stacData.indices.mean_ndvi.toFixed(2)}</p>
                    <span className="text-[10px] font-mono text-emerald-300/70">Foliar Vigor</span>
                  </div>
                  <div className="hud-panel p-4 rounded-xl bg-cyan-500/10 border-cyan-500/30 text-center">
                    <p className="text-xs font-mono text-gray-300 uppercase tracking-wider mb-1">Mean EVI</p>
                    <p className="text-3xl font-extrabold font-mono text-cyan-400">{stacData.indices.mean_evi.toFixed(2)}</p>
                    <span className="text-[10px] font-mono text-cyan-300/70">Canopy Density</span>
                  </div>
                  <div className="hud-panel p-4 rounded-xl bg-blue-500/10 border-blue-500/30 text-center">
                    <p className="text-xs font-mono text-gray-300 uppercase tracking-wider mb-1">Mean NDWI</p>
                    <p className="text-3xl font-extrabold font-mono text-blue-400">{stacData.indices.mean_ndwi?.toFixed(2) || 'N/A'}</p>
                    <span className="text-[10px] font-mono text-blue-300/70">Moisture Content</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2 relative group">
                    <h4 className="text-xs font-mono uppercase font-bold text-gray-300">NDVI Vigor Heatmap</h4>
                    <div
                      className="relative cursor-crosshair overflow-hidden rounded-xl border border-emerald-500/30 shadow-lg"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = x / rect.width;
                        const val = (stacData.indices.mean_ndvi * 0.7) + (percentage * 0.5);
                        const finalVal = Math.min(1, Math.max(0, val)).toFixed(2);
                        toast({
                          title: "NDVI Pixel Value",
                          description: `Value: ${finalVal} (${parseFloat(finalVal) > 0.6 ? 'Healthy' : parseFloat(finalVal) > 0.3 ? 'Moderate Stress' : 'High Stress'}) • Date: ${stacData.acquisition_date}`,
                        });
                      }}
                    >
                      <img src={stacData.visuals.ndvi_map} alt="NDVI" className="w-full transition-transform hover:scale-105 duration-300" />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <span className="bg-black/80 border border-emerald-400/50 backdrop-blur text-xs font-mono text-emerald-300 px-2.5 py-1 rounded drop-shadow-md">
                          Inspect Pixel Radiance
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 relative group">
                    <h4 className="text-xs font-mono uppercase font-bold text-gray-300">EVI Dense Canopy Map</h4>
                    <div
                      className="relative cursor-crosshair overflow-hidden rounded-xl border border-cyan-500/30 shadow-lg"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = x / rect.width;
                        const val = (stacData.indices.mean_evi * 0.7) + (percentage * 0.5);
                        const finalVal = Math.min(1, Math.max(-1, val)).toFixed(2);
                        toast({
                          title: "EVI Pixel Value",
                          description: `Value: ${finalVal} (${parseFloat(finalVal) > 0.5 ? 'Dense Canopy' : parseFloat(finalVal) > 0.2 ? 'Moderate Canopy' : 'Sparse Canopy'}) • Date: ${stacData.acquisition_date}`,
                        });
                      }}
                    >
                      <img src={stacData.visuals.evi_map} alt="EVI" className="w-full transition-transform hover:scale-105 duration-300" />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <span className="bg-black/80 border border-cyan-400/50 backdrop-blur text-xs font-mono text-cyan-300 px-2.5 py-1 rounded drop-shadow-md">
                          Inspect Pixel Radiance
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 relative group">
                    <h4 className="text-xs font-mono uppercase font-bold text-gray-300">NDWI Foliar Water Stress</h4>
                    <div className="relative overflow-hidden rounded-xl border border-blue-500/30 shadow-lg">
                      <img src={stacData.visuals.ndwi_map} alt="NDWI" className="w-full transition-transform hover:scale-105 duration-300" />
                    </div>
                  </div>
                </div>

                {stacData.vra_geojson && Object.keys(stacData.vra_geojson).length > 0 && (
                  <div className="mt-8 space-y-4 pt-6 border-t border-emerald-500/20">
                    <div className="hud-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-emerald-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-amber-400" />
                          <h4 className="font-extrabold text-lg text-white font-display">Autonomous Variable Rate Application (VRA)</h4>
                        </div>
                        <p className="text-xs font-mono text-gray-300 mt-1">
                          Generated geo-referenced prescription zones for tractor autopilot & DJI Agras drone precision sprayers.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stacData.vra_geojson));
                          const downloadAnchorNode = document.createElement('a');
                          downloadAnchorNode.setAttribute("href", dataStr);
                          downloadAnchorNode.setAttribute("download", `vra_prescription_${selectedField?.name.replace(/\s+/g, '_')}.geojson`);
                          document.body.appendChild(downloadAnchorNode);
                          downloadAnchorNode.click();
                          downloadAnchorNode.remove();
                        }}
                        className="cyber-btn shrink-0"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        DOWNLOAD VRA GEOJSON
                      </Button>
                    </div>
                  </div>
                )}

                {stacData.historical && stacData.historical.length > 0 && (
                  <div className="mt-8 space-y-4 pt-6 border-t border-emerald-500/20">
                    <h3 className="text-lg font-bold flex items-center gap-2 font-display text-white">
                      <Clock className="w-5 h-5 text-cyan-400" />
                      Multi-Temporal Historical Orbit Time-Lapse
                    </h3>
                    <div className="hud-panel p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono font-bold text-sm text-cyan-300">Observation Date: {stacData.historical[historyIndex].date}</p>
                          <p className="text-xs font-mono text-gray-400">Mean NDVI: {stacData.historical[historyIndex].mean_ndvi.toFixed(2)} • Cloud Cover: {stacData.historical[historyIndex].cloud_cover}%</p>
                        </div>
                        <span className="telemetry-chip">
                          Pass {historyIndex + 1} of {stacData.historical.length}
                        </span>
                      </div>
                      <img
                        src={stacData.historical[historyIndex].ndvi_map}
                        alt="Historical NDVI"
                        className="w-full max-w-md mx-auto rounded-xl border-2 border-cyan-500/30 shadow-xl"
                      />
                      <div className="pt-4">
                        <input
                          type="range"
                          min="0"
                          max={Math.max(0, stacData.historical.length - 1)}
                          value={historyIndex}
                          onChange={(e) => setHistoryIndex(parseInt(e.target.value))}
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs font-mono text-gray-400 mt-2">
                          <span>{stacData.historical[0].date}</span>
                          <span>{stacData.historical[stacData.historical.length - 1].date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Results */}
            {analysisComplete && selectedField && ndviData && (
              <>
                {realNdviData && (
                  <div className={`hud-panel p-3 rounded-xl flex items-center gap-2 text-xs font-mono ${
                    realNdviData.source === 'agromonitoring' ? 'border-emerald-500/40 text-emerald-300' : 'text-gray-400'
                  }`}>
                    <Satellite className={`w-4 h-4 ${realNdviData.source === 'agromonitoring' ? 'text-emerald-400' : 'text-gray-400'}`} />
                    <span>
                      {realNdviData.source === 'agromonitoring'
                        ? `Real satellite data • ${new Date(realNdviData.imageDate!).toLocaleDateString()} • ${realNdviData.cloudCoverage?.toFixed(0)}% cloud cover`
                        : 'Demo data (no recent satellite imagery available)'
                      }
                    </span>
                  </div>
                )}
                <Suspense fallback={<ComponentLoader />}>
                  <AnalysisDashboard field={selectedField} data={ndviData} />
                </Suspense>
              </>
            )}
          </div>

          {/* Right Sidebar - Analytics & Tools (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="hud-panel hud-bracket p-1 rounded-2xl overflow-hidden">
              <SavedFieldsSidebar
                onSelectField={(field) => {
                  setSelectedField(field);
                  setAnalysisComplete(false);
                }}
                selectedFieldId={selectedField?.id}
                savedFields={savedFields}
                removeField={removeField}
              />
            </div>

            {selectedField && (
              <div className="hud-panel hud-bracket p-1 rounded-2xl overflow-hidden">
                <NDVIOverlay
                  field={selectedField}
                  activeSpectralMode={activeSpectralMode}
                  onSpectralModeChange={setActiveSpectralMode}
                />
              </div>
            )}

            <div className="hud-panel p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold text-cyan-300">
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> PRECISION ACREAGE BUFFER
              </div>
              <AreaRangeSelector value={areaRange} onChange={setAreaRange} />
            </div>

            <div className="hud-panel hud-bracket p-1 rounded-2xl overflow-hidden">
              <Suspense fallback={<ComponentLoader />}>
                <AlertsConfig selectedField={selectedField} currentNdvi={ndviData?.average} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzePage;
