<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Guards /api/admin/*. Authentication is `auth:sanctum`'s job (401 for a
 * missing session); this only decides whether the authenticated user is
 * staff — same `is_admin` flag Filament's User::canAccessPanel() reads.
 */
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->is_admin) {
            abort(403, 'Bu işlem için yönetici yetkisi gerekiyor.');
        }

        return $next($request);
    }
}
