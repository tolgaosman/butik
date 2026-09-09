"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiMutate, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

export type HomepageSettings = {
  hero_product_ids: string[];
  new_arrival_product_ids: string[];
  promo_banner_url: string;
};

// The admin products endpoint returns the raw Eloquent Product model — only
// these two fields are used to build the hero/new-arrivals picker below.
export type AdminProductOption = { slug: string; name: string };

export function HomepageSettingsClient({
  products,
  settings
}: {
  products: AdminProductOption[],
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
    setHeroIds(prev => {
      if (prev.includes(slug)) return prev.filter(id => id !== slug);
      if (prev.length >= 10) {
        toast.error("En fazla 10 ürün seçebilirsiniz.");
        return prev;
      }
      return [...prev, slug];
    });
  };

  const toggleNewArrival = (slug: string) => {
    setNewArrivalIds(prev => {
      if (prev.includes(slug)) return prev.filter(id => id !== slug);
      if (prev.length >= 10) {
        toast.error("En fazla 10 ürün seçebilirsiniz.");
        return prev;
      }
      return [...prev, slug];
    });
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

      const res = await apiMutate<unknown>("/admin/settings/homepage", {
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
      {/* Hero Showcase Section */}
      <section className="rounded-3xl border border-border/70 bg-surface p-6 sm:p-8 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-serif text-ink tracking-tight">Ana Sayfada Üstte Neler Görünsün</h2>
          {heroIds.length > 0 && (
            <button
              onClick={() => setHeroIds([])}
              className="text-[11px] font-bold uppercase tracking-wider text-olive hover:text-olive-dark transition-colors"
            >
              Hepsini Temizle
            </button>
          )}
        </div>
        <p className="text-sm text-ink-soft mb-6 leading-relaxed">Ana sayfanın en üstünde gösterilecek ürün havuzunu seçin. İlk açılışta bu ürünler arasından rastgele 5 tanesi büyük öne çıkan kartta ve etrafındaki bento-grid yapısında görünür (en fazla 10 ürün seçebilirsiniz).</p>
        
        <div className="max-h-64 overflow-y-auto rounded-2xl border border-border/60 divide-y divide-border/40 scrollbar-hide">
          {products.map(product => (
            <label key={product.slug} className="group flex items-center p-3.5 hover:bg-cream/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={heroIds.includes(product.slug)}
                disabled={heroIds.length >= 10 && !heroIds.includes(product.slug)}
                onChange={() => toggleHero(product.slug)}
                className="size-4 rounded border-border/60 accent-olive focus:ring-olive disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <span className="ml-3.5 text-sm font-medium text-ink group-hover:text-olive transition-colors">
                {product.name} <span className="text-xs font-normal text-ink-soft/70 ml-1">({product.slug})</span>
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs font-medium text-ink-soft mt-3 px-1">{heroIds.length} ürün seçildi.</p>
      </section>

      {/* New Arrivals Section */}
      <section className="rounded-3xl border border-border/70 bg-surface p-6 sm:p-8 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-serif text-ink tracking-tight">Yeni Sezon Ürünleri</h2>
          {newArrivalIds.length > 0 && (
            <button 
              onClick={() => setNewArrivalIds([])}
              className="text-[11px] font-bold uppercase tracking-wider text-olive hover:text-olive-dark transition-colors"
            >
              Hepsini Temizle
            </button>
          )}
        </div>
        <p className="text-sm text-ink-soft mb-6 leading-relaxed">Ana sayfadaki &quot;Yeni Sezon&quot; grid&apos;inde sergilenecek ürünleri seçin (en fazla 10 ürün).</p>
        
        <div className="max-h-64 overflow-y-auto rounded-2xl border border-border/60 divide-y divide-border/40 scrollbar-hide">
          {products.map(product => (
            <label key={product.slug} className="group flex items-center p-3.5 hover:bg-cream/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={newArrivalIds.includes(product.slug)}
                disabled={newArrivalIds.length >= 10 && !newArrivalIds.includes(product.slug)}
                onChange={() => toggleNewArrival(product.slug)}
                className="size-4 rounded border-border/60 accent-olive focus:ring-olive disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <span className="ml-3.5 text-sm font-medium text-ink group-hover:text-olive transition-colors">
                {product.name} <span className="text-xs font-normal text-ink-soft/70 ml-1">({product.slug})</span>
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs font-medium text-ink-soft mt-3 px-1">{newArrivalIds.length} ürün seçildi.</p>
      </section>

      {/* Promo Banner Section */}
      <section className="rounded-3xl border border-border/70 bg-surface p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-serif text-ink tracking-tight mb-2">Promosyon Afişi Görseli</h2>
        <p className="text-sm text-ink-soft mb-6 leading-relaxed">Kendine Güven, En Güzel Kombinin afişinin arka plan görseli.</p>

        <input
          type="file"
          accept="image/*"
          onChange={handlePromoBannerChange}
          className="text-sm text-ink-soft file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-olive file:text-surface hover:file:bg-olive/90 transition-all cursor-pointer"
        />
        {promoBannerPreview && (
          <div
            className="mt-6 aspect-[21/9] w-full max-w-lg rounded-2xl bg-cover bg-center border border-border/60 shadow-inner"
            style={{ backgroundImage: `url(${promoBannerPreview})` }}
          />
        )}
      </section>

      {/* Actions */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-olive px-8 py-3.5 text-sm font-semibold text-white rounded-full hover:scale-95 transition-all shadow-md shadow-olive/20 disabled:opacity-50 disabled:hover:scale-100"
        >
          {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </div>
  );
}
