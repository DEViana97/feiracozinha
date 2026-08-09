<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Feature de tags temporariamente desativada

A feature de tags/alergênicos (schema `Tag`/`MenuItemTag`, tela `/admin/tags`, seletor
de tags no formulário de item, badges na página do item) está **comentada**, não
removida. Schema do Prisma e dados no banco continuam intactos.

Partes comentadas:
- `components/admin/admin-nav.tsx` — link "Tags" no menu
- `app/admin/(dashboard)/tags/page.tsx` — tela de gestão (stub no lugar)
- `components/admin/tag-manager.tsx` — componente inteiro
- `lib/actions/tag.ts`, `lib/validations/tag.ts` — arquivos inteiros
- `components/admin/item-form.tsx` — seletor de tags no formulário de item
- `app/admin/(dashboard)/items/new/page.tsx` e `.../[id]/edit/page.tsx` — chamada a `getAllTags()`
- `lib/queries.ts` — função `getAllTags()`
- `app/(public)/cardapio/[slug]/page.tsx` — badges de tags na página do item

Pra reativar: descomentar esses trechos (procurar "Tags temporariamente desativado" no
código) e devolver o link no admin-nav.

## Feature de subcategorias temporariamente desativada (na tela de categorias)

Na tela `/admin/categories`, o botão de expandir uma categoria e o gerenciador
de subcategorias (`SubcategoryManager`) estão **comentados**, não removidos.
Schema do Prisma e dados no banco continuam intactos; o formulário de item
ainda usa subcategoria normalmente.

Partes comentadas em `components/admin/category-manager.tsx`:
- import de `SubcategoryManager`, `ChevronDown`, `ChevronUp`
- state `expandedId`
- botão de expandir cada categoria
- render condicional do `SubcategoryManager`
- contagem de "N subcategoria(s)" no resumo da categoria

Pra reativar: descomentar esses trechos (procurar "Subcategorias temporariamente
desativado" no código) e restaurar o texto de instrução em
`app/admin/(dashboard)/categories/page.tsx`.

## Quick agent guide

- **Run (dev):** `npm run dev` — starts Next (v16) dev server.
- **Build & start:** `npm run build` then `npm run start` for production.
- **DB / Prisma:** `npm run seed` populates sample data, `npm run create-admin` creates an admin user, and `postinstall` runs `prisma generate`.
- **Lint:** `npm run lint`.

### Key places to look

- **App routes / UI:** `app/` (Next `app` router, layouts, pages) and `components/` (shared + admin UI).
- **Server logic / helpers:** `lib/` (`queries.ts`, `actions/`, `utils.ts`, `prisma.ts`).
- **Admin features:** `components/admin/` and `app/admin/(dashboard)/`.
- **Database schema & seeds:** `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/migrations/`.

### Conventions & notes for agents

- This project uses Next 16 and its changed conventions — consult `node_modules/next/dist/docs/` if unsure.
- The `Tag`/allergens feature is intentionally commented out; see the "Feature de tags temporariamente desativada" section above for affected files before re-enabling.
- Avoid destructive DB commands against production. For local development, use `npm run seed` and the provided migrations.
- When editing code, prefer small, targeted changes and add tests or manual verification steps where appropriate.

If you'd like, I can also generate a `.github/copilot-instructions.md` with a short agent checklist (run, seed, avoid production DB, key files). Want me to add that next?
