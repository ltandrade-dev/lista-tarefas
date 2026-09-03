import React from 'react';
import { CheckSquare, Plus, Moon, Sun, RotateCcw } from 'lucide-react';
import { UserProfileMenu } from './UserProfileMenu';
import type { TaskAnalyticsData } from '../../types/task';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenNewTaskModal: () => void;
  onResetTasks: () => void;
  totalPending: number;
  analytics?: TaskAnalyticsData;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenNewTaskModal,
  onResetTasks,
  totalPending,
  analytics,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo & Marca */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                TaskFlow
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {totalPending === 0
                ? 'Todas as tarefas concluídas!'
                : `${totalPending} ${totalPending === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`}
            </p>
          </div>
        </div>

        {/* Ações Globais */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão de Restaurar Dados (Reset Seed) */}
          <button
            type="button"
            onClick={onResetTasks}
            title="Restaurar dados de exemplo"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Restaurar dados padrão de exemplo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Alternador de Tema */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Alternar tema claro e escuro"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Botão Primário: Nova Tarefa */}
          <button
            type="button"
            id="btn-nova-tarefa"
            onClick={onOpenNewTaskModal}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-medium text-xs sm:text-sm shadow-sm shadow-sky-600/30 hover:shadow-md hover:shadow-sky-600/40 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline sm:inline">Nova Tarefa</span>
          </button>

          {/* Menu de Perfil do Usuário */}
          <UserProfileMenu analytics={analytics} />
        </div>
      </div>
    </header>
  );
};
