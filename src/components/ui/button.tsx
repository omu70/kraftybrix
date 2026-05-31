import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gold text-ink-900 shadow-glow hover:shadow-[0_0_60px_-6px_rgba(245,166,35,0.85)] hover:brightness-105",
        secondary:
          "glass text-cream hover:bg-white/10 hover:border-white/25",
        ghost: "text-white/80 hover:text-cream hover:bg-white/5",
        outline:
          "border border-white/20 text-cream hover:border-brand-gold hover:text-brand-gold",
        blue: "bg-brand-blue text-white shadow-glow-blue hover:brightness-110",
        white: "bg-cream text-ink-900 hover:bg-white",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
