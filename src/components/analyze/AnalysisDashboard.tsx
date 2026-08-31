import { DemoField, NDVIData } from '@/lib/types';
import { getCropSpecificNDVICategory } from '@/lib/cropThresholds';
import { CropHealthIndicator } from '@/components/analyze/CropHealthIndicator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Droplets, Bug, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisDashboardProps {
  field: DemoField;
  data: NDVIData;
}

export function AnalysisDashboard({ field, data }: AnalysisDashboardProps) {
  const category = getCropSpecificNDVICategory(data.average, field.crop);

  const getTrendIcon = () => {
    const first = data.trend[0].ndvi;
    const last = data.trend[data.trend.length - 1].ndvi;
    const diff = last - first;

    if (diff > 0.05) return <TrendingUp className="w-4 h-4 text-success" />;
    if (diff < -0.05) return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  // Determine if stressed based on crop-specific thresholds
  const isStressed = category.label === 'Stressed' || category.label === 'Moderate';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">{field.name}</h2>
            <p className="text-muted-foreground">{field.crop} • {field.area} hectares</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Crop Health Score
            </div>
            <div className={cn('text-4xl font-bold font-mono flex items-baseline gap-1', category.color)}>
              {data.healthScore} <span className="text-xl text-muted-foreground font-sans">/ 100</span>
            </div>

            <div className="mt-3 text-xs text-muted-foreground bg-secondary/30 rounded-lg p-2 min-w-[200px]">
              <div className="font-semibold mb-1 text-foreground text-left">Based on:</div>
              <div className="flex justify-between items-center py-0.5">
                <span>NDVI</span>
                <span className="font-mono text-foreground flex items-center gap-1">
                  {data.average.toFixed(2)} <span className={cn('text-[10px]', category.color)}>({category.label})</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>Disease probability</span>
                <span className="font-mono text-foreground">{data.diseaseProbability}%</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>Weather risk</span>
                <span className="font-mono text-foreground">{data.weatherRisk}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crop-Specific Health Indicator */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-lg font-semibold mb-4">Crop-Specific Health Assessment</h3>
        <CropHealthIndicator ndvi={data.average} crop={field.crop} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-success">{data.healthyPercentage}%</div>
          <div className="text-sm text-muted-foreground">Healthy Area</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-warning">{data.moderatePercentage}%</div>
          <div className="text-sm text-muted-foreground">Moderate</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-destructive">{data.stressedPercentage}%</div>
          <div className="text-sm text-muted-foreground">Stressed</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold">Health Trend (4 Weeks)</h3>
          {getTrendIcon()}
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 18%)" />
              <XAxis
                dataKey="week"
                stroke="hsl(215 20% 65%)"
                fontSize={12}
              />
              <YAxis
                domain={[0, 1]}
                stroke="hsl(215 20% 65%)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222 47% 10%)',
                  border: '1px solid hsl(222 47% 18%)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(210 40% 98%)' }}
              />
              <Line
                type="monotone"
                dataKey="ndvi"
                stroke="hsl(160 84% 39%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(160 84% 39%)', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'hsl(160 84% 39%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Quick Actions - now based on crop-specific thresholds */}
      {isStressed && (
        <div className="glass-card p-6 rounded-xl bg-warning/5 border border-warning/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-display font-semibold text-warning">Suggested Actions for {field.crop}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50">
              <Droplets className="w-4 h-4 text-primary" />
              <span className="text-sm">Check Irrigation</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50">
              <Bug className="w-4 h-4 text-warning" />
              <span className="text-sm">Inspect for Pests</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
