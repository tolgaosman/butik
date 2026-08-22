<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CartService
{
    private const MAX_QUANTITY = 10;

    /**
     * Resolve the current visitor's cart: by user when authenticated, else by
     * a token stashed in the session. Every visitor already carries a Laravel
     * session cookie under Sanctum SPA mode, so no extra cookie is needed.
     */
    public function resolve(?User $user, \Illuminate\Http\Request $request): Cart
    {
        if ($user) {
            return Cart::firstOrCreate(['user_id' => $user->id]);
        }

        $token = $request->session()->get('cart_token');

        if ($token) {
            $cart = Cart::where('token', $token)->first();
            if ($cart) {
                return $cart;
            }
        }

        $token = Str::random(40);
        $request->session()->put('cart_token', $token);

        return Cart::create(['token' => $token, 'expires_at' => now()->addDays(30)]);
    }

    public function addItem(Cart $cart, string $productSlug, ?string $size, int $quantity): CartItem
    {
        $variant = ProductVariant::whereHas('product', fn ($q) => $q->where('slug', $productSlug)->where('is_active', true))
            ->where('is_active', true)
            ->where('size', $size)
            ->firstOrFail();

        return DB::transaction(function () use ($cart, $variant, $quantity) {
            $existing = CartItem::where('cart_id', $cart->id)->where('variant_id', $variant->id)->lockForUpdate()->first();

            $newQuantity = min(self::MAX_QUANTITY, $variant->stock, ($existing->quantity ?? 0) + $quantity);

            if ($newQuantity < 1) {
                throw ValidationException::withMessages([
                    'quantity' => 'Bu ürün stokta yok.',
                ]);
            }

            return CartItem::updateOrCreate(
                ['cart_id' => $cart->id, 'variant_id' => $variant->id],
                ['quantity' => $newQuantity],
            );
        });
    }

    public function updateQuantity(CartItem $item, int $quantity): CartItem
    {
        $stock = $item->variant->stock;

        if ($quantity > $stock) {
            throw ValidationException::withMessages([
                'quantity' => "Stokta sadece {$stock} adet mevcut.",
            ]);
        }

        $item->update(['quantity' => min(self::MAX_QUANTITY, $quantity)]);

        return $item;
    }

    /**
     * Fold a guest cart into the user's cart on login/register. Runs in a
     * transaction; sums quantities clamped to the cap and to live stock.
     */
    public function mergeGuestCartIntoUser(string $guestToken, User $user): void
    {
        DB::transaction(function () use ($guestToken, $user) {
            $guestCart = Cart::where('token', $guestToken)->first();

            if (! $guestCart) {
                return;
            }

            $userCart = Cart::firstOrCreate(['user_id' => $user->id]);

            foreach ($guestCart->items()->with('variant')->get() as $guestItem) {
                $existing = CartItem::where('cart_id', $userCart->id)
                    ->where('variant_id', $guestItem->variant_id)
                    ->first();

                $summed = ($existing->quantity ?? 0) + $guestItem->quantity;
                $clamped = min(self::MAX_QUANTITY, $guestItem->variant->stock, $summed);

                if ($clamped < 1) {
                    continue;
                }

                CartItem::updateOrCreate(
                    ['cart_id' => $userCart->id, 'variant_id' => $guestItem->variant_id],
                    ['quantity' => $clamped],
                );
            }

            $guestCart->delete();
        });
    }
}
