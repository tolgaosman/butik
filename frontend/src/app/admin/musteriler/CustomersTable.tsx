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
      <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">Müşteriler</h1>
          <p className="mt-1 text-sm text-ink-soft">Mağazanıza kayıtlı tüm müşteriler ve harcama detayları.</p>
        </div>
        <button
          onClick={() => downloadCsv(filteredCustomers)}
          className="inline-flex items-center gap-2 rounded-2xl bg-surface px-5 py-2.5 text-sm font-semibold text-ink shadow-sm border border-border/70 hover:bg-cream hover:border-olive/30 transition-all"
        >
          <Download size={16} />
          Dışa Aktar (CSV)
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-border/70 bg-surface p-5 shadow-sm">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft pointer-events-none" />
          <input
            type="text"
            placeholder="İsim, e-posta veya telefon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-border/80 bg-cream/50 py-2.5 pl-11 pr-4 text-sm transition-all duration-200 placeholder:text-ink-soft focus:border-olive focus:bg-white focus:outline-none focus:ring-1 focus:ring-olive/30"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-cream/50 border-b border-border/60">
                <th scope="col" className="w-[22%] py-4 px-3 text-center text-xs font-semibold uppercase tracking-wider text-ink-soft pl-6">Müşteri Adı</th>
                <th scope="col" className="w-[20%] px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-soft">E-posta</th>
                <th scope="col" className="w-[14%] px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-soft">Telefon</th>
                <th scope="col" className="w-[14%] px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-soft">Kayıt Tarihi</th>
                <th scope="col" className="w-[10%] px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-soft">Siparişler</th>
                <th scope="col" className="w-[13%] px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-soft">Toplam Harcama</th>
                <th scope="col" className="w-[7%] py-4 px-3 text-center pr-6"><span className="sr-only">İşlemler</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-surface">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="group hover:bg-cream/40 transition-colors duration-200">
                    <td className="px-3 py-4 pl-6">
                      <div className="flex items-center justify-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-olive/10 text-sm font-bold text-olive">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="truncate text-sm font-semibold text-ink group-hover:text-olive transition-colors">{customer.name}</div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center text-sm text-ink-soft">{customer.email}</td>
                    <td className="px-3 py-4 text-center text-sm text-ink font-medium">{customer.phone ?? "—"}</td>
                    <td className="px-3 py-4 text-center text-xs font-medium text-ink-soft/80">{customer.joined}</td>
                    <td className="px-3 py-4 text-center text-sm font-bold text-ink">{customer.orders}</td>
                    <td className="px-3 py-4 text-center text-sm font-bold text-olive">{customer.spent}</td>
                    <td className="px-3 py-4 text-center text-sm font-medium pr-6">
                      <div className="flex justify-end">
                        <button onClick={() => handleEdit(customer)} className={`${iconButtonNeutral} rounded-xl`} title="Düzenle">
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-ink-soft">
                    Müşteri bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border/40 md:hidden">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="space-y-4 p-5 hover:bg-cream/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-olive/10 text-base font-bold text-olive">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-ink">{customer.name}</div>
                    <div className="truncate text-xs text-ink-soft/80 mt-0.5">{customer.email}</div>
                    <div className="truncate text-xs font-medium text-ink mt-0.5">{customer.phone ?? "—"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 rounded-2xl bg-cream/50 p-4 text-sm border border-border/40">
                  <div className="text-center">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft/70">Kayıt</div>
                    <span className="text-xs font-medium text-ink">{customer.joined}</span>
                  </div>
                  <div className="text-center border-l border-border/40">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft/70">Sipariş</div>
                    <span className="text-sm font-bold text-ink">{customer.orders}</span>
                  </div>
                  <div className="text-center border-l border-border/40">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft/70">Harcama</div>
                    <span className="text-sm font-bold text-olive">{customer.spent}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button onClick={() => handleEdit(customer)} className={`${iconButtonNeutral} rounded-xl`} title="Düzenle">
                    <Edit2 size={16} /> <span className="ml-2 text-xs font-semibold">Düzenle</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-12 text-center text-sm text-ink-soft">Müşteri bulunamadı.</p>
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
