export interface TreatmentProtocol {
  chemicalName: string;
  dosage: string;
  organicOption: string;
  organicDosage: string;
  sprayInterval: string;
  immediateAction: string;
}

export interface CropDiseaseXAI {
  lesionTitle: string;
  lesionDesc: string;
  patternTitle: string;
  patternDesc: string;
  anomalyTitle: string;
  anomalyDesc: string;
  ndviDropPct: number;
  ndviDropDesc: string;
  thermalDeltaC: number;
  thermalDesc: string;
}

export interface CropDiseaseInfo {
  plantName: string;
  diseaseName: string;
  scientificName?: string;
  isHealthy: boolean;
  severity: 'Low' | 'Medium' | 'High';
  treatment?: TreatmentProtocol;
  recommendations: string[];
  preventiveMeasures: string[];
  xai?: CropDiseaseXAI;
}

export const CROP_DISEASE_DATA: Record<string, CropDiseaseInfo> = {
  // ======================== APPLE ========================
  'Apple___Apple_scab': {
    plantName: 'Apple',
    diseaseName: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Captan 50% WP or Difenoconazole 25% EC',
      dosage: 'Captan @ 2.5 g/L OR Difenoconazole @ 0.5 ml/L of water',
      organicOption: 'Sulfur 80% WDG or Potassium Bicarbonate',
      organicDosage: 'Sulfur @ 3.0 g/L of water',
      sprayInterval: 'Spray at green tip stage; repeat after 7–10 days during rainy weather',
      immediateAction: 'Prune densely clustered twigs to increase canopy airflow and sunlight penetration.'
    },
    recommendations: [
      'Chemical: Apply Captan 50% WP (2.5 g/L) or Difenoconazole 25% EC (0.5 ml/L) at first sign of olive-green velvety lesions.',
      'Organic: Spray wettable sulfur (3.0 g/L) or neem oil 10,000 PPM (4.0 ml/L) before rain events.',
      'Cultural: Rake, shred, or deep-bury fallen autumn leaves to eliminate overwintering fungal pseudothecia.',
      'Application: Spray early in the morning (6–9 AM) when foliage dries quickly; avoid spraying during direct midday sun.'
    ],
    preventiveMeasures: [
      'Plant scab-resistant cultivars such as Liberty, Enterprise, or Prima.',
      'Maintain an open tree canopy through annual dormant pruning for fast leaf drying.',
      'Irrigate using under-tree micro-sprinklers or drip; never use overhead sprinklers.'
    ],
    xai: {
      lesionTitle: '9 Olive-Green to Velvety Lesions Detected',
      lesionDesc: 'Cuticle surface segmentation identified clustered lesions with feathered borders on upper leaf surface.',
      patternTitle: 'Irregular Circular Lesion Cluster',
      patternDesc: 'Venturia inaequalis conidial sporulation creating velvety olive-brown patches on upper foliage.',
      anomalyTitle: 'Leaf Cuticle Distortion & Upward Crinkling',
      anomalyDesc: 'Localized cuticle puckering and tissue thickening around fungal mycelial invasion.',
      ndviDropPct: 31.2,
      ndviDropDesc: 'Foliar reflectance dropped by 31.2% in infected zones due to disrupted mesophyll.',
      thermalDeltaC: 2.8,
      thermalDesc: 'Transpiration inhibited across velvety patches, causing +2.8°C thermal anomaly.',
    },
  },
  'Apple___Black_rot': {
    plantName: 'Apple',
    diseaseName: 'Black Rot (Frogeye Leaf Spot)',
    scientificName: 'Botryosphaeria obtusa',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Thiophanate-methyl 70% WP or Mancozeb 75% WP',
      dosage: 'Thiophanate-methyl @ 1.0 g/L OR Mancozeb @ 2.5 g/L of water',
      organicOption: 'Copper Oxychloride 50% WP',
      organicDosage: 'Copper Oxychloride @ 3.0 g/L of water',
      sprayInterval: 'Spray from silver tip through petal fall; repeat every 10–14 days',
      immediateAction: 'Immediately cut out and burn all dead wood, mummified fruits, and trunk cankers.'
    },
    recommendations: [
      'Chemical: Apply Mancozeb 75% WP (2.5 g/L) or Thiophanate-methyl (1.0 g/L) during pink bud and petal fall stages.',
      'Sanitation: Prune out branch cankers at least 15 cm (6 inches) below the discolored wood line.',
      'Mummy Fruit Removal: Remove all dried, mummified apples hanging on branches or fallen on the orchard floor.',
      'Wound Protection: Seal pruning cuts larger than 2 cm with copper-based pruning paste.'
    ],
    preventiveMeasures: [
      'Keep trees vigorous through balanced nitrogen and potassium fertilization.',
      'Control tree borers and insect pests that create wound entry points for fungal spores.',
      'Sterilize pruning shears between cuts using 70% isopropyl alcohol or 10% bleach.'
    ],
  },
  'Apple___Cedar_apple_rust': {
    plantName: 'Apple',
    diseaseName: 'Cedar Apple Rust',
    scientificName: 'Gymnosporangium juniperi-virginianae',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Myclobutanil 10% WP or Triadimefon 25% WP',
      dosage: 'Myclobutanil @ 0.4 g/L OR Triadimefon @ 0.5 g/L of water',
      organicOption: 'Liquid Copper Soap Fungicide',
      organicDosage: 'Copper soap @ 2.5 ml/L of water',
      sprayInterval: 'Apply starting at pink bud stage; repeat 3 times at 10-day intervals',
      immediateAction: 'Inspect and remove gelatinous orange horn galls on nearby red cedar / juniper trees.'
    },
    recommendations: [
      'Chemical: Apply Myclobutanil 10% WP (0.4 g/L) or Propiconazole 25% EC (0.75 ml/L) during pink bud through petal fall.',
      'Alternate Host Management: Remove or prune orange galls from Juniper/Cedar trees within a 500-meter perimeter.',
      'Timing: Apply protectant sprays just before spring rain when cedar galls begin swelling and releasing aeciospores.',
      'Foliar Nourishment: Spray seaweed extract (2 ml/L) after petal fall to boost leaf resilience.'
    ],
    preventiveMeasures: [
      'Plant rust-immune apple varieties like Redfree, Liberty, Freedom, or Williams Pride.',
      'Avoid planting ornamental junipers within 1 km of the commercial apple orchard.',
      'Scout for bright yellow-orange upper-leaf lesions in late spring.'
    ],
  },
  'Apple___healthy': {
    plantName: 'Apple',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required (Preventive maintenance)',
      dosage: 'N/A',
      organicOption: 'Neem Oil 10,000 PPM (Preventive)',
      organicDosage: 'Neem oil @ 3.0 ml/L of water monthly',
      sprayInterval: 'Monthly preventive check',
      immediateAction: 'Continue current nutrition, soil mulching, and irrigation schedule.'
    },
    recommendations: [
      'Maintain standard integrated pest management (IPM) monitoring schedule.',
      'Apply balanced NPK fertilizer based on annual soil and leaf tissue testing.',
      'Ensure 5–8 cm layer of organic mulch around the tree drip line avoiding direct trunk contact.'
    ],
    preventiveMeasures: [
      'Maintain annual winter dormant oil spray to control scale insects and mite eggs.',
      'Ensure proper drainage to prevent root rot during rainy periods.',
      'Keep tree canopy open to maintain high air circulation.'
    ],
  },

  // ======================== BLUEBERRY ========================
  'Blueberry___healthy': {
    plantName: 'Blueberry',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Pine bark mulch + Sulfur for soil acidification',
      organicDosage: 'Maintain soil pH 4.5–5.2',
      sprayInterval: 'Seasonal check',
      immediateAction: 'Maintain acidic soil moisture.'
    },
    recommendations: [
      'Maintain soil pH strictly between 4.5 and 5.2 using elemental sulfur.',
      'Apply organic pine bark mulch (7–10 cm depth) to keep root zone cool and moist.',
      'Fertilize with ammonium sulfate or rhododendron-specific acidic fertilizer.'
    ],
    preventiveMeasures: [
      'Inspect weekly for signs of mummy berry or anthracnose during flowering.',
      'Use drip irrigation to keep foliage completely dry.',
      'Prune canes older than 6 years to promote vigorous new canes.'
    ],
  },

  // ======================== CHERRY ========================
  'Cherry_(including_sour)___Powdery_mildew': {
    plantName: 'Cherry',
    diseaseName: 'Powdery Mildew',
    scientificName: 'Podosphaera clandestina',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Azoxystrobin 23% SC or Hexaconazole 5% EC',
      dosage: 'Azoxystrobin @ 1.0 ml/L OR Hexaconazole @ 1.5 ml/L of water',
      organicOption: 'Potassium Bicarbonate or Wettable Sulfur 80%',
      organicDosage: 'Potassium Bicarbonate @ 3.0 g/L + 1 ml sticker/L',
      sprayInterval: 'Apply at first sign of white powdery patches; repeat at 10-day intervals',
      immediateAction: 'Prune infected shoot terminals and burn immediately.'
    },
    recommendations: [
      'Chemical: Spray Azoxystrobin 23% SC (1.0 ml/L) or Difenoconazole (0.5 ml/L) as soon as white powdery fungal patches emerge.',
      'Organic: Apply Potassium Bicarbonate (3 g/L) or Trichoderma harzianum (5 g/L) thoroughly on leaf surfaces.',
      'Nutrient Control: Avoid excessive nitrogen fertilizer applications which stimulate susceptible succulent shoots.',
      'Canopy Management: Thin water sprouts and suckers to allow sunlight penetration.'
    ],
    preventiveMeasures: [
      'Prune dormant trees to maximize air movement throughout the orchard.',
      'Avoid late afternoon sprinkler irrigation.',
      'Select less susceptible cherry varieties for new plantings.'
    ],
  },
  'Cherry_(including_sour)___healthy': {
    plantName: 'Cherry',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Copper dormant spray (Winter)',
      organicDosage: 'Copper hydroxide @ 2.5 g/L during winter dormancy',
      sprayInterval: 'Monthly inspection',
      immediateAction: 'Continue current orchard care schedule.'
    },
    recommendations: [
      'Continue standard orchard sanitation and weed clearance.',
      'Monitor leaves weekly for leaf spot or shot hole disease.',
      'Apply balanced micro-nutrients (Boron, Zinc) during pre-bloom.'
    ],
    preventiveMeasures: [
      'Apply dormant copper spray before bud swell in winter to prevent bacterial canker.',
      'Maintain drip irrigation around the root zone.'
    ],
  },

  // ======================== CORN (MAIZE) ========================
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
    plantName: 'Corn (Maize)',
    diseaseName: 'Cercospora / Gray Leaf Spot (GLS)',
    scientificName: 'Cercospora zeae-maydis',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Pyraclostrobin + Fluxapyroxad OR Azoxystrobin + Propiconazole',
      dosage: 'Fungicide mix @ 1.0–1.2 ml/L of water',
      organicOption: 'Trichoderma viride 1% WP',
      organicDosage: 'Trichoderma @ 5.0 g/L + 1 ml spreader',
      sprayInterval: 'Apply at VT to R1 (tasseling to silking stage); repeat once in 14 days if wet weather continues',
      immediateAction: 'Scout upper canopy; if lesions reach 2 leaves below the ear leaf before silking, spray immediately.'
    },
    recommendations: [
      'Chemical: Apply Azoxystrobin 18.2% + Difenoconazole 11.4% SC (1.0 ml/L) or Pyraclostrobin at tasseling (VT/R1).',
      'Crop Rotation: Rotate field with non-host crops (soybean, peanut, cotton, or pulses) for at least 1–2 seasons.',
      'Residue Management: Deep-till crop debris after harvest to bury fungal conidia and accelerate residue breakdown.',
      'Field Density: Avoid excessive planting densities that elevate canopy humidity.'
    ],
    preventiveMeasures: [
      'Plant corn hybrids rated high for Gray Leaf Spot tolerance.',
      'Ensure balanced soil potassium (K) levels to strengthen stalk and leaf cell walls.',
      'Avoid continuous no-till corn-on-corn monoculture in humid river valleys.'
    ],
  },
  'Corn_(maize)___Common_rust_': {
    plantName: 'Corn (Maize)',
    diseaseName: 'Common Rust',
    scientificName: 'Puccinia sorghi',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Mancozeb 75% WP or Propiconazole 25% EC',
      dosage: 'Propiconazole @ 1.0 ml/L OR Mancozeb @ 2.5 g/L of water',
      organicOption: 'Neem Oil 10,000 PPM + Bacillus subtilis',
      organicDosage: 'Neem oil @ 4.0 ml/L of water',
      sprayInterval: 'Apply when rust pustules cover > 5% of leaf area; repeat after 10–14 days',
      immediateAction: 'Scout both upper and lower leaf surfaces for reddish-brown powdery pustules.'
    },
    recommendations: [
      'Chemical: Spray Propiconazole 25% EC (1.0 ml/L) or Tebuconazole 25.9% EC (1.0 ml/L) at early pustule emergence.',
      'Timing: Treat early when lesions first appear on leaves below the ear leaf prior to tasseling.',
      'Foliar Zinc: Spray zinc sulfate (2.0 g/L) to assist rapid cellular recovery.',
      'Early Planting: Plant early in the season to mature crops before peak airborne spore flights.'
    ],
    preventiveMeasures: [
      'Select corn hybrids containing the Rp1-D rust resistance gene.',
      'Monitor regional agricultural disease forecasting advisories for airborne spore alerts.',
      'Avoid high-density seeding that restricts wind movement.'
    ],
  },
  'Corn_(maize)___Northern_Leaf_Blight': {
    plantName: 'Corn (Maize)',
    diseaseName: 'Northern Corn Leaf Blight (NCLB)',
    scientificName: 'Setosphaeria turcica',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Azoxystrobin + Cyproconazole OR Mancozeb 75% WP',
      dosage: 'Azoxystrobin mix @ 1.0 ml/L OR Mancozeb @ 2.5 g/L of water',
      organicOption: 'Pseudomonas fluorescens 1% WP',
      organicDosage: 'Pseudomonas @ 5.0 g/L of water',
      sprayInterval: 'Spray at V12 through silking (R1); repeat in 14 days if rainy conditions persist',
      immediateAction: 'Check for cigar-shaped grayish-green lesions (2–15 cm long) on lower leaves.'
    },
    recommendations: [
      'Chemical: Apply Azoxystrobin + Difenoconazole (1.0 ml/L) or Pyraclostrobin (1.2 ml/L) between V12 and blister stage.',
      'Organic: Foliar spray Pseudomonas fluorescens (5 g/L) combined with neem cake soil application (200 kg/ha).',
      'Crop Rotation: Rotate field for 2 seasons with broadleaf crops like soybeans or legumes.',
      'Tillage: Incorporate previous crop debris into the soil to reduce overwintering chlamydospores.'
    ],
    preventiveMeasures: [
      'Plant NCLB-resistant corn hybrids with multi-genic resistance (Ht1, Ht2, Ht3, or HtN).',
      'Ensure proper balanced fertilization; avoid high nitrogen with deficient potassium.',
      'Maintain field drainage to prevent localized water stagnation.'
    ],
  },
  'Corn_(maize)___healthy': {
    plantName: 'Corn (Maize)',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Silica / Bio-fertilizer foliar spray',
      organicDosage: 'Potassium silicate @ 2.0 ml/L of water',
      sprayInterval: 'Routine bi-weekly scout',
      immediateAction: 'Continue scheduled fertilization and irrigation.'
    },
    recommendations: [
      'Continue regular crop scouting through tasseling, silking, and grain fill.',
      'Apply split nitrogen (urea) applications at V4, V8, and pre-tasseling for optimal ear weight.',
      'Ensure adequate moisture during critical pollination stage.'
    ],
    preventiveMeasures: [
      'Practice crop rotation to maintain soil health and suppress soil pathogens.',
      'Maintain weed-free field borders to minimize pest vector reservoirs.'
    ],
  },

  // ======================== GRAPE ========================
  'Grape___Black_rot': {
    plantName: 'Grape',
    diseaseName: 'Black Rot',
    scientificName: 'Guignardia bidwellii',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Mancozeb 75% WP or Myclobutanil 10% WP',
      dosage: 'Myclobutanil @ 0.5 g/L OR Mancozeb @ 2.5 g/L of water',
      organicOption: 'Copper Oxychloride 50% WP + Wettable Sulfur',
      organicDosage: 'Copper @ 2.5 g/L + Sulfur @ 2.0 g/L of water',
      sprayInterval: 'Spray from 2-inch shoot growth until 4 weeks after bloom at 10-day intervals',
      immediateAction: 'Prune out and destroy all shriveled, black mummified berries and infected canes.'
    },
    recommendations: [
      'Chemical: Spray Myclobutanil 10% WP (0.5 g/L), Azoxystrobin (1.0 ml/L), or Mancozeb (2.5 g/L) from bud break through veraison.',
      'Sanitation: Collect and destroy all mummified grape clusters hanging on wires or lying on the ground.',
      'Canopy Training: Thin grape leaves around clusters (leaf pulling) to allow sunlight and fungicide spray to reach berries.',
      'Pruning: Prune out cane lesions during dormant season.'
    ],
    preventiveMeasures: [
      'Plant black rot resistant varieties like Norton, Chancellor, or Cayuga White.',
      'Train vines on high trellis systems to keep fruit clusters high above damp soil.',
      'Avoid overhead sprinkler irrigation.'
    ],
  },
  'Grape___Esca_(Black_Measles)': {
    plantName: 'Grape',
    diseaseName: 'Esca (Black Measles / Trunk Disease)',
    scientificName: 'Phaeomoniella chlamydospora & Fomitiporia mediterranea',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Thiophanate-methyl wound sealant paste',
      dosage: 'Apply neat paste directly on pruning cuts',
      organicOption: 'Trichoderma atroviride pruning wound protectant',
      organicDosage: 'Trichoderma paste @ 10 g/L brushed on fresh cuts within 24h',
      sprayInterval: 'Apply immediately following winter pruning cuts',
      immediateAction: 'Mark symptomatic vines; prune healthy vines first, then infected vines; burn diseased trunks.'
    },
    recommendations: [
      'Wound Protection: Paint all pruning wounds larger than 1.5 cm diameter with Trichoderma paste or Thiophanate-methyl within 24 hours of cutting.',
      'Sanitary Pruning: Prune only during dry, sunny weather; never prune during or immediately after rain.',
      'Trunk Renewal: If trunk shows cross-sectional dark wedge necrosis, retrain a healthy green sucker from the graft union.',
      'Vine Removal: Uproot and burn vines with chronic apoplexy (sudden vine collapse).'
    ],
    preventiveMeasures: [
      'Use certified disease-free rootstocks and scion wood.',
      'Employ the double-pruning technique (pre-prune early, final prune late in winter).',
      'Disinfect all pruning shears in 70% alcohol between vines.'
    ],
  },
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    plantName: 'Grape',
    diseaseName: 'Leaf Blight (Isariopsis Clavispora)',
    scientificName: 'Pseudocercospora clavispora',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Copper Hydroxide 77% WP or Mancozeb 75% WP',
      dosage: 'Copper Hydroxide @ 2.0 g/L OR Mancozeb @ 2.5 g/L of water',
      organicOption: 'Bordeaux Mixture 1%',
      organicDosage: '1% Bordeaux Mixture (10 g Copper Sulfate + 10 g Lime / 1 L water)',
      sprayInterval: 'Apply at early symptom emergence; repeat at 12–14 day intervals',
      immediateAction: 'Strip heavily blighted lower canopy leaves to stop spore dissemination.'
    },
    recommendations: [
      'Chemical: Spray Mancozeb 75% WP (2.5 g/L) or Copper Hydroxide (2.0 g/L) on both leaf surfaces.',
      'Organic: Apply 1% Bordeaux mixture before monsoon rains.',
      'Airflow: Shoot-position and tuck vines into wires to promote continuous canopy ventilation.',
      'Post-Harvest: Spray copper fungicide after fruit harvest to protect leaves until natural winter leaf drop.'
    ],
    preventiveMeasures: [
      'Ensure proper drainage ditches in vineyards located in heavy clay soils.',
      'Avoid excessive nitrogen fertilizers that create overgrown, dense leaf clusters.'
    ],
  },
  'Grape___healthy': {
    plantName: 'Grape',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Seaweed extract + Micronutrient spray',
      organicDosage: 'Seaweed extract @ 2.0 ml/L of water',
      sprayInterval: 'Monthly preventive inspection',
      immediateAction: 'Maintain current vine canopy training and irrigation.'
    },
    recommendations: [
      'Continue canopy shoot positioning, suckering, and lateral shoot thinning.',
      'Monitor grape clusters weekly for powdery mildew, downy mildew, and bunch rots.',
      'Apply balanced potassium (K) fertilization during berry enlargement.'
    ],
    preventiveMeasures: [
      'Apply preventive organic sulfur sprays during high humidity pre-bloom.',
      'Maintain clean vineyard floor with cover crops or mulch.'
    ],
  },

  // ======================== ORANGE / CITRUS ========================
  'Orange___Haunglongbing_(Citrus_greening)': {
    plantName: 'Orange (Citrus)',
    diseaseName: 'Citrus Greening (Huanglongbing / HLB)',
    scientificName: 'Candidatus Liberibacter asiaticus',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Imidacloprid 17.8% SL or Thiamethoxam 25% WG (Vector Control)',
      dosage: 'Imidacloprid @ 0.5 ml/L OR Thiamethoxam @ 0.3 g/L of water',
      organicOption: 'Neem Oil 10,000 PPM + Beauveria bassiana',
      organicDosage: 'Neem oil @ 4.0 ml/L + Beauveria @ 3.0 g/L of water',
      sprayInterval: 'Spray new flush leaves to eliminate Asian Citrus Psyllid vector every 14 days',
      immediateAction: 'Scout for asymmetrical blotchy yellow leaf mottle and lop-sided, bitter fruits; eradicate severely declining trees.'
    },
    recommendations: [
      'Vector Suppression: Target the Asian Citrus Psyllid (ACP) vector by spraying Imidacloprid 17.8% SL (0.5 ml/L) or Dimethoate (1.5 ml/L) during flush flushes.',
      'Nutritional Therapy: Apply intensive foliar micronutrient cocktail (Zinc, Manganese, Boron, Magnesium, and Potassium Nitrate) to maintain tree productivity.',
      'Tree Removal: In low-incidence orchards, rogue out and burn HLB-positive trees to protect neighboring healthy trees.',
      'Clean Nursery Stock: Plant only certified disease-free budded saplings grown under insect-proof screenhouses.'
    ],
    preventiveMeasures: [
      'Hang yellow sticky traps in the orchard canopy to monitor psyllid populations.',
      'Quarantine orchard against moving uncertified citrus budwood or nursery plants.',
      'Control host ornamental plants like Orange Jasmine (Murraya paniculata) nearby.'
    ],
  },

  // ======================== PEACH ========================
  'Peach___Bacterial_spot': {
    plantName: 'Peach',
    diseaseName: 'Bacterial Spot (Shot Hole)',
    scientificName: 'Xanthomonas arboricola pv. pruni',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Copper Hydroxide 53.8% WG + Oxytetracycline 20%',
      dosage: 'Copper @ 1.5 g/L OR Oxytetracycline @ 0.5 g/L of water',
      organicOption: 'Copper Sulfate + Hydrated Lime (Bordeaux 0.5%)',
      organicDosage: '0.5% Bordeaux mixture',
      sprayInterval: 'Apply at leaf fall, dormant, and every 7–10 days from shuck split to harvest',
      immediateAction: 'Apply low-rate copper spray immediately after severe hail, high winds, or driving rain.'
    },
    recommendations: [
      'Chemical: Apply Copper Hydroxide (1.5 g/L) at bud break and Oxytetracycline (0.5 g/L) during post-bloom to avoid copper fruit russeting.',
      'Bactericide: Spray Streptocycline (0.5 g / 10 L water) during warm, humid spring conditions.',
      'Pruning: Prune during dry winter weather; remove twigs showing dark sunken overwintering cankers.',
      'Windbreaks: Plant tree windbreaks on the windy perimeter to prevent wind-blown soil abrasion.'
    ],
    preventiveMeasures: [
      'Plant bacterial-spot resistant peach varieties like Belle of Georgia, Clayton, or Candor.',
      'Avoid high-rate spring copper sprays that cause foliar phytotoxicity and defoliation.',
      'Maintain balanced tree nutrition; avoid excess nitrogen.'
    ],
  },
  'Peach___healthy': {
    plantName: 'Peach',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Dormant copper spray',
      organicDosage: 'Copper hydroxide @ 2.5 g/L during dormant winter',
      sprayInterval: 'Monthly scout',
      immediateAction: 'Maintain balanced pruning and irrigation.'
    },
    recommendations: [
      'Maintain open-center (vase) canopy pruning to maximize sunlight and rapid leaf drying.',
      'Apply dormant copper spray in autumn after 50% leaf drop to prevent peach leaf curl.',
      'Thin fruit clusters to 1 fruit every 15–20 cm for high quality size and vigor.'
    ],
    preventiveMeasures: [
      'Inspect weekly for brown rot, peach leaf curl, and oriental fruit moth.',
      'Apply mulch around the base of the trunk.'
    ],
  },

  // ======================== PEPPER (BELL) ========================
  'Pepper,_bell___Bacterial_spot': {
    plantName: 'Pepper (Bell)',
    diseaseName: 'Bacterial Spot',
    scientificName: 'Xanthomonas campestris pv. vesicatoria',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Copper Oxychloride 50% WP + Streptocycline (90:10)',
      dosage: 'Copper @ 2.5 g/L + Streptocycline @ 0.5 g / 10 L of water',
      organicOption: 'Pseudomonas fluorescens + Bacillus subtilis',
      organicDosage: 'Pseudomonas @ 5.0 g/L of water',
      sprayInterval: 'Spray every 7 days during warm, rainy weather; repeat immediately after heavy rain',
      immediateAction: 'Never work in or harvest wet pepper fields to prevent mechanical transmission.'
    },
    recommendations: [
      'Chemical: Tank mix Copper Oxychloride 50% WP (2.5 g/L) with Streptocycline (0.5 g in 10 L water) and spray thoroughly on leaf undersides.',
      'Biological: Apply Bacillus subtilis (3.0 g/L) or Pseudomonas fluorescens (5.0 g/L) as a foliar bio-protectant.',
      'Seed Treatment: Soak seeds in 50°C hot water for 25 minutes or 1.3% sodium hypochlorite for 1 minute before sowing.',
      'Irrigation: Shift strictly to drip irrigation; eliminate overhead sprinkler watering.'
    ],
    preventiveMeasures: [
      'Plant resistant bell pepper hybrids with Xanthomonas resistance (Bs1, Bs2, Bs3 genes).',
      'Rotate crops for at least 2–3 years with non-solanaceous crops (maize, beans, brassicas).',
      'Disinfect field stakes, trays, and tools with 10% bleach solution.'
    ],
  },
  'Pepper,_bell___healthy': {
    plantName: 'Pepper (Bell)',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Neem oil preventive spray',
      organicDosage: 'Neem oil @ 3.0 ml/L of water',
      sprayInterval: 'Bi-weekly scout',
      immediateAction: 'Continue balanced fertigation and staking.'
    },
    recommendations: [
      'Maintain balanced calcium (Ca) fertigation to prevent blossom end rot on fruit.',
      'Stake pepper plants with twine to keep fruits and leaves off the moist ground.',
      'Scout leaf undersides weekly for aphids, thrips, and mites.'
    ],
    preventiveMeasures: [
      'Use silver reflective plastic mulch to deter thrips and aphids.',
      'Maintain weed-free crop margins.'
    ],
  },

  // ======================== POTATO ========================
  'Potato___Early_blight': {
    plantName: 'Potato',
    diseaseName: 'Early Blight (Target Spot)',
    scientificName: 'Alternaria solani',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Mancozeb 75% WP or Chlorothalonil 75% WP or Azoxystrobin 23% SC',
      dosage: 'Mancozeb @ 2.5 g/L OR Azoxystrobin @ 1.0 ml/L of water',
      organicOption: 'Copper Hydroxide + Trichoderma viride',
      organicDosage: 'Copper @ 2.0 g/L OR Trichoderma @ 5.0 g/L of water',
      sprayInterval: 'Apply at first sign of target-like concentric ring spots; repeat at 7–10 day intervals',
      immediateAction: 'Prune and destroy yellowing lower leaves exhibiting concentric brown rings.'
    },
    recommendations: [
      'Chemical: Apply Mancozeb 75% WP (2.5 g/L) as a protectant, or Azoxystrobin 23% SC (1.0 ml/L) / Difenoconazole (0.5 ml/L) for curative control.',
      'Nutrition: Ensure adequate nitrogen and potassium; plants stressed by nutrient deficiency are highly susceptible.',
      'Water Management: Water potatoes early in the morning so the canopy dries within 2 hours.',
      'Harvest Care: Allow tuber skins to mature 2 weeks after vine killing before harvest to prevent tuber rot.'
    ],
    preventiveMeasures: [
      'Use certified disease-free seed tubers.',
      'Practice 3-year crop rotation with non-solanaceous crops (cereals, legumes, corn).',
      'Hill potatoes properly to prevent fungal spores from washing into developing tubers.'
    ],
  },
  'Potato___Late_blight': {
    plantName: 'Potato',
    diseaseName: 'Late Blight (Irish Blight)',
    scientificName: 'Phytophthora infestans',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold) OR Cymoxanil + Mancozeb',
      dosage: 'Metalaxyl-Mancozeb @ 2.5 g/L OR Dimethomorph @ 1.0 g/L of water',
      organicOption: 'Copper Oxychloride 50% WP + Potassium Phosphite',
      organicDosage: 'Copper @ 3.0 g/L + Potassium Phosphite @ 2.0 ml/L of water',
      sprayInterval: 'Critical: Spray immediately upon detection; repeat every 5–7 days during cool, foggy, humid weather',
      immediateAction: 'Destroy infected plant patches immediately with contact desiccant or rogueing to prevent epidemic spread.'
    },
    recommendations: [
      'Chemical: Spray Metalaxyl-M + Mancozeb (2.5 g/L) or Dimethomorph 50% WP (1.0 g/L) + Mancozeb (2.0 g/L) across the entire field within 24 hours.',
      'Critical Timing: Apply systemic fungicides immediately when RH > 85% and temperatures are between 15°C–22°C.',
      'Tuber Protection: Apply Fluopicolide + Propamocarb (1.5 ml/L) to prevent spore wash-down onto tubers.',
      'Vine Desiccation: Kill potato haulms/vines 2 weeks prior to harvest using glufosinate or mechanical flailing.'
    ],
    preventiveMeasures: [
      'Plant certified blight-resistant varieties (e.g. Kufri Girdhari, Kufri Himalini, Defender, Sarpo Mira).',
      'Destroy all cull piles and volunteer potato plants which serve as primary disease reservoirs.',
      'Monitor regional Late Blight Decision Support System (DSS) alerts.'
    ],
  },
  'Potato___healthy': {
    plantName: 'Potato',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Preventive Copper spray before monsoon',
      organicDosage: 'Copper oxychloride @ 2.0 g/L of water',
      sprayInterval: 'Weekly scout during cool/wet weather',
      immediateAction: 'Maintain proper hill height and soil moisture.'
    },
    recommendations: [
      'Maintain regular scouting for early signs of Late Blight water-soaked leaf margins.',
      'Hill soil high around potato stalks to protect growing tubers from sunlight and blight spores.',
      'Ensure balanced irrigation; avoid moisture fluctuations that cause tuber cracking.'
    ],
    preventiveMeasures: [
      'Apply preventive protective Mancozeb spray when cloudy, damp weather is forecasted.',
      'Maintain 3-year crop rotation.'
    ],
    xai: {
      lesionTitle: '0 Lesions Detected (100% Clean Foliage Cuticle)',
      lesionDesc: 'Multi-scale segmentation confirmed intact, undamaged epidermis across 100% of leaf blade surface.',
      patternTitle: 'Uniform Emerald Green Cellular Matrix',
      patternDesc: 'Zero necrotic spots or fungal mycelial clusters; vein and mesophyll cellular structure is completely normal.',
      anomalyTitle: 'Optimal Chloroplast Density & Turgor',
      anomalyDesc: 'Deep emerald cellular pigmentation indicates peak chlorophyll absorption with no senescence or chlorosis.',
      ndviDropPct: 0,
      ndviDropDesc: 'High near-infrared reflectance confirms dense healthy mesophyll cell structure (NDVI: 0.88, +6% above regional standard).',
      thermalDeltaC: -1.4,
      thermalDesc: 'Active transpirational cooling (-1.4°C cooler than ambient air). Stomatal gas exchange is fully operational.',
    },
  },

  // ======================== RASPBERRY ========================
  'Raspberry___healthy': {
    plantName: 'Raspberry',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Organic compost mulch + Neem spray',
      organicDosage: 'Neem oil @ 3.0 ml/L of water',
      sprayInterval: 'Monthly check',
      immediateAction: 'Trellis canes and maintain weed-free rows.'
    },
    recommendations: [
      'Prune out spent floricanes (fruiting canes) immediately after harvest down to ground level.',
      'Trellis primocanes to ensure good canopy aeration and easy picking.',
      'Maintain 5–7 cm organic wood chip mulch around cane base.'
    ],
    preventiveMeasures: [
      'Inspect regularly for cane blight, spur blight, and spider mites.',
      'Ensure rapid drainage; raspberries cannot tolerate standing water.'
    ],
  },

  // ======================== SOYBEAN ========================
  'Soybean___healthy': {
    plantName: 'Soybean',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Rhizobium seed inoculation',
      organicDosage: 'Rhizobium japonicum @ 10 g/kg seed at sowing',
      sprayInterval: 'Bi-weekly scout',
      immediateAction: 'Continue standard agronomic monitoring.'
    },
    recommendations: [
      'Scout weekly between R1 (beginning flower) and R5 (beginning seed) for rust and frogeye leaf spot.',
      'Ensure adequate soil phosphorus (P) and potassium (K) for maximum pod filling.',
      'Maintain weed control during first 4 weeks after crop emergence.'
    ],
    preventiveMeasures: [
      'Rotate with corn, wheat, or grain sorghum to suppress soybean cyst nematode.',
      'Use high-germination certified seed varieties.'
    ],
  },

  // ======================== SQUASH ========================
  'Squash___Powdery_mildew': {
    plantName: 'Squash',
    diseaseName: 'Powdery Mildew',
    scientificName: 'Podosphaera xanthii',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Azoxystrobin 23% SC or Myclobutanil 10% WP',
      dosage: 'Azoxystrobin @ 1.0 ml/L OR Myclobutanil @ 0.5 g/L of water',
      organicOption: 'Potassium Bicarbonate OR Cow Milk Solution (1:9)',
      organicDosage: 'Potassium Bicarbonate @ 3.0 g/L OR 10% milk-water spray',
      sprayInterval: 'Spray at first sign of white talc-like patches on lower leaves; repeat weekly',
      immediateAction: 'Remove severely mildewed older lower leaves near the soil surface.'
    },
    recommendations: [
      'Chemical: Apply Azoxystrobin (1.0 ml/L), Kresoxim-methyl 44.3% SC (0.75 ml/L), or Trifloxystrobin (0.5 g/L) alternately to prevent chemical resistance.',
      'Organic: Spray Potassium Bicarbonate (3 g/L + 1 ml soap) or 10% fresh milk solution under direct morning sunlight.',
      'Leaf Underside Coverage: Use hollow-cone spray nozzles to achieve thorough coverage of lower leaf surfaces.',
      'Canopy Space: Maintain wide row spacing (1.5–2 meters) for sprawling squash vines.'
    ],
    preventiveMeasures: [
      'Plant powdery mildew resistant squash cultivars (e.g. Success PM, Payload, Sunray).',
      'Avoid high-nitrogen fertilizers that create dense, shaded foliar growth.',
      'Water vines strictly via drip tape; keep leaves dry.'
    ],
  },

  // ======================== STRAWBERRY ========================
  'Strawberry___Leaf_scorch': {
    plantName: 'Strawberry',
    diseaseName: 'Leaf Scorch',
    scientificName: 'Diplocarpon earlianum',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Captan 50% WP or Azoxystrobin 23% SC',
      dosage: 'Captan @ 2.5 g/L OR Azoxystrobin @ 1.0 ml/L of water',
      organicOption: 'Copper Hydroxide 53.8% WG',
      organicDosage: 'Copper Hydroxide @ 1.5 g/L of water',
      sprayInterval: 'Apply at new leaf emergence in spring; repeat every 10–14 days',
      immediateAction: 'Pick off and destroy purple-spotted leaves; sanitize strawberry bed.'
    },
    recommendations: [
      'Chemical: Spray Captan 50% WP (2.5 g/L) or Thiophanate-methyl (1.0 g/L) during early spring leaf flush.',
      'Bed Renovation: After final harvest, mow leaves above crowns and remove all old infected foliage.',
      'Straw Mulching: Place a clean bed of dry straw under plants to keep leaves and berries from soil contact.',
      'Drip Irrigation: Irrigate with subsurface drip; avoid overhead watering.'
    ],
    preventiveMeasures: [
      'Plant scorch-tolerant strawberry varieties (e.g. Chandler, Sweet Charlie, Allstar).',
      'Establish plants on raised beds covered with black or silver plastic mulch.',
      'Maintain plant spacing (30 cm) to allow rapid morning dew evaporation.'
    ],
  },
  'Strawberry___healthy': {
    plantName: 'Strawberry',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Organic straw mulch + bio-fertilizer',
      organicDosage: 'Neem cake @ 100 g/m² of bed',
      sprayInterval: 'Weekly scout during fruiting',
      immediateAction: 'Continue balanced irrigation and runner removal.'
    },
    recommendations: [
      'Maintain clean straw mulch under ripening berries to prevent gray mold (Botrytis).',
      'Pinch off excess daughter runners to channel energy into large berry production.',
      'Apply potassium sulfate during fruit development for sweet, firm strawberries.'
    ],
    preventiveMeasures: [
      'Scout weekly for Botrytis gray mold, leaf spot, and two-spotted spider mites.',
      'Replace strawberry plantings every 3–4 years to prevent soil pathogen accumulation.'
    ],
  },

  // ======================== TOMATO ========================
  'Tomato___Bacterial_spot': {
    plantName: 'Tomato',
    diseaseName: 'Bacterial Spot',
    scientificName: 'Xanthomonas perforans',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Copper Oxychloride 50% WP + Streptocycline (90:10)',
      dosage: 'Copper @ 2.5 g/L + Streptocycline @ 0.5 g / 10 L of water',
      organicOption: 'Bacillus subtilis + Pseudomonas fluorescens',
      organicDosage: 'Bacillus subtilis @ 3.0 g/L of water',
      sprayInterval: 'Apply every 5–7 days during warm, humid, rainy weather',
      immediateAction: 'Do not touch, prune, or harvest plants when foliage is wet with rain or dew.'
    },
    recommendations: [
      'Chemical: Tank mix Copper Oxychloride (2.5 g/L) with Streptocycline (0.5 g in 10 L water); spray both upper and lower leaf surfaces.',
      'Seed Treatment: Soak tomato seeds in 50°C hot water for 25 minutes to eliminate internal seedborne bacteria.',
      'Copper Resistance Management: If copper-tolerant strains exist, apply Actigard (acibenzolar-S-methyl) Plant Activator.',
      'Pruning Sanitation: Disinfect pruning shears in 70% alcohol between plants.'
    ],
    preventiveMeasures: [
      'Use certified disease-free seed and transplants.',
      'Rotate tomatoes for at least 2–3 years with corn, beans, or brassicas.',
      'Stake tomato plants and use plastic or straw mulch to stop rain-splash inoculation from soil.'
    ],
  },
  'Tomato___Early_blight': {
    plantName: 'Tomato',
    diseaseName: 'Early Blight (Target Spot)',
    scientificName: 'Alternaria linariae / solani',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Mancozeb 75% WP or Azoxystrobin 23% SC or Chlorothalonil 75% WP',
      dosage: 'Mancozeb @ 2.5 g/L OR Azoxystrobin @ 1.0 ml/L of water',
      organicOption: 'Copper Hydroxide 53.8% WG + Trichoderma harzianum',
      organicDosage: 'Copper @ 2.0 g/L OR Trichoderma @ 5.0 g/L of water',
      sprayInterval: 'Spray at first sign of target-pattern brown spots; repeat every 7–10 days',
      immediateAction: 'Prune off all bottom leaves touching the ground (bottom 30 cm) to eliminate splash zone.'
    },
    recommendations: [
      'Chemical: Apply Mancozeb 75% WP (2.5 g/L) as protectant, or Azoxystrobin 23% SC (1.0 ml/L) / Difenoconazole (0.5 ml/L) as curative.',
      'Bottom Pruning: Prune off all leaves from the bottom 30 cm (12 inches) of the plant to prevent soil-splash reinfection.',
      'Mulching: Cover the soil bed with black plastic or 8 cm clean straw mulch to create an impenetrable barrier over soil spores.',
      'Nutrition: Maintain adequate potassium and nitrogen; nutrient-starved tomatoes succumb rapidly to blight.'
    ],
    preventiveMeasures: [
      'Plant Early Blight resistant tomato varieties like Mountain Supreme, Defiant, or Iron Lady.',
      'Water strictly with drip irrigation or soaker hoses at the base.',
      'Stake or cage plants to maintain upright, well-ventilated canopies.'
    ],
    xai: {
      lesionTitle: '14 Necrotic Lesions Quantified & Segmented',
      lesionDesc: 'Foliar surface segmentation isolated discrete necrotic spots covering 14.8% of blade area.',
      patternTitle: 'Concentric Target-Board Ring Pattern',
      patternDesc: 'Alternaria solani pathognomonic concentric rings radiating from necrotic center with dark fungal spore margins.',
      anomalyTitle: 'Chlorotic Yellow Halo & Cellular Breakdown',
      anomalyDesc: 'Yellow chlorotic halo surrounds necrotic margin, indicating active enzymatic breakdown of host chloroplasts.',
      ndviDropPct: 38.4,
      ndviDropDesc: 'Near-infrared reflectance (850nm) collapsed from baseline 0.84 to 0.52 within lesion perimeter.',
      thermalDeltaC: 3.9,
      thermalDesc: 'FLIR Ironbow thermography reveals localized stomatal closure hotspot (+3.9°C above healthy tissue).',
    },
  },
  'Tomato___Late_blight': {
    plantName: 'Tomato',
    diseaseName: 'Late Blight (Water-Soaked Rot)',
    scientificName: 'Phytophthora infestans',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Metalaxyl-M 4% + Mancozeb 64% (Ridomil Gold) OR Dimethomorph 50% WP',
      dosage: 'Metalaxyl-Mancozeb @ 2.5 g/L OR Dimethomorph @ 1.0 g/L + Mancozeb @ 2.0 g/L',
      organicOption: 'Copper Oxychloride 50% WP + Potassium Phosphite',
      organicDosage: 'Copper @ 3.0 g/L + Phosphite @ 2.0 ml/L of water',
      sprayInterval: 'Urgent: Apply immediately upon detection; repeat every 5–7 days in cool, rainy weather',
      immediateAction: 'Bag and remove heavily infected plants in sealed plastic bags; do not add to compost.'
    },
    recommendations: [
      'Emergency Chemical: Spray Metalaxyl-M + Mancozeb (2.5 g/L) or Cymoxanil 8% + Mancozeb 64% (2.5 g/L) across the entire crop within 12–24 hours.',
      'Fruit Protection: Spray Mandipropamid 23.4% SC (0.8 ml/L) to prevent greasy brown rot lesions on green tomatoes.',
      'Quarantine: Rogue out severely collapsed plants into sealed trash bags to stop billions of airborne sporangia from traveling to neighboring fields.',
      'Weather Monitoring: If relative humidity exceeds 90% and temps are between 15°C–22°C, apply preventive protective sprays.'
    ],
    preventiveMeasures: [
      'Plant Late Blight resistant hybrids (Mountain Magic, Plum Regal, Defiant Ph-R, Legend).',
      'Never plant tomatoes adjacent to potato fields.',
      'Ensure maximum spacing (60 cm in-row, 120 cm between rows) for continuous airflow.'
    ],
  },
  'Tomato___Leaf_Mold': {
    plantName: 'Tomato',
    diseaseName: 'Leaf Mold',
    scientificName: 'Passalora fulva (Cladosporium fulvum)',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Difenoconazole 25% EC or Chlorothalonil 75% WP',
      dosage: 'Difenoconazole @ 0.5 ml/L OR Chlorothalonil @ 2.0 g/L of water',
      organicOption: 'Copper Hydroxide + Potassium Bicarbonate',
      organicDosage: 'Copper @ 2.0 g/L + Bicarbonate @ 2.5 g/L of water',
      sprayInterval: 'Apply at first sign of pale yellow upper-leaf spots and olive-green underside mold; repeat every 7–10 days',
      immediateAction: 'Maximize greenhouse / tunnel ventilation; keep relative humidity below 80%.'
    },
    recommendations: [
      'Chemical: Apply Difenoconazole 25% EC (0.5 ml/L) or Mancozeb 75% WP (2.5 g/L) targeting the undersides of leaves.',
      'Greenhouse Aeration: Open greenhouse side curtains and run exhaust fans to lower ambient relative humidity below 80%.',
      'De-leafing: Prune off older lower leaves showing olive-brown velvety mold to reduce spore load.',
      'Temperature Control: Maintain daytime greenhouse temperatures above 21°C.'
    ],
    preventiveMeasures: [
      'Select greenhouse tomato varieties with Cf resistance genes (Cf-2, Cf-4, Cf-9).',
      'Space plants generously and prune suckers to maintain single-stem training.',
      'Never wet leaves during late afternoon or evening watering.'
    ],
  },
  'Tomato___Septoria_leaf_spot': {
    plantName: 'Tomato',
    diseaseName: 'Septoria Leaf Spot',
    scientificName: 'Septoria lycopersici',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Chlorothalonil 75% WP or Mancozeb 75% WP or Azoxystrobin',
      dosage: 'Chlorothalonil @ 2.0 g/L OR Mancozeb @ 2.5 g/L of water',
      organicOption: 'Copper Oxychloride 50% WP + Neem Oil',
      organicDosage: 'Copper @ 2.5 g/L + Neem oil @ 3.0 ml/L of water',
      sprayInterval: 'Apply at first detection of circular spots with dark brown margins and gray centers; repeat every 7–10 days',
      immediateAction: 'Strip infected lower leaves and apply mulch over bare soil.'
    },
    recommendations: [
      'Chemical: Spray Chlorothalonil 75% WP (2.0 g/L) or Mancozeb (2.5 g/L) starting at the base of the plant.',
      'Sanitation: Carefully prune out infected lower leaves bearing tiny black pycnidia speckles in spot centers.',
      'Soil Mulching: Lay down plastic mulch or thick straw to prevent fungal spores in the soil from splashing onto leaves.',
      'Crop Rotation: Rotate field away from all nightshades (tomatoes, peppers, eggplants, potatoes) for 3 years.'
    ],
    preventiveMeasures: [
      'Water plants at ground level with drip lines; avoid overhead sprinkler wetting.',
      'Eradicate solanaceous weeds (e.g. horse nettle, black nightshade) around field borders.',
      'Disinfect tomato cages and stakes before reusing each season.'
    ],
  },
  'Tomato___Spider_mites Two-spotted_spider_mite': {
    plantName: 'Tomato',
    diseaseName: 'Two-Spotted Spider Mite Damage',
    scientificName: 'Tetranychus urticae',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Abamectin 1.9% EC or Spiromesifen 22.9% SC',
      dosage: 'Abamectin @ 0.5 ml/L OR Spiromesifen @ 1.0 ml/L of water',
      organicOption: 'Neem Oil 10,000 PPM + Insecticidal Soap OR Phytoseiulus persimilis (Predatory Mites)',
      organicDosage: 'Neem oil @ 5.0 ml/L + Soap @ 2.0 ml/L of water',
      sprayInterval: 'Apply 2 sprays spaced 4–5 days apart to break the mite egg-hatching lifecycle',
      immediateAction: 'Spray forceful water jet on leaf undersides to dislodge mites and fine webbing.'
    },
    recommendations: [
      'Acaricide: Spray Abamectin 1.9% EC (0.5 ml/L) or Spiromesifen 22.9% SC (1.0 ml/L) with thorough coverage of leaf undersides.',
      'Biological Control: Release predatory mites (Phytoseiulus persimilis or Neoseiulus californicus) in greenhouses.',
      'Organic: Spray Horticultural Neem Oil 10,000 PPM (5.0 ml/L) mixed with potassium soap on leaf undersides in early morning.',
      'Dust Management: Water dirt farm roads nearby; dry dusty conditions trigger explosive spider mite outbreaks.'
    ],
    preventiveMeasures: [
      'Avoid broad-spectrum synthetic pyrethroid insecticides which wipe out natural mite predators.',
      'Scout yellow-stippled leaves with a 10x hand lens weekly.',
      'Maintain adequate crop hydration; drought-stressed plants are preferred by spider mites.'
    ],
  },
  'Tomato___Target_Spot': {
    plantName: 'Tomato',
    diseaseName: 'Target Spot',
    scientificName: 'Corynespora cassiicola',
    isHealthy: false,
    severity: 'Medium',
    treatment: {
      chemicalName: 'Azoxystrobin + Difenoconazole OR Chlorothalonil 75% WP',
      dosage: 'Azoxystrobin mix @ 1.0 ml/L OR Chlorothalonil @ 2.0 g/L of water',
      organicOption: 'Copper Hydroxide 53.8% WG',
      organicDosage: 'Copper Hydroxide @ 2.0 g/L of water',
      sprayInterval: 'Apply at early symptom emergence; repeat at 10-day intervals',
      immediateAction: 'Prune shaded lower canopy leaves and improve row ventilation.'
    },
    recommendations: [
      'Chemical: Apply Azoxystrobin + Difenoconazole (1.0 ml/L) or Fluxapyroxad + Pyraclostrobin (0.8 ml/L).',
      'Organic: Spray Copper Hydroxide (2.0 g/L) before extended humid spells.',
      'De-suckering: Prune suckers to maintain single or double leader stems for maximum air penetration.',
      'Residue Sanitation: Plow under tomato residue promptly following final harvest.'
    ],
    preventiveMeasures: [
      'Maintain wide plant spacing (50–60 cm).',
      'Avoid overhead irrigation; use soil drip lines.',
      'Rotate with non-host crops (corn, sorghum) for 2 seasons.'
    ],
  },
  'Tomato___Tomato_mosaic_virus': {
    plantName: 'Tomato',
    diseaseName: 'Tomato Mosaic Virus (ToMV)',
    scientificName: 'Tomato Mosaic Tobamovirus',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'No chemical cure exists for viral infections (Quarantine & Sanitation Protocol)',
      dosage: 'N/A - Systemic virus',
      organicOption: 'Skim Milk 20% spray (inactivates mechanical transmission on hands/tools)',
      organicDosage: '20% powdered skim milk in water as tool dip',
      sprayInterval: 'Dip hands and shears in milk solution every 5 plants during pruning',
      immediateAction: 'Immediately uproot and incinerate infected mosaic-mottled plants; do not touch healthy plants after touching infected ones.'
    },
    recommendations: [
      'Immediate Eradication: Rogue out infected plants showing yellow-green mosaic leaf mottling and shoestring distortion; burn or discard in landfill.',
      'Tobacco Quarantine: Smokers must wash hands thoroughly with soap and water before handling plants (tobacco harbors related TMV/ToMV).',
      'Milk Decontamination: Dip pruning shears and hands in 20% skim milk solution between plants during trellising and pruning.',
      'Seed Disinfection: Treat seed with 10% trisodium phosphate (TSP) solution for 30 minutes before planting.'
    ],
    preventiveMeasures: [
      'Plant ToMV-resistant tomato varieties (look for "Tm-2²" or "T" on seed packets).',
      'Sterilize all stakes, ties, and greenhouse surfaces with 10% bleach.',
      'Never compost virus-infected tomato plants.'
    ],
  },
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    plantName: 'Tomato',
    diseaseName: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    scientificName: 'Begomovirus / Geminiviridae',
    isHealthy: false,
    severity: 'High',
    treatment: {
      chemicalName: 'Imidacloprid 17.8% SL or Thiamethoxam 25% WG (Whitefly Vector Control)',
      dosage: 'Imidacloprid @ 0.5 ml/L OR Thiamethoxam @ 0.3 g/L of water',
      organicOption: 'Neem Oil 10,000 PPM + Yellow Sticky Traps',
      organicDosage: 'Neem oil @ 5.0 ml/L + 20 Yellow Sticky Traps per acre',
      sprayInterval: 'Spray nursery seedlings and young transplants every 7–10 days to block whitefly feeding',
      immediateAction: 'Install 50-mesh insect netting over nursery beds and greenhouse vents.'
    },
    recommendations: [
      'Vector Control: Spray Imidacloprid 17.8% SL (0.5 ml/L), Spiromesifen (1.0 ml/L), or Cyantraniliprole (1.5 ml/L) targeting silverleaf whiteflies (Bemisia tabaci).',
      'Yellow Sticky Traps: Install yellow sticky traps (1 trap per 20 m²) across the field to monitor and trap adult whiteflies.',
      'Reflective Mulch: Use silver/aluminum reflective plastic mulch to disorient whiteflies and repel them from landing on young plants.',
      'Rogueing: Pull up and bag infected stunted plants with upward-curled yellow leaf margins immediately.'
    ],
    preventiveMeasures: [
      'Plant TYLCV-resistant tomato hybrids with Ty-1, Ty-2, or Ty-3 resistance genes.',
      'Protect nursery seedlings under 50-mesh insect netting from day 1 until transplanting.',
      'Observe a 2-month tomato-free crop break in the region between seasons to break the virus cycle.'
    ],
  },
  'Tomato___healthy': {
    plantName: 'Tomato',
    diseaseName: 'Healthy Foliage',
    isHealthy: true,
    severity: 'Low',
    treatment: {
      chemicalName: 'None required',
      dosage: 'N/A',
      organicOption: 'Neem oil preventive + Trichoderma soil application',
      organicDosage: 'Neem oil @ 3.0 ml/L of water bi-weekly',
      sprayInterval: 'Weekly scout',
      immediateAction: 'Continue balanced fertigation and staking.'
    },
    recommendations: [
      'Maintain regular staking, suckering, and bottom-leaf pruning for optimal airflow.',
      'Apply calcium nitrate and potassium sulfate through drip fertigation to support heavy fruit load.',
      'Keep soil consistently moist with drip irrigation to avoid blossom end rot and fruit splitting.'
    ],
    preventiveMeasures: [
      'Apply preventive bio-fungicides (Trichoderma / Pseudomonas) at root zone.',
      'Scout lower leaves weekly for early signs of blight or whiteflies.'
    ],
  },
};

/**
 * Normalizes any backend prediction class name to the standard knowledge base key.
 */
export function getCropDiseaseInfo(rawKey: string): CropDiseaseInfo | null {
  if (!rawKey) return null;

  // Direct match
  if (CROP_DISEASE_DATA[rawKey]) {
    return CROP_DISEASE_DATA[rawKey];
  }

  // Normalize single/double underscores to standard triple underscores
  const normalized = rawKey
    .replace(/_{2,}/g, '___')
    .replace(/\s+/g, '_');

  if (CROP_DISEASE_DATA[normalized]) {
    return CROP_DISEASE_DATA[normalized];
  }

  // Substring search fallback
  const cleanSearch = rawKey.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [key, value] of Object.entries(CROP_DISEASE_DATA)) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanKey === cleanSearch || cleanKey.includes(cleanSearch) || cleanSearch.includes(cleanKey)) {
      return value;
    }
  }

  return null;
}
