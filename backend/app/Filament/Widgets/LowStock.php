<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\ProductResource;
use App\Models\ProductVariant;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LowStock extends BaseWidget
{
    protected static ?string $heading = 'Düşük Stok';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                ProductVariant::query()
                    ->where('is_active', true)
                    ->where('stock', '<=', 3)
                    ->with('product')
                    ->orderBy('stock'),
            )
            ->columns([
                Tables\Columns\TextColumn::make('product.name')->label('Ürün'),
                Tables\Columns\TextColumn::make('size')->label('Beden')->placeholder('-'),
                Tables\Columns\TextColumn::make('stock')
                    ->label('Stok')
                    ->color(fn ($state) => $state === 0 ? 'danger' : 'warning')
                    ->weight('bold'),
            ])
            ->actions([
                Tables\Actions\Action::make('edit')
                    ->label('Düzenle')
                    ->url(fn (ProductVariant $record) => ProductResource::getUrl('edit', ['record' => $record->product_id])),
            ])
            ->paginated(false);
    }
}
