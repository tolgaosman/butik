import { getBestSellers } from "@/lib/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MotionStagger, MotionItem } from "@/components/ui/MotionReveal";

export async function BestSellers() {
  const products = await getBestSellers();

  if (products.length === 0) return null;

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="container-site">
        <SectionHeader
          eyelash="ÇOK SATANLAR"
          title="En Çok Satan Parçalar"
          href="/yeni-gelenler/cok-satanlar"
          linkLabel="Tümünü Gör"
        />

        <MotionStagger className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <MotionItem key={product.id}>
              <ProductCard
                product={product}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              />
            </MotionItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
