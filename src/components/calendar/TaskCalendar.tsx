import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import type { Task } from '../../types/task';
import { PriorityBadge } from '../ui/Badge';

interface TaskCalendarProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onOpenNewTaskForDate: (dateStr: string) => void;
}

export const TaskCalendar: React.FC<TaskCalendarProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onOpenNewTaskForDate,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Mês por extenso em pt-BR
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Dias do mês
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: {
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    const todayStr = new Date().toISOString().split('T')[0];

    // Dias do mês anterior para preencher a primeira semana
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
      });
    }

    // Dias do próximo mês para completar 35 ou 42 células
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    return days;
  }, [year, month]);

  // Mapa de tarefas por data
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(task => {
      const list = map.get(task.dueDate) || [];
      list.push(task);
      map.set(task.dueDate, list);
    });
    return map;
  }, [tasks]);

  // Navegação de mês
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(now.toISOString().split('T')[0]);
  };

  // Tarefas do dia selecionado
  const selectedDayTasks = tasksByDate.get(selectedDateStr) || [];

  const formatSelectedDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Grade do Calendário (2 colunas em desktop) */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
        {/* Cabeçalho do Calendário */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
              {monthNames[month]} {year}
            </h2>
            <button
              type="button"
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Hoje
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dias da Semana */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map(day => (
            <span
              key={day}
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-1"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Células de Dias */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((cell, idx) => {
            const dayTasks = tasksByDate.get(cell.dateStr) || [];
            const isSelected = cell.dateStr === selectedDateStr;
            const hasPending = dayTasks.some(t => !t.completed);
            const hasUrgent = dayTasks.some(
              t => !t.completed && (t.priority === 'urgent' || t.priority === 'high')
            );

            return (
              <button
                key={`${cell.dateStr}-${idx}`}
                type="button"
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`min-h-16 sm:min-h-20 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 ring-2 ring-sky-500/20 z-10'
                    : cell.isCurrentMonth
                    ? 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                    : 'border-transparent bg-slate-50/40 dark:bg-slate-950/30 text-slate-300 dark:text-slate-700'
                }`}
              >
                {/* Número do dia */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                      cell.isToday
                        ? 'bg-sky-600 text-white font-bold'
                        : cell.isCurrentMonth
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {dayTasks.length > 0 && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        hasUrgent
                          ? 'bg-rose-500'
                          : hasPending
                          ? 'bg-sky-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  )}
                </div>

                {/* Resumo de tarefas do dia */}
                {dayTasks.length > 0 && (
                  <div className="mt-1 space-y-0.5 w-full overflow-hidden">
                    <div className="hidden sm:block">
                      {dayTasks.slice(0, 2).map(t => (
                        <div
                          key={t.id}
                          className={`text-[10px] truncate px-1 py-0.5 rounded ${
                            t.completed
                              ? 'line-through text-slate-400 bg-slate-100 dark:bg-slate-800'
                              : 'text-slate-700 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 font-medium'
                          }`}
                        >
                          {t.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium pl-1">
                          +{dayTasks.length - 2} mais
                        </span>
                      )}
                    </div>
                    <div className="sm:hidden text-[10px] font-bold text-sky-600 dark:text-sky-400">
                      {dayTasks.length} {dayTasks.length === 1 ? 'tarefa' : 'tarefas'}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Painel do Dia Selecionado */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Dia Selecionado</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize mt-1">
              {formatSelectedDate(selectedDateStr)}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onOpenNewTaskForDate(selectedDateStr)}
            className="p-2 rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors"
            title="Adicionar tarefa para este dia"
            aria-label="Nova tarefa para este dia"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de tarefas do dia selecionado */}
        {selectedDayTasks.length > 0 ? (
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {selectedDayTasks.map(task => (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  task.completed
                    ? 'bg-slate-50/60 border-slate-200/50 dark:bg-slate-900/40 dark:border-slate-800/40 opacity-75'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleComplete(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-sky-500'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold break-words ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <PriorityBadge priority={task.priority} size="sm" />
                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 font-medium"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Nenhuma tarefa para este dia.</p>
            <button
              type="button"
              onClick={() => onOpenNewTaskForDate(selectedDateStr)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar tarefa para este dia</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
