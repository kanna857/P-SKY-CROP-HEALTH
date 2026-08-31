# Sky Crop Health 🛰️🌾

Sky Crop Health is a precision agriculture platform that leverages satellite multi-spectral imagery and deep learning AI to monitor crop health, detect foliar diseases, and provide certified agronomist prescriptions for modern farming.

## 🚀 Key Features

- **Satellite Multi-Index Crop Monitoring**: High-accuracy NDVI, NDRE, EVI, MSAVI, and NDWI vegetation health analysis using Sentinel-2 multi-spectral bands.
- **AI Plant Pathology Diagnostics**: Instant leaf disease identification powered by custom-trained **PyTorch MobileNetV3** (99.86% validation accuracy across 38 crop pathogen classes).
- **Thermal Heatmaps (Explainable AI)**: Visualizes foliar thermal stress and infection severity using **FLIR Ironbow**, **Turbo/JET**, and **Hot Metal** colormaps.
- **Computer Vision Lesion Quantification**: Accurate spot count and infected foliar surface area percentage via **OpenCV Connected-Component Analysis**.
- **Certified Digital Prescriptions**: Generates official downloadable PDF agronomist reports with exact chemical formulations and organic alternatives.
- **Multilingual Voice Assistant**: 9 regional Indian languages voice input/readout (Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, English, Spanish).
- **Universal Agronomist Search Engine**: Fast semantic search across 38 crop diseases, active fungicides, and cultural prevention protocols.
- **Field History Scouting Archive**: Historical timeline of all field scans, NDVI vigor curves, and scouting logs with CSV export.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, shadcn/ui.
- **Mapping**: Leaflet with Geoman for precision field polygon drawing.
- **Deep Learning AI**: PyTorch MobileNetV3 Small (Local GPU/CPU inference).
- **Computer Vision**: OpenCV (Connected Components, Otsu foliar masking).
- **Backend Server**: Python FastAPI + Uvicorn (<50ms latency).
- **Offline Edge AI**: HTML5 Canvas + BFS Flood-Fill in-browser fallback.

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.9+ with PyTorch, torchvision, FastAPI, OpenCV, and uvicorn

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kanna857/P-SKY-CROP-HEALTH.git
   cd P-SKY-CROP-HEALTH
   ```

2. **Install Frontend Dependencies & Start:**
   ```bash
   npm install
   npm run dev
   ```

3. **Start Python AI Backend Server:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn main:app --host 127.0.0.1 --port 8000
   ```

4. Open your browser at `http://localhost:8080` to access the platform.
