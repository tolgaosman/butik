import { PackageSearch } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { MotionStagger, MotionItem } from "@/components/ui/MotionReveal";

export function NewArrivals({ products }: { products: Product[] }) {
  return (
    <section id="yeni-sezon" className="bg-cream py-12 sm:py-20">
      <div className="container-site">
        <SectionHeader eyebrow="YENİ SEZON" title="Yeni Geldi!" />

        {products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="Yeni ürün yok"
            description="Şu anda yeni ürün bulunmuyor, yakında burada olacak."
          />
        ) : (
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
        )}
      </div>
    </section>
  );
}
