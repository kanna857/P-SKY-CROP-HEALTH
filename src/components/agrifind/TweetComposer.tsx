import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  AlertTriangle, 
  BarChart2, 
  Smile, 
  Sparkles, 
  X, 
  Plus, 
  Send,
  Sprout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AgriTweet, postNewAgriTweet } from '@/lib/agriTweetsData';

interface TweetComposerProps {
  onTweetPosted: (newTweet: AgriTweet) => void;
}

const CROP_TAGS = [
  '🌾 Wheat',
  '🍚 Paddy / Rice',
  '🍅 Tomato',
  '🥔 Potato',
  '🌱 Cotton',
  '🌽 Maize / Corn',
  '🧪 Soil & Fertilizers',
  '💧 Drip & Irrigation',
  '🪲 Pest Control',
  '🚜 Farm Equipment',
  '📊 Market Prices'
];

const SAMPLE_FIELD_IMAGES = [
  { label: 'Wheat Rust Pustules', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=60' },
  { label: 'Tomato Early Blight', url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=60' },
  { label: 'Drip Field System', url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=60' },
  { label: 'Cotton Boll Field', url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=60' }
];

export const TweetComposer: React.FC<TweetComposerProps> = ({ onTweetPosted }) => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('🌾 Wheat');
  const [isUrgentAlert, setIsUrgentAlert] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');
  const [pollOption3, setPollOption3] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const maxChars = 280;
  const charsRemaining = maxChars - content.length;

  const handleSubmit = () => {
    if (!content.trim()) return;

    setIsPosting(true);

    try {
      const pollData = (showPollCreator && pollQuestion.trim() && pollOption1.trim() && pollOption2.trim()) ? {
        question: pollQuestion.trim(),
        options: [
          { text: pollOption1.trim(), votes: 0 },
          { text: pollOption2.trim(), votes: 0 },
          ...(pollOption3.trim() ? [{ text: pollOption3.trim(), votes: 0 }] : [])
        ],
        totalVotes: 0
      } : undefined;

      const newTweet = postNewAgriTweet({
        author: {
          name: 'You (Progressive Farmer)',
          handle: 'kisan_innovator',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          role: 'Farm Operator & Precision Agronomist',
          location: 'Field Sector A-4',
          verifiedType: 'farmer'
        },
        content: content.trim(),
        cropTag: selectedCrop,
        isUrgentAlert,
        alertSeverity: isUrgentAlert ? 'critical' : undefined,
        images: selectedImage ? [selectedImage] : undefined,
        poll: pollData,
        category: isUrgentAlert ? 'pathology' : selectedCrop.includes('Fertilizer') ? 'fertilizer' : selectedCrop.includes('Irrigation') ? 'irrigation' : 'general'
      });

      onTweetPosted(newTweet);

      // Reset form
      setContent('');
      setIsUrgentAlert(false);
      setSelectedImage(null);
      setShowImagePicker(false);
      setShowPollCreator(false);
      setPollQuestion('');
      setPollOption1('');
      setPollOption2('');
      setPollOption3('');

      toast({
        title: isUrgentAlert ? '🚨 Urgent Farm Alert Broadcasted!' : '🌱 AgriTweet Published!',
        description: isUrgentAlert
          ? 'Nearby farmers and extension agents in your network have been notified.'
          : 'Your farming update is now live on the AgriX network.'
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error posting tweet',
        description: 'Failed to save your post. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-[#0c1422]/95 border border-emerald-500/30 hover:border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.12)] backdrop-blur-2xl transition-all">
      <div className="flex items-start gap-3.5">
        {/* User Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 p-[2px] shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.35)]">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
            alt="You"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Text Input Area */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Urgent Outbreak Warning Toggle */}
          <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-black/40 text-emerald-300 text-xs font-mono font-semibold px-2.5 py-1 rounded-xl border border-emerald-500/30 outline-none cursor-pointer hover:border-emerald-400 transition-colors"
              >
                {CROP_TAGS.map((crop) => (
                  <option key={crop} value={crop} className="bg-[#0b121e] text-white">
                    {crop}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsUrgentAlert(!isUrgentAlert)}
                className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-xl border transition-all ${
                  isUrgentAlert
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isUrgentAlert ? 'Outbreak Alert ON' : 'Pest/Disease Alert'}</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-gray-500 hidden sm:inline">
              Everyone can reply
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isUrgentAlert ? "Broadcast urgent pest outbreak, pathogen symptoms, or weather emergency..." : "What's happening in your field? Share crop health, fertilizer dose, or market rates..."}
            rows={3}
            maxLength={maxChars}
            className="w-full bg-transparent border-none outline-none text-sm text-gray-100 placeholder:text-gray-500 resize-none font-sans leading-relaxed"
          />

          {/* Attached Field Image Preview */}
          {selectedImage && (
            <div className="relative rounded-2xl overflow-hidden aspect-video max-h-52 border border-white/10 group">
              <img
                src={selectedImage}
                alt="Attached field preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Sample Image Selector Modal Strip */}
          {showImagePicker && (
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <span className="text-[11px] text-gray-400 font-mono flex items-center justify-between">
                <span>Select field specimen photo:</span>
                <button
                  type="button"
                  onClick={() => setShowImagePicker(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_FIELD_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img.url);
                      setShowImagePicker(false);
                    }}
                    className="relative rounded-xl overflow-hidden aspect-video border border-white/10 hover:border-emerald-400 transition-all hover:scale-105 group"
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[9px] font-mono bg-black/80 px-1 py-0.5 rounded text-gray-300">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Farm Poll Creator Drawer */}
          {showPollCreator && (
            <div className="p-3.5 rounded-2xl bg-black/60 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4" /> Create Farmer Poll
                </span>
                <button
                  type="button"
                  onClick={() => setShowPollCreator(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask fellow farmers a question..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-gray-500 outline-none focus:border-emerald-400"
              />
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={pollOption1}
                  onChange={(e) => setPollOption1(e.target.value)}
                  placeholder="Option 1 (e.g. Neem Oil 10,000 PPM)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-gray-500 outline-none focus:border-emerald-400"
                />
                <input
                  type="text"
                  value={pollOption2}
                  onChange={(e) => setPollOption2(e.target.value)}
                  placeholder="Option 2 (e.g. Chemical Fungicide Tilt)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-gray-500 outline-none focus:border-emerald-400"
                />
                <input
                  type="text"
                  value={pollOption3}
                  onChange={(e) => setPollOption3(e.target.value)}
                  placeholder="Option 3 (Optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-gray-500 outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          )}

          {/* Action Toolbar & Character Progress */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            {/* Attachment Icons with Colorful Illuminated Pills */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowImagePicker(!showImagePicker)}
                className="p-2 rounded-xl text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 hover:border-emerald-400/40 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all"
                title="Add field specimen photo"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowPollCreator(!showPollCreator)}
                className="p-2 rounded-xl text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all"
                title="Create farm poll"
              >
                <BarChart2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setContent(prev => prev + ' #WheatRustAlert #KisanUpdate')}
                className="p-2 rounded-xl text-amber-300 bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/20 hover:border-amber-400/40 hover:shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all"
                title="Insert trending hashtag"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            {/* Character Counter & Post Button */}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-medium ${
                charsRemaining < 20 ? 'text-rose-400 font-bold' : charsRemaining < 50 ? 'text-amber-400' : 'text-gray-500'
              }`}>
                {charsRemaining}
              </span>

              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isPosting}
                className={`px-5 py-2 h-9 rounded-full text-xs font-bold font-mono transition-all duration-300 shadow-md ${
                  isUrgentAlert
                    ? 'bg-gradient-to-r from-rose-600 via-red-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] border border-rose-400/40'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] border border-emerald-400/40'
                }`}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                <span>{isUrgentAlert ? 'Broadcast Alert' : 'AgriTweet'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
