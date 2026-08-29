"use server";

import { revalidateTag } from "next/cache";

/**
 * Mağaza arayüzündeki verileri yenilemek için kullanılır.
 * Admin ekranında yapılan değişikliklerin anında siteye yansımasını sağlar.
 */
export async function revalidateStore() {
  revalidateTag("products");
  revalidateTag("categories");
  revalidateTag("homepage");
  revalidateTag("store-settings");
}
