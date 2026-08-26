<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderTrackingResource;
use App\Models\Order;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function __construct(
        private readonly CartService $carts,
        private readonly OrderService $orders,
    ) {}

    public function store(Request $request): OrderResource
    {
        $data = $request->validate([
            'email' => 'required|email|max:255',
            'shipping_line1' => 'required|string|max:255',
            'shipping_line2' => 'nullable|string|max:255',
            'shipping_district' => 'required|string|max:128',
            'shipping_city' => 'required|string|max:128',
            'shipping_postal' => 'nullable|string|max:16',
            'customer_note' => 'nullable|string|max:1000',
            'payment_method' => 'required|in:cash_on_delivery,bank_transfer',
            'phone' => 'required|string|regex:/^5\d{9}$/', // Ask for phone in checkout
        ], [
            'phone.regex' => 'Geçerli bir telefon numarası girin (Örn. 5XX XXX XX XX).',
            'phone.required' => 'Kargo teslimatı için telefon numarası zorunludur.',
        ]);

        $user = $request->user();
        $data['shipping_name'] = $user->name;

        // Note: we take the phone directly from the order form now, not from $user->phone
        
        $cart = $this->carts->resolve($user, $request);
        $order = $this->orders->placeFromCart($cart, $user, $data);
        $order->load('items');

        // Send Email
        try {
            \Illuminate\Support\Facades\Mail::to($order->email)->send(new \App\Mail\OrderCreated($order));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Order email failed: ' . $e->getMessage());
        }

        return new OrderResource($order);
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(20);

        return OrderResource::collection($orders);
    }

    public function show(Request $request, string $orderNumber): OrderResource|JsonResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', $request->user()->id)
            ->with('items')
            ->first();

        if (! $order) {
            return response()->json(['message' => 'Sipariş bulunamadı.'], 404);
        }

        return new OrderResource($order);
    }

    /**
     * Guest order tracking is an enumeration oracle — order numbers are
     * sequential and guessable, so the email is the only real secret.
     * Both "wrong number" and "wrong email" return the identical generic
     * message, and the response never includes address or phone.
     */
    public function track(Request $request): OrderTrackingResource|JsonResponse
    {
        $data = $request->validate([
            'order_number' => 'required|string|max:16',
            'email' => 'required|email',
        ]);

        $key = 'order-track:'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['message' => 'Çok fazla deneme yapıldı. Lütfen birazdan tekrar deneyin.'], 429);
        }

        RateLimiter::hit($key, 60);

        $order = Order::where('order_number', $data['order_number'])
            ->whereRaw('LOWER(email) = ?', [Str::lower($data['email'])])
            ->with('items')
            ->first();

        if (! $order) {
            return response()->json(['message' => 'Sipariş bulunamadı. Sipariş numaranızı ve e-posta adresinizi kontrol edin.'], 404);
        }

        RateLimiter::clear($key);

        return new OrderTrackingResource($order);
    }

    public function cancel(Request $request, string $orderNumber): OrderResource|JsonResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $order) {
            return response()->json(['message' => 'Sipariş bulunamadı.'], 404);
        }

        if (! in_array($order->status, ['pending', 'confirmed'], true)) {
            return response()->json(['message' => 'Bu sipariş artık iptal edilemez.'], 422);
        }

        $order->update(['status' => 'cancelled']);

        foreach ($order->items as $item) {
            $item->variant?->increment('stock', $item->quantity);
        }

        return new OrderResource($order->fresh('items'));
    }
}
