import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { primaryNav } from "@/lib/nav";
import { getProductsByCategory, getCategories } from "@/lib/products";
import { ProductListing } from "@/components/sections/ProductListing";
import { Suspense } from "react";

export async function generateStaticParams() {
  return primaryNav.map((item) => ({ category: item.href.slice(1) }));
}

function findCategory(category: string) {
  return primaryNav.find((item) => item.href === `/${category}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const navItem = findCategory(category);
  if (!navItem) return {};
  return {
    title: `${navItem.label} | Sevgi Butik`,
    description: `Sevgi Butik'te ${navItem.label.toLocaleLowerCase("tr-TR")} koleksiyonunu keşfedin.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const navItem = findCategory(category);
  if (!navItem) notFound();

  const [products, categories] = await Promise.all([
    getProductsByCategory(category),
    getCategories(),
  ]);

  const currentCategory = categories.find((c) => c.href === `/${category}`);
  const subcategories = currentCategory?.subcategories || [];

  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ProductListing
        title={navItem.label}
        products={products}
        subcategories={subcategories}
        category={category}
      />
    </Suspense>
  );
}
