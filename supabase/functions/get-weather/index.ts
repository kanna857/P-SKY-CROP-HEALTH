import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherRequest {
  lat: number;
  lng: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng }: WeatherRequest = await req.json();
    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');

    if (!apiKey) {
      console.error('OpenWeatherMap API key not configured');
      throw new Error('Weather API not configured');
    }

    console.log(`Fetching weather for coordinates: ${lat}, ${lng}`);

    // Fetch current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
    );

    if (!currentResponse.ok) {
      const errorText = await currentResponse.text();
      console.error('OpenWeatherMap current weather error:', errorText);
      throw new Error('Failed to fetch current weather');
    }

    const currentData = await currentResponse.json();
    console.log('Current weather data received:', JSON.stringify(currentData));

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
    );

    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      console.error('OpenWeatherMap forecast error:', errorText);
      throw new Error('Failed to fetch weather forecast');
    }

    const forecastData = await forecastResponse.json();
    console.log('Forecast data received');

    // Map weather condition to our simplified format
    const mapCondition = (weatherId: number): string => {
      if (weatherId >= 200 && weatherId < 300) return 'rainy'; // Thunderstorm
      if (weatherId >= 300 && weatherId < 400) return 'rainy'; // Drizzle
      if (weatherId >= 500 && weatherId < 600) return 'rainy'; // Rain
      if (weatherId >= 600 && weatherId < 700) return 'cloudy'; // Snow
      if (weatherId >= 700 && weatherId < 800) return 'cloudy'; // Atmosphere
      if (weatherId === 800) return 'sunny'; // Clear
      if (weatherId > 800) return 'partly_cloudy'; // Clouds
      return 'partly_cloudy';
    };

    // Process current weather
    const current = {
      temperature: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      condition: mapCondition(currentData.weather[0].id),
      rainfall: currentData.rain?.['1h'] || currentData.rain?.['3h'] || 0,
      description: currentData.weather[0].description,
    };

    // Process forecast - get one entry per day (noon readings)
    const dailyForecasts: { [key: string]: any } = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      const hour = date.getHours();
      
      // Prefer noon readings (12:00)
      if (!dailyForecasts[dayKey] || Math.abs(hour - 12) < Math.abs(dailyForecasts[dayKey].hour - 12)) {
        dailyForecasts[dayKey] = {
          day: days[date.getDay()],
          temp: Math.round(item.main.temp),
          condition: mapCondition(item.weather[0].id),
          hour: hour,
        };
      }
    });

    // Get first 5 days
    const forecast = Object.values(dailyForecasts).slice(0, 5).map((day: any) => ({
      day: day.day,
      temp: day.temp,
      condition: day.condition,
    }));

    // Set first day as "Today"
    if (forecast.length > 0) {
      forecast[0].day = 'Today';
    }
    if (forecast.length > 1) {
      forecast[1].day = 'Tomorrow';
    }

    const weatherResponse = {
      current,
      forecast,
      location: currentData.name,
    };

    console.log('Returning weather response:', JSON.stringify(weatherResponse));

    return new Response(JSON.stringify(weatherResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-weather function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
