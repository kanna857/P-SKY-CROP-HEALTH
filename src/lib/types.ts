export interface DemoField {
  id: string;
  name: string;
  lat: number;
  lng: number;
  ndvi: number;
  crop: string;
  area: number; // in hectares
  lastAnalysis: string;
}

export interface SavedField extends DemoField {
  savedAt: string;
}

export interface NDVIData {
  average: number;
  healthyPercentage: number;
  stressedPercentage: number;
  moderatePercentage: number;
  trend: { week: string; ndvi: number }[];
  recommendation: string;
  healthScore: number;
  diseaseProbability: number;
  weatherRisk: number;
}

export type AlertLanguage = 'en' | 'te' | 'hi' | 'ta' | 'kn';
export type AlertMethod = 'sms' | 'whatsapp' | 'voice';

export interface AlertSettings {
  enabled: boolean;
  phone: string;
  threshold: number;
  method: AlertMethod;
  language: AlertLanguage;
}

export const ALERT_LANGUAGES: { code: AlertLanguage; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

export const ALERT_MESSAGES: Record<AlertLanguage, {
  critical: string;
  warning: string;
  healthy: string;
  voiceIntro: string;
}> = {
  en: {
    critical: 'ALERT: Your {crop} field at {location} shows critical stress (NDVI: {ndvi}). Immediate action required!',
    warning: 'WARNING: Your {crop} field at {location} needs attention (NDVI: {ndvi}). Please check irrigation.',
    healthy: 'Good news! Your {crop} field at {location} is healthy (NDVI: {ndvi}). Keep up the good work!',
    voiceIntro: 'This is Astro Farmer calling about your crop health.',
  },
  te: {
    critical: 'హెచ్చరిక: {location}లో మీ {crop} పొలం తీవ్ర ఒత్తిడిలో ఉంది (NDVI: {ndvi}). వెంటనే చర్య తీసుకోండి!',
    warning: 'హెచ్చరిక: {location}లో మీ {crop} పొలానికి శ్రద్ధ అవసరం (NDVI: {ndvi}). నీటిపారుదల తనిఖీ చేయండి.',
    healthy: 'శుభవార్త! {location}లో మీ {crop} పొలం ఆరోగ్యంగా ఉంది (NDVI: {ndvi}). మంచి పని కొనసాగించండి!',
    voiceIntro: 'ఇది ఆస్ట్రో ఫార్మర్ నుండి మీ పంట ఆరోగ్యం గురించి కాల్.',
  },
  hi: {
    critical: 'चेतावनी: {location} पर आपकी {crop} फसल गंभीर तनाव में है (NDVI: {ndvi})। तुरंत कार्रवाई करें!',
    warning: 'सावधान: {location} पर आपकी {crop} फसल को ध्यान देने की जरूरत है (NDVI: {ndvi})। सिंचाई जांचें।',
    healthy: 'खुशखबरी! {location} पर आपकी {crop} फसल स्वस्थ है (NDVI: {ndvi})। अच्छा काम जारी रखें!',
    voiceIntro: 'यह एस्ट्रो फार्मर है, आपकी फसल के स्वास्थ्य के बारे में कॉल।',
  },
  ta: {
    critical: 'எச்சரிக்கை: {location}ல் உங்கள் {crop} வயல் கடுமையான அழுத்தத்தில் உள்ளது (NDVI: {ndvi}). உடனடி நடவடிக்கை தேவை!',
    warning: 'கவனம்: {location}ல் உங்கள் {crop} வயலுக்கு கவனம் தேவை (NDVI: {ndvi}). நீர்ப்பாசனத்தை சரிபார்க்கவும்.',
    healthy: 'நல்ல செய்தி! {location}ல் உங்கள் {crop} வயல் ஆரோக்கியமாக உள்ளது (NDVI: {ndvi}). நல்ல வேலையைத் தொடருங்கள்!',
    voiceIntro: 'இது ஆஸ்ட்ரோ ஃபார்மர், உங்கள் பயிர் ஆரோக்கியம் பற்றி அழைப்பு.',
  },
  kn: {
    critical: 'ಎಚ್ಚರಿಕೆ: {location}ನಲ್ಲಿ ನಿಮ್ಮ {crop} ಹೊಲ ತೀವ್ರ ಒತ್ತಡದಲ್ಲಿದೆ (NDVI: {ndvi}). ತಕ್ಷಣ ಕ್ರಮ ಕೈಗೊಳ್ಳಿ!',
    warning: 'ಗಮನ: {location}ನಲ್ಲಿ ನಿಮ್ಮ {crop} ಹೊಲಕ್ಕೆ ಗಮನ ಬೇಕು (NDVI: {ndvi}). ನೀರಾವರಿ ಪರಿಶೀಲಿಸಿ.',
    healthy: 'ಒಳ್ಳೆಯ ಸುದ್ದಿ! {location}ನಲ್ಲಿ ನಿಮ್ಮ {crop} ಹೊಲ ಆರೋಗ್ಯಕರವಾಗಿದೆ (NDVI: {ndvi}). ಒಳ್ಳೆಯ ಕೆಲಸ ಮುಂದುವರಿಸಿ!',
    voiceIntro: 'ಇದು ಆಸ್ಟ್ರೋ ಫಾರ್ಮರ್, ನಿಮ್ಮ ಬೆಳೆ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಕರೆ.',
  },
};

export const DEMO_FIELDS: DemoField[] = [
  // Andhra Pradesh - Various Locations
  {
    id: 'guntur-rice',
    name: 'Guntur Rice Farm',
    lat: 16.3067,
    lng: 80.4365,
    ndvi: 0.72,
    crop: 'Rice',
    area: 12.5,
    lastAnalysis: '2024-01-15',
  },
  {
    id: 'krishna-cotton',
    name: 'Krishna Cotton Farm',
    lat: 16.1817,
    lng: 80.6211,
    ndvi: 0.48,
    crop: 'Cotton',
    area: 8.3,
    lastAnalysis: '2024-01-15',
  },
  {
    id: 'prakasam-chilli',
    name: 'Prakasam Chilli Farm',
    lat: 15.4909,
    lng: 79.9864,
    ndvi: 0.31,
    crop: 'Chilli',
    area: 5.7,
    lastAnalysis: '2024-01-15',
  },
  // Additional AP Locations
  {
    id: 'nellore-groundnut',
    name: 'Nellore Groundnut Farm',
    lat: 14.4426,
    lng: 79.9865,
    ndvi: 0.85,
    crop: 'Groundnut',
    area: 15.2,
    lastAnalysis: '2024-01-15',
  },
  {
    id: 'kurnool-sugarcane',
    name: 'Kurnool Sugarcane Estate',
    lat: 15.8281,
    lng: 78.0373,
    ndvi: 0.68,
    crop: 'Sugarcane',
    area: 25.0,
    lastAnalysis: '2024-01-15',
  },
  {
    id: 'vizag-banana',
    name: 'Vizag Banana Plantation',
    lat: 17.6868,
    lng: 83.2185,
    ndvi: 0.78,
    crop: 'Banana',
    area: 9.8,
    lastAnalysis: '2024-01-15',
  },
  {
    id: 'anantapur-maize',
    name: 'Anantapur Maize Field',
    lat: 14.6819,
    lng: 77.6006,
    ndvi: 0.22,
    crop: 'Maize',
    area: 18.5,
    lastAnalysis: '2024-01-15',
  },
  {
    id: 'kadapa-mango',
    name: 'Kadapa Mango Orchard',
    lat: 14.4673,
    lng: 78.8242,
    ndvi: 0.55,
    crop: 'Mango',
    area: 7.2,
    lastAnalysis: '2024-01-15',
  },
  {
    id: 'srikakulam-paddy',
    name: 'Srikakulam Paddy Fields',
    lat: 18.2949,
    lng: 83.8935,
    ndvi: 0.92,
    crop: 'Rice',
    area: 30.0,
    lastAnalysis: '2024-01-15',
  },
  {
    id: 'west-godavari-coconut',
    name: 'West Godavari Coconut Farm',
    lat: 16.9174,
    lng: 81.3399,
    ndvi: 0.42,
    crop: 'Coconut',
    area: 11.5,
    lastAnalysis: '2024-01-15',
  },
];

export function getNDVICategory(ndvi: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (ndvi >= 0.7) {
    return { label: 'Very Healthy', color: 'text-ndvi-excellent', bgColor: 'bg-ndvi-excellent' };
  } else if (ndvi >= 0.5) {
    return { label: 'Healthy', color: 'text-ndvi-healthy', bgColor: 'bg-ndvi-healthy' };
  } else if (ndvi >= 0.3) {
    return { label: 'Moderate', color: 'text-ndvi-moderate', bgColor: 'bg-ndvi-moderate' };
  } else {
    return { label: 'Stressed', color: 'text-ndvi-critical', bgColor: 'bg-ndvi-critical' };
  }
}

export function generateNDVIData(baseNDVI: number): NDVIData {
  const variation = 0.1;
  const trend = [
    { week: 'Week 1', ndvi: Math.max(0, Math.min(1, baseNDVI - variation * 1.5 + Math.random() * 0.05)) },
    { week: 'Week 2', ndvi: Math.max(0, Math.min(1, baseNDVI - variation + Math.random() * 0.05)) },
    { week: 'Week 3', ndvi: Math.max(0, Math.min(1, baseNDVI - variation * 0.5 + Math.random() * 0.05)) },
    { week: 'Week 4', ndvi: baseNDVI },
  ];

  const healthyPercentage = baseNDVI >= 0.5 ? Math.round(baseNDVI * 100) : Math.round(baseNDVI * 50);
  const stressedPercentage = baseNDVI < 0.3 ? Math.round((1 - baseNDVI) * 60) : Math.round((1 - baseNDVI) * 20);
  const moderatePercentage = 100 - healthyPercentage - stressedPercentage;

  let recommendation = '';
  if (baseNDVI < 0.3) {
    recommendation = 'Critical: Your crops show severe stress. Immediate irrigation and soil testing recommended. Consider applying fertilizers to red zones.';
  } else if (baseNDVI < 0.5) {
    recommendation = 'Moderate stress detected. Consider targeted irrigation in yellow zones. Monitor closely over the next week.';
  } else if (baseNDVI < 0.7) {
    recommendation = 'Good health overall. Continue current practices. Minor stress in some areas - monitor for pest activity.';
  } else {
    recommendation = 'Excellent crop health! Your farming practices are optimal. Continue monitoring to maintain this level.';
  }

  const diseaseProbability = baseNDVI < 0.4 ? Math.floor(Math.random() * 40 + 50) : Math.floor(Math.random() * 30 + 10);
  const weatherRisk = Math.floor(Math.random() * 40 + 20);

  const healthScore = Math.max(0, Math.min(100, Math.round(
    (baseNDVI * 100 * 0.5) + ((100 - diseaseProbability) * 0.25) + ((100 - weatherRisk) * 0.25)
  )));

  return {
    average: baseNDVI,
    healthyPercentage,
    stressedPercentage,
    moderatePercentage,
    trend,
    recommendation,
    healthScore,
    diseaseProbability,
    weatherRisk,
  };
}
