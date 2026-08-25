import { Tags } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { apiGet } from "@/lib/api";
import type { Category } from "@/lib/products";
import { CategoriesTable } from "./CategoriesTable";

/**
 * Katalog verisi herkese açık, bu yüzden sunucudan doğrudan Laravel'e gidiyoruz
 * (apiGet). Yönetim listeleri her zaman taze olmalı — ISR yok, no-store.
 */
async function loadCategories(): Promise<Category[] | null> {
  try {
    return (await apiGet<Category[]>("/categories", { cache: "no-store" })) ?? [];
  } catch {
    return null;
  }
}

export default async function AdminCategoriesPage() {
  const categories = await loadCategories();

  return (
    <div className="space-y-6">
      {categories === null ? (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-2xl font-medium text-ink">Kategoriler</h1>
          </div>
          <p className="border border-border bg-surface p-6 text-sm text-ink-soft shadow-sm">
            Kategoriler şu anda yüklenemedi. Sayfayı yenileyip tekrar deneyin.
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-2xl font-medium text-ink">Kategoriler</h1>
          </div>
          <div className="border border-border bg-surface shadow-sm">
            <EmptyState
              icon={Tags}
              title="Henüz kategori yok"
              description="Kategoriler eklendiğinde burada ürün sayılarıyla birlikte listelenir."
            />
          </div>
        </div>
      ) : (
        <CategoriesTable categories={categories} />
      )}
    </div>
  );
}
