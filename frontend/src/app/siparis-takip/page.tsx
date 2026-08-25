"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { apiMutate, ApiError } from "@/lib/api";
import { ORDER_STATUS_LABELS, type OrderTracking } from "@/lib/orders";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function OrderTrackingPage() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderTracking | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    const form = new FormData(e.currentTarget);
    try {
      const result = await apiMutate<OrderTracking>("/orders/track", {
        method: "POST",
        body: JSON.stringify({
          order_number: String(form.get("order_number")),
          email: String(form.get("email")),
        }),
      });
      setOrder(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sipariş bulunamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Siparişimi Takip Et" }]} />
      <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">
        Siparişimi Takip Et
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Sipariş numaranızı ve sipariş verirken kullandığınız e-posta adresini girerek siparişinizin
        güncel durumunu görüntüleyebilirsiniz. Sipariş numaranız, sipariş onay e-postanızda yer alır.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input id="order-number" name="order_number" label="Sipariş Numarası" placeholder="Örn. SB-10234" required />
        <Input id="order-email" name="email" label="E-posta Adresi" type="email" autoComplete="email" required />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button type="submit" variant="solid" loading={loading}>
          Siparişi Sorgula
        </Button>
      </form>

      {order && (
        <div className="mt-10 border border-border p-6">
          <div className="flex items-center justify-between">
            <p className="font-serif text-lg font-medium text-ink">{order.orderNumber}</p>
            <span className="rounded-full bg-olive/10 px-3 py-1 text-xs font-medium text-olive">
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>
          {order.trackingNumber && (
            <p className="mt-2 text-xs text-ink-soft">Kargo Takip No: {order.trackingNumber}</p>
          )}
          <div className="mt-4 divide-y divide-border">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 py-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-sand">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink-soft">
                    {item.size && `Beden: ${item.size} · `}Adet: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-serif text-base font-medium text-ink">
            <span>Toplam</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      <p className="mt-8 text-xs text-ink-soft">
        Siparişinizle ilgili yardıma mı ihtiyacınız var? İletişim sayfamızdan bize ulaşabilirsiniz.
      </p>
    </div>
  );
}
