import { Activity, ShieldCheck, Droplets, Sun, Sparkles, Satellite, Layers, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ndviScale = [
  {
    range: '0.70 – 1.00',
    label: 'Optimal Chlorophyll Density',
    category: 'Peak Biomass',
    color: 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]',
    textColor: 'text-emerald-400',
    description: 'Dense canopy biomass, optimal photosynthetic absorption, zero moisture or nutrient deficiency.'
  },
  {
    range: '0.50 – 0.70',
    label: 'Healthy Vegetative Growth',
    category: 'Good Vigor',
    color: 'bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.7)]',
    textColor: 'text-teal-300',
    description: 'Normal vegetative stage growth. Strong near-infrared (NIR) cellular reflection and healthy nitrogen levels.'
  },
  {
    range: '0.30 – 0.50',
    label: 'Early Crop Stress Alert',
    category: 'Moderate Stress',
    color: 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.7)]',
    textColor: 'text-amber-400',
    description: 'Canopy thinning or localized moisture deficiency. Schedule targeted drip irrigation or foliar spray.'
  },
  {
    range: '0.00 – 0.30',
    label: 'Severe Foliar Decline / Bare Soil',
    category: 'Critical Risk',
    color: 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]',
    textColor: 'text-rose-400',
    description: 'Severe defoliation, standing waterlogging, or pathogen infection. Immediate agronomic intervention required.'
  },
];

export function NDVIExplainer() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-[#0c1422]/90 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.7)] relative overflow-hidden backdrop-blur-2xl">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="text-center mb-10 max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-400 font-mono uppercase">
              <Activity className="w-3.5 h-3.5" /> Multispectral Satellite Physics
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">
              Understanding <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400">Multi-Spectral Vigor</span> Science
            </h2>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed font-normal">
              Satellite indices quantify foliar vitality by computing optical reflectance across Near-Infrared (NIR), Red Edge, Red, and Shortwave Infrared (SWIR) wavebands:
            </p>

            <div className="inline-block bg-black/60 border border-emerald-500/30 px-5 py-2.5 rounded-2xl text-xs font-mono text-emerald-400 font-bold shadow-lg">
              NDVI = (NIR − Red) / (NIR + Red) • 10m Ground Resolution
            </div>
          </div>

          {/* 4 Vigor Bands */}
          <div className="space-y-3.5">
            {ndviScale.map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-md group"
              >
                <div className={`w-3 h-12 rounded-full shrink-0 ${item.color}`} />

                <div className="flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs font-bold ${item.textColor} bg-white/5 border border-white/10`}>
                        {item.category}
                      </Badge>
                      <span className="text-xs font-mono font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-lg border border-white/10">
                        {item.range}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Continuous Gradient Spectrum Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
            <div className="h-3.5 rounded-full overflow-hidden flex shadow-inner bg-black/60 p-0.5 border border-white/10">
              <div className="flex-1 bg-rose-500 rounded-l-full" />
              <div className="flex-1 bg-orange-500" />
              <div className="flex-1 bg-yellow-400" />
              <div className="flex-1 bg-teal-400" />
              <div className="flex-1 bg-emerald-400 rounded-r-full" />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-gray-400 px-1">
              <span className="text-rose-400 font-bold">0.0 (Bare Soil / Dead)</span>
              <span>0.25</span>
              <span className="text-yellow-400 font-bold">0.50 (Moderate)</span>
              <span>0.75</span>
              <span className="text-emerald-400 font-bold">1.0 (Peak Biomass)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
