import { apiGetAuthed } from "@/lib/api";
import { HomepageSettingsClient, type AdminProductOption, type HomepageSettings } from "./HomepageSettingsClient";
import { Home } from "lucide-react";

const EMPTY_SETTINGS: HomepageSettings = {
  hero_product_ids: [],
  new_arrival_product_ids: [],
  promo_banner_url: "",
};

// /admin/products returns the raw Eloquent Product model (numeric id, slug,
// price_minor, ...) — not the public storefront Product shape (id === slug).
async function loadProducts(): Promise<AdminProductOption[]> {
  try {
    return (await apiGetAuthed<AdminProductOption[]>("/admin/products")) ?? [];
  } catch {
    return [];
  }
}

async function loadSettings(): Promise<HomepageSettings> {
  try {
    return (await apiGetAuthed<HomepageSettings>("/admin/settings/homepage")) ?? EMPTY_SETTINGS;
  } catch {
    return EMPTY_SETTINGS;
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
