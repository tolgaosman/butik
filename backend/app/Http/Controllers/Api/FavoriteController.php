<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FavoriteController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::whereHas('favorites', fn ($q) => $q->where('user_id', $request->user()->id))
            ->with('tags')
            ->get();

        return ProductResource::collection($products);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_slug' => 'required|string|exists:products,slug',
        ]);

        $product = Product::where('slug', $data['product_slug'])->firstOrFail();

        Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
        ]);

        return response()->json(null, 204);
    }

    public function destroy(Request $request, string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->first();

        if ($product) {
            Favorite::where('user_id', $request->user()->id)->where('product_id', $product->id)->delete();
        }

        return response()->json(null, 204);
    }

    /**
     * Folds a guest's localStorage favorites list into the account at login.
     */
    public function merge(Request $request): AnonymousResourceCollection
    {
        $data = $request->validate([
            'slugs' => 'array|max:200',
            'slugs.*' => 'string',
        ]);

        $productIds = Product::whereIn('slug', $data['slugs'] ?? [])->pluck('id');

        foreach ($productIds as $productId) {
            Favorite::firstOrCreate(['user_id' => $request->user()->id, 'product_id' => $productId]);
        }

        return $this->index($request);
    }
}
