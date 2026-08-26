"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch, Search, SlidersHorizontal } from "lucide-react";
import type { Product, Category } from "@/lib/products";
import { hasGenderFilter } from "@/lib/nav";

import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { MotionStagger, MotionItem } from "@/components/ui/MotionReveal";

type Props = {
  title: string;
  products: Product[];
  subcategories?: Category[];
  category?: string;
  subcategory?: string;
};

function FilterRow({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="group flex w-full items-center justify-between py-2.5 text-left text-sm transition-colors hover:text-olive"
    >
      <span className={`font-medium ${active ? "text-olive" : "text-ink"}`}>{children}</span>
      <div
        className={`flex size-4 items-center justify-center rounded-sm border transition-colors ${
          active ? "border-olive bg-olive text-white" : "border-border bg-surface group-hover:border-olive"
        }`}
      >
        {active && (
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
}

export function ProductListing({ title, products, subcategories = [], category, subcategory }: Props) {
  const searchParams = useSearchParams();
  const subQuery = searchParams.get("sub");

  const [searchQuery, setSearchQuery] = useState("");
  const [showKadin, setShowKadin] = useState(false);
  const [showErkek, setShowErkek] = useState(false);
  const [showUnisex, setShowUnisex] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (subQuery) {
      const sub = subcategories.find((s) => s.id === subQuery);
      if (sub && !selectedSubcategories.includes(sub.id)) {
        setSelectedSubcategories((prev) => [...prev, sub.id]);
      }
    }
  }, [subQuery, subcategories]);

  const showGenderFilter = hasGenderFilter(category, subcategory);
  const hasFilters = showGenderFilter || subcategories.length > 0;
  const activeFilterCount =
    (showKadin ? 1 : 0) + (showErkek ? 1 : 0) + (showUnisex ? 1 : 0) + selectedSubcategories.length;

  useEffect(() => {
    if (!filterOpen) return;

    function onPointerDown(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setFilterOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [filterOpen]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesGender = true;
    if (showGenderFilter && (showKadin || showErkek || showUnisex)) {
      const gender = product.gender ?? "unisex";
      matchesGender =
        (showKadin && gender === "kadin") ||
        (showErkek && gender === "erkek") ||
        (showUnisex && gender === "unisex");
    }

    let matchesSubcategory = true;
    if (selectedSubcategories.length > 0) {
      matchesSubcategory = product.categories?.some((cat) => selectedSubcategories.includes(cat)) ?? false;
    }

    return matchesSearch && matchesGender && matchesSubcategory;
  });

  function toggleSubcategory(id: string) {
    setSelectedSubcategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function clearFilters() {
    setShowKadin(false);
    setShowErkek(false);
    setShowUnisex(false);
    setSelectedSubcategories([]);
  }

  return (
    <section className="container-site pb-8 pt-4 sm:pb-12 sm:pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-4xl font-medium text-ink sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-1 text-sm text-ink-soft">{filteredProducts.length} ürün bulundu</p>
        </div>

        {products.length > 0 && (
          <div className="flex items-center gap-3">
            {hasFilters && (
              <div className="relative" ref={filterRef}>
                <button
                  type="button"
                  aria-expanded={filterOpen}
                  onClick={() => setFilterOpen((v) => !v)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ease-[var(--ease-organic)] ${
                    filterOpen || activeFilterCount > 0
                      ? "border-olive text-olive"
                      : "border-border text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  <SlidersHorizontal size={16} aria-hidden />
                  Filtrele
                  {activeFilterCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-olive text-xs font-medium text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl sm:w-80">
                    <div className="flex flex-col divide-y divide-border">
                      {showGenderFilter && (
                        <div className="px-5 pt-4 pb-2">
                          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">Cinsiyet</p>
                          <div className="flex flex-col divide-y divide-border/50">
                            <FilterRow active={showKadin} onClick={() => setShowKadin((v) => !v)}>
                              Kadın
                            </FilterRow>
                            <FilterRow active={showErkek} onClick={() => setShowErkek((v) => !v)}>
                              Erkek
                            </FilterRow>
                            <FilterRow active={showUnisex} onClick={() => setShowUnisex((v) => !v)}>
                              Unisex
                            </FilterRow>
                          </div>
                        </div>
                      )}

                      {subcategories.length > 0 && (
                        <div className="px-5 pt-4 pb-2">
                          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">Kategori</p>
                          <div className="flex flex-col divide-y divide-border/50">
                            {subcategories.map((sub) => (
                              <FilterRow
                                key={sub.id}
                                active={selectedSubcategories.includes(sub.id)}
                                onClick={() => toggleSubcategory(sub.id)}
                              >
                                {sub.name}
                              </FilterRow>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {activeFilterCount > 0 && (
                      <div className="border-t border-border bg-cream/50 p-4">
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="w-full text-center text-xs font-medium text-ink-soft underline underline-offset-4 decoration-ink/30 transition-colors duration-200 hover:text-olive hover:decoration-olive"
                        >
                          Filtreleri Temizle
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="relative w-full min-w-[14rem] shrink-0 sm:w-64">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                size={18}
                aria-hidden
              />
              <input
                type="text"
                placeholder={`${title} içinde ara...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-surface py-2 pl-10 pr-4 text-sm text-ink outline-none transition-colors duration-200 ease-[var(--ease-organic)] focus:border-olive"
              />
            </div>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={PackageSearch}
            title={searchQuery ? "Aramanızla eşleşen ürün bulunamadı" : "Bu kategoride henüz ürün yok"}
            description={
              searchQuery
                ? "Lütfen farklı bir kelime ile tekrar deneyin."
                : "Bu kategoriye yakında yeni ürünler eklenecek. O zamana kadar diğer koleksiyonlarımıza göz atabilirsiniz."
            }
            ctaLabel={searchQuery ? "Aramayı Temizle" : "Tüm Ürünlere Dön"}
            ctaHref={searchQuery ? undefined : "/yeni-gelenler"}
            onCtaClick={searchQuery ? () => setSearchQuery("") : undefined}
          />
        </div>
      ) : (
        <MotionStagger
          key={`${showKadin}|${showErkek}|${showUnisex}|${selectedSubcategories.join(",")}`}
          className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
        >
          {filteredProducts.map((product) => (
            <MotionItem key={product.id}>
              <ProductCard product={product} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
            </MotionItem>
          ))}
        </MotionStagger>
      )}
    </section>
  );
}
