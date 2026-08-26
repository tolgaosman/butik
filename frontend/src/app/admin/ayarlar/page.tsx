"use client";

import { useState } from "react";
import { business } from "@/lib/business";
import { Input, Textarea } from "@/components/ui/Input";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl font-medium text-ink">Mağaza Ayarları</h1>
        <p className="mt-1 text-sm text-ink-soft">Mağazanızın temel bilgilerini, iletişim detaylarını ve çalışma saatlerini güncelleyin.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-lg font-medium text-ink mb-6">Genel Bilgiler</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input id="shop-name" name="name" label="Mağaza Adı" defaultValue={business.name} />
            <Input id="shop-category" name="category" label="Slogan / Kategori" defaultValue={business.category} />
            <div className="sm:col-span-2">
              <Textarea id="shop-address" name="address" label="Açık Adres" defaultValue={business.address} rows={3} />
            </div>
            <Input id="shop-maps" name="mapsQuery" label="Google Maps Arama Terimi" defaultValue={business.mapsQuery} />
          </div>
        </div>

        <div className="border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-lg font-medium text-ink mb-6">İletişim & Sosyal Medya</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input id="contact-phone" name="phone" label="Telefon" defaultValue={business.phone} />
            <Input id="contact-email" name="email" label="E-posta" type="email" defaultValue={business.email} />
            <div className="sm:col-span-2">
              <Input id="social-insta" name="instagram" label="Instagram URL" defaultValue={business.instagram} />
            </div>
            <div className="sm:col-span-2">
              <Input id="social-fb" name="facebook" label="Facebook URL" defaultValue={business.facebook} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded bg-olive px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-olive-dark transition-colors disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Kaydediliyor...
              </span>
            ) : (
              <>
                <Save size={18} />
                Ayarları Kaydet
              </>
            )}
          </button>
          
          {success && (
            <span className="text-sm font-medium text-olive animate-in fade-in slide-in-from-left-2">
              Ayarlar başarıyla kaydedildi!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
