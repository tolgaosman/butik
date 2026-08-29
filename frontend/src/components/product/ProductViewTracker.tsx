"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/analytics";

/** Fires once per product-page visit — the ViewContent/view_item signal ad platforms need to build audiences from. */
export function ProductViewTracker({ id, name, price }: { id: string; name: string; price: number }) {
  useEffect(() => {
    trackViewContent({ id, name, price });
  }, [id, name, price]);

  return null;
}
