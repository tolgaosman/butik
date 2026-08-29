<?php

namespace App\Services;

use App\Mail\OrderPlaced;
use App\Mail\OrderShipped;
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

    /**
     * Customer self-service cancellation — only while the order hasn't
     * started being prepared. Reverses stock inside the same transaction
     * that flips the status, so a concurrent checkout never oversells.
     */
    public function cancel(Order $order): Order
    {
        if (! in_array($order->status, ['pending', 'confirmed'], true)) {
            throw ValidationException::withMessages([
                'status' => 'Bu sipariş artık iptal edilemez.',
            ]);
        }

        return DB::transaction(function () use ($order) {
            $order->update(['status' => 'cancelled']);

            foreach ($order->items as $item) {
                $item->variant?->increment('stock', $item->quantity);
            }

            return $order->fresh('items');
        });
    }

    /**
     * Admin-side status/fulfillment update — more permissive than cancel()
     * since staff may need to cancel from states a customer no longer can.
     * Centralizes what used to be split between two admin surfaces
     * (Filament vs. the Next.js admin, which only ever touched `status`):
     * shipped_at/delivered_at timestamps, the OrderShipped email, and stock
     * reversal for cancelled/refunded orders, all in one transaction so a
     * status flip can't land without its side effects.
     */
    public function updateByAdmin(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            $previousStatus = $order->status;
            $newStatus = $data['status'] ?? $previousStatus;

            $updates = array_filter([
                'status' => $data['status'] ?? null,
                'payment_status' => $data['payment_status'] ?? null,
            ], fn ($v) => $v !== null);

            if (array_key_exists('tracking_number', $data)) {
                $updates['tracking_number'] = $data['tracking_number'];
            }
            if (array_key_exists('admin_note', $data)) {
                $updates['admin_note'] = $data['admin_note'];
            }

            if ($newStatus === 'shipped' && $previousStatus !== 'shipped') {
                $updates['shipped_at'] = now();
            }
            if ($newStatus === 'delivered' && $previousStatus !== 'delivered') {
                $updates['delivered_at'] = now();
            }

            $reversalStatuses = ['cancelled', 'refunded'];
            $reversingNow = in_array($newStatus, $reversalStatuses, true)
                && ! in_array($previousStatus, $reversalStatuses, true);

            $order->update($updates);

            if ($reversingNow) {
                foreach ($order->items as $item) {
                    $item->variant?->increment('stock', $item->quantity);
                }
            }

            if ($newStatus === 'shipped' && $previousStatus !== 'shipped') {
                Mail::to($order->email)->send(new OrderShipped($order));
            }

            return $order->fresh('items');
        });
    }
}
