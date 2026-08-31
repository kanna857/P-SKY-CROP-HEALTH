import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DEMO_FIELDS, DemoField } from '@/lib/types';
import { FieldComparisonCard } from '@/components/compare/FieldComparisonCard';
import { ComparisonCharts } from '@/components/compare/ComparisonCharts';
import { calculatePriorityScore } from '@/lib/cropThresholds';
import { GitCompare, Plus, X, ChevronDown, Sparkles, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const CompareFieldsPage = () => {
  const [selectedFields, setSelectedFields] = useState<DemoField[]>([
    DEMO_FIELDS[0],
    DEMO_FIELDS[1],
  ]);

  const handleFieldToggle = (field: DemoField) => {
    const isSelected = selectedFields.some(f => f.id === field.id);
    
    if (isSelected) {
      if (selectedFields.length > 1) {
        setSelectedFields(selectedFields.filter(f => f.id !== field.id));
      }
    } else {
      if (selectedFields.length < 4) {
        setSelectedFields([...selectedFields, field]);
      }
    }
  };

  const removeField = (fieldId: string) => {
    if (selectedFields.length > 1) {
      setSelectedFields(selectedFields.filter(f => f.id !== fieldId));
    }
  };

  // Sort selected fields by priority for ranking
  const rankedFields = [...selectedFields].sort((a, b) => {
    const priorityA = calculatePriorityScore(a.ndvi, a.crop, a.area);
    const priorityB = calculatePriorityScore(b.ndvi, b.crop, b.area);
    return priorityB - priorityA;
  });

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Header with Nature Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 font-mono uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Multi-Block Comparative Health
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 animate-leaf-sway">
                <GitCompare className="w-6 h-6" />
              </div>
              Compare Farm <span className="text-emerald-400 font-extrabold">Fields</span>
            </h1>

            <p className="text-xs md:text-sm text-gray-300">
              Compare multiple agricultural zones side-by-side to prioritize irrigation, fertilization, and crop protection treatments.
            </p>
          </div>

          {/* Active Compared Fields Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2 relative z-10">
            <span className="text-xs text-gray-400">Selected Zones:</span>
            
            {selectedFields.map(field => (
              <div 
                key={field.id}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-white shadow-sm"
              >
                <span>{field.name}</span>
                {selectedFields.length > 1 && (
                  <button 
                    onClick={() => removeField(field.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {selectedFields.length < 4 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-full border-white/20 hover:border-emerald-500/40">
                    <Plus className="w-3.5 h-3.5" />
                    Add Zone
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto bg-[#0c1420] border-white/10 text-white">
                  {DEMO_FIELDS.map(field => {
                    const isSelected = selectedFields.some(f => f.id === field.id);
                    return (
                      <DropdownMenuCheckboxItem
                        key={field.id}
                        checked={isSelected}
                        onCheckedChange={() => handleFieldToggle(field)}
                        className="text-xs"
                      >
                        {field.name}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rankedFields.map((field, index) => (
            <FieldComparisonCard
              key={field.id}
              field={field}
              rank={index + 1}
              isPriority={index === 0}
            />
          ))}
        </div>

        {/* Detailed Analytics Charts */}
        <div className="p-6 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl">
          <ComparisonCharts fields={selectedFields} />
        </div>
      </div>
    </Layout>
  );
};

export default CompareFieldsPage;
