import React, { useState } from 'react';
import { 
  Heart, 
  Repeat, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Send,
  Sparkles,
  Sprout
} from 'lucide-react';
import { 
  AgriTweet, 
  toggleTweetLike, 
  toggleTweetRetweet, 
  toggleTweetBookmark, 
  voteAgriPoll, 
  addAgriComment 
} from '@/lib/agriTweetsData';
import { useToast } from '@/hooks/use-toast';

interface TweetCardProps {
  tweet: AgriTweet;
  onUpdateTweet: (updatedTweet: AgriTweet) => void;
  onHashtagClick?: (tag: string) => void;
}

export const TweetCard: React.FC<TweetCardProps> = ({
  tweet,
  onUpdateTweet,
  onHashtagClick
}) => {
  const { toast } = useToast();
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = () => {
    setIsLiking(true);
    const { updatedTweet } = toggleTweetLike(tweet.id);
    onUpdateTweet(updatedTweet);
    setTimeout(() => setIsLiking(false), 400);
  };

  const handleRetweet = () => {
    const { updatedTweet, isRetweeted } = toggleTweetRetweet(tweet.id);
    onUpdateTweet(updatedTweet);
    toast({
      title: isRetweeted ? '🔁 Reposted to your Farmer Feed' : 'Undo Repost',
      description: isRetweeted ? 'Shared with your agricultural community network.' : undefined
    });
  };

  const handleBookmark = () => {
    const { updatedTweet, isBookmarked } = toggleTweetBookmark(tweet.id);
    onUpdateTweet(updatedTweet);
    toast({
      title: isBookmarked ? '🔖 Saved to Farm Bookmarks' : 'Removed from Bookmarks'
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/feed#${tweet.id}`);
    setIsCopied(true);
    toast({
      title: 'AgriTweet Link Copied!',
      description: 'Share this agronomic insight with your farming group.'
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVote = (optIdx: number) => {
    if (tweet.poll?.userVotedIndex !== undefined) return;
    const updated = voteAgriPoll(tweet.id, optIdx);
    if (updated) {
      onUpdateTweet(updated);
      toast({
        title: 'Poll Vote Recorded',
        description: 'Thank you for contributing to agricultural crowd intelligence.'
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const updated = addAgriComment(tweet.id, replyText);
    if (updated) {
      onUpdateTweet(updated);
      setReplyText('');
      toast({
        title: 'Reply Published',
        description: 'Your agronomic comment has been posted.'
      });
    }
  };

  // Render text with clickable agricultural hashtags
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return (
          <span
            key={i}
            onClick={() => onHashtagClick?.(part)}
            className="text-emerald-400 font-semibold hover:underline cursor-pointer transition-colors"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const verifiedBadge = () => {
    switch (tweet.author.verifiedType) {
      case 'scientist':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40" title="ICAR / University Plant Pathologist">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span>Pathologist</span>
          </span>
        );
      case 'master_farmer':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40" title="Recognized Master Cultivator">
            <Award className="w-3 h-3 text-amber-400" />
            <span>Master Farmer</span>
          </span>
        );
      case 'agronomist':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" title="Certified Field Agronomist">
            <Sprout className="w-3 h-3 text-emerald-400" />
            <span>Agronomist</span>
          </span>
        );
      case 'extension':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" title="Official Extension / Krishi Network">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Extension</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getCropTagColor = (tag: string) => {
    if (tag.includes('Wheat')) {
      return 'bg-gradient-to-r from-amber-500/25 to-yellow-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
    }
    if (tag.includes('Tomato')) {
      return 'bg-gradient-to-r from-rose-500/25 to-red-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]';
    }
    if (tag.includes('Paddy') || tag.includes('Rice')) {
      return 'bg-gradient-to-r from-emerald-500/25 to-teal-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
    }
    if (tag.includes('Cotton')) {
      return 'bg-gradient-to-r from-sky-500/25 to-cyan-500/20 text-sky-300 border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]';
    }
    if (tag.includes('Maize') || tag.includes('Corn')) {
      return 'bg-gradient-to-r from-yellow-500/25 to-amber-500/20 text-yellow-300 border-yellow-500/40 shadow-[0_0_12px_rgba(234,179,8,0.25)]';
    }
    if (tag.includes('Market')) {
      return 'bg-gradient-to-r from-purple-500/25 to-violet-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]';
    }
    if (tag.includes('Soil') || tag.includes('Fertilizer')) {
      return 'bg-gradient-to-r from-cyan-500/25 to-blue-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
    }
    return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
  };

  return (
    <article
      id={tweet.id}
      className={`p-4 sm:p-5 rounded-3xl transition-all duration-300 backdrop-blur-2xl border ${
        tweet.isUrgentAlert
          ? 'bg-gradient-to-b from-rose-950/30 via-[#0c1422]/90 to-[#0c1422]/90 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)] hover:border-rose-500/80'
          : 'bg-[#0c1422]/90 border-white/10 shadow-xl hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]'
      }`}
    >
      {/* Urgent Pest Alert Header Banner */}
      {tweet.isUrgentAlert && (
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-rose-500/25 via-red-500/20 to-amber-500/20 border border-rose-500/50 mb-3.5 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          <div className="flex items-center gap-2 text-rose-200 text-xs font-mono font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>CRITICAL OUTBREAK ALERT • IMMEDIATE FIELD INTERVENTION REQUIRED</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-gradient-to-r from-rose-600 to-amber-600 text-white uppercase shadow-sm">
            Emergency
          </span>
        </div>
      )}

      {/* Main Tweet Body */}
      <div className="flex items-start gap-3.5">
        {/* Author Avatar */}
        <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-emerald-400 via-teal-300 to-amber-400 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          <img
            src={tweet.author.avatar}
            alt={tweet.author.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Content & Metadata */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {/* Author Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="font-bold text-white text-sm hover:underline cursor-pointer truncate">
                {tweet.author.name}
              </span>
              {verifiedBadge()}
              <span className="text-gray-400 text-xs font-mono truncate">
                @{tweet.author.handle}
              </span>
              <span className="text-gray-600 text-xs">•</span>
              <span className="text-gray-400 text-xs font-mono">
                {tweet.timestamp}
              </span>
            </div>

            {/* Colorful Crop Tag Pill */}
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold shrink-0 border transition-all ${getCropTagColor(tweet.cropTag)}`}>
              {tweet.cropTag}
            </span>
          </div>

          {/* Author Role & Location */}
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono -mt-1">
            <span>{tweet.author.role}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-gray-300">
              <MapPin className="w-3 h-3 text-emerald-400" /> {tweet.author.location}
            </span>
          </div>

          {/* Tweet Text Content */}
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans whitespace-pre-line select-text">
            {renderFormattedContent(tweet.content)}
          </p>

          {/* Attached Field Image */}
          {tweet.images && tweet.images.length > 0 && (
            <div className="relative rounded-2xl overflow-hidden aspect-video w-full border border-white/10 bg-black/40 mt-2 shadow-lg">
              <img
                src={tweet.images[0]}
                alt="Agricultural field specimen"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                loading="lazy"
              />
            </div>
          )}

          {/* Agricultural Poll Widget */}
          {tweet.poll && (
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 mt-2">
              <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> {tweet.poll.question}
              </h4>
              <div className="space-y-1.5 pt-1">
                {tweet.poll.options.map((opt, idx) => {
                  const pct = tweet.poll!.totalVotes > 0 
                    ? Math.round((opt.votes / tweet.poll!.totalVotes) * 100)
                    : 0;
                  const hasVoted = tweet.poll!.userVotedIndex !== undefined;
                  const isUserPick = tweet.poll!.userVotedIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleVote(idx)}
                      disabled={hasVoted}
                      className={`w-full relative p-2.5 rounded-xl border text-left text-xs font-mono transition-all overflow-hidden ${
                        isUserPick
                          ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold'
                          : hasVoted
                          ? 'border-white/5 bg-white/[0.02] text-gray-300'
                          : 'border-white/10 bg-white/5 hover:border-emerald-400 hover:bg-emerald-500/10 text-gray-200'
                      }`}
                    >
                      {/* Live Progress Bar Fill */}
                      {hasVoted && (
                        <div 
                          className={`absolute top-0 bottom-0 left-0 transition-all duration-700 pointer-events-none ${
                            isUserPick ? 'bg-emerald-500/30' : 'bg-white/10'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      )}
                      <div className="relative flex items-center justify-between z-10">
                        <span className="truncate flex items-center gap-1.5">
                          {isUserPick && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          {opt.text}
                        </span>
                        {hasVoted && (
                          <span className="font-bold text-emerald-400 shrink-0 ml-2">
                            {pct}% ({opt.votes})
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="text-[10px] font-mono text-gray-500 text-right pt-0.5">
                {tweet.poll.totalVotes} farmer votes • {tweet.poll.userVotedIndex !== undefined ? 'Final crowd telemetry' : 'Tap to vote'}
              </div>
            </div>
          )}

          {/* Tweet Interactive Action Bar with Colorful Neon Hover Glows */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono text-gray-400">
            {/* Reply - Electric Sky Blue */}
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 hover:text-sky-300 transition-all duration-300 group"
            >
              <div className="p-2 rounded-full group-hover:bg-sky-500/20 group-hover:text-sky-300 group-hover:shadow-[0_0_12px_rgba(56,189,248,0.4)] transition-all">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="group-hover:text-sky-300">{tweet.repliesCount}</span>
            </button>

            {/* Retweet / Repost - Neon Emerald */}
            <button
              onClick={handleRetweet}
              className={`flex items-center gap-1.5 transition-all duration-300 group ${
                tweet.hasRetweeted ? 'text-emerald-400 font-bold' : 'hover:text-emerald-300'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all">
                <Repeat className={`w-4 h-4 ${tweet.hasRetweeted ? 'text-emerald-400' : ''}`} />
              </div>
              <span className={tweet.hasRetweeted ? 'text-emerald-400' : 'group-hover:text-emerald-300'}>{tweet.retweets}</span>
            </button>

            {/* Like - Vivid Ruby Rose */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-all duration-300 group ${
                tweet.hasLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-rose-500/20 group-hover:text-rose-400 group-hover:shadow-[0_0_14px_rgba(244,63,94,0.5)] transition-all">
                <Heart className={`w-4 h-4 ${tweet.hasLiked ? 'fill-rose-500 text-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]' : ''} ${isLiking ? 'scale-125 transition-transform' : ''}`} />
              </div>
              <span className={tweet.hasLiked ? 'text-rose-500' : 'group-hover:text-rose-400'}>{tweet.likes}</span>
            </button>

            {/* Bookmark - Warm Amber */}
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 transition-all duration-300 group ${
                tweet.hasBookmarked ? 'text-amber-400 font-bold' : 'hover:text-amber-300'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-amber-500/20 group-hover:text-amber-300 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all">
                <Bookmark className={`w-4 h-4 ${tweet.hasBookmarked ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' : ''}`} />
              </div>
            </button>

            {/* Share - Electric Cyan */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-all duration-300 group"
            >
              <div className="p-2 rounded-full group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all">
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </div>
            </button>
          </div>

          {/* Expandable Replies / Comments Thread */}
          {showReplies && (
            <div className="pt-3 space-y-3 border-t border-white/10 animate-in fade-in-50">
              {/* Existing Comments */}
              {tweet.comments && tweet.comments.length > 0 ? (
                <div className="space-y-2.5">
                  {tweet.comments.map((comment) => (
                    <div key={comment.id} className="p-2.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{comment.author}</span>
                          <span className="text-gray-400 font-mono text-[11px]">@{comment.handle}</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-300 font-sans pl-1">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-mono text-center py-2">
                  No replies yet. Be the first farmer or agronomist to respond!
                </p>
              )}

              {/* Add Reply Form */}
              <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Post your agronomic advice or reply..."
                  className="flex-1 bg-black/50 border border-white/15 rounded-full px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-mono font-bold transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
