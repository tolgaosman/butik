<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    public function getHomepageSettings()
    {
        $settings = Setting::whereIn('key', ['hero_product_ids', 'new_arrival_product_ids', 'promo_banner_url'])->get()->pluck('value', 'key');
        
        return response()->json([
            'hero_product_ids' => json_decode($settings['hero_product_ids'] ?? '[]'),
            'new_arrival_product_ids' => json_decode($settings['new_arrival_product_ids'] ?? '[]'),
            'promo_banner_url' => $settings['promo_banner_url'] ?? 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop'
        ]);
    }

    public function updateHomepageSettings(Request $request)
    {
        $validated = $request->validate([
            'hero_product_ids' => 'array',
            'hero_product_ids.*' => 'string|exists:products,slug',
            'new_arrival_product_ids' => 'array',
            'new_arrival_product_ids.*' => 'string|exists:products,slug',
            'promo_banner_image' => 'sometimes|nullable|image|max:5120',
        ]);

        $heroIds = $request->input('hero_product_ids', []);
        Setting::updateOrCreate(['key' => 'hero_product_ids'], ['value' => json_encode($heroIds)]);

        $newArrivalIds = $request->input('new_arrival_product_ids', []);
        Setting::updateOrCreate(['key' => 'new_arrival_product_ids'], ['value' => json_encode($newArrivalIds)]);
        if ($request->hasFile('promo_banner_image')) {
            $path = $request->file('promo_banner_image')->store('settings', 'public');
            Setting::updateOrCreate(['key' => 'promo_banner_url'], ['value' => '/storage/'.$path]);
        }

        Cache::forget('api_homepage_data');

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function getHomepageData()
    {
        $data = Cache::remember('api_homepage_data', 600, function () {
            $settings = Setting::whereIn('key', ['hero_product_ids', 'new_arrival_product_ids', 'promo_banner_url'])->get()->pluck('value', 'key');
            
            $heroIds = json_decode($settings['hero_product_ids'] ?? '[]');
            $newArrivalIds = json_decode($settings['new_arrival_product_ids'] ?? '[]');

            $heroProducts = count($heroIds) > 0 
                ? Product::with(['images', 'categories'])->whereIn('slug', $heroIds)->get() 
                : Product::with(['images', 'categories'])->inRandomOrder()->limit(3)->get(); // Fallback

            $newArrivals = count($newArrivalIds) > 0
                ? Product::with(['images', 'categories'])->whereIn('slug', $newArrivalIds)->get()
                : Product::with(['images', 'categories'])->orderBy('created_at', 'desc')->limit(4)->get(); // Fallback

            return [
                'hero_products' => ProductResource::collection($heroProducts)->resolve(),
                'new_arrivals' => ProductResource::collection($newArrivals)->resolve(),
                'promo_banner_url' => $settings['promo_banner_url'] ?? 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop'
            ];
        });

        return response()->json($data);
    }
}
