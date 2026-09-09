"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";

const ease = [0.32, 0.72, 0, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease } },
};

function BentoCard({
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
    <motion.div variants={itemVariants} className={`relative w-full h-full min-h-[200px] lg:min-h-0 ${className}`}>
      <Link
        href={`/urun/${product.id}`}
        className="group relative block h-full w-full overflow-hidden rounded-3xl bg-cream shadow-sm ring-1 ring-ink/5 transition-all duration-700 ease-[var(--ease-organic)] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-olive/20"
      >
        <div className="absolute inset-0 bg-ink/5 animate-pulse" />
        
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-1000 ease-[var(--ease-organic)] group-hover:scale-[1.05]"
        />

        {product.discountPercent && (
          <span className="absolute right-4 top-4 z-20 whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-[0.7rem] font-medium leading-tight text-ink shadow-sm backdrop-blur-md">
            %{product.discountPercent}
          </span>
        )}

        {captionSize === "lg" && (
          <div className="absolute bottom-5 left-5 right-5 z-10 rounded-[1.25rem] bg-ink/40 p-5 text-left backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:bg-ink/60 group-hover:border-white/40">
            <p className="font-serif text-[1.25rem] font-medium text-white tracking-wide">{product.name}</p>
            <p className="mt-1 text-[1rem] text-white/90">{formatPrice(product.price)}</p>
          </div>
        )}

        {captionSize === "sm" && (
          <div className="absolute bottom-3 left-3 right-3 z-10 rounded-2xl bg-ink/40 p-3.5 text-left backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:bg-ink/60 group-hover:border-white/40">
            <p className="truncate font-serif text-[0.85rem] font-medium text-white">{product.name}</p>
            <p className="mt-0.5 text-[0.8rem] text-white/90">{formatPrice(product.price)}</p>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export function HeroShowcase({ products = [] }: { products?: Product[] }) {
  const safeProducts = Array.isArray(products) ? products : [];
  const [shown, setShown] = useState<Product[]>(safeProducts.slice(0, 5));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (safeProducts.length === 0) return;
    // Shuffle the products array and pick the first 5
    const shuffled = [...safeProducts].sort(() => 0.5 - Math.random());
    setShown(shuffled.slice(0, 5));
  }, [safeProducts]);

  if (!isMounted || shown.length === 0) {
    // Return an empty state with the same height to avoid layout shift during SSR/hydration
    return <div className="h-[500px] sm:h-[600px] lg:h-[calc(100vh-12rem)] min-h-[400px] max-h-[850px] w-full" />;
  }

  const [featured, ...rest] = shown;

  return (
    <motion.div
      key={featured.id} // force re-animation when shuffled content is set
      className="grid h-[560px] sm:h-[640px] w-full grid-cols-2 grid-rows-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 lg:h-[calc(100vh-12rem)] lg:min-h-[400px] lg:max-h-[850px] lg:grid-cols-4 lg:grid-rows-2"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <BentoCard
        product={featured}
        captionSize="lg"
        className="col-span-2 row-span-1 lg:row-span-2"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />

      {rest.map((product) => (
        <BentoCard
          key={product.id}
          product={product}
          captionSize="sm"
          className="col-span-1 row-span-1"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
      ))}
    </motion.div>
  );
}
