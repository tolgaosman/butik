"use client";

import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { apiMutate, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";
import { revalidateStore } from "../actions";
import type { StoreSettings } from "@/lib/settings";

type FieldErrors = Record<string, string[]>;

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const payload = {
      store_name: String(form.get("store_name") ?? ""),
      store_category: String(form.get("store_category") ?? ""),
      store_address: String(form.get("store_address") ?? ""),
      store_maps_query: String(form.get("store_maps_query") ?? ""),
      store_phone: String(form.get("store_phone") ?? ""),
      store_email: String(form.get("store_email") ?? ""),
      store_instagram: String(form.get("store_instagram") ?? ""),
      store_facebook: String(form.get("store_facebook") ?? ""),
    };

    try {
      await apiMutate("/admin/settings/store", { method: "PUT", body: JSON.stringify(payload) });
      await revalidateStore();
      toast.success("Ayarlar kaydedildi", { description: "Mağaza bilgileriniz güncellendi." });
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
      }
      toast.error("Ayarlar kaydedilemedi", {
        description: error instanceof ApiError ? error.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-3xl border border-border/70 bg-surface p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-xl font-medium text-ink mb-6">Genel Bilgiler</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            id="store_name"
            name="store_name"
            label="Mağaza Adı"
            defaultValue={settings.name}
            required
            error={errors.store_name?.[0]}
          />
          <Input
            id="store_category"
            name="store_category"
            label="Slogan / Kategori"
            defaultValue={settings.category}
            error={errors.store_category?.[0]}
          />
          <div className="sm:col-span-2">
            <Textarea
              id="store_address"
              name="store_address"
              label="Açık Adres"
              defaultValue={settings.address}
              rows={3}
              required
              error={errors.store_address?.[0]}
            />
          </div>
          <Input
            id="store_maps_query"
            name="store_maps_query"
            label="Google Maps Arama Terimi"
            defaultValue={settings.mapsQuery}
            error={errors.store_maps_query?.[0]}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border/70 bg-surface p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-xl font-medium text-ink mb-6">İletişim & Sosyal Medya</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            id="store_phone"
            name="store_phone"
            label="Telefon"
            defaultValue={settings.phone}
            required
            error={errors.store_phone?.[0]}
          />
          <Input
            id="store_email"
            name="store_email"
            label="E-posta"
            type="email"
            defaultValue={settings.email}
            required
            error={errors.store_email?.[0]}
          />
          <div className="sm:col-span-2">
            <Input
              id="store_instagram"
              name="store_instagram"
              label="Instagram URL"
              defaultValue={settings.instagram}
              error={errors.store_instagram?.[0]}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              id="store_facebook"
              name="store_facebook"
              label="Facebook URL"
              defaultValue={settings.facebook}
              error={errors.store_facebook?.[0]}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-olive px-6 py-3 text-sm font-bold tracking-wider text-white shadow-md shadow-olive/20 transition-all hover:bg-olive-dark hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Kaydediliyor...
            </span>
          ) : (
            <>
              Değişiklikleri Kaydet
              <Save size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
