import { Car } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Vehicle } from "@/lib/types";

const statusBadgeVariant = {
  Disponible: "success",
  Reservado: "accent",
  Vendido: "petrol",
} as const;

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/catalogo/${vehicle.id}`} className="block group">
      <Card className="group-hover:border-accent transition-colors h-full">
        <div className="h-32 bg-border/40 flex items-center justify-center text-muted">
          <Car className="size-8" aria-hidden="true" />
        </div>
        <div className="p-4 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-base">
              {vehicle.brand} {vehicle.model} {vehicle.year}
            </h3>
            <Badge variant={statusBadgeVariant[vehicle.status]}>{vehicle.status}</Badge>
          </div>
          <p className="font-heading font-bold text-lg text-accent">{currency.format(vehicle.price)}</p>
          <p className="text-xs text-muted">
            {vehicle.mileageKm.toLocaleString("es-GT")} km · {vehicle.transmission} · {vehicle.fuelType}
          </p>
        </div>
      </Card>
    </Link>
  );
}
