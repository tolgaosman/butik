import type { Metadata } from "next";
import { Truck, Clock, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Kargo ve Teslimat | Sevgi Butik",
  description: "Sevgi Butik kargo ve teslimat bilgileri.",
};

const items = [
  {
    icon: Truck,
    title: "KKTC Geneli Kargo",
    body: "Tüm siparişleriniz KKTC genelindeki adreslere gönderilir. ₺2.500 üzeri siparişlerde kargo ücretsizdir, altındaki siparişlerde sabit kargo ücreti uygulanır.",
  },
  {
    icon: Clock,
    title: "Teslimat Süresi",
    body: "Lefkoşa içi siparişler 1-2 iş günü, diğer bölgelere yapılan siparişler 2-4 iş günü içinde teslim edilir. Sipariş onayından sonra kargo takip bilginiz size iletilir.",
  },
  {
    icon: MapPin,
    title: "Mağazadan Teslim Al",
    body: "Dilerseniz siparişinizi Düzova'daki mağazamızdan da teslim alabilirsiniz. Sipariş notlarına \"mağazadan teslim\" yazmanız yeterli.",
  },
];

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Kargo ve Teslimat" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">Kargo ve Teslimat</h1>

      <div className="mt-10 space-y-8">
        {items.map((item) => (
          <div key={item.title} className="flex gap-4">
            <item.icon size={24} className="mt-1 shrink-0 text-olive" strokeWidth={1.25} />
            <div>
              <h2 className="font-display text-xl font-medium text-ink">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
