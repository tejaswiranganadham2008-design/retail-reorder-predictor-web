import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { SupplierGraphVisualizer } from '../components/visual/SupplierGraphVisualizer';

export const SupplierGraphPage: React.FC = () => {
  const { supplierGraph, bfsResult, dfsResult } = useInventory();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Visualizer Component */}
      <SupplierGraphVisualizer graph={supplierGraph} />

      {/* Comparison Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BFS Card */}
        <div className="glass-card p-6 space-y-3 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              Breadth-First Search (BFS) in Supply Chains
            </h3>
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
              {bfsResult.hopCount} Hops (Optimal)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            BFS systematically explores all immediate node neighbors at distance 1 before moving to distance 2 using a FIFO queue. In logistics networks, this guarantees finding the route with the fewest transfer points. Fewer intermediate distribution hubs reduce transshipment costs, handling damage, and transit uncertainty.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-800 dark:text-slate-200">
            <strong>Optimal Dispatch Sequence:</strong> Central Warehouse &rarr; Supplier Hub 2 &rarr; Storefront (2 Hops)
          </div>
        </div>

        {/* DFS Card */}
        <div className="glass-card p-6 space-y-3 border-t-4 border-t-brand-blue">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-blue"></span>
              Depth-First Search (DFS) in Supply Chains
            </h3>
            <span className="text-xs font-mono font-bold text-brand-blue bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
              {dfsResult.hopCount} Hops (Exploratory)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            DFS delves deeply along each branch of the supplier tree until it reaches a dead end or the target, using a LIFO call stack. Because it greedily commits to the northern corridor (S1 &rarr; S3), it generates extra intermediary handoffs, resulting in higher latency compared to BFS.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-800 dark:text-slate-200">
            <strong>Discovered Sequence:</strong> Central Warehouse &rarr; Supplier 1 &rarr; Supplier 3 &rarr; Storefront (3 Hops)
          </div>
        </div>
      </div>
    </div>
  );
};
