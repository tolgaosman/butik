<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['categories', 'variants', 'images'])->orderByDesc('id')->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'isNew' => 'required|boolean',
            'gender' => 'required|in:kadin,erkek,unisex',
            'categories' => 'array',
            'categories.*' => 'integer|exists:categories,id',
            'sizes' => 'nullable',
            'image' => 'required|image|max:5120',
            'gallery_images' => 'sometimes|array',
            'gallery_images.*' => 'image|max:5120',
        ]);

        $slug = $this->uniqueSlug($validated['name']);
        [$priceMinor, $compareAtPriceMinor] = $this->computePricing($validated['price'], $validated['discount'] ?? 0);

        $path = $request->file('image')->store('products', 'public');

        $product = Product::create([
            'slug' => $slug,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price_minor' => $priceMinor,
            'compare_at_price_minor' => $compareAtPriceMinor,
            'image' => '/storage/' . $path,
            'is_new' => $validated['isNew'],
            'is_active' => true,
            'gender' => $validated['gender'],
            'position' => (int) (Product::max('position') ?? 0) + 1,
        ]);

        if (isset($validated['categories'])) {
            $product->categories()->sync($validated['categories']);
        }

        $this->syncSizes($product, $request->input('sizes'));
        $this->storeGalleryImages($product, $request);

        return response()->json($product->load(['categories', 'variants', 'images']), 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::where('slug', $id)->first();
        if (!$product) {
            $product = Product::findOrFail($id);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'required|numeric|min:0', // original price in TL
            'discount' => 'nullable|numeric|min:0|max:100', // percentage
            'isNew' => 'required|boolean',
            'isActive' => 'sometimes|boolean',
            'gender' => 'required|in:kadin,erkek,unisex',
            'categories' => 'array',
            'categories.*' => 'integer|exists:categories,id',
            'sizes' => 'nullable', // array or JSON string of [{size, stock}, ...]
        ]);

        [$priceMinor, $compareAtPriceMinor] = $this->computePricing($validated['price'], $validated['discount'] ?? 0);

        $product->update([
            'name' => $validated['name'],
            'description' => array_key_exists('description', $validated) ? $validated['description'] : $product->description,
            'price_minor' => $priceMinor,
            'compare_at_price_minor' => $compareAtPriceMinor,
            'is_new' => $validated['isNew'],
            'is_active' => $validated['isActive'] ?? $product->is_active,
            'gender' => $validated['gender'],
        ]);

        if (isset($validated['categories'])) {
            $product->categories()->sync($validated['categories']);
        }

        if ($request->has('sizes')) {
            $this->syncSizes($product, $request->input('sizes'));
        }

        // Image upload (Main Image)
        if ($request->hasFile('image')) {
            $this->deleteStoredFile($product->image);
            $path = $request->file('image')->store('products', 'public');
            $product->update(['image' => '/storage/' . $path]);
        }

        $this->storeGalleryImages($product, $request);

        return response()->json($product->load(['categories', 'variants', 'images']));
    }

    /**
     * Gallery images could be added but never removed — no endpoint existed.
     */
    public function destroyImage($productId, $imageId)
    {
        $product = Product::where('slug', $productId)->first() ?? Product::findOrFail($productId);
        $image = $product->images()->where('id', $imageId)->firstOrFail();

        $this->deleteStoredFile($image->url);
        $image->delete();

        return response()->json(['message' => 'Görsel silindi']);
    }

    public function destroy($id)
    {
        $product = Product::where('slug', $id)->first();
        if (!$product) {
            $product = Product::findOrFail($id);
        }

        $this->deleteStoredFile($product->image);
        foreach ($product->images as $img) {
            $this->deleteStoredFile($img->url);
        }

        $product->images()->delete();
        $product->variants()->delete();

        $product->delete();

        return response()->json(['message' => 'Ürün silindi']);
    }

    /**
     * @return array{0: int, 1: int|null} [priceMinor, compareAtPriceMinor]
     */
    private function computePricing(float $price, float $discount): array
    {
        $originalPriceMinor = (int) round($price * 100);

        if ($discount <= 0) {
            return [$originalPriceMinor, null];
        }

        $priceMinor = (int) round($originalPriceMinor * (1 - $discount / 100));

        return [$priceMinor, $originalPriceMinor];
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$base}-" . ++$suffix;
        }

        return $slug;
    }

    /**
     * Sizes arrive as a JSON string or array of ['size' => ..., 'stock' => ...]
     * (or bare size strings). Sizes are free text now — any string the admin
     * types becomes a real variant, not just XS-XL.
     */
    private function syncSizes(Product $product, mixed $sizesData): void
    {
        if (is_string($sizesData)) {
            $sizesData = json_decode($sizesData, true);
        }

        if (! is_array($sizesData)) {
            return;
        }

        $stockBySize = [];
        foreach ($sizesData as $entry) {
            if (is_array($entry)) {
                $stockBySize[$entry['size']] = max(0, (int) ($entry['stock'] ?? 0));
            } else {
                $stockBySize[$entry] = 0;
            }
        }

        $incomingSizes = array_keys($stockBySize);
        $existingSizes = $product->variants()->pluck('size')->toArray();
        $toAdd = array_diff($incomingSizes, $existingSizes);
        $toRemove = array_diff($existingSizes, $incomingSizes);
        $toUpdate = array_intersect($incomingSizes, $existingSizes);

        if (!empty($toRemove)) {
            $product->variants()->whereIn('size', $toRemove)->delete();
        }

        foreach ($toAdd as $size) {
            $product->variants()->create([
                'size' => $size,
                'sku' => $product->slug . '-' . Str::slug($size),
                'stock' => $stockBySize[$size],
                'price_minor' => null,
                'is_active' => true,
            ]);
        }

        foreach ($toUpdate as $size) {
            $product->variants()->where('size', $size)->update(['stock' => $stockBySize[$size]]);
        }

        $product->update(['has_sizes' => count($incomingSizes) > 0]);
    }

    private function storeGalleryImages(Product $product, Request $request): void
    {
        if (! $request->hasFile('gallery_images')) {
            return;
        }

        foreach ($request->file('gallery_images') as $file) {
            $path = $file->store('products', 'public');
            $product->images()->create([
                'url' => '/storage/' . $path,
                'alt' => $product->name,
            ]);
        }
    }

    private function deleteStoredFile(?string $url): void
    {
        if (! $url) {
            return;
        }

        Storage::disk('public')->delete(str_replace('/storage/', '', $url));
    }
}
