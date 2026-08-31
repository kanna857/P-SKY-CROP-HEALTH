import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Satellite, ArrowRight, Stethoscope, Sparkles, ShieldCheck, Play, Leaf, BarChart2, CheckCircle2, Droplets, Pill, Zap, Activity } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<'ai' | 'satellite'>('ai');

  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-center overflow-hidden py-16 lg:py-24">
      {/* Dynamic Mesh & Glow Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/80 to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2.5s' }} />

      {/* Floating Accent Badges */}
      <div className="hidden xl:block absolute top-28 right-[10%] animate-float" style={{ animationDelay: '0s' }}>
        <div className="glass-card p-4 rounded-2xl border-primary/30 shadow-[0_0_30px_rgba(74,222,128,0.15)] flex items-center gap-3 backdrop-blur-2xl">
          <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">38 Crop Diseases</p>
            <p className="text-[11px] text-green-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" /> 99.86% AI Accuracy
            </p>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute bottom-36 left-[8%] animate-float" style={{ animationDelay: '3s' }}>
        <div className="glass-card p-4 rounded-2xl border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center gap-3 backdrop-blur-2xl">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Sentinel-2 Earth Sensor</p>
            <p className="text-[11px] text-muted-foreground">10m Multispectral NDVI</p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-center space-y-6">
          {/* Animated Header Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 shadow-[0_0_20px_rgba(74,222,128,0.2)] animate-in fade-in zoom-in-95 duration-700">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-bold text-primary tracking-wider uppercase font-mono">
              Next-Gen Agro AI & Earth Observation
            </span>
          </div>

          {/* Core Title */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08] animate-in fade-in slide-in-from-bottom-4 duration-700">
            AI-Powered Crop Health
            <br />
            <span className="text-gradient">From Space to Single Leaves</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700">
            Diagnose 38 plant diseases instantly with deep neural vision, receive certified fungicide & organic dosages, and track field canopy health via Sentinel-2 satellite NDVI mapping.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Link to="/diagnose" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2.5 font-bold shadow-[0_0_25px_rgba(74,222,128,0.3)] text-sm px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground group hover:scale-[1.02] transition-all">
                <Stethoscope className="w-5 h-5" />
                Scan Crop Leaf (AI Diagnosis)
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link to="/analyze" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2.5 font-bold text-sm px-8 py-6 rounded-xl border-border/80 hover:border-primary/50 hover:bg-primary/5 text-foreground hover:scale-[1.02] transition-all">
                <Satellite className="w-5 h-5 text-primary" />
                Analyze Satellite Field
              </Button>
            </Link>
          </div>

          {/* Interactive Live Demo Simulator Window */}
          <div className="pt-8 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
            <div className="glass-card p-2 rounded-2xl border-primary/30 shadow-2xl bg-card/70 backdrop-blur-2xl">
              {/* Tab Selector */}
              <div className="flex items-center justify-center gap-2 p-1.5 bg-secondary/50 rounded-xl mb-3">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'ai'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Neural Leaf Scanner Preview
                </button>
                <button
                  onClick={() => setActiveTab('satellite')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'satellite'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5" />
                  Sentinel-2 NDVI Spectrum Preview
                </button>
              </div>

              {/* Tab 1: AI Scanner Preview */}
              {activeTab === 'ai' && (
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 relative rounded-lg overflow-hidden border border-border/60 aspect-square">
                    <img
                      src="/samples/tomato_early_blight.jpg"
                      alt="Sample Leaf Scan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none animate-pulse" />
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-black/70 text-primary px-2 py-0.5 rounded">
                      Live Reticle
                    </span>
                  </div>

                  <div className="md:col-span-8 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Species</span>
                        <h4 className="font-bold text-base text-foreground">Tomato (Solanum lycopersicum)</h4>
                      </div>
                      <Badge variant="destructive" className="text-[11px] font-bold">
                        Early Blight (96.5% Match)
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">MobileNetV3 Softmax Confidence</span>
                        <span className="text-primary font-bold">96.5%</span>
                      </div>
                      <Progress value={96.5} className="h-2 bg-secondary" />
                    </div>

                    <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-foreground flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate"><strong>Rx:</strong> Mancozeb 75% WP @ 2.5 g/L</span>
                      </div>
                      <Link to="/diagnose" className="text-[11px] text-primary font-bold hover:underline shrink-0 ml-2">
                        Test Full Scanner →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Satellite NDVI Preview */}
              {activeTab === 'satellite' && (
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 bg-emerald-950/60 rounded-lg p-3 border border-emerald-500/30 text-center flex flex-col justify-center items-center aspect-square">
                    <Activity className="w-8 h-8 text-emerald-400 mb-1 animate-pulse" />
                    <div className="font-display text-2xl font-bold text-emerald-400">0.82</div>
                    <div className="text-[10px] text-emerald-300 font-semibold uppercase">Very Healthy Canopy</div>
                  </div>

                  <div className="md:col-span-8 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Field Zone</span>
                        <h4 className="font-bold text-base text-foreground">Punjab Organic Wheat Field (12.4 ha)</h4>
                      </div>
                      <Badge variant="outline" className="text-[11px] text-emerald-400 border-emerald-500/40 bg-emerald-500/10 font-bold">
                        Vigor: Optimal
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">Chlorophyll Light Absorption Index</span>
                        <span className="text-emerald-400 font-bold">82% Peak Density</span>
                      </div>
                      <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500" />
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">Cloud Masking Applied • Zero Water Stress</span>
                      </div>
                      <Link to="/analyze" className="text-[11px] text-emerald-400 font-bold hover:underline shrink-0 ml-2">
                        Open Map →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verified Stats Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-8 max-w-4xl mx-auto pt-6 border-t border-border/40">
            <div className="glass-card p-4 rounded-xl text-center border-border/40 hover:border-primary/40 transition-colors">
              <div className="font-display text-2xl md:text-3xl font-bold text-primary">38</div>
              <div className="text-xs text-muted-foreground mt-0.5">Crop Disease Classes</div>
            </div>

            <div className="glass-card p-4 rounded-xl text-center border-border/40 hover:border-emerald-400/40 transition-colors">
              <div className="font-display text-2xl md:text-3xl font-bold text-emerald-400">38,000</div>
              <div className="text-xs text-muted-foreground mt-0.5">Balanced Images Trained</div>
            </div>

            <div className="glass-card p-4 rounded-xl text-center border-border/40 hover:border-yellow-400/40 transition-colors">
              <div className="font-display text-2xl md:text-3xl font-bold text-yellow-400">99.86%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Model Validation Accuracy</div>
            </div>

            <div className="glass-card p-4 rounded-xl text-center border-border/40 hover:border-blue-400/40 transition-colors">
              <div className="font-display text-2xl md:text-3xl font-bold text-blue-400">&lt;20ms</div>
              <div className="text-xs text-muted-foreground mt-0.5">Real-time Inference Speed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
