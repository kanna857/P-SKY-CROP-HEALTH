import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { NDVIExplainer } from '@/components/home/NDVIExplainer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Stethoscope, Satellite, Sparkles, ShieldCheck, Leaf, Sprout } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-16">
        <HeroSection />

        {/* Aerospace Telemetry Sensor Array */}
        <section className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="hud-panel hud-bracket p-5 flex flex-col items-center text-center space-y-1.5 hover:scale-105 transition-all shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <span className="text-2xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                99.86%
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Grad-CAM Neural Acc</span>
              <span className="text-[10px] text-emerald-300/80 font-mono">MobileNetV3 PyTorch</span>
            </div>

            <div className="hud-panel hud-bracket p-5 flex flex-col items-center text-center space-y-1.5 hover:scale-105 transition-all shadow-[0_0_25px_rgba(6,182,212,0.2)]">
              <span className="text-2xl sm:text-4xl font-extrabold font-mono text-cyan-400">
                5 Bands
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Sentinel-2 Telemetry</span>
              <span className="text-[10px] text-cyan-300/80 font-mono">NDVI • EVI • NDWI • SAVI</span>
            </div>

            <div className="hud-panel hud-bracket p-5 flex flex-col items-center text-center space-y-1.5 hover:scale-105 transition-all shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <span className="text-2xl sm:text-4xl font-extrabold font-mono text-amber-400">
                38 Classes
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Plant Pathology</span>
              <span className="text-[10px] text-amber-300/80 font-mono">Instant Spray Rx</span>
            </div>

            <div className="hud-panel hud-bracket p-5 flex flex-col items-center text-center space-y-1.5 hover:scale-105 transition-all shadow-[0_0_25px_rgba(168,85,247,0.2)]">
              <span className="text-2xl sm:text-4xl font-extrabold font-mono text-purple-400">
                8 Langs
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Voice Synthesizer</span>
              <span className="text-[10px] text-purple-300/80 font-mono">Neural Multilingual TTS</span>
            </div>
          </div>
        </section>

        <FeaturesSection />
        <NDVIExplainer />

        {/* Primary CTA Section with Aerospace Command Deck */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="hud-panel-emerald hud-bracket p-8 md:p-14 text-center relative overflow-hidden space-y-6">
              {/* Vibrant Atmospheric Aurora Glows */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-emerald-500/40 text-xs font-semibold font-mono">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300 font-bold uppercase tracking-wider">
                    AUTONOMOUS CROP HEALTH TELEMETRY SYSTEM
                  </span>
                </div>

                <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
                  Protect Your Harvest with{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 via-cyan-400 to-indigo-300">
                    Next-Gen Aerospace AI
                  </span>
                </h2>

                <p className="text-xs md:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed font-mono">
                  Scan diseased leaves with instant chemical/organic prescriptions or track multi-acre field vigor with 10m Sentinel-2 satellite multi-spectral telemetry.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <Link to="/diagnose" className="w-full sm:w-auto">
                    <button className="cyber-btn w-full sm:w-auto flex items-center justify-center gap-2 text-xs py-4 px-8 cursor-pointer">
                      <Stethoscope className="w-4 h-4 text-black" />
                      OPEN AI LEAF SCANNER
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                  </Link>

                  <Link to="/analyze" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 font-bold text-xs px-8 py-6 rounded-xl border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] font-mono">
                      <Satellite className="w-4 h-4 text-cyan-400" />
                      LAUNCH SATELLITE HUD
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Free & Open Access
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-400 animate-leaf-sway" /> Sub-20ms MobileNetV3 AI
                  </span>
                  <span>•</span>
                  <span>Copernicus STAC Synced</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
