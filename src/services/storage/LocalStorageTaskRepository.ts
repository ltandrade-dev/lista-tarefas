import type { Task } from '../../types/task';
import type { TaskRepository, CreateTaskInput, UpdateTaskInput } from './TaskRepository';
import { INITIAL_SEED_TASKS } from './initialSeed';

const STORAGE_KEY = 'taskflow_tasks_v1';

export class LocalStorageTaskRepository implements TaskRepository {
  private getRawTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Inicializa com seed na primeira vez
        this.saveRawTasks(INITIAL_SEED_TASKS);
        return INITIAL_SEED_TASKS;
      }
      return JSON.parse(data) as Task[];
    } catch (error) {
      console.error('Falha ao ler tarefas do LocalStorage:', error);
      return [];
    }
  }

  private saveRawTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Falha ao salvar tarefas no LocalStorage:', error);
      throw new Error('Não foi possível salvar os dados no armazenamento local.');
    }
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async getAll(): Promise<Task[]> {
    return this.getRawTasks();
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = this.getRawTasks();
    return tasks.find(t => t.id === id) || null;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const tasks = this.getRawTasks();
    const now = new Date().toISOString();

    const newTask: Task = {
      id: this.generateId(),
      title: input.title.trim(),
      description: input.description?.trim() || '',
      category: input.category || 'Geral',
      priority: input.priority || 'medium',
      dueDate: input.dueDate || new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    const updatedTasks = [newTask, ...tasks];
    this.saveRawTasks(updatedTasks);
    return newTask;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const tasks = this.getRawTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error(`Tarefa com ID ${id} não encontrada.`);
    }

    const currentTask = tasks[index];
    const updatedTask: Task = {
      ...currentTask,
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description.trim() } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
      ...(input.completed !== undefined ? { completed: input.completed } : {}),
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    this.saveRawTasks(tasks);
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const tasks = this.getRawTasks();
    const filtered = tasks.filter(t => t.id !== id);
    this.saveRawTasks(filtered);
  }

  async toggleComplete(id: string): Promise<Task> {
    const tasks = this.getRawTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) {
      throw new Error(`Tarefa com ID ${id} não encontrada.`);
    }

    return this.update(id, { completed: !task.completed });
  }

  async resetToDefault(): Promise<Task[]> {
    this.saveRawTasks(INITIAL_SEED_TASKS);
    return INITIAL_SEED_TASKS;
  }
}
