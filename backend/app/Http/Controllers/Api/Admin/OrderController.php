<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    private const PAYMENT_METHOD_LABELS = [
        'cash_on_delivery' => 'Kapıda Ödeme',
        'bank_transfer' => 'Havale / EFT',
    ];

    private const PAYMENT_STATUS_LABELS = [
        'unpaid' => 'Ödenmedi',
        'paid' => 'Ödendi',
        'refunded' => 'İade Edildi',
    ];

    public function index(Request $request)
    {
        $orders = Order::with(['user', 'items'])->orderBy('created_at', 'desc')->get();

        // Map DB status to frontend status
        $statusMap = [
            'pending' => 'Hazırlanıyor',
            'confirmed' => 'Hazırlanıyor',
            'preparing' => 'Hazırlanıyor',
            'shipped' => 'Kargoya Verildi',
            'delivered' => 'Teslim Edildi',
            'cancelled' => 'İptal Edildi',
            'refunded' => 'İptal Edildi',
        ];

        $formattedOrders = $orders->map(function ($order) use ($statusMap) {
            return [
                'id' => $order->order_number, // "#ORD-001" format in frontend expects this, we use order_number
                'customer' => $order->shipping_name ?? ($order->user ? $order->user->name : 'Misafir'),
                'email' => $order->email,
                'phone' => $order->phone,
                'date' => $order->created_at ? $order->created_at->format('d M Y, H:i') : '-',
                'status' => $statusMap[$order->status] ?? $order->status,
                'paymentMethod' => self::PAYMENT_METHOD_LABELS[$order->payment_method] ?? $order->payment_method,
                'paymentStatus' => self::PAYMENT_STATUS_LABELS[$order->payment_status] ?? $order->payment_status,
                'trackingNumber' => $order->tracking_number,
                'customerNote' => $order->customer_note,
                'shippingAddress' => [
                    'name' => $order->shipping_name,
                    'phone' => $order->shipping_phone,
                    'line1' => $order->shipping_line1,
                    'line2' => $order->shipping_line2,
                    'district' => $order->shipping_district,
                    'city' => $order->shipping_city,
                    'postalCode' => $order->shipping_postal,
                ],
                'subtotal' => $order->subtotal_minor / 100,
                'shipping' => $order->shipping_minor / 100,
                'discount' => $order->discount_minor / 100,
                'total' => '₺' . number_format($order->total_minor / 100, 2, ',', '.'),
                'totalValue' => $order->total_minor / 100,
                'items' => $order->items->sum('quantity'),
                'lineItems' => $order->items->map(fn ($item) => [
                    'name' => $item->product_name,
                    'slug' => $item->product_slug,
                    'image' => $item->product_image,
                    'size' => $item->size,
                    'quantity' => $item->quantity,
                    'unitPrice' => $item->unit_price_minor / 100,
                    'lineTotal' => $item->line_total_minor / 100,
                ]),
            ];
        });

        return response()->json($formattedOrders);
    }

    public function updateStatus(Request $request, $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        $validated = $request->validate([
            'status' => 'required|string',
        ]);

        $frontendStatus = $validated['status'];
        
        // Reverse map from frontend status to DB status
        $dbStatus = 'pending';
        if ($frontendStatus === 'Hazırlanıyor') $dbStatus = 'preparing';
        else if ($frontendStatus === 'Kargoya Verildi') $dbStatus = 'shipped';
        else if ($frontendStatus === 'Teslim Edildi') $dbStatus = 'delivered';
        else if ($frontendStatus === 'İptal Edildi') $dbStatus = 'cancelled';

        $order->update(['status' => $dbStatus]);

        return response()->json(['message' => 'Status updated successfully', 'status' => $frontendStatus]);
    }
}
