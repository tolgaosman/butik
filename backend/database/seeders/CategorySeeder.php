<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Transcribed verbatim from frontend/src/lib/products.ts. item_count is
     * editorial marketing copy, not a real count (real counts are 9/9/9/11) —
     * İndirim's 0 is a sentinel that makes CategoryCard render
     * "%60'a Varan İndirim" instead of "N+ Ürün". Do not "fix" it to be accurate.
     */
    public function run(): void
    {
        $rows = [
            [
                'slug' => 'elbise',
                'name' => 'Elbise',
                'item_count' => 120,
                'href' => '/elbise',
                'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'ust-giyim',
                'name' => 'Üst Giyim',
                'item_count' => 80,
                'href' => '/ust-giyim',
                'image' => 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'alt-giyim',
                'name' => 'Alt Giyim',
                'item_count' => 60,
                'href' => '/alt-giyim',
                'image' => 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'aksesuar',
                'name' => 'Aksesuar',
                'item_count' => 200,
                'href' => '/aksesuar',
                'image' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'indirim',
                'name' => 'İndirim',
                'item_count' => 0,
                'href' => '/indirim',
                'image' => 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop',
            ],
        ];

        foreach ($rows as $i => $row) {
            Category::updateOrCreate(
                ['slug' => $row['slug']],
                [...$row, 'position' => $i, 'is_active' => true],
            );
        }
    }
}
