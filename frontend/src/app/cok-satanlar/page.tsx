import type { Metadata } from "next";
import { Suspense } from "react";
import { getBestSellers } from "@/lib/products";
import { ProductListing } from "@/components/sections/ProductListing";

export const metadata: Metadata = {
  title: "Çok Satanlar | Sevgi Butik",
  description: "Sevgi Butik'te en çok tercih edilen ürünler.",
};

export default async function BestSellersPage() {
  const products = await getBestSellers(40);

  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ProductListing title="Çok Satanlar" products={products} />
    </Suspense>
  );
}
