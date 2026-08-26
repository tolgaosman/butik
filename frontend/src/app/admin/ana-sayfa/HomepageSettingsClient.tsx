"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiMutate, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

type HomepageSettings = {
  hero_product_ids: string[];
  new_arrival_product_ids: string[];
  promo_banner_url: string;
};

export function HomepageSettingsClient({
  products,
  settings
}: {
  products: any[],
  settings: HomepageSettings
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [heroIds, setHeroIds] = useState<string[]>(settings.hero_product_ids || []);
  const [newArrivalIds, setNewArrivalIds] = useState<string[]>(settings.new_arrival_product_ids || []);
  const [promoBannerPreview, setPromoBannerPreview] = useState(settings.promo_banner_url || "");
  const [promoBannerFile, setPromoBannerFile] = useState<File | null>(null);

  const handlePromoBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPromoBannerFile(file);
    setPromoBannerPreview(URL.createObjectURL(file));
  };

  const toggleHero = (slug: string) => {
    setHeroIds(prev => prev.includes(slug) ? prev.filter(id => id !== slug) : [...prev, slug]);
  };

  const toggleNewArrival = (slug: string) => {
    setNewArrivalIds(prev => prev.includes(slug) ? prev.filter(id => id !== slug) : [...prev, slug]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      heroIds.forEach((slug) => formData.append("hero_product_ids[]", slug));
      newArrivalIds.forEach((slug) => formData.append("new_arrival_product_ids[]", slug));
      if (promoBannerFile) {
        formData.append("promo_banner_image", promoBannerFile);
      }

      const res = await apiMutate<any>("/admin/settings/homepage", {
        method: "POST",
        body: formData,
      });
      if (res !== undefined) {
        toast.success("Ayarlar kaydedildi", { description: "Ana sayfa değişiklikleriniz yayına alındı." });
        setPromoBannerFile(null);
        router.refresh();
      } else {
        toast.error("Kaydetme işlemi başarısız oldu");
      }
    } catch (e) {
      toast.error("Bir hata oluştu", {
        description: e instanceof ApiError ? e.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Carousel Section */}
      <section className="bg-surface border border-border p-6 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-serif text-ink">Çark Ürünleri</h2>
          {heroIds.length > 0 && (
            <button 
              onClick={() => setHeroIds([])}
              className="text-xs text-olive hover:underline font-medium"
            >
              Hepsini Temizle
            </button>
          )}
        </div>
        <p className="text-sm text-ink-soft mb-4">Ana sayfanın en üstündeki büyük çarkta dönecek ürünleri seçin.</p>
        
        <div className="max-h-60 overflow-y-auto border border-border divide-y divide-border">
          {products.map(product => (
            <label key={product.slug} className="flex items-center p-3 hover:bg-cream cursor-pointer">
              <input
                type="checkbox"
                checked={heroIds.includes(product.slug)}
                onChange={() => toggleHero(product.slug)}
                className="rounded border-border accent-olive focus:ring-olive"
              />
              <span className="ml-3 text-sm text-ink">{product.name} ({product.slug})</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-ink-soft mt-2">{heroIds.length} ürün seçildi.</p>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-surface border border-border p-6 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-serif text-ink">Yeni Sezon Ürünleri</h2>
          {newArrivalIds.length > 0 && (
            <button 
              onClick={() => setNewArrivalIds([])}
              className="text-xs text-olive hover:underline font-medium"
            >
              Hepsini Temizle
            </button>
          )}
        </div>
        <p className="text-sm text-ink-soft mb-4">Ana sayfadaki "Yeni Sezon" grid'inde sergilenecek ürünleri seçin.</p>
        
        <div className="max-h-60 overflow-y-auto border border-border divide-y divide-border">
          {products.map(product => (
            <label key={product.slug} className="flex items-center p-3 hover:bg-cream cursor-pointer">
              <input
                type="checkbox"
                checked={newArrivalIds.includes(product.slug)}
                onChange={() => toggleNewArrival(product.slug)}
                className="rounded border-border accent-olive focus:ring-olive"
              />
              <span className="ml-3 text-sm text-ink">{product.name} ({product.slug})</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-ink-soft mt-2">{newArrivalIds.length} ürün seçildi.</p>
      </section>

      {/* Promo Banner Section */}
      <section className="bg-surface border border-border p-6 shadow-sm">
        <h2 className="text-xl font-serif text-ink mb-2">Promosyon Afişi Görseli</h2>
        <p className="text-sm text-ink-soft mb-4">Kendine Güven, En Güzel Kombinin afişinin arka plan görseli.</p>

        <input
          type="file"
          accept="image/*"
          onChange={handlePromoBannerChange}
          className="text-sm text-ink-soft file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-olive file:text-surface hover:file:bg-olive/90"
        />
        {promoBannerPreview && (
          <div
            className="mt-4 aspect-[21/9] w-full max-w-lg bg-cover bg-center border border-border"
            style={{ backgroundImage: `url(${promoBannerPreview})` }}
          />
        )}
      </section>

      {/* Actions */}
      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-olive px-6 py-2.5 text-sm text-white hover:bg-olive/90 disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </div>
  );
}
