<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestOrders extends BaseWidget
{
    protected static ?string $heading = 'Son Siparişler';

    public function table(Table $table): Table
    {
        return $table
            ->query(Order::query()->latest())
            ->columns([
                Tables\Columns\TextColumn::make('order_number')->label('Sipariş No'),
                Tables\Columns\TextColumn::make('email')->label('Müşteri'),
                Tables\Columns\TextColumn::make('total_minor')
                    ->label('Toplam')
                    ->formatStateUsing(fn ($state) => number_format($state / 100, 2, ',', '.').' ₺'),
                Tables\Columns\TextColumn::make('status')->label('Durum')->badge(),
                Tables\Columns\TextColumn::make('created_at')->label('Tarih')->dateTime('d.m.Y H:i'),
            ])
            ->paginated(false);
    }
}
