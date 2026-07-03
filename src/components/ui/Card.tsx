import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-surface border border-border rounded-xl overflow-hidden", className)}
      {...props}
    />
  );
}
