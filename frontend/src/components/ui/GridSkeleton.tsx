export function GridSkeleton({ background = "bg-white" }: { background?: string }) {
  return (
    <section className={`${background} py-12 sm:py-20`}>
      <div className="container-site">
        <div className="mb-8 h-8 w-56 animate-pulse rounded-sm bg-sand/40 sm:mb-10" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-sm bg-sand/40" />
          ))}
        </div>
      </div>
    </section>
  );
}

