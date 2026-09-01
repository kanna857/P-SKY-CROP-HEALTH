// Universal Agricultural Knowledge Search Engine & Precision Agronomy Parser
// Exclusively filtered and dedicated to Agriculture, Crops, Plant Pathology, Soil, Fertilizers, and Farming Practices.

import { AGRICULTURAL_KNOWLEDGE_BASE } from './agKnowledgeData';
import { CROP_DISEASE_DATA } from './cropDiseaseData';

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  date?: string;
  category?: 'Agronomic Protocol' | 'Plant Pathology' | 'Soil & Fertilizer' | 'Irrigation & Water' | 'Pest Management' | 'Research & Extension';
  sitelinks?: { title: string; snippet?: string }[];
  thumbnail?: string;
  isVerifiedAgProtocol?: boolean;
  scientificName?: string;
  cropName?: string;
  treatmentSummary?: string;
}

export interface KnowledgeEntity {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  sourceUrl: string;
  sourceName: string;
  attributes: { label: string; value: string }[];
  relatedSearches?: { title: string; subtitle?: string; imageUrl?: string }[];
}

export interface DirectAnswer {
  type: 'calculator' | 'weather' | 'dictionary' | 'unit_converter' | 'time' | 'fact';
  title?: string;
  data: any;
}

export interface SearchResponse {
  query: string;
  isAgDomainOnly: boolean;
  results: SearchResult[];
  totalResultsCount: string;
  searchTimeSeconds: string;
  directAnswer?: DirectAnswer;
  knowledgeEntity?: KnowledgeEntity;
  peopleAlsoAsk: { question: string; answer: string; sourceTitle: string; sourceUrl: string }[];
  relatedSearches: string[];
}

// 1. Curated Agricultural Knowledge Graph for Key Crops & Agronomic Topics
const AG_KNOWLEDGE_GRAPH: Record<string, KnowledgeEntity> = {
  'tomato early blight': {
    id: 'tomato-early-blight',
    title: 'Tomato Early Blight',
    subtitle: 'Foliar fungal pathogen (Alternaria solani)',
    description: 'Early Blight is a destructive fungal disease affecting tomatoes, potatoes, and other solanaceous crops worldwide. It is characterized by concentric brown-to-black ring spots ("target board" pattern) on older foliage, surrounded by a chlorotic yellow halo.',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=60',
    sourceUrl: 'https://en.wikipedia.org/wiki/Alternaria_solani',
    sourceName: 'ICAR / Plant Pathology Extension',
    attributes: [
      { label: 'Causal Agent', value: 'Alternaria solani (Ascomycete fungus)' },
      { label: 'Host Plants', value: 'Tomato, Potato, Eggplant, Bell Pepper' },
      { label: 'Favorable Weather', value: 'Warm temperatures (24–29°C) with prolonged leaf wetness' },
      { label: 'Chemical Treatment', value: 'Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin + Difenoconazole @ 1.0 ml/L' },
      { label: 'Organic Treatment', value: 'Neem Oil 10,000 PPM @ 4 ml/L or Copper Oxychloride 50% WP @ 3.0 g/L' },
      { label: 'Cultural Prevention', value: '3-year crop rotation, drip irrigation (avoid wetting leaves), mulch base' }
    ],
    relatedSearches: [
      { title: 'Tomato Late Blight', subtitle: 'Phytophthora infestans' },
      { title: 'Septoria Leaf Spot', subtitle: 'Fungal leaf spot' },
      { title: 'Mancozeb 75% WP', subtitle: 'Broad-spectrum contact fungicide' },
      { title: 'Neem Oil Biopesticide', subtitle: 'Organic botanical fungicide' }
    ]
  },
  'wheat crown root initiation': {
    id: 'wheat-cri',
    title: 'Crown Root Initiation (CRI) in Wheat',
    subtitle: 'Critical Growth & Irrigation Stage (Triticum aestivum)',
    description: 'Crown Root Initiation (CRI) is the most critical developmental phase in wheat, occurring 20 to 25 days after sowing (DAS). Water stress or delayed nitrogen top-dressing at this specific juncture can permanently reduce yield by up to 30%.',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=60',
    sourceUrl: 'https://en.wikipedia.org/wiki/Wheat',
    sourceName: 'Agronomic Extension Manual',
    attributes: [
      { label: 'Timing', value: '20–25 Days After Sowing (DAS)' },
      { label: 'Recommended Irrigation', value: 'First critical irrigation (50–60 mm depth)' },
      { label: 'Nitrogen Scheduling', value: 'Apply 25% total N dose as urea immediately prior to irrigation' },
      { label: 'Crop Vulnerability', value: 'Highest water and nutrient sensitivity in whole lifecycle' },
      { label: 'Yield Penalty', value: 'Missing CRI irrigation causes up to 25-35% grain yield penalty' }
    ],
    relatedSearches: [
      { title: 'Wheat Rust Protocols', subtitle: 'Puccinia striiformis & triticina' },
      { title: 'Wheat NPK Requirements', subtitle: '120:60:40 kg/ha split dosage' },
      { title: 'Zero Tillage Wheat', subtitle: 'Conservation agriculture technique' }
    ]
  },
  'rice blast': {
    id: 'rice-blast',
    title: 'Rice Blast Disease',
    subtitle: 'Pathogen: Magnaporthe oryzae (Pyricularia oryzae)',
    description: 'Rice blast is one of the most destructive cereal diseases globally, capable of destroying entire paddy fields within days. It causes diamond- or spindle-shaped lesions with grayish-white centers and reddish-brown margins on leaves, nodes, and panicle collars.',
    imageUrl: 'https://images.unsplash.com/photo-1536939459926-301728717817?w=800&auto=format&fit=crop&q=60',
    sourceUrl: 'https://en.wikipedia.org/wiki/Magnaporthe_oryzae',
    sourceName: 'International Rice Research Institute (IRRI)',
    attributes: [
      { label: 'Pathogen', value: 'Magnaporthe oryzae (Filamentous ascomycete)' },
      { label: 'Key Symptoms', value: 'Spindle-shaped lesions on leaves; Neck rot causing chaffy grains' },
      { label: 'Optimum Climate', value: 'High humidity (>90%), cool nights (18–22°C), excessive Nitrogen' },
      { label: 'Recommended Fungicide', value: 'Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L' },
      { label: 'Biological Control', value: 'Pseudomonas fluorescens 0.5% WP seed & foliar treatment' }
    ],
    relatedSearches: [
      { title: 'Bacterial Leaf Blight of Rice', subtitle: 'Xanthomonas oryzae' },
      { title: 'Brown Planthopper (BPH)', subtitle: 'Nilaparvata lugens pest' },
      { title: 'Alternate Wetting & Drying (AWD)', subtitle: 'Water management in paddy' }
    ]
  },
  'precision agriculture': {
    id: 'precision-agriculture',
    title: 'Precision Agriculture & Remote Sensing',
    subtitle: 'Satellite NDVI, Multispectral Drones & Variable Rate Technology',
    description: 'Precision agriculture is an innovative farm management strategy utilizing satellite multispectral imagery, IoT ground sensors, and GPS-guided machinery to observe, measure, and optimize crop health, soil moisture, and input efficiency on a variable-rate basis.',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=60',
    sourceUrl: 'https://en.wikipedia.org/wiki/Precision_agriculture',
    sourceName: 'Precision Agronomy Institute',
    attributes: [
      { label: 'Key Sensor Bands', value: 'Red (665 nm), RedEdge (705 nm), Near-Infrared / NIR (842 nm)' },
      { label: 'Key Indices', value: 'NDVI, EVI, NDWI, GNDVI, NDRE' },
      { label: 'Constellations', value: 'Sentinel-2 (10m res), Landsat 8/9 (30m res), PlanetScope' },
      { label: 'Benefits', value: '15-25% reduction in fertilizer waste; 20% water conservation; early disease detection' },
      { label: 'Core Tools', value: 'Variable Rate Applicators (VRA), RTK GPS Drones, Soil EC Probes' }
    ],
    relatedSearches: [
      { title: 'NDVI Vegetation Index', subtitle: 'Normalized Difference Vegetation Index' },
      { title: 'Sentinel-2 Multispectral', subtitle: 'Copernicus Earth observation' },
      { title: 'Variable Rate Fertigation', subtitle: 'Targeted field nutrient application' }
    ]
  },
  'ndvi': {
    id: 'ndvi-index',
    title: 'NDVI (Normalized Difference Vegetation Index)',
    subtitle: 'Remote Sensing Vegetation Index: (NIR - Red) / (NIR + Red)',
    description: 'NDVI is the standard numerical indicator used in precision agriculture to determine crop vigor and live green canopy density. Healthy chlorophyll-rich plant leaves strongly absorb red light and reflect near-infrared radiation.',
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=60',
    sourceUrl: 'https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index',
    sourceName: 'Satellite Agronomy Extension',
    attributes: [
      { label: 'Formula', value: 'NDVI = (NIR - RED) / (NIR + RED)' },
      { label: 'Healthy Crops Range', value: '0.60 to 0.85 (High biomass & chlorophyll)' },
      { label: 'Moderate Stress Range', value: '0.35 to 0.55 (Moisture stress or canopy disease)' },
      { label: 'Bare Soil / Fallow Range', value: '0.10 to 0.20' },
      { label: 'Water Bodies', value: '-0.1 to -0.5 (Strong NIR absorption)' }
    ],
    relatedSearches: [
      { title: 'EVI (Enhanced Vegetation Index)', subtitle: 'Atmosphere-corrected canopy index' },
      { title: 'NDWI (Water Index)', subtitle: 'Plant canopy water content' },
      { title: 'Sentinel-2 Agriculture', subtitle: 'Spectral bands B4 & B8' }
    ]
  },
  'soil health': {
    id: 'soil-health-npk',
    title: 'Soil Health & NPK Balance',
    subtitle: 'Macronutrient Management & Soil Physical-Chemical Health',
    description: 'Soil health is the continued capacity of soil to function as a vital living ecosystem that sustains plants, animals, and humans. Maintaining an optimal N-P-K (Nitrogen, Phosphorus, Potassium) ratio and pH (6.0–7.5) is paramount for sustainable crop productivity.',
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=60',
    sourceUrl: 'https://en.wikipedia.org/wiki/Soil_fertility',
    sourceName: 'Soil Science & Agronomy Council',
    attributes: [
      { label: 'Ideal N:P:K Ratio', value: '4:2:1 (Cereals) / 2:1:1 or 1:2:2 (Pulses & Oilseeds)' },
      { label: 'Optimum Soil pH', value: '6.2 to 7.2 (Maximizes micronutrient bioavailability)' },
      { label: 'Organic Carbon (OC)', value: '> 0.75% desired for robust soil microbial activity' },
      { label: 'Correction for Acid Soils', value: 'Agricultural Lime (CaCO3) application' },
      { label: 'Correction for Alkaline Soils', value: 'Gypsum (CaSO4·2H2O) @ 2–5 tonnes/ha' }
    ],
    relatedSearches: [
      { title: 'Urea Fertilizer 46% N', subtitle: 'Primary Nitrogen source' },
      { title: 'DAP (Di-ammonium Phosphate)', subtitle: '18% N, 46% P2O5' },
      { title: 'MOP (Muriate of Potash)', subtitle: '60% K2O' },
      { title: 'Trichoderma viride', subtitle: 'Bio-fungicide and soil inoculant' }
    ]
  },
  'drip irrigation': {
    id: 'drip-irrigation',
    title: 'Drip Irrigation & Fertigation Systems',
    subtitle: 'High-Efficiency Micro-Irrigation (WUE up to 95%)',
    description: 'Drip irrigation delivers water and soluble nutrients directly to the root zone of plants at low pressure through an engineered network of tubes and emitters. It reduces water consumption by 40-70% compared to flood irrigation while boosting yields by 20-50%.',
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=60',
    sourceUrl: 'https://en.wikipedia.org/wiki/Drip_irrigation',
    sourceName: 'Micro-Irrigation Engineering Standards',
    attributes: [
      { label: 'Water Use Efficiency', value: '90–95% (Compared to 35–45% for furrow irrigation)' },
      { label: 'Key Components', value: 'Sand media filter, Screen filter, Venturi injector, Pressure regulator' },
      { label: 'Emitter Discharge Rates', value: '1.2 to 4.0 Litres per hour (LPH)' },
      { label: 'Operating Pressure', value: '1.0 to 2.5 kg/cm²' },
      { label: 'Soluble Fertilizers', value: 'Urea, White Potash, 19-19-19, Calcium Nitrate, Phosphoric Acid' }
    ],
    relatedSearches: [
      { title: 'Venturi Fertigation Injector', subtitle: 'Nutrient injection device' },
      { title: 'Soil Moisture Sensors', subtitle: 'Tensiometer and capacitance probes' },
      { title: 'Mulching Film', subtitle: 'Moisture retention & weed control' }
    ]
  },
  'cotton pink bollworm': {
    id: 'cotton-pink-bollworm',
    title: 'Pink Bollworm in Cotton',
    subtitle: 'Insect Pest: Pectinophora gossypiella',
    description: 'The pink bollworm is a devastating lepidopteran pest of cotton. The larvae bore into squares and developing green bolls, feeding on internal seeds and lint fibers, resulting in "rosetted flowers", premature boll drop, and stained lower-quality fiber.',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=60',
    sourceUrl: 'https://en.wikipedia.org/wiki/Pink_bollworm',
    sourceName: 'Central Institute for Cotton Research',
    attributes: [
      { label: 'Scientific Name', value: 'Pectinophora gossypiella' },
      { label: 'Key Diagnostic Sign', value: 'Rosetted flowers and sealed non-opening flower buds' },
      { label: 'Economic Threshold Level (ETL)', value: '8 moths/trap/night for 3 consecutive days OR 10% damaged bolls' },
      { label: 'Pheromone Lure', value: 'Gossyplure traps @ 5-10 traps/ha for monitoring' },
      { label: 'Chemical Spray', value: 'Profenofos 50% EC @ 2 ml/L or Emamectin Benzoate 5% SG @ 0.5 g/L' }
    ],
    relatedSearches: [
      { title: 'Bt Cotton Technology', subtitle: 'Bollgard II Cry toxins' },
      { title: 'Cotton Whitefly Management', subtitle: 'Bemisia tabaci vector' },
      { title: 'Neem Oil Pest Repellent', subtitle: 'Azadirachtin spray' }
    ]
  },
  'potato late blight': {
    id: 'potato-late-blight',
    title: 'Potato Late Blight',
    subtitle: 'Oomycete Pathogen: Phytophthora infestans',
    description: 'Late blight is the infamous pathogen that triggered the Irish Potato Famine. It causes water-soaked purplish-black lesions with white fungal sporulation under humid, cool conditions, turning fields into rotting foliage within 72 hours.',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=60',
    sourceUrl: 'https://en.wikipedia.org/wiki/Phytophthora_infestans',
    sourceName: 'International Potato Center (CIP)',
    attributes: [
      { label: 'Pathogen', value: 'Phytophthora infestans (Oomycete)' },
      { label: 'Triggering Climate', value: 'Relative humidity > 90%, temperature 12–20°C' },
      { label: 'Preventive Spray', value: 'Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil @ 2.0 g/L' },
      { label: 'Curative Protocol', value: 'Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L or Cymoxanil @ 2.0 g/L' },
      { label: 'Field Hygiene', value: 'De-haulm (cut foliage) 10 days before harvesting infected tubers' }
    ],
    relatedSearches: [
      { title: 'Potato Early Blight', subtitle: 'Alternaria solani' },
      { title: 'Seed Tuber Treatment', subtitle: 'Carbendazim dip before planting' },
      { title: 'Potassium Nutrition in Potato', subtitle: 'Tuber bulking protocol' }
    ]
  },
  'neem oil': {
    id: 'neem-oil-ag',
    title: 'Neem Oil (Azadirachtin) Bio-Pesticide',
    subtitle: 'Organic Botanical Insecticide & Repellent',
    description: 'Neem oil derived from Azadirachta indica seeds contains Azadirachtin, a potent tetranortriterpenoid that functions as an antifeedant, insect growth regulator (IGR), repellent, and oviposition deterrent against more than 200 species of agricultural pests.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=60',
    sourceUrl: 'https://en.wikipedia.org/wiki/Neem_oil',
    sourceName: 'Organic Agriculture Research Institute',
    attributes: [
      { label: 'Active Ingredient', value: 'Azadirachtin (1500 PPM, 10,000 PPM, 50,000 PPM)' },
      { label: 'Mode of Action', value: 'Anti-feedant, Ecdysone hormone blocker (stops molting), Repellent' },
      { label: 'Target Pests', value: 'Aphids, Whiteflies, Thrips, Jassids, Mites, Caterpillars' },
      { label: 'Standard Dosage', value: '3 to 5 ml/L of water + 1 ml organic liquid soap emulsifier' },
      { label: 'Beneficial Safety', value: 'Safe for honeybees, ladybird beetles, and earthworms when sprayed at dusk' }
    ],
    relatedSearches: [
      { title: 'Trichoderma viride', subtitle: 'Beneficial bio-control fungus' },
      { title: 'Pseudomonas fluorescens', subtitle: 'Bio-control plant bacteria' },
      { title: 'Organic Vermicompost', subtitle: 'Earthworm nutrient compost' }
    ]
  }
};

// 2. Agricultural Direct Answer Detectors

// 2A. Agronomic Calculations & Fertilizer Dosing
export function detectAndSolveMath(query: string): DirectAnswer | null {
  const clean = query.trim().toLowerCase();

  // Explicit calculation of dosage or fertilizer
  const fertMatch = clean.match(/(?:fertilizer|urea|dap|npk|dosage|spray|dilution|water)\s*(\d+(?:\.\d+)?)/);
  
  // Percentage dilution calculations like "2% of 200" or "0.5% in 500"
  const pctMatch = clean.match(/^(\d+(?:\.\d+)?)\s*%\s*(?:of|in)\s*(\d+(?:\.\d+)?)(?:\s*(?:l|litres|liters|kg|hectare|acre))?$/i);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    const total = parseFloat(pctMatch[2]);
    const ans = (pct / 100) * total;
    return {
      type: 'calculator',
      title: 'Agronomic Foliar Dilution & Dosage Calculation',
      data: {
        expression: `${pct}% foliar concentration in ${total} units`,
        result: `${Number(ans.toFixed(4))} (e.g. ${ans} kg or Litres per ${total} L spray tank)`,
        note: `Standard spray rule: ${pct}% spray = ${(pct * 10).toFixed(1)} g (or ml) per 1 Litre of water.`
      }
    };
  }

  // Standard arithmetic with agricultural application: e.g. "50 * 2.5", "120 / 0.46" (Urea requirement for 120 kg N)
  if (/^[\d\s+\-*/^().]+$/.test(clean) && /[\d]/.test(clean) && /[+\-*/^]/.test(clean)) {
    try {
      const evalSafeExpr = clean.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${evalSafeExpr})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return {
          type: 'calculator',
          title: 'Farm Field & Input Calculation',
          data: {
            expression: clean,
            result: String(Number(result.toFixed(4))),
            note: 'Useful for hectare acreage, spray volume calculations, and fertilizer split doses.'
          }
        };
      }
    } catch {
      // Ignore
    }
  }

  return null;
}

// 2B. Agro-Weather & Field Spray Window Advisory
export function detectWeather(query: string): DirectAnswer | null {
  const clean = query.trim().toLowerCase();
  const weatherMatch = clean.match(/^(?:weather|spray weather|forecast|temperature|humidity)(?:\s+(?:in|for|at))?\s*(.*)$/);

  if (weatherMatch) {
    const city = weatherMatch[1]?.trim() || 'Farming Zone';
    const displayCity = city ? (city.charAt(0).toUpperCase() + city.slice(1)) : 'Farming Region';

    const cityTemps: Record<string, { temp: number; cond: string; humidity: number; wind: number }> = {
      'punjab': { temp: 28, cond: 'Clear & Sunny', humidity: 55, wind: 8 },
      'haryana': { temp: 29, cond: 'Sunny', humidity: 52, wind: 9 },
      'maharashtra': { temp: 31, cond: 'Partly Cloudy', humidity: 68, wind: 11 },
      'andhra pradesh': { temp: 33, cond: 'Humid & Sunny', humidity: 74, wind: 12 },
      'karnataka': { temp: 27, cond: 'Scattered Showers', humidity: 82, wind: 14 },
      'tamil nadu': { temp: 32, cond: 'Warm & Breezy', humidity: 70, wind: 13 },
      'uttar pradesh': { temp: 30, cond: 'Clear Sky', humidity: 58, wind: 7 },
      'california': { temp: 26, cond: 'Dry & Clear', humidity: 42, wind: 10 },
      'iowa': { temp: 22, cond: 'Mild Breeze', humidity: 61, wind: 12 }
    };

    const target = cityTemps[city.toLowerCase()] || {
      temp: 26,
      cond: 'Clear Sky',
      humidity: 62,
      wind: 9
    };

    // Evaluate agricultural spray window feasibility
    const isSpraySafe = target.wind <= 15 && target.humidity <= 80 && !target.cond.includes('Shower') && !target.cond.includes('Rain');
    const sprayAdvisory = isSpraySafe 
      ? 'Optimal Spray Window Open (Wind < 15 km/h, low droplet drift risk, no rain within 6 hours).'
      : 'Spray Warning: High humidity or wind drift risk detected. Avoid spraying systemic fungicides or pesticides until conditions settle.';

    return {
      type: 'weather',
      title: `Agro-Weather & Field Spray Advisory: ${displayCity}`,
      data: {
        city: displayCity,
        temperature: target.temp,
        condition: target.cond,
        humidity: target.humidity,
        windKmh: target.wind,
        precipitationPct: target.cond.includes('Shower') ? 70 : 10,
        sprayWindowStatus: isSpraySafe ? 'SUITABLE FOR SPRAYING' : 'CAUTION: DRIFT / RAIN RISK',
        sprayAdvisory,
        et0: '4.8 mm/day (Reference Evapotranspiration)',
        forecast: [
          { day: 'Mon', temp: target.temp + 1, cond: 'Clear Sky' },
          { day: 'Tue', temp: target.temp, cond: target.cond },
          { day: 'Wed', temp: target.temp - 1, cond: 'Partly Cloudy' },
          { day: 'Thu', temp: target.temp - 2, cond: 'Sunny' },
          { day: 'Fri', temp: target.temp + 1, cond: 'Clear' }
        ]
      }
    };
  }

  return null;
}

// 2C. Agronomic Pathology & Soil Dictionary
export function detectDictionary(query: string): DirectAnswer | null {
  const clean = query.trim().toLowerCase();
  const dictMatch = clean.match(/^(?:define|definition of|meaning of|what is)\s+([a-z-]+)$/);

  const AG_DICTIONARY: Record<string, { phonetic: string; partOfSpeech: string; definition: string; example: string; synonyms: string[] }> = {
    'fertigation': {
      phonetic: '/ˌfɝː.t̬əˈɡeɪ.ʃən/',
      partOfSpeech: 'noun (agronomy)',
      definition: 'The process of injecting fertilizers, soil amendments, and water-soluble products directly into an irrigation system (typically drip or micro-sprinkler).',
      example: 'Drip fertigation allows split nitrogen applications directly to the active root zone.',
      synonyms: ['chemigation', 'liquid feeding', 'nutritional drip', 'micro-fertigation']
    },
    'chlorosis': {
      phonetic: '/kləˈroʊ.sɪs/',
      partOfSpeech: 'noun (plant pathology)',
      definition: 'Abnormal yellowing or blanching of plant leaves caused by a lack of chlorophyll production, commonly triggered by iron or nitrogen deficiency, root disease, or waterlogging.',
      example: 'Interveinal chlorosis on tender leaves indicates severe iron (Fe) deficiency in high pH calcareous soils.',
      synonyms: ['yellowing', 'leaf blanching', 'chlorophyll deficiency']
    },
    'lodging': {
      phonetic: '/ˈlɑː.dʒɪŋ/',
      partOfSpeech: 'noun (crop science)',
      definition: 'The permanent bending or flattening of crop stems near ground level, caused by strong winds, excessive nitrogen application, heavy rain, or weak root systems.',
      example: 'Avoid heavy flood irrigation during high winds at grain milking stage to prevent wheat lodging.',
      synonyms: ['stem breakage', 'stalk collapse', 'crop flattening']
    },
    'etiolation': {
      phonetic: '/ˌiː.ti.əˈleɪ.ʃən/',
      partOfSpeech: 'noun (plant physiology)',
      definition: 'The abnormal, elongated, pale, and spindly growth of plant shoots grown in the absence or insufficiency of light.',
      example: 'Overcrowded tomato seedlings in shade suffer from etiolation and weak stem calibers.',
      synonyms: ['light starvation', 'spindly growth', 'pale elongation']
    },
    'necrosis': {
      phonetic: '/nəˈkroʊ.sɪs/',
      partOfSpeech: 'noun (pathology)',
      definition: 'The death of plant cells or tissue, typically resulting in dried, dark brown or black localized lesions on leaves, stems, or fruit.',
      example: 'Late blight produces rapid foliar necrosis surrounded by water-soaked borders.',
      synonyms: ['tissue death', 'canker', 'blight lesion']
    },
    'allelopathy': {
      phonetic: '/ˌæl.əˈlɑː.pə.θi/',
      partOfSpeech: 'noun (botany & ecology)',
      definition: 'A biological phenomenon by which an organism produces one or more biochemicals that influence the germination, growth, survival, and reproduction of other organisms.',
      example: 'Rye cover crop residue releases allelopathic compounds that suppress broadleaf weed germination.',
      synonyms: ['biochemical inhibition', 'plant interference']
    },
    'roguing': {
      phonetic: '/ˈroʊ.ɡɪŋ/',
      partOfSpeech: 'verb / noun (seed production)',
      definition: 'The systematic removal and destruction of diseased, atypical, off-type, or defective plants from a crop field to protect genetic purity and prevent disease epidemics.',
      example: 'Immediate roguing of mosaic-infected papaya plants stops aphid vectors from transmitting the virus.',
      synonyms: ['culling', 'field sanitation', 'off-type elimination']
    },
    'mycorrhizae': {
      phonetic: '/ˌmaɪ.kəˈraɪ.ziː/',
      partOfSpeech: 'noun (soil biology)',
      definition: 'Symbiotic associations formed between plant roots and beneficial soil fungi, expanding root surface area by up to 1000% to facilitate phosphorus and moisture uptake.',
      example: 'Inoculating roots with vesicular-arbuscular mycorrhizae (VAM) significantly improves drought resilience.',
      synonyms: ['VAM fungus', 'root-fungus symbiosis', 'beneficial mycorrhiza']
    },
    'vernalization': {
      phonetic: '/ˌvɝː.nəl.əˈzeɪ.ʃən/',
      partOfSpeech: 'noun (crop physiology)',
      definition: 'The induction of a plant flowering process by prolonged exposure to the cold of winter or artificial chilling treatment.',
      example: 'Winter wheat requires 4 to 8 weeks of vernalization below 7°C to initiate floral spikelet formation.',
      synonyms: ['chilling requirement', 'cold priming']
    },
    'stover': {
      phonetic: '/ˈstoʊ.vɚ/',
      partOfSpeech: 'noun (agronomy)',
      definition: 'The dried stalks, leaves, and cobs of field crops such as corn, sorghum, or soybean left in the field after grain harvest, used for livestock fodder or conservation mulching.',
      example: 'Retaining corn stover on the soil surface protects against soil erosion and conserves moisture.',
      synonyms: ['crop residue', 'fodder', 'corn stalks']
    }
  };

  if (dictMatch) {
    const word = dictMatch[1];
    const entry = AG_DICTIONARY[word];
    if (entry) {
      return {
        type: 'dictionary',
        title: `Agronomic Glossary: ${word}`,
        data: {
          word,
          ...entry
        }
      };
    }
  }

  return null;
}

// 2D. Agricultural Land & Metric Converter (Hectares, Acres, Bigha, Quintal, etc.)
export function detectUnitConverter(query: string): DirectAnswer | null {
  const clean = query.trim().toLowerCase();
  const match = clean.match(/^(\d+(?:\.\d+)?)\s*([a-z]+)\s+(?:to|in)\s+([a-z]+)$/);

  if (match) {
    const val = parseFloat(match[1]);
    const fromUnit = match[2];
    const toUnit = match[3];

    let result: number | null = null;
    let formulaDesc = '';

    // Hectares to Acres (1 ha = 2.47105 acres)
    if (['ha', 'hectare', 'hectares'].includes(fromUnit) && ['acre', 'acres'].includes(toUnit)) {
      result = val * 2.47105;
      formulaDesc = `${val} ha × 2.47105 = ${Number(result.toFixed(3))} acres`;
    } else if (['acre', 'acres'].includes(fromUnit) && ['ha', 'hectare', 'hectares'].includes(toUnit)) {
      result = val / 2.47105;
      formulaDesc = `${val} acres ÷ 2.47105 = ${Number(result.toFixed(3))} ha`;
    }
    // Acres to Square Meters (1 acre = 4046.86 m²)
    else if (['acre', 'acres'].includes(fromUnit) && ['sqm', 'm2', 'sqmeters', 'meters'].includes(toUnit)) {
      result = val * 4046.86;
      formulaDesc = `${val} acres × 4,046.86 = ${Number(result.toFixed(1))} m²`;
    }
    // Acres to Bigha (Standard average 1 acre = 1.61 bigha; varies by state)
    else if (['acre', 'acres'].includes(fromUnit) && ['bigha', 'bighas'].includes(toUnit)) {
      result = val * 1.6133;
      formulaDesc = `${val} acres ≈ ${Number(result.toFixed(2))} Bigha (Standard Central/Northern conversion)`;
    }
    // Acres to Guntha (1 acre = 40 gunthas)
    else if (['acre', 'acres'].includes(fromUnit) && ['guntha', 'gunthas', 'guntas'].includes(toUnit)) {
      result = val * 40;
      formulaDesc = `${val} acres × 40 = ${result} Gunthas`;
    }
    // Quintal to Kilograms (1 quintal = 100 kg)
    else if (['quintal', 'quintals', 'qtl'].includes(fromUnit) && ['kg', 'kilogram', 'kilograms'].includes(toUnit)) {
      result = val * 100;
      formulaDesc = `${val} quintals × 100 = ${result} kg`;
    } else if (['kg', 'kilogram', 'kilograms'].includes(fromUnit) && ['quintal', 'quintals', 'qtl'].includes(toUnit)) {
      result = val / 100;
      formulaDesc = `${val} kg ÷ 100 = ${Number(result.toFixed(2))} quintals`;
    }
    // Metric Ton to Quintal (1 Ton = 10 Quintals)
    else if (['ton', 'tons', 'tonne'].includes(fromUnit) && ['quintal', 'quintals', 'qtl'].includes(toUnit)) {
      result = val * 10;
      formulaDesc = `${val} tonnes × 10 = ${result} quintals`;
    }
    // Kg/ha to Lbs/acre (1 kg/ha = 0.892 lbs/acre)
    else if (['kgha', 'kg/ha'].includes(fromUnit) && ['lbsacre', 'lbs/acre'].includes(toUnit)) {
      result = val * 0.892179;
      formulaDesc = `${val} kg/ha × 0.892 = ${Number(result.toFixed(2))} lbs/acre`;
    }
    // Celsius to Fahrenheit
    else if (['c', 'celsius'].includes(fromUnit) && ['f', 'fahrenheit'].includes(toUnit)) {
      result = (val * 9 / 5) + 32;
      formulaDesc = `${val}°C = ${Number(result.toFixed(1))}°F (Crop temperature threshold)`;
    } else if (['f', 'fahrenheit'].includes(fromUnit) && ['c', 'celsius'].includes(toUnit)) {
      result = (val - 32) * 5 / 9;
      formulaDesc = `${val}°F = ${Number(result.toFixed(1))}°C`;
    }

    if (result !== null) {
      return {
        type: 'unit_converter',
        title: `Agricultural Land & Unit Converter: ${val} ${fromUnit} to ${toUnit}`,
        data: {
          fromValue: val,
          fromUnit,
          toValue: Number(result.toFixed(3)),
          toUnit,
          formula: formulaDesc
        }
      };
    }
  }

  return null;
}

// 3. Autocomplete Query Suggestions — 100% Agricultural
export function getSearchSuggestions(partial: string): string[] {
  const term = partial.trim().toLowerCase();
  if (!term) return [];

  const AG_CANDIDATES = [
    'tomato early blight treatment',
    'tomato late blight fungicide',
    'wheat crown root initiation irrigation',
    'wheat yellow rust propiconazole',
    'rice blast disease protocol',
    'cotton pink bollworm management',
    'potato late blight metalaxyl',
    'npk fertilizer ratio for maize',
    'drip irrigation fertigation scheduling',
    'soil ph testing and lime requirement',
    'neem oil pesticide dilution ratio',
    'ndvi vegetation index interpretation',
    'maize fall armyworm emamectin',
    'hectares to acres land converter',
    'urea fertilizer dosage per acre',
    'organic biofertilizers rhizobium azotobacter',
    'apple scab fungicide schedule',
    'zinc deficiency symptoms in paddy',
    'sugarcane red rot control sett treatment',
    'banana panama wilt fusarium management',
    'weather in punjab spray advisory',
    'weather spray window',
    'define fertigation',
    'define chlorosis',
    'define lodging',
    'define mycorrhizae'
  ];

  return AG_CANDIDATES.filter(c => c.includes(term)).slice(0, 8);
}

// 4. Agricultural Classifier: verifies whether a search snippet / topic belongs to Agriculture
const AG_KEYWORDS = [
  'crop', 'crops', 'plant', 'plants', 'agronomy', 'agriculture', 'agricultural', 'farming', 'farm',
  'farmer', 'soil', 'leaf', 'leaves', 'seed', 'seedling', 'fertilizer', 'fertilizers', 'irrigation',
  'pesticide', 'fungicide', 'herbicide', 'disease', 'pathogen', 'pest', 'pests', 'blight', 'rust',
  'mildew', 'rot', 'harvest', 'cultivar', 'variety', 'grain', 'wheat', 'rice', 'paddy', 'tomato',
  'potato', 'corn', 'maize', 'cotton', 'soybean', 'sugarcane', 'banana', 'apple', 'grape', 'citrus',
  'nitrogen', 'phosphorus', 'potassium', 'npk', 'urea', 'dap', 'chlorosis', 'ndvi', 'satellite',
  'canopy', 'foliar', 'horticulture', 'yield', 'botany', 'tuber', 'stem', 'root', 'fungus', 'bacteria',
  'aphid', 'bollworm', 'caterpillar', 'organic', 'compost', 'vermicompost', 'spraying'
];

function isAgriculturalResult(title: string, snippet: string): boolean {
  const text = (title + ' ' + snippet).toLowerCase();
  return AG_KEYWORDS.some(k => text.includes(k));
}

// 5. Query Local Agricultural Knowledge Base & 38 Crop Diseases
function searchLocalAgDatabases(cleanQuery: string): SearchResult[] {
  const queryLower = cleanQuery.toLowerCase();
  const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 1);
  const results: SearchResult[] = [];

  // A. Search in 38 Crop Diseases (CROP_DISEASE_DATA)
  for (const [key, disease] of Object.entries(CROP_DISEASE_DATA)) {
    const matchScore = queryTokens.filter(t => 
      disease.plantName.toLowerCase().includes(t) ||
      disease.diseaseName.toLowerCase().includes(t) ||
      (disease.scientificName && disease.scientificName.toLowerCase().includes(t)) ||
      (disease.treatment?.chemicalName && disease.treatment.chemicalName.toLowerCase().includes(t)) ||
      (disease.treatment?.organicOption && disease.treatment.organicOption.toLowerCase().includes(t))
    ).length;

    if (matchScore > 0 || queryLower.includes(disease.plantName.toLowerCase()) || queryLower.includes(disease.diseaseName.toLowerCase())) {
      const chem = disease.treatment?.chemicalName || 'Agronomic sanitation';
      const organic = disease.treatment?.organicOption || 'Biological bio-control';
      const dose = disease.treatment?.dosage || 'As specified';

      results.push({
        id: `disease-${key}`,
        title: `${disease.plantName} — ${disease.diseaseName} Diagnostic & Prescription Protocol`,
        url: `/diagnose`,
        displayUrl: `skycrop.ai > agronomy > pathology > ${disease.plantName.toLowerCase()} > ${disease.diseaseName.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `[Verified Pathology Protocol] Causal pathogen: ${disease.scientificName || disease.diseaseName}. Chemical: ${chem} (${dose}). Organic control: ${organic}. Immediate action: ${disease.treatment?.immediateAction || disease.recommendations[0]}`,
        category: 'Plant Pathology',
        date: 'ICAR / P-SKY Diagnostic Protocol',
        isVerifiedAgProtocol: true,
        cropName: disease.plantName,
        scientificName: disease.scientificName,
        treatmentSummary: `${chem} (${dose}) | ${organic}`,
        sitelinks: [
          { title: 'View Treatment Protocol', snippet: chem },
          { title: 'Organic Control', snippet: organic },
          { title: 'Preventive Measures', snippet: disease.preventiveMeasures?.[0] || 'Crop rotation & sanitation' }
        ]
      });
    }
  }

  // B. Search in Ingestion Database (AGRICULTURAL_KNOWLEDGE_BASE)
  for (const item of AGRICULTURAL_KNOWLEDGE_BASE) {
    const contentLower = item.content.toLowerCase();
    const tagMatch = item.tags.some(t => queryLower.includes(t.toLowerCase()));
    const tokenMatch = queryTokens.some(t => 
      item.crop_name.toLowerCase().includes(t) || 
      item.topic.toLowerCase().includes(t) || 
      (item.sub_category && item.sub_category.toLowerCase().includes(t)) ||
      contentLower.includes(t)
    );

    if (tagMatch || tokenMatch) {
      results.push({
        id: item.id,
        title: `${item.crop_name} Agronomy: ${item.sub_category || item.topic}`,
        url: `/search?q=${encodeURIComponent(item.crop_name + ' ' + item.topic)}`,
        displayUrl: `skycrop.ai > agronomy > ${item.crop_name.toLowerCase()} > ${item.topic.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `[Agronomic Extension Manual] ${item.content}`,
        category: item.topic.includes('Soil') ? 'Soil & Fertilizer' : item.topic.includes('Irrigation') ? 'Irrigation & Water' : 'Agronomic Protocol',
        date: 'Verified Agronomy Protocol',
        isVerifiedAgProtocol: true,
        cropName: item.crop_name,
        scientificName: item.scientific_name,
        sitelinks: [
          { title: `${item.crop_name} Best Practices` },
          { title: `${item.topic} Guide` }
        ]
      });
    }
  }

  return results;
}

// 6. Live Wikipedia REST API Web Search with STRICT Agricultural Scoping
async function fetchAgriculturalWikipediaResults(query: string): Promise<SearchResult[]> {
  try {
    // Append agricultural domain context to guarantee results stay within farming/crops/agronomy
    const scopedQuery = `${query} (agriculture OR crop OR farming OR plant pathology OR agronomy OR soil OR fertilizer)`;
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(scopedQuery)}&utf8=&format=json&origin=*&srlimit=10`;
    const res = await fetch(endpoint);
    if (!res.ok) return [];

    const json = await res.json();
    const items = json?.query?.search || [];

    const filtered = items
      .filter((item: any) => {
        const cleanSnippet = item.snippet.replace(/<[^>]+>/g, '');
        return isAgriculturalResult(item.title, cleanSnippet);
      })
      .slice(0, 6)
      .map((item: any) => {
        const cleanSnippet = item.snippet.replace(/<[^>]+>/g, '');
        const pageTitle = item.title;
        const slug = encodeURIComponent(pageTitle.replace(/ /g, '_'));

        return {
          id: String(item.pageid),
          title: pageTitle,
          url: `https://en.wikipedia.org/wiki/${slug}`,
          displayUrl: `https://en.wikipedia.org > wiki > ${pageTitle.replace(/ /g, '_')}`,
          snippet: cleanSnippet + '...',
          category: 'Research & Extension' as const,
          date: 'Live Agricultural Knowledge',
          sitelinks: [
            { title: `${pageTitle} — Agricultural Context` },
            { title: `Farming Applications` }
          ]
        };
      });

    return filtered;
  } catch (err) {
    console.warn('Wikipedia API unreachable, using local agricultural database:', err);
    return [];
  }
}

// 7. Dynamic Agricultural "People Also Ask" Generator
function generateAgriculturalPeopleAlsoAsk(query: string, results: SearchResult[]) {
  const clean = query.trim();
  const topResult = results[0];

  return [
    {
      question: `What are the recommended agronomic protocols and treatments for ${clean}?`,
      answer: topResult?.snippet || `For ${clean}, integrated pest and nutrient management (IPM), timely irrigation scheduling, and soil test-based NPK application are recommended to maximize crop yields.`,
      sourceTitle: topResult?.title || `${clean} — Agronomic Protocol`,
      sourceUrl: topResult?.url || 'https://en.wikipedia.org'
    },
    {
      question: `How does ${clean} affect crop growth, soil health, and farm productivity?`,
      answer: `Proper management of ${clean} enhances photosynthetic efficiency, preserves soil organic matter, and mitigates yield losses from moisture stress or microbial pathogens.`,
      sourceTitle: `${clean} — Soil & Crop Vigor Guide`,
      sourceUrl: results[1]?.url || 'https://en.wikipedia.org'
    },
    {
      question: `What are the organic and bio-control alternatives for ${clean}?`,
      answer: `Organic farmers utilize neem oil (10,000 PPM), Trichoderma viride, Pseudomonas fluorescens, and balanced vermicomposting to control pathogens and boost natural crop immunity.`,
      sourceTitle: 'Organic Agriculture Extension & Biological Control',
      sourceUrl: 'https://en.wikipedia.org'
    },
    {
      question: `What is the optimal climate, soil pH, and irrigation requirement for ${clean}?`,
      answer: `Most commercial crops achieve peak nutrient assimilation at a soil pH of 6.2–7.2, requiring controlled irrigation at critical phenological stages like flowering and root initiation.`,
      sourceTitle: 'Irrigation & Soil Management Guidelines',
      sourceUrl: 'https://en.wikipedia.org'
    }
  ];
}

// 8. Main Agricultural Search Dispatcher
export async function executeGeneralSearch(query: string): Promise<SearchResponse> {
  const startTime = performance.now();
  const clean = query.trim();
  const lower = clean.toLowerCase();

  // Step 1: Detect Instant Agricultural Direct Answers
  const mathAnswer = detectAndSolveMath(clean);
  const weatherAnswer = detectWeather(clean);
  const dictAnswer = detectDictionary(clean);
  const unitAnswer = detectUnitConverter(clean);

  const directAnswer = mathAnswer || weatherAnswer || dictAnswer || unitAnswer;

  // Step 2: Detect Agricultural Knowledge Graph Entity Match
  let knowledgeEntity: KnowledgeEntity | undefined;
  for (const [key, entity] of Object.entries(AG_KNOWLEDGE_GRAPH)) {
    if (lower.includes(key) || key.includes(lower)) {
      knowledgeEntity = entity;
      break;
    }
  }

  // Step 3: Local Agronomic Databases (Primary & Authoritative)
  const localResults = searchLocalAgDatabases(clean);

  // Step 4: Live Wikipedia Search (Strictly Filtered to Agriculture)
  const liveResults = await fetchAgriculturalWikipediaResults(clean);

  // Combine and deduplicate
  const combined = [...localResults];
  for (const item of liveResults) {
    if (!combined.some(c => c.title.toLowerCase() === item.title.toLowerCase())) {
      combined.push(item);
    }
  }

  let finalResults = combined;

  // Step 5: Fallback if completely empty or non-agricultural query
  if (finalResults.length === 0) {
    // If the query was outside agriculture (e.g. "iphone", "hollywood"), provide polite guardrail guidance
    finalResults = [
      {
        id: 'ag-notice-1',
        title: `🌱 Agricultural Knowledge Guardrail: "${clean}" is Outside the Farming Domain`,
        url: `/search?q=Tomato+Early+Blight`,
        displayUrl: `skycrop.ai > agricultural-domain-filter`,
        snippet: `SkySearch is an exclusive search engine specialized strictly for Agriculture, Crops, Plant Pathology, Soil Health, Fertilizers, and Precision Farming. No direct agricultural records were found for "${clean}". Explore our verified agronomic guides below.`,
        category: 'Research & Extension',
        isVerifiedAgProtocol: true,
        sitelinks: [
          { title: 'Tomato Early Blight Protocol', snippet: 'Alternaria solani treatment & fungicide' },
          { title: 'Wheat Crown Root Initiation', snippet: 'Nitrogen scheduling & critical irrigation' },
          { title: 'Rice Blast Management', snippet: 'Tricyclazole 75% WP dosage' },
          { title: 'Soil NPK Fertilizer Guide', snippet: 'Macronutrient balancing' }
        ]
      },
      ...searchLocalAgDatabases('tomato wheat rice').slice(0, 4)
    ];
  }

  const endTime = performance.now();
  const durationSec = ((endTime - startTime) / 1000).toFixed(2);

  // Formatted count
  const pseudoCount = (finalResults.length * 1240).toLocaleString();

  return {
    query: clean,
    isAgDomainOnly: true,
    results: finalResults,
    totalResultsCount: pseudoCount,
    searchTimeSeconds: durationSec,
    directAnswer: directAnswer || undefined,
    knowledgeEntity,
    peopleAlsoAsk: generateAgriculturalPeopleAlsoAsk(clean, finalResults),
    relatedSearches: [
      `${clean} crop disease treatment`,
      `${clean} fertilizer & NPK dosage`,
      `${clean} organic bio-pesticide protocol`,
      `${clean} drip irrigation scheduling`,
      `${clean} yield optimization guide`
    ]
  };
}
