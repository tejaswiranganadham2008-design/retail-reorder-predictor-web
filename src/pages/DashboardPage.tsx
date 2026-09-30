import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { KPICard } from '../components/common/KPICard';
import { StatusBadge } from '../components/common/StatusBadge';
import { exportSKUsToCSV } from '../lib/csvExport';
import { CalculatedSKU } from '../types';
import {
  Boxes,
  AlertTriangle,
  TrendingDown,
  LineChart as ChartIcon,
  Download,
  Truck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (tab: any) => void;
  onSelectSKUForForecast?: (skuId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectSKUForForecast,
}) => {
  const {
    calculatedSKUs,
    urgentSKUs,
    lowestStockSKU,
    averageDailyForecast,
    reorderItem,
    reorderAllUrgent,
    avlHeight,
    bfsResult,
  } = useInventory();

  // Prepare chart data: Stock vs Threshold for all SKUs
  const chartData = calculatedSKUs.map((sku: CalculatedSKU) => ({
    name: sku.name.length > 10 ? `${sku.name.slice(0, 9)}..` : sku.name,
    fullName: sku.name,
    stock: sku.currentStock,
    threshold: sku.reorderThreshold,
    forecast: sku.forecastDemand,
    status: sku.status,
    id: sku.id,
  }));

  const handleExportUrgent = () => {
    exportSKUsToCSV(calculatedSKUs, undefined, true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
            Supermarket Inventory & Reorder Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time moving-average demand forecasting, AVL Tree index, and supplier routing engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {urgentSKUs.length > 0 && (
            <button onClick={reorderAllUrgent} className="btn-amber text-xs">
              <Truck size={15} />
              <span>Auto-Restock All Urgent ({urgentSKUs.length})</span>
            </button>
          )}
          <button onClick={handleExportUrgent} className="btn-primary text-xs">
            <Download size={15} />
            <span>Export Reorder List (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Total Monitored SKUs"
          value={calculatedSKUs.length}
          subtitle="Catalog active in store inventory"
          icon={Boxes}
          variant="default"
          badge={`AVL Height: ${avlHeight}`}
          onClick={() => onNavigate('inventory')}
        />

        <KPICard
          title="Items to Reorder Today"
          value={urgentSKUs.length}
          subtitle={
            urgentSKUs.length > 0
              ? `${urgentSKUs.length} fast-moving items below threshold`
              : 'All stocks healthy'
          }
          icon={AlertTriangle}
          variant={urgentSKUs.length > 0 ? 'amber' : 'emerald'}
          badge={urgentSKUs.length > 0 ? 'CRITICAL' : 'OPTIMAL'}
          onClick={() => onNavigate('inventory')}
        />

        <KPICard
          title="Lowest Stock Item"
          value={lowestStockSKU ? `${lowestStockSKU.currentStock} units` : 'N/A'}
          subtitle={lowestStockSKU ? `${lowestStockSKU.name} (${lowestStockSKU.id})` : ''}
          icon={TrendingDown}
          variant="amber"
          badge="O(log N) Min"
          onClick={() => onNavigate('avl-tree')}
        />

        <KPICard
          title="Avg Daily Demand Forecast"
          value={`${averageDailyForecast} u/d`}
          subtitle="3-day moving average across all SKUs"
          icon={ChartIcon}
          variant="blue"
          badge="Predictive MA"
          onClick={() => onNavigate('forecast')}
        />
      </div>

      {/* Bar Chart: Stock vs Reorder Threshold */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
              Inventory Level vs Reorder Threshold Benchmark
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When Current Stock (Blue) is below Reorder Threshold (Amber), the item is flagged for immediate reordering.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-sm bg-brand-blue inline-block"></span>
              Current Stock
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
              Reorder Threshold
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card p-3 shadow-soft-lg text-xs space-y-1 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700">
                        <p className="font-bold text-slate-900 dark:text-white">{data.fullName}</p>
                        <p className="text-slate-500">SKU ID: {data.id}</p>
                        <div className="pt-1 space-y-0.5 font-mono">
                          <p className="text-brand-blue font-semibold">
                            Current Stock: {data.stock} units
                          </p>
                          <p className="text-amber-600 dark:text-amber-400 font-semibold">
                            Threshold: {data.threshold} units
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">
                            Daily Forecast: {data.forecast} u/day
                          </p>
                        </div>
                        <div className="pt-1">
                          <StatusBadge status={data.status} size="sm" />
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="stock" name="Current Stock" fill="#1F5FD6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="threshold" name="Reorder Threshold" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Urgent Reorders List & Fast-Restock Routing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Urgent Reorders Table */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600">
                <AlertTriangle size={18} />
              </span>
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                  Urgent Restock Action Queue
                </h3>
                <p className="text-xs text-slate-500">
                  {urgentSKUs.length} items have stock levels below minimum safety buffers.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs font-semibold text-brand-blue dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {urgentSKUs.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                All Supermarket Inventory In Balance
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No items currently require emergency reordering. The AVL Tree is balanced and all safety thresholds are satisfied.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {urgentSKUs.map((sku: CalculatedSKU) => (
                <div
                  key={sku.id}
                  className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-amber-50/70"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {sku.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">({sku.id})</span>
                      <StatusBadge status={sku.status} size="sm" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <span>
                        Stock: <strong className="text-amber-700 dark:text-amber-300 font-mono">{sku.currentStock}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Threshold: <strong className="font-mono">{sku.reorderThreshold}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Lead Time: <strong>{sku.leadTimeDays}d</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Deficit: <strong className="text-red-600 font-mono">-{sku.stockDeficit}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        if (onSelectSKUForForecast) onSelectSKUForForecast(sku.id);
                        onNavigate('forecast');
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      View Math
                    </button>
                    <button
                      onClick={() => reorderItem(sku.id)}
                      className="btn-amber text-xs px-3 py-1.5"
                    >
                      <Truck size={13} />
                      <span>Order Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 col: Optimal Routing Mini-Card */}
        <div className="glass-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-brand-blue">
                <Truck size={18} />
              </span>
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                  Fastest Restock Pipeline
                </h3>
                <p className="text-xs text-slate-500">Supplier Network BFS Solution</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-blue dark:text-blue-300">
                  Optimal Route (BFS)
                </span>
                <span className="font-mono font-bold text-brand-blue bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                  {bfsResult.hopCount} Hops
                </span>
              </div>
              <p className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                WH &rarr; S2 &rarr; Store
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Direct high-frequency corridor saving 1 hop vs alternate routes (WH &rarr; S1 &rarr; S3 &rarr; Store).
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Central Warehouse Buffer:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">95,000 units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Express Transit Time:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">15 hours (8h + 7h)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Fulfillment Reliability:</span>
                <span className="font-mono font-bold text-emerald-600">99.4% SLA</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('supplier-graph')}
            className="w-full btn-secondary text-xs mt-4 justify-center"
          >
            <span>Inspect Supplier Network Topology</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
