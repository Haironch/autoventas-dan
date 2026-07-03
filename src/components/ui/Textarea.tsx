import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted">
      {label}
      <textarea
        className={cn(
          "bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent outline-none transition-colors resize-none",
          className,
        )}
        {...props}
      />
    </label>
  );
}
