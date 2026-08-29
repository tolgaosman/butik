<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class VariantsRelationManager extends RelationManager
{
    protected static string $relationship = 'variants';

    protected static ?string $title = 'Bedenler ve Stok';

    public function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('size')
                ->label('Beden')
                ->maxLength(32)
                ->helperText('Örn: XS, S, M, L, XL, 36, 4-5 Yaş — bedensiz ürün için boş bırakın.')
                ->nullable(),
            Forms\Components\TextInput::make('sku')
                ->label('SKU')
                ->maxLength(64),
            Forms\Components\TextInput::make('stock')
                ->label('Stok')
                ->numeric()
                ->required()
                ->default(0),
            Forms\Components\Toggle::make('is_active')
                ->label('Aktif')
                ->default(true),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('size')
            ->columns([
                Tables\Columns\TextColumn::make('size')->label('Beden')->placeholder('Bedensiz'),
                Tables\Columns\TextColumn::make('sku')->label('SKU'),
                Tables\Columns\TextColumn::make('stock')
                    ->label('Stok')
                    ->color(fn ($state) => $state <= 3 ? 'danger' : null)
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')->label('Aktif')->boolean(),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
