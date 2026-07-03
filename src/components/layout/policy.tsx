export function PolicyPage({
  title,
  updated = "July 2026",
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-wide pt-32 pb-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="h-display text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-black/45">Last updated {updated}</p>
        <div className="prose-kb mt-8 space-y-5 text-black/70 leading-relaxed [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-cream [&_a]:text-brand-red">
          {children}
        </div>
      </div>
    </div>
  );
}
