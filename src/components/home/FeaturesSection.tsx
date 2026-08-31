import { Stethoscope, Satellite, Pill, ShieldAlert, Volume2, Bot, BarChart3, CloudOff, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Stethoscope,
    title: 'AI Leaf Pathology Diagnosis',
    description: 'Trained on 38,000 balanced images across 38 crop diseases with PyTorch MobileNetV3. Provides sub-20ms inference and confidence rankings.',
    link: '/diagnose',
    badge: 'Deep Learning',
    color: 'text-primary bg-primary/10 border-primary/20'
  },
  {
    icon: Pill,
    title: 'Precision Agronomic Prescriptions',
    description: 'Instant chemical fungicide formulations with exact g/L water dilution, organic biocontrols, and printable PDF prescription cards with WhatsApp share.',
    link: '/diagnose',
    badge: 'ICAR / UC Davis Aligned',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    icon: Satellite,
    title: 'Multispectral Satellite Analytics',
    description: 'Normalized Difference Vegetation Index (NDVI) mapping from Sentinel-2 satellites with automatic cloud pixel masking for field-level vigor tracking.',
    link: '/analyze',
    badge: '10m Resolution',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  },
  {
    icon: ShieldAlert,
    title: 'Weather-Driven Disease Risk Radar',
    description: 'Correlates ambient relative humidity, temperature, and rainfall forecasts to calculate real-time fungal and bacterial outbreak risk indexes.',
    link: '/diagnose',
    badge: 'Proactive Alerting',
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
  },
  {
    icon: Volume2,
    title: 'Multilingual Farmer Audio Readout',
    description: 'Hands-free voice assistant reading out plant health status, fungicide dosages, and prevention steps in English, Hindi (हिन्दी), Telugu (తెలుగు), and Tamil (தமிழ்).',
    link: '/diagnose',
    badge: 'Accessibility',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  },
  {
    icon: Bot,
    title: 'AI Conversational Agronomist',
    description: '24/7 agricultural AI chatbot answering crop management questions, soil fertility advice, spray schedules, and seasonal planting strategies.',
    link: '/chatbot',
    badge: 'Interactive AI',
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            Comprehensive Agro-Tech Suite
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Precision Agricultural <span className="text-gradient">Capabilities</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Everything modern farmers, agronomists, and agricultural researchers need to monitor field vigor, detect pathogens, and maximize harvest yields.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card p-6 rounded-2xl group hover:border-primary/40 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors border border-border/50">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${feature.color}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-border/40">
                  <Link
                    to={feature.link}
                    className="text-xs font-semibold text-primary flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                  >
                    <span>Launch Feature</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
