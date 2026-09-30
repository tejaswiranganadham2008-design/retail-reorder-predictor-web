import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { calculateMovingAverageForecast, calculateReorderThreshold, determineReorderStatus } from '../lib/forecast';
import { CalculatedSKU } from '../types';
import {
  LineChart as LineChartIcon,
  Calculator,
  Sliders,
  Truck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface ForecastPageProps {
  selectedSKUId?: string;
  onSelectSKU?: (id: string) => void;
  onNavigate?: (tab: any) => void;
}

export const ForecastPage: React.FC<ForecastPageProps> = ({
  selectedSKUId,
  onSelectSKU,
}) => {
  const { calculatedSKUs, reorderItem } = useInventory();

  // Current selected SKU
  const [currentId, setCurrentId] = useState<string>(
    selectedSKUId || (calculatedSKUs[0]?.id || 'SKU-001')
  );

  // Simulation state
  const [simLeadTime, setSimLeadTime] = useState<number | null>(null);
  const [simSales, setSimSales] = useState<number[] | null>(null);

  const selectedSKU = useMemo(() => {
    return calculatedSKUs.find((s: CalculatedSKU) => s.id === currentId) || calculatedSKUs[0];
  }, [calculatedSKUs, currentId]);

  // Sync simulation when selected SKU changes
  const activeSales = simSales || selectedSKU?.salesHistory || [20, 24, 22, 26, 28];
  const activeLeadTime = simLeadTime !== null ? simLeadTime : (selectedSKU?.leadTimeDays || 1);

  // Calculate forecast & threshold for active values
  const { forecast, formula } = useMemo(() => {
    return calculateMovingAverageForecast(activeSales);
  }, [activeSales]);

  const threshold = useMemo(() => {
    return calculateReorderThreshold(forecast, activeLeadTime);
  }, [forecast, activeLeadTime]);

  const activeStatus = useMemo(() => {
    if (!selectedSKU) return 'OK';
    return determineReorderStatus(selectedSKU.currentStock, threshold);
  }, [selectedSKU, threshold]);

  // Chart data: 5 past days + 1 forecast point (Day 6)
  const chartData = [
    { day: 'Day 1', actualSales: activeSales[0], forecast: null, isForecast: false },
    { day: 'Day 2', actualSales: activeSales[1], forecast: null, isForecast: false },
    { day: 'Day 3', actualSales: activeSales[2], forecast: null, isForecast: false },
    { day: 'Day 4', actualSales: activeSales[3], forecast: null, isForecast: false },
    { day: 'Day 5', actualSales: activeSales[4], forecast: activeSales[4], isForecast: false }, // Connect line
    { day: 'Day 6 (Forecast)', actualSales: null, forecast: forecast, isForecast: true },
  ];

  const handleSKUSelect = (id: string) => {
    setCurrentId(id);
    setSimLeadTime(null);
    setSimSales(null);
    if (onSelectSKU) onSelectSKU(id);
  };

  const handleSimSaleChange = (index: number, val: number) => {
    const updated = [...activeSales];
    updated[index] = Math.max(0, val);
    setSimSales(updated);
  };

  const resetSimulation = () => {
    setSimLeadTime(null);
    setSimSales(null);
  };

  if (!selectedSKU) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Selector */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-brand-blue">
              <LineChartIcon size={22} />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
                Moving-Average Demand Forecast & Reorder Thresholds
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Time-series forecasting based on last 3 days of retail checkout velocity.
              </p>
            </div>
          </div>
        </div>

        {/* Dropdown to pick SKU */}
        <div className="w-full md:w-auto">
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Select Product SKU to Inspect:
          </label>
          <select
            value={currentId}
            onChange={(e) => handleSKUSelect(e.target.value)}
            className="w-full md:w-64 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            {calculatedSKUs.map((sku: CalculatedSKU) => (
              <option key={sku.id} value={sku.id}>
                {sku.name} ({sku.id}) - {sku.status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Mathematical Working Card */}
      <div className="glass-card p-6 bg-gradient-to-br from-white to-blue-50/40 dark:from-slate-900 dark:to-blue-950/20 border-blue-200/80 dark:border-blue-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-200/60 dark:border-blue-900/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-blue text-white shadow-md">
              <Calculator size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Step-by-Step Mathematical Formulation
              </h2>
              <span className="text-xs font-mono text-slate-500">
                Evaluating SKU: <strong className="text-slate-900 dark:text-white">{selectedSKU.name}</strong> ({selectedSKU.id})
              </span>
            </div>
          </div>

          <StatusBadge status={activeStatus} size="lg" />
        </div>

        {/* 2-Step Math Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Demand Forecast */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-blue-400">
              1. Moving-Average Demand Forecast
            </span>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Formula: <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded font-mono font-bold text-slate-900 dark:text-white">(Day 3 + Day 4 + Day 5) / 3</code>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 font-mono text-xs text-slate-900 dark:text-white border border-blue-200 dark:border-blue-900">
              <p className="font-bold text-sm text-brand-blue dark:text-blue-300">
                {formula}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Expected sales velocity: <strong>{forecast} units/day</strong>
              </p>
            </div>
          </div>

          {/* Step 2: Reorder Threshold */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              2. Reorder Point Safety Threshold
            </span>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Formula: <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded font-mono font-bold text-slate-900 dark:text-white">Forecast Demand × Supplier Lead Time</code>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 font-mono text-xs text-slate-900 dark:text-white border border-amber-200 dark:border-amber-900">
              <p className="font-bold text-sm text-amber-700 dark:text-amber-400">
                {forecast} × {activeLeadTime} days = {threshold} units
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Current Stock ({selectedSKU.currentStock}) {selectedSKU.currentStock < threshold ? '<' : '≥'} Threshold ({threshold}) &rarr; <strong className={selectedSKU.currentStock < threshold ? 'text-amber-600' : 'text-emerald-600'}>{activeStatus}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart: 5-Day Sales History + Forecast Day 6 */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
              Sales History Trajectory & Day 6 Forecast
            </h3>
            <p className="text-xs text-slate-500">
              Solid Blue: Recorded Store Sales • Dashed Amber: Predictive Demand Point
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <span className="w-3 h-0.5 bg-brand-blue inline-block"></span>
              Historical Sales (Days 1-5)
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <span className="w-3 h-0.5 bg-amber-500 border-b border-dashed border-amber-500 inline-block"></span>
              Day 6 Projected Demand
            </span>
          </div>
        </div>

        {/* Recharts Line Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const isForecastDay = label.includes('Forecast');
                    const val = isForecastDay ? payload[0].payload.forecast : payload[0].payload.actualSales;
                    return (
                      <div className="glass-card p-3 shadow-soft-lg text-xs space-y-1 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700">
                        <p className="font-bold text-slate-900 dark:text-white">{label}</p>
                        <p className={isForecastDay ? 'text-amber-600 font-mono font-bold' : 'text-brand-blue font-mono font-bold'}>
                          {isForecastDay ? `Forecast: ${val} units` : `Sales: ${val} units`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="actualSales"
                stroke="#1F5FD6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#1F5FD6' }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#F59E0B"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 6, fill: '#F59E0B' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive What-If Scenario Simulator */}
      <div className="glass-card p-6 space-y-4 border border-brand-blue/30">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-brand-blue">
              <Sliders size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                Interactive "What-If" Sensitivity Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Adjust past sales velocity or supplier lead times to simulate inventory stress scenarios.
              </p>
            </div>
          </div>

          {(simLeadTime !== null || simSales !== null) && (
            <button onClick={resetSimulation} className="btn-secondary text-xs">
              Reset Simulator
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Day 3 Sales Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex justify-between text-xs font-semibold">
              <span>Day 3 Sales:</span>
              <span className="font-mono text-brand-blue">{activeSales[2]} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={activeSales[2]}
              onChange={(e) => handleSimSaleChange(2, parseInt(e.target.value, 10))}
              className="w-full accent-brand-blue"
            />
          </div>

          {/* Day 4 Sales Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex justify-between text-xs font-semibold">
              <span>Day 4 Sales:</span>
              <span className="font-mono text-brand-blue">{activeSales[3]} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={activeSales[3]}
              onChange={(e) => handleSimSaleChange(3, parseInt(e.target.value, 10))}
              className="w-full accent-brand-blue"
            />
          </div>

          {/* Day 5 Sales Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex justify-between text-xs font-semibold">
              <span>Day 5 Sales:</span>
              <span className="font-mono text-brand-blue">{activeSales[4]} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={activeSales[4]}
              onChange={(e) => handleSimSaleChange(4, parseInt(e.target.value, 10))}
              className="w-full accent-brand-blue"
            />
          </div>

          {/* Lead Time Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex justify-between text-xs font-semibold">
              <span>Supplier Lead Time:</span>
              <span className="font-mono text-amber-600">{activeLeadTime} days</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={activeLeadTime}
              onChange={(e) => setSimLeadTime(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Quick Reorder Action if simulated item triggers alert */}
        {activeStatus === 'REORDER TODAY' && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-amber-600" />
              <span className="text-amber-900 dark:text-amber-200">
                Simulated deficit of <strong>{Math.round((threshold - selectedSKU.currentStock) * 10) / 10} units</strong> detected.
              </span>
            </div>
            <button
              onClick={() => reorderItem(selectedSKU.id)}
              className="btn-amber text-xs px-3 py-1"
            >
              Order {Math.ceil(threshold * 1.5)} Units Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
