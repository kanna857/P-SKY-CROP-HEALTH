import { Activity, ShieldCheck, Droplets, Sun, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ndviScale = [
  {
    range: '0.70 – 1.00',
    label: 'Optimal Chlorophyll Density',
    category: 'Excellent Vigor',
    color: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    textColor: 'text-emerald-400',
    description: 'Dense canopy biomass, optimal photosynthetic absorption, zero moisture or nutrient stress.'
  },
  {
    range: '0.50 – 0.70',
    label: 'Healthy Green Canopy',
    category: 'Good Health',
    color: 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]',
    textColor: 'text-green-400',
    description: 'Normal vegetative stage growth. Good chlorophyll reflection in near-infrared (NIR) spectrum.'
  },
  {
    range: '0.30 – 0.50',
    label: 'Early Crop Stress Alert',
    category: 'Moderate Stress',
    color: 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]',
    textColor: 'text-yellow-400',
    description: 'Canopy thinning or localized moisture deficiency. Schedule targeted irrigation or foliar micronutrient spray.'
  },
  {
    range: '0.00 – 0.30',
    label: 'Severe Foliar Decline / Bare Soil',
    category: 'Critical Risk',
    color: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    textColor: 'text-red-400',
    description: 'Severe defoliation, standing waterlogging, or disease infection. Urgent field scout required.'
  },
];

export function NDVIExplainer() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="glass-card p-8 md:p-12 rounded-3xl border-primary/25 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="text-center mb-10 max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Activity className="w-3.5 h-3.5" /> Multispectral Science
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Understanding <span className="text-gradient">Satellite NDVI</span> Physics
            </h2>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Normalized Difference Vegetation Index calculates chlorophyll absorption by comparing Near-Infrared (NIR) light reflection against Red light absorption:
            </p>

            <div className="inline-block bg-secondary/50 border border-border/50 px-4 py-2 rounded-xl text-xs font-mono text-primary font-bold">
              NDVI = (NIR − Red) / (NIR + Red)
            </div>
          </div>

          {/* 4 Vigor Bands */}
          <div className="space-y-3.5">
            {ndviScale.map((item, idx) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 border border-border/40 hover:border-primary/40 transition-all duration-300 shadow-sm"
              >
                <div className={`w-3 h-12 rounded-full shrink-0 ${item.color}`} />

                <div className="flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-foreground text-sm flex items-center gap-2">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs font-semibold ${item.textColor} border-current/30 bg-current/10`}>
                        {item.category}
                      </Badge>
                      <span className="text-xs font-mono font-bold text-foreground bg-background/60 px-2 py-0.5 rounded">
                        {item.range}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Continuous Gradient Spectrum Bar */}
          <div className="mt-8 pt-6 border-t border-border/40 space-y-2">
            <div className="h-3 rounded-full overflow-hidden flex shadow-inner bg-black/40">
              <div className="flex-1 bg-red-500" />
              <div className="flex-1 bg-orange-500" />
              <div className="flex-1 bg-yellow-400" />
              <div className="flex-1 bg-green-500" />
              <div className="flex-1 bg-emerald-400" />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-muted-foreground px-1">
              <span className="text-red-400 font-semibold">0.0 (Dead / Bare Soil)</span>
              <span>0.25</span>
              <span className="text-yellow-400 font-semibold">0.50 (Moderate)</span>
              <span>0.75</span>
              <span className="text-emerald-400 font-semibold">1.0 (Peak Biomass)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
