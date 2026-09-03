import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  progress?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  progress,
}) => {
  const variantStyles = {
    default: 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900',
    success: 'border-emerald-200/80 dark:border-emerald-900/50 bg-white dark:bg-slate-900',
    warning: 'border-amber-200/80 dark:border-amber-900/50 bg-white dark:bg-slate-900',
    danger: 'border-rose-200/80 dark:border-rose-900/50 bg-white dark:bg-slate-900',
    info: 'border-sky-200/80 dark:border-sky-900/50 bg-white dark:bg-slate-900',
  };

  const iconStyles = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    danger: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
    info: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
  };

  const progressColors = {
    default: 'bg-slate-600 dark:bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
  };

  return (
    <div
      className={`relative p-5 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconStyles[variant]}`}>
          {icon}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${progressColors[variant]}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
