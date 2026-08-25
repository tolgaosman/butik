<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function test_non_admin_gets_403(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get('/admin')->assertForbidden();
    }

    public function test_admin_dashboard_loads(): void
    {
        $this->actingAs($this->admin())->get('/admin')->assertOk();
    }

    public function test_product_resource_pages_load(): void
    {
        $admin = $this->admin();
        $product = Product::factory()->create();

        $this->actingAs($admin)->get('/admin/products')->assertOk();
        $this->actingAs($admin)->get('/admin/products/create')->assertOk();
        $this->actingAs($admin)->get("/admin/products/{$product->id}/edit")->assertOk();
    }

    public function test_category_resource_pages_load(): void
    {
        $admin = $this->admin();
        $category = Category::factory()->create();

        $this->actingAs($admin)->get('/admin/categories')->assertOk();
        $this->actingAs($admin)->get("/admin/categories/{$category->id}/edit")->assertOk();
    }

    public function test_order_resource_pages_load(): void
    {
        $admin = $this->admin();
        $order = Order::factory()->create();

        $this->actingAs($admin)->get('/admin/orders')->assertOk();
        $this->actingAs($admin)->get("/admin/orders/{$order->id}/edit")->assertOk();
    }

    public function test_user_resource_pages_load(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->get('/admin/users')->assertOk();
        $this->actingAs($admin)->get("/admin/users/{$admin->id}/edit")->assertOk();
    }

    public function test_contact_message_resource_loads(): void
    {
        $admin = $this->admin();
        ContactMessage::factory()->create();

        $this->actingAs($admin)->get('/admin/contact-messages')->assertOk();
    }

    public function test_newsletter_subscriber_resource_loads(): void
    {
        $admin = $this->admin();
        NewsletterSubscriber::factory()->create();

        $this->actingAs($admin)->get('/admin/newsletter-subscribers')->assertOk();
    }
}
