<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'nullable|string|max:255',
        ]);

        $subscriber = NewsletterSubscriber::where('email', $data['email'])->first();

        if ($subscriber) {
            $subscriber->update(['name' => $data['name'] ?? $subscriber->name, 'is_active' => true, 'unsubscribed_at' => null]);
        } else {
            NewsletterSubscriber::create([
                'email' => $data['email'],
                'name' => $data['name'] ?? null,
                'is_active' => true,
                'unsubscribe_token' => Str::random(40),
            ]);
        }

        return response()->json(['message' => 'Bültenimize hoş geldiniz.'], 201);
    }

    public function unsubscribe(string $token): JsonResponse
    {
        $subscriber = NewsletterSubscriber::where('unsubscribe_token', $token)->first();

        if (! $subscriber) {
            return response()->json(['message' => 'Geçersiz bağlantı.'], 404);
        }

        $subscriber->update(['is_active' => false, 'unsubscribed_at' => now()]);

        return response()->json(['message' => 'Abonelikten çıkıldı.']);
    }
}
