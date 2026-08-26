<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordOtp extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $code)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Şifre Sıfırlama Kodunuz - Sevgi Butik',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.auth.reset-otp',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
