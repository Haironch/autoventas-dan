import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeVariant = "success" | "accent" | "petrol" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success-soft text-success-soft-foreground",
  accent: "bg-accent-soft text-accent-soft-foreground",
  petrol: "bg-petrol-soft text-petrol-soft-foreground",
  danger: "bg-danger-soft text-danger-soft-foreground",
};

export function Badge({ variant = "accent", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-medium px-2.5 py-1 rounded-full",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
