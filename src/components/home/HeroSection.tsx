import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Satellite,
  ArrowRight,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Play,
  Leaf,
  BarChart2,
  CheckCircle2,
  Droplets,
  Pill,
  Zap,
  Activity,
  Scan,
  Radio,
  Flame
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<'ai' | 'satellite'>('ai');

  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-center overflow-hidden py-16 lg:py-24">
      {/* Dynamic Multi-Color Ambient Glow Orbs */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050911]/40 via-[#050911]/85 to-[#050911] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Floating Dynamic Badges */}
      <div className="hidden xl:block absolute top-28 right-[10%] animate-float" style={{ animationDelay: '0s' }}>
        <div className="p-4 rounded-2xl bg-[#0c1422]/90 border border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.25)] flex items-center gap-3 backdrop-blur-2xl">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
            <Scan className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Grad-CAM XAI Neural Engine</p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> 99.86% Validation Accuracy
            </p>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute bottom-36 left-[8%] animate-float" style={{ animationDelay: '3s' }}>
        <div className="p-4 rounded-2xl bg-[#081524]/90 border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.25)] flex items-center gap-3 backdrop-blur-2xl">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Sentinel-2 Multi-Spectral</p>
            <p className="text-[11px] text-cyan-300 font-mono">5 Bands: NDVI • EVI • SAVI • NDWI • NDRE</p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-center space-y-6">
          {/* Animated Header Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-purple-500/15 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.25)] animate-in fade-in zoom-in-95 duration-700">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-400 tracking-wider uppercase font-mono">
              AI Precision Agronomy & Multi-Spectral Earth Telemetry
            </span>
          </div>

          {/* Core Vibrant Title */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] animate-in fade-in slide-in-from-bottom-4 duration-700">
            Space-Age Crop Health &
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 via-cyan-400 to-indigo-400 drop-shadow-[0_0_35px_rgba(16,185,129,0.3)]">
              Deep Neural Leaf Diagnostics
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 font-normal">
            Instant 38-class plant pathology diagnosis with PyTorch Grad-CAM explainable visual heatmaps, 72-hour epidemiology spore forecasting, and 5-band satellite multi-spectral analytics.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Link to="/diagnose" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2.5 font-bold shadow-[0_0_30px_rgba(16,185,129,0.4)] text-sm px-8 py-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black group hover:scale-[1.02] transition-all">
                <Scan className="w-5 h-5" />
                Scan Leaf with AI & Grad-CAM
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link to="/analyze" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2.5 font-bold text-sm px-8 py-6 rounded-2xl border-white/20 hover:border-cyan-400/60 hover:bg-cyan-950/30 text-white hover:scale-[1.02] transition-all shadow-lg backdrop-blur-xl">
                <Satellite className="w-5 h-5 text-cyan-400" />
                Satellite Multi-Spectral Map
              </Button>
            </Link>
          </div>

          {/* Interactive Live Demo Simulator Window */}
          <div className="pt-8 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
            <div className="p-3 rounded-3xl bg-[#0c1422]/90 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
              {/* Tab Selector */}
              <div className="flex items-center justify-center gap-2 p-1.5 bg-black/40 rounded-2xl mb-3 border border-white/5">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'ai'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Scan className="w-3.5 h-3.5" />
                  Neural Leaf Scanner & Grad-CAM
                </button>
                <button
                  onClick={() => setActiveTab('satellite')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'satellite'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5" />
                  Sentinel-2 Multi-Spectral Spectrum
                </button>
              </div>

              {/* Tab 1: AI Scanner Preview */}
              {activeTab === 'ai' && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 relative rounded-xl overflow-hidden border border-emerald-500/30 aspect-square shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <img
                      src="/samples/tomato_early_blight.jpg"
                      alt="Sample Leaf Scan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-emerald-400 rounded-xl pointer-events-none animate-pulse" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/80 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/40 font-mono">
                      Grad-CAM Active
                    </span>
                  </div>

                  <div className="md:col-span-8 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Species</span>
                        <h4 className="font-bold text-base text-white">Tomato (Solanum lycopersicum)</h4>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40 text-[11px] font-bold">
                        Early Blight (99.8% Match)
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-400">MobileNetV3 Softmax Confidence</span>
                        <span className="text-emerald-400 font-bold font-mono">99.86%</span>
                      </div>
                      <Progress value={99.86} className="h-2 bg-white/10" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate"><strong>Rx:</strong> Mancozeb 75% WP @ 2.5 g/L</span>
                      </div>
                      <Link to="/diagnose" className="text-[11px] text-emerald-400 font-bold hover:underline shrink-0 ml-2">
                        Test Full Scanner →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Satellite NDVI Preview */}
              {activeTab === 'satellite' && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 bg-gradient-to-br from-emerald-950/80 to-cyan-950/80 rounded-xl p-3 border border-cyan-500/30 text-center flex flex-col justify-center items-center aspect-square shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    <Activity className="w-8 h-8 text-cyan-400 mb-1 animate-pulse" />
                    <div className="font-display text-2xl font-bold text-cyan-300 font-mono">0.84</div>
                    <div className="text-[10px] text-cyan-200 font-semibold uppercase">Optimal Canopy Vigor</div>
                  </div>

                  <div className="md:col-span-8 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Field Zone</span>
                        <h4 className="font-bold text-base text-white">Punjab Organic Wheat Field (12.4 ha)</h4>
                      </div>
                      <Badge className="text-[11px] text-cyan-400 border-cyan-500/40 bg-cyan-500/10 font-bold">
                        Vigor: Peak
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-400">Chlorophyll Light Absorption Index</span>
                        <span className="text-cyan-400 font-bold font-mono">84% Peak Density</span>
                      </div>
                      <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400 shadow-sm" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="truncate">Cloud Masking Applied • Zero Water Stress</span>
                      </div>
                      <Link to="/analyze" className="text-[11px] text-cyan-400 font-bold hover:underline shrink-0 ml-2">
                        Open Map →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verified Multi-Color Stats Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-8 max-w-4xl mx-auto pt-6 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-[#0c1422]/80 border border-emerald-500/20 text-center hover:border-emerald-500/50 transition-all group shadow-lg hover:-translate-y-1">
              <div className="font-display text-2xl md:text-3xl font-extrabold text-emerald-400 group-hover:scale-105 transition-transform">38</div>
              <div className="text-xs text-gray-300 mt-0.5">Crop Disease Classes</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#081524]/80 border border-cyan-500/20 text-center hover:border-cyan-500/50 transition-all group shadow-lg hover:-translate-y-1">
              <div className="font-display text-2xl md:text-3xl font-extrabold text-cyan-400 group-hover:scale-105 transition-transform">54,000+</div>
              <div className="text-xs text-gray-300 mt-0.5">Balanced Images Trained</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1a1309]/80 border border-amber-500/20 text-center hover:border-amber-500/50 transition-all group shadow-lg hover:-translate-y-1">
              <div className="font-display text-2xl md:text-3xl font-extrabold text-amber-400 group-hover:scale-105 transition-transform">99.86%</div>
              <div className="text-xs text-gray-300 mt-0.5">Validation Accuracy</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#150d24]/80 border border-purple-500/20 text-center hover:border-purple-500/50 transition-all group shadow-lg hover:-translate-y-1">
              <div className="font-display text-2xl md:text-3xl font-extrabold text-purple-400 group-hover:scale-105 transition-transform">8 Langs</div>
              <div className="text-xs text-gray-300 mt-0.5">Vernacular Voice AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050911] to-transparent pointer-events-none" />
    </section>
  );
}
