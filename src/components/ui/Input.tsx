import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

export function SearchInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5",
        "focus-within:border-accent transition-colors",
        className,
      )}
    >
      <Search className="size-4 text-muted shrink-0" aria-hidden="true" />
      <input
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
        {...props}
      />
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextField({ label, className, ...props }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted">
      {label}
      <input
        className={cn(
          "bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent outline-none transition-colors",
          className,
        )}
        {...props}
      />
    </label>
  );
}
