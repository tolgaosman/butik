<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    private function variant(int $stock, ?string $size = 'M', int $priceMinor = 10000): ProductVariant
    {
        $product = Product::factory()->create(['price_minor' => $priceMinor]);

        return ProductVariant::create([
            'product_id' => $product->id,
            'size' => $size,
            'stock' => $stock,
            'is_active' => true,
        ]);
    }

    public function test_adding_an_item_creates_a_guest_cart_and_returns_totals(): void
    {
        $variant = $this->variant(stock: 5);

        $this->postJson('/api/cart/items', [
            'product_slug' => $variant->product->slug,
            'size' => $variant->size,
            'quantity' => 2,
        ])
            // 201: the guest cart row itself is created on this first add (see
            // ResourceResponse::calculateStatus() / Cart::wasRecentlyCreated).
            ->assertSuccessful()
            ->assertJsonPath('itemCount', 2)
            ->assertJsonPath('items.0.quantity', 2);
    }

    public function test_adding_the_same_variant_twice_sums_the_quantity_instead_of_duplicating_the_line(): void
    {
        $variant = $this->variant(stock: 10);
        $payload = ['product_slug' => $variant->product->slug, 'size' => $variant->size, 'quantity' => 3];

        $this->postJson('/api/cart/items', $payload)->assertSuccessful();
        $res = $this->postJson('/api/cart/items', $payload)->assertOk();

        $res->assertJsonCount(1, 'items')->assertJsonPath('items.0.quantity', 6);
    }

    public function test_quantity_is_clamped_to_available_stock(): void
    {
        $variant = $this->variant(stock: 3);

        $this->postJson('/api/cart/items', [
            'product_slug' => $variant->product->slug,
            'size' => $variant->size,
            'quantity' => 10,
        ])
            ->assertSuccessful()
            ->assertJsonPath('items.0.quantity', 3);
    }

    public function test_updating_an_item_beyond_stock_is_rejected(): void
    {
        $variant = $this->variant(stock: 2);

        $res = $this->postJson('/api/cart/items', [
            'product_slug' => $variant->product->slug,
            'size' => $variant->size,
            'quantity' => 1,
        ])->assertSuccessful();

        $itemId = $res->json('items.0.id');

        $this->patchJson("/api/cart/items/{$itemId}", ['quantity' => 5])
            ->assertStatus(422)
            ->assertJsonValidationErrors('quantity');
    }

    public function test_removing_an_item_updates_the_cart_totals(): void
    {
        $variant = $this->variant(stock: 5);

        $res = $this->postJson('/api/cart/items', [
            'product_slug' => $variant->product->slug,
            'size' => $variant->size,
            'quantity' => 2,
        ])->assertSuccessful();

        $itemId = $res->json('items.0.id');

        $this->deleteJson("/api/cart/items/{$itemId}")
            ->assertOk()
            ->assertJsonPath('itemCount', 0);
    }

    public function test_guest_cart_merges_into_the_users_cart_on_login(): void
    {
        $variant = $this->variant(stock: 5);
        $user = User::factory()->create(['email' => 'merge@example.com', 'password' => 'Parola1234!']);

        $this->postJson('/api/cart/items', [
            'product_slug' => $variant->product->slug,
            'size' => $variant->size,
            'quantity' => 2,
        ])->assertSuccessful();

        $this->postJson('/api/login', ['email' => 'merge@example.com', 'password' => 'Parola1234!'])->assertOk();

        $this->getJson('/api/cart')->assertOk()->assertJsonPath('itemCount', 2);

        $this->assertDatabaseHas('carts', ['user_id' => $user->id]);
    }
}
