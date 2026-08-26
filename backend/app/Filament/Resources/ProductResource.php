<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers\ImagesRelationManager;
use App\Filament\Resources\ProductResource\RelationManagers\ReviewsRelationManager;
use App\Filament\Resources\ProductResource\RelationManagers\VariantsRelationManager;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationLabel = 'Ürünler';

    protected static ?string $modelLabel = 'ürün';

    protected static ?string $pluralModelLabel = 'ürünler';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Temel Bilgiler')
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->label('Ürün Adı')
                        ->required()
                        ->maxLength(255)
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($state, callable $set, string $operation) => $operation === 'create'
                            ? $set('slug', \Illuminate\Support\Str::slug($state))
                            : null),
                    Forms\Components\TextInput::make('slug')
                        ->label('Slug')
                        ->required()
                        ->maxLength(128)
                        ->unique(ignoreRecord: true)
                        ->helperText('Frontend URL\'sinde kullanılan benzersiz kimlik (örn. cicek-desenli-midi-elbise).'),
                    Forms\Components\Textarea::make('description')
                        ->label('Açıklama')
                        ->rows(4)
                        ->columnSpanFull(),
                ])
                ->columns(2),

            Forms\Components\Section::make('Fiyat')
                ->schema([
                    Forms\Components\TextInput::make('price_minor')
                        ->label('Fiyat (₺)')
                        ->required()
                        ->numeric()
                        ->prefix('₺')
                        ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                        ->dehydrateStateUsing(fn ($state) => (int) round(((float) $state) * 100)),
                    Forms\Components\TextInput::make('compare_at_price_minor')
                        ->label('İndirim Öncesi Fiyat (₺, opsiyonel)')
                        ->numeric()
                        ->prefix('₺')
                        ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                        ->dehydrateStateUsing(fn ($state) => $state !== null && $state !== '' ? (int) round(((float) $state) * 100) : null)
                        ->helperText('Boş bırakılırsa ürün indirimli görünmez. İndirim yüzdesi otomatik hesaplanır.'),
                ])
                ->columns(2),

            Forms\Components\Section::make('Görsel')
                ->schema([
                    Forms\Components\TextInput::make('image')
                        ->label('Ana Görsel URL')
                        ->required()
                        ->url()
                        ->maxLength(512),
                ]),


            Forms\Components\Section::make('Durum')
                ->schema([
                    Forms\Components\Toggle::make('has_sizes')
                        ->label('Bedenli Ürün')
                        ->helperText('Kapalıysa (aksesuar gibi) tek bir stok kaydı kullanılır.')
                        ->default(true),
                    Forms\Components\Toggle::make('is_new')
                        ->label('Yeni Ürün'),
                    Forms\Components\Toggle::make('is_active')
                        ->label('Aktif')
                        ->default(true),
                    Forms\Components\Select::make('gender')
                        ->label('Cinsiyet')
                        ->options([
                            'kadin' => 'Kadın',
                            'erkek' => 'Erkek',
                            'unisex' => 'Unisex',
                        ])
                        ->default('unisex')
                        ->required(),
                    Forms\Components\TextInput::make('position')
                        ->label('Sıralama')
                        ->numeric()
                        ->default(0),
                ])
                ->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label(''),
                Tables\Columns\TextColumn::make('name')
                    ->label('Ürün')
                    ->weight(FontWeight::Medium)
                    ->searchable()
                    ->description(fn (Product $record) => $record->slug),
                Tables\Columns\TextColumn::make('price_minor')
                    ->label('Fiyat')
                    ->formatStateUsing(fn ($state) => number_format($state / 100, 2, ',', '.').' ₺')
                    ->sortable(),
                Tables\Columns\TextColumn::make('variants_sum_stock')
                    ->label('Stok')
                    ->sum('variants', 'stock'),
                Tables\Columns\IconColumn::make('is_new')
                    ->label('Yeni')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_new')->label('Yeni Ürün'),
                Tables\Filters\TernaryFilter::make('is_active')->label('Aktif'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('activate')
                        ->label('Aktif Yap')
                        ->icon('heroicon-o-check-circle')
                        ->action(fn ($records) => $records->each->update(['is_active' => true]))
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\BulkAction::make('deactivate')
                        ->label('Pasif Yap')
                        ->icon('heroicon-o-x-circle')
                        ->action(fn ($records) => $records->each->update(['is_active' => false]))
                        ->deselectRecordsAfterCompletion(),
                ]),
            ])
            ->defaultSort('position');
    }

    public static function getRelations(): array
    {
        return [
            VariantsRelationManager::class,
            ImagesRelationManager::class,
            ReviewsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
