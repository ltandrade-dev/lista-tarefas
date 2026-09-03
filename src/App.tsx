import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { AuthPage } from './components/auth/AuthPage';
import { ResetPasswordModal } from './components/auth/ResetPasswordModal';
import { Header } from './components/layout/Header';
import { NavigationTabs, type AppView } from './components/layout/NavigationTabs';
import { TaskList } from './components/tasks/TaskList';
import { TaskCalendar } from './components/calendar/TaskCalendar';
import { TaskAnalytics } from './components/analytics/TaskAnalytics';
import { TaskModal } from './components/tasks/TaskModal';
import { TaskDeleteModal } from './components/tasks/TaskDeleteModal';
import { ToastContainer, type ToastMessage } from './components/ui/Toast';
import type { Task } from './types/task';
import type { CreateTaskInput } from './services/storage';

function TaskFlowApp() {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoading: isAuthLoading, isPasswordRecovery, setIsPasswordRecovery } = useAuth();

  const {
    tasks,
    isLoading: isTasksLoading,
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
  } = useTasks();

  // Estados de Visualização e Modais
  const [activeView, setActiveView] = useState<AppView>('tasks');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Notificações Toast
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Handlers de Tarefas
  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewTaskForDate = (dateStr: string) => {
    setTaskToEdit({
      id: '',
      title: '',
      description: '',
      category: categories[0] || 'Geral',
      priority: 'medium',
      dueDate: dateStr,
      completed: false,
      createdAt: '',
      updatedAt: '',
    });
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleDeletePrompt = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete.id);
      addToast('Tarefa removida com sucesso.', 'info');
    } catch {
      addToast('Erro ao remover a tarefa.', 'error');
    }
  };

  const handleSubmitTask = async (data: CreateTaskInput) => {
    try {
      if (taskToEdit && taskToEdit.id) {
        await updateTask(taskToEdit.id, data);
        addToast('Tarefa atualizada com sucesso!', 'success');
      } else {
        await createTask(data);
        addToast('Nova tarefa adicionada com sucesso!', 'success');
      }
    } catch {
      addToast('Falha na operação com a tarefa.', 'error');
      throw new Error('Falha ao salvar');
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const updated = await toggleTaskComplete(id);
      if (updated.completed) {
        addToast('Tarefa concluída! Parabéns pelo foco.', 'success');
      } else {
        addToast('Tarefa reaberta para acompanhamento.', 'info');
      }
    } catch {
      addToast('Não foi possível alterar o status da tarefa.', 'error');
    }
  };

  const handleResetTasks = async () => {
    if (
      window.confirm(
        'Deseja restaurar as tarefas de demonstração para o seu perfil? Suas tarefas atuais deste perfil serão substituídas pelas tarefas de exemplo.'
      )
    ) {
      await resetTasks();
      addToast('Tarefas de exemplo restauradas com sucesso!', 'info');
    }
  };

  // Carregamento inicial da autenticação
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Iniciando TaskFlow...
        </p>
      </div>
    );
  }

  // Se o usuário não estiver logado, exibe tela de login / cadastro
  if (!user) {
    return <AuthPage theme={theme} onToggleTheme={toggleTheme} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Barra de Cabeçalho Superior */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenNewTaskModal={handleOpenNewTask}
        onResetTasks={handleResetTasks}
        totalPending={analytics.pending}
        analytics={analytics}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Seção Superior com Abas e Métricas Rápidas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <NavigationTabs
            activeView={activeView}
            onChangeView={setActiveView}
            tasksCount={tasks.length}
          />

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong>{analytics.completed}</strong> de <strong>{analytics.total}</strong> concluídas
            </span>
            <span>•</span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {analytics.completionRate}% de taxa de entrega
            </span>
          </div>
        </div>

        {/* Mensagem de Erro Global */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Telas de Visualização */}
        {isTasksLoading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Carregando suas tarefas...
            </p>
          </div>
        ) : (
          <>
            {activeView === 'tasks' && (
              <TaskList
                tasks={filteredTasks}
                allTasksCount={tasks.length}
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeletePrompt}
                onOpenNewTaskModal={handleOpenNewTask}
              />
            )}

            {activeView === 'calendar' && (
              <TaskCalendar
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onOpenNewTaskForDate={handleOpenNewTaskForDate}
              />
            )}

            {activeView === 'analytics' && (
              <TaskAnalytics analytics={analytics} />
            )}
          </>
        )}
      </main>

      {/* Rodapé Moderno */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            TaskFlow — Aplicativo multi-usuário com React, TypeScript, Tailwind CSS e Vite.
          </p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Supabase Auth & Database Ativos
          </p>
        </div>
      </footer>

      {/* Modais de Tarefas */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleSubmitTask}
        taskToEdit={taskToEdit}
        categories={categories}
      />

      <TaskDeleteModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Modal de Recuperação de Senha (acionado se o usuário veio de link de e-mail) */}
      <ResetPasswordModal
        isOpen={isPasswordRecovery}
        onClose={() => setIsPasswordRecovery(false)}
        onSuccess={() => {
          setIsPasswordRecovery(false);
          addToast('Sua senha foi redefinida com sucesso!', 'success');
        }}
      />

      {/* Notificações Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <TaskFlowApp />
    </AuthProvider>
  );
}

export default App;
