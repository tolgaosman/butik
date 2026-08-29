<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

/**
 * Next admin's review moderation screen. Filament already has this via
 * ProductResource's ReviewsRelationManager — this is the same capability for
 * the panel Osman actually wants to run day to day, so approving a review
 * (and the rating recompute ReviewObserver does on save) doesn't require
 * switching admin surfaces.
 */
class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'pending');

        $reviews = Review::with('product:id,name,slug')
            ->when($status === 'pending', fn ($q) => $q->where('is_approved', false))
            ->when($status === 'approved', fn ($q) => $q->where('is_approved', true))
            ->orderByDesc('created_at')
            ->get();

        return response()->json($reviews->map(fn (Review $review) => $this->format($review)));
    }

    public function update(Request $request, Review $review)
    {
        $validated = $request->validate([
            'is_approved' => 'required|boolean',
        ]);

        $review->update([
            'is_approved' => $validated['is_approved'],
            'approved_at' => $validated['is_approved'] ? now() : null,
        ]);

        return response()->json($this->format($review->fresh('product')));
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json(['message' => 'Değerlendirme silindi']);
    }

    private function format(Review $review): array
    {
        return [
            'id' => $review->id,
            'productName' => $review->product?->name,
            'productSlug' => $review->product?->slug,
            'authorName' => $review->author_name,
            'rating' => $review->rating,
            'title' => $review->title,
            'body' => $review->body,
            'isApproved' => $review->is_approved,
            'createdAt' => $review->created_at->toIso8601String(),
        ];
    }
}
