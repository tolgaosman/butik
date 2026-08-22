<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'items';

    protected static ?string $title = 'Ürünler';

    /**
     * Orders are immutable snapshots — refunds and cancellations are status
     * changes on the order itself, never edits to what was actually sold.
     */
    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('product_name')
            ->columns([
                Tables\Columns\ImageColumn::make('product_image')->label(''),
                Tables\Columns\TextColumn::make('product_name')->label('Ürün'),
                Tables\Columns\TextColumn::make('size')->label('Beden')->placeholder('-'),
                Tables\Columns\TextColumn::make('quantity')->label('Adet'),
                Tables\Columns\TextColumn::make('unit_price_minor')
                    ->label('Birim Fiyat')
                    ->formatStateUsing(fn ($state) => number_format($state / 100, 2, ',', '.').' ₺'),
                Tables\Columns\TextColumn::make('line_total_minor')
                    ->label('Toplam')
                    ->formatStateUsing(fn ($state) => number_format($state / 100, 2, ',', '.').' ₺'),
            ]);
    }
}
