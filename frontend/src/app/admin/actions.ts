"use server";

import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Mağaza arayüzündeki verileri yenilemek için kullanılır.
 * Admin ekranında yapılan değişikliklerin anında siteye yansımasını sağlar.
 */
export async function revalidateStore() {
  revalidatePath("/", "layout"); // Revalidate entire app
  
  // If we used specific fetch tags in api.ts, we could also do:
  // revalidateTag("products");
  // revalidateTag("categories");
}
