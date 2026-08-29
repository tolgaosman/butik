import { Tags } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { apiGetAuthed } from "@/lib/api";
import type { AdminCategory } from "@/lib/admin";
import { CategoriesTable } from "./CategoriesTable";

/**
 * /api/admin/* auth:sanctum + is_admin arkasında, bu yüzden apiGetAuthed —
 * ziyaretçinin oturum çerezini Laravel'e taşıyan tek sunucu tarafı yardımcı.
 * Bu uç nokta düz (flat) liste döner; ağaç görünümü istemci tarafında
 * parent_id'den kuruluyor (CategoriesTable).
 */
async function loadCategories(): Promise<AdminCategory[] | null> {
  try {
    return (await apiGetAuthed<AdminCategory[]>("/admin/categories")) ?? [];
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
