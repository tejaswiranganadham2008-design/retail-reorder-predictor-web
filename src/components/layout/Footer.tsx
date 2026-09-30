import React from 'react';
import { Database, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left info */}
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 font-serif">
              Retail Reorder Point Predictor
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supermarket Supply Chain Optimization & Demand Forecasting Engine
            </p>
          </div>

          {/* Academic & Engineering Domain Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Cpu size={12} />
              ADSA: AVL & Graph
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <Database size={12} />
              AI: Time-Series MA
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Code2 size={12} />
              OOPJ: Java Entities
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck size={12} />
              Python: Data Pipeline
            </span>
          </div>

          {/* Status badge */}
          <div className="text-xs text-center md:text-right text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Client-Side Reactive Engine • 100% Static
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
