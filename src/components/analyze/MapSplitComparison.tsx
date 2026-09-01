import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  SlidersHorizontal,
  X,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  TrendingUp
} from 'lucide-react';

export interface TimelinePass {
  date: string;
  label: string;
  meanNdvi: number;
  stage: string;
}

export const DEFAULT_TIMELINE_PASSES: TimelinePass[] = [
  { date: '2026-06-12', label: 'T0: Sowing / Emergence', meanNdvi: 0.32, stage: 'Emergence' },
  { date: '2026-07-01', label: 'T1: Early Vegetative Tillering', meanNdvi: 0.48, stage: 'Tillering' },
  { date: '2026-07-22', label: 'T2: Mid-Season Canopy Extension', meanNdvi: 0.65, stage: 'Stem Elongation' },
  { date: '2026-08-10', label: 'T3: Flowering / Booting Stage', meanNdvi: 0.74, stage: 'Flowering' },
  { date: '2026-08-28', label: 'T4: Peak Biomass / Current Pass', meanNdvi: 0.81, stage: 'Peak Vigor' },
];

interface MapSplitComparisonProps {
  mapContainerRef: React.RefObject<HTMLDivElement>;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  timelinePasses?: TimelinePass[];
  onSelectedDateChange?: (date: TimelinePass) => void;
  onSliderPositionChange?: (percent: number) => void;
}

export function MapSplitComparison({
  mapContainerRef,
  enabled,
  onToggle,
  timelinePasses = DEFAULT_TIMELINE_PASSES,
  onSelectedDateChange,
  onSliderPositionChange,
}: MapSplitComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage from 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentPassIndex, setCurrentPassIndex] = useState<number>(timelinePasses.length - 1);
  const [baselinePassIndex, setBaselinePassIndex] = useState<number>(0);

  const containerBoundsRef = useRef<{ left: number; width: number }>({ left: 0, width: 1 });

  const activePass = timelinePasses[currentPassIndex] || timelinePasses[0];
  const baselinePass = timelinePasses[baselinePassIndex] || timelinePasses[0];

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    containerBoundsRef.current = { left: rect.left, width: rect.width };
    setIsDragging(true);
  }, [mapContainerRef]);

  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const { left, width } = containerBoundsRef.current;
    const relativeX = clientX - left;
    const pct = Math.min(95, Math.max(5, (relativeX / width) * 100));
    setSliderPosition(pct);
    if (onSliderPositionChange) {
      onSliderPositionChange(pct);
    }
  }, [isDragging, onSliderPositionChange]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  useEffect(() => {
    if (onSelectedDateChange && timelinePasses[currentPassIndex]) {
      onSelectedDateChange(timelinePasses[currentPassIndex]);
    }
  }, [currentPassIndex, onSelectedDateChange, timelinePasses]);

  if (!enabled) {
    return null;
  }

  const ndviDelta = (activePass.meanNdvi - baselinePass.meanNdvi).toFixed(2);
  const isPositiveGrowth = activePass.meanNdvi >= baselinePass.meanNdvi;

  return (
    <div className="absolute inset-0 pointer-events-none z-[450] select-none overflow-hidden">
      {/* Sliding Divider Line */}
      <div
        className="absolute top-0 bottom-0 pointer-events-auto cursor-ew-resize flex items-center justify-center"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onPointerDown={handlePointerDown}
      >
        {/* Glowing vertical line */}
        <div className="w-[3px] h-full bg-white shadow-[0_0_12px_rgba(16,185,129,0.9)]" />

        {/* Center Draggable Grab Handle */}
        <div className="absolute w-10 h-10 rounded-full bg-[#0a121e] border-2 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.7)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400 group-hover:text-white" />
        </div>
      </div>

      {/* Top Left Badge: Baseline Date */}
      <div
        className="absolute top-3 pointer-events-auto transition-all"
        style={{ left: '16px', maxWidth: `${sliderPosition - 4}%` }}
      >
        <div className="bg-[#0c1422]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-white shadow-xl flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div className="text-[11px] truncate">
            <span className="text-gray-400 font-mono">Baseline:</span>{' '}
            <span className="font-bold text-cyan-300">{baselinePass.date}</span>{' '}
            <span className="text-[10px] text-gray-300 font-mono">({baselinePass.meanNdvi.toFixed(2)})</span>
          </div>
        </div>
      </div>

      {/* Top Right Badge: Comparison / Target Date */}
      <div
        className="absolute top-3 pointer-events-auto transition-all"
        style={{ right: '16px', maxWidth: `${100 - sliderPosition - 4}%` }}
      >
        <div className="bg-[#0c1422]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 text-white shadow-xl flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div className="text-[11px] truncate">
            <span className="text-gray-400 font-mono">Target:</span>{' '}
            <span className="font-bold text-emerald-300">{activePass.date}</span>{' '}
            <span className="text-[10px] text-emerald-400 font-mono">({activePass.meanNdvi.toFixed(2)})</span>
          </div>
          <button
            onClick={() => onToggle(false)}
            className="ml-1 p-1 rounded-lg hover:bg-white/15 text-gray-400 hover:text-white"
            title="Exit Split-Screen Mode"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Bottom Timeline Scrubber Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto w-[92%] max-w-xl">
        <div className="bg-[#0a121e]/95 backdrop-blur-xl border border-white/15 p-3.5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] text-white space-y-2">
          {/* Header Row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-bold font-display text-emerald-300">
                Sentinel-2 Temporal Evolution
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] py-0">
                {activePass.stage}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="text-gray-400">Delta:</span>
              <span className={`font-bold flex items-center gap-0.5 ${isPositiveGrowth ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositiveGrowth ? '+' : ''}{ndviDelta} NDVI
                <TrendingUp className={`w-3 h-3 ${isPositiveGrowth ? '' : 'rotate-180 text-rose-400'}`} />
              </span>
            </div>
          </div>

          {/* Timeline Slider Track */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={timelinePasses.length - 1}
              step={1}
              value={currentPassIndex}
              onChange={(e) => setCurrentPassIndex(parseInt(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/10 rounded-lg"
            />

            {/* Step markers */}
            <div className="flex justify-between text-[10px] font-mono text-gray-400 px-0.5">
              {timelinePasses.map((p, idx) => (
                <button
                  key={p.date}
                  onClick={() => setCurrentPassIndex(idx)}
                  className={`hover:text-white transition-colors text-center ${
                    idx === currentPassIndex ? 'text-emerald-400 font-bold' : ''
                  }`}
                >
                  {p.date.slice(5)}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 pt-0.5">
            <Info className="w-3 h-3 text-cyan-400" />
            <span>Drag the center slider left/right to swipe between dates</span>
          </div>
        </div>
      </div>
    </div>
  );
}
