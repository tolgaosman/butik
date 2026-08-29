"use client";

import { Truck } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

/**
 * Reads the threshold from the cart context (already fetched app-wide by
 * CartProvider) instead of hardcoding it, so a change to
 * shop.free_shipping_threshold_minor shows up here without a frontend deploy.
 */
export function FreeShippingInfoTile() {
  const { cart } = useCart();

  return (
    <div className="flex items-start gap-3.5 rounded-2xl bg-cream p-5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-olive">
        <Truck className="size-4" aria-hidden />
      </span>
      <div>
        <p className="font-serif text-sm font-semibold text-ink">Ücretsiz Kargo</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          {formatPrice(cart.freeShippingThreshold)} üzeri siparişlerde kargo bedava.
        </p>
      </div>
    </div>
  );
}
