<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Tag;
use App\Support\Money;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Hand-written descriptions, from frontend/src/lib/descriptions.ts.
     */
    private const HAND_WRITTEN = [
        'cicek-desenli-midi-elbise' => 'Hafif ve akıcı kumaşıyla günün her saatinde rahat bir şıklık sunan bu midi elbise, ince çiçek deseniyle dikkat çekiyor. V yaka detayı ve hafif volanlı etek kesimi, hem günlük hem de özel davetler için ideal bir seçim.',
        'saten-gomlek-bluz' => 'Yumuşak dokusu ve zarif dökümüyle saten gömlek bluz, ofisten akşam buluşmalarına kolayca taşınabilecek çok yönlü bir parça. Klasik yaka ve düğmeli ön detayı ile şık kombinlerin vazgeçilmezi.',
        'blazer-ceket-bej' => 'Kalıplı kesimi ve nötr bej tonuyla dolabınızın en çok kullanacağınız parçalarından biri olacak bu blazer ceket, hem pantolon hem de elbise üzerine katman olarak rahatlıkla giyilebilir.',
        'keten-bol-paca-pantolon' => 'Nefes alan keten kumaşı ve bol paça kesimiyle sıcak günlerin favorisi olan bu pantolon, yüksek bel detayıyla vücudu güzel saran, rahat ve şık bir siluet sunuyor.',
        'zincir-detayli-canta' => 'Metal zincir askısı ve kompakt gövdesiyle günlük kombinlere zarif bir dokunuş katan bu çanta, iç bölmeleri sayesinde pratik kullanım da sağlıyor.',
        'katmanli-altin-kolye' => 'İnce zincirlerin katmanlı tasarımıyla öne çıkan bu altın kaplama kolye, sade kombinleri tamamlayan zarif bir aksesuar arayanlar için ideal.',
        'oval-gunes-gozlugu' => 'Oval çerçevesi ve UV korumalı camlarıyla hem şıklık hem koruma sunan bu güneş gözlüğü, yüz hatlarını yumuşatan zamansız bir tasarıma sahip.',
    ];

    /**
     * Fallback templates keyed by the first matching tag, from descriptions.ts.
     */
    private const CATEGORY_TEMPLATES = [
        'elbise' => "Özenle seçilmiş kumaşı ve akıcı kesimiyle bu elbise, gününüzün her anında rahat ve şık bir görünüm sunuyor. Sevgi Butik'in özenli seçkisinden.",
        'ust-giyim' => 'Kaliteli kumaşı ve rahat kalıbıyla dolabınızın vazgeçilmezi olacak bu parça, farklı kombinlerle kolayca eşleştirilebiliyor.',
        'alt-giyim' => 'Vücudu güzel saran kesimi ve dayanıklı kumaşıyla gün boyu konfor sunan bu parça, günlük ve özel kombinler için eşit derecede uygun.',
        'aksesuar' => "İnce işçiliği ve zamansız tasarımıyla kombinlerinize karakter katan bu aksesuar, Sevgi Butik'in özenle seçilmiş koleksiyonundan.",
    ];

    /**
     * Accessory tags — products carrying any of these get a single sizeless variant.
     */
    private const ACCESSORY_TAGS = ['canta', 'taki', 'kemer', 'sal-fular', 'gunes-gozlugu'];

    public function run(): void
    {
        $products = [
            // --- Elbise (9) ---
            ['id' => 'cicek-desenli-midi-elbise', 'name' => 'Çiçek Desenli Midi Elbise', 'price' => 2299, 'image' => 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=800&auto=format&fit=crop', 'rating' => 4.8, 'reviewCount' => 128, 'tags' => ['elbise', 'giyim', 'midi', 'midi-elbise', 'yeni-gelenler', 'bu-hafta'], 'isNew' => true],
            ['id' => 'keten-maxi-elbise', 'name' => 'Keten Maxi Elbise', 'price' => 2599, 'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 74, 'tags' => ['elbise', 'giyim', 'maxi', 'maxi-elbise']],
            ['id' => 'askili-mini-elbise', 'name' => 'Askılı Mini Elbise', 'price' => 1699, 'image' => 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 51, 'tags' => ['elbise', 'mini']],
            ['id' => 'gunluk-pamuklu-elbise', 'name' => 'Günlük Pamuklu Elbise', 'price' => 1399, 'image' => 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 63, 'tags' => ['elbise', 'giyim', 'gunluk', 'gunluk-elbise', 'cok-satanlar']],
            ['id' => 'saten-abiye-elbise', 'name' => 'Saten Abiye Elbise', 'price' => 3899, 'image' => 'https://images.unsplash.com/photo-1595521624992-48a59aef95d7?q=80&w=800&auto=format&fit=crop', 'rating' => 4.9, 'reviewCount' => 42, 'tags' => ['elbise', 'giyim', 'abiye', 'editorun-secimi']],
            ['id' => 'dantel-detayli-midi-elbise', 'name' => 'Dantel Detaylı Midi Elbise', 'price' => 2799, 'image' => 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 58, 'tags' => ['elbise', 'giyim', 'midi', 'midi-elbise']],
            ['id' => 'volanli-maxi-elbise', 'name' => 'Volanlı Maxi Elbise', 'price' => 2999, 'image' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 39, 'tags' => ['elbise', 'giyim', 'maxi', 'maxi-elbise']],
            ['id' => 'davetlik-payetli-elbise', 'name' => 'Davetlik Payetli Elbise', 'price' => 4299, 'image' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop', 'rating' => 4.8, 'reviewCount' => 33, 'tags' => ['elbise', 'giyim', 'abiye']],
            ['id' => 'yazlik-mini-elbise', 'name' => 'Yazlık Çizgili Mini Elbise', 'price' => 1549, 'image' => 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 47, 'tags' => ['elbise', 'mini', 'indirim', 'sezon-sonu'], 'discountPercent' => 25, 'originalPrice' => 2065],

            // --- Üst Giyim (9) ---
            ['id' => 'saten-gomlek-bluz', 'name' => 'Saten Gömlek Bluz', 'price' => 1449, 'image' => 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 96, 'tags' => ['ust-giyim', 'giyim', 'bluz-gomlek', 'yeni-gelenler', 'cok-satanlar'], 'isNew' => true],
            ['id' => 'keten-oversize-gomlek', 'name' => 'Keten Oversize Gömlek', 'price' => 1299, 'image' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 68, 'tags' => ['ust-giyim', 'giyim', 'bluz-gomlek']],
            ['id' => 'basic-fitilli-tisort', 'name' => 'Basic Fitilli T-Shirt', 'price' => 649, 'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 112, 'tags' => ['ust-giyim', 'giyim', 'tisort', 'tisort-body', 'cok-satanlar']],
            ['id' => 'askili-body', 'name' => 'Askılı Body', 'price' => 899, 'image' => 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 44, 'tags' => ['ust-giyim', 'tisort-body']],
            ['id' => 'triko-kazak', 'name' => 'Örgü Triko Kazak', 'price' => 1699, 'image' => 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 81, 'tags' => ['ust-giyim', 'giyim', 'orgu-triko', 'editorun-secimi']],
            ['id' => 'hirka-uzun-triko', 'name' => 'Uzun Triko Hırka', 'price' => 1899, 'image' => 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 37, 'tags' => ['ust-giyim', 'hirka', 'orgu-triko']],
            ['id' => 'blazer-ceket-bej', 'name' => 'Bej Blazer Ceket', 'price' => 2499, 'image' => 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=800&auto=format&fit=crop', 'rating' => 4.8, 'reviewCount' => 55, 'tags' => ['ust-giyim', 'giyim', 'ceket-blazer', 'bu-hafta'], 'isNew' => true],
            ['id' => 'denim-ceket', 'name' => 'Klasik Denim Ceket', 'price' => 2199, 'image' => 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 29, 'tags' => ['ust-giyim', 'giyim', 'ceket-blazer']],
            ['id' => 'ipek-bluz', 'name' => 'İpek Karışımlı Bluz', 'price' => 1899, 'image' => 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 41, 'tags' => ['ust-giyim', 'giyim', 'bluz-gomlek', 'indirim', 'son-urunler'], 'discountPercent' => 30, 'originalPrice' => 2713],

            // --- Alt Giyim (9) ---
            ['id' => 'keten-bol-paca-pantolon', 'name' => 'Keten Bol Paça Pantolon', 'price' => 1799, 'image' => 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 87, 'tags' => ['alt-giyim', 'giyim', 'pantolon', 'yeni-gelenler', 'editorun-secimi'], 'isNew' => true],
            ['id' => 'yuksek-bel-jean', 'name' => 'Yüksek Bel Straight Jean', 'price' => 1599, 'image' => 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 103, 'tags' => ['alt-giyim', 'giyim', 'jean', 'cok-satanlar']],
            ['id' => 'mom-jean', 'name' => 'Mom Fit Jean', 'price' => 1699, 'image' => 'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 66, 'tags' => ['alt-giyim', 'giyim', 'jean']],
            ['id' => 'pileli-midi-etek', 'name' => 'Pileli Midi Etek', 'price' => 1349, 'image' => 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 52, 'tags' => ['alt-giyim', 'giyim', 'etek']],
            ['id' => 'deri-mini-etek', 'name' => 'Deri Görünümlü Mini Etek', 'price' => 1249, 'image' => 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 34, 'tags' => ['alt-giyim', 'giyim', 'etek']],
            ['id' => 'keten-sort', 'name' => 'Keten Yüksek Bel Şort', 'price' => 899, 'image' => 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 48, 'tags' => ['alt-giyim', 'giyim', 'sort']],
            ['id' => 'denim-sort', 'name' => 'Denim Şort', 'price' => 999, 'image' => 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop', 'rating' => 4.2, 'reviewCount' => 27, 'tags' => ['alt-giyim', 'giyim', 'sort', 'indirim', 'sezon-sonu'], 'discountPercent' => 20, 'originalPrice' => 1249],
            ['id' => 'toparlayici-tayt', 'name' => 'Toparlayıcı Spor Tayt', 'price' => 1099, 'image' => 'https://images.unsplash.com/photo-1506629905607-45726a7a1a95?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 71, 'tags' => ['alt-giyim', 'tayt']],
            ['id' => 'kadife-tayt', 'name' => 'Kadife Yüksek Bel Tayt', 'price' => 949, 'image' => 'https://images.unsplash.com/photo-1506629905607-45726a7a1a95?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 22, 'tags' => ['alt-giyim', 'tayt']],

            // --- Aksesuar (11) ---
            ['id' => 'zincir-detayli-canta', 'name' => 'Zincir Detaylı Çanta', 'price' => 1299, 'image' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 64, 'tags' => ['aksesuar', 'canta', 'yeni-gelenler', 'cok-satanlar'], 'isNew' => true],
            ['id' => 'deri-omuz-cantasi', 'name' => 'Deri Görünümlü Omuz Çantası', 'price' => 1099, 'image' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 45, 'tags' => ['aksesuar', 'canta']],
            ['id' => 'mini-el-cantasi', 'name' => 'Mini El Çantası', 'price' => 799, 'image' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 31, 'tags' => ['aksesuar', 'canta', 'indirim', 'son-urunler'], 'discountPercent' => 35, 'originalPrice' => 1229],
            ['id' => 'katmanli-altin-kolye', 'name' => 'Katmanlı Altın Kaplama Kolye', 'price' => 799, 'image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 112, 'tags' => ['aksesuar', 'taki', 'yeni-gelenler', 'editorun-secimi'], 'isNew' => true],
            ['id' => 'inci-kupe', 'name' => 'İnci Detaylı Küpe', 'price' => 449, 'image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 58, 'tags' => ['aksesuar', 'taki']],
            ['id' => 'ince-deri-kemer', 'name' => 'İnce Deri Kemer', 'price' => 549, 'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 26, 'tags' => ['aksesuar', 'kemer']],
            ['id' => 'genis-kemer', 'name' => 'Geniş Korseli Kemer', 'price' => 649, 'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', 'rating' => 4.2, 'reviewCount' => 19, 'tags' => ['aksesuar', 'kemer']],
            ['id' => 'ipek-fular', 'name' => 'İpek Karışımlı Fular', 'price' => 599, 'image' => 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 38, 'tags' => ['aksesuar', 'sal-fular']],
            ['id' => 'orgu-sal', 'name' => 'Örgü Şal', 'price' => 749, 'image' => 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 24, 'tags' => ['aksesuar', 'sal-fular']],
            ['id' => 'oval-gunes-gozlugu', 'name' => 'Oval Çerçeveli Güneş Gözlüğü', 'price' => 899, 'image' => 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 67, 'tags' => ['aksesuar', 'gunes-gozlugu', 'bu-hafta'], 'isNew' => true],
            ['id' => 'kedi-goz-gunes-gozlugu', 'name' => 'Kedi Gözü Güneş Gözlüğü', 'price' => 849, 'image' => 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 29, 'tags' => ['aksesuar', 'gunes-gozlugu', 'indirim', '50'], 'discountPercent' => 50, 'originalPrice' => 1699],

            // --- İndirim-only extras (2) ---
            ['id' => 'gunluk-elbise-indirimli', 'name' => 'Günlük Keten Elbise', 'price' => 1099, 'image' => 'https://images.unsplash.com/photo-1495385794356-15371f348c31?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 36, 'tags' => ['elbise', 'giyim', 'gunluk', 'gunluk-elbise', 'indirim', '50'], 'discountPercent' => 50, 'originalPrice' => 2199],
            ['id' => 'tisort-indirimli', 'name' => 'Baskılı Pamuklu T-Shirt', 'price' => 349, 'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', 'rating' => 4.1, 'reviewCount' => 18, 'tags' => ['ust-giyim', 'giyim', 'tisort', 'tisort-body', 'indirim', '50'], 'discountPercent' => 50, 'originalPrice' => 699],
        ];

        foreach ($products as $position => $data) {
            $product = Product::updateOrCreate(
                ['slug' => $data['id']],
                [
                    'name' => $data['name'],
                    'description' => $this->descriptionFor($data),
                    'price_minor' => Money::fromMajor($data['price']),
                    'compare_at_price_minor' => isset($data['originalPrice']) ? Money::fromMajor($data['originalPrice']) : null,
                    'image' => $data['image'],
                    'has_sizes' => ! $this->isAccessory($data['tags']),
                    'rating_seed' => $data['rating'],
                    'review_count_seed' => $data['reviewCount'],
                    'is_new' => $data['isNew'] ?? false,
                    'is_active' => true,
                    'position' => $position,
                ],
            );

            // Gallery seeded with the single hero image; grows independently later.
            ProductImage::updateOrCreate(
                ['product_id' => $product->id, 'position' => 0],
                ['url' => $data['image'], 'alt' => $data['name']],
            );

            $this->attachTags($product, $data['tags']);
            $this->createVariants($product);
        }
    }

    private function descriptionFor(array $data): string
    {
        if (isset(self::HAND_WRITTEN[$data['id']])) {
            return self::HAND_WRITTEN[$data['id']];
        }

        foreach ($data['tags'] as $tag) {
            if (isset(self::CATEGORY_TEMPLATES[$tag])) {
                return self::CATEGORY_TEMPLATES[$tag];
            }
        }

        return self::CATEGORY_TEMPLATES['aksesuar'];
    }

    private function isAccessory(array $tags): bool
    {
        return count(array_intersect($tags, self::ACCESSORY_TAGS)) > 0;
    }

    /**
     * Attach tags in seed-file order — pivot `position` is what
     * getRelatedProducts()'s tags[0] semantics depend on.
     */
    private function attachTags(Product $product, array $tagSlugs): void
    {
        $sync = [];
        foreach ($tagSlugs as $position => $slug) {
            $tag = Tag::where('slug', $slug)->firstOrFail();
            $sync[$tag->id] = ['position' => $position];
        }
        $product->tags()->sync($sync);
    }

    private function createVariants(Product $product): void
    {
        if ($product->variants()->exists()) {
            return;
        }

        if ($product->has_sizes) {
            foreach (['XS', 'S', 'M', 'L', 'XL'] as $size) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'size' => $size,
                    'stock' => 20,
                    'is_active' => true,
                ]);
            }
        } else {
            ProductVariant::create([
                'product_id' => $product->id,
                'size' => null,
                'stock' => 20,
                'is_active' => true,
            ]);
        }
    }
}
