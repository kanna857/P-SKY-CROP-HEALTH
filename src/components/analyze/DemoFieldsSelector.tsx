import { DemoField, DEMO_FIELDS, getNDVICategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MapPin, Wheat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoFieldsSelectorProps {
  selectedField: DemoField | null;
  onSelect: (field: DemoField) => void;
}

export function DemoFieldsSelector({ selectedField, onSelect }: DemoFieldsSelectorProps) {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
        <Wheat className="w-5 h-5 text-primary" />
        Demo Farms
      </h3>
      
      <div className="space-y-3">
        {DEMO_FIELDS.map((field) => {
          const category = getNDVICategory(field.ndvi);
          const isSelected = selectedField?.id === field.id;
          
          return (
            <button
              key={field.id}
              onClick={() => onSelect(field)}
              className={cn(
                'w-full p-4 rounded-lg text-left transition-all duration-300',
                'bg-secondary/30 hover:bg-secondary/50 border border-transparent',
                isSelected && 'border-primary bg-primary/10'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{field.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {field.crop} • {field.area} ha
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn('text-lg font-bold font-mono', category.color)}>
                    {field.ndvi.toFixed(2)}
                  </div>
                  <div className={cn('text-xs', category.color)}>
                    {category.label}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
