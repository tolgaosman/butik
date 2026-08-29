import type { Metadata } from "next";
import { Suspense } from "react";
import { searchProducts } from "@/lib/products";
import { ProductListing } from "@/components/sections/ProductListing";

export const metadata: Metadata = {
  title: "Arama Sonuçları | Sevgi Butik",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = await searchProducts(q);

  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ProductListing title={q ? `"${q}" için sonuçlar` : "Arama"} products={products} />
    </Suspense>
  );
}
