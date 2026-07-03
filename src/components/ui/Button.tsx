import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent-hover",
  secondary: "bg-transparent text-foreground border border-border hover:bg-surface-hover",
  ghost: "bg-transparent text-muted hover:text-foreground",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg transition-colors",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
