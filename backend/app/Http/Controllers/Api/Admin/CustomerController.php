<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $users = User::orderBy('created_at', 'desc')->get();
        
        $customers = $users->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '-',
                'joined' => $user->created_at ? $user->created_at->format('d M Y') : '-',
                'orders' => 0, // Placeholder for order count
                'spent' => '₺0,00', // Placeholder for total spent
            ];
        });

        return response()->json($customers);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:32',
        ]);

        $user->update($validated);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '-',
            'joined' => $user->created_at ? $user->created_at->format('d M Y') : '-',
            'orders' => 0,
            'spent' => '₺0,00',
        ]);
    }
}
