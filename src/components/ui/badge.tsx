import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-wider",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-white dark:bg-white dark:text-zinc-950 shadow hover:bg-slate-800 dark:hover:bg-zinc-200",
        secondary:
          "border-transparent bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700",
        destructive:
          "border-transparent bg-rose-500 text-white shadow hover:bg-rose-600",
        outline: "border-slate-200 dark:border-white/20 text-slate-700 dark:text-zinc-300",
        neonCyan:
          "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.2)]",
        neonPink:
          "border-pink-500/40 bg-pink-500/10 text-pink-600 dark:text-pink-300 shadow-[0_0_10px_rgba(255,0,127,0.2)]",
        success:
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
