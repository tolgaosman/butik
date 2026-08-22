import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllProductIds, getProductDetail, getRelatedProducts } from "@/lib/products";
import { getProductDescription } from "@/lib/descriptions";
import { formatPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StarRating } from "@/components/ui/StarRating";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { ProductOptions } from "@/components/product/ProductOptions";

export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductDetail(id);
  if (!product) return {};
  return {
    title: `${product.name} | Sevgi Butik`,
    description: product.description || getProductDescription(product),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductDetail(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: product.name }]} />

      <div className="mt-5 grid grid-cols-1 gap-6 sm:mt-6 sm:gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-sand">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-4xl lg:text-5xl">{product.name}</h1>
          <div className="mt-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-2xl font-medium text-olive sm:text-3xl">
            {formatPrice(product.price)}
            {product.originalPrice && (
              <span className="text-lg font-normal text-ink-soft line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discountPercent && (
              <span className="rounded-full bg-olive/10 px-2.5 py-0.5 text-xs font-medium text-olive">
                %{product.discountPercent} indirim
              </span>
            )}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
            {product.description || getProductDescription(product)}
          </p>

          <div className="mt-8">
            <ProductOptions productSlug={product.id} variants={product.variants} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12 sm:mt-20">
          <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl lg:text-3xl">Benzer Ürünler</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard product={p} sizes="(min-width: 640px) 25vw, 50vw" />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
