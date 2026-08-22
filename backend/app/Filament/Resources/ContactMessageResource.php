<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactMessageResource\Pages;
use App\Models\ContactMessage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $navigationLabel = 'Mesajlar';

    protected static ?string $modelLabel = 'mesaj';

    protected static ?string $pluralModelLabel = 'mesajlar';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->label('Ad Soyad')->disabled(),
            Forms\Components\TextInput::make('email')->label('E-posta')->disabled(),
            Forms\Components\TextInput::make('phone')->label('Telefon')->disabled(),
            Forms\Components\TextInput::make('subject')->label('Konu')->disabled(),
            Forms\Components\Textarea::make('message')->label('Mesaj')->disabled()->columnSpanFull()->rows(5),
            Forms\Components\Select::make('status')
                ->label('Durum')
                ->options(['new' => 'Yeni', 'read' => 'Okundu', 'replied' => 'Yanıtlandı', 'archived' => 'Arşivlendi'])
                ->required(),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Ad Soyad')->searchable(),
                Tables\Columns\TextColumn::make('email')->label('E-posta'),
                Tables\Columns\TextColumn::make('subject')->label('Konu')->limit(30),
                Tables\Columns\TextColumn::make('status')
                    ->label('Durum')
                    ->badge()
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'new' => 'Yeni', 'read' => 'Okundu', 'replied' => 'Yanıtlandı', 'archived' => 'Arşivlendi',
                    })
                    ->color(fn ($state) => match ($state) {
                        'new' => 'warning', 'read' => 'gray', 'replied' => 'success', 'archived' => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')->label('Tarih')->dateTime('d.m.Y H:i')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->defaultGroup(null)
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Durum')
                    ->options(['new' => 'Yeni', 'read' => 'Okundu', 'replied' => 'Yanıtlandı', 'archived' => 'Arşivlendi'])
                    ->default('new'),
            ])
            ->actions([
                Tables\Actions\Action::make('reply')
                    ->label('Yanıtla')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->url(fn (ContactMessage $record) => "mailto:{$record->email}")
                    ->openUrlInNewTab(),
                Tables\Actions\Action::make('markReplied')
                    ->label('Yanıtlandı olarak işaretle')
                    ->icon('heroicon-o-check')
                    ->visible(fn (ContactMessage $record) => $record->status !== 'replied')
                    ->action(fn (ContactMessage $record) => $record->update(['status' => 'replied'])),
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactMessages::route('/'),
            'edit' => Pages\EditContactMessage::route('/{record}/edit'),
        ];
    }
}
