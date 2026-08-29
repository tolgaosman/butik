import { apiGet } from "./api";
import { business } from "./business";

export type StoreSettings = {
  name: string;
  category: string;
  address: string;
  mapsQuery: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  bankName: string;
  bankAccountHolder: string;
  bankIban: string;
};

/**
 * business.ts's original hardcoded values, kept as the fallback when the
 * store_settings API is unreachable or an admin hasn't edited a field yet.
 */
const FALLBACK: StoreSettings = {
  name: business.name,
  category: business.category,
  address: business.address,
  mapsQuery: business.mapsQuery,
  phone: business.phone,
  email: business.email,
  instagram: business.instagram,
  facebook: business.facebook,
  bankName: "",
  bankAccountHolder: "",
  bankIban: "",
};

type StoreSettingsPayload = {
  store_name: string;
  store_category: string;
  store_address: string;
  store_maps_query: string;
  store_phone: string;
  store_email: string;
  store_instagram: string;
  store_facebook: string;
  bank_name: string;
  bank_account_holder: string;
  bank_iban: string;
};

function fromPayload(data: StoreSettingsPayload): StoreSettings {
  return {
    name: data.store_name || FALLBACK.name,
    category: data.store_category || FALLBACK.category,
    address: data.store_address || FALLBACK.address,
    mapsQuery: data.store_maps_query || FALLBACK.mapsQuery,
    phone: data.store_phone || FALLBACK.phone,
    email: data.store_email || FALLBACK.email,
    instagram: data.store_instagram || FALLBACK.instagram,
    facebook: data.store_facebook || FALLBACK.facebook,
    bankName: data.bank_name || "",
    bankAccountHolder: data.bank_account_holder || "",
    bankIban: data.bank_iban || "",
  };
}

/**
 * Backs the admin-editable store settings (name, contact info, social links,
 * bank transfer details) shown on Footer, LocationMap, the contact page and
 * checkout — replaces the hardcoded business.ts as the source of truth.
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const data = await apiGet<StoreSettingsPayload>("/settings/store", {
      next: { revalidate: 3600, tags: ["store-settings"] },
    });
    return data ? fromPayload(data) : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
