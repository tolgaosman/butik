<?php

namespace App\Support;

/**
 * The single inbound conversion point: major units (lira) -> minor units (kuruş).
 * The single outbound point is ProductResource / OrderResource dividing by 100.
 * Never convert anywhere else, or amounts double-convert.
 */
class Money
{
    public static function fromMajor(float|int $amount): int
    {
        return (int) round($amount * 100);
    }

    /**
     * Minor units to the storefront's display format — matches what
     * frontend/src/lib/format.ts produces via Intl for tr-TR (₺ leading,
     * dot thousands, comma decimals), so an email and the order page never
     * show the same total two different ways.
     */
    public static function tl(int $minor): string
    {
        return '₺'.number_format($minor / 100, 2, ',', '.');
    }
}
