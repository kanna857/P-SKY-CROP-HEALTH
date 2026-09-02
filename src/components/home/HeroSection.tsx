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
  Flame,
  Crosshair,
  Target,
  Cpu,
  Gauge
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<'ai' | 'satellite'>('ai');

  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-center overflow-hidden py-16 lg:py-24">
      {/* Cinematic Agriculture Background with Subtle Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050911]/60 via-[#050911]/90 to-[#050911] pointer-events-none" />
      
      {/* Sci-Fi Ambient Aurora Glows */}
      <div className="absolute top-1/4 left-1/4 w-[650px] h-[650px] bg-emerald-400/25 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[550px] h-[550px] bg-cyan-400/25 rounded-full blur-[130px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/3 w-[450px] h-[450px] bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-amber-400/20 rounded-full blur-[130px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '6s' }} />

      {/* Floating Aerospace Telemetry HUD Badges */}
      <div className="hidden xl:block absolute top-28 right-[8%] animate-float" style={{ animationDelay: '0s' }}>
        <div className="hud-panel hud-bracket p-4 flex items-center gap-3 shadow-[0_0_35px_rgba(16,185,129,0.3)]">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
            <Scan className="w-5 h-5 animate-pulse" />
          </div>
          <div className="font-mono">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Grad-CAM XAI Neural Engine</p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> 99.86% Validation Accuracy
            </p>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute bottom-36 left-[6%] animate-float" style={{ animationDelay: '3s' }}>
        <div className="hud-panel hud-bracket p-4 flex items-center gap-3 shadow-[0_0_35px_rgba(6,182,212,0.3)]">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
            <Satellite className="w-5 h-5" />
          </div>
          <div className="font-mono">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Sentinel-2B Constellation</p>
            <p className="text-[11px] text-cyan-300">10m GSD • NDVI • EVI • SAVI • NDWI</p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-center space-y-6">
          
          {/* Aerospace Mission Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold font-mono tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300">
              ORBITAL SATELLITE TELEMETRY & PYTORCH PLANT PATHOLOGY STUDIO
            </span>
          </div>

          {/* Core Vibrant Title */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Space-Age Crop Health &
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 via-cyan-400 to-indigo-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.35)]">
              Deep Neural Diagnostics
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-mono">
            Automated 38-class plant pathology classification with PyTorch Grad-CAM explainable visual heatmaps, 72-hour epidemiology spore forecasting, and 10m Sentinel-2 multi-spectral Earth observation.
          </p>

          {/* Primary Action Buttons with Cyber Styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/diagnose" className="w-full sm:w-auto">
              <button className="cyber-btn w-full sm:w-auto flex items-center justify-center gap-2.5 text-sm py-4 px-8 cursor-pointer">
                <Scan className="w-5 h-5 text-black" />
                SCAN LEAF WITH AI & GRAD-CAM
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </Link>

            <Link to="/analyze" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2.5 font-bold text-sm px-8 py-6 rounded-xl border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-950/40 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.25)] font-mono">
                <Satellite className="w-5 h-5 text-cyan-400" />
                SATELLITE MULTI-SPECTRAL MAP
              </Button>
            </Link>
          </div>

          {/* Interactive Live Demo Simulator Window with HUD Bracket Frame */}
          <div className="pt-6 max-w-3xl mx-auto">
            <div className="hud-panel hud-bracket p-4 sm:p-5 rounded-3xl space-y-4">
              {/* Mission Mode Switcher */}
              <div className="flex items-center justify-center gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/10 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                    activeTab === 'ai'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Scan className="w-3.5 h-3.5" />
                  Neural Leaf Scanner & Grad-CAM
                </button>
                <button
                  onClick={() => setActiveTab('satellite')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                    activeTab === 'satellite'
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-black shadow-lg shadow-cyan-500/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5" />
                  Sentinel-2 Multi-Spectral Spectrum
                </button>
              </div>

              {/* Tab 1: AI Scanner Preview with Laser Sweep */}
              {activeTab === 'ai' && (
                <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative overflow-hidden">
                  {/* High-Tech Scanning Laser Sweep */}
                  <div className="hud-laser-line" />

                  <div className="md:col-span-4 relative rounded-xl overflow-hidden border-2 border-emerald-500/50 aspect-square shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                    <img
                      src="/samples/tomato_early_blight.jpg"
                      alt="Sample Leaf Scan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-emerald-400 rounded-xl pointer-events-none animate-pulse" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/90 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/50 font-mono">
                      Grad-CAM Hotspot
                    </span>
                  </div>

                  <div className="md:col-span-8 space-y-3 font-mono">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">CROP SPECIES</span>
                        <h4 className="font-bold text-base text-white font-sans">Tomato (Solanum lycopersicum)</h4>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40 text-[11px] font-bold font-mono">
                        Early Blight (99.86% Match)
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-400">MobileNetV3 Softmax Confidence</span>
                        <span className="text-emerald-400 font-bold">99.86%</span>
                      </div>
                      <Progress value={99.86} className="h-2 bg-white/10" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate"><strong>Rx:</strong> Mancozeb 75% WP @ 2.5 g/L</span>
                      </div>
                      <Link to="/diagnose" className="text-[11px] text-emerald-400 font-bold hover:underline shrink-0 ml-2">
                        Open Scanner →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Satellite NDVI Preview with Laser Sweep */}
              {activeTab === 'satellite' && (
                <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative overflow-hidden">
                  {/* High-Tech Scanning Laser Sweep */}
                  <div className="hud-laser-line" />

                  <div className="md:col-span-4 bg-gradient-to-br from-emerald-950/90 to-cyan-950/90 rounded-xl p-3 border-2 border-cyan-500/50 text-center flex flex-col justify-center items-center aspect-square shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                    <Activity className="w-8 h-8 text-cyan-400 mb-1 animate-pulse" />
                    <div className="font-display text-3xl font-extrabold text-cyan-300 font-mono">0.84</div>
                    <div className="text-[10px] text-cyan-200 font-semibold uppercase font-mono">Optimal Foliar Vigor</div>
                  </div>

                  <div className="md:col-span-8 space-y-3 font-mono">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">OBSERVATION FIELD</span>
                        <h4 className="font-bold text-base text-white font-sans">Punjab Organic Wheat Field (12.4 ha)</h4>
                      </div>
                      <Badge className="text-[11px] text-cyan-400 border-cyan-500/40 bg-cyan-500/10 font-bold">
                        Vigor: Peak
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-400">Chlorophyll Light Absorption Index</span>
                        <span className="text-cyan-400 font-bold">84% Peak Density</span>
                      </div>
                      <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400 shadow-sm" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-white flex items-center justify-between">
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

          {/* Aerospace HUD Telemetry Counters Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-8 max-w-4xl mx-auto pt-6 border-t border-white/10">
            <div className="hud-panel p-4 text-center border-emerald-500/30 hover:border-emerald-500/60 transition-all group">
              <div className="font-display text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono">38</div>
              <div className="text-xs text-gray-300 font-mono mt-0.5 uppercase tracking-wider">Crop Disease Classes</div>
            </div>

            <div className="hud-panel p-4 text-center border-cyan-500/30 hover:border-cyan-500/60 transition-all group">
              <div className="font-display text-2xl md:text-3xl font-extrabold text-cyan-400 font-mono">54,000+</div>
              <div className="text-xs text-gray-300 font-mono mt-0.5 uppercase tracking-wider">Images Trained</div>
            </div>

            <div className="hud-panel p-4 text-center border-amber-500/30 hover:border-amber-500/60 transition-all group">
              <div className="font-display text-2xl md:text-3xl font-extrabold text-amber-400 font-mono">99.86%</div>
              <div className="text-xs text-gray-300 font-mono mt-0.5 uppercase tracking-wider">Validation Accuracy</div>
            </div>

            <div className="hud-panel p-4 text-center border-purple-500/30 hover:border-purple-500/60 transition-all group">
              <div className="font-display text-2xl md:text-3xl font-extrabold text-purple-400 font-mono">8 Langs</div>
              <div className="text-xs text-gray-300 font-mono mt-0.5 uppercase tracking-wider">Vernacular Voice AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050911] to-transparent pointer-events-none" />
    </section>
  );
}
