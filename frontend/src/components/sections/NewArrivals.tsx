import { getNewArrivals } from "@/lib/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

export async function NewArrivals() {
  const products = await getNewArrivals();

  return (
    <section className="bg-cream/40 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between sm:mb-8">
          <div>
            <p className="text-xs font-medium tracking-[0.25em] text-olive">YENİ SEZON</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">Yeni Geldi!</h2>
          </div>
          <Link
            href="/yeni-gelenler"
            className="hidden text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-olive sm:block"
          >
            Tümünü Gör →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-ink-soft">Şu anda yeni ürün bulunmuyor, yakında burada olacak.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {products.map((product, i) => (
              <Reveal key={product.id} delay={i * 60}>
                <ProductCard product={product} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
