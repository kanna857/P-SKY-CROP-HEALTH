import React from 'react';
import { TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Sparkles, Sprout } from 'lucide-react';
import { AGRI_TRENDING_TOPICS, COMMODITY_TICKER, AgriTrend } from '@/lib/agriTweetsData';

interface TrendingAgriTopicsProps {
  onSelectHashtag: (hashtag: string) => void;
  activeFilter?: string | null;
  onClearFilter?: () => void;
}

export const TrendingAgriTopics: React.FC<TrendingAgriTopicsProps> = ({
  onSelectHashtag,
  activeFilter,
  onClearFilter
}) => {
  return (
    <aside className="space-y-4">
      {/* Active Filter Notice */}
      {activeFilter && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filter: <strong>{activeFilter}</strong></span>
          </div>
          <button
            onClick={onClearFilter}
            className="text-[10px] font-mono uppercase font-bold text-emerald-400 hover:text-white underline cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* What's Happening in Agriculture (Twitter Style Trends) */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-[#0c1626]/95 via-[#091220]/95 to-[#0c1626]/95 border border-emerald-500/25 shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <h3 className="font-extrabold text-white text-base font-display flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">What's Happening</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            FARM TELEMETRY
          </span>
        </div>

        <div className="divide-y divide-white/5 space-y-1">
          {AGRI_TRENDING_TOPICS.map((trend) => {
            const isSelected = activeFilter === trend.hashtag;
            return (
              <button
                key={trend.id}
                onClick={() => onSelectHashtag(trend.hashtag)}
                className={`w-full pt-2.5 pb-2 text-left transition-all duration-300 group block rounded-xl px-2 ${
                  isSelected 
                    ? 'bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span className="group-hover:text-emerald-400/80 transition-colors">{trend.category}</span>
                  {trend.isOutbreakWarning && (
                    <span className="flex items-center gap-0.5 text-rose-300 font-bold text-[10px] bg-rose-500/20 px-1.5 py-0.2 rounded border border-rose-500/40 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                      <AlertTriangle className="w-3 h-3" /> ALERT
                    </span>
                  )}
                </div>
                <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors font-sans mt-0.5">
                  {trend.hashtag}
                </div>
                <div className="text-[11px] text-emerald-400/70 font-mono mt-0.5">
                  {trend.tweetCount}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Mandi / APMC Commodity Price Ticker */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-[#0a1728]/95 via-[#081220]/95 to-[#0a1728]/95 border border-cyan-500/25 shadow-[0_0_30px_rgba(6,182,212,0.1)] backdrop-blur-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <h3 className="font-extrabold text-white text-sm font-display flex items-center gap-2">
            <Sprout className="w-4 h-4 text-cyan-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-sky-300">Mandi Live Prices</span>
          </h3>
          <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            LIVE APMC
          </span>
        </div>

        <div className="space-y-2">
          {COMMODITY_TICKER.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-all text-xs font-mono group"
            >
              <div>
                <div className="font-bold text-white text-[12px] group-hover:text-emerald-300 transition-colors">{item.crop}</div>
                <div className="text-[11px] text-gray-300 font-semibold">{item.price}</div>
              </div>
              <div className={`flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-md border ${
                item.isPositive 
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
              }`}>
                {item.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{item.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
