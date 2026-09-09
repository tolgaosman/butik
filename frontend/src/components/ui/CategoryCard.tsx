import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/products";

export function CategoryCard({ category, sizes, className = "" }: { category: Category; sizes: string, className?: string }) {
  return (
    <Link href={category.href} className={`group relative block h-full overflow-hidden rounded-[2rem] bg-cream shadow-sm ring-1 ring-ink/5 transition-all duration-700 ease-[var(--ease-organic)] hover:-translate-y-2 hover:shadow-2xl hover:shadow-olive/20 ${className}`}>
      <div className="absolute inset-0 bg-ink/5 animate-pulse" />
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-1000 ease-[var(--ease-organic)] group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent transition-opacity duration-700 ease-[var(--ease-organic)] group-hover:from-ink/90" />
      
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <div className="translate-y-2 transition-transform duration-500 ease-[var(--ease-organic)] group-hover:translate-y-0">
          <p className="font-serif text-2xl sm:text-3xl font-medium tracking-wide text-white drop-shadow-sm">{category.name}</p>
          <p className="mt-1 text-sm font-medium text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {category.itemCount > 0 ? `${category.itemCount} Ürün Keşfet` : "Koleksiyonu İncele"}
          </p>
        </div>
      </div>
    </Link>
  );
}
