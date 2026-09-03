import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ListTodo,
  TrendingUp,
  FolderOpen,
} from 'lucide-react';
import type { TaskAnalyticsData, TaskPriority } from '../../types/task';
import { PRIORITY_LABELS } from '../../types/task';
import { StatCard } from '../ui/StatCard';

interface TaskAnalyticsProps {
  analytics: TaskAnalyticsData;
}

export const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ analytics }) => {
  const {
    total,
    completed,
    pending,
    completionRate,
    overdue,
    dueToday,
    byPriority,
    byCategory,
  } = analytics;

  const priorityOrder: TaskPriority[] = ['urgent', 'high', 'medium', 'low'];

  const priorityColors = {
    urgent: 'bg-rose-500',
    high: 'bg-amber-500',
    medium: 'bg-sky-500',
    low: 'bg-emerald-500',
  };

  const getProductivityStatus = () => {
    if (total === 0) return { label: 'Sem tarefas', color: 'text-slate-500' };
    if (overdue > 0)
      return {
        label: `${overdue} ${overdue === 1 ? 'tarefa atrasada requer atenção' : 'tarefas atrasadas requerem atenção'}`,
        color: 'text-rose-600 dark:text-rose-400',
      };
    if (completionRate >= 80)
      return { label: 'Produtividade excelente!', color: 'text-emerald-600 dark:text-emerald-400' };
    if (completionRate >= 50)
      return { label: 'Bom ritmo de entregas', color: 'text-sky-600 dark:text-sky-400' };
    return { label: 'Mantenha o foco nas tarefas pendentes', color: 'text-amber-600 dark:text-amber-400' };
  };

  const productivity = getProductivityStatus();

  return (
    <div className="space-y-6">
      {/* Banner de Resumo da Produtividade */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-200 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Painel de Produtividade</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1">
              Visão Geral do Desempenho
            </h2>
            <p className="text-sm text-sky-100 mt-1">{productivity.label}</p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
            <div>
              <p className="text-xs text-sky-200 uppercase font-semibold">
                Taxa de Conclusão
              </p>
              <p className="text-2xl font-black">{completionRate}%</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Tarefas"
          value={total}
          subtitle="Cadastradas no fluxo"
          icon={<ListTodo className="w-6 h-6" />}
          variant="default"
        />

        <StatCard
          title="Concluídas"
          value={completed}
          subtitle={`${completionRate}% do total`}
          icon={<CheckCircle2 className="w-6 h-6" />}
          variant="success"
          progress={completionRate}
        />

        <StatCard
          title="Pendentes"
          value={pending}
          subtitle={dueToday > 0 ? `${dueToday} vencem hoje` : 'Em andamento'}
          icon={<Clock className="w-6 h-6" />}
          variant={pending > 0 ? 'info' : 'default'}
        />

        <StatCard
          title="Atrasadas"
          value={overdue}
          subtitle={overdue === 0 ? 'Nenhum atraso!' : 'Requerem ação'}
          icon={<AlertTriangle className="w-6 h-6" />}
          variant={overdue > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Gráficos Visuais por Prioridade e Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Prioridade */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tarefas por Nível de Prioridade
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {total} tarefas
            </span>
          </div>

          <div className="space-y-4">
            {priorityOrder.map(priority => {
              const count = byPriority[priority] || 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={priority} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{PRIORITY_LABELS[priority]}</span>
                    <span>
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${priorityColors[priority]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribuição por Categoria */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Progresso por Categoria
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {Object.keys(byCategory).length} categorias
            </span>
          </div>

          {Object.keys(byCategory).length > 0 ? (
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {Object.entries(byCategory).map(([cat, stats]) => {
                const catRate =
                  stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0;

                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{cat}</span>
                      <span>
                        {stats.completed}/{stats.total} ({catRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sky-600 dark:bg-sky-500 transition-all duration-500 ease-out"
                        style={{ width: `${catRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-8 text-center">
              Nenhuma categoria registrada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
