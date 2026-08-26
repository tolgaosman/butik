import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { primaryNav } from "@/lib/nav";
import { getProductsByCategory } from "@/lib/products";
import { ProductListing } from "@/components/sections/ProductListing";

export async function generateStaticParams() {
  return primaryNav.flatMap((item) =>
    item.columns.flatMap((column) =>
      column.items.map((sub) => ({
        category: item.href.slice(1),
        subcategory: sub.href.split("/")[2],
      })),
    ),
  );
}

function findSubcategory(category: string, subcategory: string) {
  const navItem = primaryNav.find((item) => item.href === `/${category}`);
  if (!navItem) return null;

  for (const column of navItem.columns) {
    const sub = column.items.find((item) => item.href === `/${category}/${subcategory}`);
    if (sub) return { navItem, sub };
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { category, subcategory } = await params;
  const match = findSubcategory(category, subcategory);
  if (!match) return {};
  return {
    title: `${match.sub.label} | Sevgi Butik`,
    description: `Sevgi Butik'te ${match.sub.label.toLocaleLowerCase("tr-TR")} seçkisini keşfedin.`,
  };
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  const match = findSubcategory(category, subcategory);
  if (!match) notFound();

  const products = await getProductsByCategory(category, subcategory);

  return (
    <ProductListing
      title={match.sub.label}
      products={products}
      category={category}
      subcategory={subcategory}
    />
  );
}
