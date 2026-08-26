<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    /**
     * Backs getProductsByCategory() and getNewArrivals(). Category/subcategory
     * filters are separate whereHas() calls — an intersection, matching the
     * frontend's `tags.includes(a) && tags.includes(b)`. A single whereIn
     * would be a union and silently return the wrong products.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'sometimes|string|max:64',
            'subcategory' => 'sometimes|string|max:64',
            'is_new' => 'sometimes|boolean',
            'search' => 'sometimes|string|max:255',
            'sort' => 'sometimes|in:position,price_asc,price_desc,newest,rating',
            'limit' => 'sometimes|integer|min:1|max:100',
        ]);

        $cacheKey = 'products_index_' . md5(json_encode($validated));

        $payload = Cache::remember($cacheKey, 600, function () use ($validated) {
            $query = Product::query()->where('is_active', true)->with('categories');

            if (! empty($validated['category'])) {
                $slug = $validated['category'];
                if ($slug === 'giyim') {
                    $query->whereHas('categories', fn ($q) => $q->whereIn('slug', ['elbise', 'ust-giyim', 'alt-giyim']));
                } else {
                    $query->whereHas('categories', fn ($q) => $q->where('slug', $slug));
                }
            }

            if (! empty($validated['subcategory'])) {
                $slug = $validated['subcategory'];
                $query->whereHas('categories', fn ($q) => $q->where('slug', $slug));
            }

            if (array_key_exists('is_new', $validated)) {
                $query->where('is_new', (bool) $validated['is_new']);
            }

            if (! empty($validated['search'])) {
                $query->whereFullText('name', $validated['search']);
            }

            match ($validated['sort'] ?? 'position') {
                'price_asc' => $query->orderBy('price_minor'),
                'price_desc' => $query->orderByDesc('price_minor'),
                'newest' => $query->orderByDesc('created_at'),
                'rating' => $query->orderByDesc('rating_avg'),
                default => $query->orderBy('position'),
            };

            return ProductResource::collection($query->limit($validated['limit'] ?? 60)->get())->resolve();
        });

        return response()->json($payload);
    }

    /**
     * Backs getProductById(). Returns 404 for inactive/missing products so the
     * frontend's fetch wrapper can translate that into `undefined` for notFound().
     */
    public function show(string $slug): JsonResponse
    {
        $payload = Cache::remember("product_detail_{$slug}", 600, function () use ($slug) {
            $product = Product::where('slug', $slug)
                ->where('is_active', true)
                ->with(['categories', 'images', 'variants' => fn ($q) => $q->where('is_active', true)])
                ->first();

            return $product ? (new ProductDetailResource($product))->resolve() : null;
        });

        if (! $payload) {
            return response()->json(['message' => 'Ürün bulunamadı.'], 404);
        }

        return response()->json($payload);
    }

    /**
     * Backs getRelatedProducts(). Uses tags[0] (pivot position 0), matching
     * the frontend's `product.tags[0]` semantics, ordered by seed-file position
     * to reproduce the original array order.
     */
    public function related(Request $request, string $slug): JsonResponse
    {
        $limit = (int) $request->query('limit', 4);

        $product = Product::where('slug', $slug)->with('categories')->first();

        if (! $product) {
            return response()->json(['message' => 'Ürün bulunamadı.'], 404);
        }

        $primaryCategory = $product->categories->first();

        if (! $primaryCategory) {
            return response()->json([]);
        }

        $cacheKey = "products_related_{$product->id}_{$limit}";

        $payload = Cache::remember($cacheKey, 600, function () use ($product, $primaryCategory, $limit) {
            $related = Product::where('is_active', true)
                ->where('id', '!=', $product->id)
                ->whereHas('categories', fn ($q) => $q->where('categories.id', $primaryCategory->id))
                ->with('categories')
                ->orderBy('position')
                ->limit($limit)
                ->get();

            return ProductResource::collection($related)->resolve();
        });

        return response()->json($payload);
    }

    /**
     * Backs getAllProductIds() for generateStaticParams().
     */
    public function slugs(): JsonResponse
    {
        $slugs = Product::where('is_active', true)->pluck('slug');

        return response()->json($slugs);
    }
}
