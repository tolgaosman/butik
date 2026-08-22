<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ReviewsRelationManager extends RelationManager
{
    protected static string $relationship = 'reviews';

    protected static ?string $title = 'Yorumlar';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('author_name')
            ->columns([
                Tables\Columns\TextColumn::make('author_name')->label('Yazan'),
                Tables\Columns\TextColumn::make('rating')->label('Puan')->badge(),
                Tables\Columns\TextColumn::make('title')->label('Başlık')->limit(30),
                Tables\Columns\IconColumn::make('is_approved')->label('Onaylı')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label('Tarih')->dateTime('d.m.Y'),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Onayla')
                    ->icon('heroicon-o-check')
                    ->visible(fn ($record) => ! $record->is_approved)
                    ->action(fn ($record) => $record->update(['is_approved' => true, 'approved_at' => now()])),
                Tables\Actions\Action::make('unapprove')
                    ->label('Onayı Kaldır')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->visible(fn ($record) => $record->is_approved)
                    ->action(fn ($record) => $record->update(['is_approved' => false, 'approved_at' => null])),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
