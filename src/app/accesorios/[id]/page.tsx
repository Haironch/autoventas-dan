import type { Metadata } from "next";
import { ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getAccessoryById } from "@/lib/accessory-store";

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

interface AccessoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AccessoryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const accessory = await getAccessoryById(id);

  if (!accessory) {
    return { title: "Accesorio no encontrado" };
  }

  return {
    title: accessory.name,
    description: `${accessory.name} — ${currency.format(accessory.price)}. ${accessory.description}`,
  };
}

export default async function AccessoryDetailPage({ params }: AccessoryDetailPageProps) {
  const { id } = await params;
  const accessory = await getAccessoryById(id);

  if (!accessory) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-10 space-y-6">
      <Link href="/accesorios" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors">
        <ChevronLeft className="size-4" aria-hidden="true" />
        Volver a accesorios
      </Link>

      <Card>
        <div className="h-56 bg-border/40 flex items-center justify-center text-muted">
          <Sparkles className="size-14" aria-hidden="true" />
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading font-bold text-2xl">{accessory.name}</h1>
              <p className="font-heading font-bold text-xl text-accent mt-1">{currency.format(accessory.price)}</p>
            </div>
            <Badge variant={accessory.inStock ? "success" : "petrol"}>
              {accessory.inStock ? "En stock" : "Agotado"}
            </Badge>
          </div>

          <p className="text-sm text-muted leading-relaxed">{accessory.description}</p>

          <div className="border-t border-border pt-5">
            <p className="text-xs text-muted">Marca</p>
            <p className="text-sm font-medium mt-0.5">{accessory.brand}</p>
          </div>

          <div className="border-t border-border pt-5">
            <AddToCartButton product={accessory} />
          </div>
        </div>
      </Card>
    </main>
  );
}
