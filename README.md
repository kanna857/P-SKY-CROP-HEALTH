# Sky Crop Health 🛰️🌾

Sky Crop Health is a precision agriculture platform that leverages satellite imagery and AI to monitor crop health, analyze soil moisture, and provide actionable recommendations for modern farming.

## 🚀 Features

- **Satellite Crop Monitoring**: High-accuracy NDVI (Normalized Difference Vegetation Index) analysis using Sentinel-2 imagery.
- **AI-Powered Diagnostics**: Upload photos of crop diseases for instant identification and treatment suggestions.
- **Smart Recommendations**: Tailored farming advice based on satellite data and local weather conditions.
- **Field Tracking**: Draw and save your farm boundaries for continuous monitoring.
- **Weather Insights**: Real-time agricultural weather widgets and historical data.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, shadcn/ui.
- **Mapping**: Leaflet with Geoman for precision field drawing.
- **Backend**: Supabase (Database, Auth, and Edge Functions).
- **Satellite Data**: Agromonitoring API & Microsoft Planetary Computer (Sentinel-2).
- **AI Engine**: Google Gemini Pro & Vision.

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase CLI (if managing functions)
- API Keys for Mapbox, Agromonitoring, and Google AI (Gemini).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sky-crop-health.git
   cd sky-crop-health
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_MAPBOX_TOKEN=your_mapbox_token
   VITE_GOOGLE_MAPS_KEY=your_google_maps_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security & Privacy

This project is built with privacy in mind. Ensure that sensitive keys are stored in environment variables and never committed to version control.

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.
