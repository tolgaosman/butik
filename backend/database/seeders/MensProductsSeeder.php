<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class MensProductsSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::first();

        $mensProducts = [
            [
                'name' => 'Klasik Kesim Erkek Gömlek',
                'description' => 'Pamuklu kumaştan, rahat kesim erkek gömlek.',
                'price_minor' => 129999, // 1299.99 TL
                'image' => 'https://loremflickr.com/800/1000/fashion,man?random=101',
                'is_active' => true,
                'is_new' => true,
                'gender' => 'erkek',
            ],
            [
                'name' => 'Slim Fit Erkek Tişört',
                'description' => 'Yazlık pamuklu rahat erkek tişört.',
                'price_minor' => 45000,
                'image' => 'https://loremflickr.com/800/1000/fashion,man?random=102',
                'is_active' => true,
                'is_new' => false,
                'gender' => 'erkek',
            ],
            [
                'name' => 'Erkek Jean Pantolon',
                'description' => 'Klasik kesim, dayanıklı erkek kot pantolon.',
                'price_minor' => 189900,
                'image' => 'https://loremflickr.com/800/1000/fashion,man?random=103',
                'is_active' => true,
                'is_new' => true,
                'gender' => 'erkek',
            ],
            [
                'name' => 'Erkek Kışlık Kaban',
                'description' => 'Sıcak tutan şık kışlık kaban.',
                'price_minor' => 450000,
                'image' => 'https://loremflickr.com/800/1000/fashion,man?random=104',
                'is_active' => true,
                'is_new' => false,
                'gender' => 'erkek',
            ],
        ];

        foreach ($mensProducts as $pData) {
            $product = Product::create([
                'name' => $pData['name'],
                'slug' => Str::slug($pData['name']) . '-' . rand(100, 999),
                'description' => $pData['description'],
                'price_minor' => $pData['price_minor'],
                'image' => $pData['image'],
                'is_active' => $pData['is_active'],
                'is_new' => $pData['is_new'],
                'gender' => $pData['gender'],
            ]);
            
            $product->categories()->attach([$category->id]);
            
            $sizes = ['S', 'M', 'L', 'XL'];
            foreach ($sizes as $size) {
                $product->variants()->create([
                    'sku' => strtoupper(Str::random(6)),
                    'size' => $size,
                    'stock' => rand(5, 20),
                ]);
            }
        }
    }
}
