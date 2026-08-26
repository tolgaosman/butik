<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

#[Fillable(['email', 'code', 'attempts', 'expires_at', 'consumed_at'])]
class EmailOtp extends Model
{
    protected function casts(): array
    {
        return [
            'attempts' => 'integer',
            'expires_at' => 'datetime',
            'consumed_at' => 'datetime',
        ];
    }

    /**
     * Invalidates any earlier unconsumed codes for this email (only the most
     * recent one should ever verify) and stores the new one hashed — the
     * plaintext is returned once, for the Email body, and never persisted.
     */
    public static function issue(string $email): string
    {
        static::where('email', $email)->whereNull('consumed_at')->delete();

        $code = (string) random_int(100000, 999999);

        static::create([
            'email' => $email,
            'code' => Hash::make($code),
            'expires_at' => now()->addMinutes(10),
        ]);

        return $code;
    }

    /**
     * Consumes the newest unexpired code for this email if it matches — a
     * code can only ever verify once. Caps guesses at 5 per issued code so a
     * 6-digit OTP can't be brute-forced within its 10-minute window.
     */
    public static function verify(string $email, string $code): bool
    {
        $otp = static::where('email', $email)
            ->whereNull('consumed_at')
            ->where('expires_at', '>', now())
            ->latest('id')
            ->first();

        if (! $otp || $otp->attempts >= 5) {
            return false;
        }

        if (! Hash::check($code, $otp->code)) {
            $otp->increment('attempts');

            return false;
        }

        $otp->update(['consumed_at' => now()]);

        return true;
    }
}
