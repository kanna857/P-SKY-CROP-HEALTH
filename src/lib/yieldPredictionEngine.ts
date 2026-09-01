// AI Crop Yield, Cost & APMC Mandi Profit Prediction Engine

export interface CropYieldConfig {
  name: string;
  category: 'Cereal' | 'Horticulture' | 'Cash Crop' | 'Legume';
  baseYieldPerAcreQ: number; // Quintals per acre at optimal NDVI ~0.80
  ndviSensitivityFactor: number; // How strongly NDVI shifts yield (e.g. 1.25)
  standardCostPerAcre: {
    seeds: number;
    fertilizer: number;
    irrigation: number;
    labor: number;
    cropProtection: number;
    machineryFuel: number;
  };
  mandiRates: {
    mandiName: string;
    state: string;
    currentPriceQ: number;
    mspPriceQ: number;
    priceChange30d: string;
    trend: 'bullish' | 'bearish' | 'steady';
  }[];
  peakHarvestMonth: string;
  marketHoldingAdvise: string;
}

export const CROP_YIELD_DATABASE: Record<string, CropYieldConfig> = {
  wheat: {
    name: '🌾 Wheat (Kanak / Gehu)',
    category: 'Cereal',
    baseYieldPerAcreQ: 22.5, // 20-25 Quintals/acre average
    ndviSensitivityFactor: 1.35,
    standardCostPerAcre: {
      seeds: 1800,
      fertilizer: 3400,
      irrigation: 2200,
      labor: 3500,
      cropProtection: 1600,
      machineryFuel: 2800
    },
    mandiRates: [
      { mandiName: 'Khanna APMC', state: 'Punjab', currentPriceQ: 2475, mspPriceQ: 2275, priceChange30d: '+4.2%', trend: 'bullish' },
      { mandiName: 'Karnal Mandi', state: 'Haryana', currentPriceQ: 2420, mspPriceQ: 2275, priceChange30d: '+2.8%', trend: 'bullish' },
      { mandiName: 'Indore Mandi', state: 'Madhya Pradesh', currentPriceQ: 2890, mspPriceQ: 2275, priceChange30d: '+6.5%', trend: 'bullish' },
      { mandiName: 'Kota Grain Market', state: 'Rajasthan', currentPriceQ: 2450, mspPriceQ: 2275, priceChange30d: '+1.9%', trend: 'steady' }
    ],
    peakHarvestMonth: 'April - May',
    marketHoldingAdvise: 'Expected +6% price surge in early June. Hold high-grade Sharbati grain in dry storage with hermetic bags.'
  },
  paddy: {
    name: '🍚 Paddy / Basmati Rice',
    category: 'Cereal',
    baseYieldPerAcreQ: 26.0,
    ndviSensitivityFactor: 1.4,
    standardCostPerAcre: {
      seeds: 2200,
      fertilizer: 4200,
      irrigation: 3800,
      labor: 5500,
      cropProtection: 2400,
      machineryFuel: 3200
    },
    mandiRates: [
      { mandiName: 'Taraori Basmati Yard', state: 'Haryana', currentPriceQ: 3950, mspPriceQ: 2320, priceChange30d: '+5.1%', trend: 'bullish' },
      { mandiName: 'Amritsar Grain Market', state: 'Punjab', currentPriceQ: 3880, mspPriceQ: 2320, priceChange30d: '+3.4%', trend: 'bullish' },
      { mandiName: 'Nizamabad APMC', state: 'Telangana', currentPriceQ: 2350, mspPriceQ: 2320, priceChange30d: '+0.8%', trend: 'steady' }
    ],
    peakHarvestMonth: 'October - November',
    marketHoldingAdvise: 'Basmati export demand is accelerating in Gulf markets. Sell 60% immediately and hold 40% for post-December premiums.'
  },
  tomato: {
    name: '🍅 Hybrid Tomato',
    category: 'Horticulture',
    baseYieldPerAcreQ: 140.0, // High ton yield (14-18 tons/acre)
    ndviSensitivityFactor: 1.6,
    standardCostPerAcre: {
      seeds: 7500,
      fertilizer: 9200,
      irrigation: 4500,
      labor: 11000,
      cropProtection: 8500,
      machineryFuel: 3000
    },
    mandiRates: [
      { mandiName: 'Kolar Tomato Market', state: 'Karnataka', currentPriceQ: 3800, mspPriceQ: 0, priceChange30d: '+22.5%', trend: 'bullish' },
      { mandiName: 'Pimpalgaon APMC', state: 'Maharashtra', currentPriceQ: 3650, mspPriceQ: 0, priceChange30d: '+18.0%', trend: 'bullish' },
      { mandiName: 'Azadpur Mandi', state: 'Delhi NCR', currentPriceQ: 4200, mspPriceQ: 0, priceChange30d: '+25.4%', trend: 'bullish' }
    ],
    peakHarvestMonth: 'Year-Round (Flush Peaks in March & Nov)',
    marketHoldingAdvise: 'Tomato prices are currently elevated due to southern rain flushes. Sell fresh harvest immediately to avoid post-harvest rot.'
  },
  cotton: {
    name: '🌱 Cotton (Kapas)',
    category: 'Cash Crop',
    baseYieldPerAcreQ: 11.5,
    ndviSensitivityFactor: 1.45,
    standardCostPerAcre: {
      seeds: 3200,
      fertilizer: 4800,
      irrigation: 2900,
      labor: 6500,
      cropProtection: 4200,
      machineryFuel: 2600
    },
    mandiRates: [
      { mandiName: 'Rajkot Cotton Yard', state: 'Gujarat', currentPriceQ: 7280, mspPriceQ: 7122, priceChange30d: '+1.5%', trend: 'steady' },
      { mandiName: 'Warangal Cotton Market', state: 'Telangana', currentPriceQ: 7190, mspPriceQ: 7122, priceChange30d: '+0.7%', trend: 'steady' },
      { mandiName: 'Yavatmal APMC', state: 'Maharashtra', currentPriceQ: 7220, mspPriceQ: 7122, priceChange30d: '+1.1%', trend: 'steady' }
    ],
    peakHarvestMonth: 'December - February',
    marketHoldingAdvise: 'Global textile mills are restocking. Maintain moisture below 8% in godowns to fetch grade-1 long staple rate.'
  },
  potato: {
    name: '🥔 Potato (Aloo)',
    category: 'Horticulture',
    baseYieldPerAcreQ: 110.0,
    ndviSensitivityFactor: 1.3,
    standardCostPerAcre: {
      seeds: 12000,
      fertilizer: 6500,
      irrigation: 3200,
      labor: 7000,
      cropProtection: 3800,
      machineryFuel: 3500
    },
    mandiRates: [
      { mandiName: 'Agra Potato Yard', state: 'Uttar Pradesh', currentPriceQ: 1480, mspPriceQ: 0, priceChange30d: '-3.2%', trend: 'bearish' },
      { mandiName: 'Jalandhar APMC', state: 'Punjab', currentPriceQ: 1420, mspPriceQ: 0, priceChange30d: '-4.1%', trend: 'bearish' },
      { mandiName: 'Hooghly Mandi', state: 'West Bengal', currentPriceQ: 1550, mspPriceQ: 0, priceChange30d: '-1.8%', trend: 'bearish' }
    ],
    peakHarvestMonth: 'February - March',
    marketHoldingAdvise: 'Cold storage rental recommended. Cold stored tubers command 40–55% higher pricing by July–September.'
  },
  corn: {
    name: '🌽 Maize / Corn (Makka)',
    category: 'Cereal',
    baseYieldPerAcreQ: 28.0,
    ndviSensitivityFactor: 1.3,
    standardCostPerAcre: {
      seeds: 2800,
      fertilizer: 3900,
      irrigation: 2100,
      labor: 3400,
      cropProtection: 1800,
      machineryFuel: 2500
    },
    mandiRates: [
      { mandiName: 'Davanagere Mandi', state: 'Karnataka', currentPriceQ: 2240, mspPriceQ: 2090, priceChange30d: '+3.1%', trend: 'bullish' },
      { mandiName: 'Chhindwara Market', state: 'Madhya Pradesh', currentPriceQ: 2190, mspPriceQ: 2090, priceChange30d: '+2.4%', trend: 'bullish' },
      { mandiName: 'Gulabbagh Mandi', state: 'Bihar', currentPriceQ: 2310, mspPriceQ: 2090, priceChange30d: '+4.8%', trend: 'bullish' }
    ],
    peakHarvestMonth: 'September - October',
    marketHoldingAdvise: 'Poultry feed & bio-ethanol distillery demand is high. Stable upward pricing expected.'
  }
};

export interface YieldPredictionResult {
  cropName: string;
  acreage: number;
  ndviUsed: number;
  vigorClassification: 'Optimal Vigor' | 'Good Biomass' | 'Moderate Stressed' | 'Severe Deficit';
  yieldPerAcreQ: number;
  totalHarvestQuintals: number;
  totalHarvestMetricTons: number;
  expectedGrossRevenue: number;
  totalEstimatedCosts: number;
  netEstimatedProfit: number;
  roiPercentage: number;
  costBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  activeMandi: {
    mandiName: string;
    state: string;
    pricePerQuintal: number;
    mspPrice: number;
    trend: 'bullish' | 'bearish' | 'steady';
  };
  holdingAdvisory: string;
}

export function calculateYieldAndProfit(
  cropKey: string,
  acreage: number,
  currentNDVI: number,
  customCostMultiplier = 1.0
): YieldPredictionResult {
  const config = CROP_YIELD_DATABASE[cropKey] || CROP_YIELD_DATABASE['wheat'];

  // NDVI health factor: baseline NDVI is 0.70.
  // Clamp between 0.40 and 0.95
  const clampedNDVI = Math.max(0.40, Math.min(0.95, currentNDVI));
  const ndviRatio = clampedNDVI / 0.72; // Normalizer
  const yieldPerAcreQ = Number(
    (config.baseYieldPerAcreQ * Math.pow(ndviRatio, config.ndviSensitivityFactor)).toFixed(1)
  );

  const totalHarvestQuintals = Number((yieldPerAcreQ * acreage).toFixed(1));
  const totalHarvestMetricTons = Number((totalHarvestQuintals / 10).toFixed(2));

  // Determine vigor
  let vigorClassification: YieldPredictionResult['vigorClassification'] = 'Good Biomass';
  if (clampedNDVI >= 0.78) vigorClassification = 'Optimal Vigor';
  else if (clampedNDVI >= 0.65) vigorClassification = 'Good Biomass';
  else if (clampedNDVI >= 0.50) vigorClassification = 'Moderate Stressed';
  else vigorClassification = 'Severe Deficit';

  // Primary Mandi selection (default first)
  const primaryMandi = config.mandiRates[0];
  const pricePerQ = primaryMandi.currentPriceQ;

  const expectedGrossRevenue = Math.round(totalHarvestQuintals * pricePerQ);

  // Costs calculation
  const c = config.standardCostPerAcre;
  const rawCostPerAcre = (
    c.seeds +
    c.fertilizer +
    c.irrigation +
    c.labor +
    c.cropProtection +
    c.machineryFuel
  ) * customCostMultiplier;

  const totalEstimatedCosts = Math.round(rawCostPerAcre * acreage);
  const netEstimatedProfit = expectedGrossRevenue - totalEstimatedCosts;
  const roiPercentage = totalEstimatedCosts > 0 
    ? Number(((netEstimatedProfit / totalEstimatedCosts) * 100).toFixed(1))
    : 0;

  const costBreakdown = [
    { category: 'Fertilizers & NPK', amount: Math.round(c.fertilizer * customCostMultiplier * acreage), percentage: 0 },
    { category: 'Labor & Weeding', amount: Math.round(c.labor * customCostMultiplier * acreage), percentage: 0 },
    { category: 'Seeds & Sowing', amount: Math.round(c.seeds * customCostMultiplier * acreage), percentage: 0 },
    { category: 'Irrigation & Pumping', amount: Math.round(c.irrigation * customCostMultiplier * acreage), percentage: 0 },
    { category: 'Pesticides & Spray', amount: Math.round(c.cropProtection * customCostMultiplier * acreage), percentage: 0 },
    { category: 'Tractor Fuel & Machinery', amount: Math.round(c.machineryFuel * customCostMultiplier * acreage), percentage: 0 }
  ];

  // Calculate percentages
  costBreakdown.forEach(item => {
    item.percentage = totalEstimatedCosts > 0 ? Math.round((item.amount / totalEstimatedCosts) * 100) : 0;
  });

  return {
    cropName: config.name,
    acreage,
    ndviUsed: clampedNDVI,
    vigorClassification,
    yieldPerAcreQ,
    totalHarvestQuintals,
    totalHarvestMetricTons,
    expectedGrossRevenue,
    totalEstimatedCosts,
    netEstimatedProfit,
    roiPercentage,
    costBreakdown,
    activeMandi: {
      mandiName: primaryMandi.mandiName,
      state: primaryMandi.state,
      pricePerQuintal: primaryMandi.currentPriceQ,
      mspPrice: primaryMandi.mspPriceQ,
      trend: primaryMandi.trend
    },
    holdingAdvisory: config.marketHoldingAdvise
  };
}
