// Crop-specific NDVI thresholds for accurate health assessment
// Different crops have different optimal NDVI ranges based on their growth patterns and canopy characteristics

export interface CropThreshold {
  excellent: number;  // NDVI >= this = Excellent health
  healthy: number;    // NDVI >= this = Healthy
  moderate: number;   // NDVI >= this = Moderate (below = Stressed)
  description: string;
  growthNote: string;
}

export const CROP_NDVI_THRESHOLDS: Record<string, CropThreshold> = {
  'Rice': { 
    excellent: 0.65, 
    healthy: 0.50, 
    moderate: 0.35, 
    description: 'Paddy requires consistent water levels',
    growthNote: 'Peak NDVI during tillering to heading stage'
  },
  'Cotton': { 
    excellent: 0.70, 
    healthy: 0.55, 
    moderate: 0.40, 
    description: 'Sensitive to water stress during flowering',
    growthNote: 'Monitor closely during boll formation'
  },
  'Wheat': { 
    excellent: 0.75, 
    healthy: 0.60, 
    moderate: 0.45, 
    description: 'Peak NDVI during tillering stage',
    growthNote: 'Optimal growth at 15-25°C temperature range'
  },
  'Sugarcane': { 
    excellent: 0.70, 
    healthy: 0.55, 
    moderate: 0.40, 
    description: 'High biomass crop with dense canopy',
    growthNote: 'Consistent NDVI expected throughout growth'
  },
  'Maize': { 
    excellent: 0.75, 
    healthy: 0.60, 
    moderate: 0.40, 
    description: 'Rapid growth requires monitoring',
    growthNote: 'Critical period during tasseling and silking'
  },
  'Groundnut': { 
    excellent: 0.60, 
    healthy: 0.45, 
    moderate: 0.30, 
    description: 'Lower canopy crop',
    growthNote: 'NDVI peaks during pegging and pod development'
  },
  'Chilli': { 
    excellent: 0.55, 
    healthy: 0.40, 
    moderate: 0.25, 
    description: 'Sparse canopy, lower natural NDVI',
    growthNote: 'Focus on plant spacing for accurate readings'
  },
  'Banana': { 
    excellent: 0.80, 
    healthy: 0.65, 
    moderate: 0.50, 
    description: 'High leaf area index',
    growthNote: 'Consistent high NDVI indicates healthy plantation'
  },
  'Mango': { 
    excellent: 0.75, 
    healthy: 0.60, 
    moderate: 0.45, 
    description: 'Perennial with seasonal variation',
    growthNote: 'Lower NDVI during flowering is normal'
  },
  'Coconut': { 
    excellent: 0.65, 
    healthy: 0.50, 
    moderate: 0.35, 
    description: 'Palm canopy characteristics',
    growthNote: 'Stable NDVI expected for mature palms'
  },
};

export const DEFAULT_THRESHOLD: CropThreshold = { 
  excellent: 0.70, 
  healthy: 0.50, 
  moderate: 0.30, 
  description: 'General threshold for unlisted crops',
  growthNote: 'Monitor based on visual inspection'
};

export interface CropSpecificCategory {
  label: string;
  color: string;
  bgColor: string;
  percentageOfOptimal: number;
  cropNote: string;
  thresholds: CropThreshold;
}

export function getCropSpecificNDVICategory(ndvi: number, crop: string): CropSpecificCategory {
  const thresholds = CROP_NDVI_THRESHOLDS[crop] || DEFAULT_THRESHOLD;
  
  // Calculate percentage of optimal (using excellent threshold as optimal)
  const percentageOfOptimal = Math.min(100, Math.round((ndvi / thresholds.excellent) * 100));
  
  if (ndvi >= thresholds.excellent) {
    return { 
      label: 'Excellent', 
      color: 'text-ndvi-excellent', 
      bgColor: 'bg-ndvi-excellent',
      percentageOfOptimal,
      cropNote: `Optimal for ${crop}: ${thresholds.description}`,
      thresholds
    };
  } else if (ndvi >= thresholds.healthy) {
    return { 
      label: 'Healthy', 
      color: 'text-ndvi-healthy', 
      bgColor: 'bg-ndvi-healthy',
      percentageOfOptimal,
      cropNote: `Good for ${crop}: Continue current practices`,
      thresholds
    };
  } else if (ndvi >= thresholds.moderate) {
    return { 
      label: 'Moderate', 
      color: 'text-ndvi-moderate', 
      bgColor: 'bg-ndvi-moderate',
      percentageOfOptimal,
      cropNote: `Below optimal for ${crop}: Monitor closely`,
      thresholds
    };
  } else {
    return { 
      label: 'Stressed', 
      color: 'text-ndvi-critical', 
      bgColor: 'bg-ndvi-critical',
      percentageOfOptimal,
      cropNote: `Critical for ${crop}: Immediate action needed`,
      thresholds
    };
  }
}

export function calculatePriorityScore(ndvi: number, crop: string, area: number): number {
  const category = getCropSpecificNDVICategory(ndvi, crop);
  
  // Base score from how far below optimal (0-50 points)
  const optimalGap = Math.max(0, 100 - category.percentageOfOptimal);
  const gapScore = optimalGap * 0.5;
  
  // Area factor - larger fields need more attention (0-30 points)
  const areaScore = Math.min(30, area * 1.5);
  
  // Stress severity multiplier (0-20 points)
  let severityScore = 0;
  if (category.label === 'Stressed') severityScore = 20;
  else if (category.label === 'Moderate') severityScore = 10;
  else if (category.label === 'Healthy') severityScore = 3;
  
  return Math.round(gapScore + areaScore + severityScore);
}

export function getCropOptimalRange(crop: string): { min: number; max: number; optimal: number } {
  const thresholds = CROP_NDVI_THRESHOLDS[crop] || DEFAULT_THRESHOLD;
  return {
    min: thresholds.moderate,
    max: 1.0,
    optimal: thresholds.excellent
  };
}
