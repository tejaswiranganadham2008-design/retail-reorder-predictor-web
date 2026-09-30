import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { AVLTreeVisualizer } from '../components/visual/AVLTreeVisualizer';
import { Sparkles } from 'lucide-react';

interface AVLTreePageProps {
  onOpenAddModal: () => void;
  onSelectSKUForForecast?: (skuId: string) => void;
  onNavigate?: (tab: any) => void;
}

export const AVLTreePage: React.FC<AVLTreePageProps> = ({
  onOpenAddModal,
  onSelectSKUForForecast,
}) => {
  const {
    avlTreeData,
    avlHeight,
    avlMinNode,
    avlInOrder,
    rotationLogs,
    lastRotationEvent,
  } = useInventory();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Visualizer Component */}
      <AVLTreeVisualizer
        rootData={avlTreeData}
        height={avlHeight}
        minNode={avlMinNode}
        inOrder={avlInOrder}
        rotationLogs={rotationLogs}
        onSelectSKU={(id: string) => {
          if (onSelectSKUForForecast) onSelectSKUForForecast(id);
        }}
        onOpenAddModal={onOpenAddModal}
      />

      {/* Rotation Notification Pill if insertion just occurred */}
      {lastRotationEvent && (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-start gap-3 animate-slide-up">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-2">
              <span>AVL Rebalancing Triggered: {lastRotationEvent.type} Rotation</span>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">
                {lastRotationEvent.timestamp}
              </span>
            </h4>
            <p className="text-purple-800 dark:text-purple-300">
              {lastRotationEvent.reason}
            </p>
          </div>
        </div>
      )}

      {/* Deep-Dive Theory & Rotation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* LL Rotation Card */}
        <div className="glass-card p-4 space-y-2 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Left-Left (LL) Case
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-brand-blue font-bold">
              Right Rotate
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Occurs when a node has Balance Factor +2 and the new stock item was inserted into the left subtree of the left child. Fixed by a single Right Rotation around the unbalance root.
          </p>
        </div>

        {/* RR Rotation Card */}
        <div className="glass-card p-4 space-y-2 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Right-Right (RR) Case
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
              Left Rotate
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Occurs when a node has Balance Factor -2 and the new stock item was inserted into the right subtree of the right child. Fixed by a single Left Rotation.
          </p>
        </div>

        {/* LR Rotation Card */}
        <div className="glass-card p-4 space-y-2 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Left-Right (LR) Case
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
              Double (L &rarr; R)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Occurs when a node has BF +2 and insertion was in the right subtree of the left child. Solved by Left Rotating the left child followed by Right Rotating the parent.
          </p>
        </div>

        {/* RL Rotation Card */}
        <div className="glass-card p-4 space-y-2 border-l-4 border-l-pink-500">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Right-Left (RL) Case
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold">
              Double (R &rarr; L)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Occurs when a node has BF -2 and insertion was in the left subtree of the right child. Solved by Right Rotating the right child followed by Left Rotating the parent.
          </p>
        </div>
      </div>
    </div>
  );
};
