<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Support\CatalogCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Flat list — used both by the product editor's category picker (needs
     * id/name/slug/parent) and by the categories admin page, which builds
     * its own tree client-side from parent_id since this is flat, not
     * nested. Subcategories carry their parent's name so duplicate leaf
     * names ("Elbise" under two parents) stay distinguishable.
     */
    public function index(): JsonResponse
    {
        $categories = Category::with('parent:id,name')
            ->orderBy('parent_id')
            ->orderBy('position')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'parent_id' => $category->parent_id,
                'parent_name' => $category->parent?->name,
                'href' => $category->href,
                'image' => $category->image,
                'itemCount' => $category->item_count,
            ]);

        return response()->json($categories);
    }

    public function update(Request $request, $id)
    {
        $category = Category::where('slug', $id)->first();
        if (!$category) {
            $category = Category::findOrFail($id);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:128',
            'image' => 'sometimes|image|max:5120',
        ]);

        $category->name = $validated['name'];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $category->image = '/storage/'.$path;
        }

        $category->save();

        return response()->json([
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'parent_id' => $category->parent_id,
            'href' => $category->href,
            'image' => $category->image,
            'itemCount' => $category->item_count,
        ]);
    }

    /**
     * Deleting a category orphans (doesn't delete) the products in it and its
     * subcategories — category_product rows cascade off the category, the
     * products themselves stay. Without a confirmation step this happened
     * silently; now the first call reports the impact and the caller has to
     * repeat it with ?confirm=1 to actually proceed.
     */
    public function destroy(Request $request, $id)
    {
        $category = Category::where('slug', $id)->first();
        if (!$category) {
            $category = Category::findOrFail($id);
        }

        $subcategoryIds = $category->subcategories()->pluck('id');
        $productCount = \App\Models\Product::whereHas(
            'categories',
            fn ($q) => $q->where('categories.id', $category->id)->orWhereIn('categories.id', $subcategoryIds),
        )->count();

        if (! $request->boolean('confirm')) {
            return response()->json([
                'needsConfirmation' => true,
                'subcategoryCount' => $subcategoryIds->count(),
                'productCount' => $productCount,
            ], 409);
        }

        // Delete subcategories individually (not a bulk query delete) so
        // model events fire — CatalogCacheObserver depends on them.
        foreach ($category->subcategories as $subcategory) {
            $subcategory->delete();
        }

        $category->delete();
        CatalogCache::bump();

        return response()->json(['message' => 'Kategori silindi']);
    }
}
