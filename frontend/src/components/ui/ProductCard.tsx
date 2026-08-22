"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useFavorites } from "@/lib/favorites";
import { StarRating } from "./StarRating";

export function ProductCard({ product, sizes }: { product: Product; sizes: string }) {
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(product.id);

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-sand">
        <Link href={`/urun/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggle(product)}
          aria-pressed={saved}
          aria-label={saved ? "Favorilerden çıkar" : "Favorilere ekle"}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-sm transition-transform duration-300 ease-[var(--ease-organic)] hover:scale-110 active:scale-95 sm:right-3 sm:top-3"
        >
          <Heart
            size={17}
            className={`transition-colors duration-300 ${saved ? "fill-olive text-olive" : ""}`}
          />
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <Link href={`/urun/${product.id}`} className="block text-sm font-medium text-ink hover:text-olive sm:text-base">
          {product.name}
        </Link>
        <p className="flex flex-wrap items-center gap-x-2 font-display text-base font-medium text-olive sm:text-lg">
          {formatPrice(product.price)}
          {product.originalPrice && (
            <span className="text-sm font-normal text-ink-soft line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </div>
    </div>
  );
}
