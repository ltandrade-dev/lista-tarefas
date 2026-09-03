# TaskFlow

> Aplicação web multi-usuário de gerenciamento de tarefas com autenticação, persistência em nuvem e interface moderna.

---

## Descrição

O **TaskFlow** é um gerenciador de tarefas full-stack desenvolvido com **React**, **TypeScript** e **Supabase**, pensado para múltiplos usuários com isolamento total de dados por perfil. Cada usuário possui seu próprio espaço privado, protegido pelas políticas de **Row Level Security (RLS)** do PostgreSQL via Supabase.

A aplicação conta com visualização em lista, calendário e painel de analytics, além de suporte completo ao modo claro e escuro.

---

## Funcionalidades

- **Autenticação completa** — cadastro, login, logout e recuperação de senha via Supabase Auth
- **Perfis multi-usuário** — cada usuário visualiza e gerencia apenas suas próprias tarefas
- **CRUD de tarefas** — criação, edição, exclusão e marcação de conclusão
- **Prioridades** — baixa, média, alta e urgente
- **Categorias personalizáveis** — Trabalho, Pessoal, Estudos, Finanças, Saúde, Projetos e customizadas
- **Data de vencimento** — com destaque visual para tarefas atrasadas ou vencendo hoje
- **Filtros e busca** — por status, categoria, prioridade e texto livre
- **Ordenação** — por data, prioridade, criação e título
- **Visualização em Calendário** — visão mensal com distribuição das tarefas
- **Analytics e Métricas** — taxa de conclusão, distribuição por prioridade e categoria
- **Notificações Toast** — feedback visual para todas as ações
- **Celebração de conclusão** — efeito de confete ao concluir uma tarefa
- **Modo Escuro / Claro** — alternância com persistência e sem flicker no carregamento
- **Design responsivo** — funciona em dispositivos móveis e desktop

---

## Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| Frontend | [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/) |
| Build tool | [Vite 8](https://vite.dev/) |
| Estilização | [Tailwind CSS v4](https://tailwindcss.com/) |
| Backend / Auth / DB | [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS) |
| Ícones | [Lucide React](https://lucide.dev/) |
| Animações | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| Linter | [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- [npm](https://www.npmjs.com/) v10 ou superior
- Conta no [Supabase](https://supabase.com/) com um projeto criado

---

## Instalação

Clone o repositório e instale as dependências:

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd taskflow

# Instale as dependências
npm install
```

---

## Configuração das Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com as suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com os valores reais do seu projeto Supabase:

```env
VITE_SUPABASE_URL=https://<seu-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-anon-key>
```

> **Onde encontrar as credenciais:**
> Acesse o [Dashboard do Supabase](https://supabase.com/dashboard) > seu projeto > **Settings** > **API**.
> - `VITE_SUPABASE_URL` → **Project URL**
> - `VITE_SUPABASE_ANON_KEY` → **Project API Keys** > `anon public`

> ⚠️ **Segurança:** Nunca versione o arquivo `.env` com valores reais. Ele já está incluído no `.gitignore`.

---

## Banco de Dados (Supabase)

O schema do banco é gerenciado diretamente no Supabase. Certifique-se de aplicar a migration abaixo no seu projeto:

```sql
-- Tabela de tarefas
CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT 'Geral',
  priority    TEXT NOT NULL DEFAULT 'medium'
                CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date    DATE NOT NULL,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_tasks_user_id   ON tasks (user_id);
CREATE INDEX idx_tasks_completed ON tasks (completed);
CREATE INDEX idx_tasks_due_date  ON tasks (due_date);
CREATE INDEX idx_tasks_created_at ON tasks (created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE USING (auth.uid() = user_id);
```

---

## Como Executar Localmente

```bash
# Servidor de desenvolvimento com hot-reload
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Executa o linter (Oxlint) |

---

## Estrutura do Projeto

```
src/
├── App.tsx                      # Componente raiz com roteamento de auth
├── main.tsx                     # Entry point da aplicação
├── index.css                    # Estilos globais + Tailwind CSS v4
│
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação Supabase
│
├── hooks/
│   ├── useAuth.ts               # Hook de autenticação
│   ├── useTasks.ts              # Hook de gerenciamento de tarefas
│   └── useTheme.ts              # Hook de tema claro/escuro
│
├── lib/
│   └── supabaseClient.ts        # Cliente Supabase singleton
│
├── services/
│   └── storage/
│       ├── TaskRepository.ts            # Interface do repositório
│       ├── SupabaseTaskRepository.ts    # Implementação Supabase
│       ├── LocalStorageTaskRepository.ts # Implementação local (legado)
│       ├── initialSeed.ts               # Dados iniciais de exemplo
│       └── index.ts                     # Exportação do singleton ativo
│
├── types/
│   └── task.ts                  # Tipos e constantes de tarefas
│
└── components/
    ├── auth/
    │   ├── AuthPage.tsx         # Tela de login, cadastro e recuperação
    │   └── ResetPasswordModal.tsx
    ├── layout/
    │   ├── Header.tsx
    │   ├── NavigationTabs.tsx
    │   └── UserProfileMenu.tsx
    ├── tasks/
    │   ├── TaskList.tsx
    │   ├── TaskCard.tsx
    │   ├── TaskModal.tsx
    │   └── TaskDeleteModal.tsx
    ├── calendar/
    │   └── TaskCalendar.tsx
    ├── analytics/
    │   └── TaskAnalytics.tsx
    └── ui/
        └── Toast.tsx
```

---

## Informações para Desenvolvimento

- **Arquitetura de Repositório**: a camada de persistência é abstraída pela interface `TaskRepository`. Para alternar entre o armazenamento local e o Supabase, basta modificar o singleton em `src/services/storage/index.ts`.
- **Row Level Security**: todas as operações no banco já são filtradas pelo Supabase no nível do PostgreSQL com base no `auth.uid()` do usuário logado.
- **Variante de tema escuro**: configurada via `@custom-variant dark` no Tailwind CSS v4, ativada pela classe `dark` no elemento `<html>`.
- **Prevenção de flicker**: o tema é aplicado por um script inline no `<head>` do `index.html` antes do carregamento do React.

---

## Observações de Segurança

- O arquivo `.env` **não deve ser versionado**. Utilize `.env.example` como referência.
- A `VITE_SUPABASE_ANON_KEY` é uma chave pública segura para uso no frontend. Seu acesso é controlado pelas políticas de RLS do Supabase.
- A `service_role` key (chave de serviço) do Supabase **nunca deve ser usada no frontend**.
- Se qualquer credencial real for acidentalmente exposta em um commit, ela deve ser **revogada/rotacionada imediatamente** no Dashboard do Supabase.

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

