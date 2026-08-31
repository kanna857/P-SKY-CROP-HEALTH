import { useState } from 'react';
import { DemoField, SPECTRAL_INDICES, SpectralIndexType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Satellite, Droplets, Leaf, Activity, Sparkles, HelpCircle, Layers, Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NDVIOverlayProps {
  field: DemoField;
}

export function NDVIOverlay({ field }: NDVIOverlayProps) {
  const [selectedIndex, setSelectedIndex] = useState<SpectralIndexType>('NDVI');
  const indexInfo = SPECTRAL_INDICES[selectedIndex];

  // Calculate adjusted index base value from field base NDVI
  const getIndexBaseValue = (type: SpectralIndexType, base: number) => {
    switch (type) {
      case 'EVI':
        return Math.max(0.1, Math.min(0.9, base * 0.9));
      case 'SAVI':
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

  const gridSize = 10;
  const generateCell = (base: number) => {
    const variation = (Math.random() - 0.5) * 0.22;
    return Math.max(0, Math.min(1, base + variation));
  };

  const getCellColor = (val: number, type: SpectralIndexType) => {
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
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                Multi-Spectral Satellite Engine
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                  Sentinel-2 / Landsat 9
                </Badge>
              </h3>
              <p className="text-xs text-gray-400">Field: {field.name} • {field.area} ha</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-400">Current Index:</span>
          <p className="text-lg font-bold text-emerald-400 font-mono">
            {selectedIndex} = {currentValue.toFixed(3)}
          </p>
        </div>
      </div>

      {/* Multi-Spectral Index Tabs */}
      <div className="relative z-10">
        <Tabs value={selectedIndex} onValueChange={(v) => setSelectedIndex(v as SpectralIndexType)}>
          <TabsList className="grid grid-cols-5 bg-white/5 p-1 rounded-2xl border border-white/10">
            <TabsTrigger value="NDVI" className="rounded-xl text-xs data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              NDVI
            </TabsTrigger>
            <TabsTrigger value="EVI" className="rounded-xl text-xs data-[state=active]:bg-lime-500 data-[state=active]:text-slate-900 font-semibold">
              EVI
            </TabsTrigger>
            <TabsTrigger value="SAVI" className="rounded-xl text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 font-semibold">
              SAVI
            </TabsTrigger>
            <TabsTrigger value="NDWI" className="rounded-xl text-xs data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              NDWI
            </TabsTrigger>
            <TabsTrigger value="NDRE" className="rounded-xl text-xs data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              NDRE
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Formula & Explanation Card */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white">{indexInfo.fullName}</span>
          <code className="px-2 py-0.5 rounded bg-black/40 text-emerald-400 font-mono text-[11px] border border-white/5">
            {indexInfo.formula}
          </code>
        </div>
        <p className="text-xs text-gray-400">{indexInfo.description}</p>
        <div className="flex items-center gap-2 pt-1 text-[11px]">
          <span className="text-gray-400">Target Range:</span>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">
            {indexInfo.optimalRange}
          </Badge>
        </div>
      </div>

      {/* 10x10 High-Density Synthetic Spectral Matrix Map */}
      <div className="aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/15 p-2 bg-black/40 relative z-10 shadow-inner">
        <div
          className="grid gap-1 h-full w-full"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const cellVal = generateCell(currentValue);
            return (
              <div
                key={i}
                className={`${getCellColor(cellVal, selectedIndex)} rounded-md transition-all duration-300 hover:scale-125 hover:z-20 cursor-pointer shadow-sm`}
                title={`${selectedIndex}: ${cellVal.toFixed(3)}`}
              />
            );
          })}
        </div>
      </div>

      {/* Continuous Spectral Ramp Legend */}
      <div className="space-y-2 relative z-10">
        <div className="flex justify-between text-[11px] text-gray-400 font-medium">
          <span>Stressed / Low</span>
          <span>Moderate</span>
          <span>Optimal / High</span>
        </div>
        <div className={`h-2.5 rounded-full bg-gradient-to-r ${indexInfo.palette} shadow-inner`} />
      </div>
    </div>
  );
}
