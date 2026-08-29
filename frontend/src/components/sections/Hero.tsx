import type { Product } from "@/lib/products";
import { HeroContent } from "./HeroContent";
import { HeroShowcase } from "./HeroShowcase";

export function Hero({ products }: { products: Product[] }) {
  return (
    <section className="relative overflow-x-clip bg-cream py-[clamp(1.5rem,5vh,3rem)]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(43,36,34,0.14) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 90% 75% at 50% 15%, black 30%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 75% at 50% 15%, black 30%, transparent 90%)",
        }}
        aria-hidden
      />
      <div className="container-site relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <HeroContent />
        <HeroShowcase products={products} />
      </div>
    </section>
  );
}
