"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart, ApiError } from "@/lib/cart";
import { toast } from "@/lib/toast";
import { trackAddToCart } from "@/lib/analytics";
import type { ProductVariant } from "@/lib/products";

const MAX_QUANTITY = 10;
const LOW_STOCK_THRESHOLD = 5;

type Props = {
  productSlug: string;
  productName: string;
  productPrice: number;
  variants: ProductVariant[];
};

export function ProductOptions({ productSlug, productName, productPrice, variants }: Props) {
  const { addItem } = useCart();
  const hasSizes = variants.some((v) => v.size !== null);

  // Every size this product comes in, in the order the backend returns them —
  // sizes are free text now (not just XS-XL), so the UI can't hardcode the set.
  const allSizes = useMemo(() => {
    const seen = new Set<string>();
    return variants.reduce<string[]>((acc, v) => {
      if (v.size && !seen.has(v.size)) {
        seen.add(v.size);
        acc.push(v.size);
      }
      return acc;
    }, []);
  }, [variants]);

  const isSizeAvailable = (s: string) => variants.some((v) => v.size === s && v.isActive && v.stock > 0);

  const [size, setSize] = useState<string | null>(hasSizes ? (allSizes.find(isSizeAvailable) ?? null) : null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const selectedVariant = hasSizes
    ? variants.find((v) => v.size === size && v.isActive)
    : variants.find((v) => v.isActive);
  const stock = selectedVariant?.stock ?? 0;
  const outOfStock = hasSizes ? !allSizes.some(isSizeAvailable) : stock === 0;
  const maxQty = Math.max(1, Math.min(MAX_QUANTITY, stock));

  function handleSelectSize(s: string) {
    setSize(s);
    const nextStock = variants.find((v) => v.size === s)?.stock ?? 0;
    setQty((prev) => Math.min(prev, Math.max(1, Math.min(MAX_QUANTITY, nextStock))));
  }

  async function handleAddToCart() {
    setLoading(true);
    try {
      const ok = await addItem(productSlug, size, qty);
      if (!ok) return;
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      trackAddToCart({ id: productSlug, name: productName, price: productPrice }, qty);
      toast.success("Sepete eklendi", {
        description: `${productName}${size ? ` · Beden: ${size}` : ""} · Adet: ${qty}`,
      });
    } catch (err) {
      toast.error("Sepete eklenemedi", {
        description: err instanceof ApiError ? err.message : "Lütfen tekrar deneyin.",
      });
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
            {allSizes.map((s) => {
              const isAvailable = isSizeAvailable(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => isAvailable && handleSelectSize(s)}
                  disabled={!isAvailable}
                  aria-pressed={size === s}
                  className={`flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors duration-200 ease-[var(--ease-organic)] ${
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

      {!outOfStock && stock <= LOW_STOCK_THRESHOLD && (
        <p className="text-sm font-medium text-olive-dark">Son {stock} adet kaldı</p>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Adet</p>
        <div className="inline-flex items-center gap-1 rounded-full border border-border px-1">
          <button
            type="button"
            onClick={() => setQty((v) => Math.max(1, v - 1))}
            aria-label="Adeti azalt"
            disabled={outOfStock}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand/60 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          >
            <Minus size={14} />
          </button>
          <span className="w-4 text-center text-sm font-medium text-ink">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((v) => Math.min(maxQty, v + 1))}
            aria-label="Adeti artır"
            disabled={outOfStock || qty >= maxQty}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand/60 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <Button
        type="button"
        variant="solid"
        className="w-full rounded-full sm:w-auto"
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
