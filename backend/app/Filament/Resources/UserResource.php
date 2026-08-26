<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationLabel = 'Müşteriler';

    protected static ?string $modelLabel = 'müşteri';

    protected static ?string $pluralModelLabel = 'müşteriler';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->label('Ad Soyad')->required()->maxLength(255),
            Forms\Components\TextInput::make('email')
                ->label('E-posta')
                ->helperText('Sadece yöneticiler için — panele bu e-posta ile giriş yapılır.')
                ->email()
                ->unique(ignoreRecord: true)
                ->maxLength(255),
            Forms\Components\TextInput::make('phone')
                ->label('Telefon')
                ->tel()
                ->required()
                ->regex('/^5\d{9}$/')
                ->helperText('Örn. 5XXXXXXXXX')
                ->unique(ignoreRecord: true)
                ->maxLength(32),
            Forms\Components\Toggle::make('is_admin')->label('Yönetici'),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Ad Soyad')->searchable(),
                Tables\Columns\TextColumn::make('email')->label('E-posta')->searchable()->placeholder('—'),
                Tables\Columns\TextColumn::make('phone')->label('Telefon')->searchable(),
                Tables\Columns\TextColumn::make('orders_count')->label('Sipariş Sayısı')->counts('orders'),
                Tables\Columns\IconColumn::make('is_admin')->label('Yönetici')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label('Kayıt Tarihi')->dateTime('d.m.Y'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            \App\Filament\Resources\UserResource\RelationManagers\OrdersRelationManager::class,
            \App\Filament\Resources\UserResource\RelationManagers\AddressesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
