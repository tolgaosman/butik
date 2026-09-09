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
    <div className="flex h-full flex-col bg-surface-alt/50 lg:p-4">
      {/* Desktop Bento Grid / Mobile Main Image */}
      <div className={`relative hidden lg:grid gap-4 w-full h-full min-h-[600px] ${images.length > 2 ? "grid-cols-[2fr_1fr]" : "grid-cols-1"}`}>
        
        {/* Main large image */}
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-cream shadow-sm">
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
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain bg-transparent"
              />
            </motion.div>
          </AnimatePresence>
          
          {(isNew || discountPercent) && (
            <div className="absolute left-6 top-6 flex gap-2 z-10">
              {isNew && (
                <span className="rounded-full bg-ink px-4 py-1.5 text-xs font-bold tracking-wide text-white shadow-md">
                  Yeni
                </span>
              )}
              {discountPercent && (
                <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-wide text-ink shadow-md">
                  %{discountPercent} indirim
                </span>
              )}
            </div>
          )}
        </div>

        {/* Side smaller images (if more than 2) */}
        {images.length > 2 && (
          <div className="grid grid-rows-2 gap-4 h-full">
            {images.slice(1, 3).map((src, idx) => {
              const actualIndex = idx + 1;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveIndex(actualIndex)}
                  className={`group relative h-full w-full overflow-hidden rounded-[2rem] bg-cream shadow-sm ring-2 transition-all duration-500 ${
                    actualIndex === activeIndex ? "ring-olive/50 scale-[0.98]" : "ring-transparent hover:ring-ink/10"
                  }`}
                >
                  <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10 z-10" />
                  <Image src={src} alt="" fill sizes="25vw" className="object-contain bg-transparent transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-105" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-b-3xl bg-cream">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeIndex] ?? images[0]}
                alt={alt}
                fill
                priority
                sizes="100vw"
                className="object-contain bg-transparent"
              />
            </motion.div>
          </AnimatePresence>

          {(isNew || discountPercent) && (
            <div className="absolute left-4 top-4 flex gap-1.5 z-10">
              {isNew && (
                <span className="rounded-full bg-ink px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-white shadow-md">
                  Yeni
                </span>
              )}
              {discountPercent && (
                <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-ink shadow-md">
                  %{discountPercent} indirim
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails (Desktop bottom, Mobile bottom) */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide lg:px-0">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`${alt} — görsel ${i + 1}`}
              aria-current={i === activeIndex}
              className={`group relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-2xl transition-all duration-500 sm:w-20 ring-2 ${
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
