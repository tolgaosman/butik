"use client";

import { useState } from "react";
import { PackageSearch, Search } from "lucide-react";
import type { Product } from "@/lib/products";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { MotionStagger, MotionItem } from "@/components/ui/MotionReveal";

type Props = {
  breadcrumbItems: BreadcrumbItem[];
  title: string;
  products: Product[];
};

export function ProductListing({ breadcrumbItems, title, products }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="container-site py-8 sm:py-12">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-4xl font-medium text-ink sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {filteredProducts.length} ürün bulundu
          </p>
        </div>

        {products.length > 0 && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" size={18} />
            <input
              type="text"
              placeholder={`${title} içinde ara...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-surface px-10 py-2.5 text-sm text-ink outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive"
            />
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={PackageSearch}
            title={searchQuery ? "Aramanızla eşleşen ürün bulunamadı" : "Bu kategoride henüz ürün yok"}
            description={searchQuery ? "Lütfen farklı bir kelime ile tekrar deneyin." : "Bu kategoriye yakında yeni ürünler eklenecek. O zamana kadar diğer koleksiyonlarımıza göz atabilirsiniz."}
            ctaLabel={searchQuery ? "Aramayı Temizle" : "Tüm Ürünlere Dön"}
            ctaHref={searchQuery ? undefined : "/yeni-gelenler"}
            onCtaClick={searchQuery ? () => setSearchQuery("") : undefined}
          />
        </div>
      ) : (
        <MotionStagger className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <MotionItem key={product.id}>
              <ProductCard product={product} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
            </MotionItem>
          ))}
        </MotionStagger>
      )}
    </section>
  );
}
