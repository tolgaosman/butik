<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['categories', 'variants', 'images'])->orderByDesc('id')->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        return response()->json(['message' => 'Not implemented yet'], 501);
    }

    public function update(Request $request, $id)
    {
        $product = Product::where('slug', $id)->first();
        if (!$product) {
            $product = Product::findOrFail($id);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0', // original price in TL
            'discount' => 'nullable|numeric|min:0|max:100', // percentage
            'isNew' => 'required|boolean',
            'categories' => 'array',
            'sizes' => 'array', // e.g. ['M', 'L'] or ['36', '38']
        ]);

        $originalPriceMinor = $validated['price'] * 100;
        $discount = $validated['discount'] ?? 0;
        $priceMinor = $originalPriceMinor;
        $compareAtPriceMinor = null;

        if ($discount > 0) {
            $priceMinor = $originalPriceMinor - ($originalPriceMinor * ($discount / 100));
            $compareAtPriceMinor = $originalPriceMinor;
        }

        $product->update([
            'name' => $validated['name'],
            'price_minor' => $priceMinor,
            'compare_at_price_minor' => $compareAtPriceMinor,
            'is_new' => $validated['isNew'],
        ]);

        // Categories
        if (isset($validated['categories'])) {
            $product->categories()->sync($validated['categories']);
        }

        // Sizes (Variants)
        if ($request->has('sizes')) {
            // FormData sends arrays strangely if not formatted. Assuming sizes is sent as an array or JSON string.
            $sizesData = $request->input('sizes');
            if (is_string($sizesData)) {
                $sizesData = json_decode($sizesData, true);
            }
            if (is_array($sizesData)) {
                $existingSizes = $product->variants()->pluck('size')->toArray();
                $toAdd = array_diff($sizesData, $existingSizes);
                $toRemove = array_diff($existingSizes, $sizesData);

                if (!empty($toRemove)) {
                    $product->variants()->whereIn('size', $toRemove)->delete();
                }

                foreach ($toAdd as $size) {
                    $product->variants()->create([
                        'size' => $size,
                        'sku' => $product->slug . '-' . $size,
                        'stock' => 10,
                        'price_minor' => null,
                        'is_active' => true,
                    ]);
                }
            }
        }

        // Image upload (Main Image)
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->update(['image' => '/storage/' . $path]);
        }

        // Gallery Images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'url' => '/storage/' . $path,
                    'alt' => $product->name,
                ]);
            }
        }

        return response()->json($product->load(['categories', 'variants', 'images']));
    }

    public function destroy($id)
    {
        $product = Product::where('slug', $id)->first();
        if (!$product) {
            $product = Product::findOrFail($id);
        }

        // Delete related images from storage
        if ($product->image) {
            $path = str_replace('/storage/', '', $product->image);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
        }
        foreach ($product->images as $img) {
            $path = str_replace('/storage/', '', $img->url);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
        }

        $product->images()->delete();
        $product->variants()->delete();
        
        $product->delete();

        return response()->json(['message' => 'Ürün silindi']);
    }
}
