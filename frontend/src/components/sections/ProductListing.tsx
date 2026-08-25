import { PackageSearch } from "lucide-react";
import type { Product } from "@/lib/products";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  breadcrumbItems: BreadcrumbItem[];
  title: string;
  products: Product[];
};

export function ProductListing({ breadcrumbItems, title, products }: Props) {
  return (
    <section className="container-site py-8 sm:py-12">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">{title}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {products.length} ürün bulundu
      </p>

      {products.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="Bu kategoride henüz ürün yok"
          description="Bu kategoriye yakında yeni ürünler eklenecek. O zamana kadar diğer koleksiyonlarımıza göz atabilirsiniz."
          ctaLabel="Tüm Ürünlere Dön"
          ctaHref="/yeni-gelenler"
        />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={(i % 8) * 60}>
              <ProductCard product={product} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
