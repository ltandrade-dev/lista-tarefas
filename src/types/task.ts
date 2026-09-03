export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  dueDate: string; // Formato YYYY-MM-DD
  completed: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export type TaskStatusFilter = 'all' | 'pending' | 'completed';
export type TaskSortOption = 'dueDate' | 'priority' | 'createdAt' | 'title';
export type TaskSortOrder = 'asc' | 'desc';

export interface TaskFilters {
  search: string;
  category: string;
  priority: string;
  status: TaskStatusFilter;
  sortBy: TaskSortOption;
  sortOrder: TaskSortOrder;
}

export interface TaskAnalyticsData {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  overdue: number;
  dueToday: number;
  byPriority: Record<TaskPriority, number>;
  byCategory: Record<string, { total: number; completed: number }>;
}

export const DEFAULT_CATEGORIES = [
  'Trabalho',
  'Pessoal',
  'Estudos',
  'Finanças',
  'Saúde',
  'Projetos',
] as const;

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

export const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};
