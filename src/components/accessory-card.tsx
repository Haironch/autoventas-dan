import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Accessory } from "@/lib/types";

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

export function AccessoryCard({ accessory }: { accessory: Accessory }) {
  return (
    <Link href={`/accesorios/${accessory.id}`} className="block group">
      <Card className="group-hover:border-accent transition-colors h-full">
        <div className="h-28 bg-border/40 flex items-center justify-center text-muted">
          <Sparkles className="size-7" aria-hidden="true" />
        </div>
        <div className="p-4 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-sm">{accessory.name}</h3>
            {!accessory.inStock && <Badge variant="petrol">Agotado</Badge>}
          </div>
          <p className="font-heading font-bold text-base text-accent">{currency.format(accessory.price)}</p>
          <p className="text-xs text-muted">{accessory.brand}</p>
        </div>
      </Card>
    </Link>
  );
}
