"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

interface Purchasable {
  id: string;
  inStock: boolean;
}

export function AddToCartButton({ product }: { product: Purchasable }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    addItem(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!product.inStock}
      className="inline-flex items-center gap-2 font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {justAdded ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          Agregado
        </>
      ) : product.inStock ? (
        "Agregar al carrito"
      ) : (
        "Agotado"
      )}
    </button>
  );
}
