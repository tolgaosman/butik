<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Notifies the shop owner that a new contact form message arrived — before
 * this, the message only landed in Filament and the owner had no reason to
 * go look for it.
 */
class ContactMessageReceived extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Yeni İletişim Mesajı — ' . ($this->contactMessage->subject ?: $this->contactMessage->name),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact-message-received',
            with: ['contactMessage' => $this->contactMessage],
        );
    }
}
