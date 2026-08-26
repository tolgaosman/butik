<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
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
        'makyaj-malzemesi' => "Yüksek pigmentli formülü ve uzun süre kalıcılığıyla makyaj çantanızın vazgeçilmezi olacak bu ürün, Sevgi Butik'in özenle seçilmiş koleksiyonundan.",
        'ic-camasiri' => 'Yumuşak dokusu ve rahat kalıbıyla gün boyu konfor sunan bu parça, dikişsiz kesimi sayesinde kıyafetlerinizin altında iz bırakmıyor.',
        'cocuk' => 'Yumuşak ve cilt dostu kumaşıyla özenle seçilmiş bu çocuk kıyafeti, hem konforlu hem de dayanıklı bir kullanım sunuyor. Sevgi Butik\'in çocuk koleksiyonundan.',
    ];

    /**
     * Accessory tags — products carrying any of these get a single sizeless variant.
     */
    private const ACCESSORY_TAGS = ['canta', 'taki', 'kemer', 'sal-fular', 'gunes-gozlugu', 'makyaj-malzemesi'];

    public function run(): void
    {
        $products = [
            // --- Elbise (9) ---
            ['id' => 'cicek-desenli-midi-elbise', 'name' => 'Çiçek Desenli Midi Elbise', 'price' => 2299, 'image' => 'https://images.unsplash.com/photo-1768982597225-9dadb37f3db7?q=80&w=800&auto=format&fit=crop', 'rating' => 4.8, 'reviewCount' => 128, 'tags' => ['elbise', 'giyim', 'midi', 'midi-elbise', 'yeni-gelenler', 'bu-hafta'], 'isNew' => true],
            ['id' => 'keten-maxi-elbise', 'name' => 'Keten Maxi Elbise', 'price' => 2599, 'image' => 'https://images.unsplash.com/photo-1752047763267-a05dfe67e442?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 74, 'tags' => ['elbise', 'giyim', 'maxi', 'maxi-elbise']],
            ['id' => 'askili-mini-elbise', 'name' => 'Askılı Mini Elbise', 'price' => 1699, 'image' => 'https://images.unsplash.com/photo-1610657965198-7352e7aef1ea?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 51, 'tags' => ['elbise', 'mini']],
            ['id' => 'gunluk-pamuklu-elbise', 'name' => 'Günlük Pamuklu Elbise', 'price' => 1399, 'image' => 'https://images.unsplash.com/photo-1585131609775-8eecc878fdfc?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 63, 'tags' => ['elbise', 'giyim', 'gunluk', 'gunluk-elbise', 'cok-satanlar']],
            ['id' => 'saten-abiye-elbise', 'name' => 'Saten Abiye Elbise', 'price' => 3899, 'image' => 'https://images.unsplash.com/photo-1765229279658-7335ee3cdaf5?q=80&w=800&auto=format&fit=crop', 'rating' => 4.9, 'reviewCount' => 42, 'tags' => ['elbise', 'giyim', 'abiye', 'editorun-secimi']],
            ['id' => 'dantel-detayli-midi-elbise', 'name' => 'Dantel Detaylı Midi Elbise', 'price' => 2799, 'image' => 'https://images.unsplash.com/photo-1591221662157-6f62de5508eb?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 58, 'tags' => ['elbise', 'giyim', 'midi', 'midi-elbise']],
            ['id' => 'volanli-maxi-elbise', 'name' => 'Volanlı Maxi Elbise', 'price' => 2999, 'image' => 'https://images.unsplash.com/photo-1783701329552-762360d70b87?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 39, 'tags' => ['elbise', 'giyim', 'maxi', 'maxi-elbise']],
            ['id' => 'davetlik-payetli-elbise', 'name' => 'Davetlik Payetli Elbise', 'price' => 4299, 'image' => 'https://images.unsplash.com/photo-1779763320462-a60f48e56b03?q=80&w=800&auto=format&fit=crop', 'rating' => 4.8, 'reviewCount' => 33, 'tags' => ['elbise', 'giyim', 'abiye']],
            ['id' => 'yazlik-mini-elbise', 'name' => 'Yazlık Çizgili Mini Elbise', 'price' => 1549, 'image' => 'https://images.unsplash.com/photo-1775754787067-8355f78dc408?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 47, 'tags' => ['elbise', 'mini', 'indirim', 'sezon-sonu'], 'discountPercent' => 25, 'originalPrice' => 2065],

            // --- Üst Giyim (9) ---
            ['id' => 'saten-gomlek-bluz', 'name' => 'Saten Gömlek Bluz', 'price' => 1449, 'image' => 'https://images.unsplash.com/photo-1704775983658-2773a9c0cce2?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 96, 'tags' => ['ust-giyim', 'giyim', 'bluz-gomlek', 'yeni-gelenler', 'cok-satanlar'], 'isNew' => true],
            ['id' => 'keten-oversize-gomlek', 'name' => 'Keten Oversize Gömlek', 'price' => 1299, 'image' => 'https://images.unsplash.com/photo-1783113298894-eeb3b71315d9?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 68, 'tags' => ['ust-giyim', 'giyim', 'bluz-gomlek']],
            ['id' => 'basic-fitilli-tisort', 'name' => 'Basic Fitilli T-Shirt', 'price' => 649, 'image' => 'https://images.unsplash.com/photo-1785273751809-f50baa9f6e0c?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 112, 'tags' => ['ust-giyim', 'giyim', 'tisort', 'tisort-body', 'cok-satanlar']],
            ['id' => 'askili-body', 'name' => 'Askılı Body', 'price' => 899, 'image' => 'https://images.unsplash.com/photo-1627676369678-5b4b27b36411?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 44, 'tags' => ['ust-giyim', 'tisort-body']],
            ['id' => 'triko-kazak', 'name' => 'Örgü Triko Kazak', 'price' => 1699, 'image' => 'https://images.unsplash.com/photo-1588271968087-4c51abe05afc?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 81, 'tags' => ['ust-giyim', 'giyim', 'orgu-triko', 'editorun-secimi']],
            ['id' => 'hirka-uzun-triko', 'name' => 'Uzun Triko Hırka', 'price' => 1899, 'image' => 'https://images.unsplash.com/photo-1767864705123-521c4efbbcdf?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 37, 'tags' => ['ust-giyim', 'hirka', 'orgu-triko']],
            ['id' => 'blazer-ceket-bej', 'name' => 'Bej Blazer Ceket', 'price' => 2499, 'image' => 'https://images.unsplash.com/photo-1747815065172-a3234582223e?q=80&w=800&auto=format&fit=crop', 'rating' => 4.8, 'reviewCount' => 55, 'tags' => ['ust-giyim', 'giyim', 'ceket-blazer', 'bu-hafta'], 'isNew' => true],
            ['id' => 'denim-ceket', 'name' => 'Klasik Denim Ceket', 'price' => 2199, 'image' => 'https://images.unsplash.com/photo-1591733769009-abd015bc629b?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 29, 'tags' => ['ust-giyim', 'giyim', 'ceket-blazer']],
            ['id' => 'ipek-bluz', 'name' => 'İpek Karışımlı Bluz', 'price' => 1899, 'image' => 'https://images.unsplash.com/photo-1761117228880-df2425bd70da?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 41, 'tags' => ['ust-giyim', 'giyim', 'bluz-gomlek', 'indirim', 'son-urunler'], 'discountPercent' => 30, 'originalPrice' => 2713],

            // --- Alt Giyim (9) ---
            ['id' => 'keten-bol-paca-pantolon', 'name' => 'Keten Bol Paça Pantolon', 'price' => 1799, 'image' => 'https://images.unsplash.com/photo-1784090985575-5704d02f6375?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 87, 'tags' => ['alt-giyim', 'giyim', 'pantolon', 'yeni-gelenler', 'editorun-secimi'], 'isNew' => true],
            ['id' => 'yuksek-bel-jean', 'name' => 'Yüksek Bel Straight Jean', 'price' => 1599, 'image' => 'https://images.unsplash.com/photo-1604840256746-03e53fdd9baf?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 103, 'tags' => ['alt-giyim', 'giyim', 'jean', 'cok-satanlar']],
            ['id' => 'mom-jean', 'name' => 'Mom Fit Jean', 'price' => 1699, 'image' => 'https://images.unsplash.com/photo-1591133882037-0136e6c9d05f?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 66, 'tags' => ['alt-giyim', 'giyim', 'jean']],
            ['id' => 'pileli-midi-etek', 'name' => 'Pileli Midi Etek', 'price' => 1349, 'image' => 'https://images.unsplash.com/photo-1600681103852-5f6df72461aa?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 52, 'tags' => ['alt-giyim', 'giyim', 'etek']],
            ['id' => 'deri-mini-etek', 'name' => 'Deri Görünümlü Mini Etek', 'price' => 1249, 'image' => 'https://images.unsplash.com/photo-1714205901200-4662d2911ed0?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 34, 'tags' => ['alt-giyim', 'giyim', 'etek']],
            ['id' => 'keten-sort', 'name' => 'Keten Yüksek Bel Şort', 'price' => 899, 'image' => 'https://images.unsplash.com/photo-1782178393416-333632377265?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 48, 'tags' => ['alt-giyim', 'giyim', 'sort']],
            ['id' => 'denim-sort', 'name' => 'Denim Şort', 'price' => 999, 'image' => 'https://images.unsplash.com/photo-1585145197502-8f36802f0a26?q=80&w=800&auto=format&fit=crop', 'rating' => 4.2, 'reviewCount' => 27, 'tags' => ['alt-giyim', 'giyim', 'sort', 'indirim', 'sezon-sonu'], 'discountPercent' => 20, 'originalPrice' => 1249],
            ['id' => 'toparlayici-tayt', 'name' => 'Toparlayıcı Spor Tayt', 'price' => 1099, 'image' => 'https://images.unsplash.com/photo-1645810798586-08e892108d67?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 71, 'tags' => ['alt-giyim', 'tayt']],
            ['id' => 'kadife-tayt', 'name' => 'Kadife Yüksek Bel Tayt', 'price' => 949, 'image' => 'https://images.unsplash.com/photo-1610902286647-8fc06c361e75?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 22, 'tags' => ['alt-giyim', 'tayt']],

            // --- Aksesuar (11) ---
            ['id' => 'zincir-detayli-canta', 'name' => 'Zincir Detaylı Çanta', 'price' => 1299, 'image' => 'https://images.unsplash.com/photo-1773777145747-b5b7356f4e81?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 64, 'tags' => ['aksesuar', 'canta', 'yeni-gelenler', 'cok-satanlar'], 'isNew' => true],
            ['id' => 'deri-omuz-cantasi', 'name' => 'Deri Görünümlü Omuz Çantası', 'price' => 1099, 'image' => 'https://images.unsplash.com/photo-1786872814428-1f0d8d685217?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 45, 'tags' => ['aksesuar', 'canta']],
            ['id' => 'mini-el-cantasi', 'name' => 'Mini El Çantası', 'price' => 799, 'image' => 'https://images.unsplash.com/photo-1618274199869-89066d856879?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 31, 'tags' => ['aksesuar', 'canta', 'indirim', 'son-urunler'], 'discountPercent' => 35, 'originalPrice' => 1229],
            ['id' => 'katmanli-altin-kolye', 'name' => 'Katmanlı Altın Kaplama Kolye', 'price' => 799, 'image' => 'https://images.unsplash.com/photo-1611107683227-e9060eccd846?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 112, 'tags' => ['aksesuar', 'taki', 'yeni-gelenler', 'editorun-secimi'], 'isNew' => true],
            ['id' => 'inci-kupe', 'name' => 'İnci Detaylı Küpe', 'price' => 449, 'image' => 'https://images.unsplash.com/photo-1682822749969-61a63203c501?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 58, 'tags' => ['aksesuar', 'taki']],
            ['id' => 'ince-deri-kemer', 'name' => 'İnce Deri Kemer', 'price' => 549, 'image' => 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 26, 'tags' => ['aksesuar', 'kemer']],
            ['id' => 'genis-kemer', 'name' => 'Geniş Korseli Kemer', 'price' => 649, 'image' => 'https://images.unsplash.com/photo-1768745534287-0e41db00cfaf?q=80&w=800&auto=format&fit=crop', 'rating' => 4.2, 'reviewCount' => 19, 'tags' => ['aksesuar', 'kemer']],
            ['id' => 'ipek-fular', 'name' => 'İpek Karışımlı Fular', 'price' => 599, 'image' => 'https://images.unsplash.com/photo-1677478863154-55ecce8c7536?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 38, 'tags' => ['aksesuar', 'sal-fular']],
            ['id' => 'orgu-sal', 'name' => 'Örgü Şal', 'price' => 749, 'image' => 'https://images.unsplash.com/photo-1681720381881-19c355d5f4d4?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 24, 'tags' => ['aksesuar', 'sal-fular']],
            ['id' => 'oval-gunes-gozlugu', 'name' => 'Oval Çerçeveli Güneş Gözlüğü', 'price' => 899, 'image' => 'https://images.unsplash.com/photo-1731612748067-39cb0af8bc1a?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 67, 'tags' => ['aksesuar', 'gunes-gozlugu', 'bu-hafta'], 'isNew' => true],
            ['id' => 'kedi-goz-gunes-gozlugu', 'name' => 'Kedi Gözü Güneş Gözlüğü', 'price' => 849, 'image' => 'https://images.unsplash.com/photo-1760446032732-c042b0d43580?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 29, 'tags' => ['aksesuar', 'gunes-gozlugu', 'indirim', '50'], 'discountPercent' => 50, 'originalPrice' => 1699],

            // --- Makyaj Malzemesi (6) ---
            ['id' => 'mat-fondoten', 'name' => 'Uzun Süre Kalıcı Mat Fondöten', 'price' => 649, 'image' => 'https://images.unsplash.com/photo-1560879311-370fd4561a0d?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 58, 'tags' => ['makyaj-malzemesi', 'yuz', 'yeni-gelenler'], 'isNew' => true],
            ['id' => 'aydinlatici-far-paleti', 'name' => 'Aydınlatıcı Allık & Far Paleti', 'price' => 749, 'image' => 'https://images.unsplash.com/photo-1583931537180-7d26921260e4?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 43, 'tags' => ['makyaj-malzemesi', 'yuz']],
            ['id' => 'suya-dayanikli-maskara', 'name' => 'Suya Dayanıklı Hacim Maskara', 'price' => 399, 'image' => 'https://images.unsplash.com/photo-1670832209136-fad04d9920f9?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 91, 'tags' => ['makyaj-malzemesi', 'goz', 'cok-satanlar']],
            ['id' => 'dumanli-goz-farı-paleti', 'name' => 'Dumanlı Göz Farı Paleti', 'price' => 899, 'image' => 'https://images.unsplash.com/photo-1548954638-082b560e0a66?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 37, 'tags' => ['makyaj-malzemesi', 'goz', 'editorun-secimi']],
            ['id' => 'mat-ruj-seti', 'name' => 'Mat Likit Ruj Seti', 'price' => 549, 'image' => 'https://images.unsplash.com/photo-1760860992755-c432351d47e9?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 64, 'tags' => ['makyaj-malzemesi', 'dudak', 'cok-satanlar']],
            ['id' => 'nemlendirici-dudak-parlatici', 'name' => 'Nemlendirici Dudak Parlatıcı', 'price' => 299, 'image' => 'https://images.unsplash.com/photo-1635263282145-253319c75fd4?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 22, 'tags' => ['makyaj-malzemesi', 'dudak', 'indirim', 'sezon-sonu'], 'discountPercent' => 20, 'originalPrice' => 374],

            // --- İç Çamaşırı (6) ---
            ['id' => 'dantelli-balenli-sutyen', 'name' => 'Dantelli Balenli Sütyen', 'price' => 549, 'image' => 'https://images.unsplash.com/photo-1584061554353-f8c337f5dbb9?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 72, 'tags' => ['ic-camasiri', 'sutyen', 'yeni-gelenler'], 'isNew' => true],
            ['id' => 'dikissiz-sutyen', 'name' => 'Dikişsiz Pamuklu Sütyen', 'price' => 449, 'image' => 'https://images.unsplash.com/photo-1587631550085-2d4bed859ea9?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 58, 'tags' => ['ic-camasiri', 'sutyen', 'cok-satanlar']],
            ['id' => 'dantelli-brazilian-kulot', 'name' => 'Dantelli Brazilian Külot', 'price' => 249, 'image' => 'https://images.unsplash.com/photo-1584061677142-c729839e341f?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 46, 'tags' => ['ic-camasiri', 'kulot']],
            ['id' => 'pamuklu-bikini-kulot-3lu', 'name' => 'Pamuklu Bikini Külot (3\'lü)', 'price' => 399, 'image' => 'https://images.unsplash.com/photo-1643539292921-6d6ce5ec8bd0?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 89, 'tags' => ['ic-camasiri', 'kulot', 'cok-satanlar']],
            ['id' => 'saten-gecelik', 'name' => 'Saten Askılı Gecelik', 'price' => 899, 'image' => 'https://images.unsplash.com/photo-1770294759243-664b21a8ac38?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 34, 'tags' => ['ic-camasiri', 'gecelik', 'editorun-secimi']],
            ['id' => 'pamuklu-gecelik-takim', 'name' => 'Pamuklu Gecelik Takımı', 'price' => 749, 'image' => 'https://images.unsplash.com/photo-1766056278967-c0646b1bfd67?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 28, 'tags' => ['ic-camasiri', 'gecelik', 'indirim', 'sezon-sonu'], 'discountPercent' => 25, 'originalPrice' => 999],

            // --- Çocuk (7) ---
            ['id' => 'kiz-cocuk-firfirli-elbise', 'name' => 'Fırfırlı Askılı Elbise', 'price' => 649, 'image' => 'https://images.unsplash.com/photo-1742696274620-73648580d6a4?q=80&w=800&auto=format&fit=crop', 'rating' => 4.6, 'reviewCount' => 34, 'tags' => ['cocuk', 'kiz-cocuk']],
            ['id' => 'kiz-cocuk-puantiyeli-salopet', 'name' => 'Puantiyeli Salopet Elbise', 'price' => 549, 'image' => 'https://images.unsplash.com/photo-1601585463538-d3fd899f2b6f?q=80&w=800&auto=format&fit=crop', 'rating' => 4.7, 'reviewCount' => 41, 'tags' => ['cocuk', 'kiz-cocuk', 'yeni-gelenler'], 'isNew' => true],
            ['id' => 'erkek-cocuk-kot-ceket', 'name' => 'Kot Ceket', 'price' => 799, 'image' => 'https://images.unsplash.com/photo-1554889160-1f693e60f196?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 29, 'tags' => ['cocuk', 'erkek-cocuk']],
            ['id' => 'erkek-cocuk-basic-tisort', 'name' => 'Basic Pamuklu Tişört', 'price' => 279, 'image' => 'https://images.unsplash.com/photo-1579609253335-ec3eeea092cf?q=80&w=800&auto=format&fit=crop', 'rating' => 4.4, 'reviewCount' => 52, 'tags' => ['cocuk', 'erkek-cocuk', 'cok-satanlar']],
            ['id' => 'erkek-cocuk-yagmurluk-mont', 'name' => 'Kapüşonlu Yağmurluk Mont', 'price' => 699, 'image' => 'https://images.unsplash.com/photo-1566540050261-4847a420404e?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 17, 'tags' => ['cocuk', 'erkek-cocuk']],
            ['id' => 'bebek-body-takim', 'name' => 'Bebek Body Takımı', 'price' => 449, 'image' => 'https://images.unsplash.com/photo-1544198043-460b612e31d2?q=80&w=800&auto=format&fit=crop', 'rating' => 4.8, 'reviewCount' => 47, 'tags' => ['cocuk', 'bebek-giyim', 'yeni-gelenler'], 'isNew' => true],
            ['id' => 'bebek-pamuklu-zibin', 'name' => 'Pamuklu Zıbın', 'price' => 349, 'image' => 'https://images.unsplash.com/photo-1552511762-898bfd9fb837?q=80&w=800&auto=format&fit=crop', 'rating' => 4.5, 'reviewCount' => 23, 'tags' => ['cocuk', 'bebek-giyim']],

            // --- İndirim-only extras (2) ---
            ['id' => 'gunluk-elbise-indirimli', 'name' => 'Günlük Keten Elbise', 'price' => 1099, 'image' => 'https://images.unsplash.com/photo-1764298493197-a1c1cce57800?q=80&w=800&auto=format&fit=crop', 'rating' => 4.3, 'reviewCount' => 36, 'tags' => ['elbise', 'giyim', 'gunluk', 'gunluk-elbise', 'indirim', '50'], 'discountPercent' => 50, 'originalPrice' => 2199],
            ['id' => 'tisort-indirimli', 'name' => 'Baskılı Pamuklu T-Shirt', 'price' => 349, 'image' => 'https://images.unsplash.com/photo-1775234576215-4374ffe00b36?q=80&w=800&auto=format&fit=crop', 'rating' => 4.1, 'reviewCount' => 18, 'tags' => ['ust-giyim', 'giyim', 'tisort', 'tisort-body', 'indirim', '50'], 'discountPercent' => 50, 'originalPrice' => 699],
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

            $this->createVariants($product);

            // Sync categories based on tags that exist in the database
            if (isset($data['tags'])) {
                $categoryIds = \App\Models\Category::whereIn('slug', $data['tags'])->pluck('id')->toArray();
                $product->categories()->sync($categoryIds);
            }
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
