import type { Metadata } from "next";
import { business } from "@/lib/business";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Kariyer | Sevgi Butik",
  description: "Sevgi Butik açık pozisyonlar ve kariyer fırsatları.",
};

const roles = [
  {
    title: "Mağaza Satış Danışmanı",
    location: "Düzova, Lefkoşa",
    type: "Tam Zamanlı",
    body: "Müşterilerimize stil önerileri sunacak, mağaza deneyimini en iyi şekilde yönetecek, moda ve müşteri ilişkilerine tutkulu bir ekip arkadaşı arıyoruz.",
  },
  {
    title: "Sosyal Medya ve İçerik Sorumlusu",
    location: "Düzova, Lefkoşa / Hibrit",
    type: "Yarı Zamanlı",
    body: "Sevgi Butik'in sosyal medya hesaplarını yönetecek, koleksiyon çekimlerinde yer alacak yaratıcı bir ekip arkadaşı arıyoruz.",
  },
];

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Kariyer" }]} />
      <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">Kariyer</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Sevgi Butik ailesine katılmak ister misiniz? Açık pozisyonlarımızı aşağıda bulabilirsiniz. Uygun
        bir pozisyon göremeseniz bile özgeçmişinizi bize göndererek başvurularınızı bekletebiliriz.
      </p>

      <div className="mt-10 space-y-6">
        {roles.map((role) => (
          <div key={role.title} className="border border-border p-6">
            <h2 className="font-serif text-xl font-medium text-ink">{role.title}</h2>
            <p className="mt-1 text-xs tracking-wide text-olive">
              {role.location} · {role.type}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{role.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Button href={`mailto:${business.email}?subject=Kariyer%20Başvurusu`} variant="solid">
          Özgeçmişini Gönder
        </Button>
      </div>
    </div>
  );
}
