<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Flat list for the product editor's category picker — the public
     * /categories endpoint returns a tree, which the checkbox list can't use.
     * Subcategories carry their parent's name so duplicate leaf names
     * ("Elbise" under two parents) stay distinguishable.
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
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::where('slug', $id)->first();
        if (!$category) {
            $category = Category::findOrFail($id);
        }

        // Delete subcategories first (manual cascade)
        $category->subcategories()->delete();

        $category->delete();

        return response()->json(['message' => 'Kategori silindi']);
    }
}
