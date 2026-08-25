export function GridSkeleton({ background = "bg-surface" }: { background?: string }) {
  return (
    <section className={`${background} py-12 sm:py-20`}>
      <div className="container-site">
        <div className="mb-10 h-9 w-56 animate-pulse bg-sand/40 sm:mb-14" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] animate-pulse bg-sand/40" />
              <div className="mt-3 h-4 w-3/4 animate-pulse bg-sand/40" />
              <div className="mt-2 h-4 w-1/3 animate-pulse bg-sand/40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
