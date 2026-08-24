import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "btn-shine bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-light)] shadow-sm",
      secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
      outline: "border border-zinc-200 bg-transparent hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50",
      ghost: "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 text-zinc-900 dark:text-zinc-50",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-6 py-2 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, cn };
