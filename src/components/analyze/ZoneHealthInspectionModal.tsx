import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Droplets,
  Flame,
  Bug,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf
} from 'lucide-react';
import { FieldRiskZone } from './DynamicNDVIHeatmap';

interface ZoneHealthInspectionModalProps {
  zone: FieldRiskZone | null;
  isOpen: boolean;
  onClose: () => void;
  fieldName?: string;
  cropType?: string;
}

export function ZoneHealthInspectionModal({
  zone,
  isOpen,
  onClose,
  fieldName = 'Target Field',
  cropType = 'Crop',
}: ZoneHealthInspectionModalProps) {
  const navigate = useNavigate();

  if (!zone) return null;

  const isHealthy = zone.tier === 'healthy';

  const getTierBadge = () => {
    switch (zone.tier) {
      case 'healthy':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs px-3 py-1 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Green — Healthy
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/40 text-xs px-3 py-1 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Yellow — Warning
          </Badge>
        );
      case 'moderate':
        return (
          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/40 text-xs px-3 py-1 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Orange — Moderate Risk
          </Badge>
        );
      case 'severe':
      default:
        return (
          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-xs px-3 py-1 font-bold animate-pulse">
            <Flame className="w-3.5 h-3.5 mr-1" /> Red — Severe Risk
          </Badge>
        );
    }
  };

  const handleGoToDiagnosis = () => {
    onClose();
    navigate('/diagnose');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[620px] bg-[#0c1422]/98 border border-white/15 text-white backdrop-blur-2xl p-6 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <DialogHeader className="space-y-2 border-b border-white/10 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full shadow-lg shrink-0"
                style={{ backgroundColor: zone.color }}
              />
              <span className="text-xs font-mono font-bold text-gray-400 uppercase">
                {fieldName} • {zone.name}
              </span>
            </div>
            {getTierBadge()}
          </div>

          <DialogTitle className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {isHealthy ? (
              <>
                <Leaf className="w-6 h-6 text-emerald-400" />
                Why is this area healthy?
              </>
            ) : (
              <>
                <AlertTriangle className="w-6 h-6 text-rose-400" />
                Why is this area unhealthy?
              </>
            )}
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-300 leading-relaxed font-sans pt-1">
            {zone.unhealthySummary}
          </DialogDescription>
        </DialogHeader>

        {/* 4 Agronomic Diagnostic Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 font-mono">
          {/* Soil Moisture */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-400 flex items-center gap-1 font-sans">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Soil Moisture
            </span>
            <span className="text-base font-bold text-white block">
              {zone.soilMoisturePct}%
            </span>
            <span className={`text-[10px] block ${zone.soilMoisturePct < 15 ? 'text-rose-400 font-bold' : 'text-gray-400'}`}>
              Stress: {zone.waterStressLevel}
            </span>
          </div>

          {/* Thermal Hotspot */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-400 flex items-center gap-1 font-sans">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Thermal Anomaly
            </span>
            <span className={`text-base font-bold block ${zone.thermalHotspotDelta > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {zone.thermalHotspotDelta > 0 ? `+${zone.thermalHotspotDelta}°C` : `${zone.thermalHotspotDelta}°C`}
            </span>
            <span className="text-[10px] text-gray-400 block">
              vs Field Baseline
            </span>
          </div>

          {/* Pathogen Probability */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-400 flex items-center gap-1 font-sans">
              <Bug className="w-3.5 h-3.5 text-rose-400" /> Pathogen Risk
            </span>
            <span className={`text-base font-bold block ${zone.pathogenRiskPct > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {zone.pathogenRiskPct}%
            </span>
            <span className="text-[10px] text-gray-400 block">
              Infection Pressure
            </span>
          </div>

          {/* NDVI Foliar Delta */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-400 flex items-center gap-1 font-sans">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Zone NDVI
            </span>
            <span className="text-base font-bold text-white block">
              {zone.ndvi.toFixed(2)}
            </span>
            <span className={`text-[10px] block font-bold ${zone.ndviDeltaPct < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {zone.ndviDeltaPct > 0 ? `+${zone.ndviDeltaPct}%` : `${zone.ndviDeltaPct}%`}
            </span>
          </div>
        </div>

        {/* Primary Root Cause Detailed Card */}
        <div className={`p-4 rounded-2xl border space-y-2 ${isHealthy ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'}`}>
          <div className="flex items-center gap-2">
            {isHealthy ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Root Cause Pathology Analysis
            </h4>
          </div>
          <p className="text-sm font-semibold text-white">
            {zone.unhealthyReasonTitle}
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            {zone.unhealthySummary}
          </p>
        </div>

        {/* Recommended Action Protocol */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold uppercase tracking-wider text-amber-300">
              Immediate Agronomist Action Protocol
            </h4>
          </div>
          <div className="space-y-1.5 text-gray-200">
            <p>
              <strong className="text-white">Action:</strong> {zone.immediateAction}
            </p>
            <p>
              <strong className="text-white">Foliar Treatment:</strong> {zone.recommendedTreatment}
            </p>
          </div>
        </div>

        {/* Action Button: Scan Leaf Sample in Diagnostic Studio */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white"
          >
            Close
          </Button>

          <Button
            onClick={handleGoToDiagnosis}
            className="text-xs font-bold px-5 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Scan Leaf Specimen from {zone.name}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
