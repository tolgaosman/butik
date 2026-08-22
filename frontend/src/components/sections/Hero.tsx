import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { business, googleReviews } from "@/lib/business";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Hero() {
  return (
    <section className="grid grid-cols-1 bg-cream lg:grid-cols-2 lg:min-h-[38rem]">
      <div className="order-2 flex flex-col justify-center gap-5 px-5 py-10 sm:gap-6 sm:px-10 sm:py-16 lg:order-1 lg:px-16 lg:py-20">
        <p className="text-xs font-medium tracking-[0.25em] text-olive">YENİ SEZON. YENİ RUH.</p>
        <h1 className="font-display text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
          Zahmetsiz Şıklık
          <br />
          <span className="italic text-olive">Size Özel</span>
        </h1>
        <p className="max-w-md text-ink-soft">
          Her mevsim, her an için özenle seçilmiş parçalar. Yeniceköy&apos;den tüm Kıbrıs&apos;a,
          stilinizi tamamlayan kombinler.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Button href="/yeni-gelenler" variant="solid" className="w-full sm:w-auto">
            Yeni Ürünleri Keşfet
          </Button>
          <Button href="/koleksiyonlar" variant="outline" className="w-full sm:w-auto">
            Koleksiyonlar
          </Button>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="flex -space-x-3">
            {googleReviews.map((review) => (
              <div
                key={review.author}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-cream bg-olive text-[0.65rem] font-medium text-cream"
              >
                {initials(review.author)}
              </div>
            ))}
          </div>
          <div>
            <StarRating rating={business.rating} reviewCount={business.reviewCount} />
            <p className="text-xs text-ink-soft">Google&apos;da {business.rating}/5 puan</p>
          </div>
        </div>
      </div>

      <div className="relative order-1 aspect-[4/5] lg:order-2 lg:aspect-auto">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
          alt="Yeşil çiçek desenli elbise giyen kadın"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute bottom-8 right-8 hidden h-36 w-36 flex-col items-center justify-center gap-2 rounded-full border border-gold/40 bg-cream/95 text-center shadow-[0_12px_40px_rgb(0,0,0,0.18)] backdrop-blur-sm sm:flex">
          <span className="h-px w-8 bg-gold/70" aria-hidden />
          <p className="font-display text-lg italic leading-tight text-olive">
            Özenle
            <br />
            Seçilmiş
          </p>
          <p className="text-[0.6rem] font-medium tracking-[0.3em] text-ink-soft">PARÇALAR</p>
        </div>
      </div>
    </section>
  );
}
