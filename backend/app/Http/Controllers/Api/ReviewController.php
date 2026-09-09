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

    public function eligibleOrders(Request $request, string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        $user = $request->user();

        $orders = \App\Models\Order::where('user_id', $user->id)
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->whereNotIn('id', function ($query) use ($product, $user) {
                $query->select('order_id')
                    ->from('reviews')
                    ->where('product_id', $product->id)
                    ->where('user_id', $user->id);
            })
            ->orderByDesc('created_at')
            ->get();

        return response()->json($orders->map(fn ($order) => [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'created_at' => $order->created_at->toIso8601String(),
        ]));
    }

    public function store(Request $request, string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        $user = $request->user();

        $data = $request->validate([
            'order_id' => 'required|integer',
            'rating' => 'required|integer|between:1,5',
            'title' => 'nullable|string|max:255',
            'body' => 'nullable|string|max:2000',
        ]);

        $orderId = $data['order_id'];

        $validOrder = \App\Models\Order::where('id', $orderId)
            ->where('user_id', $user->id)
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })->exists();

        if (!$validOrder) {
            return response()->json(['message' => 'Geçersiz sipariş.'], 403);
        }

        if ($product->reviews()->where('user_id', $user->id)->where('order_id', $orderId)->exists()) {
            return response()->json(['message' => 'Bu sipariş için bu ürünü zaten değerlendirdiniz.'], 409);
        }

        $product->reviews()->create([
            'user_id' => $user->id,
            'order_id' => $orderId,
            'author_name' => $user->name,
            'rating' => $data['rating'],
            'title' => $data['title'] ?? null,
            'body' => $data['body'] ?? null,
            'is_approved' => false,
        ]);

        return response()->json(['message' => 'Değerlendirmeniz onay için gönderildi.'], 201);
    }
}
