# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Comandos

Não há test runner configurado; a verificação é `npm run lint` e `npm run build` (type-check) + conferência manual no `npm run dev`. Comandos de dev/seed/admin estão em AGENTS.md e README.md.

- Migrations: `npx prisma migrate dev --name <nome>` (local), `npx prisma migrate deploy` (produção). `postinstall` roda `prisma generate`.
- `.env` precisa de `DATABASE_URL` (Postgres/Neon), `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN` (ver `.env.example`).

## Arquitetura

Cardápio digital do restaurante Feira (Next 16 App Router, React 19, Prisma 6 + Postgres, Auth.js v5, Vercel Blob, Tailwind 4 + shadcn/ui). Conteúdo em pt-BR. Alias de import: `@/*` aponta para a raiz.

**Fluxo de dados (leitura → escrita → cache)**
- Leituras: funções em `lib/queries.ts` chamadas direto de Server Components. Páginas públicas e várias do admin usam `export const dynamic = "force-dynamic"` / `revalidate = 0`, então não há cache de dados a invalidar nelas.
- Escritas: Server Actions em `lib/actions/*.ts` (`"use server"`). Cada uma valida a entrada com o schema Zod correspondente em `lib/validations/*.ts` (os mesmos schemas alimentam os formulários react-hook-form via `@hookform/resolvers`) e termina com `revalidatePath` das rotas afetadas (ex.: `/cardapio`, `/admin/items`). Ao criar uma action nova, siga esse padrão.
- Slugs de item/categoria são gerados em `lib/slugify.ts` e deduplicados na action (`uniqueItemSlug`). `order` é calculado como `max + 1` dentro da categoria; reordenação no admin usa dnd-kit (`sortable-item.tsx`).

**Autenticação**
- `auth.ts` (Credentials + bcrypt, sessão JWT) exporta `auth`/`signIn`/`signOut`; a rota é `app/api/auth/[...nextauth]`.
- `proxy.ts` é o middleware do Next 16 (substitui `middleware.ts`); só protege o matcher `/admin/:path*`, redirecionando para `/admin/login`.
- Server Actions são endpoints públicos (o proxy só cobre rotas `/admin`). Toda action de escrita em `lib/actions/` começa com `await requireAuth();` (`lib/require-auth.ts`); mantenha isso em actions novas. `auth.ts`/`auth-signout.ts` ficam sem, por serem login/logout.

**Estrutura de rotas**
- `app/(public)/`: landing (`/`), `/cardapio` e `/cardapio/[slug]`, `/links` (estilo linktree), `/reservas`.
- `app/admin/login` (sem proteção) e `app/admin/(dashboard)/` (categorias, itens, carrossel, tags, configurações).
- Componentes: `components/public/` (inclui `landing/` e `linktree/`), `components/admin/`, `components/ui/` (shadcn, gerado via `components.json`).

**Modelo de dados** (`prisma/schema.prisma`): `Category` → `Subcategory` → `MenuItem` → `ItemVariant`; `Tag` ligada a item por `MenuItemTag`; `IdentitySlide` (carrossel da home); `RestaurantInfo` (linha única de configuração, com fallback em `getRestaurantInfo()`); `User` (admin).

**Imagens**: upload via `uploadImageAction` (Vercel Blob) e componente `image-upload-field.tsx`. Hosts permitidos em `next.config.ts` (`images.unsplash.com` e `*.public.blob.vercel-storage.com`) - novo host de imagem exige entrada ali. Limite de body de Server Action: 8mb.

**Reservas**: `Environment` → `TableGroup` (N mesas de X lugares) e `Reservation` (`date` "YYYY-MM-DD" e `time` "HH:mm" como string, sem fuso; `tableSeats` é o tamanho da mesa alocada e não é FK, para editar o layout não quebrar reservas). Regra de disponibilidade em `lib/reservation-availability.ts` (reserva ocupa a mesa por 120 min; aloca a menor mesa livre que comporta o grupo). `lib/actions/reservation.ts`: ações de admin usam `requireAuth()`; `checkAvailability` e `createReservation` são públicas de propósito (esta roda em transação `Serializable` e avisa no Telegram via `lib/telegram.ts`, que nunca lança). Telegram precisa de `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID`; sem eles a reserva é salva e só loga um aviso. Admin em `/admin/reservations` (abas Ambientes e Reservas); formulário público em `components/public/reservation-form.tsx`. Dados de demonstração: `npm run seed:reservations` (idempotente, não apaga nada, diferente de `npm run seed`).

## Features desativadas por comentário

Tags, subcategorias (na tela de categorias) e variações de item estão comentadas, não removidas; detalhes e como reativar estão em AGENTS.md. O form de item continua reenviando as variações existentes para não apagá-las ao salvar - não remova esse pass-through.
