<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

class SalesChart extends ChartWidget
{
    protected static ?string $heading = 'Son 30 Gün Ciro';

    protected function getData(): array
    {
        $days = collect(range(29, 0))->map(fn ($i) => now()->subDays($i)->toDateString());

        $revenueByDay = Order::whereNotIn('status', ['cancelled', 'refunded'])
            ->whereDate('created_at', '>=', now()->subDays(29))
            ->selectRaw('DATE(created_at) as day, SUM(total_minor) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        return [
            'datasets' => [
                [
                    'label' => 'Ciro (₺)',
                    'data' => $days->map(fn ($day) => ($revenueByDay[$day] ?? 0) / 100)->all(),
                ],
            ],
            'labels' => $days->map(fn ($day) => \Illuminate\Support\Carbon::parse($day)->format('d.m'))->all(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
