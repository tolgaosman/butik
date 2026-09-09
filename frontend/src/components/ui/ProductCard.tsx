"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useFavorites } from "@/lib/favorites";
import { Badge } from "./Badge";
import { StarRating } from "./StarRating";

export function ProductCard({ product, sizes }: { product: Product; sizes: string }) {
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(product.id);

  function handleToggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    toggle(product);
  }

  return (
    <Link href={`/urun/${product.id}`} className="group block transition-transform duration-700 ease-[var(--ease-organic)] hover:-translate-y-2">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-cream shadow-sm ring-1 ring-ink/5 transition-all duration-700 ease-[var(--ease-organic)] group-hover:shadow-2xl group-hover:shadow-olive/15">
        <div className="absolute inset-0 bg-ink/5 animate-pulse" />
        
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          className={`object-cover transition-transform duration-1000 ease-[var(--ease-organic)] group-hover:scale-[1.05] ${
            product.inStock ? "" : "opacity-60 grayscale-[30%]"
          }`}
        />

        {(product.isNew || product.discountPercent || !product.inStock) && (
          <div className="absolute left-4 top-4 flex flex-col items-start gap-2 z-10">
            {!product.inStock && <Badge variant="neutral">Tükendi</Badge>}
            {product.isNew && <Badge variant="new">Yeni</Badge>}
            {product.discountPercent && (
              <span className="whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-[0.7rem] font-bold leading-tight text-ink shadow-sm backdrop-blur-md">
                %{product.discountPercent} İNDİRİM
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-pressed={saved}
          aria-label={saved ? "Favorilerden çıkar" : "Favorilere ekle"}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-md transition-all duration-300 ease-[var(--ease-organic)] opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110 hover:bg-white"
        >
          <Heart size={18} strokeWidth={2.5} className={saved ? "fill-olive text-olive" : "text-ink"} />
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-[101%] bg-white/80 py-4 text-center text-xs font-bold uppercase tracking-[0.15em] text-ink backdrop-blur-md opacity-0 transition-all duration-500 ease-[var(--ease-organic)] group-hover:translate-y-0 group-hover:opacity-100">
          İncele
        </div>
      </div>

      <div className="mt-4 px-1 space-y-1">
        <h3 className="font-serif text-[1.15rem] font-medium text-ink transition-colors duration-200 group-hover:text-olive line-clamp-1">
          {product.name}
        </h3>
        
        {product.reviewCount > 0 && (
          <div className="pt-0.5 pb-1">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={12} />
          </div>
        )}
        
        <p className="flex items-baseline gap-x-2.5 pt-0.5">
          <span className={product.originalPrice ? "font-bold text-[1.1rem] text-olive" : "font-medium text-[1.05rem] text-ink"}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[0.9rem] text-ink-soft line-through decoration-ink-soft/40">{formatPrice(product.originalPrice)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
