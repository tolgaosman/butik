import { LayoutGrid } from "lucide-react";
import { getCategories } from "@/lib/products";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { MotionStagger, MotionItem } from "@/components/ui/MotionReveal";

export async function CategoryGrid() {
  const categories = await getCategories();

  return (
    <section className="container-site py-12 sm:py-20">
      <SectionHeader eyebrow="KATEGORİYE GÖRE ALIŞVERİŞ" title="Aradığınızı Bulun" />

      {categories.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Kategori bulunamadı"
          description="Şu anda gösterilecek kategori bulunmuyor, yakında burada olacak."
        />
      ) : (
        <MotionStagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <MotionItem key={category.id} className="aspect-[3/4]">
              <CategoryCard
                category={category}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              />
            </MotionItem>
          ))}
        </MotionStagger>
      )}
    </section>
  );
}
