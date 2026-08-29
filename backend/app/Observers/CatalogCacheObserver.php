<?php

namespace App\Observers;

use App\Support\CatalogCache;

/**
 * Shared by Product, ProductVariant, ProductImage and Category — any write to what
 * the public catalog reads bumps the cache version, regardless of whether the write
 * came from the Next.js admin controllers or a Filament relation manager, since both
 * ultimately save the same Eloquent models. See CatalogCache for why this is a
 * version bump rather than forgetting individual keys.
 */
class CatalogCacheObserver
{
    public function saved(): void
    {
        CatalogCache::bump();
    }

    public function deleted(): void
    {
        CatalogCache::bump();
    }

    public function restored(): void
    {
        CatalogCache::bump();
    }
}
