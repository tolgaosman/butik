<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'orderNumber' => $this->order_number,
            'status' => $this->status,
            'paymentMethod' => $this->payment_method,
            'paymentStatus' => $this->payment_status,
            'subtotal' => $this->subtotal_minor / 100,
            'shipping' => $this->shipping_minor / 100,
            'discount' => $this->discount_minor / 100,
            'total' => $this->total_minor / 100,
            'shippingAddress' => [
                'name' => $this->shipping_name,
                'phone' => $this->shipping_phone,
                'line1' => $this->shipping_line1,
                'line2' => $this->shipping_line2,
                'district' => $this->shipping_district,
                'city' => $this->shipping_city,
                'postalCode' => $this->shipping_postal,
            ],
            'trackingNumber' => $this->tracking_number,
            'shippedAt' => $this->shipped_at?->toIso8601String(),
            'deliveredAt' => $this->delivered_at?->toIso8601String(),
            'createdAt' => $this->created_at->toIso8601String(),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'productSlug' => $item->product_slug,
                'name' => $item->product_name,
                'image' => $item->product_image,
                'size' => $item->size,
                'unitPrice' => $item->unit_price_minor / 100,
                'quantity' => $item->quantity,
                'lineTotal' => $item->line_total_minor / 100,
            ])),
        ];
    }
}
