import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white dark:bg-white dark:text-zinc-950 shadow hover:bg-slate-800 dark:hover:bg-zinc-200 active:scale-[0.98]",
        destructive:
          "bg-rose-500 text-white shadow-sm hover:bg-rose-600 active:scale-[0.98]",
        outline:
          "border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/30 active:scale-[0.98]",
        secondary:
          "bg-slate-100 text-slate-800 dark:bg-zinc-800/80 dark:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-700/80 active:scale-[0.98]",
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white active:scale-[0.98]",
        link: "text-cyan-600 dark:text-cyan-400 underline-offset-4 hover:underline",
        neon:
          "bg-gradient-to-r from-cyan-500 to-blue-600 text-white dark:text-zinc-950 font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.7)] hover:brightness-110 active:scale-[0.98]",
        neonPink:
          "bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:shadow-[0_0_30px_rgba(255,0,127,0.7)] hover:brightness-110 active:scale-[0.98]",
        laser:
          "border border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:bg-cyan-500/20 hover:border-cyan-500 dark:hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-semibold",
        icon: "h-10 w-10 p-0",
        iconSm: "h-8 w-8 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
