import { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  Plus,
  Inbox,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import type {
  Task,
  TaskFilters,
  TaskPriority,
  TaskSortOption,
  TaskStatusFilter,
} from '../../types/task';
import { PRIORITY_LABELS } from '../../types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  allTasksCount: number;
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  categories: string[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onOpenNewTaskModal: () => void;
}

export const TaskList = ({
  tasks,
  allTasksCount,
  filters,
  setFilters,
  categories,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenNewTaskModal,
}: TaskListProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all';

  const handleClearFilters = () => {
    setFilters(prev => ({
      ...prev,
      search: '',
      category: 'all',
      priority: 'all',
      status: 'all',
    }));
  };

  const statusTabs: { id: TaskStatusFilter; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'pending', label: 'Pendentes' },
    { id: 'completed', label: 'Concluídas' },
  ];

  return (
    <div className="space-y-5">
      {/* Barra de Busca e Filtros Rápidos */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="search-input"
              value={filters.search}
              onChange={e =>
                setFilters(prev => ({ ...prev, search: e.target.value }))
              }
              placeholder="Buscar tarefas por título ou descrição..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
                aria-label="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 shrink-0">
            {statusTabs.map(tab => {
              const active = filters.status === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setFilters(prev => ({ ...prev, status: tab.id }))
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Botão de Filtros Avançados */}
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(prev => !prev)}
            className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors shrink-0 ${
              showAdvancedFilters || hasActiveFilters
                ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300'
                : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros & Ordenação</span>
          </button>
        </div>

        {/* Linha de Filtros Avançados Expansível */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150">
            {/* Categoria */}
            <div>
              <label
                htmlFor="filter-category"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
              >
                Categoria
              </label>
              <select
                id="filter-category"
                value={filters.category}
                onChange={e =>
                  setFilters(prev => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridade */}
            <div>
              <label
                htmlFor="filter-priority"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
              >
                Prioridade
              </label>
              <select
                id="filter-priority"
                value={filters.priority}
                onChange={e =>
                  setFilters(prev => ({ ...prev, priority: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Todas as Prioridades</option>
                {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map(p => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenar Por */}
            <div>
              <label
                htmlFor="filter-sort-by"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
              >
                Ordenar Por
              </label>
              <select
                id="filter-sort-by"
                value={filters.sortBy}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    sortBy: e.target.value as TaskSortOption,
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="dueDate">Data de Vencimento</option>
                <option value="priority">Nível de Prioridade</option>
                <option value="createdAt">Data de Criação</option>
                <option value="title">Título Alfabético</option>
              </select>
            </div>

            {/* Ordem (Ascendente / Descendente) */}
            <div>
              <label
                htmlFor="filter-sort-order"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
              >
                Direção
              </label>
              <button
                type="button"
                id="filter-sort-order"
                onClick={() =>
                  setFilters(prev => ({
                    ...prev,
                    sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
                  }))
                }
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span>
                  {filters.sortOrder === 'asc' ? 'Crescente (A-Z / Menor)' : 'Decrescente (Z-A / Maior)'}
                </span>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* Resumo de Filtros Ativos com Botão de Limpar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Mostrando <strong>{tasks.length}</strong> de{' '}
              <strong>{allTasksCount}</strong> tarefas
            </span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 underline underline-offset-2"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      {/* Lista de Tarefas ou Estado Vazio */}
      {tasks.length > 0 ? (
        <div className="space-y-2.5">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Nenhuma tarefa encontrada
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'Nenhuma tarefa corresponde aos filtros aplicados. Tente ajustar os termos de busca ou filtros.'
              : 'Você ainda não possui tarefas cadastradas nesta seção. Comece organizando o seu dia!'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Limpar Filtros
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenNewTaskModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Primeira Tarefa</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
