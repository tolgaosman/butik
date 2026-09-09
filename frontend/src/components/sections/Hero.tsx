import type { Product } from "@/lib/products";
import { HeroContent } from "./HeroContent";
import { HeroShowcase } from "./HeroShowcase";
import { HeroBackground } from "./HeroBackground";

export function Hero({ products }: { products: Product[] }) {
  return (
    <section className="relative overflow-x-clip bg-cream pb-[clamp(1.5rem,5vh,3rem)] pt-[calc(clamp(1.5rem,5vh,3rem)+6rem)] -mt-[6rem]">
      <HeroBackground />
      <div className="container-site relative mx-auto grid max-w-[100rem] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:gap-16">
        <HeroContent />
        <HeroShowcase products={products} />
      </div>
    </section>
  );
}
