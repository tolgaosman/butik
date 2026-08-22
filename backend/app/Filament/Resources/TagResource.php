<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TagResource\Pages;
use App\Models\Tag;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TagResource extends Resource
{
    protected static ?string $model = Tag::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static ?string $navigationLabel = 'Etiketler';

    protected static ?string $modelLabel = 'etiket';

    protected static ?string $pluralModelLabel = 'etiketler';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->label('Ad')->required()->maxLength(128),
            Forms\Components\TextInput::make('slug')->label('Slug')->required()->maxLength(64)->unique(ignoreRecord: true),
            Forms\Components\Select::make('type')
                ->label('Tip')
                ->options(['category' => 'Kategori', 'subcategory' => 'Alt Kategori', 'collection' => 'Koleksiyon'])
                ->required(),
            Forms\Components\TextInput::make('position')->label('Sıra')->numeric()->default(0),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Ad')->searchable(),
                Tables\Columns\TextColumn::make('slug')->label('Slug'),
                Tables\Columns\TextColumn::make('type')
                    ->label('Tip')
                    ->badge()
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'category' => 'Kategori',
                        'subcategory' => 'Alt Kategori',
                        'collection' => 'Koleksiyon',
                    }),
                Tables\Columns\TextColumn::make('products_count')->label('Ürün Sayısı')->counts('products'),
            ])
            ->defaultGroup('type')
            ->defaultSort('position')
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTags::route('/'),
            'create' => Pages\CreateTag::route('/create'),
            'edit' => Pages\EditTag::route('/{record}/edit'),
        ];
    }
}
