import React, { useState } from 'react';
import { Copy, Check, ShieldAlert, Droplets, Flame, Leaf, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface CropHealthRiskMetrics {
  healthScore?: number; // 0-100, default 82
  diseaseRisk?: number; // 0-100, default 12
  waterStress?: number; // 0-100, default 18
  heatStress?: number;  // 0-100, default 23
  vegetationHealth?: number; // 0-100, default 91
  fieldName?: string;
  cropType?: string;
}

interface CropHealthRiskCardProps {
  metrics?: CropHealthRiskMetrics;
  className?: string;
}

export function CropHealthRiskCard({ metrics, className = '' }: CropHealthRiskCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const healthScore = metrics?.healthScore ?? 82;
  const diseaseRisk = metrics?.diseaseRisk ?? 12;
  const waterStress = metrics?.waterStress ?? 18;
  const heatStress = metrics?.heatStress ?? 23;
  const vegetationHealth = metrics?.vegetationHealth ?? 91;
  const fieldName = metrics?.fieldName ?? 'Target Farm Sector';

  const handleCopy = async () => {
    const text = `CROP HEALTH SCORE: ${healthScore}%\n- Disease Risk: ${diseaseRisk}%\n- Water Stress: ${waterStress}%\n- Heat Stress: ${heatStress}%\n- Vegetation Health: ${vegetationHealth}%\nField: ${fieldName}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: 'Score Copied to Clipboard',
        description: 'Crop Health Risk summary ready to share.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Copy Failed',
        description: 'Could not write to clipboard.',
        variant: 'destructive',
      });
    }
  };

  // Color determination based on health score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-teal-400 text-emerald-400';
    if (score >= 60) return 'from-yellow-400 to-amber-500 text-amber-400';
    if (score >= 40) return 'from-orange-500 to-amber-600 text-orange-400';
    return 'from-rose-500 to-red-600 text-rose-400';
  };

  return (
    <div
      className={`relative p-5 sm:p-6 rounded-2xl bg-[#0f1724]/95 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl text-gray-200 transition-all hover:border-emerald-500/30 ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">
            CROP HEALTH SCORE
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            LIVE AI
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Copy Crop Health Score summary"
          aria-label="Copy Crop Health Score summary"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400 transition-transform scale-110" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Score & Custom Segmented Progress Bar */}
      <div className="flex items-center gap-4 mb-5">
        {/* Visual Multi-Segment / Progress Bar Container */}
        <div className="flex-1">
          <div className="h-4 w-full bg-black/60 rounded-md p-0.5 border border-white/10 overflow-hidden relative flex">
            {/* Grid Pattern / Segment Lines */}
            <div
              className={`h-full rounded-sm bg-gradient-to-r ${getScoreColor(healthScore)} transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.4)]`}
              style={{ width: `${Math.min(100, Math.max(0, healthScore))}%` }}
            />
            {/* Overlay grid markings for technical agronomic look */}
            <div className="absolute inset-0 grid grid-cols-10 pointer-events-none opacity-30">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="border-r border-black/80 h-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Big percentage display */}
        <span className="text-xl sm:text-2xl font-bold font-mono text-white shrink-0">
          {healthScore}%
        </span>
      </div>

      {/* 4 Core Breakdown Rows matching reference design */}
      <div className="space-y-2.5 font-mono text-xs sm:text-sm border-t border-white/5 pt-3.5">
        {/* Disease Risk */}
        <div className="flex items-center justify-between text-gray-300 py-0.5 group">
          <span className="flex items-center gap-2 text-gray-400 group-hover:text-gray-200 transition-colors">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Disease Risk
          </span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-rose-500 rounded-full"
                style={{ width: `${diseaseRisk}%` }}
              />
            </div>
            <span className="font-bold text-white min-w-[36px] text-right">{diseaseRisk}%</span>
          </div>
        </div>

        {/* Water Stress */}
        <div className="flex items-center justify-between text-gray-300 py-0.5 group">
          <span className="flex items-center gap-2 text-gray-400 group-hover:text-gray-200 transition-colors">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            Water Stress
          </span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${waterStress}%` }}
              />
            </div>
            <span className="font-bold text-white min-w-[36px] text-right">{waterStress}%</span>
          </div>
        </div>

        {/* Heat Stress */}
        <div className="flex items-center justify-between text-gray-300 py-0.5 group">
          <span className="flex items-center gap-2 text-gray-400 group-hover:text-gray-200 transition-colors">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Heat Stress
          </span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${heatStress}%` }}
              />
            </div>
            <span className="font-bold text-white min-w-[36px] text-right">{heatStress}%</span>
          </div>
        </div>

        {/* Vegetation Health */}
        <div className="flex items-center justify-between text-gray-300 py-0.5 group">
          <span className="flex items-center gap-2 text-gray-400 group-hover:text-gray-200 transition-colors">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            Vegetation Health
          </span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${vegetationHealth}%` }}
              />
            </div>
            <span className="font-bold text-emerald-400 min-w-[36px] text-right">{vegetationHealth}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
