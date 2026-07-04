export default function Loading() {
  return (
    <div className="container-wide pt-28">
      <div className="border-b border-black/10 pb-8">
        <div className="h-4 w-32 animate-pulse rounded bg-black/[0.06]" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded bg-black/[0.06]" />
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-black/[0.05]" />
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-black/[0.06]" />
          ))}
        </div>
      </div>
    </div>
  );
}
