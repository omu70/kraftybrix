import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-red text-white shadow-glow hover:shadow-[0_0_60px_-6px_rgba(255,45,32,0.8)] hover:brightness-110",
        secondary:
          "glass text-zinc-900 hover:bg-black/[0.06] hover:border-black/25",
        ghost: "text-black/80 hover:text-zinc-900 hover:bg-black/[0.04]",
        outline:
          "border border-black/20 text-zinc-900 hover:border-brand-red hover:text-brand-red",
        blue: "bg-brand-blue text-white shadow-glow-blue hover:brightness-110",
        white: "bg-zinc-900 text-white hover:bg-zinc-800",
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
