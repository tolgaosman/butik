<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TagFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->unique()->word();

        return [
            'slug' => \Illuminate\Support\Str::slug($name),
            'name' => ucfirst($name),
            'type' => $this->faker->randomElement(['category', 'subcategory', 'collection']),
            'position' => 0,
        ];
    }
}
