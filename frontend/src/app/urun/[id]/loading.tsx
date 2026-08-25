import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-site py-8 sm:py-12">
      <Skeleton className="h-3 w-32" />

      <div className="mt-5 grid grid-cols-1 gap-6 sm:mt-6 sm:gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-[3/4]" />

        <div>
          <Skeleton className="h-6 w-16" />
          <Skeleton className="mt-3 h-10 w-3/4 sm:h-12" />
          <Skeleton className="mt-3 h-4 w-28" />
          <Skeleton className="mt-4 h-8 w-32" />
          <div className="mt-5 max-w-md space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <Skeleton className="h-4 w-14" />
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} className="h-11 w-11" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-10" />
              <Skeleton className="mt-2 h-11 w-32 rounded-full" />
            </div>
            <Skeleton className="h-12 w-full sm:w-48" />
          </div>
        </div>
      </div>

      <section className="mt-12 sm:mt-20">
        <Skeleton className="h-8 w-48" />
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[3/4]" />
              <Skeleton className="mt-3.5 h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/3" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
