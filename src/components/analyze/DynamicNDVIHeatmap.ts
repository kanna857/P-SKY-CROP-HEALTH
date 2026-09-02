import L from 'leaflet';

export type HealthRiskTier = 'healthy' | 'warning' | 'moderate' | 'severe';

export interface FieldRiskZone {
  id: string;
  name: string;
  tier: HealthRiskTier;
  tierLabel: string; // 'Healthy' | 'Warning' | 'Moderate Risk' | 'Severe Risk'
  color: string;     // '#10b981' | '#eab308' | '#f97316' | '#ef4444'
  strokeColor: string;
  fillOpacity: number;
  ndvi: number;
  ndviDeltaPct: number; // e.g. -34%
  areaAcres: number;
  polygon: Array<[number, number]>; // [[lat, lng], ...]
  center: [number, number];

  // "Why is this area unhealthy?" diagnostic breakdown:
  unhealthyReasonTitle: string;
  unhealthySummary: string;
  soilMoisturePct: number;
  waterStressLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  thermalHotspotDelta: number; // in °C e.g. +4.2°C
  pathogenRiskPct: number;
  chlorophyllDensity: string;

  // Immediate Action Plan for the Farmer
  immediateAction: string;
  recommendedTreatment: string;
  samplePathologyType: string; // matches sample ID e.g. 'tomato-early-blight'
}

export interface NDVIPixelSample {
  ndvi: number;
  label: string;
  tier: HealthRiskTier;
  tierLabel: string;
  color: string;
  chlorophyllEstimate: string;
  biomassStatus: string;
  whyStatus: string;
}

/**
 * Samples NDVI value with strict 4-Tier color mapping:
 * Green  → Healthy (>= 0.70)
 * Yellow → Warning (0.55 - 0.69)
 * Orange → Moderate Risk (0.40 - 0.54)
 * Red    → Severe Risk (< 0.40)
 */
export function sampleNDVIValue(lat: number, lng: number, baseNDVI: number = 0.72): NDVIPixelSample {
  // Deterministic micro-variation across coordinate space
  const seed = (Math.sin(lat * 1200) + Math.cos(lng * 1200)) * 0.12;
  const ndvi = Math.min(0.96, Math.max(0.12, parseFloat((baseNDVI + seed).toFixed(3))));

  if (ndvi >= 0.70) {
    return {
      ndvi,
      label: 'Optimal Chlorophyll Vigor',
      tier: 'healthy',
      tierLabel: 'Healthy',
      color: '#10b981', // Green
      chlorophyllEstimate: `${(42 + (ndvi - 0.70) * 25).toFixed(1)} µg/cm²`,
      biomassStatus: 'Dense Canopy Biomass & Transpiration',
      whyStatus: 'Balanced soil moisture (28%), cool canopy temperature, and zero foliar pathogen symptoms detected.',
    };
  } else if (ndvi >= 0.55) {
    return {
      ndvi,
      label: 'Early Moisture / Nitrogen Stress',
      tier: 'warning',
      tierLabel: 'Warning',
      color: '#eab308', // Yellow
      chlorophyllEstimate: `${(30 + (ndvi - 0.55) * 35).toFixed(1)} µg/cm²`,
      biomassStatus: 'Canopy Thinning / Moderate Vigor',
      whyStatus: 'Sub-optimal transpiration and early moisture drop (21% soil moisture); canopy temperature is +1.6°C elevated.',
    };
  } else if (ndvi >= 0.40) {
    return {
      ndvi,
      label: 'Fungal Risk / Localized Nitrogen Deficit',
      tier: 'moderate',
      tierLabel: 'Moderate Risk',
      color: '#f97316', // Orange
      chlorophyllEstimate: `${(20 + (ndvi - 0.40) * 35).toFixed(1)} µg/cm²`,
      biomassStatus: 'Sparse Foliage / Active Pathogen Zone',
      whyStatus: 'Micro-climate humidity accumulation promotes fungal sporulation. NDVI is down -24% from field baseline.',
    };
  } else {
    return {
      ndvi,
      label: 'Critical Defoliation / Severe Water Deficit',
      tier: 'severe',
      tierLabel: 'Severe Risk',
      color: '#ef4444', // Red
      chlorophyllEstimate: '< 16.0 µg/cm²',
      biomassStatus: 'Severe Foliar Decline / Bare Soil Spots',
      whyStatus: 'Severe root-zone moisture depletion (12% soil moisture) causing stomatal shutdown and +4.2°C surface heat spike.',
    };
  }
}

/**
 * Generates 4 distinct spatial management zones for any field boundary or center coordinate
 * matching the 4 risk tiers: Green (Healthy), Yellow (Warning), Orange (Moderate Risk), Red (Severe Risk).
 */
export function generateFieldRiskZones(
  centerLat: number,
  centerLng: number,
  areaHa: number = 10,
  baseNdvi: number = 0.74,
  cropName: string = 'Crop'
): FieldRiskZone[] {
  const sideMeters = Math.sqrt((areaHa || 10) * 10000);
  const latDelta = (sideMeters / 2) / 111320;
  const lngDelta = (sideMeters / 2) / (111320 * Math.cos((centerLat * Math.PI) / 180));

  // Compute 4 quadrants:
  // Zone A (North): Healthy (Green)
  // Zone B (East): Warning (Yellow)
  // Zone C (West): Moderate Risk (Orange)
  // Zone D (South): Severe Risk (Red)

  const zoneA_coords: Array<[number, number]> = [
    [centerLat, centerLng - lngDelta],
    [centerLat + latDelta, centerLng - lngDelta],
    [centerLat + latDelta, centerLng + lngDelta],
    [centerLat, centerLng + lngDelta],
  ];

  const zoneB_coords: Array<[number, number]> = [
    [centerLat - latDelta * 0.4, centerLng],
    [centerLat, centerLng],
    [centerLat, centerLng + lngDelta],
    [centerLat - latDelta * 0.4, centerLng + lngDelta],
  ];

  const zoneC_coords: Array<[number, number]> = [
    [centerLat - latDelta * 0.4, centerLng - lngDelta],
    [centerLat, centerLng - lngDelta],
    [centerLat, centerLng],
    [centerLat - latDelta * 0.4, centerLng],
  ];

  const zoneD_coords: Array<[number, number]> = [
    [centerLat - latDelta, centerLng - lngDelta],
    [centerLat - latDelta * 0.4, centerLng - lngDelta],
    [centerLat - latDelta * 0.4, centerLng + lngDelta],
    [centerLat - latDelta, centerLng + lngDelta],
  ];

  const subAreaAcres = parseFloat(((areaHa * 2.47105) / 4).toFixed(1));

  return [
    {
      id: 'zone-green',
      name: 'North Sector (Zone 1)',
      tier: 'healthy',
      tierLabel: 'Healthy',
      color: '#10b981',
      strokeColor: '#059669',
      fillOpacity: 0.45,
      ndvi: Math.min(0.92, Math.max(0.76, parseFloat((baseNdvi + 0.08).toFixed(2)))),
      ndviDeltaPct: +9.4,
      areaAcres: subAreaAcres,
      polygon: zoneA_coords,
      center: [centerLat + latDelta * 0.5, centerLng],
      unhealthyReasonTitle: 'Optimal Foliar Vigor & Uniform Hydration',
      unhealthySummary: 'This zone receives balanced sub-surface irrigation and full canopy ventilation. Cellular chlorophyll is at peak absorption.',
      soilMoisturePct: 29.4,
      waterStressLevel: 'Low',
      thermalHotspotDelta: -1.2,
      pathogenRiskPct: 8,
      chlorophyllDensity: '44.8 µg/cm²',
      immediateAction: 'Maintain current fertigation schedule. No corrective treatment required.',
      recommendedTreatment: 'Preventive microbial bio-inoculant at standard maintenance rate.',
      samplePathologyType: 'potato-healthy',
    },
    {
      id: 'zone-yellow',
      name: 'East Ridge (Zone 2)',
      tier: 'warning',
      tierLabel: 'Warning',
      color: '#eab308',
      strokeColor: '#d97706',
      fillOpacity: 0.45,
      ndvi: 0.63,
      ndviDeltaPct: -11.2,
      areaAcres: subAreaAcres,
      polygon: zoneB_coords,
      center: [centerLat - latDelta * 0.2, centerLng + lngDelta * 0.5],
      unhealthyReasonTitle: 'Early Canopy Moisture Stress & Slope Runoff',
      unhealthySummary: 'Elevated topography on the eastern ridge causes rapid irrigation runoff. Moisture drops 24% faster than field average.',
      soilMoisturePct: 20.8,
      waterStressLevel: 'Moderate',
      thermalHotspotDelta: +1.8,
      pathogenRiskPct: 28,
      chlorophyllDensity: '31.5 µg/cm²',
      immediateAction: 'Increase emitter run-time on line #2 by 15 minutes to counter hillside runoff.',
      recommendedTreatment: 'Light potassium foliar spray (0.5% KNO3) to improve stomatal regulation.',
      samplePathologyType: 'corn-rust',
    },
    {
      id: 'zone-orange',
      name: 'West Terrace (Zone 3)',
      tier: 'moderate',
      tierLabel: 'Moderate Risk',
      color: '#f97316',
      strokeColor: '#ea580c',
      fillOpacity: 0.45,
      ndvi: 0.48,
      ndviDeltaPct: -26.5,
      areaAcres: subAreaAcres,
      polygon: zoneC_coords,
      center: [centerLat - latDelta * 0.2, centerLng - lngDelta * 0.5],
      unhealthyReasonTitle: 'Micro-Climate Pathogen Risk & Foliar Leaching',
      unhealthySummary: 'Low wind exposure and prolonged morning dew create favorable incubation conditions for fungal target-spots and leaf lesions.',
      soilMoisturePct: 16.5,
      waterStressLevel: 'High',
      thermalHotspotDelta: +2.9,
      pathogenRiskPct: 68,
      chlorophyllDensity: '22.0 µg/cm²',
      immediateAction: 'Prune dense lower foliage to increase air circulation; scout lower leaf undersides for concentric brown lesions.',
      recommendedTreatment: 'Preventive bio-fungicide (Trichoderma harzianum @ 5g/L) or Copper Hydroxide (2g/L).',
      samplePathologyType: 'apple-scab',
    },
    {
      id: 'zone-red',
      name: 'South Low Basin (Zone 4)',
      tier: 'severe',
      tierLabel: 'Severe Risk',
      color: '#ef4444',
      strokeColor: '#dc2626',
      fillOpacity: 0.50,
      ndvi: 0.32,
      ndviDeltaPct: -39.8,
      areaAcres: subAreaAcres,
      polygon: zoneD_coords,
      center: [centerLat - latDelta * 0.7, centerLng],
      unhealthyReasonTitle: 'Critical Root-Zone Moisture Deficit & Thermal Heat Spike',
      unhealthySummary: 'Blocked drip line sub-manifold has caused chronic under-watering. Stomata have locked shut, producing a +4.3°C canopy thermal hotspot and severe chlorotic necrosis.',
      soilMoisturePct: 11.2,
      waterStressLevel: 'Critical',
      thermalHotspotDelta: +4.3,
      pathogenRiskPct: 86,
      chlorophyllDensity: '14.2 µg/cm²',
      immediateAction: 'EMERGENCY: Flush and unblock irrigation sub-manifold valve 4. Apply immediate restorative water pulse.',
      recommendedTreatment: 'Curative Mancozeb 75% WP (@ 2.5g/L) or Azoxystrobin to protect heat-stressed foliage from opportunist blight.',
      samplePathologyType: 'tomato-early-blight',
    },
  ];
}

/**
 * Creates a dynamic semi-transparent Canvas raster overlay mapped over a GeoJSON polygon
 * using the 4 discrete agronomic color tiers:
 * Green (>= 0.70), Yellow (0.55 - 0.70), Orange (0.40 - 0.55), Red (< 0.40)
 */
export function createPolygonNDVIOverlay(
  polygonCoordinates: Array<[number, number]>, // [[lat, lng], ...]
  baseNDVI: number = 0.72,
  resolution: number = 256
): { dataUrl: string; bounds: L.LatLngBounds } {
  const lats = polygonCoordinates.map((c) => c[0]);
  const lngs = polygonCoordinates.map((c) => c[1]);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const bounds = L.latLngBounds([minLat, minLng], [maxLat, maxLng]);

  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return { dataUrl: '', bounds };
  }

  // Map polygon coordinates to 0..resolution canvas space
  const normPoints: Array<[number, number]> = polygonCoordinates.map(([lat, lng]) => {
    const x = ((lng - minLng) / (maxLng - minLng || 0.0001)) * resolution;
    const y = ((maxLat - lat) / (maxLat - minLat || 0.0001)) * resolution;
    return [x, y];
  });

  // Clip directly to user's drawn boundary
  ctx.save();
  ctx.beginPath();
  normPoints.forEach(([x, y], idx) => {
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.clip();

  // Generate 2D continuous NDVI raster matrix with 4-Tier color mapping
  const imgData = ctx.createImageData(resolution, resolution);
  const d = imgData.data;

  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      const idx = (py * resolution + px) * 4;

      const nx = px / resolution;
      const ny = py / resolution;

      // Realistic 2D spatial variation using trigonometric harmonics
      const noise =
        Math.sin(nx * 7.5 + ny * 5.2) * 0.16 +
        Math.cos(nx * 12.0 - ny * 9.0) * 0.09 +
        Math.sin(nx * 20.0 + ny * 20.0) * 0.04;

      const val = Math.min(0.98, Math.max(0.10, baseNDVI + noise));

      // Strict 4-Tier agricultural colormap
      let r = 16, g = 185, b = 129; // Default Green

      if (val < 0.40) {
        // Red: Severe Risk
        r = 239; g = 68; b = 68;
      } else if (val < 0.55) {
        // Orange: Moderate Risk
        r = 249; g = 115; b = 22;
      } else if (val < 0.70) {
        // Yellow: Warning
        r = 234; g = 179; b = 8;
      } else {
        // Green: Healthy
        r = 16; g = 185; b = 129;
      }

      d[idx] = r;
      d[idx + 1] = g;
      d[idx + 2] = b;
      d[idx + 3] = 195; // 76% opacity for clear satellite view beneath
    }
  }

  ctx.putImageData(imgData, 0, 0);
  ctx.restore();

  // Boundary glow
  ctx.save();
  ctx.beginPath();
  normPoints.forEach(([x, y], idx) => {
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.9)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  return {
    dataUrl: canvas.toDataURL('image/png'),
    bounds,
  };
}
