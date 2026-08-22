import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | Sevgi Butik",
  description: "Sevgi Butik hakkında sıkça sorulan sorular.",
};

const faqs = [
  {
    question: "Kıbrıs geneline kargo gönderiyor musunuz?",
    answer:
      "Evet, KKTC genelinde tüm bölgelere kargo gönderimi yapıyoruz. ₺2.500 üzeri siparişlerde kargo ücretsizdir.",
  },
  {
    question: "Türkiye'ye gönderim yapıyor musunuz?",
    answer:
      "Şu an için yalnızca KKTC içi gönderim yapmaktayız. Türkiye gönderimleri için mağazamızı arayarak bilgi alabilirsiniz.",
  },
  {
    question: "Siparişim ne kadar sürede elime ulaşır?",
    answer: "Lefkoşa içi siparişler 1-2 iş günü, diğer bölgeler 2-4 iş günü içinde teslim edilir.",
  },
  {
    question: "Ürünleri nasıl iade edebilirim?",
    answer:
      "Ürünlerinizi teslim aldıktan sonra 30 gün içinde, kullanılmamış ve etiketi çıkarılmamış olması koşuluyla iade edebilirsiniz. Detaylar için İade ve Değişim sayfamızı inceleyebilirsiniz.",
  },
  {
    question: "Beden konusunda tereddüt yaşıyorum, ne yapmalıyım?",
    answer:
      "Beden Rehberi sayfamızdaki ölçü tablosunu inceleyebilir, dilerseniz mağazamızı arayarak ürüne özel beden önerisi alabilirsiniz.",
  },
  {
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer: "Visa, Mastercard, PayPal ve Apple Pay ile güvenli ödeme yapabilirsiniz.",
  },
  {
    question: "Mağazanızı ziyaret edebilir miyim?",
    answer:
      "Elbette! Düzova, İskele Anayolu üzerindeki mağazamızı Pazartesi-Cuma ve Pazar günleri 09:30-19:00 saatleri arasında ziyaret edebilirsiniz. Cumartesi günleri kapalıyız.",
  },
  {
    question: "Siparişimi nasıl takip edebilirim?",
    answer:
      "Sipariş takibi için Siparişimi Takip Et sayfasından sipariş numaranızı girerek anlık durumu görüntüleyebilirsiniz.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Sıkça Sorulan Sorular" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">
        Sıkça Sorulan Sorular
      </h1>

      <div className="mt-8 divide-y divide-sand border-y border-sand">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
              {faq.question}
              <ChevronDown
                size={16}
                className="shrink-0 text-ink-soft transition-transform duration-300 ease-[var(--ease-organic)] group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
