"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS, type Order } from "@/lib/orders";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "sevgi-butik:last-order";

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setOrder(null);
        return;
      }
      const stored: Order = JSON.parse(raw);
      setOrder(stored.orderNumber === orderNumber ? stored : null);
    } catch {
      setOrder(null);
    }
  }, [orderNumber]);

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="h-96 animate-pulse rounded-sm bg-sand/40" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-6 sm:py-12 lg:px-8">
        <Breadcrumbs items={[{ label: "Sipariş Onayı" }]} />
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Sipariş numaranız: {orderNumber}
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          Sipariş detaylarınızı görüntülemek için siparişinizi takip edebilirsiniz.
        </p>
        <div className="mt-6 flex justify-center">
          <Button href="/siparis-takip" variant="solid">
            Siparişimi Takip Et
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Sipariş Onayı" }]} />

      <div className="mt-6 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-olive/10 text-olive">
          <CheckCircle2 size={32} strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">Siparişiniz Alındı</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Sipariş numaranız: <span className="font-medium text-ink">{order.orderNumber}</span>
        </p>
        <p className="mt-1 text-xs text-ink-soft">Durum: {ORDER_STATUS_LABELS[order.status]}</p>
      </div>

      <div className="mt-10 divide-y divide-sand rounded-sm border border-sand">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 p-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-sand">
              <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{item.name}</p>
                {item.size && <p className="mt-0.5 text-xs text-ink-soft">Beden: {item.size}</p>}
                <p className="mt-0.5 text-xs text-ink-soft">Adet: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-olive">{formatPrice(item.lineTotal)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between rounded-sm border border-sand p-4 font-display text-lg font-medium text-ink">
        <span>Toplam</span>
        <span>{formatPrice(order.total)}</span>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button href="/siparis-takip" variant="outline">
          Siparişimi Takip Et
        </Button>
        <Button href="/" variant="solid">
          Alışverişe Devam Et
        </Button>
      </div>
    </div>
  );
}
