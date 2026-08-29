import type { Metadata } from "next";
import { Suspense } from "react";
import { getNewArrivals } from "@/lib/products";
import { ProductListing } from "@/components/sections/ProductListing";

export const metadata: Metadata = {
  title: "Yeni Gelenler | Sevgi Butik",
  description: "Sevgi Butik'e yeni eklenen ürünleri keşfedin.",
};

export default async function NewArrivalsPage() {
  const products = await getNewArrivals(100);

  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ProductListing title="Yeni Gelenler" products={products} />
    </Suspense>
  );
}
