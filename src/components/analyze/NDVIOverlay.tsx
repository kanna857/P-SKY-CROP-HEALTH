import { useState, useEffect } from 'react';
import { DemoField, SPECTRAL_INDICES, SpectralIndexType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Satellite, Droplets, Leaf, Activity, Sparkles, HelpCircle, Layers, Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NDVIOverlayProps {
  field: DemoField;
  activeSpectralMode?: SpectralIndexType;
  onSpectralModeChange?: (mode: SpectralIndexType) => void;
}

export function NDVIOverlay({ field, activeSpectralMode, onSpectralModeChange }: NDVIOverlayProps) {
  const [selectedIndex, setSelectedIndex] = useState<SpectralIndexType>(activeSpectralMode || 'NDVI');

  useEffect(() => {
    if (activeSpectralMode && activeSpectralMode !== selectedIndex) {
      setSelectedIndex(activeSpectralMode);
    }
  }, [activeSpectralMode]);

  const handleIndexChange = (v: string) => {
    const mode = v as SpectralIndexType;
    setSelectedIndex(mode);
    if (onSpectralModeChange) {
      onSpectralModeChange(mode);
    }
  };

  const indexInfo = SPECTRAL_INDICES[selectedIndex];

  // Calculate adjusted index base value from field base NDVI
  const getIndexBaseValue = (type: SpectralIndexType, base: number) => {
    switch (type) {
      case 'THERMAL':
        // Converts NDVI vigor inversely into canopy radiometric temperature (21°C to 36°C)
        return Math.max(21.0, Math.min(37.5, parseFloat((22.5 + (1.0 - base) * 14.2).toFixed(1))));
      case 'EVI':
        return Math.max(0.1, Math.min(0.9, base * 0.9));
      case 'SAVI':
      case 'MSAVI':
        return Math.max(0.1, Math.min(0.85, base * 0.85 + 0.05));
      case 'NDWI':
        return Math.max(-0.2, Math.min(0.6, (base - 0.5) * 0.8 + 0.15));
      case 'NDRE':
        return Math.max(0.1, Math.min(0.8, base * 0.78));
      case 'NDVI':
      default:
        return base;
    }
  };

  const currentValue = getIndexBaseValue(selectedIndex, field.ndvi);

  const generateCell = (base: number) => {
    if (selectedIndex === 'THERMAL') {
      const variation = (Math.random() - 0.5) * 2.8;
      return Math.max(21.0, Math.min(38.0, parseFloat((base + variation).toFixed(1))));
    }
    const variation = (Math.random() - 0.5) * 0.22;
    return Math.max(0, Math.min(1, base + variation));
  };

  const getCellColor = (val: number, type: SpectralIndexType) => {
    if (type === 'THERMAL') {
      // FLIR Ironbow thermal temperature mapping
      if (val >= 33.0) return 'bg-red-500 shadow-red-500/50';
      if (val >= 29.5) return 'bg-orange-500 shadow-orange-500/50';
      if (val >= 26.5) return 'bg-amber-400 shadow-amber-400/50';
      if (val >= 24.0) return 'bg-cyan-500 shadow-cyan-500/50';
      return 'bg-purple-600 shadow-purple-600/50';
    }
    if (type === 'NDWI') {
      if (val >= 0.3) return 'bg-blue-500 shadow-blue-500/50';
      if (val >= 0.15) return 'bg-cyan-500 shadow-cyan-500/50';
      if (val >= 0.0) return 'bg-amber-400 shadow-amber-400/50';
      return 'bg-rose-500 shadow-rose-500/50';
    }
    if (val >= 0.7) return 'bg-emerald-500 shadow-emerald-500/50';
    if (val >= 0.5) return 'bg-lime-500 shadow-lime-500/50';
    if (val >= 0.3) return 'bg-yellow-400 shadow-yellow-400/50';
    return 'bg-red-500 shadow-red-500/50';
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0c1420]/90 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden group">
      {/* Ambient background glow */}
      <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all ${
        selectedIndex === 'THERMAL' ? 'bg-amber-500/15' : 'bg-emerald-500/10'
      }`} />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border transition-all ${
              selectedIndex === 'THERMAL'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            }`}>
              {selectedIndex === 'THERMAL' ? <Flame className="w-5 h-5 animate-pulse" /> : <Satellite className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 font-sans">
                {selectedIndex === 'THERMAL' ? 'FLIR Radiometric Thermal Engine' : 'Multi-Spectral Satellite Engine'}
                <Badge className={`text-[10px] font-mono ${
                  selectedIndex === 'THERMAL'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  {selectedIndex === 'THERMAL' ? 'Thermal FLIR MSI' : 'Sentinel-2 / Landsat 9'}
                </Badge>
              </h3>
              <p className="text-xs text-gray-400 font-mono">Field: {field.name} • {field.area} ha</p>
            </div>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-xs text-gray-400">Current Reading:</span>
          <p className={`text-lg font-extrabold ${selectedIndex === 'THERMAL' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {selectedIndex === 'THERMAL' ? `${currentValue.toFixed(1)}°C Mean Temp` : `${selectedIndex} = ${currentValue.toFixed(3)}`}
          </p>
        </div>
      </div>

      {/* Multi-Spectral Index Tabs */}
      <div className="relative z-10">
        <Tabs value={selectedIndex} onValueChange={handleIndexChange}>
          <TabsList className="grid grid-cols-6 bg-white/5 p-1 rounded-2xl border border-white/10 font-mono">
            <TabsTrigger value="NDVI" className="rounded-xl text-xs data-[state=active]:bg-emerald-500 data-[state=active]:text-white font-bold">
              NDVI
            </TabsTrigger>
            <TabsTrigger value="NDRE" className="rounded-xl text-xs data-[state=active]:bg-teal-500 data-[state=active]:text-white font-bold">
              NDRE
            </TabsTrigger>
            <TabsTrigger value="EVI" className="rounded-xl text-xs data-[state=active]:bg-lime-500 data-[state=active]:text-slate-900 font-bold">
              EVI
            </TabsTrigger>
            <TabsTrigger value="SAVI" className="rounded-xl text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 font-bold">
              SAVI
            </TabsTrigger>
            <TabsTrigger value="NDWI" className="rounded-xl text-xs data-[state=active]:bg-blue-500 data-[state=active]:text-white font-bold">
              NDWI
            </TabsTrigger>
            <TabsTrigger value="THERMAL" className="rounded-xl text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-red-600 data-[state=active]:text-black font-bold flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              THERMAL
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Formula & Explanation Card */}
      {indexInfo && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
              {selectedIndex === 'THERMAL' ? <Flame className="w-4 h-4 text-amber-400" /> : <Layers className="w-4 h-4 text-emerald-400" />}
              {indexInfo.fullName}
            </span>
            <span className="text-[11px] font-mono bg-black/40 px-2.5 py-0.5 rounded-lg border border-white/10 text-emerald-400">
              Optimal: {indexInfo.optimalRange}
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed font-mono">{indexInfo.description}</p>

          <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-gray-300 flex items-center justify-between">
            <span className="text-gray-400">Waveband Formula:</span>
            <code className={selectedIndex === 'THERMAL' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{indexInfo.formula}</code>
          </div>
        </div>
      )}

      {/* 10x10 Multi-Spectral Simulated Grid Sensor Map */}
      <div className="space-y-3 relative z-10 font-mono">
        <div className="flex items-center justify-between text-xs text-gray-300">
          <span className="font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> 10m Pixel Multi-Spectral Radiance Grid
          </span>
          <span className="text-[10px] text-gray-400 font-mono">100 High-Res Cells</span>
        </div>

        <div className="grid grid-cols-10 gap-1.5 p-3 rounded-2xl bg-black/40 border border-white/10 aspect-video max-h-60 overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => {
            const cellVal = generateCell(currentValue);
            return (
              <div
                key={i}
                className={`rounded-md transition-all duration-300 hover:scale-125 cursor-pointer hover:z-20 ${getCellColor(
                  cellVal,
                  selectedIndex
                )}`}
                title={selectedIndex === 'THERMAL' ? `Cell #${i + 1}: ${cellVal.toFixed(1)}°C` : `Pixel #${i + 1}: ${selectedIndex} ${cellVal.toFixed(3)}`}
              />
            );
          })}
        </div>

        {/* Dynamic Color Scale Legend */}
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1">
          {selectedIndex === 'THERMAL' ? (
            <>
              <span className="text-purple-400 font-bold">21°C (Cool Foliage)</span>
              <span className="text-cyan-400">25°C</span>
              <span className="text-amber-400 font-bold">28°C (Normal)</span>
              <span className="text-orange-400">32°C</span>
              <span className="text-red-500 font-bold">38°C+ (Thermal Hotspot)</span>
            </>
          ) : selectedIndex === 'NDWI' ? (
            <>
              <span className="text-rose-400 font-bold">Low Moisture / Dry</span>
              <span>Moderate</span>
              <span className="text-cyan-400">Adequate</span>
              <span className="text-blue-400 font-bold">High Hydration</span>
            </>
          ) : (
            <>
              <span className="text-red-400 font-bold">0.0 (Stress / Bare)</span>
              <span>0.25</span>
              <span className="text-yellow-400 font-bold">0.50 (Moderate)</span>
              <span>0.75</span>
              <span className="text-emerald-400 font-bold">1.0 (Peak Biomass)</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
