import { VehicleCard } from "@/components/vehicle-card";
import { Select } from "@/components/ui/Select";
import { SearchInput } from "@/components/ui/Input";
import { listVehicles } from "@/lib/vehicle-store";

const KM_OPTIONS = [50000, 75000, 100000];

interface CatalogoPageProps {
  searchParams: Promise<{
    q?: string;
    marca?: string;
    transmision?: string;
    anio?: string;
    km?: string;
  }>;
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams;
  const vehicles = await listVehicles();
  const brands = Array.from(new Set(vehicles.map((v) => v.brand))).sort();
  const years = Array.from(new Set(vehicles.map((v) => v.year))).sort((a, b) => b - a);

  let results = vehicles;
  if (params.q) {
    const q = params.q.toLowerCase();
    results = results.filter((v) => `${v.brand} ${v.model}`.toLowerCase().includes(q));
  }
  if (params.marca) results = results.filter((v) => v.brand === params.marca);
  if (params.transmision) results = results.filter((v) => v.transmission === params.transmision);
  if (params.anio) results = results.filter((v) => v.year === Number(params.anio));
  if (params.km) results = results.filter((v) => v.mileageKm <= Number(params.km));

  return (
    <main className="max-w-5xl mx-auto w-full px-6 py-10 space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Catálogo de vehículos</h1>
        <p className="text-sm text-muted mt-1">
          {results.length} resultado{results.length !== 1 ? "s" : ""}
        </p>
      </div>

      <form action="/catalogo" method="GET" className="space-y-3">
        <SearchInput name="q" defaultValue={params.q ?? ""} placeholder="Buscar por marca o modelo" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
          <Select label="Marca" name="marca" defaultValue={params.marca ?? ""}>
            <option value="">Todas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
          <Select label="Transmisión" name="transmision" defaultValue={params.transmision ?? ""}>
            <option value="">Todas</option>
            <option value="Automático">Automático</option>
            <option value="Manual">Manual</option>
          </Select>
          <Select label="Año" name="anio" defaultValue={params.anio ?? ""}>
            <option value="">Todos</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          <Select label="Kilometraje máx." name="km" defaultValue={params.km ?? ""}>
            <option value="">Cualquiera</option>
            {KM_OPTIONS.map((km) => (
              <option key={km} value={km}>
                {km.toLocaleString("es-GT")} km
              </option>
            ))}
          </Select>
          <button
            type="submit"
            className="font-heading font-bold text-sm px-4.5 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors h-9"
          >
            Filtrar
          </button>
        </div>
      </form>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {results.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted text-center py-16">
          No encontramos vehículos con esos filtros.
        </p>
      )}
    </main>
  );
}
