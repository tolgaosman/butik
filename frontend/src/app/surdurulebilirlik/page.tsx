import type { Metadata } from "next";
import { Leaf, Recycle, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Sürdürülebilirlik | Sevgi Butik",
  description: "Sevgi Butik sürdürülebilirlik yaklaşımı.",
};

const commitments = [
  {
    icon: Leaf,
    title: "Bilinçli Seçim",
    body: "Ürünlerimizi seçerken kalite ve dayanıklılığı ön planda tutuyor, tek kullanımlık moda yerine uzun ömürlü parçaları tercih ediyoruz.",
  },
  {
    icon: Recycle,
    title: "Sorumlu Ambalaj",
    body: "Paketlerimizde geri dönüştürülebilir malzemeler kullanmaya, plastik kullanımını azaltmaya özen gösteriyoruz.",
  },
  {
    icon: Users,
    title: "Yerel Ekonomiye Katkı",
    body: "KKTC'de faaliyet gösteren bir aile işletmesi olarak yerel istihdama ve ekonomiye katkı sağlamaya önem veriyoruz.",
  },
];

export default function SustainabilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Sürdürülebilirlik" }]} />
      <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">Sürdürülebilirlik</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Modanın çevresel etkisinin farkındayız ve mümkün olduğunca sorumlu bir şekilde büyümeye
        çalışıyoruz. İşte bu yolda attığımız adımlardan bazıları.
      </p>

      <div className="mt-10 space-y-8">
        {commitments.map((item) => (
          <div key={item.title} className="flex gap-4">
            <item.icon size={24} className="mt-1 shrink-0 text-olive" strokeWidth={1.25} />
            <div>
              <h2 className="font-serif text-xl font-medium text-ink">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
