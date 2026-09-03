import { Check, Edit2, Trash2, Calendar } from 'lucide-react';
import type { Task } from '../../types/task';
import { PriorityBadge, CategoryBadge, DueDateBadge } from '../ui/Badge';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`group relative p-4.5 sm:p-5 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800/60 opacity-80 hover:opacity-100'
          : 'bg-white border-slate-200/90 dark:bg-slate-900 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox circular customizado */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? 'Reabrir tarefa' : 'Concluir tarefa'}
          className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : 'border-slate-300 dark:border-slate-600 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/30'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Informações da Tarefa */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`text-base font-semibold leading-snug break-words transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h3>

            {/* Ações de Edição e Exclusão */}
            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Editar tarefa"
                aria-label="Editar tarefa"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                title="Excluir tarefa"
                aria-label="Excluir tarefa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Descrição opcional */}
          {task.description && (
            <p
              className={`mt-1.5 text-sm leading-relaxed ${
                task.completed
                  ? 'text-slate-400 dark:text-slate-500 line-through'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadados e Badges */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <PriorityBadge priority={task.priority} size="sm" />

            {task.category && (
              <div className="flex items-center gap-1">
                <CategoryBadge category={task.category} />
              </div>
            )}

            <div className="flex items-center gap-1.5 ml-auto">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <DueDateBadge dueDate={task.dueDate} completed={task.completed} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
