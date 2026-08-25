import type { Product } from "./products";

const handWritten: Record<string, string> = {
  "cicek-desenli-midi-elbise":
    "Hafif ve akıcı kumaşıyla günün her saatinde rahat bir şıklık sunan bu midi elbise, ince çiçek deseniyle dikkat çekiyor. V yaka detayı ve hafif volanlı etek kesimi, hem günlük hem de özel davetler için ideal bir seçim.",
  "saten-gomlek-bluz":
    "Yumuşak dokusu ve zarif dökümüyle saten gömlek bluz, ofisten akşam buluşmalarına kolayca taşınabilecek çok yönlü bir parça. Klasik yaka ve düğmeli ön detayı ile şık kombinlerin vazgeçilmezi.",
  "blazer-ceket-bej":
    "Kalıplı kesimi ve nötr bej tonuyla dolabınızın en çok kullanacağınız parçalarından biri olacak bu blazer ceket, hem pantolon hem de elbise üzerine katman olarak rahatlıkla giyilebilir.",
  "keten-bol-paca-pantolon":
    "Nefes alan keten kumaşı ve bol paça kesimiyle sıcak günlerin favorisi olan bu pantolon, yüksek bel detayıyla vücudu güzel saran, rahat ve şık bir siluet sunuyor.",
  "zincir-detayli-canta":
    "Metal zincir askısı ve kompakt gövdesiyle günlük kombinlere zarif bir dokunuş katan bu çanta, iç bölmeleri sayesinde pratik kullanım da sağlıyor.",
  "katmanli-altin-kolye":
    "İnce zincirlerin katmanlı tasarımıyla öne çıkan bu altın kaplama kolye, sade kombinleri tamamlayan zarif bir aksesuar arayanlar için ideal.",
  "oval-gunes-gozlugu":
    "Oval çerçevesi ve UV korumalı camlarıyla hem şıklık hem koruma sunan bu güneş gözlüğü, yüz hatlarını yumuşatan zamansız bir tasarıma sahip.",
};

const categoryTemplates: Record<string, string> = {
  elbise:
    "Özenle seçilmiş kumaşı ve akıcı kesimiyle bu elbise, gününüzün her anında rahat ve şık bir görünüm sunuyor. Sevgi Butik'in özenli seçkisinden.",
  "ust-giyim":
    "Kaliteli kumaşı ve rahat kalıbıyla dolabınızın vazgeçilmezi olacak bu parça, farklı kombinlerle kolayca eşleştirilebiliyor.",
  "alt-giyim":
    "Vücudu güzel saran kesimi ve dayanıklı kumaşıyla gün boyu konfor sunan bu parça, günlük ve özel kombinler için eşit derecede uygun.",
  aksesuar:
    "İnce işçiliği ve zamansız tasarımıyla kombinlerinize karakter katan bu aksesuar, Sevgi Butik'in özenle seçilmiş koleksiyonundan.",
};

export function getProductDescription(product: Product): string {
  if (handWritten[product.id]) return handWritten[product.id];
  
  if (product.id.includes('elbise')) return categoryTemplates.elbise;
  if (product.id.includes('pantolon') || product.id.includes('etek')) return categoryTemplates["alt-giyim"];
  if (product.id.includes('bluz') || product.id.includes('gomlek') || product.id.includes('ceket') || product.id.includes('kazak')) return categoryTemplates["ust-giyim"];
  
  return categoryTemplates.aksesuar;
}
