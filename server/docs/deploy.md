# ☁️ Arquitetura de Deploy

Este documento descreve a infraestrutura utilizada no ambiente de produção da aplicação.

---

# Visão Geral

A aplicação foi distribuída entre serviços especializados para cada responsabilidade.

```text
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│     Vercel (Web)       │ ───> │  Render (API Express)  │ ───> │ Render (PostgreSQL 18) │
│  Frontend (Next.js 15) │      │  Web Service (Node.js) │      │   Database Server      │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
            │                                                               
            └─────────────────────────────────────────────────────────> ┌────────────────────────┐
                                                                        │    Supabase Storage    │
                                                                        │  Bucket "ATTACHMENTS"  │
                                                                        └────────────────────────┘

```

Cada serviço possui uma responsabilidade específica:

| Serviço | Responsabilidade |
|---------|------------------|
| **Vercel** | Hospedagem do frontend (Next.js). |
| **Render** | Hospedagem da API Express. |
| **Render PostgreSQL** | Banco de dados relacional. |
| **Supabase Storage** | Armazenamento dos anexos. |

---

# Frontend

O frontend está hospedado na **Vercel**, com deploy automático sempre que há alterações na branch principal.
- 👉 https://taskflow-weld-six.vercel.app

As variáveis de ambiente configuradas são:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

# Backend

A API está hospedada na **Render** juntamente com o banco PostgreSQL.
- 👉 https://taskflow-api-ltm0.onrender.com

As principais variáveis utilizadas em produção são:

- `DATABASE_URL`
- `FRONTEND_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV`

---

# Banco de Dados

A persistência relacional é realizada utilizando **PostgreSQL 18**, hospedado na Render e acessado através do Prisma ORM.

---

# Storage

Os anexos são armazenados no **Supabase Storage**, utilizando um bucket público chamado:

```text
attachments
```

O upload ocorre diretamente do frontend para o Storage e, após a conclusão, apenas a URL pública do arquivo é enviada ao backend para ser registrada no banco de dados.

---

# Segurança

O bucket possui políticas **Row Level Security (RLS)** permitindo:

- upload de arquivos;
- leitura dos arquivos;
- exclusão dos arquivos.

As permissões são concedidas apenas às roles necessárias para o funcionamento da aplicação.

---

← [**Voltar para o README**](../../README.md)