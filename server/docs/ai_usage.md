# 🌐 Relatório de Uso de Inteligência Artificial

Este documento descreve como ferramentas de Inteligência Artificial Generativa foram utilizadas durante o ciclo de desenvolvimento do projeto. O uso de IA foi adotado de maneira estratégica como um **acelerador de produtividade e de engenharia**, sem substituir a tomada de decisão técnica e o design da arquitetura.

---

## 1. Lovable — Prototipagem & Identidade Visual

O **Lovable** foi utilizado na fase inicial do projeto para acelerar a criação da interface visual.

* **Escopo de Uso:**
  * Estruturação rápida do protótipo de alta fidelidade e do Design System inicial.
  * Criação do layout base da interface em Kanban e dos componentes visuais de tarefas.
* **Impacto na Produtividade:**
  * Permitiu economizar horas de estilização manual inicial CSS/Tailwind, delegando o trabalho visual de base à ferramenta.
  * **Ganho Principal:** Liberou foco e tempo do desenvolvedor para concentrar atenção total na **arquitetura do backend**, nas **regras de negócio**, na **modelagem de dados relacional** e na **integração de serviços em nuvem**.

---

## 2. Gemini Pro — Arquitetura, Backend, Debugging & Refatoração

O **Gemini Pro** atuou como o principal parceiro de *pair programming* técnico durante a fase de desenvolvimento e integração.

* **Escopo de Uso:**
  * **Infraestrutura & ORM:** Auxílio na configuração do ambiente Docker, `docker-compose` e resolução de quebras de incompatibilidade com o **Prisma 7**.
  * **Aceleração de Código Repetitivo:** Geração de boilerplate e scaffolds para estruturas repetitivas (CRUDs de tarefas, anexos e usuários), adaptando e refinando as telas originadas do Lovable.
  * **Segurança & Autenticação:** Apoio no desenho dos middlewares de autorização, manipulação de tokens JWT (Access Token via body e Refresh Token via cookies HTTP-Only) e criação da estante de exceções públicas/privadas.
  * **Debugging Avançado:** Resolução de problemas complexos de sincronização de estado no frontend (React Query e invalidação de cache).

---

## 3. GitHub Copilot & ChatGPT — IDE & Documentação Técnica

O **GitHub Copilot** (integrado diretamente ao VS Code) e o **ChatGPT** foram utilizados no dia a dia da escrita do código e formalização do projeto.

* **GitHub Copilot:**
  * Utilizado diretamente no editor para autocomplete inteligente de funções, tipagens de TypeScript e tratamento repetitivo de erros de sintaxe.
* **ChatGPT:**
  * Estruturação e rascunho dos arquivos de documentação em Markdown (`README.md`, `decisions.md` e detalhamentos de infraestrutura/deploy).

[← Voltar para o README principal](../../README.md)