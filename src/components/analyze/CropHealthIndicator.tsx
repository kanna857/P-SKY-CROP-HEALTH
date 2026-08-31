import { getCropSpecificNDVICategory, getCropOptimalRange, CROP_NDVI_THRESHOLDS } from '@/lib/cropThresholds';
import { Info, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CropHealthIndicatorProps {
  ndvi: number;
  crop: string;
  showDetails?: boolean;
}

export function CropHealthIndicator({ ndvi, crop, showDetails = true }: CropHealthIndicatorProps) {
  const category = getCropSpecificNDVICategory(ndvi, crop);
  const range = getCropOptimalRange(crop);
  const threshold = CROP_NDVI_THRESHOLDS[crop];
  
  // Calculate position on the gauge (0-100%)
  const gaugePosition = Math.min(100, Math.max(0, ((ndvi - range.min) / (range.max - range.min)) * 100));
  const optimalPosition = ((range.optimal - range.min) / (range.max - range.min)) * 100;
  
  const getStatusIcon = () => {
    if (category.label === 'Excellent') return <CheckCircle2 className="w-4 h-4 text-ndvi-excellent" />;
    if (category.label === 'Healthy') return <TrendingUp className="w-4 h-4 text-ndvi-healthy" />;
    if (category.label === 'Moderate') return <Info className="w-4 h-4 text-ndvi-moderate" />;
    return <AlertTriangle className="w-4 h-4 text-ndvi-critical" />;
  };

  return (
    <div className="space-y-3">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={cn('font-semibold', category.color)}>{category.label}</span>
          <span className="text-muted-foreground text-sm">for {crop}</span>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>{category.percentageOfOptimal}% of optimal</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{threshold?.growthNote || 'Monitor based on visual inspection'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Visual gauge */}
      <div className="relative h-6 rounded-full bg-secondary/50 overflow-hidden">
        {/* Gradient background showing zones */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-ndvi-critical/30" />
          <div className="flex-1 bg-ndvi-moderate/30" />
          <div className="flex-1 bg-ndvi-healthy/30" />
          <div className="flex-1 bg-ndvi-excellent/30" />
        </div>
        
        {/* Optimal marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
          style={{ left: `${optimalPosition}%` }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-primary whitespace-nowrap">
            Optimal
          </div>
        </div>
        
        {/* Current position marker */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-background shadow-lg z-20 transition-all duration-500"
          style={{ left: `calc(${gaugePosition}% - 8px)` }}
        />
      </div>

      {/* Range labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Stressed</span>
        <span>Moderate</span>
        <span>Healthy</span>
        <span>Excellent</span>
      </div>

      {showDetails && (
        <>
          {/* Thresholds info */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center p-2 rounded-lg bg-secondary/30">
              <div className="text-xs text-muted-foreground">Stressed</div>
              <div className="text-sm font-mono text-ndvi-critical">&lt; {category.thresholds.moderate.toFixed(2)}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-secondary/30">
              <div className="text-xs text-muted-foreground">Healthy</div>
              <div className="text-sm font-mono text-ndvi-healthy">≥ {category.thresholds.healthy.toFixed(2)}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-secondary/30">
              <div className="text-xs text-muted-foreground">Excellent</div>
              <div className="text-sm font-mono text-ndvi-excellent">≥ {category.thresholds.excellent.toFixed(2)}</div>
            </div>
          </div>

          {/* Crop note */}
          <p className="text-sm text-muted-foreground italic border-l-2 border-primary/50 pl-3">
            {category.cropNote}
          </p>
        </>
      )}
    </div>
  );
}
