"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { apiMutate, ApiError } from "@/lib/api";
import type { Order } from "@/lib/orders";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type FieldErrors = Record<string, string[]>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, isLoading, refresh } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"cash_on_delivery" | "bank_transfer">("cash_on_delivery");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      email: user ? undefined : String(form.get("email")),
      phone: String(form.get("phone")),
      shipping_name: String(form.get("shipping_name")),
      shipping_line1: String(form.get("shipping_line1")),
      shipping_line2: String(form.get("shipping_line2") || "") || undefined,
      shipping_district: String(form.get("shipping_district")),
      shipping_city: String(form.get("shipping_city")),
      shipping_postal: String(form.get("shipping_postal") || "") || undefined,
      customer_note: String(form.get("customer_note") || "") || undefined,
      payment_method: paymentMethod,
    };

    try {
      const order = await apiMutate<Order>("/orders", { method: "POST", body: JSON.stringify(payload) });
      try {
        sessionStorage.setItem("sevgi-butik:last-order", JSON.stringify(order));
      } catch {
        // sessionStorage unavailable (private mode, etc) — confirmation page falls back to a bare summary
      }
      await refresh();
      router.push(`/siparis/${order.orderNumber}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.errors ?? {});
        setFormError(err.errors ? null : err.message);
      } else {
        setFormError("Bir şeyler ters gitti. Lütfen tekrar deneyin.");
      }
      setLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="h-96 animate-pulse rounded-sm bg-sand/40" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Breadcrumbs items={[{ label: "Ödeme" }]} />
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Sepetiniz boş</h1>
        <p className="mt-3 text-sm text-ink-soft">Ödeme yapmadan önce sepetinize ürün ekleyin.</p>
        <Button href="/" variant="solid" className="mt-6">
          Alışverişe Başla
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Sepetim", href: "/sepet" }, { label: "Ödeme" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">Ödeme</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-xl font-medium text-ink">Teslimat Bilgileri</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {!user && (
                <div className="sm:col-span-2">
                  <Input
                    id="email"
                    name="email"
                    label="E-posta"
                    type="email"
                    autoComplete="email"
                    required
                    error={errors.email?.[0]}
                  />
                </div>
              )}
              <Input
                id="phone"
                name="phone"
                label="Telefon"
                type="tel"
                autoComplete="tel"
                required
                error={errors.phone?.[0]}
              />
              <Input
                id="shipping_name"
                name="shipping_name"
                label="Ad Soyad"
                autoComplete="name"
                required
                error={errors.shipping_name?.[0]}
              />
              <div className="sm:col-span-2">
                <Input
                  id="shipping_line1"
                  name="shipping_line1"
                  label="Adres"
                  autoComplete="address-line1"
                  required
                  error={errors.shipping_line1?.[0]}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  id="shipping_line2"
                  name="shipping_line2"
                  label="Adres (devamı, opsiyonel)"
                  autoComplete="address-line2"
                />
              </div>
              <Input
                id="shipping_district"
                name="shipping_district"
                label="İlçe / Semt"
                required
                error={errors.shipping_district?.[0]}
              />
              <Input
                id="shipping_city"
                name="shipping_city"
                label="Şehir"
                autoComplete="address-level1"
                required
                error={errors.shipping_city?.[0]}
              />
              <Input id="shipping_postal" name="shipping_postal" label="Posta Kodu (opsiyonel)" />
            </div>
            <div className="mt-4">
              <label htmlFor="customer_note" className="mb-1.5 block text-xs font-medium text-ink-soft">
                Sipariş Notu (opsiyonel)
              </label>
              <textarea
                id="customer_note"
                name="customer_note"
                rows={3}
                className="w-full border border-sand px-4 py-2.5 text-sm transition-colors duration-200 focus:border-olive focus-visible:outline-none"
              />
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium text-ink">Ödeme Yöntemi</h2>
            <div className="mt-4 space-y-3">
              {(
                [
                  { value: "cash_on_delivery", label: "Kapıda Ödeme" },
                  { value: "bank_transfer", label: "Havale / EFT" },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-3.5 text-sm transition-colors duration-200 ${
                    paymentMethod === option.value ? "border-olive bg-olive/5" : "border-sand"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method_display"
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                    className="accent-olive"
                  />
                  <span className="text-ink">{option.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="h-fit rounded-sm border border-sand p-6">
          <p className="font-display text-lg font-medium text-ink">Sipariş Özeti</p>
          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-2 text-sm">
                <span className="text-ink-soft">
                  {item.name} {item.size && `(${item.size})`} × {item.quantity}
                </span>
                <span className="shrink-0 text-ink">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-sand pt-4 text-sm text-ink-soft">
            <div className="flex justify-between">
              <span>Ara Toplam</span>
              <span className="text-ink">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kargo</span>
              <span className="text-ink">{cart.shipping === 0 ? "Ücretsiz" : formatPrice(cart.shipping)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-sand pt-4 font-display text-lg font-medium text-ink">
            <span>Toplam</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
          {formError && <p className="mt-3 text-xs text-red-500">{formError}</p>}
          <Button type="submit" variant="solid" className="mt-6 w-full" loading={loading}>
            Siparişi Tamamla
          </Button>
        </div>
      </form>
    </div>
  );
}
