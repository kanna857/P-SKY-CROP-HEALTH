import { useState } from 'react';
import { LesionSpot } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Flame, Eye, EyeOff, Sparkles, Activity } from 'lucide-react';

interface LesionSvgOverlayProps {
  spots: LesionSpot[];
  enabled?: boolean;
}

export function LesionSvgOverlay({ spots, enabled = true }: LesionSvgOverlayProps) {
  const [hoveredSpot, setHoveredSpot] = useState<LesionSpot | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'moderate'>('all');
  const [showLabels, setShowLabels] = useState(true);

  if (!enabled || !spots || spots.length === 0) {
    return null;
  }

  const filteredSpots = spots.filter((spot) => {
    if (filterSeverity === 'high') return spot.severity_score >= 7.0;
    if (filterSeverity === 'moderate') return spot.severity_score >= 4.5;
    return true;
  });

  const getSpotColor = (score: number) => {
    // NO RED: Use high-visibility Amber, Gold, and Cyan/Emerald
    if (score >= 7.5) return { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.10)', ring: '#fbbf24' };
    if (score >= 5.0) return { stroke: '#eab308', fill: 'rgba(234, 179, 8, 0.08)', ring: '#fde047' };
    return { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.08)', ring: '#34d399' };
  };

  return (
    <div className="absolute inset-0 pointer-events-auto select-none">
      {/* Interactive SVG Layer */}
      <svg
        className="w-full h-full absolute inset-0 z-20"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow-high" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {filteredSpots.map((spot) => {
          const colors = getSpotColor(spot.severity_score);
          const cx = Math.min(960, Math.max(40, spot.cx_norm * 1000));
          const cy = Math.min(960, Math.max(40, spot.cy_norm * 1000));
          // Clamped tightly so no giant circle covers the leaf or goes outside
          const rx = Math.min(32, Math.max(7, (spot.w_norm * 1000) / 2));
          const ry = Math.min(32, Math.max(7, (spot.h_norm * 1000) / 2));
          const isHovered = hoveredSpot?.id === spot.id;

          return (
            <g
              key={`spot-${spot.id}`}
              className="cursor-pointer transition-transform duration-150"
              onMouseEnter={() => setHoveredSpot(spot)}
              onMouseLeave={() => setHoveredSpot(null)}
              onClick={() => setHoveredSpot(spot)}
            >
              {/* Outer Pulse Ring for High Severity spots */}
              {spot.severity_score >= 7.0 && (
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={rx + 4}
                  ry={ry + 4}
                  fill="none"
                  stroke={colors.ring}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  opacity={isHovered ? 0.9 : 0.6}
                  className="animate-pulse"
                />
              )}

              {/* Lesion Component Ellipse */}
              <ellipse
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={isHovered ? 'rgba(255, 255, 255, 0.4)' : colors.fill}
                stroke={isHovered ? '#ffffff' : colors.stroke}
                strokeWidth={isHovered ? 3 : 2}
                filter={spot.severity_score >= 7.0 ? 'url(#glow-high)' : undefined}
                className="transition-all duration-200"
              />

              {/* Center Anchor Point */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 4 : 2.5}
                fill={isHovered ? '#ffffff' : colors.stroke}
              />

              {/* ID Label tag if enabled */}
              {showLabels && (
                <text
                  x={cx}
                  y={Math.max(16, cy - ry - 4)}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="18"
                  fontWeight="bold"
                  filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))"
                  className="pointer-events-none select-none font-mono"
                >
                  #{spot.id}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Rich Tooltip on Hover / Touch */}
      {hoveredSpot && (
        <div
          className="absolute z-30 transition-all duration-150 pointer-events-none"
          style={{
            left: `${Math.min(78, Math.max(8, hoveredSpot.cx_norm * 100))}%`,
            top: `${Math.min(72, Math.max(10, (hoveredSpot.cy_norm * 100) - 18))}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="bg-[#0c1422]/95 backdrop-blur-xl border border-white/20 p-3.5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] text-white text-xs space-y-1.5 min-w-[210px] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400 font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Lesion Spot #{hoveredSpot.id}
              </span>
              <Badge
                className={`text-[9px] font-bold px-1.5 py-0 ${
                  hoveredSpot.severity_score >= 7.0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : hoveredSpot.severity_score >= 5.0
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                Severity {hoveredSpot.severity_score}/10
              </Badge>
            </div>

            <div className="space-y-1 text-[11px] font-mono text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Lesion Area:</span>
                <span className="font-bold text-white">
                  {hoveredSpot.area_px} px ({hoveredSpot.area_pct}%)
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Necrotic Index:</span>
                <span
                  className={`font-semibold ${
                    hoveredSpot.necrotic_index.includes('High')
                      ? 'text-amber-400'
                      : hoveredSpot.necrotic_index.includes('Moderate')
                      ? 'text-yellow-300'
                      : 'text-emerald-300'
                  }`}
                >
                  {hoveredSpot.necrotic_index}
                </span>
              </div>

              <div className="flex justify-between text-[10px] text-gray-400 pt-0.5">
                <span>Coordinates:</span>
                <span>
                  X:{hoveredSpot.x} Y:{hoveredSpot.y} ({hoveredSpot.width}×{hoveredSpot.height})
                </span>
              </div>
            </div>

            <div className="text-[10px] text-emerald-400/90 font-medium bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1 mt-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              Connected Component Pathology
            </div>
          </div>
        </div>
      )}

      {/* Lesion Pathology Quick Controls Bar in Bottom Left of image */}
      <div className="absolute bottom-2.5 left-2.5 z-20 flex flex-wrap items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px]">
        <div className="flex items-center gap-1 text-gray-300 font-mono pr-1 border-r border-white/15">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>{filteredSpots.length} Spots</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setFilterSeverity(filterSeverity === 'all' ? 'high' : filterSeverity === 'high' ? 'moderate' : 'all');
          }}
          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
            filterSeverity === 'all'
              ? 'bg-white/10 text-white'
              : filterSeverity === 'high'
              ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
              : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
          }`}
          title="Filter lesion severity"
        >
          {filterSeverity === 'all' ? 'All' : filterSeverity === 'high' ? 'High Only' : 'Mod+High'}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowLabels(!showLabels);
          }}
          className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          title={showLabels ? 'Hide spot labels' : 'Show spot labels'}
        >
          {showLabels ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
        </button>
      </div>
    </div>
  );
}
