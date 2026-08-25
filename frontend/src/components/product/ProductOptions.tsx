"use client";

import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart, ApiError } from "@/lib/cart";
import type { ProductVariant } from "@/lib/products";

const SIZES = ["XS", "S", "M", "L", "XL"];

type Props = {
  productSlug: string;
  variants: ProductVariant[];
};

export function ProductOptions({ productSlug, variants }: Props) {
  const { addItem } = useCart();
  const hasSizes = variants.some((v) => v.size !== null);
  const availableSizes = hasSizes
    ? SIZES.filter((s) => variants.some((v) => v.size === s && v.isActive && v.stock > 0))
    : [];

  const [size, setSize] = useState<string | null>(hasSizes ? (availableSizes[0] ?? null) : null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const outOfStock = hasSizes ? availableSizes.length === 0 : !variants.some((v) => v.stock > 0);

  async function handleAddToCart() {
    setLoading(true);
    setError(null);
    try {
      await addItem(productSlug, size, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sepete eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {hasSizes && (
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Beden</p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => {
              const isAvailable = availableSizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => isAvailable && setSize(s)}
                  disabled={!isAvailable}
                  aria-pressed={size === s}
                  className={`flex h-11 w-11 items-center justify-center border text-sm font-medium transition-colors duration-200 ease-[var(--ease-organic)] ${
                    !isAvailable
                      ? "cursor-not-allowed border-border text-ink-soft/40 line-through"
                      : size === s
                        ? "border-olive bg-olive text-white"
                        : "border-border text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Adet</p>
        <div className="inline-flex items-center gap-1 rounded-full border border-border px-1">
          <button
            type="button"
            onClick={() => setQty((v) => Math.max(1, v - 1))}
            aria-label="Adeti azalt"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand/60 hover:text-ink"
          >
            <Minus size={14} />
          </button>
          <span className="w-4 text-center text-sm font-medium text-ink">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((v) => Math.min(10, v + 1))}
            aria-label="Adeti artır"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand/60 hover:text-ink"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <Button
        type="button"
        variant="solid"
        className="w-full sm:w-auto"
        loading={loading}
        disabled={outOfStock || (hasSizes && !size)}
        onClick={handleAddToCart}
      >
        {added ? (
          <>
            <Check size={16} /> Sepete Eklendi
          </>
        ) : outOfStock ? (
          "Stokta Yok"
        ) : (
          "Sepete Ekle"
        )}
      </Button>
    </div>
  );
}
