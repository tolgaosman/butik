import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function PromoBanner() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center lg:grid-cols-2">
        <div className="flex flex-col gap-4 px-5 py-10 sm:gap-5 sm:px-10 sm:py-16 lg:px-16">
          <p className="text-xs font-medium tracking-[0.25em] text-olive">SEN OL, GÜZEL OL</p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Kendine Güven,
            <br />
            <span className="italic text-olive">En Güzel Kombinin</span>
          </h2>
          <p className="max-w-md text-ink-soft">
            Sizi harika hissettiren zamansız parçalar, her gün giyilmek için tasarlandı.
          </p>
          <Button href="/koleksiyonlar" variant="solid" className="w-full sm:w-fit">
            Alışverişe Başla
          </Button>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-[4/5]">
          <Image
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop"
            alt="Askıda dizilmiş özenle seçilmiş kıyafetler"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
