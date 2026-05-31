import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  count,
  size = 14,
  className,
}: {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <Star
              key={i}
              width={size}
              height={size}
              className={filled ? "fill-brand-red text-brand-red" : "text-black/25"}
            />
          );
        })}
      </div>
      <span className="text-xs font-medium text-cream">{rating.toFixed(1)}</span>
      {count != null && (
        <span className="text-xs text-muted">({count.toLocaleString("en-IN")})</span>
      )}
    </div>
  );
}
