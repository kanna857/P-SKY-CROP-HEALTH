import React, { useState } from 'react';
import { UserCheck, UserPlus, ShieldCheck } from 'lucide-react';
import { AGRI_WHO_TO_FOLLOW, AgriProfile } from '@/lib/agriTweetsData';
import { useToast } from '@/hooks/use-toast';

export const WhoToFollowAgri: React.FC = () => {
  const { toast } = useToast();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    'fol-3': true // Following SkyCrop AI by default
  });

  const handleToggleFollow = (profile: AgriProfile) => {
    const isNowFollowing = !followingMap[profile.id];
    setFollowingMap(prev => ({
      ...prev,
      [profile.id]: isNowFollowing
    }));

    toast({
      title: isNowFollowing ? `Following @${profile.handle}` : `Unfollowed @${profile.handle}`,
      description: isNowFollowing 
        ? `You will receive agricultural updates and advisories from ${profile.name}.`
        : undefined
    });
  };

  return (
    <div className="p-4 rounded-3xl bg-gradient-to-b from-[#0c1524]/95 via-[#08101a]/95 to-[#0c1524]/95 border border-purple-500/25 shadow-[0_0_30px_rgba(168,85,247,0.1)] backdrop-blur-2xl space-y-3.5">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <h3 className="font-extrabold text-white text-sm font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Who to Follow
        </h3>
        <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
          EXPERTS & LABS
        </span>
      </div>

      <div className="space-y-3">
        {AGRI_WHO_TO_FOLLOW.map((profile) => {
          const isFollowing = !!followingMap[profile.id];

          return (
            <div key={profile.id} className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-emerald-400 via-cyan-400 to-purple-400 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-white text-xs truncate hover:underline cursor-pointer">
                      {profile.name}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </div>
                  <div className="text-[11px] text-cyan-400/80 font-mono truncate">
                    @{profile.handle}
                  </div>
                  <p className="text-[10px] text-gray-300 line-clamp-1 mt-0.5 font-sans">
                    {profile.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleToggleFollow(profile)}
                className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-all duration-300 shrink-0 border shadow-sm ${
                  isFollowing
                    ? 'bg-white/10 text-white border-white/20 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white border-emerald-400 hover:from-emerald-400 hover:to-teal-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
