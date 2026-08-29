"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import type { Product } from "@/lib/products";

export function ProductFavoriteButton({ product }: { product: Product }) {
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(product.id);

  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={saved}
      aria-label={saved ? "Favorilerden çıkar" : "Favorilere ekle"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-ink transition-colors duration-200 ease-[var(--ease-organic)] hover:border-olive hover:text-olive"
    >
      <Heart size={18} className={saved ? "fill-olive text-olive" : ""} />
    </button>
  );
}
