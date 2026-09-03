import type { Task } from '../../types/task';

// Função auxiliar para gerar datas relativas (YYYY-MM-DD)
const getRelativeDate = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

const now = new Date().toISOString();

export const INITIAL_SEED_TASKS: Task[] = [
  {
    id: 'task-seed-1',
    title: 'Revisar documentação técnica da arquitetura',
    description: 'Verificar os diagramas de persistência e interfaces do repositório.',
    category: 'Trabalho',
    priority: 'high',
    dueDate: getRelativeDate(0), // Hoje
    completed: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-seed-2',
    title: 'Finalizar protótipo do sistema de notificações',
    description: 'Implementar toasts visuais para feedback de ações do usuário.',
    category: 'Projetos',
    priority: 'urgent',
    dueDate: getRelativeDate(1), // Amanhã
    completed: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-seed-3',
    title: 'Estudo de caso: Padrões de acessibilidade WCAG',
    description: 'Avaliar contraste de cores e navegação por teclado nos componentes da interface.',
    category: 'Estudos',
    priority: 'medium',
    dueDate: getRelativeDate(3),
    completed: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-seed-4',
    title: 'Organizar planilha de despesas mensais',
    description: 'Revisar lançamentos bancários e atualizar conciliação de faturas.',
    category: 'Finanças',
    priority: 'low',
    dueDate: getRelativeDate(5),
    completed: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-seed-5',
    title: 'Treino funcional e caminhada ao ar livre',
    description: 'Atividade física aeróbica de 45 minutos para manter o foco e bem-estar.',
    category: 'Saúde',
    priority: 'medium',
    dueDate: getRelativeDate(0), // Hoje
    completed: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-seed-6',
    title: 'Planejar sprint do próximo trimestre',
    description: 'Definir metas chave e alinhamento com stakeholders estratégicos.',
    category: 'Trabalho',
    priority: 'urgent',
    dueDate: getRelativeDate(7),
    completed: false,
    createdAt: now,
    updatedAt: now,
  },
];
