"""
Agricultural Knowledge Base Seeder & Ingestion Engine (P-SKY Crop Health)
Populates Supabase PostgreSQL database with agronomic manuals, extension guides,
and Google-style Full-Text Search indexed records.
"""

import os
import sys
import json

try:
    from supabase import create_client, Client
except ImportError:
    print("[INFO] 'supabase' python library not found. Falling back to HTTP requests or local export.")
    create_client = None

AGRICULTURAL_RECORDS = [
    {
        "crop_name": "Wheat",
        "topic": "Soil & Fertilizer",
        "sub_category": "Nitrogen Scheduling & Crown Root Initiation",
        "scientific_name": "Triticum aestivum",
        "content": "Wheat requires 120-150 kg N/ha in split applications. Apply 50% basal dose with full P (60 kg P2O5/ha) and K (40 kg K2O/ha). The first top-dressing of 25% Nitrogen MUST coincide with Crown Root Initiation (CRI) stage at 20-25 days after sowing (DAS), followed immediately by irrigation. The remaining 25% Nitrogen is applied at first node/jointing stage (40-45 DAS). Deficiency causes pale yellowing of older leaves progressing upward.",
        "tags": ["nitrogen", "fertilizer", "wheat", "cri", "basal", "phosphorus", "potassium"]
    },
    {
        "crop_name": "Wheat",
        "topic": "Pest Management",
        "sub_category": "Brown Leaf Rust & Stripe Rust Management",
        "scientific_name": "Triticum aestivum",
        "content": "Brown leaf rust (Puccinia triticina) and Stripe/Yellow rust (Puccinia striiformis) produce round orange-brown pustules and yellow linear stripes on leaf blades. Under cool humid conditions (10-18°C), stripe rust spreads rapidly. Management: Foliar spray of Propiconazole 25% EC @ 1.0 ml/L or Tebuconazole 250 EC @ 1.0 ml/L at first appearance of pustules. Resistant cultivars (HD 2967, DBW 187, PBW 550) recommended for rust-prone zones.",
        "tags": ["rust", "leaf rust", "stripe rust", "propiconazole", "fungicide", "wheat", "puccinia"]
    },
    {
        "crop_name": "Wheat",
        "topic": "Irrigation",
        "sub_category": "Critical Stage Irrigation Scheduling",
        "scientific_name": "Triticum aestivum",
        "content": "Wheat demands 4-6 critical irrigations depending on soil moisture holding capacity. Critical growth stages in order of priority: 1. Crown Root Initiation (21 DAS - yield reduction up to 30% if missed); 2. Tillering (40-45 DAS); 3. Late Jointing (60-65 DAS); 4. Flowering (80-85 DAS); 5. Milking (100-105 DAS); 6. Dough stage (115-120 DAS). Avoid irrigation during high winds to prevent lodging.",
        "tags": ["irrigation", "wheat", "water", "cri", "lodging", "drought"]
    },
    {
        "crop_name": "Tomato",
        "topic": "Pathogen Diagnostics",
        "sub_category": "Early Blight (Alternaria solani) Diagnosis & Protocol",
        "scientific_name": "Solanum lycopersicum",
        "content": "Early Blight caused by Alternaria solani manifests as dark brown-to-black concentric ring spots ('target board' pattern) on lower leaves, surrounded by a chlorotic yellow halo. Optimum conditions: warm temperatures (24-29°C) with prolonged leaf wetness. Treatment: Spray Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L as preventive. For curative intervention, apply Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L at 10-day intervals.",
        "tags": ["tomato", "early blight", "alternaria", "blight", "fungicide", "concentric rings", "mancozeb"]
    },
    {
        "crop_name": "Tomato",
        "topic": "Pathogen Diagnostics",
        "sub_category": "Late Blight (Phytophthora infestans) Emergency Containment",
        "scientific_name": "Solanum lycopersicum",
        "content": "Late Blight is an aggressive oomycete causing water-soaked pale green lesions that turn dark purplish-brown with delicate white fungal down on the leaf underside under high humidity (>90%) and cool temperatures (15-20°C). Destroys canopies within 72 hours. Protocol: Immediate spray of Dimethomorph 50% WP @ 1.0 g/L + Mancozeb, or Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L. Remove and bury infected debris; do not compost.",
        "tags": ["tomato", "late blight", "phytophthora", "blight", "oomycete", "metalaxyl", "emergency"]
    },
    {
        "crop_name": "Tomato",
        "topic": "Soil & Fertilizer",
        "sub_category": "Blossom End Rot & Calcium Fertigation",
        "scientific_name": "Solanum lycopersicum",
        "content": "Blossom End Rot (BER) is a physiological disorder characterized by water-soaked depressions at the distal end of fruit turning black and leathery. Caused by localized Calcium (Ca) deficiency in fruit tissue during rapid cell expansion, typically exacerbated by irregular irrigation and excessive Ammonium (NH4) nitrogen. Treatment: Maintain steady soil moisture; apply foliar sprays of Calcium Nitrate @ 5.0 g/L or chelated Ca-EDTA @ 1.5 g/L during fruit set.",
        "tags": ["tomato", "calcium", "blossom end rot", "fertilizer", "fertigation", "physiological"]
    },
    {
        "crop_name": "Maize",
        "topic": "Pest Management",
        "sub_category": "Fall Armyworm (Spodoptera frugiperda) IPM Strategy",
        "scientific_name": "Zea mays",
        "content": "Fall Armyworm (FAW) causes windowing in young leaves and ragged whorl feeding with characteristic saw-dust frass. Inverted 'Y' marking on head capsule and four square pinacula on eighth abdominal segment. Threshold: 5% whorl damage in seedling stage, 10% in mid-whorl. Control: In early whorl, apply Bacillus thuringiensis (Bt) kurstaki @ 2.0 g/L or Metarhizium rileyi @ 3.0 g/L. Chemical intervention: Chlorantraniliprole 18.5% SC @ 0.4 ml/L or Emamectin benzoate 5% SG @ 0.4 g/L directed into the central whorl.",
        "tags": ["maize", "corn", "fall armyworm", "spodoptera", "pest", "chlorantraniliprole", "ipm"]
    },
    {
        "crop_name": "Maize",
        "topic": "Soil & Fertilizer",
        "sub_category": "Zinc Deficiency Diagnosis & Foliar Correction",
        "scientific_name": "Zea mays",
        "content": "Zinc deficiency in maize presents as 'White Bud' — broad chlorotic bands on both sides of the midrib between the base and tip of emerging leaves. Stunted internodes and delayed tasseling. High phosphorus levels in soil can induce zinc lockup. Correction: Soil application of Zinc Sulfate (ZnSO4 21%) @ 25 kg/ha at sowing. Foliar rescue: Spray Zinc chelate (Zn-EDTA 12%) @ 1.0 g/L or Zinc Sulfate heptahydrate @ 5.0 g/L neutralized with 2.5 g/L slaked lime.",
        "tags": ["maize", "corn", "zinc", "micronutrient", "white bud", "fertilizer", "deficiency"]
    },
    {
        "crop_name": "Rice",
        "topic": "Pathogen Diagnostics",
        "sub_category": "Bacterial Leaf Blight (Xanthomonas oryzae pv. oryzae)",
        "scientific_name": "Oryza sativa",
        "content": "Bacterial Leaf Blight (BLB) causes wavy, water-soaked yellowish-translucent stripes along leaf margins from the tip downwards, turning whitish-gray with bacterial oozing beads in early morning dew. Severe 'Kresek' wilt in seedlings. Control: Drain standing water from field. Avoid excessive top-dressed nitrogen. Apply Copper Hydroxide 77% WP @ 2.0 g/L mixed with Streptocycline (Streptomycin sulphate + Tetracycline) @ 0.1 g/L (1.0 g per 10 L water).",
        "tags": ["rice", "paddy", "bacterial blight", "xanthomonas", "kresek", "streptocycline", "copper"]
    },
    {
        "crop_name": "Rice",
        "topic": "Pathogen Diagnostics",
        "sub_category": "Rice Blast (Magnaporthe oryzae) Leaf & Neck Management",
        "scientific_name": "Oryza sativa",
        "content": "Rice blast produces diamond- or spindle-shaped lesions with grayish-white centers and brownish margins on leaf blades (Leaf Blast), and dark brown rotting at the panicle base (Neck Blast) causing empty grains. Protocol: Foliar spray of Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L at boot leaf stage and 50% panicle emergence. Maintain 2-3 cm water layer to reduce pathogen sporulation.",
        "tags": ["rice", "paddy", "blast", "magnaporthe", "tricyclazole", "fungicide", "panicle"]
    },
    {
        "crop_name": "Potato",
        "topic": "Soil & Fertilizer",
        "sub_category": "Potassium Balancing for Tuber Quality & Starch",
        "scientific_name": "Solanum tuberosum",
        "content": "Potato is a heavy potassium feeder, demanding 120-180 kg K2O/ha. Potassium Sulfate (SOP) is strictly preferred over Potassium Chloride (MOP) because excessive chloride reduces tuber dry matter content and specific gravity, degrading chip and fry processing quality. Deficiency exhibits as dark green crinkled foliage with bronze necrosis along leaf margins. Apply 60% K at planting and 40% during tuber initiation (30-35 DAS).",
        "tags": ["potato", "potassium", "sop", "mop", "fertilizer", "tuber", "starch", "nutrition"]
    },
    {
        "crop_name": "Cotton",
        "topic": "Pest Management",
        "sub_category": "Pink Bollworm (Pectinophora gossypiella) Pheromone Trapping & Bio-Control",
        "scientific_name": "Gossypium hirsutum",
        "content": "Pink Bollworm caterpillars enter developing bolls and feed on seeds, preventing lint development and staining fiber. Early detection requires Gossyplure pheromone traps installed @ 5 traps/ha at 45 DAS. Economic Threshold Level (ETL): 8 moths/trap/day for 3 consecutive days or 10% rosette flowers. Management: Handpick and destroy rosette flowers. Release Trichogramma bactrae egg parasitoids @ 150,000/ha. Chemical: Spinosad 45% SC @ 0.3 ml/L or Profenofos 50% EC @ 2.0 ml/L.",
        "tags": ["cotton", "pink bollworm", "pectinophora", "pheromone", "spinosad", "pest", "etl"]
    }
]

def seed_database():
    supabase_url = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key or not create_client:
        print("[INFO] Supabase credentials or library not configured. Exporting knowledge dataset to JSON...")
        output_file = os.path.join(os.path.dirname(__file__), "agricultural_knowledge_seed.json")
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(AGRICULTURAL_RECORDS, f, indent=2)
        print(f"[SUCCESS] Wrote {len(AGRICULTURAL_RECORDS)} agricultural knowledge records to {output_file}")
        return

    client: Client = create_client(supabase_url, supabase_key)
    print(f"Connecting to Supabase at {supabase_url}...")

    # Upsert knowledge records
    for record in AGRICULTURAL_RECORDS:
        try:
            res = client.table("agricultural_knowledge").insert(record).execute()
            print(f"  + Seeded [{record['crop_name']}] - {record['sub_category']}")
        except Exception as e:
            print(f"  ! Error seeding {record['crop_name']}: {e}")

    print("[SUCCESS] Completed database knowledge seeding.")

if __name__ == "__main__":
    seed_database()
