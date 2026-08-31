import { DemoField, generateNDVIData } from '@/lib/types';
import { getCropSpecificNDVICategory, calculatePriorityScore } from '@/lib/cropThresholds';
import { CropHealthIndicator } from '@/components/analyze/CropHealthIndicator';
import { TrendingUp, TrendingDown, Minus, MapPin, Crop, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldComparisonCardProps {
  field: DemoField;
  rank?: number;
  showPriority?: boolean;
}

export function FieldComparisonCard({ field, rank, showPriority = true }: FieldComparisonCardProps) {
  const category = getCropSpecificNDVICategory(field.ndvi, field.crop);
  const ndviData = generateNDVIData(field.ndvi);
  const priorityScore = calculatePriorityScore(field.ndvi, field.crop, field.area);
  
  const getTrendInfo = () => {
    const first = ndviData.trend[0].ndvi;
    const last = ndviData.trend[ndviData.trend.length - 1].ndvi;
    const diff = last - first;
    
    if (diff > 0.05) return { icon: TrendingUp, label: 'Improving', color: 'text-success' };
    if (diff < -0.05) return { icon: TrendingDown, label: 'Declining', color: 'text-destructive' };
    return { icon: Minus, label: 'Stable', color: 'text-muted-foreground' };
  };
  
  const trend = getTrendInfo();
  const TrendIcon = trend.icon;

  return (
    <div className="glass-card p-5 rounded-xl space-y-4 relative">
      {/* Rank badge */}
      {rank !== undefined && (
        <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
          {rank}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">{field.name}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Crop className="w-3.5 h-3.5" />
              {field.crop}
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5" />
              {field.area} ha
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className={cn('text-3xl font-bold font-mono', category.color)}>
            {field.ndvi.toFixed(2)}
          </div>
          <div className={cn('text-sm font-medium', category.color)}>
            {category.label}
          </div>
        </div>
      </div>

      {/* Crop-specific health indicator */}
      <CropHealthIndicator ndvi={field.ndvi} crop={field.crop} showDetails={false} />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2 rounded-lg bg-success/10">
          <div className="text-lg font-bold text-success">{ndviData.healthyPercentage}%</div>
          <div className="text-xs text-muted-foreground">Healthy</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-warning/10">
          <div className="text-lg font-bold text-warning">{ndviData.moderatePercentage}%</div>
          <div className="text-xs text-muted-foreground">Moderate</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-destructive/10">
          <div className="text-lg font-bold text-destructive">{ndviData.stressedPercentage}%</div>
          <div className="text-xs text-muted-foreground">Stressed</div>
        </div>
      </div>

      {/* Trend and Priority */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <div className="flex items-center gap-2">
          <TrendIcon className={cn('w-4 h-4', trend.color)} />
          <span className={cn('text-sm', trend.color)}>{trend.label}</span>
        </div>
        
        {showPriority && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Priority Score:</span>
            <div className={cn(
              'px-2 py-0.5 rounded-full text-sm font-medium',
              priorityScore >= 50 ? 'bg-destructive/20 text-destructive' :
              priorityScore >= 30 ? 'bg-warning/20 text-warning' :
              'bg-success/20 text-success'
            )}>
              {priorityScore}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
