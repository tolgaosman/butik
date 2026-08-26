<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Caches the resolved array, never the Eloquent collection — serializing
     * models into the file store round-trips through unserialize() and blows up
     * with __PHP_Incomplete_Class the moment the class isn't loaded yet, taking
     * the whole endpoint down with a 500.
     */
    public function index(): JsonResponse
    {
        $payload = Cache::remember('api_categories_tree', 3600, function () {
            $categories = Category::where('is_active', true)
                ->whereNull('parent_id')
                ->with(['subcategories' => function ($q) {
                    $q->where('is_active', true)->orderBy('position');
                }])
                ->orderBy('position')
                ->get();

            return CategoryResource::collection($categories)->resolve();
        });

        return response()->json($payload);
    }
}
