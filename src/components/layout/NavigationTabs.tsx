import React from 'react';
import { CheckSquare, Calendar, BarChart3 } from 'lucide-react';

export type AppView = 'tasks' | 'calendar' | 'analytics';

interface NavigationTabsProps {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
  tasksCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeView,
  onChangeView,
  tasksCount,
}) => {
  const tabs = [
    {
      id: 'tasks' as AppView,
      label: 'Tarefas',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: tasksCount,
    },
    {
      id: 'calendar' as AppView,
      label: 'Calendário',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'analytics' as AppView,
      label: 'Análises & Métricas',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-900/60 rounded-xl border border-slate-300/40 dark:border-slate-800/80 w-fit backdrop-blur-sm">
      {tabs.map(tab => {
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            id={`tab-${tab.id}`}
            onClick={() => onChangeView(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              isActive
                ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-2 py-0.2 rounded-full text-xs font-semibold ${
                  isActive
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
