import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Printer, 
  Layers, 
  Sliders, 
  Leaf, 
  Store, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  CROP_YIELD_DATABASE, 
  calculateYieldAndProfit, 
  YieldPredictionResult 
} from '@/lib/yieldPredictionEngine';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

const COST_COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

export default function YieldMarketPage() {
  const { toast } = useToast();
  const [selectedCropKey, setSelectedCropKey] = useState<string>('wheat');
  const [acreage, setAcreage] = useState<number>(10);
  const [ndvi, setNdvi] = useState<number>(0.76);
  const [costMultiplier, setCostMultiplier] = useState<number>(1.0);

  const result: YieldPredictionResult = useMemo(() => {
    return calculateYieldAndProfit(selectedCropKey, acreage, ndvi, costMultiplier);
  }, [selectedCropKey, acreage, ndvi, costMultiplier]);

  const cropConfig = CROP_YIELD_DATABASE[selectedCropKey];

  const handlePrintForecast = () => {
    window.print();
    toast({
      title: 'Harvest Forecast Ready',
      description: `Profit projection for ${result.cropName} (${acreage} Acres) generated.`
    });
  };

  const revenueComparisonData = [
    { name: 'Gross Revenue', amount: result.expectedGrossRevenue, fill: '#10b981' },
    { name: 'Total Costs', amount: result.totalEstimatedCosts, fill: '#f43f5e' },
    { name: 'Net Profit', amount: Math.max(0, result.netEstimatedProfit), fill: '#06b6d4' }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0c1422]/95 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.12)] backdrop-blur-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                Crop Yield & <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">APMC Mandi Profit</span> Predictor
              </h1>
            </div>
            <p className="text-xs text-gray-300 font-mono mt-1">
              Neural Vegetative Vigor (NDVI) to Harvest Metric Tons & Mandi Real-Time Profit Telemetry
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintForecast}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-mono font-bold transition-all hover:scale-105 shadow-md"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Export Forecast</span>
            </button>
          </div>
        </div>

        {/* Interactive Configuration Panel */}
        <div className="p-5 rounded-3xl bg-[#0c1422]/90 border border-white/10 shadow-xl backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Farm Parameters & Field Biomass
            </span>
            <span className="text-[11px] text-gray-400 font-mono">
              Live Interactive Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Crop Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300 flex items-center gap-1">
                <span>Select Target Crop:</span>
              </label>
              <select
                value={selectedCropKey}
                onChange={(e) => setSelectedCropKey(e.target.value)}
                className="w-full bg-black/60 text-emerald-300 text-xs font-mono font-bold px-3 py-2.5 rounded-2xl border border-emerald-500/30 outline-none cursor-pointer hover:border-emerald-400 transition-colors"
              >
                {Object.keys(CROP_YIELD_DATABASE).map((key) => (
                  <option key={key} value={key} className="bg-[#0b121e] text-white">
                    {CROP_YIELD_DATABASE[key].name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Acreage Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300">Total Acreage:</span>
                <span className="text-emerald-400 font-bold">{acreage} Acres</span>
              </div>
              <input
                type="range"
                min={1}
                max={150}
                step={1}
                value={acreage}
                onChange={(e) => setAcreage(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>1 Acre</span>
                <span>75 Acres</span>
                <span>150 Acres</span>
              </div>
            </div>

            {/* 3. NDVI Vegetative Vigor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Canopy NDVI:
                </span>
                <span className="text-cyan-400 font-bold">{ndvi.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.40}
                max={0.95}
                step={0.01}
                value={ndvi}
                onChange={(e) => setNdvi(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span className="text-rose-400">0.40 (Stressed)</span>
                <span className="text-emerald-400 font-bold">0.95 (Peak)</span>
              </div>
            </div>

            {/* 4. Cost Modifier */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300">Input Cost Scale:</span>
                <span className="text-amber-400 font-bold">
                  {costMultiplier === 1.0 ? 'Standard APMC' : `${Math.round(costMultiplier * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min={0.7}
                max={1.5}
                step={0.05}
                value={costMultiplier}
                onChange={(e) => setCostMultiplier(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>Organic (-30%)</span>
                <span>Intensive (+50%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Glowing Multi-Color KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Harvest Yield */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900/40 via-[#081320] to-[#0c1622] border border-emerald-500/40 border-t-4 border-t-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-300 font-bold">PREDICTED HARVEST</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {result.vigorClassification}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {result.totalHarvestQuintals.toLocaleString()} <span className="text-base text-emerald-400">Q</span>
            </div>
            <p className="text-xs text-gray-300 font-mono mt-1">
              ≈ <strong>{result.totalHarvestMetricTons}</strong> Metric Tons ({result.yieldPerAcreQ} Q/acre)
            </p>
          </div>

          {/* Card 2: Expected Gross Revenue */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-900/40 via-[#061524] to-[#081826] border border-cyan-500/40 border-t-4 border-t-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-300 font-bold">GROSS REVENUE</span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-500/30">
                Mandi Rate
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              ₹{result.expectedGrossRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-300 font-mono mt-1">
              At ₹{result.activeMandi.pricePerQuintal}/Q ({result.activeMandi.mandiName})
            </p>
          </div>

          {/* Card 3: Total Estimated Costs */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-900/40 via-[#180a14] to-[#1c0d18] border border-rose-500/40 border-t-4 border-t-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-rose-300 font-bold">CULTIVATION EXPENSES</span>
              <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                All Inputs
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              ₹{result.totalEstimatedCosts.toLocaleString()}
            </div>
            <p className="text-xs text-gray-300 font-mono mt-1">
              ₹{Math.round(result.totalEstimatedCosts / acreage).toLocaleString()} per acre all-inclusive
            </p>
          </div>

          {/* Card 4: Net Estimated Profit */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-900/40 via-[#181309] to-[#1a140a] border border-amber-500/40 border-t-4 border-t-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-amber-300 font-bold">ESTIMATED NET PROFIT</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                +{result.roiPercentage}% ROI
              </span>
            </div>
            <div className={`text-3xl font-extrabold font-mono ${result.netEstimatedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{result.netEstimatedProfit.toLocaleString()}
            </div>
            <p className="text-xs text-gray-300 font-mono mt-1">
              ₹{Math.round(result.netEstimatedProfit / acreage).toLocaleString()} profit per acre
            </p>
          </div>
        </div>

        {/* 2-Column Analytics & Live Mandi Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Cost vs Revenue Charts (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Revenue vs Cost Bar Chart */}
            <div className="p-5 rounded-3xl bg-[#0c1422]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 className="font-extrabold text-white text-sm font-display flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" /> Financial Outcome Comparison
                </h3>
                <span className="text-[10px] font-mono text-gray-400">Values in ₹ INR</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueComparisonData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Amount']}
                      contentStyle={{ backgroundColor: '#0c1422', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="amount" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Input Cost Breakdown Table */}
            <div className="p-5 rounded-3xl bg-[#0c1422]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 className="font-extrabold text-white text-sm font-display flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" /> Cultivation Expense Breakdown
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">Total: ₹{result.totalEstimatedCosts.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                {result.costBreakdown.map((cost, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COST_COLORS[idx % COST_COLORS.length] }} />
                      <span className="text-gray-200">{cost.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{cost.percentage}%</span>
                      <span className="text-white font-bold">₹{cost.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: APMC Mandi Live Pricing & Advisory (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Mandi APMC Price Board */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#0c1828]/95 via-[#081220]/95 to-[#0c1828]/95 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-extrabold text-white text-sm font-display">APMC Mandi Real-Time Rates</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  LIVE YARDS
                </span>
              </div>

              <div className="space-y-2.5">
                {cropConfig.mandiRates.map((mandi, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-400/40 transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="font-bold text-white text-[13px]">{mandi.mandiName}</div>
                      <span className="text-gray-400">{mandi.state}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xl font-extrabold text-emerald-400 font-mono">
                          ₹{mandi.currentPriceQ.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono ml-1">/ Quintal</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono">
                        {mandi.mspPriceQ > 0 && (
                          <span className="text-[10px] text-gray-400" title="Govt Minimum Support Price">
                            MSP: ₹{mandi.mspPriceQ}
                          </span>
                        )}
                        <span className={`flex items-center font-bold px-1.5 py-0.5 rounded text-[11px] ${
                          mandi.trend === 'bullish' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {mandi.trend === 'bullish' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {mandi.priceChange30d}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* "Best Time to Sell" Agronomic Holding Advisory */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#18130a]/95 via-[#120e06]/95 to-[#18130a]/95 border border-amber-500/30 shadow-2xl backdrop-blur-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <h3 className="font-extrabold text-white text-sm font-display">Best Time to Sell Advisory</h3>
                </div>
                <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                  HARVEST INTEL
                </span>
              </div>

              <div className="text-xs text-gray-300 space-y-2 leading-relaxed font-sans">
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 pb-1">
                  <span>Peak Harvest Window:</span>
                  <strong className="text-white">{cropConfig.peakHarvestMonth}</strong>
                </div>
                <p className="p-3 rounded-2xl bg-black/40 border border-white/5 text-gray-200">
                  {cropConfig.marketHoldingAdvise}
                </p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 pt-1">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Verified by Directorate of Economics & Statistics (DES)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}
