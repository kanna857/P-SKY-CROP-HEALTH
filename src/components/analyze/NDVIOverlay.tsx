import { DemoField, getNDVICategory } from '@/lib/types';

interface NDVIOverlayProps {
  field: DemoField;
}

export function NDVIOverlay({ field }: NDVIOverlayProps) {
  const category = getNDVICategory(field.ndvi);
  
  // Generate mock NDVI grid
  const gridSize = 8;
  const generateCell = (baseNDVI: number) => {
    const variation = (Math.random() - 0.5) * 0.3;
    return Math.max(0, Math.min(1, baseNDVI + variation));
  };

  const getCellColor = (ndvi: number) => {
    if (ndvi >= 0.7) return 'bg-ndvi-excellent';
    if (ndvi >= 0.5) return 'bg-ndvi-healthy';
    if (ndvi >= 0.3) return 'bg-ndvi-moderate';
    return 'bg-ndvi-critical';
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">NDVI Visualization</h3>
        <div className="text-sm text-muted-foreground">
          Analysis Date: {field.lastAnalysis}
        </div>
      </div>

      {/* Field Name */}
      <div className="mb-4 p-3 rounded-lg bg-secondary/30">
        <p className="text-sm text-muted-foreground">Field</p>
        <p className="font-semibold text-foreground">{field.name}</p>
      </div>

      {/* NDVI Grid Visualization */}
      <div className="aspect-square rounded-lg overflow-hidden border border-border mb-4">
        <div 
          className="grid gap-0.5 h-full w-full p-1 bg-background/50"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const cellNDVI = generateCell(field.ndvi);
            return (
              <div
                key={i}
                className={`${getCellColor(cellNDVI)} rounded-sm transition-all duration-300 hover:scale-105`}
                title={`NDVI: ${cellNDVI.toFixed(2)}`}
              />
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground mb-2">Legend</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-ndvi-critical" />
            <span className="text-xs text-muted-foreground">Stressed (0-0.3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-ndvi-moderate" />
            <span className="text-xs text-muted-foreground">Moderate (0.3-0.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-ndvi-healthy" />
            <span className="text-xs text-muted-foreground">Healthy (0.5-0.7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-ndvi-excellent" />
            <span className="text-xs text-muted-foreground">Very Healthy (0.7-1.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
