"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { apiMutate, ApiError } from "@/lib/api";
import { revalidateStore } from "../actions";
import { toast } from "@/lib/toast";

function statusDotClass(status: string) {
  return status === "Hazırlanıyor"
    ? "bg-gold"
    : status === "Kargoya Verildi"
      ? "bg-olive/50"
      : status === "İptal Edildi"
        ? "bg-ink-soft/40"
        : "bg-olive";
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-ink-soft">
      <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass(status)}`} />
      {status}
    </span>
  );
}

function formatMoney(value: number) {
  return "₺" + value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function OrdersTable({ orders: initialOrders }: { orders: any[] }) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusInput, setStatusInput] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredOrders = orders.filter((o) =>
    o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = (order: any) => {
    setSelectedOrder(order);
    setStatusInput(order.status);
  };

  const handleSave = async () => {
    if (!selectedOrder) return;
    setSaving(true);

    try {
      await apiMutate(`/admin/orders/${selectedOrder.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: statusInput })
      });

      await revalidateStore();

      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: statusInput } : o))
      );
      setSelectedOrder(null);
      toast.success("Sipariş durumu güncellendi", { description: `${selectedOrder.id} → ${statusInput}` });
    } catch (e) {
      console.error("Sipariş güncellenemedi", e);
      toast.error("Sipariş güncellenemedi", {
        description: e instanceof ApiError ? e.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-ink">Siparişler</h1>
        <p className="mt-1 text-sm text-ink-soft">Tüm müşteri siparişlerini yönetin ve takip edin.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-border bg-surface p-4 shadow-sm">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Sipariş no veya müşteri ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-border bg-cream py-2 pl-9 pr-4 text-sm focus:border-olive focus:outline-none focus:ring-1 focus:ring-olive"
          />
        </div>
      </div>

      <div className="overflow-hidden border border-border bg-surface shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full table-fixed divide-y divide-border">
            <thead>
              <tr className="bg-cream/50">
                <th scope="col" className="w-[28%] py-3.5 px-3 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Sipariş Detayı</th>
                <th scope="col" className="w-[18%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Tarih</th>
                <th scope="col" className="w-[22%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Durum</th>
                <th scope="col" className="w-[16%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Ürün Sayısı</th>
                <th scope="col" className="w-[16%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleOpen(order)}
                    className="cursor-pointer transition-colors hover:bg-cream/30"
                  >
                    <td className="px-3 py-4 text-center">
                      <div className="text-sm font-medium text-ink">{order.id}</div>
                      <div className="text-xs text-ink-soft">{order.customer}</div>
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-ink-soft">{order.date}</td>
                    <td className="px-3 py-4 text-center text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-ink-soft">{order.items} Adet</td>
                    <td className="px-3 py-4 text-center text-sm font-medium text-ink">{order.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-ink-soft">
                    Sipariş bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border md:hidden">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOpen(order)}
                className="cursor-pointer space-y-3 p-4 transition-colors hover:bg-cream/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-ink">{order.id}</div>
                    <div className="text-xs text-ink-soft">{order.customer}</div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Tarih</div>
                    <span className="text-ink-soft">{order.date}</span>
                  </div>
                  <div>
                    <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Ürün Sayısı</div>
                    <span className="text-ink-soft">{order.items} Adet</span>
                  </div>
                  <div>
                    <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Tutar</div>
                    <span className="font-medium text-ink">{order.total}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-ink-soft">Sipariş bulunamadı.</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Sipariş Detayı (${selectedOrder?.id})`}
      >
        {selectedOrder && (
          <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-2">
            {/* MÜŞTERİ */}
            <div className="space-y-1 rounded border border-border bg-cream/30 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">Müşteri</h3>
              <p className="text-sm text-ink">{selectedOrder.customer}</p>
              <p className="text-xs text-ink-soft">{selectedOrder.email}</p>
              {selectedOrder.phone && <p className="text-xs text-ink-soft">{selectedOrder.phone}</p>}
            </div>

            {/* TESLİMAT ADRESİ */}
            {selectedOrder.shippingAddress?.line1 && (
              <div className="space-y-1 rounded border border-border bg-cream/30 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">Teslimat Adresi</h3>
                <p className="text-sm text-ink">{selectedOrder.shippingAddress.name}</p>
                <p className="text-xs text-ink-soft">
                  {selectedOrder.shippingAddress.line1}
                  {selectedOrder.shippingAddress.line2 && `, ${selectedOrder.shippingAddress.line2}`}
                </p>
                <p className="text-xs text-ink-soft">
                  {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
                  {selectedOrder.shippingAddress.postalCode && ` ${selectedOrder.shippingAddress.postalCode}`}
                </p>
                {selectedOrder.shippingAddress.phone && (
                  <p className="text-xs text-ink-soft">{selectedOrder.shippingAddress.phone}</p>
                )}
              </div>
            )}

            {/* ÖDEME */}
            <div className="grid grid-cols-2 gap-4 rounded border border-border bg-cream/30 p-4">
              <div>
                <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Ödeme Yöntemi</div>
                <p className="text-sm text-ink">{selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Ödeme Durumu</div>
                <p className="text-sm text-ink">{selectedOrder.paymentStatus}</p>
              </div>
              {selectedOrder.trackingNumber && (
                <div className="col-span-2">
                  <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Kargo Takip No</div>
                  <p className="text-sm text-ink">{selectedOrder.trackingNumber}</p>
                </div>
              )}
            </div>

            {/* ÜRÜNLER */}
            <div className="space-y-3 rounded border border-border bg-cream/30 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">Ürünler</h3>
              <div className="divide-y divide-border">
                {(selectedOrder.lineItems ?? []).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">{item.name}</p>
                      <p className="text-xs text-ink-soft">
                        {item.size && `Beden: ${item.size} · `}Adet: {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-medium text-ink">{formatMoney(item.lineTotal)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-1 border-t border-border pt-3 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <span>Ara Toplam</span>
                  <span>{formatMoney(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Kargo</span>
                  <span>{formatMoney(selectedOrder.shipping)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-ink-soft">
                    <span>İndirim</span>
                    <span>-{formatMoney(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-ink">
                  <span>Toplam</span>
                  <span>{formatMoney(selectedOrder.totalValue)}</span>
                </div>
              </div>
            </div>

            {selectedOrder.customerNote && (
              <div className="space-y-1 rounded border border-border bg-cream/30 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">Müşteri Notu</h3>
                <p className="text-sm text-ink-soft">{selectedOrder.customerNote}</p>
              </div>
            )}

            {/* DURUM */}
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-ink">
                Sipariş Durumu
              </label>
              <select
                id="status"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none focus:ring-1 focus:ring-olive"
              >
                <option value="Hazırlanıyor">Hazırlanıyor</option>
                <option value="Kargoya Verildi">Kargoya Verildi</option>
                <option value="Teslim Edildi">Teslim Edildi</option>
                <option value="İptal Edildi">İptal Edildi</option>
              </select>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-surface pt-4">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>Kapat</Button>
              <Button variant="solid" onClick={handleSave} loading={saving}>Durumu Kaydet</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
