import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/products";

export function CategoryCard({ category, sizes }: { category: Category; sizes: string }) {
  return (
    <Link href={category.href} className="group relative block h-full overflow-hidden bg-sand">
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent transition-opacity duration-500 group-hover:from-ink/80" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="font-serif text-xl font-medium tracking-wide text-white sm:text-2xl">{category.name}</p>
        <p className="mt-0.5 text-xs text-white/75">
          {category.itemCount > 0 ? `${category.itemCount}+ Ürün` : ""}
        </p>
      </div>
    </Link>
  );
}
