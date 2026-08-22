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
