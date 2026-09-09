<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_public_endpoint_only_lists_approved_reviews(): void
    {
        $product = Product::factory()->create();
        Review::create(['product_id' => $product->id, 'author_name' => 'Onaylı', 'rating' => 5, 'is_approved' => true]);
        Review::create(['product_id' => $product->id, 'author_name' => 'Bekleyen', 'rating' => 1, 'is_approved' => false]);

        $res = $this->getJson("/api/products/{$product->slug}/reviews")->assertOk();

        $res->assertJsonCount(1, 'data')->assertJsonPath('data.0.authorName', 'Onaylı');
    }

    public function test_a_signed_in_user_can_submit_a_review_and_it_starts_unapproved(): void
    {
        $product = Product::factory()->create();
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id, 'status' => 'delivered']);
        OrderItem::create(['order_id' => $order->id, 'product_id' => $product->id, 'product_name' => $product->name, 'product_slug' => $product->slug, 'product_image' => 'test.jpg', 'quantity' => 1, 'unit_price_minor' => 1000, 'line_total_minor' => 1000]);

        $this->actingAs($user)
            ->postJson("/api/products/{$product->slug}/reviews", ['order_id' => $order->id, 'rating' => 4, 'title' => 'Güzel', 'body' => 'Beğendim'])
            ->assertCreated();

        $this->assertDatabaseHas('reviews', [
            'product_id' => $product->id,
            'user_id' => $user->id,
            'is_approved' => false,
        ]);
    }

    public function test_a_user_cannot_review_the_same_product_twice_for_the_same_order(): void
    {
        $product = Product::factory()->create();
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id, 'status' => 'delivered']);
        OrderItem::create(['order_id' => $order->id, 'product_id' => $product->id, 'product_name' => $product->name, 'product_slug' => $product->slug, 'product_image' => 'test.jpg', 'quantity' => 1, 'unit_price_minor' => 1000, 'line_total_minor' => 1000]);
        
        Review::create(['product_id' => $product->id, 'user_id' => $user->id, 'order_id' => $order->id, 'author_name' => $user->name, 'rating' => 5]);

        $this->actingAs($user)
            ->postJson("/api/products/{$product->slug}/reviews", ['order_id' => $order->id, 'rating' => 3])
            ->assertStatus(409);
    }

    /**
     * ReviewObserver recomputes the live rating aggregate off is_approved
     * reviews only — approving through the admin endpoint has to trigger it.
     */
    public function test_approving_a_review_updates_the_products_rating_aggregate(): void
    {
        $product = Product::factory()->create(['rating_seed' => null, 'review_count_seed' => 0]);
        $review = Review::create(['product_id' => $product->id, 'author_name' => 'Ayşe', 'rating' => 5, 'is_approved' => false]);
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->putJson("/api/admin/reviews/{$review->id}", ['is_approved' => true])
            ->assertOk()
            ->assertJsonPath('isApproved', true);

        $this->assertSame(5.0, (float) $product->fresh()->rating_avg);
        $this->assertSame(1, $product->fresh()->rating_count);
    }

    public function test_a_customer_cannot_moderate_reviews(): void
    {
        $product = Product::factory()->create();
        $review = Review::create(['product_id' => $product->id, 'author_name' => 'Ayşe', 'rating' => 5]);
        $customer = User::factory()->create(['is_admin' => false]);

        $this->actingAs($customer)
            ->putJson("/api/admin/reviews/{$review->id}", ['is_approved' => true])
            ->assertForbidden();
    }
}
