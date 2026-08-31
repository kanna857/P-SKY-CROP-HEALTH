import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Ruler } from 'lucide-react';

interface AreaRangeSelectorProps {
    value: number[];
    onChange: (value: number[]) => void;
}

export function AreaRangeSelector({ value, onChange }: AreaRangeSelectorProps) {

    return (
        <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-primary" />
                    Affected Area Range
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm">Range: {value[0]} hectare(s)</Label>
                    <div className="flex items-center justify-center py-2">
                        <div
                            className="rounded-full border-2 border-primary/60 bg-primary/10 transition-all duration-300 flex items-center justify-center"
                            style={{
                                width: `${Math.max(24, Math.min(160, 24 + (value[0] / 100) * 136))}px`,
                                height: `${Math.max(24, Math.min(160, 24 + (value[0] / 100) * 136))}px`,
                            }}
                        >
                            <span className="text-[10px] font-semibold text-primary">{value[0]} ha</span>
                        </div>
                    </div>
                    <Slider min={0.1} max={100} step={0.1} value={value} onValueChange={onChange} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0.1 ha</span>
                        <span>100 ha</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
