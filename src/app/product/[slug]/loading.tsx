export default function Loading() {
  return (
    <div className="pt-28">
      <div className="container-wide">
        <div className="h-4 w-56 animate-pulse rounded bg-black/[0.06]" />
        <div className="mt-6 grid gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-black/[0.06]" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-black/[0.06]" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-black/[0.06]" />
            <div className="h-28 w-full animate-pulse rounded-2xl bg-black/[0.05]" />
            <div className="h-12 w-full animate-pulse rounded-full bg-black/[0.06]" />
            <div className="h-12 w-full animate-pulse rounded-full bg-black/[0.05]" />
          </div>
        </div>
      </div>
    </div>
  );
}
