import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DEMO_FIELDS, generateNDVIData } from '@/lib/types';
import { getCropSpecificNDVICategory } from '@/lib/cropThresholds';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  Leaf,
  MapPin,
  GitCompare,
  Sparkles,
  Activity,
  Droplets,
  Sun,
  ShieldCheck,
  Zap,
  Satellite
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DashboardPage = () => {
  const fieldsData = DEMO_FIELDS.map((field) => ({
    ...field,
    analysis: generateNDVIData(field.ndvi),
  }));

  const averageNDVI = DEMO_FIELDS.reduce((acc, f) => acc + f.ndvi, 0) / DEMO_FIELDS.length;
  const alertCount = DEMO_FIELDS.filter((f) => {
    const category = getCropSpecificNDVICategory(f.ndvi, f.crop);
    return category.label === 'Stressed' || category.label === 'Moderate';
  }).length;
  const totalArea = DEMO_FIELDS.reduce((acc, f) => acc + f.area, 0);

  // Prepare chart data
  const weeklyTrend = [
    { week: 'Week 1', average: 0.58, peak: 0.72 },
    { week: 'Week 2', average: 0.64, peak: 0.78 },
    { week: 'Week 3', average: 0.69, peak: 0.82 },
    { week: 'Week 4', average: averageNDVI, peak: 0.88 },
  ];

  const fieldComparison = DEMO_FIELDS.map((f) => {
    const category = getCropSpecificNDVICategory(f.ndvi, f.crop);
    return {
      name: f.name.replace('Field', '').trim(),
      ndvi: f.ndvi,
      crop: f.crop,
      fill:
        category.label === 'Excellent'
          ? '#10b981'
          : category.label === 'Healthy'
          ? '#06b6d4'
          : category.label === 'Moderate'
          ? '#f59e0b'
          : '#ef4444',
    };
  });

  const healthDistribution = [
    { name: 'Optimal Vigor', value: 55, fill: '#10b981' },
    { name: 'Moderate Stress', value: 30, fill: '#f59e0b' },
    { name: 'Critical Alert', value: 15, fill: '#ef4444' },
  ];

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Header with Nature Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0c1422]/90 via-[#0a1829]/90 to-[#0c1422]/90 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 font-mono uppercase">
              <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} /> Real-Time Telemetry Feed
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              Farm Operations Telemetry Dashboard
            </h1>
            <p className="text-xs text-gray-300">
              Multi-spectral satellite vigor indices, crop stress telemetry, and active block diagnostic tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/analyze">
              <Button variant="outline" className="gap-2 text-xs font-bold border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/30 rounded-2xl">
                <Satellite className="w-4 h-4" />
                Live Satellite Map
              </Button>
            </Link>

            <Link to="/compare">
              <Button className="gap-2 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-lg rounded-2xl">
                <GitCompare className="w-4 h-4" />
                Compare Blocks
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Multi-Color Glowing Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Emerald Average NDVI */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#0c1422] to-[#0c1422] border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:border-emerald-500/60 hover:-translate-y-1 transition-all group backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Leaf className="w-5 h-5 animate-leaf-sway" />
              </div>
              <Badge className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                Canopy Peak
              </Badge>
            </div>
            <div className="font-display text-2xl md:text-3xl font-extrabold text-white font-mono">
              {averageNDVI.toFixed(2)}
            </div>
            <div className="text-xs text-emerald-300/80 mt-1 font-medium">Average NDVI Chlorophyll</div>
          </div>

          {/* Card 2: Cyan Active Farm Plots */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-[#081524] to-[#081524] border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:border-cyan-500/60 hover:-translate-y-1 transition-all group backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <MapPin className="w-5 h-5" />
              </div>
              <Badge className="text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border-cyan-500/40">
                Active Telemetry
              </Badge>
            </div>
            <div className="font-display text-2xl md:text-3xl font-extrabold text-white font-mono">
              {DEMO_FIELDS.length}
            </div>
            <div className="text-xs text-cyan-300/80 mt-1 font-medium">Monitored Farm Plots</div>
          </div>

          {/* Card 3: Amber Total Area */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-[#1a1309] to-[#1a1309] border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:border-amber-500/60 hover:-translate-y-1 transition-all group backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border-amber-500/40">
                Acreage
              </Badge>
            </div>
            <div className="font-display text-2xl md:text-3xl font-extrabold text-white font-mono">
              {totalArea.toFixed(1)} ha
            </div>
            <div className="text-xs text-amber-300/80 mt-1 font-medium">Total Monitored Area</div>
          </div>

          {/* Card 4: Rose Attention Required */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950/40 via-[#1a0c14] to-[#1a0c14] border border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.15)] hover:border-rose-500/60 hover:-translate-y-1 transition-all group backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <Badge className="text-[10px] font-bold bg-rose-500/20 text-rose-400 border-rose-500/40">
                Action Alert
              </Badge>
            </div>
            <div className="font-display text-2xl md:text-3xl font-extrabold text-rose-400 font-mono">
              {alertCount}
            </div>
            <div className="text-xs text-rose-300/80 mt-1 font-medium">Active Stress Alerts</div>
          </div>
        </div>

        {/* Dynamic Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 7 Cols: Multi-Gradient Weekly Area Chart */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0c1422]/90 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Multi-Week NDVI Vigor & Peak Absorption Progression
              </h3>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                Sentinel-2 Telemetry
              </Badge>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend}>
                  <defs>
                    <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} />
                  <YAxis domain={[0, 1]} stroke="#9ca3af" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#080d18',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: '16px',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="peak"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#peakGradient)"
                    name="Peak Zone NDVI"
                  />
                  <Area
                    type="monotone"
                    dataKey="average"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#ndviGradient)"
                    name="Field Average NDVI"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5 Cols: Health Distribution Pie Chart */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0c1422]/90 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                Canopy Health Distribution
              </h3>
              <span className="text-[10px] text-gray-400 font-mono">100% Coverage</span>
            </div>

            <div className="h-64 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#080d18',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '16px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white font-mono">85%</span>
                <span className="text-[10px] text-emerald-400 font-medium uppercase">Productive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monitored Fields Grid */}
        <div className="p-6 rounded-3xl bg-[#0c1422]/90 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Monitored Field Plots & Multi-Spectral Status
            </h3>
            <span className="text-xs text-gray-400 font-mono">5 Demo Plots Live</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_FIELDS.map((field) => {
              const category = getCropSpecificNDVICategory(field.ndvi, field.crop);

              return (
                <div
                  key={field.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all space-y-3 hover:-translate-y-1 group shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {field.name}
                      </h4>
                      <p className="text-xs text-gray-400">{field.crop} • {field.area} ha</p>
                    </div>
                    <Badge className={cn('text-[10px] font-bold shadow-sm', category.bgColor, category.color)}>
                      {category.label}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Vegetation Index:</span>
                      <span className="font-bold text-emerald-400 font-mono">NDVI {field.ndvi.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                        style={{ width: `${Math.min(100, field.ndvi * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Yield Potential:</span>
                    <span className="font-semibold text-white">
                      {field.ndvi > 0.65 ? 'High (85-95%)' : field.ndvi > 0.45 ? 'Moderate (65-80%)' : 'Sub-Optimal'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
