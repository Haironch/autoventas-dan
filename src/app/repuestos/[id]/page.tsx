import type { Metadata } from "next";
import { ChevronLeft, PackageSearch } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getProductById } from "@/lib/product-store";

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Repuesto no encontrado" };
  }

  return {
    title: product.name,
    description: `${product.name} — ${currency.format(product.price)}. ${product.description}`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-10 space-y-6">
      <Link href="/repuestos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors">
        <ChevronLeft className="size-4" aria-hidden="true" />
        Volver a repuestos
      </Link>

      <Card>
        <div className="h-56 bg-border/40 flex items-center justify-center text-muted">
          <PackageSearch className="size-14" aria-hidden="true" />
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading font-bold text-2xl">{product.name}</h1>
              <p className="font-heading font-bold text-xl text-accent mt-1">{currency.format(product.price)}</p>
            </div>
            <Badge variant={product.inStock ? "success" : "petrol"}>
              {product.inStock ? "En stock" : "Agotado"}
            </Badge>
          </div>

          <p className="text-sm text-muted leading-relaxed">{product.description}</p>

          <div className="border-t border-border pt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">Categoría</p>
              <p className="text-sm font-medium mt-0.5">{product.category}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Compatibilidad</p>
              <p className="text-sm font-medium mt-0.5">{product.compatibility}</p>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <AddToCartButton product={product} />
          </div>
        </div>
      </Card>
    </main>
  );
}
