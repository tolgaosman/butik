<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Shapes onto the frontend's exact Product contract (frontend/src/lib/products.ts).
 * Optional keys must be ABSENT, not null, hence mergeWhen rather than plain array keys.
 */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->slug,
            'name' => $this->name,
            'price' => $this->price_minor / 100,
            'image' => $this->image,
            'rating' => $this->displayRating(),
            'reviewCount' => $this->displayReviewCount(),
            'gender' => $this->gender,
            'categories' => $this->whenLoaded('categories', fn () => $this->categories->pluck('slug')->all()),
            // Full variants (detail page) beat the withExists() flag (list
            // queries) when both happen to be loaded; absent either, default
            // to true so a card never wrongly claims "Tükendi".
            'inStock' => $this->relationLoaded('variants')
                ? $this->variants->contains(fn ($v) => $v->is_active && $v->stock > 0)
                : (bool) ($this->in_stock ?? true),

            $this->mergeWhen((bool) $this->is_new, ['isNew' => true]),
            $this->mergeWhen($this->compare_at_price_minor !== null, fn () => [
                'discountPercent' => (int) round((1 - $this->price_minor / $this->compare_at_price_minor) * 100),
                'originalPrice' => $this->compare_at_price_minor / 100,
            ]),
        ];
    }
}
