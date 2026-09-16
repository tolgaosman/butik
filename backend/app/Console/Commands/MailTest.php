<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

/**
 * Order/OTP mail is queued and its failures are logged, not surfaced —
 * exactly the setup that let the wrong Resend package sit broken for days.
 * This sends synchronously and lets any exception reach the terminal
 * verbatim, so "does mail actually work" has a one-command answer.
 */
class MailTest extends Command
{
    protected $signature = 'mail:test {to : Address to send the test mail to}';

    protected $description = 'Send a synchronous test email through the configured mailer and report any failure';

    public function handle(): int
    {
        $mailer = config('mail.default');
        $from = config('mail.from.address');
        $hasResendKey = filled(config('services.resend.key'));

        $this->info("mailer: {$mailer}");
        $this->info("from: {$from}");
        if ($mailer === 'resend') {
            $this->info('RESEND_API_KEY set: '.($hasResendKey ? 'yes' : 'NO — will fail'));
        }

        try {
            Mail::mailer($mailer)->raw(
                'Bu, php artisan mail:test tarafından gönderilen bir test e-postasıdır.',
                fn ($message) => $message->to($this->argument('to'))->subject('Sevgi Butik — Mail Testi'),
            );
        } catch (\Throwable $e) {
            $this->error('Gönderim başarısız: '.$e->getMessage());
            $this->line(get_class($e));

            return self::FAILURE;
        }

        $this->info('Gönderildi.');

        return self::SUCCESS;
    }
}
