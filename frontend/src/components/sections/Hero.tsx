import { getNewArrivals } from "@/lib/products";
import { HeroContent } from "./HeroContent";
import { HeroCarousel } from "./HeroCarousel";

export async function Hero() {
  const products = await getNewArrivals();

  return (
    <section className="relative overflow-hidden bg-cream pb-10 sm:pb-14">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 15% 0%, rgba(245,51,128,0.10), transparent 60%), radial-gradient(ellipse 55% 45% at 100% 15%, rgba(201,169,110,0.14), transparent 60%), repeating-linear-gradient(135deg, rgba(43,36,34,0.09) 0px, rgba(43,36,34,0.09) 1.5px, transparent 1.5px, transparent 42px)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1600px]">
        <HeroContent />
        <HeroCarousel products={products} />
      </div>
    </section>
  );
}
