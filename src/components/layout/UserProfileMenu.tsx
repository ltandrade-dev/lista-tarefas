import React, { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, CheckCircle2, ListTodo } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { TaskAnalyticsData } from '../../types/task';

interface UserProfileMenuProps {
  analytics?: TaskAnalyticsData;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ analytics }) => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const fullName =
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Usuário';

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão Gatilho do Menu */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
          {getInitials(fullName)}
        </div>
        <div className="text-left hidden md:block max-w-[130px]">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
            {fullName}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight">
            {user.email}
          </p>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 animate-fadeIn">
          {/* Cabeçalho do Perfil */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                {getInitials(fullName)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {fullName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Resumo de Produtividade do Usuário */}
          {analytics && (
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Seu Desempenho
              </p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 mb-0.5">
                    <ListTodo className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Total</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {analytics.total}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60">
                  <div className="flex items-center justify-center gap-1 text-sky-600 dark:text-sky-400 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Entrega</span>
                  </div>
                  <span className="text-sm font-bold text-sky-700 dark:text-sky-300">
                    {analytics.completionRate}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Ações do Menu */}
          <div className="p-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
