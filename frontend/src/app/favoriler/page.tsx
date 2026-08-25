"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/ui/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFavorites } from "@/lib/favorites";
import { useAuth } from "@/lib/auth";

export default function FavoritesPage() {
  const { products, isLoading } = useFavorites();
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Favorilerim" }]} />
      <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">Favorilerim</h1>
      {!user && products.length > 0 && (
        <p className="mt-3 max-w-lg text-sm text-ink-soft">
          Favori ürünleriniz bu cihazda saklanıyor. Hesabınıza{" "}
          <Link href="/hesabim" className="font-medium text-olive hover:underline">
            giriş yaparak
          </Link>{" "}
          onları her yerden erişilebilir hale getirin.
        </p>
      )}

      {isLoading ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[3/4]" />
              <Skeleton className="mt-3.5 h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Henüz favori ürününüz yok"
          description="Beğendiğiniz ürünlerin üzerindeki kalp simgesine dokunarak onları buraya ekleyebilirsiniz."
          ctaLabel="Yeni Gelenlere Göz At"
          ctaHref="/yeni-gelenler"
        />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
          ))}
        </div>
      )}
    </div>
  );
}
