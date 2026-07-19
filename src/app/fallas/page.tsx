import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { TextField } from "@/components/ui/Input";
import { listCommonIssues, searchCommonIssues } from "@/lib/common-issue-store";
import type { IssueSeverity } from "@/lib/types";

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

const SEVERITY_BADGE: Record<IssueSeverity, "success" | "accent" | "danger"> = {
  Leve: "success",
  Moderada: "accent",
  Grave: "danger",
};

interface FallasPageProps {
  searchParams: Promise<{ marca?: string; modelo?: string; anio?: string }>;
}

export default async function FallasPage({ searchParams }: FallasPageProps) {
  const params = await searchParams;
  const allIssues = await listCommonIssues();
  const brands = Array.from(new Set(allIssues.map((i) => i.brand))).sort();

  const hasSearched = Boolean(params.marca);
  const results = hasSearched
    ? await searchCommonIssues({
        brand: params.marca,
        model: params.modelo || undefined,
        year: params.anio ? Number(params.anio) : undefined,
      })
    : [];

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-10 space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Historial de fallas comunes</h1>
        <p className="text-sm text-muted mt-1 max-w-xl">
          Busca por marca, modelo y año para conocer los problemas mecánicos más reportados antes de comprar.
        </p>
      </div>

      <form action="/fallas" method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <Select label="Marca" name="marca" defaultValue={params.marca ?? ""}>
          <option value="">Selecciona</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </Select>
        <TextField label="Modelo (opcional)" name="modelo" defaultValue={params.modelo ?? ""} placeholder="Corolla" />
        <TextField label="Año (opcional)" name="anio" type="number" defaultValue={params.anio ?? ""} placeholder="2019" />
        <button
          type="submit"
          className="font-heading font-bold text-sm px-4.5 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors h-9"
        >
          Buscar
        </button>
      </form>

      {!hasSearched ? (
        <p className="text-sm text-muted text-center py-16">
          Elige al menos una marca para ver las fallas más reportadas.
        </p>
      ) : results.length === 0 ? (
        <p className="text-sm text-muted text-center py-16">
          No encontramos fallas reportadas para esa búsqueda.
        </p>
      ) : (
        <div className="space-y-3">
          {results.map((issue) => (
            <Card key={issue.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-muted mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-heading font-bold text-sm">{issue.title}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {issue.brand} {issue.model} · {issue.yearFrom}–{issue.yearTo}
                    </p>
                  </div>
                </div>
                <Badge variant={SEVERITY_BADGE[issue.severity]}>{issue.severity}</Badge>
              </div>
              <p className="text-sm text-muted leading-relaxed">{issue.description}</p>
              {issue.estimatedRepairCost !== null && (
                <p className="text-xs text-muted">
                  Costo estimado de reparación: <span className="font-medium">{currency.format(issue.estimatedRepairCost)}</span>
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
