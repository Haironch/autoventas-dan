"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartIndicator() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrito"
      className="relative flex items-center justify-center size-9 rounded-lg border border-border text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
      aria-label={`Carrito, ${totalItems} producto${totalItems !== 1 ? "s" : ""}`}
    >
      <ShoppingCart className="size-4" aria-hidden="true" />
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
