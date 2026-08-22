<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->items->map(function ($item) {
            $variant = $item->variant;
            $product = $variant->product;
            $unitPrice = $variant->priceMinor();
            $lineTotal = $unitPrice * $item->quantity;

            return [
                'id' => $item->id,
                'productId' => $product->slug,
                'name' => $product->name,
                'image' => $product->image,
                'size' => $variant->size,
                'quantity' => $item->quantity,
                'unitPrice' => $unitPrice / 100,
                'lineTotal' => $lineTotal / 100,
                'stock' => $variant->stock,
            ];
        });

        $subtotalMinor = $items->sum(fn ($i) => (int) round($i['lineTotal'] * 100));
        $threshold = config('shop.free_shipping_threshold_minor');
        $flatShipping = config('shop.flat_shipping_minor');
        $shippingMinor = $subtotalMinor >= $threshold ? 0 : $flatShipping;

        return [
            'items' => $items,
            'itemCount' => $items->sum('quantity'),
            'subtotal' => $subtotalMinor / 100,
            'freeShippingThreshold' => $threshold / 100,
            'freeShippingRemaining' => max(0, $threshold - $subtotalMinor) / 100,
            'shipping' => $shippingMinor / 100,
            'total' => ($subtotalMinor + $shippingMinor) / 100,
        ];
    }
}
