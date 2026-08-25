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

            $this->mergeWhen((bool) $this->is_new, ['isNew' => true]),
            $this->mergeWhen($this->compare_at_price_minor !== null, fn () => [
                'discountPercent' => (int) round((1 - $this->price_minor / $this->compare_at_price_minor) * 100),
                'originalPrice' => $this->compare_at_price_minor / 100,
            ]),
        ];
    }
}
