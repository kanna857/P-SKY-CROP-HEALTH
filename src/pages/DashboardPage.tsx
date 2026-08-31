import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DEMO_FIELDS, generateNDVIData } from '@/lib/types';
import { getCropSpecificNDVICategory } from '@/lib/cropThresholds';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, TrendingUp, AlertTriangle, Leaf, MapPin, GitCompare, Sparkles, Activity, Droplets, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DashboardPage = () => {
  // Generate mock data for all demo fields
  const fieldsData = DEMO_FIELDS.map(field => ({
    ...field,
    analysis: generateNDVIData(field.ndvi),
  }));

  const averageNDVI = DEMO_FIELDS.reduce((acc, f) => acc + f.ndvi, 0) / DEMO_FIELDS.length;
  // Count alerts based on crop-specific thresholds
  const alertCount = DEMO_FIELDS.filter(f => {
    const category = getCropSpecificNDVICategory(f.ndvi, f.crop);
    return category.label === 'Stressed' || category.label === 'Moderate';
  }).length;
  const totalArea = DEMO_FIELDS.reduce((acc, f) => acc + f.area, 0);

  // Prepare chart data
  const weeklyTrend = [
    { week: 'Week 1', average: 0.48 },
    { week: 'Week 2', average: 0.51 },
    { week: 'Week 3', average: 0.49 },
    { week: 'Week 4', average: averageNDVI },
  ];

  const fieldComparison = DEMO_FIELDS.map(f => {
    const category = getCropSpecificNDVICategory(f.ndvi, f.crop);
    return {
      name: f.name.split(' ')[0],
      ndvi: f.ndvi,
      fill: category.label === 'Excellent' ? 'hsl(142 76% 36%)' : 
            category.label === 'Healthy' ? 'hsl(142 71% 45%)' : 
            category.label === 'Moderate' ? 'hsl(45 93% 47%)' : 'hsl(0 72% 51%)',
    };
  });

  const healthDistribution = [
    { name: 'Healthy', value: 45, fill: '#10b981' },
    { name: 'Moderate', value: 35, fill: '#f59e0b' },
    { name: 'Stressed', value: 20, fill: '#ef4444' },
  ];

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Header with Nature Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 font-mono uppercase">
              <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} /> Real-Time Canopy Telemetry
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="w-7 h-7 text-emerald-400" />
              Farm Operations Dashboard
            </h1>
            <p className="text-xs text-gray-300">
              Overview of all active agricultural blocks with satellite NDVI vigor and stress indicators
            </p>
          </div>

          <Link to="/compare">
            <Button className="gap-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg rounded-xl">
              <GitCompare className="w-4 h-4" />
              Compare Field Blocks
            </Button>
          </Link>
        </div>

        {/* 4 Stats Grid with Nature Icons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-xl backdrop-blur-2xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform animate-leaf-sway">
                <Leaf className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                Canopy Average
              </Badge>
            </div>
            <div className="font-display text-2xl md:text-3xl font-bold text-white">{averageNDVI.toFixed(2)}</div>
            <div className="text-xs text-gray-400 mt-1">Average NDVI Index</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-xl backdrop-blur-2xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
                Monitored
              </Badge>
            </div>
            <div className="font-display text-2xl md:text-3xl font-bold text-white">{DEMO_FIELDS.length}</div>
            <div className="text-xs text-gray-400 mt-1">Active Farm Plots</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-xl backdrop-blur-2xl hover:border-yellow-500/40 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-[10px] text-yellow-400 border-yellow-500/30">
                Hectares
              </Badge>
            </div>
            <div className="font-display text-2xl md:text-3xl font-bold text-white">{totalArea.toFixed(1)} ha</div>
            <div className="text-xs text-gray-400 mt-1">Total Monitored Area</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-xl backdrop-blur-2xl hover:border-red-500/40 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <Badge variant="destructive" className="text-[10px]">
                Attention Required
              </Badge>
            </div>
            <div className="font-display text-2xl md:text-3xl font-bold text-red-400">{alertCount}</div>
            <div className="text-xs text-gray-400 mt-1">Stress Zone Alerts</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly NDVI Trend */}
          <div className="p-6 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Weekly NDVI Vigor Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} />
                  <YAxis domain={[0, 1]} stroke="#9ca3af" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1420',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 8, stroke: '#34d399', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Health Distribution */}
          <div className="p-6 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Canopy Health Distribution
            </h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1420',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Active Fields List */}
        <div className="p-6 rounded-2xl bg-[#0c1420]/80 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Monitored Field Plots & Vegetative Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_FIELDS.map((field) => {
              const category = getCropSpecificNDVICategory(field.ndvi, field.crop);

              return (
                <div
                  key={field.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all space-y-2 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{field.name}</h4>
                      <p className="text-xs text-gray-400">{field.crop} • {field.area} ha</p>
                    </div>
                    <Badge className={cn('text-[10px] font-bold', category.bgColor, category.color)}>
                      {category.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                    <span className="text-gray-400">Chlorophyll Index</span>
                    <span className="font-bold text-emerald-400 font-mono">NDVI {field.ndvi.toFixed(2)}</span>
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
