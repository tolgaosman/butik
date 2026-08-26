<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
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
