"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCart, ApiError } from "@/lib/cart";
import { toast } from "@/lib/toast";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();
  const [pendingId, setPendingId] = useState<number | null>(null);

  const freeShippingThreshold = cart.freeShippingThreshold || 2500;
  const progressPercent = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));
  const isFreeShipping = cart.freeShippingRemaining <= 0;

  async function handleQuantity(itemId: number, quantity: number) {
    if (quantity < 1) return;
    setPendingId(itemId);
    try {
      await updateQuantity(itemId, quantity);
    } catch (err) {
      toast.error("Adet güncellenemedi", {
        description: err instanceof ApiError ? err.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setPendingId(null);
    }
  }

  async function handleRemove(itemId: number, itemName: string) {
    setPendingId(itemId);
    try {
      await removeItem(itemId);
      toast.info("Sepetten çıkarıldı", { description: `${itemName} sepetinizden kaldırıldı.` });
    } catch (err) {
      toast.error("Ürün kaldırılamadı", {
        description: err instanceof ApiError ? err.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="min-h-[70vh] bg-cream/40 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Sepetim" }]} />

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4 border-b border-border/70 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Alışveriş Sepetim
            </h1>
            <p className="mt-1.5 text-sm text-ink-soft">
              {cart.items.length > 0
                ? `Sepetinizde toplam ${cart.itemCount} parça ürün bulunuyor.`
                : "Özenle seçilmiş butik koleksiyonumuzu keşfedin."}
            </p>
          </div>
          {cart.items.length > 0 && (
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft transition-colors duration-200 hover:text-olive"
            >
              <span>Alışverişe Devam Et</span>
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <div className="rounded-3xl border border-border/60 bg-surface p-6">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex gap-4 py-6 first:pt-0 last:pb-0">
                    <Skeleton className="h-32 w-24 shrink-0 rounded-2xl sm:w-28" />
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-8 w-28 rounded-full" />
                      </div>
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-fit rounded-3xl border border-border/60 bg-surface p-6 sm:p-8">
              <Skeleton className="h-6 w-36" />
              <div className="mt-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
              <Skeleton className="mt-8 h-12 w-full rounded-full" />
            </div>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border/70 bg-surface px-6 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-sand/60 text-olive">
              <ShoppingBag size={34} strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 font-serif text-2xl font-medium text-ink sm:text-3xl">
              Sepetinizde Ürün Bulunmuyor
            </h2>
            <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-ink-soft">
              Henüz sepetinize bir ürün eklemediniz. En yeni sezon parçalarını ve popüler kombinleri hemen keşfedin.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/elbise" variant="solid" size="md">
                Elbise Koleksiyonu
              </Button>
              <Button href="/ust-giyim" variant="outline" size="md">
                Üst Giyim
              </Button>
              <Button href="/" variant="ghost" size="md">
                Tüm Ürünler
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
            {/* Left Column: Progress Bar + Products */}
            <div className="space-y-6">
              {/* Free Shipping Tracker */}
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                      isFreeShipping ? "bg-olive/15 text-olive" : "bg-sand text-ink-soft"
                    }`}
                  >
                    {isFreeShipping ? <Sparkles size={20} /> : <Truck size={20} />}
                  </div>
                  <div className="flex-1">
                    {isFreeShipping ? (
                      <p className="text-sm font-medium text-olive">
                        Tebrikler! Siparişinizde <span className="font-semibold">Ücretsiz Kargo</span> kazandınız! 🎉
                      </p>
                    ) : (
                      <p className="text-sm text-ink-soft">
                        Ücretsiz kargo fırsatına{" "}
                        <span className="font-semibold text-ink">
                          {formatPrice(cart.freeShippingRemaining)}
                        </span>{" "}
                        kaldı.
                      </p>
                    )}
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-sand/80">
                      <div
                        className="h-full rounded-full bg-olive transition-all duration-500 ease-[var(--ease-organic)]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-sm divide-y divide-border/60">
                {cart.items.map((item) => {
                  const isBusy = pendingId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`group flex flex-col gap-4 p-5 transition-opacity duration-200 sm:flex-row sm:gap-6 sm:p-6 ${
                        isBusy ? "opacity-60" : ""
                      }`}
                    >
                      {/* Product Image */}
                      <Link
                        href={`/urun/${item.productId}`}
                        className="relative h-32 w-28 shrink-0 overflow-hidden rounded-2xl bg-sand transition-transform duration-300 ease-[var(--ease-organic)] group-hover:scale-[1.02] sm:h-36 sm:w-32"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(min-width: 640px) 128px, 112px"
                          className="object-cover"
                        />
                      </Link>

                      {/* Info & Actions */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link
                                href={`/urun/${item.productId}`}
                                className="font-serif text-base font-medium text-ink transition-colors duration-200 hover:text-olive sm:text-lg"
                              >
                                {item.name}
                              </Link>
                              {item.size && (
                                <p className="mt-1 inline-flex items-center rounded-md bg-sand/80 px-2 py-0.5 text-xs font-medium text-ink-soft">
                                  Beden: <span className="ml-1 text-ink">{item.size}</span>
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemove(item.id, item.name)}
                              disabled={isBusy}
                              aria-label="Ürünü sepetten çıkar"
                              className="rounded-full p-2 text-ink-soft/70 transition-colors duration-200 hover:bg-sand/60 hover:text-red-500 disabled:opacity-50"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>

                        {/* Bottom Row: Quantity + Line Total */}
                        <div className="mt-4 flex items-center justify-between gap-4 sm:mt-6">
                          <div className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-surface px-3 py-1.5 shadow-xs">
                            <button
                              type="button"
                              onClick={() => handleQuantity(item.id, item.quantity - 1)}
                              disabled={isBusy || item.quantity <= 1}
                              aria-label="Adeti azalt"
                              className="flex size-6 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand hover:text-ink disabled:opacity-30"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="min-w-4 text-center text-xs font-semibold text-ink">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantity(item.id, item.quantity + 1)}
                              disabled={isBusy || item.quantity >= Math.min(10, item.stock)}
                              aria-label="Adeti artır"
                              className="flex size-6 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand hover:text-ink disabled:opacity-30"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-serif text-lg font-medium text-olive sm:text-xl">
                              {formatPrice(item.lineTotal)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-[0.7rem] text-ink-soft">
                                Birim: {formatPrice(item.unitPrice)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="space-y-4 lg:sticky lg:top-28 lg:h-fit">
              <div className="rounded-3xl border border-border/70 bg-surface p-6 sm:p-7 shadow-sm">
                <h2 className="font-serif text-xl font-medium tracking-tight text-ink">
                  Sipariş Özeti
                </h2>

                <div className="mt-5 space-y-3.5 border-b border-border/60 pb-5 text-sm text-ink-soft">
                  <div className="flex items-center justify-between">
                    <span>Ürünler Toplamı</span>
                    <span className="font-medium text-ink">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kargo Ücreti</span>
                    {cart.shipping === 0 ? (
                      <span className="font-medium text-olive">Ücretsiz</span>
                    ) : (
                      <span className="font-medium text-ink">{formatPrice(cart.shipping)}</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between pt-1">
                  <span className="font-serif text-lg font-medium text-ink">Toplam</span>
                  <span className="font-serif text-2xl font-semibold text-ink">
                    {formatPrice(cart.total)}
                  </span>
                </div>

                <Button
                  href="/odeme"
                  variant="solid"
                  size="lg"
                  className="mt-6 w-full gap-2 rounded-2xl py-4 text-sm font-semibold shadow-md shadow-olive/15 transition-all duration-300 hover:shadow-lg hover:shadow-olive/25"
                >
                  <span>Ödemeye Geç</span>
                  <ArrowRight size={16} />
                </Button>
              </div>

              {/* Guarantees Box */}
              <div className="rounded-3xl border border-border/60 bg-surface/60 p-5 backdrop-blur-xs text-xs text-ink-soft space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="shrink-0 text-olive" />
                  <span>256-Bit SSL ile %100 Güvenli Ödeme</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={18} className="shrink-0 text-olive" />
                  <span>Hızlı Teslimat & Kapıda Ödeme Seçeneği</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={18} className="shrink-0 text-olive" />
                  <span>14 Gün İçinde Kolay İade & Değişim</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
