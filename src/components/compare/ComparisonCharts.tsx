import { DemoField, generateNDVIData } from '@/lib/types';
import { getCropSpecificNDVICategory, calculatePriorityScore, getCropOptimalRange } from '@/lib/cropThresholds';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  ReferenceLine, Cell
} from 'recharts';

interface ComparisonChartsProps {
  fields: DemoField[];
}

export function ComparisonCharts({ fields }: ComparisonChartsProps) {
  // Prepare bar chart data with optimal lines
  const barData = fields.map(field => {
    const category = getCropSpecificNDVICategory(field.ndvi, field.crop);
    const range = getCropOptimalRange(field.crop);
    return {
      name: field.name.split(' ')[0],
      fullName: field.name,
      ndvi: field.ndvi,
      optimal: range.optimal,
      fill: category.label === 'Excellent' ? 'hsl(142 76% 36%)' : 
            category.label === 'Healthy' ? 'hsl(142 71% 45%)' : 
            category.label === 'Moderate' ? 'hsl(45 93% 47%)' : 'hsl(0 72% 51%)',
    };
  });

  // Prepare radar chart data
  const radarData = fields.map(field => {
    const ndviData = generateNDVIData(field.ndvi);
    const category = getCropSpecificNDVICategory(field.ndvi, field.crop);
    const priorityScore = calculatePriorityScore(field.ndvi, field.crop, field.area);
    
    // Calculate trend score (0-100)
    const first = ndviData.trend[0].ndvi;
    const last = ndviData.trend[ndviData.trend.length - 1].ndvi;
    const trendScore = Math.min(100, Math.max(0, 50 + (last - first) * 200));
    
    return {
      field: field.name.split(' ')[0],
      'Health': category.percentageOfOptimal,
      'Healthy Area': ndviData.healthyPercentage,
      'Trend': trendScore,
      'Priority': 100 - priorityScore, // Invert so higher is better
    };
  });

  // Priority ranking table data
  const priorityData = fields.map(field => {
    const category = getCropSpecificNDVICategory(field.ndvi, field.crop);
    const priorityScore = calculatePriorityScore(field.ndvi, field.crop, field.area);
    return {
      ...field,
      category,
      priorityScore
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const COLORS = [
    'hsl(160 84% 39%)',
    'hsl(200 80% 50%)',
    'hsl(280 70% 50%)',
    'hsl(30 90% 50%)',
  ];

  return (
    <div className="space-y-6">
      {/* NDVI Comparison Bar Chart */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-lg font-semibold mb-4">NDVI Comparison with Crop-Optimal Thresholds</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 18%)" />
              <XAxis dataKey="name" stroke="hsl(215 20% 65%)" fontSize={12} />
              <YAxis domain={[0, 1]} stroke="hsl(215 20% 65%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222 47% 10%)',
                  border: '1px solid hsl(222 47% 18%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [value.toFixed(2), name === 'ndvi' ? 'Current NDVI' : 'Optimal']}
                labelFormatter={(label) => barData.find(d => d.name === label)?.fullName || label}
              />
              <Bar dataKey="ndvi" radius={[4, 4, 0, 0]} name="Current NDVI">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
              {/* Show optimal markers */}
              {barData.map((entry, index) => (
                <ReferenceLine
                  key={`optimal-${index}`}
                  y={entry.optimal}
                  stroke="hsl(160 84% 39%)"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Dashed line indicates crop-specific optimal NDVI threshold
        </p>
      </div>

      {/* Multi-factor Radar Chart */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-lg font-semibold mb-4">Multi-Factor Health Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={[
              { metric: 'Health %', ...Object.fromEntries(radarData.map(d => [d.field, d['Health']])) },
              { metric: 'Healthy Area', ...Object.fromEntries(radarData.map(d => [d.field, d['Healthy Area']])) },
              { metric: 'Trend', ...Object.fromEntries(radarData.map(d => [d.field, d['Trend']])) },
              { metric: 'Low Priority', ...Object.fromEntries(radarData.map(d => [d.field, d['Priority']])) },
            ]}>
              <PolarGrid stroke="hsl(222 47% 18%)" />
              <PolarAngleAxis dataKey="metric" stroke="hsl(215 20% 65%)" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(215 20% 65%)" fontSize={10} />
              {fields.map((field, index) => (
                <Radar
                  key={field.id}
                  name={field.name.split(' ')[0]}
                  dataKey={field.name.split(' ')[0]}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              ))}
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => <span style={{ color: 'hsl(215 20% 65%)' }}>{value}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Ranking Table */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-display text-lg font-semibold mb-4">Priority Ranking (Needs Attention First)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Field</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Crop</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">NDVI</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Area</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
              </tr>
            </thead>
            <tbody>
              {priorityData.map((field, index) => (
                <tr key={field.id} className="border-b border-border/10 hover:bg-secondary/20">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-destructive/20 text-destructive' :
                      index === 1 ? 'bg-warning/20 text-warning' :
                      'bg-secondary/50 text-foreground'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">{field.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{field.crop}</td>
                  <td className={`py-3 px-4 text-center font-mono font-bold ${field.category.color}`}>
                    {field.ndvi.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${field.category.bgColor} bg-opacity-20 ${field.category.color}`}>
                      {field.category.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{field.area} ha</td>
                  <td className="py-3 px-4 text-center">
                    <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold ${
                      field.priorityScore >= 50 ? 'bg-destructive/20 text-destructive' :
                      field.priorityScore >= 30 ? 'bg-warning/20 text-warning' :
                      'bg-success/20 text-success'
                    }`}>
                      {field.priorityScore}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
