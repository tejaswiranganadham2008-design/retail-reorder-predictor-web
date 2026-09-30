import React, { useState, useMemo } from 'react';
import { ItemCategory, SKUItem } from '../../types';
import { calculateMovingAverageForecast, calculateReorderThreshold, determineReorderStatus } from '../../lib/forecast';
import { StatusBadge } from '../common/StatusBadge';
import { X, Sparkles, Plus } from 'lucide-react';

interface AddSKUModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSKU: (sku: Omit<SKUItem, 'id'>) => void;
}

const CATEGORIES: ItemCategory[] = [
  'Dairy',
  'Grains',
  'Pantry',
  'Bakery',
  'Beverages',
  'Snacks',
  'Household',
  'Personal Care',
];

export const AddSKUModal: React.FC<AddSKUModalProps> = ({ isOpen, onClose, onAddSKU }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Dairy');
  const [currentStock, setCurrentStock] = useState<number>(20);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(2);
  const [salesHistory, setSalesHistory] = useState<number[]>([15, 18, 22, 25, 24]);

  // Live forecast calculations in the modal
  const { forecast, formula } = useMemo(() => {
    return calculateMovingAverageForecast(salesHistory);
  }, [salesHistory]);

  const threshold = useMemo(() => {
    return calculateReorderThreshold(forecast, leadTimeDays);
  }, [forecast, leadTimeDays]);

  const projectedStatus = useMemo(() => {
    return determineReorderStatus(currentStock, threshold);
  }, [currentStock, threshold]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddSKU({
      name: name.trim(),
      category,
      currentStock: Math.max(0, currentStock),
      leadTimeDays: Math.max(1, leadTimeDays),
      salesHistory,
    });

    // Reset form
    setName('');
    setCurrentStock(20);
    setLeadTimeDays(2);
    setSalesHistory([15, 18, 22, 25, 24]);
    onClose();
  };

  const handleSalesChange = (index: number, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    const updated = [...salesHistory];
    updated[index] = num;
    setSalesHistory(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-card max-w-lg w-full p-6 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-lg animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-brand-blue">
              <Sparkles size={18} />
            </span>
            <div>
              <h3 id="modal-title" className="text-base font-bold text-slate-900 dark:text-white font-serif">
                Add SKU to Supermarket Catalog
              </h3>
              <p className="text-xs text-slate-500">
                Inserts node into AVL Tree and triggers self-balancing rotation if needed.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SKU Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Greek Yogurt 500g"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Stock Level (AVL Key) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {/* Lead Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supplier Lead Time (Days) *
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          {/* 5-Day Sales History Inputs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Past 5-Day Sales History (Units/Day)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {salesHistory.map((val, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block text-center">
                    Day {idx + 1}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={val}
                    onChange={(e) => handleSalesChange(idx, e.target.value)}
                    className={`w-full text-center px-1.5 py-1.5 text-xs rounded-lg border font-mono ${
                      idx >= 2
                        ? 'border-brand-blue/50 bg-blue-50/50 dark:bg-blue-950/40 text-brand-blue dark:text-blue-300 font-bold'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                    }`}
                  />
                </div>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Days 3, 4, 5 are highlighted in blue and feed the 3-day moving-average.
            </span>
          </div>

          {/* Live Calculation Preview Card */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Live Forecast & Threshold Preview
              </span>
              <StatusBadge status={projectedStatus} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                  3-Day Moving Avg:
                </span>
                <p className="font-bold text-brand-blue font-mono">{forecast} units/day</p>
                <p className="text-[10px] text-slate-500">{formula}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                  Reorder Threshold:
                </span>
                <p className="font-bold text-amber-600 font-mono">{threshold} units</p>
                <p className="text-[10px] text-slate-500">
                  {forecast} × {leadTimeDays} days
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={!name.trim()} className="btn-primary text-xs">
              <Plus size={14} />
              <span>Insert into AVL Tree</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
