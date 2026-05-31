import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "red" | "blue" | "gold";
  className?: string;
}) {
  const tones = {
    neutral: "bg-white/10 text-cream",
    red: "bg-brand-red text-white",
    blue: "bg-brand-blue text-white",
    gold: "bg-[#d4af37] text-black",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
