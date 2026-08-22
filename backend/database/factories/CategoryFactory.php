<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->unique()->word();

        return [
            'slug' => \Illuminate\Support\Str::slug($name),
            'name' => ucfirst($name),
            'item_count' => $this->faker->numberBetween(0, 100),
            'href' => '/'.\Illuminate\Support\Str::slug($name),
            'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
            'position' => 0,
            'is_active' => true,
        ];
    }
}
