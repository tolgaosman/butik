<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['product_id', 'size', 'sku', 'stock', 'price_minor', 'is_active'])]
class ProductVariant extends Model
{
    protected function casts(): array
    {
        return [
            'stock' => 'integer',
            'price_minor' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function priceMinor(): int
    {
        return $this->price_minor ?? $this->product->price_minor;
    }
}
