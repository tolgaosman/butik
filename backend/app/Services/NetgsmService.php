<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Sends single SMS messages through Netgsm's REST API. Driver defaults to
 * "log" (writes the message to storage/logs/laravel.log) until
 * NETGSM_USERCODE/NETGSM_PASSWORD are configured — mirrors MAIL_MAILER=log.
 */
class NetgsmService
{
    private const ENDPOINT = 'https://api.netgsm.com.tr/sms/rest/v2/send';

    public function send(string $phone, string $message): bool
    {
        if (config('services.netgsm.driver') !== 'api') {
            Log::info("[netgsm:log] SMS to {$phone}: {$message}");

            return true;
        }

        $response = Http::asJson()
            ->withBasicAuth(config('services.netgsm.usercode'), config('services.netgsm.password'))
            ->post(self::ENDPOINT, [
                'msgheader' => config('services.netgsm.header'),
                'encoding' => 'TR',
                'iysfilter' => '',
                'partnercode' => '',
                'messages' => [
                    ['msg' => $message, 'no' => $phone],
                ],
            ]);

        if (! $response->successful()) {
            Log::error('Netgsm SMS gönderimi başarısız', ['phone' => $phone, 'status' => $response->status()]);

            return false;
        }

        // Netgsm returns 00|jobid on success, error codes ("30", "40", ...) otherwise.
        $code = explode('|', trim($response->body()))[0] ?? '';

        if ($code !== '00') {
            Log::error('Netgsm SMS reddedildi', ['phone' => $phone, 'code' => $code]);

            return false;
        }

        return true;
    }
}
