<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

/**
 * Namespaces every public catalog cache key (products, categories, homepage) behind
 * a single version counter instead of tracking individual keys to forget. Bumping
 * once from any write path — Next admin controllers or Filament, both mutate the
 * same Eloquent models — orphans every previously cached response without needing
 * to enumerate them; the database cache store doesn't support tags, so this is the
 * cheapest way to invalidate in bulk.
 */
class CatalogCache
{
    private const KEY = 'catalog_cache_version';

    public static function version(): int
    {
        return (int) Cache::get(self::KEY, 1);
    }

    public static function bump(): void
    {
        Cache::forever(self::KEY, self::version() + 1);
    }
}
