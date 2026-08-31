import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CameraUpload } from '@/components/analyze/CameraUpload';
import { DiseaseRiskWidget } from '@/components/analyze/DiseaseRiskWidget';
import { 
  Sparkles, 
  Leaf, 
  Activity,
  Clock,
  Scan,
  Crosshair,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SampleLeaf {
  id: string;
  name: string;
  plant: string;
  category: 'solanaceae' | 'orchard' | 'cereals' | 'all';
  disease: string;
  imageSrc: string;
  tag: string;
  badgeBg: string;
}

const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'tomato-early-blight',
    name: 'Tomato Early Blight',
    plant: 'Tomato',
    category: 'solanaceae',
    disease: 'Alternaria solani',
    imageSrc: '/samples/tomato_early_blight.jpg',
    tag: 'Fungal Infection',
    badgeBg: 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
  },
  {
    id: 'apple-scab',
    name: 'Apple Scab',
    plant: 'Apple',
    category: 'orchard',
    disease: 'Venturia inaequalis',
    imageSrc: '/samples/apple_scab.jpg',
    tag: 'Leaf Lesions',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
  },
  {
    id: 'corn-rust',
    name: 'Corn Common Rust',
    plant: 'Corn (Maize)',
    category: 'cereals',
    disease: 'Puccinia sorghi',
    imageSrc: '/samples/corn_rust.jpg',
    tag: 'Puccinia Fungus',
    badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
  },
  {
    id: 'grape-black-rot',
    name: 'Grape Black Rot',
    plant: 'Grape',
    category: 'orchard',
    disease: 'Guignardia bidwellii',
    imageSrc: '/samples/grape_black_rot.jpg',
    tag: 'Necrotic Rot',
    badgeBg: 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
  },
  {
    id: 'pepper-bacterial-spot',
    name: 'Pepper Bacterial Spot',
    plant: 'Bell Pepper',
    category: 'solanaceae',
    disease: 'Xanthomonas campestris',
    imageSrc: '/samples/pepper_bacterial_spot.jpg',
    tag: 'Bacterial Spot',
    badgeBg: 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
  },
  {
    id: 'potato-healthy',
    name: 'Potato Healthy Leaf',
    plant: 'Potato',
    category: 'solanaceae',
    disease: 'None (Healthy)',
    imageSrc: '/samples/potato_healthy.jpg',
    tag: '100% Healthy',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
  },
  {
    id: 'rice-blast',
    name: 'Rice Blast',
    plant: 'Rice',
    category: 'cereals',
    disease: 'Magnaporthe oryzae',
    imageSrc: '/samples/rice_blast.jpg',
    tag: 'Fungal Blast',
    badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
  },
  {
    id: 'soybean-rust',
    name: 'Soybean Rust',
    plant: 'Soybean',
    category: 'cereals',
    disease: 'Phakopsora pachyrhizi',
    imageSrc: '/samples/soybean_rust.jpg',
    tag: 'Fungal Infection',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
  }
];

const categories = [
  { id: 'all', label: 'All Crops' },
  { id: 'solanaceae', label: 'Solanaceae' },
  { id: 'orchard', label: 'Orchard Fruits' },
  { id: 'cereals', label: 'Cereals & Legumes' },
];

const DiagnosePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [sampleTrigger, setSampleTrigger] = useState<{ file: File; preview: string } | null>(null);

  const filteredLeaves = SAMPLE_LEAVES.filter(
    (leaf) => selectedCategory === 'all' || leaf.category === selectedCategory
  );

  const handleSelectSample = async (sample: SampleLeaf) => {
    setActiveSampleId(sample.id);
    try {
      const response = await fetch(sample.imageSrc);
      const blob = await response.blob();
      const file = new File([blob], `${sample.id}.jpg`, { type: 'image/jpeg' });
      setSampleTrigger({ file, preview: sample.imageSrc });
    } catch (err) {
      console.error('Error loading sample image:', err);
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Top Hero Header Section with Multi-Color Aurora Glow */}
        <div 
          className="relative rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl bg-cover bg-center min-h-[220px] flex flex-col justify-center transition-all bg-[#080d18]"
          style={{ backgroundImage: `url('/leaf-hero-bg.jpg')` }}
        >
          {/* Smooth Dark Vignette Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d18] via-[#09131e]/90 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d18]/70 via-transparent to-transparent pointer-events-none" />

          {/* Animated Atmospheric Glow Elements */}
          <div className="absolute top-1/4 right-1/4 w-52 h-52 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-cyan-400/15 rounded-full blur-2xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left Title & Description */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-teal-500/20 border border-emerald-500/40 text-[11px] font-bold text-emerald-400 font-mono uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                Next-Gen AI Plant Pathology Diagnostic Studio
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                Crop Health & <br className="hidden sm:block" />
                Disease Diagnostic <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-black">AI Studio</span>
              </h1>

              <p className="text-xs md:text-sm text-gray-200 leading-relaxed max-w-xl drop-shadow-sm">
                Instant leaf pathology scanning powered by PyTorch MobileNetV3 (99.86% val accuracy). Features automated lesion surface quantification, certified digital prescriptions, and 8-language voice remedies.
              </p>
            </div>

            {/* Right 3 Floating Stats Badges with Micro-Interactions */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#09111b]/85 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] min-w-[135px] backdrop-blur-md hover:border-emerald-500/60 hover:-translate-y-1 transition-all group">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Leaf className="w-5 h-5 animate-leaf-sway" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-white font-mono flex items-baseline gap-1">
                    99.86%
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">Model Accuracy</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#09111b]/85 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] min-w-[135px] backdrop-blur-md hover:border-cyan-500/60 hover:-translate-y-1 transition-all group">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-white font-mono flex items-baseline gap-1">
                    38 Types
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">Crops & Pathogens</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#09111b]/85 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)] min-w-[135px] backdrop-blur-md hover:border-amber-500/60 hover:-translate-y-1 transition-all group">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-white font-mono flex items-baseline gap-1">
                    &lt; 50 ms
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">Inference Latency</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split Diagnostic Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: AI Leaf Disease Scanner (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <CameraUpload sampleImageTrigger={sampleTrigger} />
          </div>

          {/* Right Column: Specimen Selector Library (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0c1422]/90 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                      Foliar Specimen Library
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                        8 Fast Test Samples
                      </Badge>
                    </h3>
                    <p className="text-[11px] text-gray-400">Pre-loaded pathology specimens</p>
                  </div>
                </div>
              </div>

              {/* Crop Filter Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-gray-300 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                Click any specimen below to instantly execute the PyTorch MobileNetV3 model and generate the digital agronomist prescription.
              </div>

              {/* 8-Grid Sample Leaf Cards (4 x 2) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {filteredLeaves.map((sample) => {
                  const isSelected = activeSampleId === sample.id;

                  return (
                    <div
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`group rounded-2xl border p-2.5 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_25px_rgba(16,185,129,0.35)] scale-[1.02]'
                          : 'border-white/10 hover:border-emerald-400 bg-white/5 hover:bg-emerald-950/20 hover:-translate-y-1 shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      }`}
                    >
                      <div className="aspect-square w-full rounded-xl overflow-hidden mb-2 bg-black/50 relative border border-white/5">
                        <img
                          src={sample.imageSrc}
                          alt={sample.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Interactive Targeting Reticle on hover */}
                        <div className="absolute inset-0 border border-emerald-400/0 group-hover:border-emerald-400/80 transition-colors flex items-center justify-center pointer-events-none">
                          <Crosshair className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                        </div>

                        <span className={`absolute bottom-1 right-1 text-[9px] px-1.5 py-0.5 rounded-md font-bold ${sample.badgeBg}`}>
                          {sample.plant}
                        </span>

                        {isSelected && (
                          <div className="absolute top-1 left-1 bg-emerald-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Selected
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                          {sample.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate font-mono">
                          {sample.tag}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Section: 72-Hour Micro-Climate Epidemiology Radar */}
        <DiseaseRiskWidget />
      </div>
    </Layout>
  );
};

export default DiagnosePage;
