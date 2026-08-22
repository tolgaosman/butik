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
}
