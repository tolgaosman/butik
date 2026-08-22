<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_number' => 'SB-'.$this->faker->unique()->numberBetween(10000, 99999),
            'email' => $this->faker->safeEmail(),
            'phone' => '05551234567',
            'status' => 'pending',
            'payment_method' => 'cash_on_delivery',
            'payment_status' => 'unpaid',
            'subtotal_minor' => 100000,
            'shipping_minor' => 0,
            'discount_minor' => 0,
            'total_minor' => 100000,
            'currency' => 'TRY',
            'shipping_name' => $this->faker->name(),
            'shipping_phone' => '05551234567',
            'shipping_line1' => $this->faker->streetAddress(),
            'shipping_district' => 'Merkez',
            'shipping_city' => 'Lefkoşa',
            'shipping_country' => 'CY',
        ];
    }
}
