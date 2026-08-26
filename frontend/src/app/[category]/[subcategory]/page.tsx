import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { primaryNav } from "@/lib/nav";
import { getProductsByCategory } from "@/lib/products";
import { ProductListing } from "@/components/sections/ProductListing";

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = [];

  primaryNav.forEach((item) => {
    item.columns.forEach((column) => {
      column.items.forEach((sub) => {
        const parts = sub.href.split("/");
        if (parts.length > 2 && parts[2]) {
          params.push({
            category: item.href.slice(1).split("?")[0],
            subcategory: parts[2].split("?")[0],
          });
        }
      });
    });
  });

  return params;
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
