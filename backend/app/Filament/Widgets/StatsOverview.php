<?php

namespace App\Filament\Widgets;

use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\Review;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $todayOrders = Order::whereDate('created_at', today())->count();
        $todayRevenueMinor = Order::whereDate('created_at', today())
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->sum('total_minor');
        $pendingOrders = Order::where('status', 'pending')->count();
        $pendingReviews = Review::where('is_approved', false)->count();
        $unreadMessages = ContactMessage::where('status', 'new')->count();

        return [
            Stat::make('Bugünkü Sipariş', $todayOrders),
            Stat::make('Bugünkü Ciro', number_format($todayRevenueMinor / 100, 2, ',', '.').' ₺'),
            Stat::make('Bekleyen Sipariş', $pendingOrders)
                ->color($pendingOrders > 0 ? 'warning' : 'success'),
            Stat::make('Onay Bekleyen Yorum', $pendingReviews)
                ->color($pendingReviews > 0 ? 'warning' : 'success'),
            Stat::make('Okunmamış Mesaj', $unreadMessages)
                ->color($unreadMessages > 0 ? 'warning' : 'success'),
        ];
    }
}
