import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Loader2, AlertCircle } from 'lucide-react';
import { DemoField } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly_cloudy';
  rainfall: number;
  description: string;
}

interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
}

interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
  location: string;
}

interface WeatherWidgetProps {
  field: DemoField | null;
}

function getWeatherIcon(condition: string, className: string = "w-5 h-5") {
  switch (condition) {
    case 'sunny':
      return <Sun className={`${className} text-yellow-400`} />;
    case 'rainy':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'cloudy':
      return <Cloud className={`${className} text-gray-400`} />;
    case 'partly_cloudy':
    default:
      return <Cloud className={`${className} text-gray-300`} />;
  }
}

function getWeatherImpact(weather: CurrentWeather, ndvi: number): { message: string; severity: 'good' | 'warning' | 'critical' } {
  if (weather.condition === 'rainy' && weather.rainfall > 20) {
    return {
      message: 'Heavy rainfall may cause waterlogging. Monitor drainage systems.',
      severity: 'warning'
    };
  }
  if (weather.humidity < 40 && weather.temperature > 35) {
    return {
      message: 'High heat and low humidity detected. Increase irrigation frequency.',
      severity: 'critical'
    };
  }
  if (weather.windSpeed > 15) {
    return {
      message: 'Strong winds may affect crop health. Consider windbreaks for sensitive crops.',
      severity: 'warning'
    };
  }
  if (ndvi < 0.4 && weather.rainfall === 0) {
    return {
      message: 'Stressed crops need water. No rain expected - irrigate immediately.',
      severity: 'critical'
    };
  }
  return {
    message: 'Weather conditions are favorable for crop growth.',
    severity: 'good'
  };
}

export function WeatherWidget({ field }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (field) {
      setLoading(true);
      setError(null);

      const fetchWeather = async () => {
        try {
          // Fetch real weather data from Open-Meteo (No API key required)
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${field.lat}&longitude=${field.lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
          );

          if (!res.ok) throw new Error("Failed to fetch weather data");
          const data = await res.json();

          // Helper to map WMO Weather interpretation codes to our simple UI icons
          const mapWmoCode = (code: number): 'sunny' | 'cloudy' | 'partly_cloudy' | 'rainy' => {
            if (code === 0) return 'sunny';
            if (code === 1 || code === 2) return 'partly_cloudy';
            if (code === 3 || code === 45 || code === 48) return 'cloudy';
            return 'rainy'; // all other codes (drizzle, rain, snow, thunderstorms)
          };

          const currentCode = data.current.weather_code;
          const condition = mapWmoCode(currentCode);

          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

          const forecast: ForecastDay[] = data.daily.time.slice(1, 6).map((timeStr: string, index: number) => {
            const date = new Date(timeStr);
            const wmo = data.daily.weather_code[index + 1];
            // Get average of max and min for daily temp display
            const maxTemp = data.daily.temperature_2m_max[index + 1];
            const minTemp = data.daily.temperature_2m_min[index + 1];
            const avgTemp = Math.round((maxTemp + minTemp) / 2);

            return {
              day: daysOfWeek[date.getDay()],
              temp: avgTemp,
              condition: mapWmoCode(wmo)
            };
          });

          const weatherData: WeatherData = {
            current: {
              temperature: Math.round(data.current.temperature_2m),
              humidity: Math.round(data.current.relative_humidity_2m),
              windSpeed: Math.round(data.current.wind_speed_10m),
              condition: condition,
              rainfall: data.current.precipitation,
              description: condition === 'sunny' ? 'Clear skies' : condition === 'rainy' ? 'Rain expected' : 'Mixed clouds'
            },
            forecast: forecast,
            location: field.name
          };

          setWeather(weatherData);
        } catch (err: any) {
          console.error('Weather error:', err);
          setError(err.message || 'Unable to load weather data');
        } finally {
          setLoading(false);
        }
      };

      fetchWeather();
    } else {
      setWeather(null);
      setError(null);
    }
  }, [field]);

  if (!field) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-primary" />
          Weather Data
        </h3>
        <p className="text-muted-foreground text-sm">Select a field to view weather conditions</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-primary" />
          Weather Data
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-primary" />
          Weather Data
        </h3>
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const impact = getWeatherImpact(weather.current, field.ndvi);

  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          <Cloud className="w-5 h-5 text-primary" />
          Weather Conditions
        </h3>
        {weather.location && (
          <span className="text-xs text-muted-foreground">{weather.location}</span>
        )}
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.current.condition, "w-12 h-12")}
          <div>
            <div className="text-3xl font-bold">{weather.current.temperature}°C</div>
            <div className="text-sm text-muted-foreground capitalize">
              {weather.current.description || weather.current.condition.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-secondary/30">
          <Droplets className="w-4 h-4 mx-auto text-blue-400 mb-1" />
          <div className="text-sm font-medium">{weather.current.humidity}%</div>
          <div className="text-xs text-muted-foreground">Humidity</div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <Wind className="w-4 h-4 mx-auto text-gray-400 mb-1" />
          <div className="text-sm font-medium">{weather.current.windSpeed} km/h</div>
          <div className="text-xs text-muted-foreground">Wind</div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30">
          <CloudRain className="w-4 h-4 mx-auto text-blue-400 mb-1" />
          <div className="text-sm font-medium">{weather.current.rainfall.toFixed(1)} mm</div>
          <div className="text-xs text-muted-foreground">Rain</div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      {weather.forecast.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Forecast</h4>
          <div className="flex justify-between">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                {getWeatherIcon(day.condition, "w-5 h-5 mx-auto")}
                <div className="text-sm font-medium mt-1">{day.temp}°</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Impact on Crops */}
      <div className={`p-3 rounded-lg border ${impact.severity === 'good'
        ? 'bg-success/10 border-success/20'
        : impact.severity === 'warning'
          ? 'bg-warning/10 border-warning/20'
          : 'bg-destructive/10 border-destructive/20'
        }`}>
        <div className="flex items-start gap-2">
          <Thermometer className={`w-4 h-4 mt-0.5 ${impact.severity === 'good'
            ? 'text-success'
            : impact.severity === 'warning'
              ? 'text-warning'
              : 'text-destructive'
            }`} />
          <div>
            <p className={`text-sm font-medium ${impact.severity === 'good'
              ? 'text-success'
              : impact.severity === 'warning'
                ? 'text-warning'
                : 'text-destructive'
              }`}>
              Weather Impact
            </p>
            <p className="text-xs text-muted-foreground mt-1">{impact.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
