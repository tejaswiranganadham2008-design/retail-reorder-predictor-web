import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Navbar, NavTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/layout/ToastContainer';
import { AddSKUModal } from './components/forms/AddSKUModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { AVLTreePage } from './pages/AVLTreePage';
import { SupplierGraphPage } from './pages/SupplierGraphPage';
import { ForecastPage } from './pages/ForecastPage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedSKUForForecast, setSelectedSKUForForecast] = useState<string>('SKU-001');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const { addSKU } = useInventory();

  const handleSelectSKUForForecast = (skuId: string) => {
    setSelectedSKUForForecast(skuId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectSKUForForecast={handleSelectSKUForForecast}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryPage
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSelectSKUForForecast={handleSelectSKUForForecast}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'avl-tree' && (
          <AVLTreePage
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSelectSKUForForecast={handleSelectSKUForForecast}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'supplier-graph' && <SupplierGraphPage />}

        {activeTab === 'forecast' && (
          <ForecastPage
            selectedSKUId={selectedSKUForForecast}
            onSelectSKU={handleSelectSKUForForecast}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Add SKU Modal */}
      <AddSKUModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSKU={(sku) => {
          addSKU(sku);
          setIsAddModalOpen(false);
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <InventoryProvider>
        <AppContent />
      </InventoryProvider>
    </ThemeProvider>
  );
}

export default App;
