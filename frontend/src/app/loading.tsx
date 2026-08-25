export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="bg-cream pb-10 sm:pb-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 pb-8 pt-16 text-center sm:px-10 sm:pt-24">
          <div className="h-16 w-full max-w-xl rounded-sm bg-sand/60" />
          <div className="h-4 w-72 rounded-sm bg-sand/60" />
          <div className="h-12 w-48 rounded-full bg-sand/60" />
        </div>
        <div className="flex gap-5 overflow-hidden px-2.5 pb-2 sm:gap-6 sm:px-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-72 w-52 shrink-0 rounded-t-full bg-sand/60 sm:h-96 sm:w-64" />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8 h-8 w-56 rounded-sm bg-sand/40" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="aspect-[3/4] rounded-sm bg-sand/40" />
          ))}
        </div>
      </div>
    </div>
  );
}


