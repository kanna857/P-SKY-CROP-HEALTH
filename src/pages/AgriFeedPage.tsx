import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Search, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Filter, 
  Bookmark, 
  Sprout, 
  RefreshCw,
  ShieldCheck,
  BarChart2
} from 'lucide-react';
import { AgriTweet, getSavedAgriTweets } from '@/lib/agriTweetsData';
import { TweetComposer } from '@/components/agrifind/TweetComposer';
import { TweetCard } from '@/components/agrifind/TweetCard';
import { TrendingAgriTopics } from '@/components/agrifind/TrendingAgriTopics';
import { WhoToFollowAgri } from '@/components/agrifind/WhoToFollowAgri';

export default function AgriFeedPage() {
  const [tweets, setTweets] = useState<AgriTweet[]>([]);
  const [activeTab, setActiveTab] = useState<'for_you' | 'alerts' | 'market' | 'agronomists' | 'bookmarks'>('for_you');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  // Load tweets on mount
  useEffect(() => {
    setTweets(getSavedAgriTweets());
  }, []);

  const handleTweetPosted = (newTweet: AgriTweet) => {
    setTweets(prev => [newTweet, ...prev]);
  };

  const handleUpdateTweet = (updatedTweet: AgriTweet) => {
    setTweets(prev => prev.map(t => t.id === updatedTweet.id ? updatedTweet : t));
  };

  const handleHashtagFilter = (hashtag: string) => {
    setSelectedHashtag(hashtag);
    setSearchQuery(hashtag);
  };

  const handleClearHashtag = () => {
    setSelectedHashtag(null);
    setSearchQuery('');
  };

  // Filtered tweets based on tab, hashtag, and search query
  const filteredTweets = useMemo(() => {
    return tweets.filter(t => {
      // 1. Tab Filter
      if (activeTab === 'alerts' && !t.isUrgentAlert) return false;
      if (activeTab === 'market' && t.category !== 'market' && !t.cropTag.includes('Market')) return false;
      if (activeTab === 'agronomists' && t.author.verifiedType !== 'scientist' && t.author.verifiedType !== 'agronomist' && t.author.verifiedType !== 'extension') return false;
      if (activeTab === 'bookmarks' && !t.hasBookmarked) return false;

      // 2. Search & Hashtag Filter
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const matchesContent = t.content.toLowerCase().includes(queryLower);
        const matchesAuthor = t.author.name.toLowerCase().includes(queryLower) || t.author.handle.toLowerCase().includes(queryLower);
        const matchesCrop = t.cropTag.toLowerCase().includes(queryLower);
        const matchesLocation = t.author.location.toLowerCase().includes(queryLower);

        if (!matchesContent && !matchesAuthor && !matchesCrop && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [tweets, activeTab, searchQuery]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        {/* Main Grid: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Center Main Feed (8 Columns on desktop) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Sticky Header with Navigation Tabs */}
            <div className="sticky top-0 z-30 p-4 rounded-3xl bg-[#080d16]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-white flex items-center gap-2">
                      <span className="text-emerald-400">Agri</span>Tweets
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE FARM NETWORK
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">
                    Agricultural Community, Outbreak Alerts & Mandi Telemetry
                  </p>
                </div>

                {/* Quick Search Bar inside Feed */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tweets, crops, pests..."
                    className="w-full bg-black/50 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-gray-500 outline-none focus:border-emerald-400 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearHashtag}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-mono"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Twitter Feed Navigation Tabs with Dynamic Vibrant Color Palettes */}
              <div className="flex items-center gap-2 border-t border-white/10 pt-2.5 overflow-x-auto scrollbar-none text-xs font-mono">
                {[
                  { 
                    id: 'for_you', 
                    label: 'For You', 
                    icon: Sparkles,
                    activeClass: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.45)] border-emerald-400',
                    hoverClass: 'hover:border-emerald-500/40 hover:text-emerald-300'
                  },
                  { 
                    id: 'alerts', 
                    label: '🚨 Pest Alerts', 
                    icon: AlertTriangle,
                    activeClass: 'bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] border-rose-400 animate-pulse',
                    hoverClass: 'hover:border-rose-500/40 hover:text-rose-300'
                  },
                  { 
                    id: 'market', 
                    label: '📊 Mandi Prices', 
                    icon: BarChart2,
                    activeClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.45)] border-amber-400',
                    hoverClass: 'hover:border-amber-500/40 hover:text-amber-300'
                  },
                  { 
                    id: 'agronomists', 
                    label: '🔬 Agronomists', 
                    icon: ShieldCheck,
                    activeClass: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.45)] border-cyan-400',
                    hoverClass: 'hover:border-cyan-500/40 hover:text-cyan-300'
                  },
                  { 
                    id: 'bookmarks', 
                    label: '🔖 Bookmarks', 
                    icon: Bookmark,
                    activeClass: 'bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)] border-purple-400',
                    hoverClass: 'hover:border-purple-500/40 hover:text-purple-300'
                  }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-bold border ${
                        isActive
                          ? tab.activeClass
                          : `bg-white/[0.04] border-white/10 text-gray-300 hover:bg-white/[0.08] ${tab.hoverClass}`
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tweet Composer Box */}
            <TweetComposer onTweetPosted={handleTweetPosted} />

            {/* Feed Stream */}
            <div className="space-y-4">
              {filteredTweets.length > 0 ? (
                filteredTweets.map((tweet) => (
                  <TweetCard
                    key={tweet.id}
                    tweet={tweet}
                    onUpdateTweet={handleUpdateTweet}
                    onHashtagClick={handleHashtagFilter}
                  />
                ))
              ) : (
                <div className="p-12 text-center rounded-3xl bg-[#0c1422]/90 border border-white/10 space-y-3">
                  <Sprout className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-white">No AgriTweets Found</h3>
                  <p className="text-xs text-gray-400 font-mono max-w-md mx-auto">
                    {searchQuery 
                      ? `No agricultural updates matching "${searchQuery}". Try searching for crops like Wheat, Tomato, or Rice.`
                      : 'No tweets available in this category yet. Be the first farmer to share an update!'}
                  </p>
                  {(searchQuery || activeTab !== 'for_you') && (
                    <button
                      onClick={() => {
                        setActiveTab('for_you');
                        handleClearHashtag();
                      }}
                      className="px-4 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono transition-colors"
                    >
                      Reset to All AgriTweets
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (4 Columns on desktop) */}
          <div className="hidden lg:block lg:col-span-4 space-y-4 sticky top-4">
            {/* Trending Agricultural Topics & Mandi Ticker */}
            <TrendingAgriTopics
              onSelectHashtag={handleHashtagFilter}
              activeFilter={selectedHashtag}
              onClearFilter={handleClearHashtag}
            />

            {/* Who To Follow in Agriculture */}
            <WhoToFollowAgri />
          </div>

        </div>
      </div>
    </Layout>
  );
}
