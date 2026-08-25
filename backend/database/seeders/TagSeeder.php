<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * 37 tags across 3 types. Names are the Turkish display labels lifted from
     * frontend/src/lib/nav.ts. `type` drives the Filament grouped picker only —
     * category/subcategory filtering stays pure tag-slug intersection.
     */
    public function run(): void
    {
        $rows = [
            // category (7) — primaryNav top-level hrefs
            ['slug' => 'yeni-gelenler', 'name' => 'Yeni Gelenler', 'type' => 'category'],
            ['slug' => 'giyim', 'name' => 'Giyim', 'type' => 'category'],
            ['slug' => 'elbise', 'name' => 'Elbise', 'type' => 'category'],
            ['slug' => 'ust-giyim', 'name' => 'Üst Giyim', 'type' => 'category'],
            ['slug' => 'alt-giyim', 'name' => 'Alt Giyim', 'type' => 'category'],
            ['slug' => 'aksesuar', 'name' => 'Aksesuar', 'type' => 'category'],
            ['slug' => 'makyaj-malzemesi', 'name' => 'Makyaj Malzemesi', 'type' => 'category'],
            ['slug' => 'ic-camasiri', 'name' => 'İç Çamaşırı', 'type' => 'category'],
            ['slug' => 'indirim', 'name' => 'İndirim', 'type' => 'category'],

            // subcategory (24)
            ['slug' => 'midi', 'name' => 'Midi Elbise', 'type' => 'subcategory'],
            ['slug' => 'maxi', 'name' => 'Maxi Elbise', 'type' => 'subcategory'],
            ['slug' => 'mini', 'name' => 'Mini Elbise', 'type' => 'subcategory'],
            ['slug' => 'gunluk', 'name' => 'Günlük Elbise', 'type' => 'subcategory'],
            ['slug' => 'abiye', 'name' => 'Abiye & Davet', 'type' => 'subcategory'],
            ['slug' => 'midi-elbise', 'name' => 'Midi Elbise', 'type' => 'subcategory'],
            ['slug' => 'maxi-elbise', 'name' => 'Maxi Elbise', 'type' => 'subcategory'],
            ['slug' => 'gunluk-elbise', 'name' => 'Günlük Elbise', 'type' => 'subcategory'],
            ['slug' => 'bluz-gomlek', 'name' => 'Bluz & Gömlek', 'type' => 'subcategory'],
            ['slug' => 'tisort', 'name' => 'T-Shirt', 'type' => 'subcategory'],
            ['slug' => 'tisort-body', 'name' => 'T-Shirt & Body', 'type' => 'subcategory'],
            ['slug' => 'orgu-triko', 'name' => 'Örgü & Triko', 'type' => 'subcategory'],
            ['slug' => 'ceket-blazer', 'name' => 'Ceket & Blazer', 'type' => 'subcategory'],
            ['slug' => 'hirka', 'name' => 'Hırka', 'type' => 'subcategory'],
            ['slug' => 'pantolon', 'name' => 'Pantolon', 'type' => 'subcategory'],
            ['slug' => 'jean', 'name' => 'Jean', 'type' => 'subcategory'],
            ['slug' => 'etek', 'name' => 'Etek', 'type' => 'subcategory'],
            ['slug' => 'sort', 'name' => 'Şort', 'type' => 'subcategory'],
            ['slug' => 'tayt', 'name' => 'Tayt', 'type' => 'subcategory'],
            ['slug' => 'canta', 'name' => 'Çanta', 'type' => 'subcategory'],
            ['slug' => 'taki', 'name' => 'Takı', 'type' => 'subcategory'],
            ['slug' => 'kemer', 'name' => 'Kemer', 'type' => 'subcategory'],
            ['slug' => 'sal-fular', 'name' => 'Şal & Fular', 'type' => 'subcategory'],
            ['slug' => 'gunes-gozlugu', 'name' => 'Güneş Gözlüğü', 'type' => 'subcategory'],
            ['slug' => 'yuz', 'name' => 'Yüz', 'type' => 'subcategory'],
            ['slug' => 'goz', 'name' => 'Göz', 'type' => 'subcategory'],
            ['slug' => 'dudak', 'name' => 'Dudak', 'type' => 'subcategory'],
            ['slug' => 'sutyen', 'name' => 'Sütyen', 'type' => 'subcategory'],
            ['slug' => 'kulot', 'name' => 'Külot', 'type' => 'subcategory'],
            ['slug' => 'gecelik', 'name' => 'Gecelik', 'type' => 'subcategory'],

            // collection (6)
            ['slug' => 'bu-hafta', 'name' => 'Bu Hafta Gelenler', 'type' => 'collection'],
            ['slug' => 'cok-satanlar', 'name' => 'Çok Satanlar', 'type' => 'collection'],
            ['slug' => 'editorun-secimi', 'name' => 'Editörün Seçimi', 'type' => 'collection'],
            ['slug' => 'son-urunler', 'name' => 'Son Ürünler', 'type' => 'collection'],
            ['slug' => 'sezon-sonu', 'name' => 'Sezon Sonu', 'type' => 'collection'],
            ['slug' => '50', 'name' => "%50'ye Varan İndirim", 'type' => 'collection'],
        ];

        foreach ($rows as $i => $row) {
            Tag::updateOrCreate(
                ['slug' => $row['slug']],
                [...$row, 'position' => $i],
            );
        }
    }
}
