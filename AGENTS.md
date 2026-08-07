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
