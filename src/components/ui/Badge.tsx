import React from 'react';
import type { TaskPriority } from '../../types/task';
import { PRIORITY_LABELS } from '../../types/task';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const styles = {
    urgent: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    high: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    medium: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  };

  const dotStyles = {
    urgent: 'bg-rose-500',
    high: 'bg-amber-500',
    medium: 'bg-sky-500',
    low: 'bg-emerald-500',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${styles[priority]} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[priority]}`} />
      {PRIORITY_LABELS[priority]}
    </span>
  );
};

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
      {category}
    </span>
  );
};

interface DueDateBadgeProps {
  dueDate: string;
  completed?: boolean;
}

export const DueDateBadge: React.FC<DueDateBadgeProps> = ({ dueDate, completed }) => {
  const today = new Date().toISOString().split('T')[0];

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  if (completed) {
    return (
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Prazo: {formatDate(dueDate)}
      </span>
    );
  }

  const isOverdue = dueDate < today;
  const isToday = dueDate === today;

  if (isOverdue) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/50">
        Atrasada ({formatDate(dueDate)})
      </span>
    );
  }

  if (isToday) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
        Vence Hoje
      </span>
    );
  }

  return (
    <span className="text-xs text-slate-600 dark:text-slate-400">
      Vence em: {formatDate(dueDate)}
    </span>
  );
};
