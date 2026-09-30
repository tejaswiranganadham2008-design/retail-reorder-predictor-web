import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { CalculatedSKU } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { exportSKUsToCSV } from '../lib/csvExport';
import {
  Boxes,
  Search,
  Download,
  Plus,
  ArrowUpDown,
  Edit2,
  Check,
  X,
  Trash2,
} from 'lucide-react';

interface InventoryPageProps {
  onOpenAddModal: () => void;
  onSelectSKUForForecast?: (skuId: string) => void;
  onNavigate?: (tab: any) => void;
}

type SortField = 'id' | 'name' | 'category' | 'currentStock' | 'leadTimeDays' | 'forecastDemand' | 'reorderThreshold' | 'status';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'ALL' | 'REORDER' | 'OK';

export const InventoryPage: React.FC<InventoryPageProps> = ({
  onOpenAddModal,
  onSelectSKUForForecast,
  onNavigate,
}) => {
  const {
    calculatedSKUs,
    updateStock,
    deleteSKU,
    reorderItem,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('currentStock');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState<string>('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    calculatedSKUs.forEach((s: CalculatedSKU) => set.add(s.category));
    return Array.from(set).sort();
  }, [calculatedSKUs]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const startEditing = (sku: CalculatedSKU) => {
    setEditingId(sku.id);
    setEditStockValue(sku.currentStock.toString());
  };

  const saveEditing = (id: string) => {
    const num = parseInt(editStockValue, 10);
    if (!isNaN(num) && num >= 0) {
      updateStock(id, num);
    }
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  // Filtered and sorted SKUs
  const filteredSKUs = useMemo(() => {
    return calculatedSKUs
      .filter((sku: CalculatedSKU) => {
        // Search query filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          sku.name.toLowerCase().includes(query) ||
          sku.id.toLowerCase().includes(query) ||
          sku.category.toLowerCase().includes(query);

        // Status filter
        const matchesStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'REORDER' && sku.status === 'REORDER TODAY') ||
          (statusFilter === 'OK' && sku.status === 'OK');

        // Category filter
        const matchesCategory =
          categoryFilter === 'ALL' || sku.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a: CalculatedSKU, b: CalculatedSKU) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [calculatedSKUs, searchQuery, statusFilter, categoryFilter, sortField, sortDirection]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-brand-blue">
              <Boxes size={22} />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
                Supermarket Stock Inventory & Reorder Table
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live recalculations on edit: click any stock number to adjust inventory and watch the AVL tree rebalance.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportSKUsToCSV(calculatedSKUs)}
            className="btn-secondary text-xs"
            title="Download full inventory CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button onClick={onOpenAddModal} className="btn-primary text-xs">
            <Plus size={14} />
            <span>+ Add SKU</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by SKU, Product Name, or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All ({calculatedSKUs.length})
          </button>
          <button
            onClick={() => setStatusFilter('REORDER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              statusFilter === 'REORDER'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-amber-700 dark:text-amber-400 hover:bg-amber-100/50'
            }`}
          >
            <span>Reorder</span>
            <span className="text-[10px] bg-amber-600 text-white dark:bg-amber-900 px-1.5 rounded-full">
              {calculatedSKUs.filter((s: CalculatedSKU) => s.status === 'REORDER TODAY').length}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('OK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'OK'
                ? 'bg-emerald-500 text-white font-bold shadow-sm'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50'
            }`}
          >
            OK ({calculatedSKUs.filter((s: CalculatedSKU) => s.status === 'OK').length})
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold select-none">
                <th
                  onClick={() => handleSort('id')}
                  className="p-3.5 cursor-pointer hover:text-brand-blue transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>SKU</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="p-3.5 cursor-pointer hover:text-brand-blue transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Product Name</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="p-3.5 cursor-pointer hover:text-brand-blue transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Category</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('currentStock')}
                  className="p-3.5 cursor-pointer hover:text-brand-blue transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Current Stock (AVL Key)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('leadTimeDays')}
                  className="p-3.5 cursor-pointer hover:text-brand-blue transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Lead Time</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('forecastDemand')}
                  className="p-3.5 cursor-pointer hover:text-brand-blue transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>3-Day Forecast</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('reorderThreshold')}
                  className="p-3.5 cursor-pointer hover:text-brand-blue transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Threshold</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="p-3.5 cursor-pointer hover:text-brand-blue transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="p-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSKUs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No SKU records match your search query or filter.
                  </td>
                </tr>
              ) : (
                filteredSKUs.map((sku: CalculatedSKU) => {
                  const isEditing = editingId === sku.id;

                  return (
                    <tr
                      key={sku.id}
                      className={`hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors ${
                        sku.status === 'REORDER TODAY'
                          ? 'bg-amber-50/20 dark:bg-amber-950/10'
                          : ''
                      }`}
                    >
                      {/* SKU ID */}
                      <td className="p-3.5 font-mono font-medium text-slate-500 dark:text-slate-400">
                        {sku.id}
                      </td>

                      {/* Name */}
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{sku.name}</span>
                          {sku.customAdded && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-brand-blue dark:bg-blue-950 font-mono">
                              Custom
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
                          {sku.category}
                        </span>
                      </td>

                      {/* Current Stock (Inline Editable) */}
                      <td className="p-3.5 font-mono">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              value={editStockValue}
                              onChange={(e) => setEditStockValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditing(sku.id);
                                if (e.key === 'Escape') cancelEditing();
                              }}
                              autoFocus
                              className="w-16 px-2 py-1 text-xs rounded border border-brand-blue bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none"
                            />
                            <button
                              onClick={() => saveEditing(sku.id)}
                              className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                              title="Save stock"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditing(sku)}
                            className="group/stock inline-flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded hover:bg-blue-100/60 dark:hover:bg-slate-800 transition-colors"
                            title="Click to edit stock level"
                          >
                            <span
                              className={`text-sm font-bold ${
                                sku.status === 'REORDER TODAY'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {sku.currentStock}
                            </span>
                            <Edit2
                              size={11}
                              className="opacity-0 group-hover/stock:opacity-100 text-slate-400 transition-opacity"
                            />
                          </div>
                        )}
                      </td>

                      {/* Lead Time */}
                      <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                        {sku.leadTimeDays}d
                      </td>

                      {/* 3-Day Forecast */}
                      <td className="p-3.5 font-mono font-semibold text-brand-blue dark:text-blue-400">
                        {sku.forecastDemand}/d
                      </td>

                      {/* Threshold */}
                      <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {sku.reorderThreshold}
                      </td>

                      {/* Status Badge */}
                      <td className="p-3.5">
                        <StatusBadge status={sku.status} size="sm" />
                      </td>

                      {/* Quick Actions */}
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {sku.status === 'REORDER TODAY' ? (
                          <button
                            onClick={() => reorderItem(sku.id)}
                            className="btn-amber text-[11px] px-2.5 py-1"
                            title="Dispatch fast restock PO"
                          >
                            Restock
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (onSelectSKUForForecast) onSelectSKUForForecast(sku.id);
                              if (onNavigate) onNavigate('forecast');
                            }}
                            className="btn-outline text-[11px] px-2.5 py-1"
                            title="Inspect demand forecast math"
                          >
                            Math
                          </button>
                        )}

                        {sku.customAdded && (
                          <button
                            onClick={() => deleteSKU(sku.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete custom SKU"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Displaying {filteredSKUs.length} of {calculatedSKUs.length} SKUs
          </span>
          <span className="font-mono text-[11px]">
            Threshold = Forecast × Lead Time • Status = Stock &lt; Threshold
          </span>
        </div>
      </div>
    </div>
  );
};
