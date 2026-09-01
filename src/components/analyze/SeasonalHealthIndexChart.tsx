import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  Dot,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  AlertTriangle,
  History,
  Calendar,
  Sparkles,
  CheckCircle2,
  Sliders,
  Info
} from 'lucide-react';

interface SeasonalHealthIndexChartProps {
  crop?: string;
  fieldId?: string;
}

export function SeasonalHealthIndexChart({ crop = 'Field Crop', fieldId }: SeasonalHealthIndexChartProps) {
  const [showBaselineEnvelope, setShowBaselineEnvelope] = useState(true);
  const [showAnomalies, setShowAnomalies] = useState(true);

  // Generate 16 weeks of crop season data (Current vs 3-Year Historical Baseline)
  const seasonData = useMemo(() => {
    const weeks = [];
    const totalWeeks = 14;

    for (let w = 1; w <= totalWeeks; w++) {
      // Normal bell-shaped growth curve for crop
      const progress = w / totalWeeks;
      const baselineAvg = Math.sin(progress * Math.PI * 0.9) * 0.58 + 0.24;
      const baselineMin = Math.max(0.18, baselineAvg - 0.08);
      const baselineMax = Math.min(0.92, baselineAvg + 0.08);

      // Current season: normal until week 6-8 where an anomaly occurs (pest/drought), then recovery
      let currentNdvi = baselineAvg + (Math.sin(w * 1.5) * 0.03);
      let hasAnomaly = false;
      let anomalyReason = '';

      if (w === 6) {
        currentNdvi = baselineAvg - 0.12; // early blight or moisture stress onset
        hasAnomaly = true;
        anomalyReason = 'Foliar Early Blight lesion outbreak (14% below baseline)';
      } else if (w === 7) {
        currentNdvi = baselineAvg - 0.15;
        hasAnomaly = true;
        anomalyReason = 'Peak vegetative stress; fungicide spraying initiated';
      } else if (w === 8) {
        currentNdvi = baselineAvg - 0.06; // recovering
      } else if (w >= 9) {
        currentNdvi = baselineAvg + 0.04; // post-treatment rebound
      }

      weeks.push({
        week: `W${w}`,
        weekNum: w,
        baselineAvg: parseFloat(baselineAvg.toFixed(2)),
        baselineMin: parseFloat(baselineMin.toFixed(2)),
        baselineMax: parseFloat(baselineMax.toFixed(2)),
        currentNdvi: parseFloat(currentNdvi.toFixed(2)),
        hasAnomaly,
        anomalyReason,
        deltaPct: parseFloat((((currentNdvi - baselineAvg) / baselineAvg) * 100).toFixed(1)),
      });
    }

    return weeks;
  }, [crop, fieldId]);

  const anomalyCount = seasonData.filter((d) => d.hasAnomaly).length;

  return (
    <div className="p-6 rounded-3xl bg-[#0a121e]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              Seasonal Crop Health Baseline & Anomaly Index
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]">
                3-Year Historical Engine
              </Badge>
            </h3>
            <p className="text-xs text-gray-400">
              Compare this season's growth trajectory against 3-year historical baseline to flag early deviations
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBaselineEnvelope(!showBaselineEnvelope)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold border transition-all ${
              showBaselineEnvelope
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-black/40 text-gray-500 border-white/10'
            }`}
          >
            📊 Baseline Envelope
          </button>

          <button
            onClick={() => setShowAnomalies(!showAnomalies)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold border transition-all ${
              showAnomalies
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-black/40 text-gray-500 border-white/10'
            }`}
          >
            ⚠️ Flag Anomalies ({anomalyCount})
          </button>
        </div>
      </div>

      {/* Recharts Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={seasonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="envelopeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#0284c7" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />

            <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} tickLine={false} />
            <YAxis
              domain={[0.1, 1.0]}
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => v.toFixed(2)}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const point = payload[0].payload;
                return (
                  <div className="p-3.5 rounded-2xl bg-[#080d18]/95 backdrop-blur-xl border border-white/20 shadow-2xl text-white text-xs space-y-2 min-w-[210px]">
                    <div className="font-bold flex items-center justify-between border-b border-white/10 pb-1.5 font-mono">
                      <span className="text-emerald-400">Week {point.weekNum} Progression</span>
                      {point.hasAnomaly ? (
                        <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[9px]">
                          Anomaly Alert
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[9px]">
                          On Target
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between items-center text-emerald-400">
                        <span>Current Season NDVI:</span>
                        <span className="font-bold">{point.currentNdvi}</span>
                      </div>
                      <div className="flex justify-between items-center text-cyan-300">
                        <span>3-Yr Baseline Avg:</span>
                        <span className="font-bold">{point.baselineAvg}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-400">
                        <span>Historical Band:</span>
                        <span>{point.baselineMin} – {point.baselineMax}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-white/10">
                        <span>Variance:</span>
                        <span className={`font-bold ${point.deltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {point.deltaPct >= 0 ? '+' : ''}{point.deltaPct}%
                        </span>
                      </div>
                    </div>

                    {point.hasAnomaly && (
                      <div className="text-[10px] text-rose-300 pt-1 border-t border-white/10 leading-tight">
                        🚨 {point.anomalyReason}
                      </div>
                    )}
                  </div>
                );
              }}
            />

            {/* Shaded Historical Baseline Envelope Band */}
            {showBaselineEnvelope && (
              <Area
                dataKey="baselineMax"
                stroke="transparent"
                fill="url(#envelopeGrad)"
                name="3-Yr Normal Range"
              />
            )}

            {/* 3-Year Historical Baseline Average Curve (Dotted Cyan Line) */}
            <Line
              type="monotone"
              dataKey="baselineAvg"
              stroke="#06b6d4"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              name="3-Year Baseline Mean"
            />

            {/* Current Season Real Curve (Solid Emerald Line) */}
            <Line
              type="monotone"
              dataKey="currentNdvi"
              stroke="#10b981"
              strokeWidth={3}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (showAnomalies && payload.hasAnomaly) {
                  return (
                    <g key={`dot-${payload.week}`}>
                      <circle cx={cx} cy={cy} r={8} fill="rgba(239, 68, 68, 0.3)" className="animate-ping" />
                      <circle cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#ffffff" strokeWidth={1.5} />
                    </g>
                  );
                }
                return (
                  <circle
                    key={`dot-${payload.week}`}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                );
              }}
              name="Current Season NDVI"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Early Anomaly Diagnostic Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono">Current Trajectory</p>
            <p className="text-sm font-bold text-emerald-400 font-mono">+4.2% Above Average</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono">Detected Anomalies</p>
            <p className="text-sm font-bold text-rose-400 font-mono">2 Weeks (W6–W7 Resolved)</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono">Post-Spray Recovery</p>
            <p className="text-sm font-bold text-cyan-300 font-mono">100% Normalized at W9</p>
          </div>
        </div>
      </div>
    </div>
  );
}
