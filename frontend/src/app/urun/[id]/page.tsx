import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RotateCcw, Ruler } from "lucide-react";
import { getAllProductIds, getCategories, getProductDetail, getRelatedProducts, type Category } from "@/lib/products";
import { getProductDescription } from "@/lib/descriptions";
import { getProductReviews } from "@/lib/reviews";
import { formatPrice } from "@/lib/format";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/ui/ProductCard";
import { StarRating } from "@/components/ui/StarRating";
import { MotionStagger, MotionItem, MotionReveal } from "@/components/ui/MotionReveal";
import { ProductOptions } from "@/components/product/ProductOptions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductFavoriteButton } from "@/components/product/ProductFavoriteButton";
import { FreeShippingInfoTile } from "@/components/product/FreeShippingInfoTile";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductViewTracker } from "@/components/product/ProductViewTracker";

function findCategory(categories: Category[], slug: string): Category | undefined {
  for (const category of categories) {
    if (category.id === slug) return category;
    const match = category.subcategories?.find((sub) => sub.id === slug);
    if (match) return match;
  }
  return undefined;
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
    openGraph: {
      title: product.name,
      description: product.description || getProductDescription(product),
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, related, categories] = await Promise.all([
    getProductDetail(id),
    getRelatedProducts(id),
    getCategories(),
  ]);

  if (!product) notFound();

  const reviewsPage = await getProductReviews(id);

  const primaryCategorySlug = product.categories?.[0];
  const primaryCategory = primaryCategorySlug ? findCategory(categories, primaryCategorySlug) : undefined;

  const breadcrumbItems: BreadcrumbItem[] = primaryCategory
    ? [{ label: primaryCategory.name, href: primaryCategory.href }, { label: product.name }]
    : [{ label: product.name }];

  // Gallery images duplicate the hero image at seed time (position 0 mirrors
  // product.image) — dedupe so the thumbnail strip doesn't show it twice.
  const galleryImages = Array.from(new Set([product.image, ...product.images.map((img) => img.url)]));

  return (
    <div className="container-site py-8 sm:py-12">
      <ProductViewTracker id={product.id} name={product.name} price={product.price} />
      <Breadcrumbs items={breadcrumbItems} />

      <MotionReveal className="mt-5 overflow-hidden rounded-3xl border border-border bg-surface sm:mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start">
          <ProductGallery
            images={galleryImages}
            alt={product.name}
            isNew={product.isNew}
            discountPercent={product.discountPercent}
          />

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-serif text-3xl font-medium text-ink sm:text-4xl lg:text-5xl">{product.name}</h1>
              <ProductFavoriteButton product={product} />
            </div>

            {product.reviewCount > 0 && (
              <div className="mt-3">
                <StarRating rating={product.rating} reviewCount={product.reviewCount} />
              </div>
            )}

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
              <ProductOptions
                productSlug={product.id}
                productName={product.name}
                productPrice={product.price}
                variants={product.variants}
              />
            </div>

            {product.variants.some((v) => v.size !== null) && (
              <Link
                href="/beden-rehberi"
                className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-ink-soft underline underline-offset-4 decoration-ink/30 transition-colors duration-200 hover:text-olive hover:decoration-olive"
              >
                <Ruler size={13} aria-hidden />
                Beden Rehberi
              </Link>
            )}

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FreeShippingInfoTile />
              <div className="flex items-start gap-3.5 rounded-2xl bg-sand p-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-olive">
                  <RotateCcw className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-serif text-sm font-semibold text-ink">Kolay İade</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">14 gün içinde koşulsuz iade imkanı.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionReveal>

      <ProductReviews productSlug={product.id} initialReviews={reviewsPage.data} initialMeta={reviewsPage.meta} />

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
