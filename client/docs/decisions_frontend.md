# 🎨 Decisões Técnicas — Frontend

Este documento apresenta as principais tecnologias e decisões arquiteturais adotadas no desenvolvimento da interface web do projeto.

---

# Next.js (App Router)

A aplicação foi desenvolvida utilizando **Next.js** com **App Router**, organizando o projeto em rotas, componentes, serviços e hooks.

```text
src/
├── app/
├── components/
├── hooks/
├── services/
├── lib/
└── types/
```

Os **Route Groups** (`(auth)` e `(dashboard)`) foram utilizados para separar páginas públicas e privadas sem alterar as URLs da aplicação.

---

# Comunicação com a API

Toda a comunicação HTTP é realizada através de uma instância única do **Axios**.

Ela concentra:

- URL base da API;
- envio automático de Cookies (`withCredentials`);
- interceptors de requisição e resposta.

Essa centralização reduz duplicação de código e simplifica o tratamento global das requisições.

---

# Gerenciamento de Estado

Foram utilizadas duas estratégias diferentes.

## Context API

Responsável pelo estado global de autenticação.

Ao iniciar a aplicação, o `AuthProvider` tenta restaurar automaticamente a sessão através da rota:

```text
GET /api/auth/me
```

Em caso de sucesso, o Access Token é configurado automaticamente no Axios.

---

## TanStack Query

Os dados da aplicação (tarefas e anexos) são gerenciados pelo **TanStack Query**.

A biblioteca fornece:

- cache automático;
- gerenciamento de loading e erro;
- atualização automática após mutations através de `invalidateQueries`.

Isso reduz a necessidade de `useEffect` e simplifica o gerenciamento do estado do servidor.

---

# Interface

A interface foi construída utilizando **Tailwind CSS** e **Shadcn UI**.

- **Tailwind CSS** foi utilizado para estilização rápida e responsiva.
- **Shadcn UI** fornece componentes acessíveis e totalmente customizáveis.

---

# Upload de Arquivos

Os anexos são enviados diretamente para o **Supabase Storage**.

Após o upload, apenas a URL pública do arquivo é enviada ao backend para persistência no PostgreSQL.

Essa abordagem reduz a carga sobre a API e melhora o desempenho durante o envio de arquivos.

---

# Experiência do Usuário

Algumas funcionalidades foram implementadas para melhorar a navegação:

- restauração automática da sessão após atualizar a página;
- atualização otimista do Kanban durante movimentação de tarefas;
- sincronização automática dos dados utilizando TanStack Query.

---

← [**Voltar para o documento de Decisões Gerais**](../../server/docs/decisions.md)