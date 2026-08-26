import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FavoritesGrid } from "@/components/favorites/FavoritesGrid";
import { MotionStagger, MotionItem } from "@/components/ui/MotionReveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { TrustBar } from "@/components/sections/TrustBar";
import { getNewArrivals } from "@/lib/products";

export default async function FavoritesPage() {
  const recommended = await getNewArrivals();

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Breadcrumbs items={[{ label: "Favorilerim" }]} />
        <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">Favorilerim</h1>

        <FavoritesGrid />

        {recommended.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">Bunlar da İlginizi Çekebilir</h2>
            <MotionStagger className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {recommended.slice(0, 4).map((p) => (
                <MotionItem key={p.id}>
                  <ProductCard product={p} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
                </MotionItem>
              ))}
            </MotionStagger>
          </section>
        )}
      </div>

      <TrustBar />
    </>
  );
}
