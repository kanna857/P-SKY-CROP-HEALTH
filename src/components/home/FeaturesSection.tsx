import {
  Stethoscope,
  Satellite,
  Pill,
  ShieldAlert,
  Volume2,
  Bot,
  BarChart3,
  CloudOff,
  FileText,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
  Flame,
  Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Stethoscope,
    title: 'Explainable AI & Grad-CAM Heatmaps',
    description: 'PyTorch MobileNetV3 (99.86% val acc) with real-time class activation maps showing exact lesion hotspots and infection bounding boxes.',
    link: '/diagnose',
    badge: 'Grad-CAM XAI',
    badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    cardBorder: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    iconStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    icon: Satellite,
    title: 'Multi-Spectral Satellite Engine',
    description: 'Real-time 5-band Sentinel-2 Earth observation calculating NDVI, EVI, SAVI, NDWI, and NDRE with automated cloud pixel filtering.',
    link: '/analyze',
    badge: '5 Spectral Indices',
    badgeStyle: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    cardBorder: 'hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    iconStyle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    icon: ShieldAlert,
    title: '72-Hour Micro-Climate Epidemiology',
    description: 'Simulates diurnal spore germination and leaf wetness curves, pinpointing the optimal fungicide spray window before spore dissemination.',
    link: '/diagnose#radar',
    badge: 'Spore Forecaster',
    badgeStyle: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    cardBorder: 'hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]',
    iconStyle: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  },
  {
    icon: Volume2,
    title: '8-Language Vernacular Voice AI',
    description: 'Hands-free speech recognition and audio synthesis speaking diagnoses and spray dosages in English, Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, and Spanish.',
    link: '/chatbot',
    badge: 'Voice Assistant',
    badgeStyle: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    cardBorder: 'hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    iconStyle: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  {
    icon: FileText,
    title: 'Certified Agronomist PDF Prescriptions',
    description: 'Printable official Rx certificates with dual Chemical vs Organic dosages, water tank dilution calculator, QR code verification, and WhatsApp export.',
    link: '/diagnose',
    badge: '1-Click PDF Rx',
    badgeStyle: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    cardBorder: 'hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
    iconStyle: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  {
    icon: CloudOff,
    title: 'Offline PWA & In-Browser Edge AI',
    description: 'Diagnose leaf infections directly on mobile devices in remote agricultural fields without internet connection using client-side edge heuristics.',
    link: '/diagnose',
    badge: 'Zero-Latency Edge',
    badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    cardBorder: 'hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    iconStyle: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-purple-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400 font-mono uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Precision Agriculture Suite
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            State-of-the-Art <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400">AI Intelligence</span>
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed font-normal">
            An end-to-end precision ecosystem uniting deep computer vision, satellite telemetry, vernacular speech recognition, and micro-climate epidemiology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`p-6 rounded-3xl bg-[#0c1422]/85 border border-white/10 ${feature.cardBorder} transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1 backdrop-blur-2xl group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feature.iconStyle} group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${feature.badgeStyle}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-white/10">
                  <Link
                    to={feature.link}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                  >
                    <span>Launch Module</span>
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
