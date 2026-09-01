import L from 'leaflet';

export interface NDVIPixelSample {
  ndvi: number;
  label: string;
  color: string;
  chlorophyllEstimate: string;
  biomassStatus: string;
}

export function sampleNDVIValue(lat: number, lng: number, baseNDVI: number = 0.72): NDVIPixelSample {
  // Deterministic high-precision micro-variation across geographic coordinate space
  const seed = (Math.sin(lat * 1200) + Math.cos(lng * 1200)) * 0.12;
  const ndvi = Math.min(0.96, Math.max(0.08, parseFloat((baseNDVI + seed).toFixed(3))));

  if (ndvi >= 0.75) {
    return {
      ndvi,
      label: 'Optimal Chlorophyll Vigor',
      color: '#10b981',
      chlorophyllEstimate: `${(42 + (ndvi - 0.75) * 25).toFixed(1)} µg/cm²`,
      biomassStatus: 'Dense Canopy Biomass (Peak Absorption)',
    };
  } else if (ndvi >= 0.55) {
    return {
      ndvi,
      label: 'Healthy Vegetative Canopy',
      color: '#22c55e',
      chlorophyllEstimate: `${(32 + (ndvi - 0.55) * 35).toFixed(1)} µg/cm²`,
      biomassStatus: 'Normal Vegetative Growth',
    };
  } else if (ndvi >= 0.35) {
    return {
      ndvi,
      label: 'Early Stress / Sparse Foliage',
      color: '#f59e0b',
      chlorophyllEstimate: `${(20 + (ndvi - 0.35) * 45).toFixed(1)} µg/cm²`,
      biomassStatus: 'Localized Moisture / Nutrient Stress',
    };
  } else {
    return {
      ndvi,
      label: 'Severe Defoliation / Bare Soil',
      color: '#ef4444',
      chlorophyllEstimate: '< 15.0 µg/cm²',
      biomassStatus: 'Critical Foliar Decline / Bare Ground',
    };
  }
}

/**
 * Creates a dynamic semi-transparent Canvas raster overlay mapped over a GeoJSON polygon.
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
    const y = ((maxLat - lat) / (maxLat - minLat || 0.0001)) * resolution; // invert y for canvas
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

  // Generate 2D continuous NDVI raster matrix
  const imgData = ctx.createImageData(resolution, resolution);
  const d = imgData.data;

  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      const idx = (py * resolution + px) * 4;

      const nx = px / resolution;
      const ny = py / resolution;

      // Realistic 2D spatial variation using trigonometric harmonics
      const noise =
        Math.sin(nx * 7.5 + ny * 5.2) * 0.14 +
        Math.cos(nx * 12.0 - ny * 9.0) * 0.08 +
        Math.sin(nx * 20.0 + ny * 20.0) * 0.04;

      const val = Math.min(0.98, Math.max(0.08, baseNDVI + noise));

      // Continuous agricultural NDVI color gradient
      let r = 0, g = 0, b = 0;
      if (val < 0.35) {
        // Red to Amber
        const t = val / 0.35;
        r = 239;
        g = Math.round(68 + t * (158 - 68));
        b = Math.round(68 - t * 50);
      } else if (val < 0.65) {
        // Amber to Lime Green
        const t = (val - 0.35) / 0.30;
        r = Math.round(245 - t * (245 - 34));
        g = Math.round(158 + t * (197 - 158));
        b = Math.round(11 + t * 40);
      } else {
        // Lime to Deep Emerald Forest Green
        const t = (val - 0.65) / 0.35;
        r = Math.round(34 - t * 30);
        g = Math.round(197 - t * (197 - 120));
        b = Math.round(51 + t * 20);
      }

      d[idx] = r;
      d[idx + 1] = g;
      d[idx + 2] = b;
      d[idx + 3] = 190; // 75% opacity for clear satellite view beneath
    }
  }

  ctx.putImageData(imgData, 0, 0);
  ctx.restore();

  // Draw delicate boundary glow
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
