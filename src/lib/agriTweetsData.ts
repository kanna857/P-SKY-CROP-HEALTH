// Agricultural-Only Twitter/X Data Store & State Engine (AgriTweets)

export interface AgriComment {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
}

export interface AgriPollOption {
  text: string;
  votes: number;
}

export interface AgriPoll {
  question: string;
  options: AgriPollOption[];
  totalVotes: number;
  userVotedIndex?: number;
}

export interface AgriTweet {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    role: string;
    location: string;
    verifiedType: 'agronomist' | 'scientist' | 'master_farmer' | 'extension' | 'farmer';
  };
  content: string;
  cropTag: string;
  isUrgentAlert?: boolean;
  alertSeverity?: 'critical' | 'warning' | 'advisory';
  images?: string[];
  timestamp: string;
  likes: number;
  retweets: number;
  repliesCount: number;
  bookmarks: number;
  hasLiked?: boolean;
  hasRetweeted?: boolean;
  hasBookmarked?: boolean;
  poll?: AgriPoll;
  comments: AgriComment[];
  category: 'pathology' | 'fertilizer' | 'market' | 'irrigation' | 'general';
}

export interface AgriTrend {
  id: string;
  hashtag: string;
  category: string;
  tweetCount: string;
  isOutbreakWarning?: boolean;
}

export interface AgriProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  institution: string;
  bio: string;
  isFollowing?: boolean;
}

// 1. Curated Initial Seed Agricultural Tweets
const SEED_AGRI_TWEETS: AgriTweet[] = [
  {
    id: 'tweet-01',
    author: {
      name: 'Dr. Harpreet Singh Sandhu',
      handle: 'sandhu_agronomy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'Principal Plant Pathologist (PAU)',
      location: 'Ludhiana, Punjab',
      verifiedType: 'scientist'
    },
    content: '🚨 URGENT PEST ALERT: Yellow Stripe Rust (Puccinia striiformis) confirmed in Anandpur Sahib & Ropar wheat belts due to persistent morning fog & 12-16°C temperatures. \n\nImmediate Action: Spray Propiconazole 25% EC (Tilt) @ 1 ml/L or Tebuconazole 250 EC in 200L water/acre before boot stage! Do NOT delay. #WheatRustAlert #PunjabFarming #PestWarning',
    cropTag: '🌾 Wheat',
    isUrgentAlert: true,
    alertSeverity: 'critical',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=60'
    ],
    timestamp: '24m',
    likes: 342,
    retweets: 189,
    repliesCount: 47,
    bookmarks: 94,
    category: 'pathology',
    comments: [
      {
        id: 'c-1',
        author: 'Gurmeet Gill',
        handle: 'gill_farms_pb',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'Wheat & Mustard Grower',
        content: 'Noticed yellow linear powder on HD-2967 flag leaves this morning. Procuring Tilt right away. Thanks for the early alarm doctor!',
        timestamp: '15m',
        likes: 18
      },
      {
        id: 'c-2',
        author: 'SkyCrop AI Pathology',
        handle: 'SkyCropAI',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        role: 'Verified Agronomy Engine',
        content: 'Recommended spray window for Ludhiana today: 11:00 AM – 3:30 PM (Foliage dried, wind velocity 7 km/h, rain probability < 5%).',
        timestamp: '8m',
        likes: 29
      }
    ]
  },
  {
    id: 'tweet-02',
    author: {
      name: 'Ramesh Patel',
      handle: 'patel_organics',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      role: 'Organic Horticulture Master Farmer',
      location: 'Nashik, Maharashtra',
      verifiedType: 'master_farmer'
    },
    content: 'Day 45 of our drip fertigation protocol with homemade Jeevamrit & fermented neem cake extract on early hybrid tomatoes. \n\nTarget spot & Early blight zero incidence so far! Foliage color index is deep emerald. What bio-stimulants are you applying this week? #OrganicFarming #TomatoGrowers #DripFertigation #SoilMicrobiome',
    cropTag: '🍅 Tomato',
    images: [
      'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=60'
    ],
    timestamp: '2h',
    likes: 512,
    retweets: 98,
    repliesCount: 36,
    bookmarks: 142,
    category: 'fertilizer',
    poll: {
      question: 'Which organic fungicide / bio-protectant has given your crops the highest blight immunity?',
      options: [
        { text: 'Neem Oil 10,000 PPM + Soap', votes: 248 },
        { text: 'Trichoderma viride foliar', votes: 312 },
        { text: 'Pseudomonas fluorescens', votes: 140 },
        { text: 'Copper Hydroxide organic', votes: 98 }
      ],
      totalVotes: 798
    },
    comments: [
      {
        id: 'c-3',
        author: 'Ananya Deshmukh',
        handle: 'ananya_agri',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'Horticulture Agronomist',
        content: 'Trichoderma soil drenching at transplanting plus fortnightly neem sprays makes a massive difference in root-knot nematode suppression as well!',
        timestamp: '1h',
        likes: 31
      }
    ]
  },
  {
    id: 'tweet-03',
    author: {
      name: 'Krishi Mandi Live Ticker',
      handle: 'AgriMandiUpdate',
      avatar: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&auto=format&fit=crop&q=80',
      role: 'APMC Commodity Price Analytics',
      location: 'New Delhi',
      verifiedType: 'extension'
    },
    content: '📊 TODAY APMC MANDI ARRIVALS & RATES:\n\n🌾 Sharbati Wheat: ₹2,840/Q (▲ +₹45/Q)\n🥔 Kufri Jyoti Potato: ₹1,420/Q (▼ -₹30/Q)\n🍅 Hybrid Tomato: ₹38/kg (▲ +₹6/kg)\n🍚 1509 Basmati Paddy: ₹3,920/Q (▲ +₹80/Q)\n🌱 Cotton Medium Staple: ₹7,180/Q (Steady)\n\nArrivals steady in MP & Rajasthan yards. #MandiRates #AgriMarkets #KisanMSP',
    cropTag: '📊 Market Prices',
    timestamp: '3h',
    likes: 678,
    retweets: 312,
    repliesCount: 54,
    bookmarks: 231,
    category: 'market',
    comments: []
  },
  {
    id: 'tweet-04',
    author: {
      name: 'Central Cotton Research Network',
      handle: 'ICAR_Cotton',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      role: 'ICAR Extension Service',
      location: 'Nagpur, Maharashtra',
      verifiedType: 'extension'
    },
    content: '⚠️ Cotton Alert across Vidarbha & Telangana: Green boll sampling indicates Pink Bollworm (Pectinophora gossypiella) trap catches crossing Economic Threshold (8 moths/trap/night). \n\nInstall 5 Gossyplure pheromone traps per acre immediately. If damaged flower rosettes exceed 5%, spray Profenofos 50% EC @ 2 ml/L or Emamectin Benzoate 5% SG @ 0.5 g/L. #CottonBollworm #VidarbhaFarming #IPMAlert',
    cropTag: '🌱 Cotton',
    isUrgentAlert: true,
    alertSeverity: 'warning',
    images: [
      'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=60'
    ],
    timestamp: '5h',
    likes: 421,
    retweets: 245,
    repliesCount: 29,
    bookmarks: 180,
    category: 'pathology',
    comments: []
  },
  {
    id: 'tweet-05',
    author: {
      name: 'Suresh Reddy',
      handle: 'reddy_drip_tech',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      role: 'Precision Irrigation Specialist',
      location: 'Warangal, Telangana',
      verifiedType: 'agronomist'
    },
    content: 'Installed automated soil matric potential tensiometers across 40 acres of sweet corn. We were previously over-irrigating by nearly 35%! \n\nWater savings: 1.2 million liters. Fertilizer leaching reduced to negligible levels. Precision agriculture is not the future — it is today\'s survival kit. #WaterConservation #SmartFarming #PrecisionAg #DripTech',
    cropTag: '🌽 Maize / Corn',
    images: [
      'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=60'
    ],
    timestamp: '8h',
    likes: 890,
    retweets: 215,
    repliesCount: 42,
    bookmarks: 290,
    category: 'irrigation',
    comments: []
  }
];

// 2. Agricultural Trending Hashtags
export const AGRI_TRENDING_TOPICS: AgriTrend[] = [
  { id: 'tr-1', hashtag: '#WheatRustAlert', category: 'Plant Pathology · Outbreak', tweetCount: '14.8K AgriTweets', isOutbreakWarning: true },
  { id: 'tr-2', hashtag: '#TomatoMandiRates', category: 'Agri Commodity · Pricing', tweetCount: '9.2K AgriTweets' },
  { id: 'tr-3', hashtag: '#NanoUreaSpray', category: 'Fertilizers · Technology', tweetCount: '11.4K AgriTweets' },
  { id: 'tr-4', hashtag: '#CottonBollworm', category: 'Pest Management · Advisory', tweetCount: '7.8K AgriTweets', isOutbreakWarning: true },
  { id: 'tr-5', hashtag: '#DripFertigation', category: 'Precision Irrigation', tweetCount: '6.5K AgriTweets' },
  { id: 'tr-6', hashtag: '#MonsoonForecast2026', category: 'Agro Meteorology', tweetCount: '23.1K AgriTweets' },
  { id: 'tr-7', hashtag: '#OrganicTrichoderma', category: 'Biological Control', tweetCount: '5.2K AgriTweets' },
  { id: 'tr-8', hashtag: '#SolarPumpingSubsidy', category: 'Farm Economics', tweetCount: '8.4K AgriTweets' }
];

// 3. Agricultural Profiles to Follow
export const AGRI_WHO_TO_FOLLOW: AgriProfile[] = [
  {
    id: 'fol-1',
    name: 'Dr. M. S. Swaminathan Foundation',
    handle: 'MSSRF_Research',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'Pioneering Sustainable Food Security',
    institution: 'MSSRF Chennai',
    bio: 'Ecological agriculture, climate-resilient pulses & coastal agro-forestry.'
  },
  {
    id: 'fol-2',
    name: 'ICAR National Pathology Division',
    handle: 'ICAR_Pathology',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    role: 'Central Fungal & Bacterial Diagnostics',
    institution: 'ICAR-IARI Pusa',
    bio: 'National surveillance network for rusts, blights, and viral vectors.'
  },
  {
    id: 'fol-3',
    name: 'SkyCrop AI Precision Agronomy',
    handle: 'SkyCropAI',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    role: 'Satellite Multispectral Analytics',
    institution: 'P-SKY Agricultural Labs',
    bio: '10m Sentinel-2 NDVI canopy stress alerts & Grad-CAM plant vision.'
  },
  {
    id: 'fol-4',
    name: 'BioFarm Organic Innovators',
    handle: 'BioFarmNetwork',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    role: 'Zero Budget Natural Farming Collective',
    institution: 'APCNF India',
    bio: 'Multi-layer intercropping, indigenous seeds & bio-inoculant preparation.'
  }
];

// 4. Commodity Ticker Data
export const COMMODITY_TICKER = [
  { crop: '🌾 Sharbati Wheat', price: '₹2,840/Q', change: '+1.6%', isPositive: true },
  { crop: '🍅 Hybrid Tomato', price: '₹38/kg', change: '+18.7%', isPositive: true },
  { crop: '🍚 1509 Basmati', price: '₹3,920/Q', change: '+2.1%', isPositive: true },
  { crop: '🥔 Jyoti Potato', price: '₹1,420/Q', change: '-2.0%', isPositive: false },
  { crop: '🌱 Cotton (Medium)', price: '₹7,180/Q', change: '+0.5%', isPositive: true },
  { crop: '🌽 Yellow Corn', price: '₹2,160/Q', change: '+1.1%', isPositive: true },
  { crop: '🫘 Soybean (Yellow)', price: '₹4,750/Q', change: '-0.8%', isPositive: false }
];

const LOCAL_STORAGE_KEY = 'skycrop_agri_tweets_v1';

// 5. Helper Storage Functions
export function getSavedAgriTweets(): AgriTweet[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_AGRI_TWEETS));
      return SEED_AGRI_TWEETS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse saved tweets, falling back to seed data', err);
    return SEED_AGRI_TWEETS;
  }
}

export function saveAgriTweets(tweets: AgriTweet[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tweets));
  } catch (err) {
    console.error('Failed to save tweets to localStorage', err);
  }
}

export function postNewAgriTweet(tweet: Omit<AgriTweet, 'id' | 'timestamp' | 'likes' | 'retweets' | 'repliesCount' | 'bookmarks' | 'comments'>): AgriTweet {
  const current = getSavedAgriTweets();
  const newTweet: AgriTweet = {
    ...tweet,
    id: `tweet-${Date.now()}`,
    timestamp: 'Just now',
    likes: 0,
    retweets: 0,
    repliesCount: 0,
    bookmarks: 0,
    hasLiked: false,
    hasRetweeted: false,
    hasBookmarked: false,
    comments: []
  };

  const updated = [newTweet, ...current];
  saveAgriTweets(updated);
  return newTweet;
}

export function toggleTweetLike(tweetId: string): { updatedTweet: AgriTweet; isLiked: boolean } {
  const current = getSavedAgriTweets();
  let isLiked = false;
  const updated = current.map(t => {
    if (t.id === tweetId) {
      isLiked = !t.hasLiked;
      return {
        ...t,
        hasLiked: isLiked,
        likes: isLiked ? t.likes + 1 : Math.max(0, t.likes - 1)
      };
    }
    return t;
  });

  saveAgriTweets(updated);
  const updatedTweet = updated.find(t => t.id === tweetId)!;
  return { updatedTweet, isLiked };
}

export function toggleTweetRetweet(tweetId: string): { updatedTweet: AgriTweet; isRetweeted: boolean } {
  const current = getSavedAgriTweets();
  let isRetweeted = false;
  const updated = current.map(t => {
    if (t.id === tweetId) {
      isRetweeted = !t.hasRetweeted;
      return {
        ...t,
        hasRetweeted: isRetweeted,
        retweets: isRetweeted ? t.retweets + 1 : Math.max(0, t.retweets - 1)
      };
    }
    return t;
  });

  saveAgriTweets(updated);
  const updatedTweet = updated.find(t => t.id === tweetId)!;
  return { updatedTweet, isRetweeted };
}

export function toggleTweetBookmark(tweetId: string): { updatedTweet: AgriTweet; isBookmarked: boolean } {
  const current = getSavedAgriTweets();
  let isBookmarked = false;
  const updated = current.map(t => {
    if (t.id === tweetId) {
      isBookmarked = !t.hasBookmarked;
      return {
        ...t,
        hasBookmarked: isBookmarked,
        bookmarks: isBookmarked ? t.bookmarks + 1 : Math.max(0, t.bookmarks - 1)
      };
    }
    return t;
  });

  saveAgriTweets(updated);
  const updatedTweet = updated.find(t => t.id === tweetId)!;
  return { updatedTweet, isBookmarked };
}

export function voteAgriPoll(tweetId: string, optionIndex: number): AgriTweet | null {
  const current = getSavedAgriTweets();
  const updated = current.map(t => {
    if (t.id === tweetId && t.poll && t.poll.userVotedIndex === undefined) {
      const newOptions = [...t.poll.options];
      newOptions[optionIndex] = {
        ...newOptions[optionIndex],
        votes: newOptions[optionIndex].votes + 1
      };

      return {
        ...t,
        poll: {
          ...t.poll,
          options: newOptions,
          totalVotes: t.poll.totalVotes + 1,
          userVotedIndex: optionIndex
        }
      };
    }
    return t;
  });

  saveAgriTweets(updated);
  return updated.find(t => t.id === tweetId) || null;
}

export function addAgriComment(tweetId: string, text: string): AgriTweet | null {
  if (!text.trim()) return null;
  const current = getSavedAgriTweets();
  const newComment: AgriComment = {
    id: `c-${Date.now()}`,
    author: 'You (Kisan AgriX)',
    handle: 'you_farmer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'Farm Operator & Agronomy Member',
    content: text.trim(),
    timestamp: 'Just now',
    likes: 0
  };

  const updated = current.map(t => {
    if (t.id === tweetId) {
      return {
        ...t,
        repliesCount: t.repliesCount + 1,
        comments: [newComment, ...t.comments]
      };
    }
    return t;
  });

  saveAgriTweets(updated);
  return updated.find(t => t.id === tweetId) || null;
}
