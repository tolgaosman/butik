<?php

namespace App\Support;

use App\Models\Setting;

class StoreSettings
{
    /**
     * Seeds every storefront surface (Footer, LocationMap, contact page,
     * WhatsApp link, checkout bank details, order emails) until an admin
     * edits them once — mirrors the values that used to be hardcoded in
     * frontend/src/lib/business.ts.
     */
    public const DEFAULTS = [
        'store_name' => 'Sevgi Butik',
        'store_category' => "Düzova'da bir giyim mağazası",
        'store_address' => 'İskele Anayolu, Düzova, Lefkoşa',
        'store_maps_query' => 'Sevgi Butik, İskele Anayolu, Düzova, Lefkoşa',
        'store_phone' => '0542 873 91 96',
        'store_email' => 'info@sevgibutik.com',
        'store_instagram' => 'https://www.instagram.com/sevgi.butikk18?igsi=OTcxdXRmc2RibXph&utm_source=qr',
        'store_facebook' => 'https://www.facebook.com/profile.php?id=61564957254292&mibextid=wwXIfr&rdid=2VjaMhKQa675mN0o&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18mZBTVct9%2F%3Fmibextid%3DwwXIfr',
        'bank_name' => '',
        'bank_account_holder' => '',
        'bank_iban' => '',
    ];

    public static function all(): array
    {
        $keys = array_keys(self::DEFAULTS);
        $settings = Setting::whereIn('key', $keys)->get()->pluck('value', 'key');

        $result = [];
        foreach (self::DEFAULTS as $key => $default) {
            $result[$key] = $settings[$key] ?? $default;
        }

        return $result;
    }
}
