<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterSubscriberResource\Pages;
use App\Models\NewsletterSubscriber;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class NewsletterSubscriberResource extends Resource
{
    protected static ?string $model = NewsletterSubscriber::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';

    protected static ?string $navigationLabel = 'Bülten Aboneleri';

    protected static ?string $modelLabel = 'abone';

    protected static ?string $pluralModelLabel = 'bülten aboneleri';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('email')->label('E-posta')->disabled(),
            Forms\Components\TextInput::make('name')->label('Ad')->disabled(),
            Forms\Components\Toggle::make('is_active')->label('Aktif'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('email')->label('E-posta')->searchable(),
                Tables\Columns\TextColumn::make('name')->label('Ad'),
                Tables\Columns\IconColumn::make('is_active')->label('Aktif')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label('Kayıt Tarihi')->dateTime('d.m.Y'),
            ])
            ->headerActions([
                Tables\Actions\Action::make('export')
                    ->label('CSV İndir')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(function () {
                        $rows = NewsletterSubscriber::where('is_active', true)->pluck('email');
                        $csv = "email\n".$rows->implode("\n");

                        return response()->streamDownload(
                            fn () => print ($csv),
                            'bulten-aboneleri.csv',
                        );
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('unsubscribe')
                    ->label('Abonelikten Çıkar')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->visible(fn (NewsletterSubscriber $record) => $record->is_active)
                    ->action(fn (NewsletterSubscriber $record) => $record->update(['is_active' => false, 'unsubscribed_at' => now()])),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNewsletterSubscribers::route('/'),
            'edit' => Pages\EditNewsletterSubscriber::route('/{record}/edit'),
        ];
    }
}
