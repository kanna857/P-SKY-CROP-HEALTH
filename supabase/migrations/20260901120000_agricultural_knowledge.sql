-- ==============================================================================
-- MIGRATION: 20260901120000_agricultural_knowledge.sql
-- Title: Agricultural Knowledge Base with Google-Style Full-Text Search
-- ==============================================================================

-- 1. Create the primary agricultural knowledge table
CREATE TABLE IF NOT EXISTS agricultural_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,            -- e.g., 'Wheat', 'Tomato', 'Maize'
    topic VARCHAR(100) NOT NULL,                -- e.g., 'Soil & Fertilizer', 'Pest Management', 'Irrigation'
    sub_category VARCHAR(150),                  -- e.g., 'Nitrogen deficiency', 'Drip scheduling'
    scientific_name VARCHAR(150),               -- e.g., 'Solanum lycopersicum'
    content TEXT NOT NULL,                      -- Comprehensive agricultural details, guides, and manuals
    tags TEXT[] DEFAULT '{}',                   -- Quick tags like ['nitrogen', 'fertilizer', 'silt']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add a generated column that compiles all searchable text into a weighted tsvector
-- Drop column first if it already exists to allow re-runs
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='agricultural_knowledge' AND column_name='searchable_tokens'
    ) THEN
        ALTER TABLE agricultural_knowledge 
        ADD COLUMN searchable_tokens tsvector GENERATED ALWAYS AS (
            setweight(to_tsvector('english', coalesce(crop_name, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(scientific_name, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(topic, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(sub_category, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(content, '')), 'C')
        ) STORED;
    END IF;
END $$;

-- 3. Create a GIN index on the searchable tokens for lightning-fast search execution
CREATE INDEX IF NOT EXISTS ag_search_idx ON agricultural_knowledge USING gin(searchable_tokens);

-- 4. Implement the Google-Style Search Parser (PL/pgSQL Function)
-- Translates user queries with quotes ("phrase"), minus signs (-exclude), and OR into Postgres tsquery
CREATE OR REPLACE FUNCTION google_style_ag_search(user_query TEXT)
RETURNS TABLE (
    id UUID,
    crop_name VARCHAR(100),
    topic VARCHAR(100),
    sub_category VARCHAR(150),
    scientific_name VARCHAR(150),
    content TEXT,
    tags TEXT[],
    relevance_rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ak.id,
        ak.crop_name,
        ak.topic,
        ak.sub_category,
        ak.scientific_name,
        ak.content,
        ak.tags,
        ts_rank_cd(ak.searchable_tokens, websearch_to_tsquery('english', user_query)) AS relevance_rank
    FROM 
        agricultural_knowledge ak
    WHERE 
        ak.searchable_tokens @@ websearch_to_tsquery('english', user_query)
    ORDER BY 
        relevance_rank DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Enable Row Level Security and grant public read access
ALTER TABLE agricultural_knowledge ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'agricultural_knowledge' AND policyname = 'Public read access for agricultural knowledge'
    ) THEN
        CREATE POLICY "Public read access for agricultural knowledge"
            ON agricultural_knowledge FOR SELECT
            USING (true);
    END IF;
END $$;

-- 6. Pre-populate with Comprehensive Agricultural Knowledge Data
INSERT INTO agricultural_knowledge (crop_name, topic, sub_category, scientific_name, content, tags)
VALUES
-- Wheat Records
(
    'Wheat',
    'Soil & Fertilizer',
    'Nitrogen Scheduling & Crown Root Initiation',
    'Triticum aestivum',
    'Wheat requires 120-150 kg N/ha in split applications. Apply 50% basal dose with full P (60 kg P2O5/ha) and K (40 kg K2O/ha). The first top-dressing of 25% Nitrogen MUST coincide with Crown Root Initiation (CRI) stage at 20-25 days after sowing (DAS), followed immediately by irrigation. The remaining 25% Nitrogen is applied at first node/jointing stage (40-45 DAS). Deficiency causes pale yellowing of older leaves progressing upward.',
    ARRAY['nitrogen', 'fertilizer', 'wheat', 'cri', 'basal', 'phosphorus', 'potassium']
),
(
    'Wheat',
    'Pest Management',
    'Brown Leaf Rust & Stripe Rust Management',
    'Triticum aestivum',
    'Brown leaf rust (Puccinia triticina) and Stripe/Yellow rust (Puccinia striiformis) produce round orange-brown pustules and yellow linear stripes on leaf blades. Under cool humid conditions (10-18°C), stripe rust spreads rapidly. Management: Foliar spray of Propiconazole 25% EC @ 1.0 ml/L or Tebuconazole 250 EC @ 1.0 ml/L at first appearance of pustules. Resistant cultivars (HD 2967, DBW 187, PBW 550) recommended for rust-prone zones.',
    ARRAY['rust', 'leaf rust', 'stripe rust', 'propiconazole', 'fungicide', 'wheat', 'puccinia']
),
(
    'Wheat',
    'Irrigation',
    'Critical Stage Irrigation Scheduling',
    'Triticum aestivum',
    'Wheat demands 4-6 critical irrigations depending on soil moisture holding capacity. Critical growth stages in order of priority: 1. Crown Root Initiation (21 DAS - yield reduction up to 30% if missed); 2. Tillering (40-45 DAS); 3. Late Jointing (60-65 DAS); 4. Flowering (80-85 DAS); 5. Milking (100-105 DAS); 6. Dough stage (115-120 DAS). Avoid irrigation during high winds to prevent lodging.',
    ARRAY['irrigation', 'wheat', 'water', 'cri', 'lodging', 'drought']
),

-- Tomato Records
(
    'Tomato',
    'Pathogen Diagnostics',
    'Early Blight (Alternaria solani) Diagnosis & Protocol',
    'Solanum lycopersicum',
    'Early Blight caused by Alternaria solani manifests as dark brown-to-black concentric ring spots ("target board" pattern) on lower leaves, surrounded by a chlorotic yellow halo. Optimum conditions: warm temperatures (24-29°C) with prolonged leaf wetness. Treatment: Spray Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L as preventive. For curative intervention, apply Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L at 10-day intervals.',
    ARRAY['tomato', 'early blight', 'alternaria', 'blight', 'fungicide', 'concentric rings', 'mancozeb']
),
(
    'Tomato',
    'Pathogen Diagnostics',
    'Late Blight (Phytophthora infestans) Emergency Containment',
    'Solanum lycopersicum',
    'Late Blight is an aggressive oomycete causing water-soaked pale green lesions that turn dark purplish-brown with delicate white fungal down on the leaf underside under high humidity (>90%) and cool temperatures (15-20°C). Destroys canopies within 72 hours. Protocol: Immediate spray of Dimethomorph 50% WP @ 1.0 g/L + Mancozeb, or Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L. Remove and bury infected debris; do not compost.',
    ARRAY['tomato', 'late blight', 'phytophthora', 'blight', 'oomycete', 'metalaxyl', 'emergency']
),
(
    'Tomato',
    'Soil & Fertilizer',
    'Blossom End Rot & Calcium Fertigation',
    'Solanum lycopersicum',
    'Blossom End Rot (BER) is a physiological disorder characterized by water-soaked depressions at the distal end of fruit turning black and leathery. Caused by localized Calcium (Ca) deficiency in fruit tissue during rapid cell expansion, typically exacerbated by irregular irrigation and excessive Ammonium (NH4) nitrogen. Treatment: Maintain steady soil moisture; apply foliar sprays of Calcium Nitrate @ 5.0 g/L or chelated Ca-EDTA @ 1.5 g/L during fruit set.',
    ARRAY['tomato', 'calcium', 'blossom end rot', 'fertilizer', 'fertigation', 'physiological']
),

-- Maize / Corn Records
(
    'Maize',
    'Pest Management',
    'Fall Armyworm (Spodoptera frugiperda) IPM Strategy',
    'Zea mays',
    'Fall Armyworm (FAW) causes windowing in young leaves and ragged whorl feeding with characteristic saw-dust frass. Inverted "Y" marking on head capsule and four square pinacula on eighth abdominal segment. Threshold: 5% whorl damage in seedling stage, 10% in mid-whorl. Control: In early whorl, apply Bacillus thuringiensis (Bt) kurstaki @ 2.0 g/L or Metarhizium rileyi @ 3.0 g/L. Chemical intervention: Chlorantraniliprole 18.5% SC @ 0.4 ml/L or Emamectin benzoate 5% SG @ 0.4 g/L directed into the central whorl.',
    ARRAY['maize', 'corn', 'fall armyworm', 'spodoptera', 'pest', 'chlorantraniliprole', 'ipm']
),
(
    'Maize',
    'Soil & Fertilizer',
    'Zinc Deficiency Diagnosis & Foliar Correction',
    'Zea mays',
    'Zinc deficiency in maize presents as "White Bud" — broad chlorotic bands on both sides of the midrib between the base and tip of emerging leaves. Stunted internodes and delayed tasseling. High phosphorus levels in soil can induce zinc lockup. Correction: Soil application of Zinc Sulfate (ZnSO4 21%) @ 25 kg/ha at sowing. Foliar rescue: Spray Zinc chelate (Zn-EDTA 12%) @ 1.0 g/L or Zinc Sulfate heptahydrate @ 5.0 g/L neutralized with 2.5 g/L slaked lime.',
    ARRAY['maize', 'corn', 'zinc', 'micronutrient', 'white bud', 'fertilizer', 'deficiency']
),

-- Rice / Paddy Records
(
    'Rice',
    'Pathogen Diagnostics',
    'Bacterial Leaf Blight (Xanthomonas oryzae pv. oryzae)',
    'Oryza sativa',
    'Bacterial Leaf Blight (BLB) causes wavy, water-soaked yellowish-translucent stripes along leaf margins from the tip downwards, turning whitish-gray with bacterial oozing beads in early morning dew. Severe "Kresek" wilt in seedlings. Control: Drain standing water from field. Avoid excessive top-dressed nitrogen. Apply Copper Hydroxide 77% WP @ 2.0 g/L mixed with Streptocycline (Streptomycin sulphate + Tetracycline) @ 0.1 g/L (1.0 g per 10 L water).',
    ARRAY['rice', 'paddy', 'bacterial blight', 'xanthomonas', 'kresek', 'streptocycline', 'copper']
),
(
    'Rice',
    'Pathogen Diagnostics',
    'Rice Blast (Magnaporthe oryzae) Leaf & Neck Management',
    'Oryza sativa',
    'Rice blast produces diamond- or spindle-shaped lesions with grayish-white centers and brownish margins on leaf blades (Leaf Blast), and dark brown rotting at the panicle base (Neck Blast) causing empty grains. Protocol: Foliar spray of Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L at boot leaf stage and 50% panicle emergence. Maintain 2-3 cm water layer to reduce pathogen sporulation.',
    ARRAY['rice', 'paddy', 'blast', 'magnaporthe', 'tricyclazole', 'fungicide', 'panicle']
),

-- Potato Records
(
    'Potato',
    'Soil & Fertilizer',
    'Potassium Balancing for Tuber Quality & Starch',
    'Solanum tuberosum',
    'Potato is a heavy potassium feeder, demanding 120-180 kg K2O/ha. Potassium Sulfate (SOP) is strictly preferred over Potassium Chloride (MOP) because excessive chloride reduces tuber dry matter content and specific gravity, degrading chip and fry processing quality. Deficiency exhibits as dark green crinkled foliage with bronze necrosis along leaf margins. Apply 60% K at planting and 40% during tuber initiation (30-35 DAS).',
    ARRAY['potato', 'potassium', 'sop', 'mop', 'fertilizer', 'tuber', 'starch', 'nutrition']
),
(
    'Potato',
    'Pathogen Diagnostics',
    'Late Blight Preventive Fungicide Rotation',
    'Solanum tuberosum',
    'Phytophthora infestans in potato spreads exponentially in cloudy, drizzly weather (relative humidity >85%, temperatures 12-22°C). High risk period warrants preventive protection before canopy closure. Spray Mancozeb 75% WP @ 2.5 kg/ha prophylactically. Upon disease warning forecast, switch to systemic translaminar options: Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L or Fenamidone 10% + Mancozeb 50% WG @ 2.5 g/L.',
    ARRAY['potato', 'late blight', 'phytophthora', 'cymoxanil', 'mancozeb', 'fungicide']
),

-- Cotton Records
(
    'Cotton',
    'Pest Management',
    'Pink Bollworm (Pectinophora gossypiella) Pheromone Trapping & Bio-Control',
    'Gossypium hirsutum',
    'Pink Bollworm caterpillars enter developing bolls and feed on seeds, preventing lint development and staining fiber. Early detection requires Gossyplure pheromone traps installed @ 5 traps/ha at 45 DAS. Economic Threshold Level (ETL): 8 moths/trap/day for 3 consecutive days or 10% rosette flowers. Management: Handpick and destroy rosette flowers. Release Trichogramma bactrae egg parasitoids @ 150,000/ha. Chemical: Spinosad 45% SC @ 0.3 ml/L or Profenofos 50% EC @ 2.0 ml/L.',
    ARRAY['cotton', 'pink bollworm', 'pectinophora', 'pheromone', 'spinosad', 'pest', 'etl']
),

-- Apple Records
(
    'Apple',
    'Pathogen Diagnostics',
    'Apple Scab (Venturia inaequalis) Mills Period Spray Scheduling',
    'Malus domestica',
    'Apple scab causes olive-green to velvet black lesions on leaves and corky, scabby fissures on fruit. Primary ascospore release occurs from overwintered leaf litter during bud burst (Green Tip stage). Mills Infection Period correlates hours of continuous leaf wetness with temperature to calculate infection severity. Protection: Apply Captan 50% WP @ 2.5 g/L or Dodine 65% WP @ 1.0 g/L at Silver Tip to Green Tip. Post-infection curative: Difenoconazole 25% EC @ 0.3 ml/L within 72 hours of rain.',
    ARRAY['apple', 'scab', 'venturia', 'mills period', 'captan', 'difenoconazole', 'fungicide']
),

-- Grape Records
(
    'Grape',
    'Pathogen Diagnostics',
    'Downy Mildew (Plasmopara viticola) & Powdery Mildew (Erysiphe necator)',
    'Vitis vinifera',
    'Downy mildew causes oily yellow "oil-spots" on upper leaf surface with dense white cottony sporulation on the underside; powdery mildew produces ash-gray powdery coating on leaves and berries causing fruit splitting. Downy Protocol: Bordeaux Mixture (1%) or Potassium Phosphite @ 3.0 g/L preventive; Metalaxyl 8% + Mancozeb 64% @ 2.5 g/L curative. Powdery Protocol: Wettable Sulfur 80% WDG @ 3.0 g/L or Kresoxim-methyl 44.3% SC @ 0.7 ml/L.',
    ARRAY['grape', 'downy mildew', 'powdery mildew', 'bordeaux', 'sulfur', 'viticulture', 'fungicide']
),

-- Chilli Records
(
    'Chilli',
    'Pest Management',
    'Thrips (Scirtothrips dorsalis) & Mite Complex Protocol',
    'Capsicum annuum',
    'Chilli thrips cause upward leaf curling, boat-shaped foliage, and silvery bronzed scarring on fruit. Yellow mites (Polyphagotarsonemus latus) cause downward curling ("inverted boat"), elongated petioles, and brittle leaves. Thrips Control: Fipronil 5% SC @ 2.0 ml/L or Spinetoram 11.7% SC @ 1.0 ml/L. Mite Control: Spiromesifen 22.9% SC @ 1.0 ml/L or Diafenthiuron 50% WP @ 1.2 g/L. Blue sticky traps @ 25/ha enhance early capture.',
    ARRAY['chilli', 'pepper', 'thrips', 'mites', 'curling', 'fipronil', 'spiromesifen', 'pest']
);
