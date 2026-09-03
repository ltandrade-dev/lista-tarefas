import { supabase } from '../../lib/supabaseClient';
import type { Task } from '../../types/task';
import type { TaskRepository, CreateTaskInput, UpdateTaskInput } from './TaskRepository';
import { INITIAL_SEED_TASKS } from './initialSeed';

// Tipo que representa uma linha da tabela `tasks` no Supabase (snake_case)
interface TaskRow {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  due_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Converte uma linha do banco (snake_case) para o modelo de domínio (camelCase).
 */
function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority as Task['priority'],
    dueDate: row.due_date,
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Implementação do repositório de tarefas utilizando o Supabase como backend.
 * Respeita a interface TaskRepository e utiliza Row Level Security (RLS)
 * para isolar os dados de cada usuário autenticado.
 */
export class SupabaseTaskRepository implements TaskRepository {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getAll error:', error);
      throw new Error('Erro ao buscar tarefas no banco de dados.');
    }

    return (data as TaskRow[]).map(rowToTask);
  }

  async getById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase getById error:', error);
      throw new Error(`Erro ao buscar tarefa com ID ${id}.`);
    }

    return data ? rowToTask(data as TaskRow) : null;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário precisa estar autenticado para criar tarefas.');
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: input.title.trim(),
        description: input.description?.trim() ?? '',
        category: input.category || 'Geral',
        priority: input.priority || 'medium',
        due_date: input.dueDate || new Date().toISOString().split('T')[0],
        completed: false,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase create error:', error);
      throw new Error('Erro ao criar nova tarefa.');
    }

    return rowToTask(data as TaskRow);
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const patch: Partial<TaskRow> = { updated_at: new Date().toISOString() };

    if (input.title !== undefined)       patch.title       = input.title.trim();
    if (input.description !== undefined) patch.description = input.description.trim();
    if (input.category !== undefined)    patch.category    = input.category;
    if (input.priority !== undefined)    patch.priority    = input.priority;
    if (input.dueDate !== undefined)     patch.due_date    = input.dueDate;
    if (input.completed !== undefined)   patch.completed   = input.completed;

    const { data, error } = await supabase
      .from('tasks')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(`Erro ao atualizar tarefa com ID ${id}.`);
    }

    return rowToTask(data as TaskRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`Erro ao excluir tarefa com ID ${id}.`);
    }
  }

  async toggleComplete(id: string): Promise<Task> {
    const task = await this.getById(id);

    if (!task) {
      throw new Error(`Tarefa com ID ${id} não encontrada.`);
    }

    return this.update(id, { completed: !task.completed });
  }

  async resetToDefault(): Promise<Task[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário precisa estar autenticado para restaurar tarefas.');
    }

    // Remove apenas as tarefas do usuário autenticado (garantido também pelo RLS)
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Supabase resetToDefault (delete) error:', deleteError);
      throw new Error('Erro ao limpar tarefas para restauração.');
    }

    const now = new Date().toISOString();
    const seedRows = INITIAL_SEED_TASKS.map(t => ({
      user_id: user.id,
      title: t.title,
      description: t.description,
      category: t.category,
      priority: t.priority,
      due_date: t.dueDate,
      completed: t.completed,
      created_at: now,
      updated_at: now,
    }));

    const { data, error: insertError } = await supabase
      .from('tasks')
      .insert(seedRows)
      .select();

    if (insertError) {
      console.error('Supabase resetToDefault (insert) error:', insertError);
      throw new Error('Erro ao restaurar tarefas padrão.');
    }

    return (data as TaskRow[]).map(rowToTask);
  }
}
