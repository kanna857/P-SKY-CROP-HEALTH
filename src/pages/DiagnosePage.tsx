import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CameraUpload } from '@/components/analyze/CameraUpload';
import { DiseaseRiskWidget } from '@/components/analyze/DiseaseRiskWidget';
import { LeafScanner3D } from '@/components/3d/LeafScanner3D';
import { 
  Sparkles, 
  Leaf, 
  Target, 
  Zap, 
  Scan,
  Crosshair,
  Filter,
  CheckCircle2,
  Box
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    badgeBg: 'bg-red-500 text-white'
  },
  {
    id: 'apple-scab',
    name: 'Apple Scab',
    plant: 'Apple',
    category: 'orchard',
    disease: 'Venturia inaequalis',
    imageSrc: '/samples/apple_scab.jpg',
    tag: 'Leaf Lesions',
    badgeBg: 'bg-emerald-600 text-white'
  },
  {
    id: 'corn-rust',
    name: 'Corn Common Rust',
    plant: 'Corn (Maize)',
    category: 'cereals',
    disease: 'Puccinia sorghi',
    imageSrc: '/samples/corn_rust.jpg',
    tag: 'Puccinia',
    badgeBg: 'bg-yellow-600 text-white'
  },
  {
    id: 'grape-black-rot',
    name: 'Grape Black Rot',
    plant: 'Grape',
    category: 'orchard',
    disease: 'Guignardia bidwellii',
    imageSrc: '/samples/grape_black_rot.jpg',
    tag: 'Necrotic Rot',
    badgeBg: 'bg-red-600 text-white'
  },
  {
    id: 'pepper-bacterial-spot',
    name: 'Pepper Bacterial Spot',
    plant: 'Bell Pepper',
    category: 'solanaceae',
    disease: 'Xanthomonas campestris',
    imageSrc: '/samples/pepper_bacterial_spot.jpg',
    tag: 'Bacterial Spot',
    badgeBg: 'bg-red-500 text-white'
  },
  {
    id: 'potato-healthy',
    name: 'Potato Healthy Leaf',
    plant: 'Potato',
    category: 'solanaceae',
    disease: 'None (Healthy)',
    imageSrc: '/samples/potato_healthy.jpg',
    tag: '100% Healthy',
    badgeBg: 'bg-emerald-500 text-white'
  },
  {
    id: 'rice-blast',
    name: 'Rice Blast',
    plant: 'Rice',
    category: 'cereals',
    disease: 'Magnaporthe oryzae',
    imageSrc: '/samples/rice_blast.jpg',
    tag: 'Fungal Disease',
    badgeBg: 'bg-yellow-500 text-white'
  },
  {
    id: 'soybean-rust',
    name: 'Soybean Rust',
    plant: 'Soybean',
    category: 'cereals',
    disease: 'Phakopsora pachyrhizi',
    imageSrc: '/samples/soybean_rust.jpg',
    tag: 'Fungal Infection',
    badgeBg: 'bg-purple-600 text-white'
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
  const [show3DInspector, setShow3DInspector] = useState(false);
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
        {/* Top Hero Header Section with Realistic Leaf Macro Background */}
        <div 
          className="relative rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl bg-cover bg-center min-h-[220px] flex flex-col justify-center transition-all"
          style={{ backgroundImage: `url('/leaf-hero-bg.jpg')` }}
        >
          {/* Smooth Dark Vignette Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d16] via-[#09131e]/90 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d16]/70 via-transparent to-transparent pointer-events-none" />

          {/* Animated Atmospheric Glow Elements */}
          <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-emerald-400/15 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left Title & Description */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-[11px] font-bold text-emerald-400 font-mono uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                Next-Gen AI Plant Pathology Studio
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                Crop Health & <br className="hidden sm:block" />
                Disease Diagnostic <span className="text-emerald-400 font-extrabold">AI</span>
              </h1>

              <p className="text-xs md:text-sm text-gray-200 leading-relaxed max-w-xl drop-shadow-sm">
                Instant leaf pathology scanning powered by deep convolutional networks (MobileNetV3). Detect 38 crop diseases, get dosage prescriptions, and hear multilingual voice remedies.
              </p>
            </div>

            {/* Right 3 Floating Stats Badges with Micro-Interactions */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#09111b]/80 border border-white/15 shadow-xl min-w-[135px] backdrop-blur-md hover:border-emerald-500/40 hover:-translate-y-1 transition-all group">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-white leading-none">38+</div>
                  <div className="text-[10px] text-gray-300 mt-1">Diseases Detected</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#09111b]/80 border border-white/15 shadow-xl min-w-[135px] backdrop-blur-md hover:border-emerald-500/40 hover:-translate-y-1 transition-all group">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-emerald-400 leading-none">99.86%</div>
                  <div className="text-[10px] text-gray-300 mt-1">AI Accuracy</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#09111b]/80 border border-white/15 shadow-xl min-w-[135px] backdrop-blur-md hover:border-yellow-500/40 hover:-translate-y-1 transition-all group">
                <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-yellow-400 leading-none">5s</div>
                  <div className="text-[10px] text-gray-300 mt-1">Instant Diagnosis</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Scanner & Right 8-Grid Sample Leaves / 3D Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: AI Leaf Disease Scanner (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <CameraUpload sampleImageTrigger={sampleTrigger} />
          </div>

          {/* Right Column: Sample Leaves Gallery + 3D Inspector (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* 3D Holographic Leaf Inspector Mode Toggle */}
            <div className="p-4 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-xl backdrop-blur-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">3D Holographic Model Inspector</span>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShow3DInspector(!show3DInspector)}
                className={`text-xs font-bold rounded-xl border-emerald-500/30 ${
                  show3DInspector ? 'bg-emerald-500 text-black' : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                {show3DInspector ? 'Hide 3D View' : '✨ Open 3D View'}
              </Button>
            </div>

            {/* 3D Leaf Scanner Component */}
            {show3DInspector && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <LeafScanner3D height={250} />
              </div>
            )}

            {/* Quick Test Sample Leaves Gallery Card */}
            <div className="p-6 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Scan className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-display">
                    Quick Test: Sample Leaves Gallery
                  </h3>
                </div>

                {/* Filter Categories */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg transition-all shrink-0 ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-500 text-black font-bold shadow-sm'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Click any leaf below to instantly test the AI model without uploading your own photo.
              </p>

              {/* 8-Grid Sample Leaf Cards (4 x 2) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {filteredLeaves.map((sample) => {
                  const isSelected = activeSampleId === sample.id;

                  return (
                    <div
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`group rounded-xl border p-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-[1.02]'
                          : 'border-white/10 hover:border-emerald-400 bg-white/5 hover:bg-emerald-950/20 hover:-translate-y-0.5 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      }`}
                    >
                      <div className="aspect-square w-full rounded-lg overflow-hidden mb-2 bg-black/40 relative">
                        <img
                          src={sample.imageSrc}
                          alt={sample.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Interactive Targeting Reticle on hover */}
                        <div className="absolute inset-0 border border-emerald-400/0 group-hover:border-emerald-400/80 transition-colors flex items-center justify-center pointer-events-none">
                          <Crosshair className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                        </div>

                        <span className={`absolute bottom-1 right-1 text-[9px] px-1.5 py-0.5 rounded font-bold ${sample.badgeBg}`}>
                          {sample.plant}
                        </span>

                        {isSelected && (
                          <div className="absolute top-1 left-1 bg-emerald-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-md">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Selected
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                          {sample.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
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

        {/* Bottom Full-Width Section: Weather-Driven Disease Risk Radar */}
        <DiseaseRiskWidget />
      </div>
    </Layout>
  );
};

export default DiagnosePage;
