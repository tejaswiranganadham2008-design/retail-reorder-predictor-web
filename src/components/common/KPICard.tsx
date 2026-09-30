import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'amber' | 'blue' | 'emerald';
  badge?: string;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  badge,
  onClick,
}) => {
  const variantStyles = {
    default: {
      card: 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900',
      iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    },
    amber: {
      card: 'border-amber-300/70 dark:border-amber-600/40 bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-900 dark:to-amber-950/20 shadow-glow-amber/10',
      iconBg: 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700',
    },
    blue: {
      card: 'border-blue-200 dark:border-blue-800/40 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-950/20 shadow-glow-blue/10',
      iconBg: 'bg-blue-100 dark:bg-blue-950 text-brand-blue dark:text-blue-400',
      badge: 'bg-blue-100 dark:bg-blue-950 text-brand-blue dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    },
    emerald: {
      card: 'border-emerald-200 dark:border-emerald-800/40 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-900 dark:to-emerald-950/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 relative overflow-hidden transition-all duration-300 ${style.card} ${
        onClick ? 'cursor-pointer hover:shadow-soft-lg hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className={`p-3 rounded-2xl ${style.iconBg} transition-transform duration-200`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
