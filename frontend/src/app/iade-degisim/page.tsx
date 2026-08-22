import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "İade ve Değişim | Sevgi Butik",
  description: "Sevgi Butik iade ve değişim koşulları.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "İade ve Değişim" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">İade ve Değişim</h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <p>
          Sevgi Butik olarak, ürünlerimizden tam olarak memnun kalmanızı istiyoruz. Bu nedenle 30 gün
          içinde kolay iade ve değişim imkânı sunuyoruz.
        </p>
        <div>
          <h2 className="font-display text-xl font-medium text-ink">İade Koşulları</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Ürün, teslim tarihinden itibaren 30 gün içinde iade edilmelidir.</li>
            <li>Ürün kullanılmamış, yıkanmamış ve orijinal etiketi üzerinde olmalıdır.</li>
            <li>İç giyim, mayo ve indirimli ürünler iade kapsamı dışındadır.</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl font-medium text-ink">İade Nasıl Yapılır?</h2>
          <p className="mt-2">
            Ürününüzü orijinal ambalajıyla birlikte mağazamıza getirebilir veya kargo ile
            gönderebilirsiniz. İade talebiniz onaylandıktan sonra ücret iadesi 5-7 iş günü içinde
            gerçekleştirilir.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-medium text-ink">Değişim</h2>
          <p className="mt-2">
            Beden veya renk değişimi talepleriniz için mağazamızı ziyaret edebilir ya da bizimle iletişime
            geçebilirsiniz. Stok durumuna göre değişim işleminiz aynı gün içinde tamamlanır.
          </p>
        </div>
      </div>
    </div>
  );
}
