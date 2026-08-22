import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/products";

export function CategoryCard({ category, sizes }: { category: Category; sizes: string }) {
  return (
    <Link
      href={category.href}
      className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-sand"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 transition-opacity duration-500 group-hover:from-ink/80" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-display text-xl font-medium tracking-wide text-white">{category.name}</p>
        <p className="text-xs text-white/80">
          {category.itemCount > 0 ? `${category.itemCount}+ Ürün` : "%60'a Varan İndirim"}
        </p>
      </div>
    </Link>
  );
}
