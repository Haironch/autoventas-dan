import type { Metadata } from "next";
import { AccessoryCard } from "@/components/accessory-card";
import { Select } from "@/components/ui/Select";
import { listAccessories } from "@/lib/accessory-store";

export const metadata: Metadata = {
  title: "Accesorios",
  description: "Accesorios para tu vehículo: perillas, persianas, tapetes y más, filtrados por marca.",
};

interface AccesoriosPageProps {
  searchParams: Promise<{ marca?: string }>;
}

export default async function AccesoriosPage({ searchParams }: AccesoriosPageProps) {
  const params = await searchParams;
  const accessories = await listAccessories();
  const brands = Array.from(new Set(accessories.map((a) => a.brand))).sort();
  const results = params.marca ? accessories.filter((a) => a.brand === params.marca) : accessories;

  return (
    <main className="max-w-5xl mx-auto w-full px-6 py-10 space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Accesorios</h1>
        <p className="text-sm text-muted mt-1">
          {results.length} producto{results.length !== 1 ? "s" : ""}
        </p>
      </div>

      <form action="/accesorios" method="GET" className="flex items-end gap-3">
        <Select label="Marca" name="marca" defaultValue={params.marca ?? ""}>
          <option value="">Todas</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </Select>
        <button
          type="submit"
          className="font-heading font-bold text-sm px-4.5 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors h-9"
        >
          Filtrar
        </button>
      </form>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {results.map((accessory) => (
            <AccessoryCard key={accessory.id} accessory={accessory} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted text-center py-16">No hay accesorios de esta marca.</p>
      )}
    </main>
  );
}
