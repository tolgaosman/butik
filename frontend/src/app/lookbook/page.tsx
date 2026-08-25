import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MotionStagger, MotionItem } from "@/components/ui/MotionReveal";

export const metadata: Metadata = {
  title: "Lookbook | Sevgi Butik",
  description: "Sevgi Butik'ten sezonun kombin ilhamları.",
};

const looks = [
  { image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop", href: "/elbise" },
  { image: "https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=900&auto=format&fit=crop", href: "/ust-giyim" },
  { image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900&auto=format&fit=crop", href: "/alt-giyim" },
  { image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=900&auto=format&fit=crop", href: "/elbise" },
  { image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop", href: "/aksesuar" },
  { image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900&auto=format&fit=crop", href: "/ust-giyim" },
];

export default function LookbookPage() {
  return (
    <div className="container-site py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Lookbook" }]} />
      <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl lg:text-6xl">Lookbook</h1>
      <p className="mt-3 max-w-lg text-sm text-ink-soft">
        Sezonun kombin ilhamlarını keşfedin, favori parçalarınızı ilgili koleksiyondan seçin.
      </p>

      <MotionStagger className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
        {looks.map((look) => (
          <MotionItem key={look.image}>
            <a href={look.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                <Image
                  src={look.image}
                  alt="Sevgi Butik kombin ilhamı"
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-105"
                />
              </div>
            </a>
          </MotionItem>
        ))}
      </MotionStagger>
    </div>
  );
}
