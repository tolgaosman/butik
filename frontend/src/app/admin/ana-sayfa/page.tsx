import { apiGetAuthed } from "@/lib/api";
import { HomepageSettingsClient } from "./HomepageSettingsClient";
import { Home } from "lucide-react";

// /admin/products returns the raw Eloquent Product model (numeric id, slug,
// price_minor, ...) — not the public storefront Product shape (id === slug).
async function loadProducts(): Promise<any[]> {
  try {
    return (await apiGetAuthed<any[]>("/admin/products")) ?? [];
  } catch {
    return [];
  }
}

async function loadSettings(): Promise<any> {
  try {
    return (await apiGetAuthed<any>("/admin/settings/homepage")) ?? {};
  } catch {
    return {};
  }
}

export default async function AdminHomepagePage() {
  const [products, settings] = await Promise.all([loadProducts(), loadSettings()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-ink flex items-center gap-2">
          <Home className="w-6 h-6 text-olive" /> Ana Sayfa Ayarları
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Müşterilerinizin göreceği ana sayfa içeriğini buradan düzenleyebilirsiniz.</p>
      </div>

      <HomepageSettingsClient products={products} settings={settings} />
    </div>
  );
}
