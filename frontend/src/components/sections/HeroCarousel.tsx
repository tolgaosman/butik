"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

function Card({ product }: { product: Product }) {
  return (
    <div className="relative z-0 shrink-0 px-[clamp(0.4rem,1vw,0.75rem)] py-[clamp(1.5rem,min(6vw,3vh),2.5rem)] transition-[z-index] hover:z-20">
      <Link
        href={`/urun/${product.id}`}
        draggable={false}
        className="group relative block aspect-[2/3] w-[clamp(10rem,min(22vw,33vh),20rem)] overflow-hidden rounded-t-full bg-sand shadow-sm transition-all duration-1000 ease-out hover:shadow-2xl hover:shadow-ink/20"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          draggable={false}
          sizes="(min-width: 1280px) 20rem, (min-width: 640px) 22vw, 40vw"
          className="object-cover"
        />
        {product.discountPercent && (
          <span className="absolute inset-x-0 bottom-4 flex justify-center">
            <span className="whitespace-nowrap rounded-full bg-cream/95 px-3 py-1.5 text-center text-[0.65rem] font-medium leading-tight text-ink shadow-sm backdrop-blur-sm">
              %{product.discountPercent} indirim
            </span>
          </span>
        )}
      </Link>
    </div>
  );
}

export function HeroCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  const sets = [products, products, products, products];

  return (
    <div className="relative w-full">
      {/* Outer wrapper: clip-x only, allow vertical overflow for hover scale */}
      <div
        className="group relative w-full overflow-x-clip overflow-y-visible"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <div className="flex w-fit">
          <div className="flex w-fit animate-hero-marquee group-hover:[animation-duration:170s] active:[animation-duration:170s]">
            {sets.map((set, si) =>
              set.map((product) => (
                <Card key={`${si}-${product.id}`} product={product} />
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
