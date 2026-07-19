"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/lib/cart-context";
import type { Product, Accessory } from "@/lib/types";

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

export function CarritoClient({ catalog }: { catalog: (Product | Accessory)[] }) {
  const { items, removeItem } = useCart();

  const lines = items
    .map((item) => {
      const product = catalog.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((line): line is { product: Product | Accessory; quantity: number } => Boolean(line));

  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  return (
    <main className="max-w-2xl mx-auto w-full px-6 py-10 space-y-6">
      <h1 className="font-heading font-bold text-2xl">Tu carrito</h1>

      {lines.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm text-muted">Tu carrito está vacío.</p>
          <Link href="/repuestos" className="text-sm text-accent hover:text-accent-hover transition-colors">
            Ir a repuestos y accesorios
          </Link>
        </div>
      ) : (
        <>
          <Card className="divide-y divide-border">
            {lines.map(({ product, quantity }) => (
              <div key={product.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-heading font-bold text-sm">{product.name}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {quantity} × {currency.format(product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-heading font-bold text-sm text-accent">
                    {currency.format(product.price * quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Quitar ${product.name}`}
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </Card>

          <Card className="p-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs text-muted">Total</p>
              <p className="font-heading font-bold text-xl text-accent">{currency.format(total)}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-muted border border-border rounded-lg px-3 py-2.5">
              Continuar al pago
              <span className="text-[10px] border border-border rounded-full px-2 py-0.5">Próximamente</span>
            </span>
          </Card>
        </>
      )}
    </main>
  );
}
