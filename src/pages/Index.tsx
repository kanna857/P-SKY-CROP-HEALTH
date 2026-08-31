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
        <FeaturesSection />
        <NDVIExplainer />

        {/* Primary CTA Section with Nature Styling */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="p-8 md:p-14 rounded-3xl text-center bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-6">
              {/* Subtle Atmospheric Glow */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 font-mono">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} /> Start Diagnosing Your Crops Today
                </div>

                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto">
                  Protect Your Harvest with <span className="text-emerald-400">Next-Gen Agro AI</span>
                </h2>

                <p className="text-xs md:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Scan diseased leaves with instant chemical/organic prescriptions or track multi-acre field vigor with Sentinel-2 satellite NDVI imagery.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                  <Link to="/diagnose" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] text-xs px-8 py-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black">
                      <Stethoscope className="w-4 h-4" />
                      Open AI Disease Scanner
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link to="/analyze" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 font-bold text-xs px-8 py-6 rounded-xl border-white/20 hover:border-emerald-500/40 text-white">
                      <Satellite className="w-4 h-4 text-emerald-400" />
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
