<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private const VALID = [
        'name' => 'Sevgi Yılmaz',
        'email' => 'sevgi@example.com',
        'password' => 'Parola1234!',
        'password_confirmation' => 'Parola1234!',
    ];

    public function test_register_creates_user_and_authenticates(): void
    {
        $this->postJson('/api/register', self::VALID)
            ->assertCreated()
            ->assertJson(['name' => 'Sevgi Yılmaz', 'email' => 'sevgi@example.com', 'isAdmin' => false])
            ->assertJsonMissingPath('password');

        $this->assertDatabaseHas('users', ['email' => 'sevgi@example.com']);
        $this->assertAuthenticated();
        $this->assertTrue(Hash::check('Parola1234!', User::firstWhere('email', 'sevgi@example.com')->password));
    }

    /**
     * The register/login path reads the guest cart token out of the session
     * before Auth::login() regenerates it — the regression this guards is the
     * merge silently dropping the guest's cart.
     */
    public function test_register_merges_guest_cart_into_the_new_user(): void
    {
        $variant = $this->variant(stock: 5);
        $guestCart = Cart::create(['token' => 'guest-token', 'expires_at' => now()->addDays(30)]);
        CartItem::create(['cart_id' => $guestCart->id, 'variant_id' => $variant->id, 'quantity' => 2]);

        $this->withSession(['cart_token' => 'guest-token'])
            ->postJson('/api/register', self::VALID)
            ->assertCreated();

        $user = User::firstWhere('email', 'sevgi@example.com');
        $userCart = Cart::where('user_id', $user->id)->firstOrFail();

        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $userCart->id,
            'variant_id' => $variant->id,
            'quantity' => 2,
        ]);
        $this->assertDatabaseMissing('carts', ['token' => 'guest-token']);
    }

    public function test_register_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'sevgi@example.com']);

        $this->postJson('/api/register', self::VALID)
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');

        $this->assertGuest();
    }

    public function test_register_rejects_weak_and_unconfirmed_passwords(): void
    {
        $this->postJson('/api/register', [...self::VALID, 'password' => 'kısa', 'password_confirmation' => 'kısa'])
            ->assertJsonValidationErrors('password');

        $this->postJson('/api/register', [...self::VALID, 'password_confirmation' => 'BaşkaParola1!'])
            ->assertJsonValidationErrors('password');

        $this->assertDatabaseCount('users', 0);
    }

    public function test_login_authenticates_and_returns_the_user(): void
    {
        User::factory()->create(['email' => 'sevgi@example.com', 'password' => 'Parola1234!']);

        $this->postJson('/api/login', ['email' => 'sevgi@example.com', 'password' => 'Parola1234!'])
            ->assertOk()
            ->assertJsonPath('email', 'sevgi@example.com');

        $this->assertAuthenticated();
        $this->getJson('/api/user')->assertOk()->assertJsonPath('email', 'sevgi@example.com');
    }

    public function test_login_merges_guest_cart(): void
    {
        $user = User::factory()->create(['email' => 'sevgi@example.com', 'password' => 'Parola1234!']);
        $variant = $this->variant(stock: 5);
        $guestCart = Cart::create(['token' => 'guest-token', 'expires_at' => now()->addDays(30)]);
        CartItem::create(['cart_id' => $guestCart->id, 'variant_id' => $variant->id, 'quantity' => 1]);

        $this->withSession(['cart_token' => 'guest-token'])
            ->postJson('/api/login', ['email' => 'sevgi@example.com', 'password' => 'Parola1234!'])
            ->assertOk();

        $userCart = Cart::where('user_id', $user->id)->firstOrFail();
        $this->assertDatabaseHas('cart_items', ['cart_id' => $userCart->id, 'variant_id' => $variant->id, 'quantity' => 1]);
    }

    public function test_login_rejects_a_wrong_password(): void
    {
        User::factory()->create(['email' => 'sevgi@example.com', 'password' => 'Parola1234!']);

        $this->postJson('/api/login', ['email' => 'sevgi@example.com', 'password' => 'yanlış-parola'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'E-posta veya şifre hatalı.');

        $this->assertGuest();
    }

    public function test_login_is_throttled_after_five_failed_attempts(): void
    {
        User::factory()->create(['email' => 'sevgi@example.com', 'password' => 'Parola1234!']);

        foreach (range(1, 5) as $ignored) {
            $this->postJson('/api/login', ['email' => 'sevgi@example.com', 'password' => 'yanlış'])->assertStatus(422);
        }

        $this->postJson('/api/login', ['email' => 'sevgi@example.com', 'password' => 'Parola1234!'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Çok fazla deneme yapıldı. Lütfen birazdan tekrar deneyin.');

        $this->assertGuest();

        RateLimiter::clear('sevgi@example.com|127.0.0.1');
    }

    public function test_logout_ends_the_session(): void
    {
        User::factory()->create(['email' => 'sevgi@example.com', 'password' => 'Parola1234!']);

        $this->postJson('/api/login', ['email' => 'sevgi@example.com', 'password' => 'Parola1234!'])->assertOk();
        $this->postJson('/api/logout')->assertNoContent();

        // In-process the auth manager still holds the user the login request
        // resolved, so assert on what actually carries auth between requests:
        // the session key is gone, so the next real request is unauthenticated.
        $this->assertNull(session(Auth::guard('web')->getName()));
    }

    /**
     * Sanctum's statefulApi() only starts a session when Referer/Origin matches
     * SANCTUM_STATEFUL_DOMAINS; when it didn't, every session-backed route —
     * register, login, the cart — returned a 500. The session stack is now
     * unconditional on the api group, so a header-less request must still work.
     */
    public function test_register_and_cart_work_without_referer_or_origin_headers(): void
    {
        $this->postJson('/api/register', self::VALID, ['Referer' => '', 'Origin' => ''])->assertCreated();

        $this->getJson('/api/cart')->assertSuccessful();
    }

    private function variant(int $stock): ProductVariant
    {
        return ProductVariant::create([
            'product_id' => Product::factory()->create()->id,
            'size' => 'M',
            'stock' => $stock,
            'is_active' => true,
        ]);
    }
}
