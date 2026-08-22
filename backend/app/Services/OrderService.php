<?php

namespace App\Services;

use App\Mail\OrderPlaced;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * Places an order from the given cart. Locks every variant row for the
     * duration of the transaction, re-validates stock against the LOCKED
     * values (not the values read when the cart page loaded), snapshots
     * every display field onto the order_items row, and computes totals
     * from the database prices — never from anything the client sent.
     */
    public function placeFromCart(Cart $cart, ?User $user, array $data): Order
    {
        $cart->loadMissing('items.variant.product');

        if ($cart->items->isEmpty()) {
            throw ValidationException::withMessages([
                'cart' => 'Sepetiniz boş.',
            ]);
        }

        $order = DB::transaction(function () use ($cart, $user, $data) {
            $variantIds = $cart->items->pluck('variant_id')->all();

            $lockedVariants = \App\Models\ProductVariant::whereIn('id', $variantIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($cart->items as $item) {
                $variant = $lockedVariants[$item->variant_id];
                if ($item->quantity > $variant->stock) {
                    throw ValidationException::withMessages([
                        'cart' => "{$variant->product->name} için yeterli stok yok. Mevcut: {$variant->stock}.",
                    ]);
                }
            }

            $subtotalMinor = $cart->items->sum(fn ($item) => $item->variant->priceMinor() * $item->quantity);
            $threshold = config('shop.free_shipping_threshold_minor');
            $flatShipping = config('shop.flat_shipping_minor');
            $shippingMinor = $subtotalMinor >= $threshold ? 0 : $flatShipping;
            $totalMinor = $subtotalMinor + $shippingMinor;

            $order = Order::create([
                'order_number' => 'PENDING', // placeholder, overwritten below once we have an id
                'user_id' => $user?->id,
                'email' => $data['email'],
                'phone' => $data['phone'],
                'status' => 'pending',
                'payment_method' => $data['payment_method'],
                'payment_status' => 'unpaid',
                'subtotal_minor' => $subtotalMinor,
                'shipping_minor' => $shippingMinor,
                'discount_minor' => 0,
                'total_minor' => $totalMinor,
                'shipping_name' => $data['shipping_name'],
                'shipping_phone' => $data['phone'],
                'shipping_line1' => $data['shipping_line1'],
                'shipping_line2' => $data['shipping_line2'] ?? null,
                'shipping_district' => $data['shipping_district'],
                'shipping_city' => $data['shipping_city'],
                'shipping_postal' => $data['shipping_postal'] ?? null,
                'customer_note' => $data['customer_note'] ?? null,
            ]);

            $order->assignOrderNumber();

            foreach ($cart->items as $item) {
                $variant = $lockedVariants[$item->variant_id];
                $product = $variant->product;
                $unitPrice = $variant->priceMinor();

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'variant_id' => $variant->id,
                    'product_name' => $product->name,
                    'product_slug' => $product->slug,
                    'product_image' => $product->image,
                    'size' => $variant->size,
                    'unit_price_minor' => $unitPrice,
                    'quantity' => $item->quantity,
                    'line_total_minor' => $unitPrice * $item->quantity,
                ]);

                $variant->decrement('stock', $item->quantity);
            }

            $cart->items()->delete();

            return $order;
        });

        Mail::to($order->email)->send(new OrderPlaced($order->load('items')));

        return $order;
    }
}
