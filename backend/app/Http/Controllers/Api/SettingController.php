<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Support\CatalogCache;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    /**
     * Seeds every storefront surface (Footer, LocationMap, contact page,
     * WhatsApp link, checkout bank details) until an admin edits them once —
     * mirrors the values that used to be hardcoded in frontend/src/lib/business.ts.
     */
    private const STORE_DEFAULTS = [
        'store_name' => 'Sevgi Butik',
        'store_category' => "Düzova'da bir giyim mağazası",
        'store_address' => 'İskele Anayolu, Düzova, Lefkoşa',
        'store_maps_query' => 'Sevgi Butik, İskele Anayolu, Düzova, Lefkoşa',
        'store_phone' => '0542 873 91 96',
        'store_email' => 'info@sevgibutik.com',
        'store_instagram' => 'https://www.instagram.com/sevgi.butikk18?igsi=OTcxdXRmc2RibXph&utm_source=qr',
        'store_facebook' => 'https://www.facebook.com/profile.php?id=61564957254292&mibextid=wwXIfr&rdid=2VjaMhKQa675mN0o&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18mZBTVct9%2F%3Fmibextid%3DwwXIfr',
        'bank_name' => '',
        'bank_account_holder' => '',
        'bank_iban' => '',
    ];

    /**
     * Public — the bank details here are meant to be shown to customers who
     * pick "Havale / EFT" at checkout, so there's nothing to protect by
     * requiring auth. Also doubles as the admin settings form's prefill.
     */
    public function getStoreSettings()
    {
        $keys = array_keys(self::STORE_DEFAULTS);
        $settings = Setting::whereIn('key', $keys)->get()->pluck('value', 'key');

        $result = [];
        foreach (self::STORE_DEFAULTS as $key => $default) {
            $result[$key] = $settings[$key] ?? $default;
        }

        return response()->json($result);
    }

    public function updateStoreSettings(Request $request)
    {
        $validated = $request->validate([
            'store_name' => 'required|string|max:255',
            'store_category' => 'nullable|string|max:255',
            'store_address' => 'required|string|max:500',
            'store_maps_query' => 'nullable|string|max:255',
            'store_phone' => 'required|string|max:32',
            'store_email' => 'required|email|max:255',
            'store_instagram' => 'nullable|string|max:500',
            'store_facebook' => 'nullable|string|max:500',
            'bank_name' => 'nullable|string|max:255',
            'bank_account_holder' => 'nullable|string|max:255',
            'bank_iban' => 'nullable|string|max:64',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value ?? '']);
        }

        return response()->json(self::normalizeStoreSettings($validated));
    }

    private static function normalizeStoreSettings(array $validated): array
    {
        $result = [];
        foreach (self::STORE_DEFAULTS as $key => $default) {
            $result[$key] = $validated[$key] ?? $default;
        }

        return $result;
    }

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

        CatalogCache::bump();

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function getHomepageData()
    {
        $data = Cache::remember('api_homepage_data_v' . CatalogCache::version(), 600, function () {
            $settings = Setting::whereIn('key', ['hero_product_ids', 'new_arrival_product_ids', 'promo_banner_url'])->get()->pluck('value', 'key');
            
            $heroIds = json_decode($settings['hero_product_ids'] ?? '[]');
            $newArrivalIds = json_decode($settings['new_arrival_product_ids'] ?? '[]');

            $withStock = fn ($query) => $query->withExists(['variants as in_stock' => fn ($q) => $q->where('is_active', true)->where('stock', '>', 0)]);

            $heroProducts = count($heroIds) > 0
                ? $withStock(Product::with(['images', 'categories'])->whereIn('slug', $heroIds))->get()
                : $withStock(Product::with(['images', 'categories'])->inRandomOrder())->limit(3)->get(); // Fallback

            $newArrivals = count($newArrivalIds) > 0
                ? $withStock(Product::with(['images', 'categories'])->whereIn('slug', $newArrivalIds))->get()
                : $withStock(Product::with(['images', 'categories'])->orderBy('created_at', 'desc'))->limit(4)->get(); // Fallback

            return [
                'hero_products' => ProductResource::collection($heroProducts)->resolve(),
                'new_arrivals' => ProductResource::collection($newArrivals)->resolve(),
                'promo_banner_url' => $settings['promo_banner_url'] ?? 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop'
            ];
        });

        return response()->json($data);
    }
}
