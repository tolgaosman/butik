import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Truck, RotateCcw, type LucideIcon } from "lucide-react";
import { getAllProductIds, getProductDetail, getRelatedProducts } from "@/lib/products";
import { getProductDescription } from "@/lib/descriptions";
import { formatPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/ui/ProductCard";
import { MotionStagger, MotionItem, MotionReveal } from "@/components/ui/MotionReveal";
import { ProductOptions } from "@/components/product/ProductOptions";

function InfoTile({
  icon: Icon,
  tint,
  title,
  description,
}: {
  icon: LucideIcon;
  tint: string;
  title: string;
  description: string;
}) {
  return (
    <div className={`flex items-start gap-3.5 rounded-2xl p-5 ${tint}`}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-olive">
        <Icon className="size-4" aria-hidden />
      </span>
      <div>
        <p className="font-serif text-sm font-semibold text-ink">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">{description}</p>
      </div>
    </div>
  );
}

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

  const [product, related] = await Promise.all([
    getProductDetail(id),
    getRelatedProducts(id),
  ]);

  if (!product) notFound();

  return (
    <div className="container-site py-8 sm:py-12">
      <Breadcrumbs items={[{ label: product.name }]} />

      <MotionReveal className="mt-5 overflow-hidden rounded-3xl border border-border bg-surface sm:mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[4/5] bg-sand">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            {(product.isNew || product.discountPercent) && (
              <div className="absolute left-4 top-4 flex gap-1.5 sm:left-6 sm:top-6">
                {product.isNew && (
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium tracking-wide text-white">
                    Yeni
                  </span>
                )}
                {product.discountPercent && (
                  <span className="rounded-full bg-olive px-3 py-1 text-xs font-medium tracking-wide text-white">
                    %{product.discountPercent} indirim
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <h1 className="font-serif text-3xl font-medium text-ink sm:text-4xl lg:text-5xl">{product.name}</h1>

            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-2xl">
              <span className={product.originalPrice ? "font-medium text-olive" : "text-ink"}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg font-normal text-ink-soft line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
              {product.description || getProductDescription(product)}
            </p>

            <div className="mt-8">
              <ProductOptions productSlug={product.id} productName={product.name} variants={product.variants} />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoTile
                icon={Truck}
                tint="bg-cream"
                title="Ücretsiz Kargo"
                description="2.500 TL üzeri siparişlerde kargo bedava."
              />
              <InfoTile
                icon={RotateCcw}
                tint="bg-sand"
                title="Kolay İade"
                description="14 gün içinde koşulsuz iade imkanı."
              />
            </div>
          </div>
        </div>
      </MotionReveal>

      {related.length > 0 && (
        <section className="mt-12 sm:mt-20">
          <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">Benzer Ürünler</h2>
          <MotionStagger className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {related.map((p) => (
              <MotionItem key={p.id}>
                <ProductCard product={p} sizes="(min-width: 640px) 25vw, 50vw" />
              </MotionItem>
            ))}
          </MotionStagger>
        </section>
      )}
    </div>
  );
}
