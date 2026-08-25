"use client";

import { useState, useEffect } from "react";
import { Search, Download, Edit2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { apiGet, apiMutate } from "@/lib/api";
import { revalidateStore } from "../actions";

const initialCustomers = [
  { id: "C-1001", name: "Ayşe Yılmaz", email: "ayse@example.com", phone: "0532 111 2233", joined: "12 Mar 2026", orders: 4, spent: formatPrice(4500) },
  { id: "C-1002", name: "Mehmet Demir", email: "mehmet@example.com", phone: "0533 222 3344", joined: "15 Nis 2026", orders: 1, spent: formatPrice(850) },
  { id: "C-1003", name: "Fatma Kaya", email: "fatma@example.com", phone: "0544 333 4455", joined: "01 May 2026", orders: 8, spent: formatPrice(12400) },
  { id: "C-1004", name: "Ali Can", email: "ali@example.com", phone: "0555 444 5566", joined: "22 Haz 2026", orders: 2, spent: formatPrice(1200) },
  { id: "C-1005", name: "Zeynep Şahin", email: "zeynep@example.com", phone: "0505 555 6677", joined: "10 Ağu 2026", orders: 3, spent: formatPrice(3100) },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>(initialCustomers);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiGet<any[]>("/admin/customers");
        if (res) setCustomers(res);
      } catch (e) {
        console.error("Müşteriler yüklenemedi", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Form state
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setNameInput(customer.name);
    setEmailInput(customer.email);
    setPhoneInput(customer.phone);
  };

  const handleSave = async () => {
    if (!editingCustomer) return;
    
    try {
      await apiMutate(`/admin/customers/${editingCustomer.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: nameInput, email: emailInput, phone: phoneInput })
      });

      await revalidateStore();

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, name: nameInput, email: emailInput, phone: phoneInput }
            : c
        )
      );
      setEditingCustomer(null);
    } catch (e) {
      console.error("Müşteri güncellenemedi", e);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">Müşteriler</h1>
          <p className="mt-1 text-sm text-ink-soft">Mağazanıza kayıtlı tüm müşteriler ve harcama detayları.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded bg-surface px-4 py-2 text-sm font-medium text-ink shadow-sm border border-border hover:bg-cream transition-colors">
          <Download size={16} />
          Dışa Aktar (CSV)
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-border bg-surface p-4 shadow-sm">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="İsim veya e-posta ara..."
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
                <th scope="col" className="whitespace-nowrap py-3.5 pl-6 pr-3 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Müşteri Adı</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">İletişim</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Kayıt Tarihi</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Siparişler</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ink-soft">Toplam Harcama</th>
                <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-6"><span className="sr-only">İşlemler</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-cream/30 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-olive/10 text-sm font-medium text-olive">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="text-sm font-medium text-ink">{customer.name}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="text-sm text-ink">{customer.email}</div>
                      <div className="text-xs text-ink-soft">{customer.phone}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-ink-soft">{customer.joined}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-center text-sm font-medium text-ink">{customer.orders}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium text-olive">{customer.spent}</td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                      <button onClick={() => handleEdit(customer)} className="text-ink-soft hover:text-olive transition-colors" title="Düzenle">
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-ink-soft">
                    Müşteri bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        title="Müşteri Düzenle"
      >
        {editingCustomer && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-ink">Ad Soyad</label>
              <input
                id="name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-ink">E-Posta</label>
              <input
                id="email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-ink">Telefon</label>
              <input
                id="phone"
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
              />
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingCustomer(null)}>İptal</Button>
              <Button variant="solid" onClick={handleSave}>Kaydet</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
