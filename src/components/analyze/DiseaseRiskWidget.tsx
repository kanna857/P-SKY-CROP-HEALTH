import { ShieldAlert, Droplets, Thermometer, Wind, CloudRain, Sparkles, CheckCircle2, Radio, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DiseaseRiskWidgetProps {
  cropName?: string;
}

export function DiseaseRiskWidget({ cropName }: DiseaseRiskWidgetProps) {
  return (
    <div id="radar" className="p-6 rounded-3xl bg-[#0c1420]/85 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden group">
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
              Weather-Driven Disease Risk Radar
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            </h3>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs font-semibold px-2.5 py-0.5 ml-1">
              High Outbreak Risk
            </Badge>
          </div>
          <p className="text-xs text-gray-400">
            Regional Fungal / Bacterial Spore Index
          </p>
        </div>

        <div className="text-right">
          <span className="text-sm font-bold text-orange-400 font-mono tracking-wider">
            80% Vulnerability
          </span>
        </div>
      </div>

      {/* Dynamic Gradient Slider Bar with Concentric Pulsing Radar Marker */}
      <div className="relative pt-3 pb-2 relative z-10">
        <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500 shadow-inner relative">
          {/* 80% Indicator Marker with Concentric Radar Wave Rings */}
          <div className="absolute top-1/2 left-[80%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            {/* Outer Expanding Pulsing Sonar Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-orange-400/80 animate-ping pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-orange-500/30 blur-[2px] animate-pulse pointer-events-none" />
            
            {/* Inner Core White/Orange Pin */}
            <div className="w-5 h-5 rounded-full bg-white border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)] relative z-10 hover:scale-125 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid: 4 Climate Metric Cards (Living Weather) & Pathogens Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        {/* Left 4 Living Climate Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Relative Humidity Card with Falling Condensation Droplet Animation */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-blue-400/50 hover:-translate-y-1 transition-all group/card relative overflow-hidden">
            {/* Subtle Droplet Animation */}
            <div className="absolute top-2 right-2 flex flex-col items-center">
              <span className="w-1 h-2 rounded-full bg-blue-400/80 animate-raindrop" />
            </div>

            <div className="flex items-center gap-1.5 text-blue-400">
              <Droplets className="w-4 h-4" />
              <span className="text-[11px] text-gray-400">Relative Humidity</span>
            </div>
            <p className="text-base font-bold text-white">78%</p>
            <p className="text-[10px] text-gray-400">(Spore Germination Zone)</p>
          </div>

          {/* Canopy Temp Card with Subtle Heat Glow Animation */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-orange-400/50 hover:-translate-y-1 transition-all group/card relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-orange-400">
              <Thermometer className="w-4 h-4 group-hover/card:scale-110 transition-transform" />
              <span className="text-[11px] text-gray-400">Canopy Temp</span>
            </div>
            <p className="text-base font-bold text-white">25°C</p>
            <p className="text-[10px] text-gray-400">(Optimal Pathogen Range)</p>
          </div>

          {/* Wind Speed Card with Flowing Wind Particles */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-cyan-400/50 hover:-translate-y-1 transition-all group/card relative overflow-hidden">
            {/* Animated Wind Streaks */}
            <div className="absolute top-3 right-2 flex flex-col gap-1 pointer-events-none">
              <span className="w-4 h-0.5 rounded-full bg-cyan-400/70 animate-wind-flow" />
              <span className="w-3 h-0.5 rounded-full bg-cyan-400/50 animate-wind-flow" style={{ animationDelay: '0.8s' }} />
            </div>

            <div className="flex items-center gap-1.5 text-cyan-400">
              <Wind className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-[11px] text-gray-400">Wind Speed</span>
            </div>
            <p className="text-base font-bold text-white">12 km/h</p>
            <p className="text-[10px] text-gray-400">(Spore Dispersal Risk)</p>
          </div>

          {/* Rainfall Card with Falling Rain Particles */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-teal-400/50 hover:-translate-y-1 transition-all group/card relative overflow-hidden">
            {/* Falling Rain Particle Streaks */}
            <div className="absolute top-2 right-3 flex gap-1 pointer-events-none">
              <span className="w-0.5 h-2 rounded-full bg-teal-400/80 animate-raindrop" />
              <span className="w-0.5 h-2.5 rounded-full bg-teal-400/60 animate-raindrop" style={{ animationDelay: '0.4s' }} />
              <span className="w-0.5 h-1.5 rounded-full bg-teal-400/70 animate-raindrop" style={{ animationDelay: '0.8s' }} />
            </div>

            <div className="flex items-center gap-1.5 text-teal-400">
              <CloudRain className="w-4 h-4 group-hover/card:scale-110 transition-transform" />
              <span className="text-[11px] text-gray-400">Rainfall (24h)</span>
            </div>
            <p className="text-base font-bold text-white">2.4 mm</p>
            <p className="text-[10px] text-gray-400">(Favorable Conditions)</p>
          </div>
        </div>

        {/* Right Watchlist with Warning Aura & Proactive Tip (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Pathogens on High Alert (Next 48 Hours)
            </p>

            <div className="space-y-1.5">
              {/* High Alert Item with Amber Warning Pulse */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs animate-warning-pulse">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                  Late Blight / Downy Mildew
                </span>
                <span className="text-orange-400 font-bold font-mono">88% Probability</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs hover:border-yellow-500/30 transition-colors">
                <span className="font-semibold text-white">Bacterial Leaf Spot</span>
                <span className="text-yellow-400 font-bold font-mono">64% Probability</span>
              </div>
            </div>
          </div>

          {/* Proactive Tip with Glowing Emerald Border */}
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-gray-300 flex items-start gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '10s' }} />
            <p className="leading-relaxed">
              <strong className="text-emerald-400 font-semibold">Proactive Agronomist Tip:</strong> Apply preventive copper-based contact spray before sunset to shield lower leaves from active morning spore germination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
