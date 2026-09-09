"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  images: string[];
  alt: string;
  isNew?: boolean;
  discountPercent?: number;
};

const ease = [0.32, 0.72, 0, 1] as const;

export function ProductGallery({ images, alt, isNew, discountPercent }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex h-full w-full flex-col bg-surface-alt/50 lg:bg-transparent lg:p-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] w-full max-w-[550px] mx-auto overflow-hidden sm:rounded-[2rem] bg-cream shadow-sm">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex] ?? images[0]}
              alt={alt}
              fill
              priority
              sizes="(min-width: 1024px) 550px, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        {(isNew || discountPercent) && (
          <div className="absolute left-4 top-4 sm:left-6 sm:top-6 flex gap-2 z-10">
            {isNew && (
              <span className="rounded-full bg-ink px-3 py-1 sm:px-4 sm:py-1.5 text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest text-white shadow-md">
                Yeni
              </span>
            )}
            {discountPercent && (
              <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-1.5 text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest text-ink shadow-md">
                %{discountPercent} indirim
              </span>
            )}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide lg:justify-center lg:px-0">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`${alt} - görsel ${i + 1}`}
              aria-current={i === activeIndex}
              className={`group relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-xl transition-all duration-500 sm:w-20 ring-2 ${
                i === activeIndex ? "ring-olive scale-95 shadow-md" : "ring-transparent hover:ring-ink/20"
              }`}
            >
              <div className={`absolute inset-0 z-10 transition-colors duration-300 ${i === activeIndex ? "bg-transparent" : "bg-white/20 group-hover:bg-transparent"}`} />
              <Image src={src} alt="" fill sizes="80px" className="object-cover transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-110" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
