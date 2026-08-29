"use client";

import { useState } from "react";
import { Search, Download, Edit2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiMutate, ApiError } from "@/lib/api";
import { revalidateStore } from "../actions";
import { iconButtonNeutral } from "@/lib/adminIconButton";
import { toast } from "@/lib/toast";
import type { AdminCustomer } from "@/lib/admin";

function downloadCsv(customers: AdminCustomer[]) {
  const header = ["Ad Soyad", "E-posta", "Telefon", "Kayıt Tarihi", "Sipariş Sayısı", "Toplam Harcama"];
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = customers.map((c) => [c.name, c.email, c.phone ?? "", c.joined, String(c.orders), c.spent].map(escape).join(","));
  const csv = [header.map(escape).join(","), ...rows].join("\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `musteriler-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function CustomersTable({ customers: initialCustomers }: { customers: AdminCustomer[] }) {
  const [customers, setCustomers] = useState<AdminCustomer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<AdminCustomer | null>(null);
  const [saving, setSaving] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (customer: AdminCustomer) => {
    setEditingCustomer(customer);
    setNameInput(customer.name);
    setEmailInput(customer.email);
    setPhoneInput(customer.phone ?? "");
  };

  const handleSave = async () => {
    if (!editingCustomer) return;
    setSaving(true);

    try {
      const updated = await apiMutate<AdminCustomer>(`/admin/customers/${editingCustomer.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: nameInput, email: emailInput, phone: phoneInput }),
      });

      await revalidateStore();

      setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? updated : c)));
      setEditingCustomer(null);
      toast.success("Müşteri güncellendi", { description: `${updated.name} kaydedildi.` });
    } catch (e) {
      toast.error("Müşteri güncellenemedi", {
        description: e instanceof ApiError ? e.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">Müşteriler</h1>
          <p className="mt-1 text-sm text-ink-soft">Mağazanıza kayıtlı tüm müşteriler ve harcama detayları.</p>
        </div>
        <button
          onClick={() => downloadCsv(filteredCustomers)}
          className="inline-flex items-center gap-2 rounded bg-surface px-4 py-2 text-sm font-medium text-ink shadow-sm border border-border hover:bg-cream transition-colors"
        >
          <Download size={16} />
          Dışa Aktar (CSV)
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-border bg-surface p-4 shadow-sm">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="İsim, e-posta veya telefon ara..."
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
                <th scope="col" className="w-[22%] py-3.5 px-3 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Müşteri Adı</th>
                <th scope="col" className="w-[20%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">E-posta</th>
                <th scope="col" className="w-[14%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Telefon</th>
                <th scope="col" className="w-[14%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Kayıt Tarihi</th>
                <th scope="col" className="w-[10%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Siparişler</th>
                <th scope="col" className="w-[13%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Toplam Harcama</th>
                <th scope="col" className="w-[7%] py-3.5 px-3 text-center"><span className="sr-only">İşlemler</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-3 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-olive/10 text-sm font-medium text-olive">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="truncate text-sm font-medium text-ink">{customer.name}</div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-ink-soft">{customer.email}</td>
                    <td className="px-3 py-4 text-center text-sm text-ink">{customer.phone ?? "—"}</td>
                    <td className="px-3 py-4 text-center text-sm text-ink-soft">{customer.joined}</td>
                    <td className="px-3 py-4 text-center text-sm font-medium text-ink">{customer.orders}</td>
                    <td className="px-3 py-4 text-center text-sm font-medium text-olive">{customer.spent}</td>
                    <td className="px-3 py-4 text-center text-sm font-medium">
                      <button onClick={() => handleEdit(customer)} className={iconButtonNeutral} title="Düzenle">
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-ink-soft">
                    Müşteri bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border md:hidden">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-olive/10 text-sm font-medium text-olive">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink">{customer.name}</div>
                    <div className="truncate text-xs text-ink-soft">{customer.email}</div>
                    <div className="truncate text-xs text-ink-soft">{customer.phone ?? "—"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Kayıt</div>
                    <span className="text-ink-soft">{customer.joined}</span>
                  </div>
                  <div>
                    <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Sipariş</div>
                    <span className="font-medium text-ink">{customer.orders}</span>
                  </div>
                  <div>
                    <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Harcama</div>
                    <span className="font-medium text-olive">{customer.spent}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end border-t border-border pt-3">
                  <button onClick={() => handleEdit(customer)} className={iconButtonNeutral} title="Düzenle">
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-ink-soft">Müşteri bulunamadı.</p>
          )}
        </div>
      </div>

      <Modal isOpen={!!editingCustomer} onClose={() => setEditingCustomer(null)} title="Müşteri Düzenle">
        {editingCustomer && (
          <div className="space-y-4">
            <Input id="name" label="Ad Soyad" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
            <Input id="email" label="E-posta" type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
            <Input id="phone" label="Telefon" type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} />

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingCustomer(null)}>İptal</Button>
              <Button variant="solid" onClick={handleSave} loading={saving}>Kaydet</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
