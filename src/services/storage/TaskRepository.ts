import type { Task } from '../../types/task';

export interface CreateTaskInput {
  title: string;
  description?: string;
  category: string;
  priority: Task['priority'];
  dueDate: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: string;
  priority?: Task['priority'];
  dueDate?: string;
  completed?: boolean;
}

/**
 * Interface abstrata do repositório de tarefas.
 * Permite a substituição transparente da persistência (LocalStorage por Supabase)
 * sem necessidade de alterações na interface ou na camada de hooks de negócio.
 */
export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task>;
  delete(id: string): Promise<void>;
  toggleComplete(id: string): Promise<Task>;
  resetToDefault(): Promise<Task[]>;
}
