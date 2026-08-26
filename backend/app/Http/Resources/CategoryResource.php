<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Every nested value is resolved to a plain array. A resource object left in
 * here survives json_encode on a cache miss but is serialized into the cache
 * store as-is, and comes back from unserialize() as __PHP_Incomplete_Class —
 * so cache hits would silently ship a broken `subcategories` object instead of
 * a list, and the storefront's filters would quietly disappear.
 */
class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->slug,
            'name' => $this->name,
            'itemCount' => $this->item_count,
            'href' => $this->href,
            'subcategories' => $this->whenLoaded(
                'subcategories',
                fn () => CategoryResource::collection($this->subcategories)->resolve(),
                [],
            ),
            'image' => $this->image,
        ];
    }
}
