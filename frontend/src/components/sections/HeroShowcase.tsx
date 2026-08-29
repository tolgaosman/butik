"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } },
};

function ArchCard({
  product,
  captionSize,
  sizes,
  className = "",
}: {
  product: Product;
  captionSize?: "lg" | "sm";
  sizes: string;
  className?: string;
}) {
  return (
    <motion.div variants={item} className={`relative aspect-[4/5] w-full lg:aspect-auto lg:h-full ${className}`}>
      <Link
        href={`/urun/${product.id}`}
        className="group relative block h-full w-full overflow-hidden rounded-t-full bg-sand shadow-sm ring-1 ring-ink/[0.06] transition-all duration-500 ease-[var(--ease-organic)] hover:-translate-y-1 hover:shadow-2xl hover:shadow-ink/20"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-[1.04]"
        />

        {product.discountPercent && (
          <span className="absolute right-3 top-3 whitespace-nowrap rounded-full bg-cream/95 px-2.5 py-1 text-[0.65rem] font-medium leading-tight text-ink shadow-sm backdrop-blur-sm">
            %{product.discountPercent}
          </span>
        )}

        {captionSize === "lg" && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent px-5 pb-5 pt-10 text-left">
            <p className="font-serif text-lg font-medium text-white sm:text-xl">{product.name}</p>
            <p className="mt-0.5 text-sm text-white/85">{formatPrice(product.price)}</p>
          </div>
        )}

        {captionSize === "sm" && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent px-3.5 pb-3.5 pt-8 text-left">
            <p className="truncate font-serif text-sm font-medium text-white">{product.name}</p>
            <p className="mt-0.5 text-xs text-white/85">{formatPrice(product.price)}</p>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export function HeroShowcase({ products }: { products: Product[] }) {
  const shown = products.slice(0, 3);
  if (shown.length === 0) return null;

  const [featured, ...rest] = shown;

  return (
    <motion.div
      className="flex flex-col gap-4 sm:gap-5 lg:h-[clamp(24rem,40vw,34rem)] lg:flex-row"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <ArchCard
        product={featured}
        captionSize="lg"
        className={rest.length > 0 ? "lg:w-[58%]" : ""}
        sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 90vw"
      />

      {rest.length > 0 && (
        <div className="flex flex-1 gap-4 sm:gap-5 lg:flex-col">
          {rest.map((product) => (
            <ArchCard
              key={product.id}
              product={product}
              captionSize="sm"
              className="flex-1"
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
