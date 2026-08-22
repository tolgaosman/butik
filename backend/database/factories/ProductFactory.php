<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(3),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'price_minor' => $this->faker->numberBetween(50000, 500000),
            'compare_at_price_minor' => null,
            'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
            'has_sizes' => true,
            'rating_seed' => 4.5,
            'review_count_seed' => 10,
            'is_new' => false,
            'is_active' => true,
            'position' => 0,
        ];
    }
}
