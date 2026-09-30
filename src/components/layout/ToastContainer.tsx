import React from 'react';
import { useInventory, ToastNotification } from '../../context/InventoryContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useInventory();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastNotification; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-blue shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/95 dark:bg-slate-900/95',
    warning: 'border-amber-300 dark:border-amber-800/60 bg-amber-50/95 dark:bg-slate-900/95',
    error: 'border-red-300 dark:border-red-800/60 bg-red-50/95 dark:bg-slate-900/95',
    info: 'border-blue-200 dark:border-blue-800/60 bg-white/95 dark:bg-slate-900/95',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-soft-lg backdrop-blur-md animate-slide-up transition-all duration-200 ${borderMap[toast.type]}`}
    >
      {iconMap[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
          {toast.title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};
