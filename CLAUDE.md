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
Filament admin panel is served at `/admin`.

Run frontend and backend concurrently for local dev — the Next.js dev server's rewrites depend on the backend being reachable.

## Architecture

**Auth is cookie-based Sanctum SPA auth, not tokens.** The frontend dev server (`next.config.ts`) rewrites `/api/*` and `/sanctum/*` to the Laravel backend so the session cookie stays first-party same-origin from the browser's perspective. This shapes how data fetching is split in `frontend/src/lib/api.ts`:
- `apiGet` (server components / SSR): hits the Laravel API directly via `INTERNAL_API_URL`, for public/unauthenticated catalog data only — SSR must never forward the visitor's session cookie.
- `apiMutate` (client-side only): goes through the same-origin `/api` proxy with `credentials: "include"`, fetches the `XSRF-TOKEN` cookie via `/sanctum/csrf-cookie` first, and retries once on a 419 (token rotation after login).

Auth/cart/favorites state lives in React context providers (`lib/auth.tsx`, `lib/cart.tsx`, `lib/favorites.tsx`) mounted in `app/layout.tsx`, each wrapping `apiMutate` for its own resource.

**Backend** follows standard Laravel conventions: `Http/Controllers/Api/*` are thin, business logic for cart/order flows lives in `app/Services/` (`CartService`, `OrderService`). Guest carts persist server-side and are pruned by a scheduled command. Filament (`app/Filament/Resources/*`) is the admin CMS for products, categories, tags, orders, and contact/newsletter data — model changes that affect the storefront usually need a matching Filament resource update.

**Frontend routing** is Next.js App Router with catch-all category routes at `app/[category]/[subcategory]/`. Reusable animation primitives (`components/ui/Reveal.tsx`, `components/ui/MotionReveal.tsx` — `MotionReveal`/`MotionStagger`/`MotionItem`) and `components/ui/SectionHeader.tsx` are the standard building blocks for new sections — prefer composing with these over hand-rolling scroll-in animations or section headings.
