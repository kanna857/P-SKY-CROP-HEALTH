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
      <div className="space-y-12">
        <HeroSection />

        {/* Vibrant Multi-Color Telemetry Bar */}
        <section className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c1a16] to-[#081210] border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.15)] flex flex-col items-center text-center space-y-1 hover:scale-105 transition-transform">
              <span className="text-2xl sm:text-3xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                99.86%
              </span>
              <span className="text-xs font-semibold text-white">Grad-CAM Neural Accuracy</span>
              <span className="text-[10px] text-emerald-400 font-mono">MobileNetV3 PyTorch</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#081726] to-[#06101c] border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col items-center text-center space-y-1 hover:scale-105 transition-transform">
              <span className="text-2xl sm:text-3xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                5 Bands
              </span>
              <span className="text-xs font-semibold text-white">Sentinel-2 Earth Telemetry</span>
              <span className="text-[10px] text-cyan-300 font-mono">NDVI • EVI • NDWI • SAVI</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1208] to-[#120c04] border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.15)] flex flex-col items-center text-center space-y-1 hover:scale-105 transition-transform">
              <span className="text-2xl sm:text-3xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
                38 Crops
              </span>
              <span className="text-xs font-semibold text-white">Pathology Class Library</span>
              <span className="text-[10px] text-amber-300 font-mono">Instant Spray Rx</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#160c24] to-[#0e0718] border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.15)] flex flex-col items-center text-center space-y-1 hover:scale-105 transition-transform">
              <span className="text-2xl sm:text-3xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                SkySearch
              </span>
              <span className="text-xs font-semibold text-white">Universal Web Engine</span>
              <span className="text-[10px] text-purple-300 font-mono">Wikipedia Live API</span>
            </div>
          </div>
        </section>

        <FeaturesSection />
        <NDVIExplainer />

        {/* Primary CTA Section with Vibrant Rainbow Aurora Styling */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="p-8 md:p-14 rounded-3xl text-center bg-gradient-to-br from-[#0c1422]/95 via-[#0d1828]/95 to-[#101428]/95 border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden space-y-6">
              {/* Vibrant Atmospheric Aurora Glows */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-purple-500/15 border border-emerald-500/30 text-xs font-semibold font-mono">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-300 font-bold">
                    Start Diagnosing & Monitoring Your Crops
                  </span>
                </div>

                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto">
                  Protect Your Harvest with <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 via-cyan-400 to-indigo-400">Next-Gen Agro AI</span>
                </h2>

                <p className="text-xs md:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Scan diseased leaves with instant chemical/organic prescriptions or track multi-acre field vigor with Sentinel-2 satellite NDVI imagery.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                  <Link to="/diagnose" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-[0_0_30px_rgba(16,185,129,0.35)] text-xs px-8 py-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black">
                      <Stethoscope className="w-4 h-4" />
                      Open AI Disease Scanner
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link to="/analyze" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 font-bold text-xs px-8 py-6 rounded-2xl border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/30 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                      <Satellite className="w-4 h-4 text-cyan-400" />
                      Launch Satellite Map
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Free & Open Access
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-400 animate-leaf-sway" /> Sub-20ms MobileNetV3 AI
                  </span>
                  <span>•</span>
                  <span>Zero Installation Required</span>
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
