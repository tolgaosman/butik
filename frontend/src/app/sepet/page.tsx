"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function handleQuantity(itemId: number, quantity: number) {
    setPendingId(itemId);
    try {
      await updateQuantity(itemId, quantity);
    } finally {
      setPendingId(null);
    }
  }

  async function handleRemove(itemId: number) {
    setPendingId(itemId);
    try {
      await removeItem(itemId);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Sepetim" }]} />
      <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">Sepetim</h1>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex gap-4 py-6">
                <Skeleton className="h-28 w-24 shrink-0" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-fit border border-border p-6">
            <Skeleton className="h-5 w-32" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="mt-4 h-6 w-full" />
            <Skeleton className="mt-6 h-12 w-full" />
          </div>
        </div>
      ) : cart.items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={ShoppingBag}
            title="Sepetiniz boş"
            description="Beğendiğiniz ürünleri sepetinize ekleyerek alışverişe başlayın."
            ctaLabel="Alışverişe Başla"
            ctaHref="/"
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          <div className="divide-y divide-border">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 py-6">
                <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-sand">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-ink">{item.name}</p>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        disabled={pendingId === item.id}
                        aria-label="Ürünü kaldır"
                        className="p-1 text-ink-soft transition-colors duration-200 hover:text-ink disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {item.size && <p className="mt-1 text-xs text-ink-soft">Beden: {item.size}</p>}
                    <div className="mt-2 inline-flex items-center gap-3 rounded-full border border-border px-2 py-1">
                      <button
                        type="button"
                        onClick={() => handleQuantity(item.id, item.quantity - 1)}
                        disabled={pendingId === item.id || item.quantity <= 1}
                        aria-label="Adeti azalt"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand/60 hover:text-ink disabled:opacity-50"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center text-xs font-medium text-ink">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantity(item.id, item.quantity + 1)}
                        disabled={pendingId === item.id || item.quantity >= Math.min(10, item.stock)}
                        aria-label="Adeti artır"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand/60 hover:text-ink disabled:opacity-50"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="font-serif text-lg font-medium text-olive">{formatPrice(item.lineTotal)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit border border-border p-6">
            <p className="font-serif text-lg font-medium text-ink">Sipariş Özeti</p>
            <div className="mt-4 space-y-2 text-sm text-ink-soft">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span className="text-ink">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kargo</span>
                <span className="text-ink">{cart.shipping === 0 ? "Ücretsiz" : formatPrice(cart.shipping)}</span>
              </div>
            </div>
            {cart.freeShippingRemaining > 0 && (
              <p className="mt-3 text-xs text-olive">
                Ücretsiz kargo için {formatPrice(cart.freeShippingRemaining)} daha ürün ekleyin.
              </p>
            )}
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-serif text-lg font-medium text-ink">
              <span>Toplam</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
            <Button href="/odeme" variant="solid" className="mt-6 w-full">
              Ödemeye Geç
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
