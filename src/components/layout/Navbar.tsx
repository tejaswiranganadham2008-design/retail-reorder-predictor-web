import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import { exportSKUsToCSV } from '../../lib/csvExport';
import {
  LayoutDashboard,
  Boxes,
  Binary,
  GitFork,
  LineChart,
  HelpCircle,
  Sun,
  Moon,
  Download,
  AlertTriangle,
  Menu,
  X,
  Store,
  RefreshCw,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'inventory' | 'avl-tree' | 'supplier-graph' | 'forecast' | 'about';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAddModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { urgentSKUs, calculatedSKUs, resetToDefaults } = useInventory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Boxes size={17} />,
      badge: urgentSKUs.length > 0 ? urgentSKUs.length : undefined,
    },
    { id: 'avl-tree', label: 'AVL Tree', icon: <Binary size={17} /> },
    { id: 'supplier-graph', label: 'Supplier Graph', icon: <GitFork size={17} /> },
    { id: 'forecast', label: 'Forecast', icon: <LineChart size={17} /> },
    { id: 'about', label: 'About', icon: <HelpCircle size={17} /> },
  ];

  const handleExport = () => {
    exportSKUsToCSV(calculatedSKUs);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D2A5C] text-white shadow-soft-lg border-b border-blue-900/50">
      {/* Top Banner / Announcement if reorders needed */}
      {urgentSKUs.length > 0 && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-semibold flex items-center justify-between transition-all">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="animate-bounce" />
              <span>
                <strong>Action Required:</strong> {urgentSKUs.length} items have fallen below their reorder threshold today.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-[11px] underline font-bold uppercase tracking-wider hover:opacity-80"
            >
              View Inventory Table &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-blue-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif font-bold text-base sm:text-lg tracking-tight block leading-tight text-white group-hover:text-blue-200 transition-colors">
                  Retail Reorder Predictor
                </span>
                <span className="text-[10px] text-blue-200 uppercase tracking-widest font-mono font-medium block">
                  Supermarket Chain OS
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/10 p-1.5 rounded-2xl backdrop-blur-sm border border-white/10" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-amber-400 text-slate-950 animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons (Export, Reset, Theme Toggle, Mobile Menu) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              title="Export reorder list & inventory to CSV"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white border border-white/10 transition-colors"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={resetToDefaults}
              title="Reset inventory to initial 12 seed SKUs"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-blue-200 hover:text-white transition-colors"
              aria-label="Reset to default seed data"
            >
              <RefreshCw size={16} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 hover:text-amber-200 transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071633] border-t border-blue-900/60 px-4 pt-3 pb-4 space-y-1.5 animate-slide-up">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-brand-blue text-white'
                    : 'text-blue-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-blue-900/40 flex items-center justify-between">
            <button
              onClick={() => {
                handleExport();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-semibold text-blue-200 py-2"
            >
              <Download size={15} />
              <span>Export CSV File</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
