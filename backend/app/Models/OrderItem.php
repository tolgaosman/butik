<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'order_id', 'product_id', 'variant_id', 'product_name', 'product_slug',
    'product_image', 'size', 'unit_price_minor', 'quantity', 'line_total_minor',
])]
class OrderItem extends Model
{
    protected function casts(): array
    {
        return [
            'unit_price_minor' => 'integer',
            'quantity' => 'integer',
            'line_total_minor' => 'integer',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    /**
     * product_image is stored two ways depending on how it got there: an
     * absolute URL from a seeded/Unsplash product, or a relative
     * "/storage/products/x.jpg" from an admin upload
     * (Admin/ProductController::update). Emails need an absolute URL either
     * way — there's no site origin to resolve a relative path against once
     * it's sitting in an inbox.
     */
    public function imageUrl(): string
    {
        if (str_starts_with($this->product_image, 'http')) {
            return $this->product_image;
        }

        return rtrim(config('app.url'), '/').$this->product_image;
    }
}
