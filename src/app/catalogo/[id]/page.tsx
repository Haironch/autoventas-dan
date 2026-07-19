import { Car, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getVehicleById } from "@/lib/vehicle-store";

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

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const specs = [
    { label: "Categoría", value: vehicle.bodyType },
    { label: "Pasajeros", value: `${vehicle.seats} personas` },
    { label: "Cilindraje", value: `${vehicle.engineDisplacementLiters.toFixed(1)}L` },
    { label: "Consumo", value: `${vehicle.fuelConsumptionKmPerGalon} km/gal` },
    { label: "Kilometraje", value: `${vehicle.mileageKm.toLocaleString("es-GT")} km` },
    { label: "Transmisión", value: vehicle.transmission },
    { label: "Combustible", value: vehicle.fuelType },
  ];

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-10 space-y-6">
      <Link href="/catalogo" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors">
        <ChevronLeft className="size-4" aria-hidden="true" />
        Volver al catálogo
      </Link>

      <Card>
        {vehicle.images.length > 0 ? (
          <div className={vehicle.images.length > 1 ? "grid grid-cols-2 gap-0.5" : ""}>
            {vehicle.images.map((src, i) => (
              <div key={src} className="relative h-56 bg-border/40 overflow-hidden">
                <Image
                  src={src}
                  alt={`${vehicle.brand} ${vehicle.model} - foto ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 640px, 100vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-56 bg-border/40 flex items-center justify-center text-muted">
            <Car className="size-14" aria-hidden="true" />
          </div>
        )}

        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading font-bold text-2xl">
                {vehicle.brand} {vehicle.model} {vehicle.year}
              </h1>
              <p className="font-heading font-bold text-xl text-accent mt-1">
                {currency.format(vehicle.price)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={statusBadgeVariant[vehicle.status]}>{vehicle.status}</Badge>
              {vehicle.isVerified && <Badge variant="petrol">Verificado</Badge>}
            </div>
          </div>

          <p className="text-sm text-muted leading-relaxed">{vehicle.description}</p>

          <div className="bg-accent-soft rounded-lg px-4 py-3">
            <p className="text-xs text-accent-soft-foreground font-medium">Ideal para</p>
            <p className="text-sm text-accent-soft-foreground mt-0.5">{vehicle.idealFor}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-border pt-5">
            {specs.map((spec) => (
              <div key={spec.label}>
                <p className="text-xs text-muted">{spec.label}</p>
                <p className="text-sm font-medium mt-0.5">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap border-t border-border pt-5">
            <button
              type="button"
              disabled={vehicle.status === "Vendido"}
              className="font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cotizar este vehículo
            </button>
            <Link
              href={`/fallas?marca=${encodeURIComponent(vehicle.brand)}&modelo=${encodeURIComponent(vehicle.model)}&anio=${vehicle.year}`}
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground border border-border rounded-lg px-3 py-2.5 transition-colors"
            >
              Ver historial de fallas comunes
            </Link>
          </div>
        </div>
      </Card>
    </main>
  );
}
