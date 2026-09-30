import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { CalculatedSKU, SKUItem, AVLNodeData, RotationEvent, PathResult } from '../types';
import { INITIAL_SKUS } from '../data/initialSKUs';
import { processAllSKUs } from '../lib/forecast';
import { AVLTree } from '../lib/avlTree';
import { SupplierGraph } from '../lib/graph';
import { SUPPLIER_NODES, SUPPLIER_EDGES } from '../data/supplierNetwork';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
}

interface InventoryContextType {
  skus: SKUItem[];
  calculatedSKUs: CalculatedSKU[];
  urgentSKUs: CalculatedSKU[];
  okSKUs: CalculatedSKU[];
  lowestStockSKU: CalculatedSKU | null;
  averageDailyForecast: number;
  
  // AVL Tree State
  avlTree: AVLTree;
  avlTreeData: AVLNodeData | null;
  avlHeight: number;
  avlMinNode: AVLNodeData | null;
  avlInOrder: AVLNodeData[];
  rotationLogs: RotationEvent[];
  lastRotationEvent: RotationEvent | null;

  // Supplier Graph State
  supplierGraph: SupplierGraph;
  bfsResult: PathResult;
  dfsResult: PathResult;

  // Actions
  updateStock: (id: string, newStock: number) => void;
  updateSKU: (id: string, updates: Partial<SKUItem>) => void;
  addSKU: (item: Omit<SKUItem, 'id'>) => CalculatedSKU;
  deleteSKU: (id: string) => void;
  resetToDefaults: () => void;
  reorderItem: (id: string, quantity?: number) => void;
  reorderAllUrgent: () => void;

  // Toasts
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  addToast: (title: string, message: string, type?: ToastNotification['type']) => void;
}

const STORAGE_KEY = 'supermarket_inventory_data_v1';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skus, setSkus] = useState<SKUItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_SKUS;
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [lastRotationEvent, setLastRotationEvent] = useState<RotationEvent | null>(null);

  // Save to localStorage
  const persistSKUs = useCallback((newSkus: SKUItem[]) => {
    setSkus(newSkus);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSkus));
    } catch (e) {
      console.warn('Failed to save inventory to localStorage', e);
    }
  }, []);

  const addToast = useCallback(
    (title: string, message: string, type: ToastNotification['type'] = 'info') => {
      const newToast: ToastNotification = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        message,
        type,
        timestamp: Date.now(),
      };
      setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Processed and enriched SKUs
  const calculatedSKUs = useMemo(() => {
    return processAllSKUs(skus);
  }, [skus]);

  const urgentSKUs = useMemo(() => {
    return calculatedSKUs.filter((s) => s.status === 'REORDER TODAY');
  }, [calculatedSKUs]);

  const okSKUs = useMemo(() => {
    return calculatedSKUs.filter((s) => s.status === 'OK');
  }, [calculatedSKUs]);

  const lowestStockSKU = useMemo(() => {
    if (calculatedSKUs.length === 0) return null;
    return calculatedSKUs.reduce((min, curr) =>
      curr.currentStock < min.currentStock ? curr : min
    );
  }, [calculatedSKUs]);

  const averageDailyForecast = useMemo(() => {
    if (calculatedSKUs.length === 0) return 0;
    const total = calculatedSKUs.reduce((sum, item) => sum + item.forecastDemand, 0);
    return Math.round((total / calculatedSKUs.length) * 10) / 10;
  }, [calculatedSKUs]);

  // AVL Tree generation
  const { avlTree, avlTreeData, avlHeight, avlMinNode, avlInOrder, rotationLogs } = useMemo(() => {
    const tree = new AVLTree();
    for (const sku of calculatedSKUs) {
      tree.insert(sku);
    }
    return {
      avlTree: tree,
      avlTreeData: tree.toData(),
      avlHeight: tree.getHeight(),
      avlMinNode: tree.findMinimum(),
      avlInOrder: tree.inOrderTraversal(),
      rotationLogs: tree.rotationLogs,
    };
  }, [calculatedSKUs]);

  // Supplier Graph instance
  const supplierGraph = useMemo(() => {
    return new SupplierGraph(SUPPLIER_NODES, SUPPLIER_EDGES);
  }, []);

  const bfsResult = useMemo(() => {
    return supplierGraph.runBFS('WH', 'Store').result;
  }, [supplierGraph]);

  const dfsResult = useMemo(() => {
    return supplierGraph.runDFS('WH', 'Store').result;
  }, [supplierGraph]);

  // Action: Update stock inline
  const updateStock = useCallback(
    (id: string, newStock: number) => {
      const sanitized = Math.max(0, Math.floor(newStock));
      const target = skus.find((s) => s.id === id);
      if (!target) return;

      const updated = skus.map((item) =>
        item.id === id ? { ...item, currentStock: sanitized } : item
      );
      persistSKUs(updated);

      addToast(
        'Stock Level Updated',
        `${target.name} stock changed to ${sanitized} units. Reorder point recalculated live.`,
        'info'
      );
    },
    [skus, persistSKUs, addToast]
  );

  // Action: Update general SKU attributes
  const updateSKU = useCallback(
    (id: string, updates: Partial<SKUItem>) => {
      const updated = skus.map((item) => (item.id === id ? { ...item, ...updates } : item));
      persistSKUs(updated);
      addToast('SKU Updated', `Changes to SKU ${id} saved successfully.`, 'success');
    },
    [skus, persistSKUs, addToast]
  );

  // Action: Add new SKU
  const addSKU = useCallback(
    (newItem: Omit<SKUItem, 'id'>): CalculatedSKU => {
      const nextIdNum = skus.length + 1;
      const formattedId = `SKU-${String(nextIdNum).padStart(3, '0')}`;
      const newSku: SKUItem = {
        ...newItem,
        id: formattedId,
        customAdded: true,
      };

      const updatedList = [...skus, newSku];
      persistSKUs(updatedList);

      // Check if this insertion triggered a rotation
      const testTree = new AVLTree();
      for (const item of processAllSKUs(updatedList)) {
        testTree.insert(item);
      }
      if (testTree.rotationLogs.length > 0) {
        const latest = testTree.rotationLogs[testTree.rotationLogs.length - 1];
        setLastRotationEvent(latest);
      }

      addToast(
        'New SKU Added',
        `"${newSku.name}" inserted into AVL Tree and inventory table.`,
        'success'
      );

      return processAllSKUs([newSku])[0];
    },
    [skus, persistSKUs, addToast]
  );

  // Action: Delete SKU
  const deleteSKU = useCallback(
    (id: string) => {
      const target = skus.find((s) => s.id === id);
      const updated = skus.filter((s) => s.id !== id);
      persistSKUs(updated);
      if (target) {
        addToast('SKU Removed', `"${target.name}" removed from inventory system.`, 'info');
      }
    },
    [skus, persistSKUs, addToast]
  );

  // Action: Quick reorder single item
  const reorderItem = useCallback(
    (id: string, quantity?: number) => {
      const target = calculatedSKUs.find((s) => s.id === id);
      if (!target) return;

      const restockAmount = quantity ?? Math.max(30, Math.ceil(target.reorderThreshold * 1.5));
      const newStock = target.currentStock + restockAmount;

      const updated = skus.map((item) =>
        item.id === id ? { ...item, currentStock: newStock } : item
      );
      persistSKUs(updated);

      addToast(
        'Restock Order Dispatched',
        `Dispatched PO for ${restockAmount} units of ${target.name} via fastest route WH -> S2 -> Store. Stock is now ${newStock} units.`,
        'success'
      );
    },
    [calculatedSKUs, skus, persistSKUs, addToast]
  );

  // Action: Reorder all urgent items
  const reorderAllUrgent = useCallback(() => {
    if (urgentSKUs.length === 0) {
      addToast('All Items Stocked', 'No items currently below reorder threshold.', 'info');
      return;
    }

    const updated = skus.map((item) => {
      const match = urgentSKUs.find((u) => u.id === item.id);
      if (match) {
        const restockAmount = Math.max(25, Math.ceil(match.reorderThreshold * 1.5));
        return { ...item, currentStock: item.currentStock + restockAmount };
      }
      return item;
    });

    persistSKUs(updated);
    addToast(
      'Bulk Restock Order Created',
      `Auto-replenished ${urgentSKUs.length} urgent SKUs via regional supplier network. All stocks restored to healthy thresholds.`,
      'success'
    );
  }, [urgentSKUs, skus, persistSKUs, addToast]);

  // Action: Reset to seed defaults
  const resetToDefaults = useCallback(() => {
    persistSKUs(INITIAL_SKUS);
    localStorage.removeItem(STORAGE_KEY);
    addToast('Inventory Reset', 'Inventory restored to initial 12 seed supermarket SKUs.', 'info');
  }, [persistSKUs, addToast]);

  return (
    <InventoryContext.Provider
      value={{
        skus,
        calculatedSKUs,
        urgentSKUs,
        okSKUs,
        lowestStockSKU,
        averageDailyForecast,
        avlTree,
        avlTreeData,
        avlHeight,
        avlMinNode,
        avlInOrder,
        rotationLogs,
        lastRotationEvent,
        supplierGraph,
        bfsResult,
        dfsResult,
        updateStock,
        updateSKU,
        addSKU,
        deleteSKU,
        resetToDefaults,
        reorderItem,
        reorderAllUrgent,
        toasts,
        dismissToast,
        addToast,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export function useInventory(): InventoryContextType {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
