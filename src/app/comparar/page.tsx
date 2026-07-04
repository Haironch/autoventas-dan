import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { listVehicles } from "@/lib/vehicle-store";
import type { Vehicle } from "@/lib/types";

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

const specRows: { label: string; value: (v: Vehicle) => string }[] = [
  { label: "Categoría", value: (v) => v.bodyType },
  { label: "Pasajeros", value: (v) => `${v.seats} personas` },
  { label: "Cilindraje", value: (v) => `${v.engineDisplacementLiters.toFixed(1)}L` },
  { label: "Consumo", value: (v) => `${v.fuelConsumptionKmPerGalon} km/gal` },
  { label: "Transmisión", value: (v) => v.transmission },
  { label: "Combustible", value: (v) => v.fuelType },
  { label: "Precio", value: (v) => currency.format(v.price) },
  { label: "Año", value: (v) => String(v.year) },
  { label: "Kilometraje", value: (v) => `${v.mileageKm.toLocaleString("es-GT")} km` },
  { label: "Estado", value: (v) => v.status },
];

const FIT_GRID_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

interface CompararPageProps {
  searchParams: Promise<{ v1?: string; v2?: string; v3?: string }>;
}

function vehicleLabel(v: Vehicle) {
  return `${v.brand} ${v.model} ${v.year}`;
}

function optionLabel(v: Vehicle) {
  return `${v.brand} ${v.model} ${v.year} · ${v.bodyType}`;
}

export default async function CompararPage({ searchParams }: CompararPageProps) {
  const params = await searchParams;
  const vehicles = await listVehicles();
  const slots = [params.v1, params.v2, params.v3];
  const selected = slots
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is Vehicle => Boolean(v));

  return (
    <main className="max-w-4xl mx-auto w-full px-6 py-10 space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Encuentra el vehículo que se adapta a ti</h1>
        <p className="text-sm text-muted mt-1 max-w-lg">
          Compara entre categorías —un sedán, un SUV o una pickup— para ver cuál se ajusta mejor a lo
          que necesitas, no solo cuál es &ldquo;mejor&rdquo; en papel.
        </p>
      </div>

      <form action="/comparar" method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        {(["v1", "v2", "v3"] as const).map((name, i) => (
          <Select key={name} label={`Vehículo ${i + 1}`} name={name} defaultValue={params[name] ?? ""}>
            <option value="">Sin seleccionar</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {optionLabel(v)}
              </option>
            ))}
          </Select>
        ))}
        <button
          type="submit"
          className="font-heading font-bold text-sm px-4.5 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors h-9"
        >
          Comparar
        </button>
      </form>

      {selected.length === 0 ? (
        <p className="text-sm text-muted text-center py-16">
          Selecciona al menos un vehículo para comenzar la comparación.
        </p>
      ) : (
        <>
          <div className={`grid grid-cols-1 gap-4 ${FIT_GRID_COLS[selected.length]}`}>
            {selected.map((v) => (
              <Card key={v.id} className="p-4">
                <Badge variant="petrol">{v.bodyType}</Badge>
                <p className="font-heading font-bold text-sm mt-2">{vehicleLabel(v)}</p>
                <p className="text-xs text-muted mt-1.5">Ideal para</p>
                <p className="text-sm mt-0.5 leading-relaxed">{v.idealFor}</p>
              </Card>
            ))}
          </div>

          <Card className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left text-xs text-muted font-normal p-4 align-bottom">Especificación</th>
                  {selected.map((v) => (
                    <th key={v.id} className="text-left p-4 align-bottom">
                      <p className="font-heading font-bold text-sm">{vehicleLabel(v)}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specRows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="p-4 text-xs text-muted">{row.label}</td>
                    {selected.map((v) => (
                      <td key={v.id} className="p-4 font-medium">
                        {row.value(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </main>
  );
}
