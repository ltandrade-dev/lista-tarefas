import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Tag, AlertCircle } from 'lucide-react';
import type { Task, TaskPriority } from '../../types/task';
import { PRIORITY_LABELS } from '../../types/task';
import type { CreateTaskInput } from '../../services/storage';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  taskToEdit?: Task | null;
  categories: string[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializa com dados da tarefa a editar ou valores padrão
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category);
      setCustomCategory('');
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
    } else {
      setTitle('');
      setDescription('');
      setCategory(categories[0] || 'Trabalho');
      setCustomCategory('');
      setPriority('medium');
      setDueDate(new Date().toISOString().split('T')[0]);
    }
    setError(null);
  }, [taskToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSetQuickDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da tarefa.');
      return;
    }

    const finalCategory = category === '__custom__'
      ? (customCategory.trim() || 'Geral')
      : category;

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        priority,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch {
      setError('Falha ao salvar a tarefa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-200"
      >
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
            {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Fechar formulário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Título */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Título da Tarefa <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Concluir relatório financeiro trimestral"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition-colors"
            />
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="task-desc"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Descrição (Opcional)
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Adicione detalhes, links ou notas de apoio..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition-colors resize-none"
            />
          </div>

          {/* Categoria e Prioridade (2 colunas) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Categoria */}
            <div>
              <label
                htmlFor="task-category"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Categoria</span>
              </label>
              <select
                id="task-category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">+ Nova Categoria...</option>
              </select>

              {category === '__custom__' && (
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  className="mt-2 w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              )}
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Prioridade
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map(p => {
                  const isSelected = priority === p;
                  const colors = {
                    low: isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500',
                    medium: isSelected
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-500',
                    high: isSelected
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500',
                    urgent: isSelected
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-500',
                  }[p];

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all ${colors}`}
                    >
                      {PRIORITY_LABELS[p]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Data de Vencimento com Atalhos */}
          <div>
            <label
              htmlFor="task-due-date"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Data de Vencimento</span>
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                id="task-due-date"
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSetQuickDate(0)}
                  className="flex-1 sm:flex-none px-2.5 py-2 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickDate(1)}
                  className="flex-1 sm:flex-none px-2.5 py-2 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickDate(7)}
                  className="flex-1 sm:flex-none px-2.5 py-2 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  +7 dias
                </button>
              </div>
            </div>
          </div>

          {/* Rodapé e Botões de Submissão */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 disabled:opacity-50 text-white text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {isSubmitting
                ? 'Salvando...'
                : taskToEdit
                ? 'Salvar Alterações'
                : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
