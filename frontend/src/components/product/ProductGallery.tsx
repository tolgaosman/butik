"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt: string;
  isNew?: boolean;
  discountPercent?: number;
};

export function ProductGallery({ images, alt, isNew, discountPercent }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="bg-sand">
      <div className="relative aspect-[4/5]">
        <Image
          src={active}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        {(isNew || discountPercent) && (
          <div className="absolute left-4 top-4 flex gap-1.5 sm:left-6 sm:top-6">
            {isNew && (
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium tracking-wide text-white">
                Yeni
              </span>
            )}
            {discountPercent && (
              <span className="rounded-full bg-olive px-3 py-1 text-xs font-medium tracking-wide text-white">
                %{discountPercent} indirim
              </span>
            )}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3 sm:p-4">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`${alt} — görsel ${i + 1}`}
              aria-current={i === activeIndex}
              className={`relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-lg border transition-colors duration-200 sm:w-16 ${
                i === activeIndex ? "border-olive" : "border-border/70 hover:border-ink-soft"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
