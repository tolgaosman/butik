import { getCategories } from "@/lib/products";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

export async function CategoryGrid() {
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-6 flex items-end justify-between sm:mb-8">
        <div>
          <p className="text-xs font-medium tracking-[0.25em] text-olive">KATEGORİYE GÖRE ALIŞVERİŞ</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">Aradığınızı Bulun</h2>
        </div>
        <Link
          href="/kategoriler"
          className="hidden text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-olive sm:block"
        >
          Tüm Kategoriler →
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-ink-soft">Şu anda gösterilecek kategori bulunmuyor.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={i * 60}>
              <CategoryCard category={category} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
