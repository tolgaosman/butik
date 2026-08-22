<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        $reviews = $product->reviews()
            ->where('is_approved', true)
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($reviews->through(fn (Review $review) => [
            'authorName' => $review->author_name,
            'rating' => $review->rating,
            'title' => $review->title,
            'body' => $review->body,
            'createdAt' => $review->created_at->toIso8601String(),
        ]));
    }

    public function store(Request $request, string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        $user = $request->user();

        if ($product->reviews()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Bu ürünü zaten değerlendirdiniz.'], 409);
        }

        $data = $request->validate([
            'rating' => 'required|integer|between:1,5',
            'title' => 'nullable|string|max:255',
            'body' => 'nullable|string|max:2000',
        ]);

        $product->reviews()->create([
            'user_id' => $user->id,
            'author_name' => $user->name,
            'rating' => $data['rating'],
            'title' => $data['title'] ?? null,
            'body' => $data['body'] ?? null,
            'is_approved' => false,
        ]);

        return response()->json(['message' => 'Değerlendirmeniz onay için gönderildi.'], 201);
    }
}
