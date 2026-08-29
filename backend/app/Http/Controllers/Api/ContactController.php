<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Honeypot: a real visitor never fills this hidden field.
        if ($request->filled('website')) {
            return response()->json(['message' => 'Mesajınız gönderildi.'], 201);
        }

        $key = 'contact:'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            return response()->json(['message' => 'Çok fazla mesaj gönderildi. Lütfen birazdan tekrar deneyin.'], 429);
        }

        RateLimiter::hit($key, 60);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:32',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|min:10|max:2000',
        ]);

        $contactMessage = ContactMessage::create([
            ...$data,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $ownerEmail = Setting::where('key', 'store_email')->value('value') ?: config('mail.from.address');

        try {
            Mail::to($ownerEmail)->send(new ContactMessageReceived($contactMessage));
        } catch (\Exception $e) {
            Log::error('Contact notification email failed: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Mesajınız gönderildi.'], 201);
    }
}
