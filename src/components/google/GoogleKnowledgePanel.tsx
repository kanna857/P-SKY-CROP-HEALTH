import React, { useState } from 'react';
import { KnowledgeEntity } from '@/lib/generalSearchEngine';
import { ExternalLink, Share2, Bookmark, Check, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface GoogleKnowledgePanelProps {
  entity: KnowledgeEntity;
  onSearchQuery?: (q: string) => void;
}

export const GoogleKnowledgePanel: React.FC<GoogleKnowledgePanelProps> = ({
  entity,
  onSearchQuery
}) => {
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(entity.sourceUrl || window.location.href);
    setShared(true);
    toast({
      title: 'Link Copied',
      description: `Copied link to ${entity.title} to clipboard.`
    });
    setTimeout(() => setShared(false), 2000);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({
      title: !bookmarked ? 'Saved to Bookmarks' : 'Removed from Bookmarks',
      description: `${entity.title} updated in saved knowledge.`
    });
  };

  return (
    <aside className="w-full lg:w-[380px] shrink-0 p-5 rounded-3xl bg-[#0c1422]/95 border border-white/15 shadow-2xl backdrop-blur-2xl space-y-4 text-left">
      {/* Top Title & Action Buttons */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-display tracking-tight">
            {entity.title}
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            {entity.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
            title="Share"
          >
            {shared ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl border transition-colors ${
              bookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
            }`}
            title="Save"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      {entity.imageUrl && (
        <div className="relative rounded-2xl overflow-hidden aspect-video w-full bg-black/50 border border-white/10">
          <img
            src={entity.imageUrl}
            alt={entity.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-2 text-[10px] text-emerald-300 font-mono flex items-center gap-1 bg-black/75 px-2 py-0.5 rounded-md border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Agronomic Knowledge Graph</span>
          </div>
        </div>
      )}

      {/* Description Snippet */}
      <p className="text-xs text-gray-300 leading-relaxed font-sans">
        {entity.description}{' '}
        {entity.sourceUrl && (
          <a
            href={entity.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline inline-flex items-center gap-0.5 ml-1 font-mono text-[11px]"
          >
            {entity.sourceName} <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        )}
      </p>

      {/* Attributes Facts Table */}
      {entity.attributes && entity.attributes.length > 0 && (
        <div className="space-y-2 border-t border-white/10 pt-3">
          <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
            Agronomic Facts & Protocols
          </h4>
          <dl className="divide-y divide-white/5 text-xs">
            {entity.attributes.map((attr, idx) => (
              <div key={idx} className="py-1.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                <dt className="text-gray-400 font-medium shrink-0 max-w-[130px]">
                  {attr.label}
                </dt>
                <dd className="text-white font-medium text-left sm:text-right font-sans">
                  {attr.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Related Entities Carousel ("People also search for") */}
      {entity.relatedSearches && entity.relatedSearches.length > 0 && (
        <div className="space-y-2 border-t border-white/10 pt-3">
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
            Related Agricultural Topics
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {entity.relatedSearches.map((rel, idx) => (
              <button
                key={idx}
                onClick={() => onSearchQuery?.(rel.title)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:scale-[1.02] group"
              >
                <span className="text-xs font-bold text-white group-hover:text-blue-400 block truncate">
                  {rel.title}
                </span>
                {rel.subtitle && (
                  <span className="text-[10px] text-gray-400 block truncate font-mono mt-0.5">
                    {rel.subtitle}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
