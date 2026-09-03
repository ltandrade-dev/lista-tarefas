\# Prompt — Aplicativo Web de Lista de Tarefas



\## 1. Papel



Atue como um \*\*desenvolvedor Full Stack Sênior\*\*, com forte experiência em:



\- React

\- TypeScript

\- Tailwind CSS

\- UI/UX Design

\- Desenvolvimento de aplicações web responsivas

\- Arquitetura de componentes

\- Gerenciamento de estado

\- Persistência de dados

\- Boas práticas de acessibilidade

\- Código limpo, reutilizável e escalável



Utilize a \*\*skill `frontend-design`\*\* para orientar a criação da interface.



Caso outras skills sejam necessárias para melhorar a qualidade da implementação, \*\*utilize-as também\*\*.



\---



\# 2. Objetivo do Projeto



Desenvolva um aplicativo web moderno de \*\*Lista de Tarefas (To-Do List)\*\*, funcional, responsivo e visualmente refinado.



O aplicativo deve permitir que o usuário gerencie suas tarefas de forma simples e eficiente, incluindo:



\- Criação de tarefas

\- Visualização de tarefas

\- Edição de tarefas

\- Exclusão de tarefas

\- Conclusão de tarefas

\- Categorização

\- Priorização

\- Definição de data de vencimento

\- Filtragem

\- Análises

\- Visualização em calendário



A primeira versão deverá utilizar \*\*LocalStorage\*\* para persistência dos dados.



> \*\*Importante:\*\* posteriormente, o LocalStorage será substituído pelo \*\*Supabase\*\*. Portanto, estruture o código de forma que a camada de persistência possa ser facilmente substituída sem precisar reescrever a lógica principal da aplicação.



\---



\# 3. Stack Tecnológica



Utilize preferencialmente:



\- React

\- TypeScript

\- Tailwind CSS

\- Vite



Bibliotecas adicionais podem ser utilizadas quando agregarem valor ao projeto.



Para ícones, utilize uma biblioteca consistente, como:



\- Lucide React



Evite adicionar dependências desnecessárias.



\---



\# 4. Funcionalidades Principais



\## 4.1 CRUD de Tarefas



O usuário deve conseguir:



\- Criar uma nova tarefa

\- Visualizar tarefas existentes

\- Editar uma tarefa

\- Marcar uma tarefa como concluída

\- Reabrir uma tarefa concluída

\- Excluir uma tarefa



A exclusão deve possuir uma interação clara e evitar exclusões acidentais quando fizer sentido.



\---



\## 4.2 Estrutura de uma Tarefa



Cada tarefa deve possuir, no mínimo, os seguintes campos:



```text

id

title

description

category

priority

dueDate

completed

createdAt

updatedAt



