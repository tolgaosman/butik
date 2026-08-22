<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class AddressesRelationManager extends RelationManager
{
    protected static string $relationship = 'addresses';

    protected static ?string $title = 'Adresler';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('full_name')
            ->columns([
                Tables\Columns\TextColumn::make('label')->label('Etiket'),
                Tables\Columns\TextColumn::make('full_name')->label('Ad Soyad'),
                Tables\Columns\TextColumn::make('city')->label('Şehir'),
                Tables\Columns\TextColumn::make('district')->label('İlçe'),
                Tables\Columns\IconColumn::make('is_default')->label('Varsayılan')->boolean(),
            ]);
    }
}
