# 🛠️ Decisões Técnicas & Arquitetura

Este documento resume as principais decisões de arquitetura e escolhas tecnológicas adotadas durante o desenvolvimento do projeto. O objetivo principal foi construir uma solução robusta, escalável e de fácil manutenção, respeitando as boas práticas de desenvolvimento de software.

---

## Visão Geral da Arquitetura

A aplicação foi desenvolvida no formato **Monorepo**, dividida de forma clara em duas camadas principais:

1. **Backend:** Responsável pela regra de negócio, autenticação JWT com papéis (Admin/User), validações e acesso ao banco de dados relacional.
2. **Frontend:** Responsável pela interface do usuário em formato Kanban, estado global/local, renderização condicional de colunas e integrações diretas com o storage de arquivos.

---

## Principais Escolhas Tecnológicas

* **TypeScript em todo o ecossistema:** Garante tipagem ponta a ponta, prevenindo erros de runtime e acelerando o desenvolvimento com autocomplete e refatoração segura.
* **Prisma ORM & PostgreSQL:** Modelagem de dados forte e relacional, garantindo integridade referencial com remoção em cascata (`onDelete: Cascade`) entre tarefas e anexos.
* **Supabase Storage:** Arquitetura híbrida para arquivos. O backend armazena apenas os metadados (URL, nome, tipo) no banco relacional, enquanto os arquivos físicos são processados diretamente na nuvem com políticas RLS.
* **Next.js (App Router) & React Query:** Renderização rápida no cliente com gerenciamento de estado assíncrono e cache inteligente para evitar chamadas desnecessárias à API.

---

## Documentação Detalhada por Camada

Para entender os detalhes de implementação, padrões de código e decisões específicas de cada lado da aplicação, acesse os links abaixo:

* **[Decisões + Arquitetura do Backend](./decisions_backend.md)** — Explicação sobre o padrão Repository, middlewares de autenticação, estrutura de DTOs e scripts de seed.
* **[Decisões + Arquitetura do Frontend](../../client/docs/decisions_frontend.md)** — Detalhes sobre a arquitetura dos componentes (Dialogs/Sheets), renderização condicional do Kanban, otimização de render e gerenciamento de estado.

---

[← Voltar para o README principal](../../README.md)