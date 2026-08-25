import { Skeleton } from "@/components/ui/Skeleton";

export function ProductListingSkeleton() {
  return (
    <section className="container-site py-8 sm:py-12">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-3 h-10 w-64 sm:h-12 sm:w-80" />
      <Skeleton className="mt-2 h-4 w-24" />

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[3/4]" />
            <Skeleton className="mt-3.5 h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/3" />
          </div>
        ))}
      </div>
    </section>
  );
}
