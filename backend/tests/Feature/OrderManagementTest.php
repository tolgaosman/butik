<?php

namespace Tests\Feature;

use App\Mail\OrderShipped;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * OrderService is the one class every order-changing endpoint funnels
 * through (checkout, customer cancel, admin status update) — this is where
 * a stock-reversal or email regression would actually show up.
 */
class OrderManagementTest extends TestCase
{
    use RefreshDatabase;

    private function orderWithItem(string $status = 'pending', int $variantStock = 5, int $quantity = 2): Order
    {
        $product = Product::factory()->create();
        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'size' => 'M',
            'stock' => $variantStock,
            'is_active' => true,
        ]);

        $order = Order::factory()->create(['status' => $status]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $variant->product_id,
            'variant_id' => $variant->id,
            'product_name' => 'Test Ürün',
            'product_slug' => 'test-urun',
            'product_image' => 'https://example.com/image.jpg',
            'size' => $variant->size,
            'unit_price_minor' => 10000,
            'quantity' => $quantity,
            'line_total_minor' => 10000 * $quantity,
        ]);

        return $order->fresh('items');
    }

    public function test_cancel_reverses_stock_and_only_works_from_pending_or_confirmed(): void
    {
        $order = $this->orderWithItem(status: 'pending', variantStock: 5, quantity: 2);
        $variant = $order->items->first()->variant;

        $cancelled = app(OrderService::class)->cancel($order);

        $this->assertSame('cancelled', $cancelled->status);
        $this->assertSame(7, $variant->fresh()->stock);
    }

    public function test_cancel_rejects_an_order_already_being_prepared(): void
    {
        $order = $this->orderWithItem(status: 'preparing');

        $this->expectException(ValidationException::class);

        app(OrderService::class)->cancel($order);
    }

    public function test_admin_update_to_shipped_sets_shipped_at_and_sends_the_email(): void
    {
        Mail::fake();

        $order = $this->orderWithItem(status: 'confirmed');

        $updated = app(OrderService::class)->updateByAdmin($order, [
            'status' => 'shipped',
            'tracking_number' => 'PTT123456',
        ]);

        $this->assertSame('shipped', $updated->status);
        $this->assertSame('PTT123456', $updated->tracking_number);
        $this->assertNotNull($updated->shipped_at);
        // OrderShipped implements ShouldQueue — Mail::send() queues it rather
        // than dispatching synchronously, so the fake records it as queued.
        Mail::assertQueued(OrderShipped::class, fn ($mail) => $mail->order->id === $order->id);
    }

    public function test_admin_update_does_not_resend_the_shipped_email_on_a_later_edit(): void
    {
        Mail::fake();

        $order = $this->orderWithItem(status: 'shipped');
        $order->update(['shipped_at' => now(), 'tracking_number' => 'OLD123']);

        app(OrderService::class)->updateByAdmin($order->fresh('items'), ['tracking_number' => 'NEW456']);

        Mail::assertNotQueued(OrderShipped::class);
    }

    /**
     * Admins can cancel from states a customer no longer can (e.g.
     * "preparing"), and that still has to reverse stock.
     */
    public function test_admin_can_cancel_an_order_being_prepared_and_stock_is_reversed(): void
    {
        $order = $this->orderWithItem(status: 'preparing', variantStock: 3, quantity: 1);
        $variant = $order->items->first()->variant;

        $updated = app(OrderService::class)->updateByAdmin($order, ['status' => 'cancelled']);

        $this->assertSame('cancelled', $updated->status);
        $this->assertSame(4, $variant->fresh()->stock);
    }

    public function test_admin_update_does_not_reverse_stock_twice_for_an_already_cancelled_order(): void
    {
        $order = $this->orderWithItem(status: 'cancelled', variantStock: 3, quantity: 1);
        $variant = $order->items->first()->variant;

        app(OrderService::class)->updateByAdmin($order, ['admin_note' => 'iade kontrol edildi']);

        $this->assertSame(3, $variant->fresh()->stock);
    }

    public function test_admin_can_read_and_update_orders(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $order = $this->orderWithItem();

        $this->actingAs($admin)->getJson('/api/admin/orders')->assertOk()->assertJsonCount(1);

        $this->actingAs($admin)
            ->putJson("/api/admin/orders/{$order->order_number}", ['payment_status' => 'paid'])
            ->assertOk()
            ->assertJsonPath('paymentStatus', 'paid');

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'payment_status' => 'paid']);
    }

    public function test_customer_cannot_update_orders_via_the_admin_endpoint(): void
    {
        $customer = User::factory()->create(['is_admin' => false]);
        $order = $this->orderWithItem();

        $this->actingAs($customer)
            ->putJson("/api/admin/orders/{$order->order_number}", ['status' => 'shipped'])
            ->assertForbidden();
    }
}
