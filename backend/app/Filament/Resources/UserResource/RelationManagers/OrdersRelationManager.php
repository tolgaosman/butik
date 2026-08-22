<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class OrdersRelationManager extends RelationManager
{
    protected static string $relationship = 'orders';

    protected static ?string $title = 'Siparişler';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('order_number')
            ->columns([
                Tables\Columns\TextColumn::make('order_number')->label('Sipariş No'),
                Tables\Columns\TextColumn::make('status')->label('Durum')->badge(),
                Tables\Columns\TextColumn::make('total_minor')
                    ->label('Toplam')
                    ->formatStateUsing(fn ($state) => number_format($state / 100, 2, ',', '.').' ₺'),
                Tables\Columns\TextColumn::make('created_at')->label('Tarih')->dateTime('d.m.Y'),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
