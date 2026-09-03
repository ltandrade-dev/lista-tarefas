import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './useAuth';
import type {
  Task,
  TaskFilters,
  TaskPriority,
  TaskAnalyticsData,
} from '../types/task';
import {
  DEFAULT_CATEGORIES,
  PRIORITY_WEIGHTS,
} from '../types/task';
import {
  taskRepository,
  type CreateTaskInput,
  type UpdateTaskInput,
} from '../services/storage';

const INITIAL_FILTERS: TaskFilters = {
  search: '',
  category: 'all',
  priority: 'all',
  status: 'all',
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);

  // Carrega as tarefas do repositório
  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await taskRepository.getAll();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar lista de tarefas.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Lista dinâmica de categorias (padrão + encontradas nas tarefas)
  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    tasks.forEach(t => {
      if (t.category && t.category.trim()) {
        set.add(t.category.trim());
      }
    });
    return Array.from(set);
  }, [tasks]);

  // Criação de tarefa
  const createTask = async (input: CreateTaskInput): Promise<Task> => {
    try {
      const created = await taskRepository.create(input);
      setTasks(prev => [created, ...prev]);
      return created;
    } catch (err) {
      setError('Erro ao criar nova tarefa.');
      throw err;
    }
  };

  // Atualização de tarefa
  const updateTask = async (id: string, input: UpdateTaskInput): Promise<Task> => {
    try {
      const updated = await taskRepository.update(id, input);
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
      return updated;
    } catch (err) {
      setError('Erro ao atualizar tarefa.');
      throw err;
    }
  };

  // Exclusão de tarefa
  const deleteTask = async (id: string): Promise<void> => {
    try {
      await taskRepository.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Erro ao excluir tarefa.');
      throw err;
    }
  };

  // Alternar conclusão de tarefa
  const toggleTaskComplete = async (id: string): Promise<Task> => {
    try {
      const target = tasks.find(t => t.id === id);
      const willBeCompleted = target ? !target.completed : false;

      const updated = await taskRepository.toggleComplete(id);
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));

      // Efeito de celebração visual ao concluir (Peak-End rule)
      if (willBeCompleted) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#0284c7', '#10b981', '#f59e0b', '#6366f1'],
        });
      }

      return updated;
    } catch (err) {
      setError('Erro ao alterar status da tarefa.');
      throw err;
    }
  };

  // Restaurar dados padrão de demonstração
  const resetTasks = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const resetList = await taskRepository.resetToDefault();
      setTasks(resetList);
    } catch {
      setError('Erro ao restaurar tarefas padrão.');
    } finally {
      setIsLoading(false);
    }
  };

  // Tarefas filtradas e ordenadas
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Busca textual (título e descrição)
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(query);
          const matchesDesc = task.description.toLowerCase().includes(query);
          if (!matchesTitle && !matchesDesc) return false;
        }

        // Filtro por Categoria
        if (filters.category !== 'all' && task.category !== filters.category) {
          return false;
        }

        // Filtro por Prioridade
        if (filters.priority !== 'all' && task.priority !== filters.priority) {
          return false;
        }

        // Filtro por Status
        if (filters.status === 'completed' && !task.completed) {
          return false;
        }
        if (filters.status === 'pending' && task.completed) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;

        if (filters.sortBy === 'dueDate') {
          comparison = a.dueDate.localeCompare(b.dueDate);
        } else if (filters.sortBy === 'priority') {
          comparison = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
        } else if (filters.sortBy === 'createdAt') {
          comparison = b.createdAt.localeCompare(a.createdAt);
        } else if (filters.sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        }

        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [tasks, filters]);

  // Cálculo de Métricas e Análises
  const analytics = useMemo<TaskAnalyticsData>(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const overdue = tasks.filter(
      t => !t.completed && t.dueDate < todayStr
    ).length;

    const dueToday = tasks.filter(
      t => !t.completed && t.dueDate === todayStr
    ).length;

    const byPriority: Record<TaskPriority, number> = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    const byCategory: Record<string, { total: number; completed: number }> = {};

    tasks.forEach(task => {
      // Prioridade
      if (byPriority[task.priority] !== undefined) {
        byPriority[task.priority]++;
      }

      // Categoria
      const cat = task.category || 'Outros';
      if (!byCategory[cat]) {
        byCategory[cat] = { total: 0, completed: 0 };
      }
      byCategory[cat].total++;
      if (task.completed) {
        byCategory[cat].completed++;
      }
    });

    return {
      total,
      completed,
      pending,
      completionRate,
      overdue,
      dueToday,
      byPriority,
      byCategory,
    };
  }, [tasks]);

  return {
    tasks,
    isLoading,
    error,
    filters,
    setFilters,
    filteredTasks,
    categories,
    analytics,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    resetTasks,
    reloadTasks: loadTasks,
  };
}
