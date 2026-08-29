import { apiGetAuthed } from "@/lib/api";
import type { AdminProduct, AdminCategory } from "@/lib/admin";
import { ProductsTable } from "./ProductsTable";

/**
 * /api/admin/* auth:sanctum + is_admin arkasında, bu yüzden apiGetAuthed —
 * ziyaretçinin oturum çerezini Laravel'e taşıyan tek sunucu tarafı yardımcı.
 * Yetkisiz istek 401/403 döner; sayfa bunu "yüklenemedi" olarak gösterir.
 */
async function loadProducts(): Promise<AdminProduct[] | null> {
  try {
    return (await apiGetAuthed<AdminProduct[]>("/admin/products")) ?? [];
  } catch {
    return null;
  }
}

async function loadCategories(): Promise<AdminCategory[]> {
  try {
    return (await apiGetAuthed<AdminCategory[]>("/admin/categories")) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([loadProducts(), loadCategories()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-ink">Ürünler</h1>
        <p className="mt-1 text-sm text-ink-soft">Mağazada yayında olan ürünler.</p>
      </div>

      {products === null ? (
        <p className="border border-border bg-surface p-6 text-sm text-ink-soft shadow-sm">
          Ürünler şu anda yüklenemedi. Sayfayı yenileyip tekrar deneyin.
        </p>
      ) : (
        <ProductsTable products={products} categories={categories} />
      )}
    </div>
  );
}
