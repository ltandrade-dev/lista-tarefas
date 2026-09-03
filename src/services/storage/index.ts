import type { TaskRepository } from './TaskRepository';
import { SupabaseTaskRepository } from './SupabaseTaskRepository';

/**
 * Instância singleton do repositório de tarefas ativo.
 * Utiliza o Supabase como backend de persistência em nuvem.
 * Para reverter ao armazenamento local, basta instanciar LocalStorageTaskRepository aqui.
 */
export const taskRepository: TaskRepository = new SupabaseTaskRepository();

export * from './TaskRepository';
export * from './SupabaseTaskRepository';
