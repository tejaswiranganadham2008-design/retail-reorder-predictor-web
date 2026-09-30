import React from 'react';
import { ReorderStatus } from '../../types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: ReorderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const isReorder = status === 'REORDER TODAY';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-bold',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  if (isReorder) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shadow-sm ${sizeClasses[size]}`}
        role="status"
        aria-label="Reorder Today Alert"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        {showIcon && <AlertCircle size={iconSizes[size]} className="text-amber-600 dark:text-amber-400" />}
        <span>REORDER TODAY</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 shadow-sm ${sizeClasses[size]}`}
      role="status"
      aria-label="Stock Level OK"
    >
      <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      {showIcon && <CheckCircle2 size={iconSizes[size]} className="text-emerald-600 dark:text-emerald-400" />}
      <span>OK</span>
    </span>
  );
};
