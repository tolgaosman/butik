"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-hero-card]");
    const step = card ? card.offsetWidth + 16 : 240;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex min-w-full snap-x gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:justify-center sm:gap-6 sm:px-10 lg:px-16 [&::-webkit-scrollbar]:hidden"
      >
        {products.slice(0, 6).map((product, i) => (
          <motion.div
            key={product.id}
            data-hero-card
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 + i * 0.08 }}
            className="relative shrink-0 snap-start"
          >
            <Link
              href={`/urun/${product.id}`}
              className="group relative block h-72 w-52 overflow-hidden rounded-t-full bg-sand sm:h-96 sm:w-64"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 640px) 16rem, 13rem"
                className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-organic)] group-hover:scale-110"
              />
              {product.discountPercent && (
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-cream/95 px-3 py-1.5 text-center text-[0.65rem] font-medium leading-tight text-ink shadow-sm backdrop-blur-sm">
                  %{product.discountPercent} indirim
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Önceki ürünler"
        className="absolute left-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-cream shadow-lg backdrop-blur-sm transition-all duration-300 ease-[var(--ease-organic)] hover:bg-ink hover:scale-110 sm:flex"
      >
        <ArrowLeft size={17} />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Sonraki ürünler"
        className="absolute right-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-cream shadow-lg backdrop-blur-sm transition-all duration-300 ease-[var(--ease-organic)] hover:bg-ink hover:scale-110 sm:flex"
      >
        <ArrowRight size={17} />
      </button>
    </div>
  );
}
