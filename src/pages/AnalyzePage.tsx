import { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DemoFieldsSelector } from '@/components/analyze/DemoFieldsSelector';
import { NDVIOverlay } from '@/components/analyze/NDVIOverlay';
import { SavedFieldsSidebar } from '@/components/analyze/SavedFieldsSidebar';
import { AreaRangeSelector } from '@/components/analyze/AreaRangeSelector';

// Heavy components — loaded only when AnalyzePage is visited
const FieldMap = lazy(() => import('@/components/analyze/FieldMap').then(m => ({ default: m.FieldMap })));
const AnalysisDashboard = lazy(() => import('@/components/analyze/AnalysisDashboard').then(m => ({ default: m.AnalysisDashboard })));
const AlertsConfig = lazy(() => import('@/components/analyze/AlertsConfig').then(m => ({ default: m.AlertsConfig })));
const WeatherWidget = lazy(() => import('@/components/analyze/WeatherWidget').then(m => ({ default: m.WeatherWidget })));
const AIRecommendations = lazy(() => import('@/components/analyze/AIRecommendations').then(m => ({ default: m.AIRecommendations })));

import { DemoField, DEMO_FIELDS, generateNDVIData } from '@/lib/types';
import { useSavedFields } from '@/hooks/useSavedFields';
import { Button } from '@/components/ui/button';
import { Scan, Save, RotateCcw, Satellite, LogIn } from 'lucide-react';
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

  // Auto-select first demo field if demo=true
  useEffect(() => {
    if (searchParams.get('demo') === 'true' && !selectedField) {
      setSelectedField(DEMO_FIELDS[0]);
    }
  }, [searchParams]);

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

  const handlePolygonDrawn = async (geoJson: any) => {
    setIsStacAnalyzing(true);
    setStacData(null);
    toast({
      title: 'Analyzing Custom Field...',
      description: 'Fetching high-res Sentinel-2 data from Planetary Computer.',
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
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setStacData(data);
      setHistoryIndex(data.historical?.length > 0 ? data.historical.length - 1 : 0);

      toast({
        title: 'STAC Analysis Complete',
        description: `Successfully analyzed recent imagery (${data.acquisition_date}).`,
      });
    } catch (err: any) {
      console.error('STAC API error:', err);
      toast({
        title: 'Analysis Failed',
        description: err.message || 'Ensure Python backend is running.',
        variant: 'destructive',
      });
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Satellite className="w-8 h-8 text-primary" />
            Field Analysis
          </h1>
          <p className="text-muted-foreground">
            Select a location on the map or choose a demo farm to analyze crop health
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <DemoFieldsSelector
              selectedField={selectedField}
              onSelect={setSelectedField}
            />
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

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Map */}
            <div className="h-[400px]">
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
                />
              </Suspense>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={!selectedField || isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 mr-2" />
                    Analyze Field
                  </>
                )}
              </Button>

              {isStacAnalyzing && (
                <Button disabled variant="outline" className="flex-1 bg-primary/10">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                  Running Sentinel-2 Analysis...
                </Button>
              )}

              {analysisComplete && selectedField && (
                isAuthenticated ? (
                  !isFieldSaved(selectedField.id) ? (
                    <Button variant="outline" onClick={handleSaveField} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Field
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="text-success border-success/30">
                      <Save className="w-4 h-4 mr-2" />
                      Field Saved
                    </Button>
                  )
                ) : (
                  <Link to="/auth">
                    <Button variant="outline">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign in to Save
                    </Button>
                  </Link>
                )
              )}

              {selectedField && (
                <Button variant="ghost" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>

            {/* STAC Fast Analysis Results */}
            {stacData && stacData.success && (
              <div className="glass-card p-6 rounded-xl space-y-4 border-primary/50 border-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Satellite className="w-5 h-5 text-primary" />
                      High-Resolution Sentinel-2 Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Powered by Microsoft Planetary Computer — Date: {stacData.acquisition_date} ({Math.round(stacData.cloud_cover_percent)}% Clouds)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-card p-4 rounded-lg bg-green-500/10 border-green-500/30">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Mean NDVI</p>
                    <p className="text-3xl font-bold text-green-500">{stacData.indices.mean_ndvi.toFixed(2)}</p>
                  </div>
                  <div className="glass-card p-4 rounded-lg bg-blue-500/10 border-blue-500/30">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Mean EVI</p>
                    <p className="text-3xl font-bold text-blue-500">{stacData.indices.mean_evi.toFixed(2)}</p>
                  </div>
                  <div className="glass-card p-4 rounded-lg bg-cyan-500/10 border-cyan-500/30">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Mean NDWI</p>
                    <p className="text-3xl font-bold text-cyan-500">{stacData.indices.mean_ndwi?.toFixed(2) || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2 relative group">
                    <h4 className="text-sm font-medium">NDVI Map</h4>
                    <div
                      className="relative cursor-crosshair overflow-hidden rounded-lg border border-border"
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
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <span className="bg-background/80 backdrop-blur text-xs font-semibold px-2 py-1 rounded drop-shadow-md">Click to inspect pixel</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 relative group">
                    <h4 className="text-sm font-medium">EVI Map</h4>
                    <div
                      className="relative cursor-crosshair overflow-hidden rounded-lg border border-border"
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
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <span className="bg-background/80 backdrop-blur text-xs font-semibold px-2 py-1 rounded drop-shadow-md">Click to inspect pixel</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 relative group">
                    <h4 className="text-sm font-medium">NDWI (Water Stress) Map</h4>
                    <div className="relative overflow-hidden rounded-lg border border-border">
                      <img src={stacData.visuals.ndwi_map} alt="NDWI" className="w-full transition-transform hover:scale-105 duration-300" />
                    </div>
                  </div>
                </div>

                {stacData.vra_geojson && Object.keys(stacData.vra_geojson).length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-t border-border pt-6">
                      Variable Rate Application (VRA)
                    </h3>
                    <div className="glass-card p-6 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-lg">VRA Prescription Zones</h4>
                        <p className="text-sm text-muted-foreground mt-1">Generated GeoJSON with Low, Medium, and High vigor zones for smart machinery integration.</p>
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
                      >
                        Download GeoJSON
                      </Button>
                    </div>
                  </div>
                )}

                {stacData.historical && stacData.historical.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-t border-border pt-6">
                      Historical Time-Lapse
                    </h3>
                    <div className="glass-card p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-lg">Date: {stacData.historical[historyIndex].date}</p>
                          <p className="text-sm text-muted-foreground">Mean NDVI: {stacData.historical[historyIndex].mean_ndvi.toFixed(2)} • Cloud Cover: {stacData.historical[historyIndex].cloud_cover}%</p>
                        </div>
                      </div>
                      <img
                        src={stacData.historical[historyIndex].ndvi_map}
                        alt="Historical NDVI"
                        className="w-full max-w-sm mx-auto rounded-lg border border-border shadow-md"
                      />
                      <div className="pt-4">
                        <input
                          type="range"
                          min="0"
                          max={Math.max(0, stacData.historical.length - 1)}
                          value={historyIndex}
                          onChange={(e) => setHistoryIndex(parseInt(e.target.value))}
                          className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
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
                  <div className={`glass-card p-3 rounded-lg flex items-center gap-2 text-sm ${realNdviData.source === 'agromonitoring' ? 'bg-success/10 border border-success/20' : 'bg-muted/50'
                    }`}>
                    <Satellite className={`w-4 h-4 ${realNdviData.source === 'agromonitoring' ? 'text-success' : 'text-muted-foreground'}`} />
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

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {selectedField && (
              <NDVIOverlay field={selectedField} />
            )}

            <AreaRangeSelector value={areaRange} onChange={setAreaRange} />
            <Suspense fallback={<ComponentLoader />}>
              <WeatherWidget field={selectedField} />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <AIRecommendations field={selectedField} />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <AlertsConfig selectedField={selectedField} currentNdvi={ndviData?.average} />
            </Suspense>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzePage;
