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
                'slug' => 'giyim',
                'name' => 'Giyim',
                'item_count' => 260,
                'href' => '/giyim',
                'image' => 'https://images.unsplash.com/photo-1760245097385-9029fe89a112?q=80&w=800&auto=format&fit=crop', // Reusing elbise image for aggregate
            ],
            [
                'slug' => 'elbise',
                'name' => 'Elbise',
                'item_count' => 120,
                'href' => '/elbise',
                'image' => 'https://images.unsplash.com/photo-1760245097385-9029fe89a112?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'ust-giyim',
                'name' => 'Üst Giyim',
                'item_count' => 80,
                'href' => '/ust-giyim',
                'image' => 'https://images.unsplash.com/photo-1765560215006-3f55535b83ee?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'alt-giyim',
                'name' => 'Alt Giyim',
                'item_count' => 60,
                'href' => '/alt-giyim',
                'image' => 'https://images.unsplash.com/photo-1767631338127-8cd80ee2f9df?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'aksesuar',
                'name' => 'Aksesuar',
                'item_count' => 200,
                'href' => '/aksesuar',
                'image' => 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=800&auto=format&fit=crop',
            ],

            [
                'slug' => 'makyaj-malzemesi',
                'name' => 'Makyaj Malzemesi',
                'item_count' => 40,
                'href' => '/makyaj-malzemesi',
                'image' => 'https://images.unsplash.com/photo-1664334673947-39746cafbc83?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'ic-camasiri',
                'name' => 'İç Çamaşırı',
                'item_count' => 40,
                'href' => '/ic-camasiri',
                'image' => 'https://images.unsplash.com/photo-1568441556126-f36ae0900180?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'slug' => 'cocuk',
                'name' => 'Çocuk',
                'item_count' => 60,
                'href' => '/cocuk',
                'image' => 'https://images.unsplash.com/photo-1742696274620-73648580d6a4?q=80&w=800&auto=format&fit=crop',
            ],
        ];

        foreach ($rows as $i => $row) {
            Category::updateOrCreate(
                ['slug' => $row['slug']],
                [...$row, 'position' => $i, 'is_active' => true],
            );
        }

        $this->seedSubcategories();
    }

    /**
     * ProductController's `subcategory` filter matches products by
     * whereHas('categories', slug = X), so every subcategory slug used in
     * frontend/src/lib/nav.ts's mega-menu (and mirrored in ProductSeeder's
     * product tags) must exist as a Category row, or every subcategory page
     * silently returns zero products. Transcribed verbatim from nav.ts.
     * Slugs reused across nav branches (e.g. "jean" under both /giyim and
     * /alt-giyim) get a single row — whereHas matches on slug only, parent
     * is cosmetic.
     */
    private function seedSubcategories(): void
    {
        $subcategories = [
            'elbise' => [
                'midi-elbise' => 'Midi Elbise',
                'maxi-elbise' => 'Maxi Elbise',
                'gunluk-elbise' => 'Günlük Elbise',
                'abiye' => 'Abiye',
                'midi' => 'Midi Elbise',
                'maxi' => 'Maxi Elbise',
                'mini' => 'Mini Elbise',
                'gunluk' => 'Günlük Elbise',
            ],
            'ust-giyim' => [
                'bluz-gomlek' => 'Bluz & Gömlek',
                'tisort' => 'T-Shirt',
                'orgu-triko' => 'Örgü & Triko',
                'ceket-blazer' => 'Ceket & Blazer',
                'tisort-body' => 'T-Shirt & Body',
                'hirka' => 'Hırka',
            ],
            'alt-giyim' => [
                'pantolon' => 'Pantolon',
                'etek' => 'Etek',
                'sort' => 'Şort',
                'jean' => 'Jean',
                'tayt' => 'Tayt',
            ],
            'aksesuar' => [
                'canta' => 'Çanta',
                'taki' => 'Takı',
                'kemer' => 'Kemer',
                'sal-fular' => 'Şal & Fular',
                'gunes-gozlugu' => 'Güneş Gözlüğü',
            ],
            'makyaj-malzemesi' => [
                'yuz' => 'Yüz',
                'goz' => 'Göz',
                'dudak' => 'Dudak',
            ],
            'ic-camasiri' => [
                'sutyen' => 'Sütyen',
                'kulot' => 'Külot',
                'gecelik' => 'Gecelik',
            ],
            'cocuk' => [
                'kiz-cocuk' => 'Kız Çocuk',
                'erkek-cocuk' => 'Erkek Çocuk',
                'bebek-giyim' => 'Bebek Giyim',
            ],
        ];

        // Each subcategory gets its own photo (matched by name) rather than
        // inheriting the parent's — falls back to the parent's image only if
        // a name is somehow missing from this map.
        $images = [
            'Midi Elbise' => 'https://images.unsplash.com/photo-1549410336-60dde98be9cc?q=80&w=800&auto=format&fit=crop',
            'Maxi Elbise' => 'https://images.unsplash.com/photo-1490505658643-e96d613eb642?q=80&w=800&auto=format&fit=crop',
            'Mini Elbise' => 'https://images.unsplash.com/photo-1542472250-6d128e9b847c?q=80&w=800&auto=format&fit=crop',
            'Günlük Elbise' => 'https://images.unsplash.com/photo-1614226039383-2892cf649eef?q=80&w=800&auto=format&fit=crop',
            'Abiye' => 'https://images.unsplash.com/photo-1554735109-39c2ab93b0ce?q=80&w=800&auto=format&fit=crop',
            'Bluz & Gömlek' => 'https://images.unsplash.com/photo-1736097760741-73924f36bb26?q=80&w=800&auto=format&fit=crop',
            'T-Shirt' => 'https://images.unsplash.com/photo-1564689801188-d00bee231f4b?q=80&w=800&auto=format&fit=crop',
            'Örgü & Triko' => 'https://images.unsplash.com/photo-1589572597185-498c5ea0a731?q=80&w=800&auto=format&fit=crop',
            'Ceket & Blazer' => 'https://images.unsplash.com/photo-1606776627650-454d6d7bd7bf?q=80&w=800&auto=format&fit=crop',
            'T-Shirt & Body' => 'https://images.unsplash.com/photo-1643580554589-8433f9ddfe7d?q=80&w=800&auto=format&fit=crop',
            'Hırka' => 'https://images.unsplash.com/photo-1516550570643-7872251e295b?q=80&w=800&auto=format&fit=crop',
            'Pantolon' => 'https://images.unsplash.com/photo-1682997843688-94722786a722?q=80&w=800&auto=format&fit=crop',
            'Etek' => 'https://images.unsplash.com/photo-1677680127704-8ce403baff5a?q=80&w=800&auto=format&fit=crop',
            'Şort' => 'https://images.unsplash.com/photo-1585595006767-552b6b8bed4a?q=80&w=800&auto=format&fit=crop',
            'Jean' => 'https://images.unsplash.com/photo-1596322035116-8439d2495afc?q=80&w=800&auto=format&fit=crop',
            'Tayt' => 'https://images.unsplash.com/photo-1616279968481-f8717a710ef6?q=80&w=800&auto=format&fit=crop',
            'Çanta' => 'https://images.unsplash.com/photo-1593267891718-17abae428da0?q=80&w=800&auto=format&fit=crop',
            'Takı' => 'https://images.unsplash.com/photo-1742137189378-1788397cf778?q=80&w=800&auto=format&fit=crop',
            'Kemer' => 'https://images.unsplash.com/photo-1684510334550-0c4fa8aaffd1?q=80&w=800&auto=format&fit=crop',
            'Şal & Fular' => 'https://images.unsplash.com/photo-1573930570714-8de1d2c9d2eb?q=80&w=800&auto=format&fit=crop',
            'Güneş Gözlüğü' => 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?q=80&w=800&auto=format&fit=crop',
            'Yüz' => 'https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?q=80&w=800&auto=format&fit=crop',
            'Göz' => 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=800&auto=format&fit=crop',
            'Dudak' => 'https://images.unsplash.com/photo-1512053558622-3e05d55d2dce?q=80&w=800&auto=format&fit=crop',
            'Sütyen' => 'https://images.unsplash.com/photo-1633699124189-17c808027f4a?q=80&w=800&auto=format&fit=crop',
            'Külot' => 'https://images.unsplash.com/photo-1643539292875-ff2ca209d72a?q=80&w=800&auto=format&fit=crop',
            'Gecelik' => 'https://images.unsplash.com/photo-1766056278825-55168658f120?q=80&w=800&auto=format&fit=crop',
            'Kız Çocuk' => 'https://images.unsplash.com/photo-1601585463538-d3fd899f2b6f?q=80&w=800&auto=format&fit=crop',
            'Erkek Çocuk' => 'https://images.unsplash.com/photo-1554889160-1f693e60f196?q=80&w=800&auto=format&fit=crop',
            'Bebek Giyim' => 'https://images.unsplash.com/photo-1544198043-460b612e31d2?q=80&w=800&auto=format&fit=crop',
        ];

        $position = 100;

        foreach ($subcategories as $parentSlug => $children) {
            $parent = Category::where('slug', $parentSlug)->first();

            foreach ($children as $slug => $name) {
                Category::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'parent_id' => $parent->id,
                        'name' => $name,
                        'item_count' => 0,
                        'href' => "{$parent->href}/{$slug}",
                        'image' => $images[$name] ?? $parent->image,
                        'position' => $position++,
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}
