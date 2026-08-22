<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ImagesRelationManager extends RelationManager
{
    protected static string $relationship = 'images';

    protected static ?string $title = 'Galeri';

    public function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('url')
                ->label('Görsel URL')
                ->required()
                ->url()
                ->maxLength(512),
            Forms\Components\TextInput::make('alt')
                ->label('Alternatif Metin')
                ->maxLength(255),
            Forms\Components\TextInput::make('position')
                ->label('Sıra')
                ->numeric()
                ->default(0),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('url')
            ->columns([
                Tables\Columns\ImageColumn::make('url')->label(''),
                Tables\Columns\TextColumn::make('alt')->label('Alt Metin'),
                Tables\Columns\TextColumn::make('position')->label('Sıra')->sortable(),
            ])
            ->defaultSort('position')
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
