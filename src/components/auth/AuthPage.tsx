import React, { useState } from 'react';
import {
  CheckSquare,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  Calendar,
  BarChart3,
  Cloud,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthPage: React.FC<AuthPageProps> = ({ theme, onToggleTheme }) => {
  const { signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validações básicas
    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Por favor, informe seu nome completo.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('As senhas não coincidem.');
        return;
      }
    } else if (mode === 'login') {
      if (!password) {
        setErrorMessage('Por favor, digite sua senha.');
        return;
      }
    }

    try {
      setIsLoading(true);

      if (mode === 'login') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('E-mail ou senha incorretos.');
          } else {
            setErrorMessage(error.message || 'Falha ao autenticar.');
          }
        }
      } else if (mode === 'signup') {
        const { error, user } = await signUp(email.trim(), password, fullName.trim());
        if (error) {
          setErrorMessage(error.message || 'Erro ao criar conta.');
        } else if (user && !user.confirmed_at && user.identities?.length === 0) {
          setErrorMessage('Este e-mail já está em uso.');
        } else {
          setSuccessMessage(
            'Conta criada com sucesso! Você já está conectado.'
          );
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email.trim());
        if (error) {
          setErrorMessage(error.message || 'Erro ao solicitar recuperação de senha.');
        } else {
          setSuccessMessage(
            'Enviamos as instruções de recuperação para o seu e-mail. Verifique sua caixa de entrada!'
          );
        }
      }
    } catch {
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Botão de Alternância de Tema Flutuante */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Painel Esquerdo: Banner Inspirador e Recursos */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Efeito sutil de background orb */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Marca & Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
            <p className="text-xs text-sky-300 font-medium">Gestão inteligente de tarefas</p>
          </div>
        </div>

        {/* Conteúdo Central e Recursos */}
        <div className="space-y-8 max-w-md relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Produtividade em Nuvem</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-snug">
              Organize sua rotina, alcance suas metas com clareza.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Cada usuário possui seu próprio espaço com privacidade e isolamento total no banco de dados Supabase.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Sincronização em Tempo Real</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Suas tarefas salvas com segurança no Supabase, acessíveis de qualquer lugar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Visualização em Calendário</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Acompanhe prazos e compromissos com visão diária e mensal integrada.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Métricas & Analytics Pessoais</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Visualize taxas de entrega, pendências e distribuição por prioridades.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do painel esquerdo */}
        <div className="text-xs text-slate-400 relative z-10">
          TaskFlow © {new Date().getFullYear()} — Plataforma de tarefas multi-usuário.
        </div>
      </div>

      {/* Painel Direito: Formulário de Autenticação */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Logo Mobile (visível em telas menores) */}
          <div className="flex lg:hidden items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                TaskFlow
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tarefas em nuvem</p>
            </div>
          </div>

          {/* Abas de Navegação (Login / Criar Conta) se não for 'forgot' */}
          {mode !== 'forgot' ? (
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Criar Conta
              </button>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5"
              >
                ← Voltar para o Login
              </button>
            </div>
          )}

          {/* Cabeçalho do Formulário */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {mode === 'login' && 'Bem-vindo de volta!'}
              {mode === 'signup' && 'Crie seu perfil'}
              {mode === 'forgot' && 'Recuperação de Senha'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'login' && 'Informe suas credenciais para acessar seu painel de tarefas.'}
              {mode === 'signup' && 'Comece a gerenciar suas tarefas de forma organizada e segura.'}
              {mode === 'forgot' && 'Digite seu e-mail cadastrado para receber o link de redefinição.'}
            </p>
          </div>

          {/* Mensagens de Alerta (Erro / Sucesso) */}
          {errorMessage && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo: Nome Completo (Apenas Cadastro) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Seu nome ou apelido"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {/* Campo: E-mail */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm transition-all"
                />
              </div>
            </div>

            {/* Campo: Senha (Login e Cadastro) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot')}
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Campo: Confirmar Senha (Apenas Cadastro) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {/* Botão de Submissão Principal */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold text-sm shadow-md shadow-sky-600/30 hover:shadow-sky-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Acessar Conta'}
                    {mode === 'signup' && 'Cadastrar Perfil'}
                    {mode === 'forgot' && 'Enviar Link de Recuperação'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Dica inferior de suporte */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
            Autenticação segura gerenciada pelo Supabase Auth.
          </p>
        </div>
      </div>
    </div>
  );
};
