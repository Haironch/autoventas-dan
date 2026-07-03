import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted">
      {label}
      <select
        className={cn(
          "bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-accent outline-none transition-colors",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
