<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'slug', 'name', 'description', 'price_minor', 'compare_at_price_minor',
    'image', 'has_sizes', 'rating_seed', 'review_count_seed',
    'rating_avg', 'rating_count', 'is_new', 'is_active', 'position',
])]
class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'price_minor' => 'integer',
            'compare_at_price_minor' => 'integer',
            'has_sizes' => 'boolean',
            'rating_seed' => 'decimal:1',
            'review_count_seed' => 'integer',
            'rating_avg' => 'decimal:2',
            'rating_count' => 'integer',
            'is_new' => 'boolean',
            'is_active' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)
            ->withPivot('position')
            ->orderByPivot('position');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('position');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * The tag that drives getRelatedProducts() ordering — pivot position 0.
     */
    public function primaryTag(): ?Tag
    {
        return $this->tags->first();
    }

    /**
     * Blend seeded social proof with real approved reviews so the storefront
     * doesn't collapse to 0 stars the moment reviews go live.
     */
    public function displayRating(): ?float
    {
        if ($this->rating_count === 0) {
            return $this->rating_seed !== null ? (float) $this->rating_seed : null;
        }

        $seedCount = $this->review_count_seed;
        $seedRating = (float) ($this->rating_seed ?? 0);
        $realCount = $this->rating_count;
        $realRating = (float) $this->rating_avg;

        $totalCount = $seedCount + $realCount;

        if ($totalCount === 0) {
            return null;
        }

        $weighted = (($seedRating * $seedCount) + ($realRating * $realCount)) / $totalCount;

        return round($weighted, 1);
    }

    public function displayReviewCount(): int
    {
        return $this->review_count_seed + $this->rating_count;
    }
}
