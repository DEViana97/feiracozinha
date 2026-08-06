# Feira, Cozinha e Mesa — Cardápio Digital

Cardápio digital para o restaurante **Feira** (Ceará), pensado para acesso via QR code na mesa.
Site público mobile-first + painel administrativo (`/admin`) para a equipe gerenciar categorias,
itens, variações, tags e informações do restaurante — sem tocar em código.

## Stack

- Next.js (App Router, Server Components + Server Actions) + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma ORM + PostgreSQL (Neon)
- Auth.js (Credentials — e-mail/senha) para proteger `/admin`
- Vercel Blob para upload/armazenamento de imagens
- Framer Motion, Embla Carousel, lucide-react

## 1. Pré-requisitos

- Node.js 20+
- Um banco PostgreSQL (recomendado: [Neon](https://neon.tech), tem plano gratuito e integra
  nativamente com a Vercel). Supabase também funciona.
- Uma conta Vercel com um **Blob store** criado (Storage → Create → Blob), para upload de imagens.

## 2. Configuração do ambiente

Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

| Variável | Onde conseguir |
| --- | --- |
| `DATABASE_URL` | Connection string do seu banco Neon/Supabase (com `?sslmode=require`) |
| `AUTH_SECRET` | Gere com `npx auth secret` (ou `openssl rand -base64 33`) |
| `BLOB_READ_WRITE_TOKEN` | Criado automaticamente ao adicionar um Blob store no seu projeto Vercel; copie o token em Storage → seu Blob → `.env.local` tab |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credenciais do primeiro usuário admin (usadas só pelo script `create-admin`) |

## 3. Instalação e banco de dados

```bash
npm install
npx prisma migrate dev --name init   # cria as tabelas no banco
npm run seed                          # popula com dados de demonstração (Ceará)
npm run create-admin                  # cria o usuário admin inicial usando ADMIN_EMAIL/ADMIN_PASSWORD do .env
```

> Os dados criados pelo `seed` (categorias "Da Feira", "Do Mar", "Da Terra", "Da Doceira", "Da Adega"
> e itens de exemplo) são **apenas demonstração**. Edite ou substitua tudo pelo painel `/admin`.

## 4. Rodando localmente

```bash
npm run dev
```

- Site público: [http://localhost:3000](http://localhost:3000)
- Painel admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 5. Estrutura do projeto

```
app/(public)/            área pública (cardápio, página de item)
app/admin/login/         login do painel (sem proteção)
app/admin/(dashboard)/   painel admin protegido (dashboard, categorias, itens, tags, config)
app/api/auth/            rota do Auth.js
components/public/       componentes da área pública
components/admin/        componentes do painel admin
components/ui/           componentes shadcn/ui
lib/queries.ts           leituras (Prisma) usadas pela área pública e admin
lib/actions/             Server Actions de escrita (categoria, item, tag, restaurante, upload, auth)
lib/validations/         schemas Zod usados pelos formulários e Server Actions
prisma/schema.prisma     modelagem de dados
prisma/seed.ts           dados de demonstração
prisma/create-admin.ts   cria/atualiza o usuário admin inicial
```

Toda escrita passa por Server Actions que chamam `revalidatePath` — mudanças feitas no admin
aparecem imediatamente no site público, sem precisar de rebuild.

## 6. Deploy na Vercel

1. Suba o repositório para o GitHub e importe o projeto na Vercel.
2. Em **Settings → Environment Variables**, adicione `DATABASE_URL`, `AUTH_SECRET` e
   `BLOB_READ_WRITE_TOKEN` (o token do Blob é preenchido automaticamente se você criar o Blob
   store direto pela aba Storage do projeto na Vercel).
3. Rode as migrations contra o banco de produção antes do primeiro deploy (ou via um pipeline):
   ```bash
   DATABASE_URL="<url-de-producao>" npx prisma migrate deploy
   DATABASE_URL="<url-de-producao>" npm run seed          # opcional, dados de demonstração
   DATABASE_URL="<url-de-producao>" ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run create-admin
   ```
4. Faça o deploy. Site público e painel admin ficam no mesmo projeto/domínio.
5. Gere o QR code apontando para a URL publicada (ex.: `https://seudominio.com`) — isso é feito
   fora do código, em qualquer gerador de QR code.

## 7. Comandos úteis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run seed` | Popula o banco com dados de demonstração |
| `npm run create-admin` | Cria/atualiza o usuário admin (usa `ADMIN_EMAIL`/`ADMIN_PASSWORD` do `.env`) |
| `npx prisma studio` | Interface visual para inspecionar o banco |
| `npx prisma migrate dev` | Cria uma nova migration a partir de alterações no `schema.prisma` |
