<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Phone;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $users = User::where('is_admin', false)
            ->withCount('orders')
            ->withSum('orders', 'total_minor')
            ->orderBy('created_at', 'desc')
            ->get();

        $customers = $users->map(fn ($user) => $this->format($user));

        return response()->json($customers);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->merge(['phone' => Phone::normalize((string) $request->input('phone'))]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'phone' => ['required', 'regex:/^5\d{9}$/', 'unique:users,phone,'.$user->id],
        ], [
            'phone.regex' => 'Geçerli bir telefon numarası girin (Örn. 5XX XXX XX XX).',
        ]);

        $user->update($validated);

        $user->loadCount('orders')->loadSum('orders', 'total_minor');

        return response()->json($this->format($user));
    }

    private function format(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'joined' => $user->created_at ? $user->created_at->format('d M Y') : '-',
            'orders' => $user->orders_count ?? 0,
            'spent' => '₺'.number_format(($user->orders_sum_total_minor ?? 0) / 100, 2, ',', '.'),
        ];
    }
}
