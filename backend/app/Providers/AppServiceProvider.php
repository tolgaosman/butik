<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Observers\CatalogCacheObserver;
use App\Observers\ReviewObserver;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Review::observe(ReviewObserver::class);

        Product::observe(CatalogCacheObserver::class);
        ProductVariant::observe(CatalogCacheObserver::class);
        ProductImage::observe(CatalogCacheObserver::class);
        Category::observe(CatalogCacheObserver::class);
    }
}
