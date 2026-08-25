# Sevgi Butik

Monorepo for Sevgi Butik — a women's boutique in Yeniceköy, Kuzey Kıbrıs (KKTC).

- `frontend/` — Next.js 15 (App Router, TypeScript, Tailwind v4) storefront.
- `backend/` — Laravel 13 API (Sanctum SPA auth, MySQL, Filament admin at `/admin`).

## Prerequisites

- Node.js 20+
- PHP 8.2+, Composer, and MySQL — [Laravel Herd](https://herd.laravel.com) bundles all three on Windows/macOS.

## Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
# create the `butik` MySQL database, then:
php artisan migrate --seed
php artisan serve --port=8000
```

Seeding creates an admin user (`admin@sevgibutik.com` / `password`) — change the password before deploying.

Run these alongside `serve` during local development:

```bash
php artisan queue:work      # processes order confirmation / shipping emails
php artisan schedule:work   # runs the daily guest-cart pruning job
```

## Frontend

The dev server proxies `/api/*` and `/sanctum/*` to the backend (see `next.config.ts`) so Sanctum's session
cookie stays first-party — this requires the backend to be reachable at `BACKEND_URL` (defaults to
`http://127.0.0.1:8000`).

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Deployment (Hetzner, http://178.105.207.98:4000)

`docker-compose.yml` runs the whole stack: MySQL, Laravel (`backend:8000`, internal only) and Next.js
(published on `4000`). The browser only ever talks to port 4000; `/api/*` and `/sanctum/*` are proxied to
Laravel from there, which is what keeps the session cookie first-party.

`APP_KEY` is **required** — without it Laravel cannot decrypt cookies and every request that starts a
session (login, register, cart) fails with a 500.

```bash
cp .env.example .env                       # on the server, next to docker-compose.yml
docker compose run --rm backend php artisan key:generate --show   # paste into .env as APP_KEY
docker compose up -d --build
```

Two settings that must not be "fixed" back:

- `SESSION_DOMAIN` stays unset. A cookie `Domain` attribute cannot be an IP address (RFC 6265) — browsers
  drop such cookies and no session ever survives a request.
- `APP_URL` points at the backend itself (`:8000`), not at the storefront; `FRONTEND_URL` is the storefront
  and drives CORS.

Smoke test after deploying:

```bash
curl -i -H "Referer: http://178.105.207.98:4000/hesabim" http://178.105.207.98:4000/api/products  # 200 + Set-Cookie
curl -i http://178.105.207.98:4000/sanctum/csrf-cookie                                            # 204
```
