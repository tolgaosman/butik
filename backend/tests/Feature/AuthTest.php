<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\PhoneOtp;
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
        'phone' => '5551234567',
        'password' => 'Parola1234!',
        'password_confirmation' => 'Parola1234!',
    ];

    public function test_register_creates_user_and_authenticates(): void
    {
        $this->postJson('/api/register', self::VALID)
            ->assertCreated()
            ->assertJson(['name' => 'Sevgi Yılmaz', 'phone' => '5551234567', 'isAdmin' => false])
            ->assertJsonMissingPath('password');

        $this->assertDatabaseHas('users', ['phone' => '5551234567']);
        $this->assertAuthenticated();
        $this->assertTrue(Hash::check('Parola1234!', User::firstWhere('phone', '5551234567')->password));
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

        $user = User::firstWhere('phone', '5551234567');
        $userCart = Cart::where('user_id', $user->id)->firstOrFail();

        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $userCart->id,
            'variant_id' => $variant->id,
            'quantity' => 2,
        ]);
        $this->assertDatabaseMissing('carts', ['token' => 'guest-token']);
    }

    public function test_register_rejects_duplicate_phone(): void
    {
        User::factory()->create(['phone' => '5551234567']);

        $this->postJson('/api/register', self::VALID)
            ->assertStatus(422)
            ->assertJsonValidationErrors('phone');

        $this->assertGuest();
    }

    public function test_register_rejects_an_invalid_phone(): void
    {
        $this->postJson('/api/register', [...self::VALID, 'phone' => '12345'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('phone');

        $this->assertDatabaseCount('users', 0);
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
        User::factory()->create(['phone' => '5551234567', 'password' => 'Parola1234!']);

        $this->postJson('/api/login', ['phone' => '5551234567', 'password' => 'Parola1234!'])
            ->assertOk()
            ->assertJsonPath('phone', '5551234567');

        $this->assertAuthenticated();
        $this->getJson('/api/user')->assertOk()->assertJsonPath('phone', '5551234567');
    }

    /**
     * Login accepts common human-typed formats (spaces, leading 0, +90) and
     * normalizes to the bare 10-digit form stored on the user.
     */
    public function test_login_normalizes_phone_formatting(): void
    {
        User::factory()->create(['phone' => '5551234567', 'password' => 'Parola1234!']);

        $this->postJson('/api/login', ['phone' => '0555 123 45 67', 'password' => 'Parola1234!'])
            ->assertOk()
            ->assertJsonPath('phone', '5551234567');
    }

    /**
     * The admin panel is the one surface that authenticates by email instead
     * of phone — same endpoint, branches on which field is present.
     */
    public function test_login_with_email_authenticates_an_admin(): void
    {
        User::factory()->create([
            'phone' => '5551234567',
            'email' => 'admin@sevgibutik.com',
            'password' => 'Parola1234!',
            'is_admin' => true,
        ]);

        $this->postJson('/api/login', ['email' => 'admin@sevgibutik.com', 'password' => 'Parola1234!'])
            ->assertOk()
            ->assertJsonPath('email', 'admin@sevgibutik.com')
            ->assertJsonPath('isAdmin', true);

        $this->assertAuthenticated();
    }

    public function test_login_with_email_rejects_a_wrong_password(): void
    {
        User::factory()->create(['email' => 'admin@sevgibutik.com', 'password' => 'Parola1234!']);

        $this->postJson('/api/login', ['email' => 'admin@sevgibutik.com', 'password' => 'yanlış'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'E-posta veya şifre hatalı.');

        $this->assertGuest();
    }

    public function test_login_merges_guest_cart(): void
    {
        $user = User::factory()->create(['phone' => '5551234567', 'password' => 'Parola1234!']);
        $variant = $this->variant(stock: 5);
        $guestCart = Cart::create(['token' => 'guest-token', 'expires_at' => now()->addDays(30)]);
        CartItem::create(['cart_id' => $guestCart->id, 'variant_id' => $variant->id, 'quantity' => 1]);

        $this->withSession(['cart_token' => 'guest-token'])
            ->postJson('/api/login', ['phone' => '5551234567', 'password' => 'Parola1234!'])
            ->assertOk();

        $userCart = Cart::where('user_id', $user->id)->firstOrFail();
        $this->assertDatabaseHas('cart_items', ['cart_id' => $userCart->id, 'variant_id' => $variant->id, 'quantity' => 1]);
    }

    public function test_login_rejects_a_wrong_password(): void
    {
        User::factory()->create(['phone' => '5551234567', 'password' => 'Parola1234!']);

        $this->postJson('/api/login', ['phone' => '5551234567', 'password' => 'yanlış-parola'])
            ->assertStatus(422)
            ->assertJsonPath('errors.phone.0', 'Telefon numarası veya şifre hatalı.');

        $this->assertGuest();
    }

    public function test_login_is_throttled_after_five_failed_attempts(): void
    {
        User::factory()->create(['phone' => '5551234567', 'password' => 'Parola1234!']);

        foreach (range(1, 5) as $ignored) {
            $this->postJson('/api/login', ['phone' => '5551234567', 'password' => 'yanlış'])->assertStatus(422);
        }

        $this->postJson('/api/login', ['phone' => '5551234567', 'password' => 'Parola1234!'])
            ->assertStatus(422)
            ->assertJsonPath('errors.phone.0', 'Çok fazla deneme yapıldı. Lütfen birazdan tekrar deneyin.');

        $this->assertGuest();

        RateLimiter::clear('5551234567|127.0.0.1');
    }

    public function test_logout_ends_the_session(): void
    {
        User::factory()->create(['phone' => '5551234567', 'password' => 'Parola1234!']);

        $this->postJson('/api/login', ['phone' => '5551234567', 'password' => 'Parola1234!'])->assertOk();
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

    /**
     * forgotPassword never reveals whether a phone is registered — both
     * branches return the same generic message.
     */
    public function test_forgot_password_issues_an_otp_for_a_known_phone(): void
    {
        User::factory()->create(['phone' => '5551234567']);

        $this->postJson('/api/password/forgot', ['phone' => '5551234567'])->assertOk();

        $this->assertDatabaseHas('phone_otps', ['phone' => '5551234567']);
    }

    public function test_forgot_password_responds_the_same_for_an_unknown_phone(): void
    {
        $known = $this->postJson('/api/password/forgot', ['phone' => '5551234567']);
        $unknown = $this->postJson('/api/password/forgot', ['phone' => '5559999999']);

        $known->assertOk();
        $unknown->assertOk();
        $this->assertSame($known->json('message'), $unknown->json('message'));
        $this->assertDatabaseMissing('phone_otps', ['phone' => '5559999999']);
    }

    public function test_reset_password_updates_the_password_with_a_valid_code(): void
    {
        User::factory()->create(['phone' => '5551234567', 'password' => 'EskiParola1!']);
        $code = PhoneOtp::issue('5551234567');

        $this->postJson('/api/password/reset', [
            'phone' => '5551234567',
            'code' => $code,
            'password' => 'YeniParola1!',
            'password_confirmation' => 'YeniParola1!',
        ])->assertOk();

        $this->assertTrue(Hash::check('YeniParola1!', User::firstWhere('phone', '5551234567')->password));
    }

    public function test_reset_password_rejects_a_wrong_code(): void
    {
        User::factory()->create(['phone' => '5551234567', 'password' => 'EskiParola1!']);
        PhoneOtp::issue('5551234567');

        $this->postJson('/api/password/reset', [
            'phone' => '5551234567',
            'code' => '000000',
            'password' => 'YeniParola1!',
            'password_confirmation' => 'YeniParola1!',
        ])->assertStatus(422)->assertJsonValidationErrors('code');
    }

    public function test_reset_password_rejects_a_reused_code(): void
    {
        User::factory()->create(['phone' => '5551234567', 'password' => 'EskiParola1!']);
        $code = PhoneOtp::issue('5551234567');

        $payload = [
            'phone' => '5551234567',
            'code' => $code,
            'password' => 'YeniParola1!',
            'password_confirmation' => 'YeniParola1!',
        ];

        $this->postJson('/api/password/reset', $payload)->assertOk();
        $this->postJson('/api/password/reset', $payload)->assertStatus(422);
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
