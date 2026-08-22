<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private readonly CartService $carts) {}

    public function show(Request $request): CartResource
    {
        $cart = $this->carts->resolve($request->user(), $request);
        $cart->load('items.variant.product');

        return new CartResource($cart);
    }

    public function store(Request $request): CartResource
    {
        $data = $request->validate([
            'product_slug' => 'required|string|exists:products,slug',
            'size' => 'nullable|string|in:XS,S,M,L,XL',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $cart = $this->carts->resolve($request->user(), $request);
        $this->carts->addItem($cart, $data['product_slug'], $data['size'] ?? null, $data['quantity']);

        $cart->load('items.variant.product');

        return new CartResource($cart);
    }

    public function update(Request $request, CartItem $item): CartResource
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $cart = $this->carts->resolve($request->user(), $request);
        abort_unless($item->cart_id === $cart->id, 404);

        $this->carts->updateQuantity($item, $data['quantity']);
        $cart->load('items.variant.product');

        return new CartResource($cart);
    }

    public function destroy(Request $request, CartItem $item): CartResource
    {
        $cart = $this->carts->resolve($request->user(), $request);
        abort_unless($item->cart_id === $cart->id, 404);

        $item->delete();
        $cart->load('items.variant.product');

        return new CartResource($cart);
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $this->carts->resolve($request->user(), $request);
        $cart->items()->delete();

        return response()->json(null, 204);
    }
}
