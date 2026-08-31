import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DemoField } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

interface AIRecommendationsProps {
  field: DemoField | null;
  weather?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    rainfall: number;
  } | null;
}

export function AIRecommendations({ field, weather }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async () => {
    if (!field) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field: {
            name: field.name,
            crop: field.crop,
            ndvi: field.ndvi,
            area: field.area,
            weather: weather || undefined,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate recommendations');
      }

      setRecommendations(data.recommendations);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Unable to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (!field) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Recommendations
        </h3>
        <p className="text-muted-foreground text-sm">Select a field to get AI-powered recommendations</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Recommendations
        </h3>
        {recommendations && (
          <Button
            variant="ghost"
            size="sm"
            onClick={generateRecommendations}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>

      {!recommendations && !loading && !error && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Get personalized farming recommendations based on NDVI and weather data
          </p>
          <Button onClick={generateRecommendations} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Recommendations
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Analyzing field data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRecommendations}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      )}

      {recommendations && !loading && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {recommendations}
          </div>
        </div>
      )}
    </div>
  );
}
