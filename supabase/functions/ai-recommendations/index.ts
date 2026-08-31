import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FieldData {
  name: string;
  crop: string;
  ndvi: number;
  area: number;
  weather?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    rainfall: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { field } = await req.json() as { field: FieldData };
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      throw new Error('AI service not configured');
    }

    console.log('Generating recommendations for field:', field.name);

    // Crop-specific NDVI thresholds
    const cropThresholds: Record<string, { excellent: number; healthy: number; moderate: number }> = {
      'Rice': { excellent: 0.65, healthy: 0.50, moderate: 0.35 },
      'Cotton': { excellent: 0.70, healthy: 0.55, moderate: 0.40 },
      'Wheat': { excellent: 0.75, healthy: 0.60, moderate: 0.45 },
      'Sugarcane': { excellent: 0.70, healthy: 0.55, moderate: 0.40 },
      'Maize': { excellent: 0.75, healthy: 0.60, moderate: 0.40 },
      'Groundnut': { excellent: 0.60, healthy: 0.45, moderate: 0.30 },
      'Chilli': { excellent: 0.55, healthy: 0.40, moderate: 0.25 },
      'Banana': { excellent: 0.80, healthy: 0.65, moderate: 0.50 },
      'Mango': { excellent: 0.75, healthy: 0.60, moderate: 0.45 },
      'Coconut': { excellent: 0.65, healthy: 0.50, moderate: 0.35 },
    };

    const threshold = cropThresholds[field.crop] || { excellent: 0.70, healthy: 0.50, moderate: 0.30 };
    
    const systemPrompt = `You are an expert agricultural advisor specializing in precision farming and crop health analysis. 
Your task is to provide actionable recommendations based on NDVI (Normalized Difference Vegetation Index) data and weather conditions.

IMPORTANT: Use CROP-SPECIFIC NDVI thresholds for ${field.crop}:
- Excellent: NDVI >= ${threshold.excellent}
- Healthy: NDVI >= ${threshold.healthy}
- Moderate: NDVI >= ${threshold.moderate}
- Stressed: NDVI < ${threshold.moderate}

The current NDVI of ${field.ndvi.toFixed(2)} should be evaluated against these ${field.crop}-specific thresholds, NOT generic NDVI ranges.

Provide 3-5 specific, actionable recommendations tailored to ${field.crop} cultivation. Be concise but thorough. Format each recommendation with a priority level (High/Medium/Low) and category (Irrigation, Fertilization, Pest Control, Harvesting, Monitoring).`;

    const userPrompt = `Analyze this field and provide recommendations:

Field: ${field.name}
Crop: ${field.crop}
Area: ${field.area} hectares
Current NDVI: ${field.ndvi.toFixed(2)}

${field.weather ? `Weather Conditions:
- Temperature: ${field.weather.temperature}°C
- Humidity: ${field.weather.humidity}%
- Wind Speed: ${field.weather.windSpeed} km/h
- Condition: ${field.weather.condition}
- Recent Rainfall: ${field.weather.rainfall}mm` : 'Weather data not available'}

Provide specific recommendations for this field based on the NDVI value and weather conditions.`;

    // Using Google Gemini API directly
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const recommendations = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!recommendations) {
      throw new Error('No recommendations generated');
    }

    console.log('Successfully generated recommendations');

    return new Response(JSON.stringify({ 
      recommendations,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
