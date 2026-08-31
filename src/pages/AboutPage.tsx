import { Layout } from '@/components/layout/Layout';
import { Info, Satellite, Target, Users, Code, Globe, Stethoscope, ShieldCheck, Cpu, Database, Award, BookOpen, Sparkles, Leaf, Sprout } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AboutPage = () => {
  const techStack = [
    {
      icon: Stethoscope,
      name: 'MobileNetV3 Deep Learning',
      description: 'Pre-trained CNN backbone fine-tuned on 38,000 balanced leaf disease images across 38 standard PlantVillage crop classes.'
    },
    {
      icon: Satellite,
      name: 'Sentinel-2 NDVI Engine',
      description: 'Multispectral 10-meter satellite resolution tracking canopy chlorophyll, nitrogen absorption, and moisture stress.'
    },
    {
      icon: ShieldCheck,
      name: 'Agronomic Prescription Logic',
      description: 'Curated dosage and spray interval algorithms based on ICAR, TNAU, and UC Davis IPM plant pathology guidelines.'
    },
    {
      icon: Cpu,
      name: 'FastAPI High-Speed Inference',
      description: 'PyTorch async REST API delivering sub-20ms leaf classification and confidence percentage ranking.'
    },
  ];

  const scientificPartners = [
    { name: 'ICAR & TNAU Agritech', role: 'Crop protection chemical dosages and Indian tropical advisory standards' },
    { name: 'UC Davis IPM', role: 'Pathogen biology, spore germination models, and biocontrol formulations' },
    { name: 'Cornell Vegetable MD Online', role: 'Late blight decision support systems and resistant hybrid lineages' },
    { name: 'Penn State & EPFL PlantVillage', role: 'Benchmark open-source plant disease dataset taxonomy' },
  ];

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto">
        {/* Header Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-3 text-center max-w-4xl mx-auto">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 font-mono uppercase">
            <Award className="w-3.5 h-3.5" /> Next-Gen Agricultural Intelligence
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            About <span className="text-emerald-400 font-extrabold">SkyCrop Health</span>
          </h1>

          <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Bridging satellite earth observation with micro-level neural leaf pathology to empower farmers, agronomists, and researchers worldwide.
          </p>
        </div>

        {/* Mission Statement Card */}
        <div className="p-6 md:p-10 rounded-3xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 animate-leaf-sway">
                  <Target className="w-5 h-5" />
                </div>
                Our Mission & Vision
              </h2>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                SkyCrop Health was developed to solve the two biggest challenges in modern agriculture: <strong>macroscopic field stress</strong> and <strong>microscopic leaf diseases</strong>.
              </p>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                By fusing satellite NDVI indices with a fine-tuned deep learning plant pathology network, we provide farmers with actionable early warnings, exact fungicide dosages, and voice-guided remedies before crop losses occur.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-emerald-500/30 transition-colors">
                <div className="font-display text-3xl font-bold text-emerald-400">38</div>
                <div className="text-xs text-gray-400 mt-1">Disease Classes</div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-emerald-500/30 transition-colors">
                <div className="font-display text-3xl font-bold text-emerald-400">38,000</div>
                <div className="text-xs text-gray-400 mt-1">Balanced Images</div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-yellow-400/30 transition-colors">
                <div className="font-display text-3xl font-bold text-yellow-400">99.2%</div>
                <div className="text-xs text-gray-400 mt-1">Model Accuracy</div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-blue-400/30 transition-colors">
                <div className="font-display text-3xl font-bold text-blue-400">&lt;20ms</div>
                <div className="text-xs text-gray-400 mt-1">Inference Speed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Tech Architecture Cards */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white text-center">
            Deep Technology Architecture
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="p-5 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-xl backdrop-blur-2xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xs md:text-sm text-white">{tech.name}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{tech.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scientific Foundations */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Scientific & Agronomic Standards
              </h3>
              <p className="text-xs text-gray-400">
                All disease remedies, chemical dilution ratios, and spray schedules are derived from certified agricultural extensions
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {scientificPartners.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                </div>
                <p className="text-xs text-gray-400 pl-6">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
