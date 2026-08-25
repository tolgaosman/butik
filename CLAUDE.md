# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Design law

1. **Taste** — clean, minimalist whitespace, muted pastel or monochrome high-contrast tones (Vercel style), elegant typography. Never cheap default colors or raw CSS grids without intent.
2. **Emil Kowalski** — organic animations, micro-interactions, and state transitions on every frontend component, smooth `cubic-bezier` easing curves. Target 60 fps for all animations.
3. **Impeccable** — pixel-perfection, explicit handling of loading states, error rollbacks, empty directories, and unsafe filenames.
4. **Anti-slop** — highly intentional code, zero AI-generated boilerplate, no redundant comments, no unnecessary abstractions. Every line must have a purpose.

## Repo layout

Monorepo: `frontend/` (Next.js 15 storefront) talks to `backend/` (Laravel 13 API) over HTTP. There is no shared package/types boundary — API shapes are hand-mirrored in `frontend/src/lib/*.ts`.

## Commands

### Frontend (`frontend/`)
```bash
npm run dev      # next dev — proxies /api/* and /sanctum/* to BACKEND_URL (default http://127.0.0.1:8000)
npm run build
npm run lint      # eslint
npx tsc --noEmit  # typecheck (no dedicated script)
```

### Backend (`backend/`)
```bash
php artisan serve --port=8000
php artisan queue:work       # required locally: order confirmation / shipping emails
php artisan schedule:work    # required locally: daily guest-cart pruning
php artisan test                                  # full suite
php artisan test --filter=TestClassName::test_method  # single test
php artisan migrate --seed   # seeds an admin user: admin@sevgibutik.com / password
```
Filament admin panel is served by Laravel at `/admin`; the custom Next.js admin lives at `frontend/src/app/admin/` (see Architecture — two separate surfaces).

### Docker (`docker-compose.yml`, repo root)
```bash
cp .env.example .env                                   # APP_KEY is required
docker compose run --rm backend php artisan key:generate --show
docker compose up -d --build                           # db (MySQL 8) + backend + frontend on :4000
```
The compose file pins `APP_URL`/`FRONTEND_URL`/`SANCTUM_STATEFUL_DOMAINS` to a bare IP; `SESSION_DOMAIN` is deliberately left empty because a cookie `Domain` attribute cannot be an IP (RFC 6265) — setting it silently breaks every session.

Run frontend and backend concurrently for local dev — the Next.js dev server's rewrites depend on the backend being reachable.

## Architecture

**Auth is cookie-based Sanctum SPA auth, not tokens.** The frontend dev server (`next.config.ts`) rewrites `/api/*` and `/sanctum/*` to the Laravel backend so the session cookie stays first-party same-origin from the browser's perspective. This shapes how data fetching is split in `frontend/src/lib/api.ts`:
- `apiGet` (server components / SSR): hits the Laravel API directly via `INTERNAL_API_URL`, for public/unauthenticated catalog data only — SSR must never forward the visitor's session cookie.
- `apiGetAuthed` (server components, admin only): same direct call, but forwards the visitor's session cookie so `/api/admin/*` sees the session. The "SSR never borrows the session" rule above is about the *public* catalog — the admin panel is the deliberate exception, and it never caches.
- `apiMutate` (client-side only): goes through the same-origin `/api` proxy with `credentials: "include"`, fetches the `XSRF-TOKEN` cookie via `/sanctum/csrf-cookie` first, and retries once on a 419 (token rotation after login).

Auth/cart/favorites state lives in React context providers (`lib/auth.tsx`, `lib/cart.tsx`, `lib/favorites.tsx`) mounted in `app/layout.tsx`, each wrapping `apiMutate` for its own resource.

`bootstrap/app.php` prepends the session + CSRF middleware to *every* API route instead of using Sanctum's `statefulApi()`. Cart tokens and auth both live in the session, so the session must always start — `statefulApi()` only starts it when `Referer`/`Origin` matches `SANCTUM_STATEFUL_DOMAINS`, and request handling must not depend on a header the browser may omit. Session auth still satisfies `auth:sanctum` (the guard falls back to `web`).

**There are two admin surfaces.** Filament at Laravel's `/admin`, and a hand-built Next.js admin at `frontend/src/app/admin/` (`urunler`/`kategoriler`/`siparisler`/`musteriler`/`ayarlar`, login at `/admin_login`) backed by `backend/app/Http/Controllers/Api/Admin/*` under the `/api/admin` prefix. Notes:
- Every `/api/admin` route sits behind `auth:sanctum` + the `admin` alias (`EnsureUserIsAdmin`, checks `users.is_admin` — the same flag Filament's `canAccessPanel()` reads). `/admin_login` uses the ordinary customer login endpoint and then refuses anyone whose `isAdmin` is false; `app/admin/layout.tsx` shows a curtain and redirects. Add new admin endpoints inside that group — never outside it.
- Server-rendered admin pages read with `apiGetAuthed`, client-side admin pages fetch `/api/...` same-origin (cookies ride along by default), and writes go through `apiMutate`, followed by the `revalidateStore()` server action (`app/admin/actions.ts`) so storefront caches pick up the edit.
- A change to products/categories/orders generally needs updating in *both* admin surfaces.

**Categories are a tree, and product↔category is many-to-many.** `categories.parent_id` self-references (`parent`/`subcategories`), and `category_product` joins products to categories (`Product::categories()`). Tags were removed — the `product_tag` table and its `position` pivot are dead weight left behind by that migration.

**Backend** follows standard Laravel conventions: `Http/Controllers/Api/*` are thin, business logic for cart/order flows lives in `app/Services/` (`CartService`, `OrderService`). Guest carts persist server-side and are pruned by a scheduled command. Filament (`app/Filament/Resources/*`) is the admin CMS for products, categories, orders, and contact/newsletter data — model changes that affect the storefront usually need a matching Filament resource update.

**Frontend routing** is Next.js App Router with catch-all category routes at `app/[category]/[subcategory]/`. Reusable animation primitives (`components/ui/Reveal.tsx`, `components/ui/MotionReveal.tsx` — `MotionReveal`/`MotionStagger`/`MotionItem`), `components/ui/SectionHeader.tsx` and `components/ui/Modal.tsx` are the standard building blocks for new sections — prefer composing with these over hand-rolling scroll-in animations or section headings.
