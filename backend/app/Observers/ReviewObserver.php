<?php

namespace App\Observers;

use App\Models\Review;
use Illuminate\Support\Facades\DB;

class ReviewObserver
{
    public function saved(Review $review): void
    {
        $this->recompute($review);
    }

    public function deleted(Review $review): void
    {
        $this->recompute($review);
    }

    /**
     * Recompute the approved-review aggregate for a product. Kept separate from
     * rating_seed/review_count_seed so the blend in Product::displayRating() can
     * combine both without a live AVG() on every listing query.
     */
    private function recompute(Review $review): void
    {
        DB::table('products')
            ->where('id', $review->product_id)
            ->update([
                'rating_avg' => DB::table('reviews')
                    ->where('product_id', $review->product_id)
                    ->where('is_approved', true)
                    ->avg('rating'),
                'rating_count' => DB::table('reviews')
                    ->where('product_id', $review->product_id)
                    ->where('is_approved', true)
                    ->count(),
            ]);
    }
}
