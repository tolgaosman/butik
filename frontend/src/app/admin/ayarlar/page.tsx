import { getStoreSettings } from "@/lib/settings";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl font-medium text-ink">Mağaza Ayarları</h1>
        <p className="mt-1 text-sm text-ink-soft">Mağazanızın temel bilgilerini, iletişim detaylarını ve havale bilgilerini güncelleyin.</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
