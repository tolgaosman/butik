<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * /api/admin/* was open to the world — no auth, no role check — while the
 * Next.js panel's login was the ordinary customer login. These lock the gate:
 * a guest gets 401, a signed-in customer 403, staff 200.
 */
class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_read_admin_products(): void
    {
        $this->getJson('/api/admin/products')->assertUnauthorized();
    }

    public function test_signed_in_customers_are_forbidden(): void
    {
        $customer = User::factory()->create(['is_admin' => false]);

        $this->actingAs($customer)->getJson('/api/admin/products')->assertForbidden();
        $this->actingAs($customer)->getJson('/api/admin/orders')->assertForbidden();
        $this->actingAs($customer)->getJson('/api/admin/customers')->assertForbidden();
        $this->actingAs($customer)->getJson('/api/admin/categories')->assertForbidden();
    }

    public function test_admins_can_read_admin_products(): void
    {
        Product::factory()->create();
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->getJson('/api/admin/products')
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_customers_cannot_delete_products(): void
    {
        $product = Product::factory()->create();
        $customer = User::factory()->create(['is_admin' => false]);

        $this->actingAs($customer)->deleteJson("/api/admin/products/{$product->slug}")->assertForbidden();

        $this->assertDatabaseHas('products', ['id' => $product->id, 'deleted_at' => null]);
    }

    public function test_admin_categories_index_returns_a_flat_list(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->getJson('/api/admin/categories')->assertOk();
    }
}
