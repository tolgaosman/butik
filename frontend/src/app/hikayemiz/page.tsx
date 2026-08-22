import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Hikayemiz | Sevgi Butik",
  description: "Sevgi Butik'in hikayesi.",
};

export default function StoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Hikayemiz" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">Hikayemiz</h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <p>
          Sevgi Butik, Düzova&apos;nın kalbinde, kadınların kendilerini en iyi hissettikleri kıyafetleri
          kolayca bulabilecekleri sıcak bir alan yaratma fikriyle yola çıktı. Küçük bir mağazadan başlayan
          bu yolculuk, zamanla KKTC genelinde güvenilen bir isim haline geldi.
        </p>
        <p>
          Amacımız hiç değişmedi: her bütçeye ve her tarza uygun, kaliteli ve zamansız parçaları
          müşterilerimizle buluşturmak. Her ürünü özenle seçiyor, mağazamıza gelen her müşterimize kendi
          evimizdeymiş gibi davranıyoruz.
        </p>
        <p>
          Bugün Sevgi Butik, sadece bir giyim mağazası değil; komşularımızın, arkadaşlarımızın ve yıllardır
          bize güvenen müşterilerimizin uğrak noktası. Bu güveni her gün yeniden kazanmak için
          çalışıyoruz.
        </p>
      </div>
    </div>
  );
}
