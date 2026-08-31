import { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Droplets,
  Thermometer,
  Wind,
  CloudRain,
  Sparkles,
  CheckCircle2,
  Clock,
  Pill,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { calculateEpidemiologyForecast } from '@/lib/epidemiologyModel';

interface DiseaseRiskWidgetProps {
  cropName?: string;
}

export function DiseaseRiskWidget({ cropName = 'Tomato' }: DiseaseRiskWidgetProps) {
  const [selectedDisease, setSelectedDisease] = useState<string>('Late Blight');
  const [selectedHourOffset, setSelectedHourOffset] = useState<number>(12);

  // Calculate 72-hour epidemiology report
  const report = useMemo(
    () => calculateEpidemiologyForecast(cropName, selectedDisease),
    [cropName, selectedDisease]
  );

  const currentHourData = report.hourlyForecast[selectedHourOffset] || report.hourlyForecast[0];

  return (
    <div
      id="radar"
      className="p-6 rounded-3xl bg-[#0c1420]/90 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden group"
    >
      {/* Background Animated Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/30 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              72-Hour Micro-Climate Epidemiology AI
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            </h3>
            <Badge
              className={`text-xs font-semibold px-2.5 py-0.5 ml-1 ${
                report.riskTier === 'Critical'
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : report.riskTier === 'High'
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              }`}
            >
              {report.riskTier} Outbreak Risk
            </Badge>
          </div>
          <p className="text-xs text-gray-400">
            Fungal Spore Germination & Leaf Wetness Forecaster • {cropName} ({report.scientificName})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['Late Blight', 'Early Blight', 'Powdery Mildew', 'Rust'].map((dis) => (
            <button
              key={dis}
              onClick={() => setSelectedDisease(dis)}
              className={`text-[11px] font-bold px-3 py-1 rounded-xl transition-all ${
                selectedDisease === dis
                  ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {dis}
            </button>
          ))}
        </div>
      </div>

      {/* Optimal Spray Window Recommendation Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Clock className="w-4 h-4" />
            <span>Recommended Optimal Chemical Spray Window</span>
          </div>
          <Badge className="bg-emerald-500 text-black font-bold text-xs px-2.5 py-0.5">
            {report.optimalSprayWindow.startLabel} - {report.optimalSprayWindow.endLabel}
          </Badge>
        </div>

        <p className="text-xs text-gray-200 leading-relaxed">
          {report.optimalSprayWindow.actionMessage}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-gray-400 block text-[10px]">Contact Chemistry:</span>
            <strong className="text-emerald-400">{report.optimalSprayWindow.recommendedChemistry}</strong>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-gray-400 block text-[10px]">Organic Alternative:</span>
            <strong className="text-green-400">{report.optimalSprayWindow.organicAlternative}</strong>
          </div>
        </div>
      </div>

      {/* 72-Hour Micro-Climate Interactive Timeline Graph */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs text-gray-300">
          <span className="font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-orange-400" /> Hourly Spore Infection Probability Progression
          </span>
          <span className="font-mono text-emerald-400">
            {currentHourData.timeLabel} • Risk: {currentHourData.pathogenRiskScore}%
          </span>
        </div>

        {/* 72-Bar Micro-Chart */}
        <div className="h-16 flex items-end gap-1 p-2 rounded-2xl bg-black/40 border border-white/10 overflow-x-auto">
          {report.hourlyForecast.slice(0, 36).map((point, idx) => {
            const isSelected = selectedHourOffset === idx;
            const barHeight = Math.max(15, point.pathogenRiskScore);
            return (
              <div
                key={idx}
                onClick={() => setSelectedHourOffset(idx)}
                className="flex-1 min-w-[8px] h-full flex flex-col justify-end items-center cursor-pointer group/bar"
                title={`${point.timeLabel}: ${point.pathogenRiskScore}% Risk (${point.tempC}°C, ${point.relativeHumidity}% RH)`}
              >
                <div
                  className={`w-full rounded-t transition-all ${
                    point.isOptimalSprayWindow
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : point.pathogenRiskScore > 75
                      ? 'bg-red-500'
                      : point.pathogenRiskScore > 45
                      ? 'bg-orange-400'
                      : 'bg-yellow-400'
                  } ${isSelected ? 'ring-2 ring-white scale-y-110' : 'opacity-80 group-hover/bar:opacity-100'}`}
                  style={{ height: `${barHeight}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>Now</span>
          <span>+12 Hours</span>
          <span>+24 Hours</span>
          <span>+36 Hours</span>
        </div>
      </div>

      {/* 4 Selected Hour Environmental Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-blue-400/50 transition-all">
          <div className="flex items-center gap-1.5 text-blue-400">
            <Droplets className="w-4 h-4" />
            <span className="text-[11px] text-gray-400">Relative Humidity</span>
          </div>
          <p className="text-base font-bold text-white">{currentHourData.relativeHumidity}%</p>
          <p className="text-[10px] text-gray-400">
            {currentHourData.relativeHumidity > 80 ? 'Germination Zone' : 'Moderate Humidity'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-orange-400/50 transition-all">
          <div className="flex items-center gap-1.5 text-orange-400">
            <Thermometer className="w-4 h-4" />
            <span className="text-[11px] text-gray-400">Canopy Temp</span>
          </div>
          <p className="text-base font-bold text-white">{currentHourData.tempC}°C</p>
          <p className="text-[10px] text-gray-400">
            {currentHourData.tempC >= 15 && currentHourData.tempC <= 23 ? 'Optimal Sporulation' : 'Sub-optimal'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-cyan-400/50 transition-all">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Wind className="w-4 h-4" />
            <span className="text-[11px] text-gray-400">Wind Velocity</span>
          </div>
          <p className="text-base font-bold text-white">{currentHourData.windSpeedKmh} km/h</p>
          <p className="text-[10px] text-gray-400">
            {currentHourData.windSpeedKmh <= 12 ? 'Safe for Foliar Spray' : 'High Drift Risk'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-teal-400/50 transition-all">
          <div className="flex items-center gap-1.5 text-teal-400">
            <CloudRain className="w-4 h-4" />
            <span className="text-[11px] text-gray-400">Rainfall</span>
          </div>
          <p className="text-base font-bold text-white">{currentHourData.rainMm} mm</p>
          <p className="text-[10px] text-gray-400">
            {currentHourData.rainMm > 0 ? 'Splash Dispersal Active' : 'Dry Foliage'}
          </p>
        </div>
      </div>
    </div>
  );
}
