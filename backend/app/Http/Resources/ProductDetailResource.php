<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProductDetailResource extends ProductResource
{
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'description' => $this->description,
            'images' => $this->whenLoaded('images', fn () => $this->images->map(fn ($img) => [
                'url' => $img->url,
                'alt' => $img->alt,
            ])->all()),
            'variants' => $this->whenLoaded('variants', fn () => $this->variants->map(fn ($v) => [
                'id' => $v->id,
                'size' => $v->size,
                'stock' => $v->stock,
                'isActive' => $v->is_active,
            ])->values()->all()),
        ];
    }
}
