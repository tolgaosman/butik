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

  function handleToggleFavorite() {
    toggle(product);
  }

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <Link href={`/urun/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={sizes}
            className={`object-cover transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-[1.04] ${
              product.inStock ? "" : "opacity-60 grayscale-[30%]"
            }`}
          />
        </Link>

        {(product.isNew || product.discountPercent || !product.inStock) && (
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {!product.inStock && <Badge variant="neutral">Tükendi</Badge>}
            {product.isNew && <Badge variant="new">Yeni</Badge>}
            {product.discountPercent && <Badge variant="sale">%{product.discountPercent}</Badge>}
          </div>
        )}

        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-pressed={saved}
          aria-label={saved ? "Favorilerden çıkar" : "Favorilere ekle"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-ink opacity-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-[var(--ease-organic)] group-hover:opacity-100 group-focus-within:opacity-100 hover:scale-110 [@media(hover:none)]:opacity-100"
        >
          <Heart size={19} className={saved ? "fill-olive text-olive" : "fill-white/70"} />
        </button>

        <Link
          href={`/urun/${product.id}`}
          className="absolute inset-x-0 bottom-0 translate-y-[101%] bg-olive/95 py-3 text-center text-xs font-medium uppercase tracking-[0.15em] text-white backdrop-blur-sm opacity-0 transition-all duration-300 ease-[var(--ease-organic)] group-hover:translate-y-0 group-hover:opacity-100"
        >
          İncele
        </Link>
      </div>

      <div className="mt-3.5 space-y-1">
        <Link href={`/urun/${product.id}`} className="block font-serif text-lg text-ink transition-colors duration-200 hover:text-olive">
          {product.name}
        </Link>
        {product.reviewCount > 0 && <StarRating rating={product.rating} reviewCount={product.reviewCount} size={12} />}
        <p className="flex flex-wrap items-center gap-x-2 text-sm">
          <span className={product.originalPrice ? "font-medium text-olive" : "text-ink"}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-ink-soft line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </p>

      </div>
    </div>
  );
}
