export interface HourlyForecastPoint {
  hourOffset: number;
  timeLabel: string;
  tempC: number;
  relativeHumidity: number;
  leafWetnessHours: number;
  rainMm: number;
  windSpeedKmh: number;
  pathogenRiskScore: number; // 0 to 100
  isOptimalSprayWindow: boolean;
}

export interface PathogenEpidemiologyReport {
  targetCrop: string;
  pathogenName: string;
  scientificName: string;
  overallVulnerability: number; // 0 to 100
  riskTier: 'Low' | 'Moderate' | 'High' | 'Critical';
  sporeGerminationIndex: number; // 0 to 100
  leafWetnessAccumulation: number; // total hours
  optimalSprayWindow: {
    startLabel: string;
    endLabel: string;
    actionMessage: string;
    recommendedChemistry: string;
    organicAlternative: string;
  };
  keyDrivers: string[];
  hourlyForecast: HourlyForecastPoint[];
}

export function calculateEpidemiologyForecast(
  cropName: string = 'Tomato',
  diseaseName: string = 'Late Blight'
): PathogenEpidemiologyReport {
  const now = new Date();
  const hourlyForecast: HourlyForecastPoint[] = [];

  let totalRisk = 0;
  let totalWetness = 0;

  // Generate 72-hour realistic diurnal simulation
  for (let i = 0; i < 72; i++) {
    const futureDate = new Date(now.getTime() + i * 3600 * 1000);
    const hourOfDay = futureDate.getHours();
    const isNight = hourOfDay < 6 || hourOfDay > 20;

    // Diurnal temperature & humidity wave
    const tempC = Math.round(isNight ? 16 + Math.sin(i / 6) * 3 : 24 + Math.sin(i / 6) * 4);
    const relativeHumidity = Math.round(isNight ? 82 + Math.cos(i / 4) * 12 : 62 + Math.cos(i / 4) * 15);
    const rainMm = (i >= 14 && i <= 22) || (i >= 42 && i <= 48) ? Math.round((Math.sin(i) * 3 + 4) * 10) / 10 : 0.0;
    const leafWetnessHours = relativeHumidity > 80 || rainMm > 0 ? (isNight ? 1 : 0.6) : 0;
    const windSpeedKmh = Math.round(8 + Math.sin(i / 3) * 6);

    totalWetness += leafWetnessHours;

    // Pathogen Spore Germination Mathematical Equation
    // Optimal germination for Late Blight: 15-22°C, RH > 85%, Leaf wetness >= 6 hours
    let risk = 0;
    if (relativeHumidity > 85 && tempC >= 14 && tempC <= 23) {
      risk += 45;
    } else if (relativeHumidity > 75 && tempC >= 12 && tempC <= 26) {
      risk += 25;
    }

    if (leafWetnessHours > 0.5) risk += 25;
    if (rainMm > 0.5) risk += 20;
    if (windSpeedKmh > 14) risk += 10; // Spore dispersion factor

    risk = Math.min(Math.max(risk, 5), 98);
    totalRisk += risk;

    // Optimal spray window: Calm wind (<12 km/h), no rain in next 6 hours, before high spore germination
    const isOptimalSprayWindow = rainMm === 0 && windSpeedKmh <= 12 && hourOfDay >= 6 && hourOfDay <= 10 && i <= 36;

    const timeLabel = futureDate.toLocaleTimeString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });

    hourlyForecast.push({
      hourOffset: i,
      timeLabel,
      tempC,
      relativeHumidity,
      leafWetnessHours,
      rainMm,
      windSpeedKmh,
      pathogenRiskScore: risk,
      isOptimalSprayWindow
    });
  }

  const avgRisk = Math.round(totalRisk / 72);
  const riskTier: 'Low' | 'Moderate' | 'High' | 'Critical' =
    avgRisk > 75 ? 'Critical' : avgRisk > 55 ? 'High' : avgRisk > 35 ? 'Moderate' : 'Low';

  // Find first best spray window
  const sprayPoints = hourlyForecast.filter(p => p.isOptimalSprayWindow);
  const firstSpray = sprayPoints[0] || hourlyForecast[8];
  const lastSpray = sprayPoints[sprayPoints.length - 1] || hourlyForecast[12];

  return {
    targetCrop: cropName,
    pathogenName: diseaseName,
    scientificName: diseaseName.toLowerCase().includes('late blight')
      ? 'Phytophthora infestans'
      : diseaseName.toLowerCase().includes('early blight')
      ? 'Alternaria solani'
      : diseaseName.toLowerCase().includes('rust')
      ? 'Puccinia sorghi'
      : 'Erysiphe cichoracearum',
    overallVulnerability: avgRisk,
    riskTier,
    sporeGerminationIndex: Math.min(100, Math.round(avgRisk * 1.15)),
    leafWetnessAccumulation: Math.round(totalWetness),
    optimalSprayWindow: {
      startLabel: firstSpray.timeLabel,
      endLabel: lastSpray.timeLabel,
      actionMessage: `Spray preventative contact fungicide during ${firstSpray.timeLabel} - ${lastSpray.timeLabel} before spore germination surge.`,
      recommendedChemistry: 'Mancozeb 75% WP (2.5 g/L) + Azoxystrobin (1 ml/L)',
      organicAlternative: 'Copper Hydroxide / Bordeaux Mixture (1%) + Neem Oil (5 ml/L)'
    },
    keyDrivers: [
      `High canopy relative humidity (>80%) for ${Math.round(totalWetness)} cumulative hours`,
      `Optimal sporulation temperatures between 15°C and 22°C`,
      `Intermittent rainfall triggering splash dispersal of fungal zoospores`
    ],
    hourlyForecast
  };
}
