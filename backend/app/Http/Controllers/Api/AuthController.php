<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private readonly CartService $carts) {}

    public function register(Request $request): UserResource
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'phone' => 'nullable|string|max:32',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
        ]);

        event(new Registered($user));

        $this->loginAndMergeCart($request, $user);

        return new UserResource($user);
    }

    public function login(Request $request): UserResource
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $key = Str::lower($data['email']).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages([
                'email' => 'Çok fazla deneme yapıldı. Lütfen birazdan tekrar deneyin.',
            ]);
        }

        if (! Auth::attempt($data)) {
            RateLimiter::hit($key, 60);

            throw ValidationException::withMessages([
                'email' => 'E-posta veya şifre hatalı.',
            ]);
        }

        RateLimiter::clear($key);

        $user = Auth::user();
        $this->loginAndMergeCart($request, $user, alreadyAuthenticated: true);

        return new UserResource($user);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(null, 204);
    }

    public function user(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function updateProfile(Request $request): UserResource
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:32',
            'email' => 'sometimes|email|max:255|unique:users,email,'.$user->id,
        ]);

        $user->update($data);

        return new UserResource($user);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update(['password' => Hash::make($data['password'])]);

        return response()->json(null, 204);
    }

    /**
     * Cart tokens live in the session. The guest token must be read BEFORE
     * session()->regenerate() runs (triggered internally by Auth::login()/
     * attempt()) — regeneration is not guaranteed to preserve it, so capture
     * it first and fold the guest cart into the user's cart afterward.
     */
    private function loginAndMergeCart(Request $request, User $user, bool $alreadyAuthenticated = false): void
    {
        $guestToken = $request->session()->get('cart_token');

        if (! $alreadyAuthenticated) {
            Auth::login($user);
        }

        $request->session()->regenerate();

        if ($guestToken) {
            $this->carts->mergeGuestCartIntoUser($guestToken, $user);
        }
    }
}
