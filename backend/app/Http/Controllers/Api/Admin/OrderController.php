<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('user')->orderBy('created_at', 'desc')->get();

        $formattedOrders = $orders->map(function($order) {
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

            return [
                'id' => $order->order_number, // "#ORD-001" format in frontend expects this, we use order_number
                'customer' => $order->shipping_name ?? ($order->user ? $order->user->name : 'Misafir'),
                'email' => $order->email,
                'date' => $order->created_at ? $order->created_at->format('d M Y, H:i') : '-',
                'status' => $statusMap[$order->status] ?? $order->status,
                'total' => '₺' . number_format($order->total_minor / 100, 2, ',', '.'),
                'items' => 0, // Placeholder
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
