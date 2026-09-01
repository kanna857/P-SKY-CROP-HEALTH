import { supabase } from '@/integrations/supabase/client';

export interface AgKnowledgeItem {
  id: string;
  crop_name: string;
  topic: string;
  sub_category?: string;
  scientific_name?: string;
  content: string;
  tags: string[];
  relevance_rank?: number;
}

export const AGRICULTURAL_KNOWLEDGE_BASE: AgKnowledgeItem[] = [
  // WHEAT (Triticum aestivum)
  {
    id: 'kb-wheat-01',
    crop_name: 'Wheat',
    topic: 'Soil & Fertilizer',
    sub_category: 'Nitrogen Scheduling & Crown Root Initiation',
    scientific_name: 'Triticum aestivum',
    content: 'Wheat requires 120-150 kg N/ha in split applications. Apply 50% basal dose with full P (60 kg P2O5/ha) and K (40 kg K2O/ha). The first top-dressing of 25% Nitrogen MUST coincide with Crown Root Initiation (CRI) stage at 20-25 days after sowing (DAS), followed immediately by irrigation. The remaining 25% Nitrogen is applied at first node/jointing stage (40-45 DAS). Deficiency causes pale yellowing of older leaves progressing upward.',
    tags: ['nitrogen', 'fertilizer', 'wheat', 'cri', 'basal', 'phosphorus', 'potassium', 'deficiency']
  },
  {
    id: 'kb-wheat-02',
    crop_name: 'Wheat',
    topic: 'Pest Management',
    sub_category: 'Brown Leaf Rust & Stripe Rust Protocol',
    scientific_name: 'Triticum aestivum',
    content: 'Brown leaf rust (Puccinia triticina) and Stripe/Yellow rust (Puccinia striiformis) produce round orange-brown pustules and yellow linear stripes on leaf blades. Under cool humid conditions (10-18°C), stripe rust spreads rapidly. Management: Foliar spray of Propiconazole 25% EC @ 1.0 ml/L or Tebuconazole 250 EC @ 1.0 ml/L at first appearance of pustules. Resistant cultivars (HD 2967, DBW 187, PBW 550) recommended for rust-prone zones.',
    tags: ['rust', 'leaf rust', 'stripe rust', 'propiconazole', 'fungicide', 'wheat', 'puccinia', 'disease']
  },
  {
    id: 'kb-wheat-03',
    crop_name: 'Wheat',
    topic: 'Irrigation Scheduling',
    sub_category: 'Critical Stage Irrigation Scheduling',
    scientific_name: 'Triticum aestivum',
    content: 'Wheat demands 4-6 critical irrigations depending on soil moisture holding capacity. Critical growth stages in order of priority: 1. Crown Root Initiation (21 DAS - yield reduction up to 30% if missed); 2. Tillering (40-45 DAS); 3. Late Jointing (60-65 DAS); 4. Flowering (80-85 DAS); 5. Milking (100-105 DAS); 6. Dough stage (115-120 DAS). Avoid irrigation during high winds to prevent lodging.',
    tags: ['irrigation', 'wheat', 'water', 'cri', 'lodging', 'drought', 'scheduling']
  },

  // TOMATO (Solanum lycopersicum)
  {
    id: 'kb-tomato-01',
    crop_name: 'Tomato',
    topic: 'Pathogen Diagnostics',
    sub_category: 'Early Blight (Alternaria solani) Protocol',
    scientific_name: 'Solanum lycopersicum',
    content: 'Early Blight caused by Alternaria solani manifests as dark brown-to-black concentric ring spots ("target board" pattern) on lower leaves, surrounded by a chlorotic yellow halo. Optimum conditions: warm temperatures (24-29°C) with prolonged leaf wetness. Treatment: Spray Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L as preventive. For curative intervention, apply Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L at 10-day intervals.',
    tags: ['tomato', 'early blight', 'alternaria', 'blight', 'fungicide', 'concentric rings', 'mancozeb', 'azoxystrobin']
  },
  {
    id: 'kb-tomato-02',
    crop_name: 'Tomato',
    topic: 'Pathogen Diagnostics',
    sub_category: 'Late Blight (Phytophthora infestans) Emergency Protocol',
    scientific_name: 'Solanum lycopersicum',
    content: 'Late Blight is an aggressive oomycete causing water-soaked pale green lesions that turn dark purplish-brown with delicate white fungal down on the leaf underside under high humidity (>90%) and cool temperatures (15-20°C). Destroys canopies within 72 hours. Protocol: Immediate spray of Dimethomorph 50% WP @ 1.0 g/L + Mancozeb, or Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L. Remove and bury infected debris; do not compost.',
    tags: ['tomato', 'late blight', 'phytophthora', 'blight', 'oomycete', 'metalaxyl', 'emergency', 'fungicide']
  },
  {
    id: 'kb-tomato-03',
    crop_name: 'Tomato',
    topic: 'Soil & Fertilizer',
    sub_category: 'Blossom End Rot & Calcium Fertigation',
    scientific_name: 'Solanum lycopersicum',
    content: 'Blossom End Rot (BER) is a physiological disorder characterized by water-soaked depressions at the distal end of fruit turning black and leathery. Caused by localized Calcium (Ca) deficiency in fruit tissue during rapid cell expansion, typically exacerbated by irregular irrigation and excessive Ammonium (NH4) nitrogen. Treatment: Maintain steady soil moisture; apply foliar sprays of Calcium Nitrate @ 5.0 g/L or chelated Ca-EDTA @ 1.5 g/L during fruit set.',
    tags: ['tomato', 'calcium', 'blossom end rot', 'fertilizer', 'fertigation', 'physiological', 'disorder']
  },

  // MAIZE / CORN (Zea mays)
  {
    id: 'kb-maize-01',
    crop_name: 'Maize',
    topic: 'Pest Management',
    sub_category: 'Fall Armyworm (Spodoptera frugiperda) IPM Strategy',
    scientific_name: 'Zea mays',
    content: 'Fall Armyworm (FAW) causes windowing in young leaves and ragged whorl feeding with characteristic saw-dust frass. Inverted "Y" marking on head capsule and four square pinacula on eighth abdominal segment. Threshold: 5% whorl damage in seedling stage, 10% in mid-whorl. Control: In early whorl, apply Bacillus thuringiensis (Bt) kurstaki @ 2.0 g/L or Metarhizium rileyi @ 3.0 g/L. Chemical intervention: Chlorantraniliprole 18.5% SC @ 0.4 ml/L or Emamectin benzoate 5% SG @ 0.4 g/L directed into the central whorl.',
    tags: ['maize', 'corn', 'fall armyworm', 'spodoptera', 'pest', 'chlorantraniliprole', 'ipm', 'bt']
  },
  {
    id: 'kb-maize-02',
    crop_name: 'Maize',
    topic: 'Soil & Fertilizer',
    sub_category: 'Zinc Deficiency Diagnosis & Foliar Correction',
    scientific_name: 'Zea mays',
    content: 'Zinc deficiency in maize presents as "White Bud" — broad chlorotic bands on both sides of the midrib between the base and tip of emerging leaves. Stunted internodes and delayed tasseling. High phosphorus levels in soil can induce zinc lockup. Correction: Soil application of Zinc Sulfate (ZnSO4 21%) @ 25 kg/ha at sowing. Foliar rescue: Spray Zinc chelate (Zn-EDTA 12%) @ 1.0 g/L or Zinc Sulfate heptahydrate @ 5.0 g/L neutralized with 2.5 g/L slaked lime.',
    tags: ['maize', 'corn', 'zinc', 'micronutrient', 'white bud', 'fertilizer', 'deficiency', 'edta']
  },

  // RICE / PADDY (Oryza sativa)
  {
    id: 'kb-rice-01',
    crop_name: 'Rice',
    topic: 'Pathogen Diagnostics',
    sub_category: 'Bacterial Leaf Blight (Xanthomonas oryzae pv. oryzae)',
    scientific_name: 'Oryza sativa',
    content: 'Bacterial Leaf Blight (BLB) causes wavy, water-soaked yellowish-translucent stripes along leaf margins from the tip downwards, turning whitish-gray with bacterial oozing beads in early morning dew. Severe "Kresek" wilt in seedlings. Control: Drain standing water from field. Avoid excessive top-dressed nitrogen. Apply Copper Hydroxide 77% WP @ 2.0 g/L mixed with Streptocycline (Streptomycin sulphate + Tetracycline) @ 0.1 g/L (1.0 g per 10 L water).',
    tags: ['rice', 'paddy', 'bacterial blight', 'xanthomonas', 'kresek', 'streptocycline', 'copper', 'blight']
  },
  {
    id: 'kb-rice-02',
    crop_name: 'Rice',
    topic: 'Pathogen Diagnostics',
    sub_category: 'Rice Blast (Magnaporthe oryzae) Leaf & Neck Management',
    scientific_name: 'Oryza sativa',
    content: 'Rice blast produces diamond- or spindle-shaped lesions with grayish-white centers and brownish margins on leaf blades (Leaf Blast), and dark brown rotting at the panicle base (Neck Blast) causing empty grains. Protocol: Foliar spray of Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L at boot leaf stage and 50% panicle emergence. Maintain 2-3 cm water layer to reduce pathogen sporulation.',
    tags: ['rice', 'paddy', 'blast', 'magnaporthe', 'tricyclazole', 'fungicide', 'panicle', 'spindle']
  },

  // POTATO (Solanum tuberosum)
  {
    id: 'kb-potato-01',
    crop_name: 'Potato',
    topic: 'Soil & Fertilizer',
    sub_category: 'Potassium Balancing for Tuber Quality & Specific Gravity',
    scientific_name: 'Solanum tuberosum',
    content: 'Potato is a heavy potassium feeder, demanding 120-180 kg K2O/ha. Potassium Sulfate (SOP) is strictly preferred over Potassium Chloride (MOP) because excessive chloride reduces tuber dry matter content and specific gravity, degrading chip and fry processing quality. Deficiency exhibits as dark green crinkled foliage with bronze necrosis along leaf margins. Apply 60% K at planting and 40% during tuber initiation (30-35 DAS).',
    tags: ['potato', 'potassium', 'sop', 'mop', 'fertilizer', 'tuber', 'starch', 'nutrition', 'chloride']
  },
  {
    id: 'kb-potato-02',
    crop_name: 'Potato',
    topic: 'Pathogen Diagnostics',
    sub_category: 'Late Blight Preventive Fungicide Rotation',
    scientific_name: 'Solanum tuberosum',
    content: 'Phytophthora infestans in potato spreads exponentially in cloudy, drizzly weather (relative humidity >85%, temperatures 12-22°C). High risk period warrants preventive protection before canopy closure. Spray Mancozeb 75% WP @ 2.5 kg/ha prophylactically. Upon disease warning forecast, switch to systemic translaminar options: Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L or Fenamidone 10% + Mancozeb 50% WG @ 2.5 g/L.',
    tags: ['potato', 'late blight', 'phytophthora', 'cymoxanil', 'mancozeb', 'fungicide', 'rotation']
  },

  // COTTON (Gossypium hirsutum)
  {
    id: 'kb-cotton-01',
    crop_name: 'Cotton',
    topic: 'Pest Management',
    sub_category: 'Pink Bollworm (Pectinophora gossypiella) Pheromone Trapping & Bio-Control',
    scientific_name: 'Gossypium hirsutum',
    content: 'Pink Bollworm caterpillars enter developing bolls and feed on seeds, preventing lint development and staining fiber. Early detection requires Gossyplure pheromone traps installed @ 5 traps/ha at 45 DAS. Economic Threshold Level (ETL): 8 moths/trap/day for 3 consecutive days or 10% rosette flowers. Management: Handpick and destroy rosette flowers. Release Trichogramma bactrae egg parasitoids @ 150,000/ha. Chemical: Spinosad 45% SC @ 0.3 ml/L or Profenofos 50% EC @ 2.0 ml/L.',
    tags: ['cotton', 'pink bollworm', 'pectinophora', 'pheromone', 'spinosad', 'pest', 'etl', 'bio-control']
  },

  // APPLE (Malus domestica)
  {
    id: 'kb-apple-01',
    crop_name: 'Apple',
    topic: 'Pathogen Diagnostics',
    sub_category: 'Apple Scab (Venturia inaequalis) Mills Period Spray Scheduling',
    scientific_name: 'Malus domestica',
    content: 'Apple scab causes olive-green to velvet black lesions on leaves and corky, scabby fissures on fruit. Primary ascospore release occurs from overwintered leaf litter during bud burst (Green Tip stage). Mills Infection Period correlates hours of continuous leaf wetness with temperature to calculate infection severity. Protection: Apply Captan 50% WP @ 2.5 g/L or Dodine 65% WP @ 1.0 g/L at Silver Tip to Green Tip. Post-infection curative: Difenoconazole 25% EC @ 0.3 ml/L within 72 hours of rain.',
    tags: ['apple', 'scab', 'venturia', 'mills period', 'captan', 'difenoconazole', 'fungicide', 'orchard']
  },

  // GRAPE (Vitis vinifera)
  {
    id: 'kb-grape-01',
    crop_name: 'Grape',
    topic: 'Pathogen Diagnostics',
    sub_category: 'Downy Mildew (Plasmopara viticola) & Powdery Mildew Protocol',
    scientific_name: 'Vitis vinifera',
    content: 'Downy mildew causes oily yellow "oil-spots" on upper leaf surface with dense white cottony sporulation on the underside; powdery mildew produces ash-gray powdery coating on leaves and berries causing fruit splitting. Downy Protocol: Bordeaux Mixture (1%) or Potassium Phosphite @ 3.0 g/L preventive; Metalaxyl 8% + Mancozeb 64% @ 2.5 g/L curative. Powdery Protocol: Wettable Sulfur 80% WDG @ 3.0 g/L or Kresoxim-methyl 44.3% SC @ 0.7 ml/L.',
    tags: ['grape', 'downy mildew', 'powdery mildew', 'bordeaux', 'sulfur', 'viticulture', 'fungicide']
  },

  // CHILLI (Capsicum annuum)
  {
    id: 'kb-chilli-01',
    crop_name: 'Chilli',
    topic: 'Pest Management',
    sub_category: 'Thrips (Scirtothrips dorsalis) & Mite Complex Protocol',
    scientific_name: 'Capsicum annuum',
    content: 'Chilli thrips cause upward leaf curling, boat-shaped foliage, and silvery bronzed scarring on fruit. Yellow mites (Polyphagotarsonemus latus) cause downward curling ("inverted boat"), elongated petioles, and brittle leaves. Thrips Control: Fipronil 5% SC @ 2.0 ml/L or Spinetoram 11.7% SC @ 1.0 ml/L. Mite Control: Spiromesifen 22.9% SC @ 1.0 ml/L or Diafenthiuron 50% WP @ 1.2 g/L. Blue sticky traps @ 25/ha enhance early capture.',
    tags: ['chilli', 'pepper', 'thrips', 'mites', 'curling', 'fipronil', 'spiromesifen', 'pest']
  }
];

export interface ParsedGoogleQuery {
  exactPhrases: string[];
  excludedTerms: string[];
  orGroups: string[][];
  normalTerms: string[];
}

/**
 * Parses conversational Google search engine syntax:
 * - "exact phrase in quotes"
 * - -excludedWord
 * - termA OR termB
 * - standard space-separated words
 */
export function parseGoogleQuery(rawQuery: string): ParsedGoogleQuery {
  const exactPhrases: string[] = [];
  const excludedTerms: string[] = [];
  const orGroups: string[][] = [];
  const normalTerms: string[] = [];

  // 1. Extract exact phrases in quotes: "phrase"
  let cleanQuery = rawQuery.replace(/"([^"]+)"/g, (_, phrase) => {
    if (phrase.trim()) {
      exactPhrases.push(phrase.trim().toLowerCase());
    }
    return ' ';
  });

  // 2. Extract excluded terms with minus: -word
  cleanQuery = cleanQuery.replace(/-(\S+)/g, (_, term) => {
    if (term.trim()) {
      excludedTerms.push(term.trim().toLowerCase());
    }
    return ' ';
  });

  // 3. Extract OR clauses: term1 OR term2
  if (cleanQuery.includes(' OR ')) {
    const parts = cleanQuery.split(' OR ');
    for (let i = 0; i < parts.length - 1; i++) {
      const leftWords = parts[i].trim().split(/\s+/);
      const rightWords = parts[i + 1].trim().split(/\s+/);
      const leftTerm = leftWords.pop();
      const rightTerm = rightWords.shift();
      if (leftTerm && rightTerm) {
        orGroups.push([leftTerm.toLowerCase(), rightTerm.toLowerCase()]);
      }
      parts[i] = leftWords.join(' ');
      parts[i + 1] = rightWords.join(' ');
    }
    cleanQuery = parts.join(' ');
  }

  // 4. Remaining standard terms
  const words = cleanQuery.trim().split(/\s+/);
  for (const word of words) {
    if (word && word.toLowerCase() !== 'or') {
      normalTerms.push(word.toLowerCase());
    }
  }

  return {
    exactPhrases,
    excludedTerms,
    orGroups,
    normalTerms,
  };
}

/**
 * Searches the local agricultural knowledge base using Google syntax:
 * Evaluates exact phrases, exclusions, OR clauses, and weights.
 */
export function searchLocalKnowledgeBase(query: string): AgKnowledgeItem[] {
  if (!query.trim()) return [];

  const parsed = parseGoogleQuery(query);
  const results: Array<{ item: AgKnowledgeItem; rank: number }> = [];

  for (const item of AGRICULTURAL_KNOWLEDGE_BASE) {
    const crop = item.crop_name.toLowerCase();
    const sci = (item.scientific_name || '').toLowerCase();
    const topic = item.topic.toLowerCase();
    const sub = (item.sub_category || '').toLowerCase();
    const content = item.content.toLowerCase();
    const tags = item.tags.map((t) => t.toLowerCase());

    const allText = `${crop} ${sci} ${topic} ${sub} ${content} ${tags.join(' ')}`;

    // A. Check excluded terms: If any excluded term appears, drop this record
    let isExcluded = false;
    for (const ex of parsed.excludedTerms) {
      if (allText.includes(ex)) {
        isExcluded = true;
        break;
      }
    }
    if (isExcluded) continue;

    // B. Check exact phrases: ALL exact phrases must be matched verbatim
    let exactMatchesCount = 0;
    let exactFailed = false;
    for (const phrase of parsed.exactPhrases) {
      if (!allText.includes(phrase)) {
        exactFailed = true;
        break;
      }
      exactMatchesCount++;
    }
    if (exactFailed && parsed.exactPhrases.length > 0) continue;

    // C. Check OR groups: at least one term in each OR group must match
    let orFailed = false;
    for (const group of parsed.orGroups) {
      const match = group.some((term) => allText.includes(term));
      if (!match) {
        orFailed = true;
        break;
      }
    }
    if (orFailed && parsed.orGroups.length > 0) continue;

    // D. Check normal terms: all normal terms must be present
    let normalMatchesCount = 0;
    let normalFailed = false;
    for (const term of parsed.normalTerms) {
      if (!allText.includes(term)) {
        normalFailed = true;
        break;
      }
      normalMatchesCount++;
    }
    if (normalFailed && parsed.normalTerms.length > 0) continue;

    // E. Calculate weighted relevance rank (matching Postgres ts_rank_cd behavior)
    let score = 0;
    const queryTerms = [...parsed.normalTerms, ...parsed.exactPhrases];

    for (const term of queryTerms) {
      // Weight A: Crop Name (x4.0)
      if (crop.includes(term)) score += 4.0;
      // Weight B: Scientific Name & Topic / Subcategory (x2.5)
      if (sci.includes(term)) score += 2.5;
      if (topic.includes(term)) score += 2.5;
      if (sub.includes(term)) score += 2.5;
      // Weight C: Tags & Content (x1.0)
      if (tags.some((t) => t.includes(term))) score += 2.0;
      const countInContent = (content.match(new RegExp(term, 'g')) || []).length;
      score += Math.min(3.0, countInContent * 0.5);
    }

    if (parsed.exactPhrases.length > 0) {
      score += exactMatchesCount * 3.0; // Bonus for verbatim quote match
    }

    // Normalize rank between 0.1 and 0.99
    const relevanceRank = parseFloat(Math.min(0.99, Math.max(0.12, score / 12.0)).toFixed(2));

    results.push({
      item: {
        ...item,
        relevance_rank: relevanceRank,
      },
      rank: relevanceRank,
    });
  }

  return results.sort((a, b) => b.rank - a.rank).map((r) => r.item);
}

/**
 * High-level Agricultural Search function:
 * 1. Tries Supabase RPC function `google_style_ag_search(user_query: query)`
 * 2. If Supabase fails or is offline, falls back to the client-side Google parser!
 */
export async function executeGoogleAgSearch(query: string): Promise<AgKnowledgeItem[]> {
  if (!query.trim()) return [];

  // Try live Supabase RPC first
  try {
    const { data, error } = await (supabase as any).rpc('google_style_ag_search', {
      user_query: query,
    });

    if (!error && data && Array.isArray(data) && data.length > 0) {
      return data as AgKnowledgeItem[];
    }
  } catch (err) {
    console.warn('[AgSearch] Supabase query failed or offline, falling back to local engine:', err);
  }

  // Fallback to local full-text Google syntax engine
  return searchLocalKnowledgeBase(query);
}
