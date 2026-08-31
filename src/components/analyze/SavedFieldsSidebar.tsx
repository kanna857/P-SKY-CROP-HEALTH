import { SavedField, DEMO_FIELDS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Bookmark, X, MapPin, Sparkles, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNDVICategory } from '@/lib/types';

interface SavedFieldsSidebarProps {
  onSelectField: (field: SavedField) => void;
  selectedFieldId?: string;
  savedFields: SavedField[];
  removeField: (fieldId: string) => void;
}

export function SavedFieldsSidebar({ onSelectField, selectedFieldId, savedFields, removeField }: SavedFieldsSidebarProps) {
  return (
    <div className="glass-card p-5 rounded-2xl border-border/50 shadow-md">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-display text-sm font-bold flex items-center gap-2 text-foreground">
          <Bookmark className="w-4 h-4 text-primary" />
          Field Bookmarks {savedFields.length > 0 && `(${savedFields.length})`}
        </h3>
        {savedFields.length > 0 && (
          <span className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </div>

      {savedFields.length === 0 ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Click <strong className="text-primary">"Save Field"</strong> above to pin your analyzed fields here for quick switching.
          </p>

          <div className="pt-2 border-t border-border/40">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-2">
              <Sparkles className="w-3 h-3 text-primary" /> Quick Demo Farms
            </span>

            <div className="space-y-1.5">
              {DEMO_FIELDS.slice(0, 3).map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => onSelectField({
                    id: demo.id,
                    name: demo.name,
                    lat: demo.lat,
                    lng: demo.lng,
                    area: demo.area,
                    cropType: demo.cropType,
                    ndvi: demo.ndvi,
                    savedAt: new Date().toISOString()
                  })}
                  className="w-full text-left p-2 rounded-xl bg-secondary/30 hover:bg-primary/10 border border-border/40 hover:border-primary/40 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {demo.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {demo.cropType} • {demo.area} ha
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary shrink-0 ml-2">
                    NDVI {demo.ndvi.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-hide">
          {savedFields.map((field) => {
            const category = getNDVICategory(field.ndvi);
            const isSelected = selectedFieldId === field.id;

            return (
              <div
                key={field.id}
                className={cn(
                  'group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 border',
                  'bg-secondary/30 hover:bg-secondary/60 border-border/40',
                  isSelected && 'border-primary bg-primary/10 shadow-sm'
                )}
                onClick={() => onSelectField(field)}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn('w-1.5 h-7 rounded-full shrink-0', category.bgColor)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate text-xs">{field.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" /> {field.cropType || 'Crop Field'}
                      </span>
                      <span>•</span>
                      <span className={cn('font-bold', category.color)}>NDVI {field.ndvi.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md hover:bg-destructive/20 hover:text-destructive transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeField(field.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
