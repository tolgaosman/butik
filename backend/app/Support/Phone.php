<?php

namespace App\Support;

/**
 * Normalizes Turkish/KKTC mobile numbers to the bare 10-digit form
 * ("5XXXXXXXXX") that both the users.phone column and the Netgsm "no"
 * parameter expect — strips spaces/dashes/parens and any +90/0090/90/0
 * country or trunk prefix.
 */
class Phone
{
    public static function normalize(string $raw): string
    {
        $digits = preg_replace('/\D/', '', $raw) ?? '';

        foreach (['0090', '90', '0'] as $prefix) {
            if (str_starts_with($digits, $prefix) && strlen($digits) > 10) {
                $digits = substr($digits, strlen($prefix));
                break;
            }
        }

        return $digits;
    }

    public static function isValid(string $raw): bool
    {
        return (bool) preg_match('/^5\d{9}$/', self::normalize($raw));
    }
}
