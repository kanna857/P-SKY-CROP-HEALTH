import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DemoFieldsSelector } from '@/components/analyze/DemoFieldsSelector';
import { FarmerChatbot } from '@/components/analyze/FarmerChatbot';
import { DemoField, DEMO_FIELDS } from '@/lib/types';
import { Bot, Mic, Globe, Volume2, Sparkles, Sprout, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ChatbotPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedField, setSelectedField] = useState<DemoField | null>(null);

  useEffect(() => {
    if (searchParams.get('demo') === 'true' && !selectedField) {
      setSelectedField(DEMO_FIELDS[0]);
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Header Hero Banner with Nature Glow */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 font-mono uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> 24/7 Crop Protection Intelligence
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 animate-spore-pulse">
                <Bot className="w-7 h-7" />
              </div>
              AI Agronomist <span className="text-emerald-400 font-extrabold">Advisory</span>
            </h1>

            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Ask agricultural questions by voice or text in 9 Indian languages. Receive certified fungicide chemical formulations, organic recipes, and seasonal field tips.
            </p>
          </div>

          {/* Feature Badges with Nature Styling */}
          <div className="flex flex-wrap gap-2.5 pt-1 relative z-10">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs px-3 py-1 gap-1.5 shadow-sm">
              <Mic className="w-3.5 h-3.5" /> Hands-Free Voice Input
            </Badge>

            <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs px-3 py-1 gap-1.5 shadow-sm">
              <Globe className="w-3.5 h-3.5" /> 9 Regional Languages
            </Badge>

            <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30 text-xs px-3 py-1 gap-1.5 shadow-sm">
              <Volume2 className="w-3.5 h-3.5" /> Multilingual Audio Readout
            </Badge>

            <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-xs px-3 py-1 gap-1.5 shadow-sm">
              <Sprout className="w-3.5 h-3.5" /> Organic & Chemical Solutions
            </Badge>
          </div>
        </div>

        {/* Main Grid: Field Selector (4 cols) & Conversational Chat (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-6">
            <DemoFieldsSelector
              selectedField={selectedField}
              onSelect={setSelectedField}
            />
          </div>

          <div className="lg:col-span-8">
            <FarmerChatbot field={selectedField} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatbotPage;
