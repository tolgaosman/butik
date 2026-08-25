"use client";

import { useState, useEffect } from "react";
import { Search, Edit2, Download } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { apiGet, apiMutate } from "@/lib/api";
import { revalidateStore } from "../actions";

const initialOrders = [
  { id: "#ORD-001", customer: "Ayşe Yılmaz", email: "ayse@example.com", date: "Bugün, 14:30", status: "Hazırlanıyor", total: formatPrice(1250), items: 3 },
  { id: "#ORD-002", customer: "Mehmet Demir", email: "mehmet@example.com", date: "Bugün, 12:15", status: "Kargoya Verildi", total: formatPrice(850), items: 1 },
  { id: "#ORD-003", customer: "Fatma Kaya", email: "fatma@example.com", date: "Dün, 16:45", status: "Teslim Edildi", total: formatPrice(2400), items: 5 },
  { id: "#ORD-004", customer: "Ali Can", email: "ali@example.com", date: "Dün, 09:20", status: "Hazırlanıyor", total: formatPrice(450), items: 1 },
  { id: "#ORD-005", customer: "Zeynep Şahin", email: "zeynep@example.com", date: "23 Ağu 2026", status: "Teslim Edildi", total: formatPrice(3100), items: 4 },
  { id: "#ORD-006", customer: "Burak Öz", email: "burak@example.com", date: "22 Ağu 2026", status: "İptal Edildi", total: formatPrice(1200), items: 2 },
  { id: "#ORD-007", customer: "Ceren Arslan", email: "ceren@example.com", date: "21 Ağu 2026", status: "Teslim Edildi", total: formatPrice(600), items: 1 },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [statusInput, setStatusInput] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiGet<any[]>("/admin/orders");
        if (res) setOrders(res);
      } catch (e) {
        console.error("Siparişler yüklenemedi", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredOrders = orders.filter((o) =>
    o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (order: any) => {
    setEditingOrder(order);
    setStatusInput(order.status);
  };

  const handleSave = async () => {
    if (!editingOrder) return;
    
    try {
      await apiMutate(`/admin/orders/${editingOrder.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: statusInput })
      });

      await revalidateStore();

      setOrders((prev) =>
        prev.map((o) => (o.id === editingOrder.id ? { ...o, status: statusInput } : o))
      );
      setEditingOrder(null);
    } catch (e) {
      console.error("Sipariş güncellenemedi", e);
      alert("Sipariş güncellenirken bir hata oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">Siparişler</h1>
          <p className="mt-1 text-sm text-ink-soft">Tüm müşteri siparişlerini yönetin ve takip edin.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded bg-surface px-4 py-2 text-sm font-medium text-ink shadow-sm border border-border hover:bg-cream">
          <Download size={16} />
          Dışa Aktar
        </button>
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-cream/50">
                <th scope="col" className="whitespace-nowrap py-3.5 pl-6 pr-3 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Sipariş Detayı</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Tarih</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Durum</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Ürün Sayısı</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ink-soft">Tutar</th>
                <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-6">
                  <span className="sr-only">İşlemler</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream/30 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-ink">{order.id}</div>
                          <div className="text-xs text-ink-soft">{order.customer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-ink-soft">{order.date}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "Hazırlanıyor" ? "bg-amber-100 text-amber-800" :
                        order.status === "Kargoya Verildi" ? "bg-blue-100 text-blue-800" :
                        order.status === "İptal Edildi" ? "bg-red-100 text-red-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-ink-soft">{order.items} Adet</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-ink">{order.total}</td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                      <button onClick={() => handleEdit(order)} className="text-ink-soft hover:text-olive transition-colors" title="Düzenle">
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-ink-soft">
                    Sipariş bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        title={`Sipariş Düzenle (${editingOrder?.id})`}
      >
        {editingOrder && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-sm font-medium text-ink-soft mb-1">Müşteri</p>
              <p className="text-ink font-medium">{editingOrder.customer} ({editingOrder.email})</p>
            </div>
            
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
            
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingOrder(null)}>İptal</Button>
              <Button variant="solid" onClick={handleSave}>Kaydet</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
