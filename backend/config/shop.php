<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Shipping
    |--------------------------------------------------------------------------
    |
    | Matches the threshold hardcoded in the original frontend's sepet page
    | (2500 TRY) — now the single source of truth, exposed via the cart API.
    |
    */

    'free_shipping_threshold_minor' => env('FREE_SHIPPING_THRESHOLD_MINOR', 250000),

    'flat_shipping_minor' => env('FLAT_SHIPPING_MINOR', 5000),

];
