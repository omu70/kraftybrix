export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex items-center gap-3 text-white/60">
        <span className="h-3 w-3 animate-bounce rounded-sm bg-brand-red [animation-delay:-0.2s]" />
        <span className="h-3 w-3 animate-bounce rounded-sm bg-white [animation-delay:-0.1s]" />
        <span className="h-3 w-3 animate-bounce rounded-sm bg-brand-blue" />
      </div>
    </div>
  );
}
