<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';

    protected static ?string $navigationLabel = 'Kategoriler';

    protected static ?string $modelLabel = 'kategori';

    protected static ?string $pluralModelLabel = 'kategoriler';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->label('Ad')->required()->maxLength(128),
            Forms\Components\TextInput::make('slug')->label('Slug')->required()->maxLength(64)->unique(ignoreRecord: true),
            Forms\Components\TextInput::make('href')->label('Bağlantı')->required()->maxLength(128),
            Forms\Components\TextInput::make('image')->label('Görsel URL')->required()->url()->maxLength(512),
            Forms\Components\TextInput::make('item_count')
                ->label('Ürün Sayısı (Vitrin Metni)')
                ->numeric()
                ->required()
                ->default(0)
                ->helperText("Bu, gerçek ürün sayısı değil, ana sayfa kartında gösterilen editoryal bir sayıdır. 0 girilirse kart \"%60'a Varan İndirim\" yazısını gösterir — bunu \"düzeltmeyin\"."),
            Forms\Components\TextInput::make('position')->label('Sıra')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->label('Aktif')->default(true),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')->label(''),
                Tables\Columns\TextColumn::make('name')->label('Ad')->searchable(),
                Tables\Columns\TextColumn::make('slug')->label('Slug'),
                Tables\Columns\TextColumn::make('item_count')->label('Ürün Sayısı (Vitrin)'),
                Tables\Columns\IconColumn::make('is_active')->label('Aktif')->boolean(),
            ])
            ->defaultSort('position')
            ->reorderable('position')
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
