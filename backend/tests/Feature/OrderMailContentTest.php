<?php

namespace Tests\Feature;

use App\Mail\OrderConfirmed;
use App\Mail\OrderPlaced;
use App\Mail\OrderShipped;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Renders the mailables directly (no queue/transport involved) to catch
 * content regressions in the blade templates — the boring stuff that a
 * "did the mail send" test never exercises: a blank tracking box, a total
 * with no breakdown, a relative image path that doesn't work in an inbox.
 */
class OrderMailContentTest extends TestCase
{
    use RefreshDatabase;

    private function orderWithItem(array $orderAttributes = [], string $productImage = 'https://example.com/image.jpg'): Order
    {
        $product = Product::factory()->create();
        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'size' => 'M',
            'stock' => 5,
            'is_active' => true,
        ]);

        $order = Order::factory()->create($orderAttributes);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $variant->product_id,
            'variant_id' => $variant->id,
            'product_name' => 'Test Ürün',
            'product_slug' => 'test-urun',
            'product_image' => $productImage,
            'size' => $variant->size,
            'unit_price_minor' => 10000,
            'quantity' => 2,
            'line_total_minor' => 20000,
        ]);

        return $order->fresh('items');
    }

    public function test_shipped_mail_without_a_tracking_number_shows_a_placeholder_not_a_blank_box(): void
    {
        $order = $this->orderWithItem(['tracking_number' => null]);

        $html = (new OrderShipped($order))->render();

        $this->assertStringContainsString('Takip numarası hazır olduğunda', $html);
        $this->assertStringNotContainsString('Kargo Takip No', $html);
    }

    public function test_shipped_mail_with_a_tracking_number_shows_it(): void
    {
        $order = $this->orderWithItem(['tracking_number' => 'PTT123456']);

        $html = (new OrderShipped($order))->render();

        $this->assertStringContainsString('PTT123456', $html);
        $this->assertStringContainsString('Kargo Takip No', $html);
    }

    public function test_confirmed_mail_breaks_down_subtotal_and_shipping_instead_of_just_a_total(): void
    {
        $order = $this->orderWithItem([
            'subtotal_minor' => 20000,
            'shipping_minor' => 5000,
            'total_minor' => 25000,
        ]);

        $html = (new OrderConfirmed($order))->render();

        $this->assertStringContainsString('₺200,00', $html); // ara toplam
        $this->assertStringContainsString('₺50,00', $html);  // kargo
        $this->assertStringContainsString('₺250,00', $html); // toplam
    }

    public function test_confirmed_mail_shows_free_shipping_as_text_not_zero(): void
    {
        $order = $this->orderWithItem(['shipping_minor' => 0]);

        $html = (new OrderConfirmed($order))->render();

        $this->assertStringContainsString('Ücretsiz', $html);
    }

    public function test_placed_mail_includes_delivery_address_and_an_absolute_image_url(): void
    {
        $order = $this->orderWithItem(
            orderAttributes: ['shipping_line1' => 'Testtepe Sokak No:5'],
            productImage: '/storage/products/test.jpg',
        );

        $html = (new OrderPlaced($order))->render();

        $this->assertStringContainsString('Testtepe Sokak No:5', $html);
        $this->assertStringContainsString(config('app.url').'/storage/products/test.jpg', $html);
    }
}
