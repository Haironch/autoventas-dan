import type { Metadata } from "next";
import { CompareScoreChart, type ChartSeries } from "@/components/compare-score-chart";
import { CompareSlotPicker } from "@/components/compare-slot-picker";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  externalColumn,
  inventoryColumn,
  visibleRows,
  type CompareColumn,
} from "@/lib/compare-columns";
import { getExternalVehicle, parseExternalId, type ExternalVehicle } from "@/lib/fuel-economy";
import { listVehicles } from "@/lib/vehicle-store";
import type { Vehicle } from "@/lib/types";

export const metadata: Metadata = {
  title: "Comparador de vehículos",
  description:
    "Compara autos lado a lado: los de nuestro inventario y cualquier otro modelo, con datos técnicos de consumo, motor y transmisión.",
  alternates: {
    canonical: "/comparar",
  },
};

const SLOTS = ["v1", "v2", "v3"] as const;

const FIT_GRID_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

interface CompararPageProps {
  searchParams: Promise<{ v1?: string; v2?: string; v3?: string }>;
}

function optionLabel(v: Vehicle) {
  return `${v.brand} ${v.model} ${v.year} · ${v.bodyType}`;
}

function externalLabel(v: ExternalVehicle, column: CompareColumn) {
  return `${v.year} ${v.make} ${v.model} · ${column.summary}`;
}

export default async function CompararPage({ searchParams }: CompararPageProps) {
  const params = await searchParams;
  const vehicles = await listVehicles();

  const resolved = await Promise.all(
    SLOTS.map(async (slot) => {
      const value = params[slot] ?? "";
      const externalId = parseExternalId(value);

      if (externalId) {
        const external = await getExternalVehicle(externalId);
        return { slot, value, kind: "external" as const, external };
      }
      return { slot, value, kind: "inventory" as const, vehicle: vehicles.find((v) => v.id === value) };
    }),
  );

  const columns: CompareColumn[] = [];
  const chartSeries: ChartSeries[] = [];
  const externalLabels: Record<string, string> = {};
  let failedExternal = false;

  for (const [slotIndex, item] of resolved.entries()) {
    const columnCount = columns.length;

    if (item.kind === "external") {
      if (!item.external) {
        if (item.value) failedExternal = true;
        continue;
      }
      const column = externalColumn(item.external);
      columns.push(column);
      externalLabels[item.slot] = externalLabel(item.external, column);
    } else if (item.vehicle) {
      columns.push(inventoryColumn(item.vehicle));
    }

    if (columns.length > columnCount) {
      const column = columns[columns.length - 1];
      chartSeries.push({ key: column.key, title: column.title, scores: column.scores, slot: slotIndex });
    }
  }

  const rows = visibleRows(columns);
  const hasExternal = columns.some((column) => column.source === "external");
  const inventoryOptions = vehicles.map((v) => ({ value: v.id, label: optionLabel(v) }));

  return (
    <main className="max-w-4xl mx-auto w-full px-6 py-10 space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Compara cualquier auto, tengamos o no el modelo</h1>
        <p className="text-sm text-muted mt-1 max-w-lg">
          Elige hasta 3 vehículos: los de nuestro inventario o cualquier otro modelo, para ver cuál se
          ajusta mejor a lo que necesitas, no solo cuál es &ldquo;mejor&rdquo; en papel.
        </p>
      </div>

      <form action="/comparar" method="GET" className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          {SLOTS.map((slot, i) => (
            <CompareSlotPicker
              key={`${slot}-${params[slot] ?? ""}`}
              name={slot}
              label={`Vehículo ${i + 1}`}
              inventory={inventoryOptions}
              initialValue={params[slot] ?? ""}
              initialExternalLabel={externalLabels[slot]}
            />
          ))}
        </div>
        <button
          type="submit"
          className="font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
        >
          Comparar
        </button>
      </form>

      {failedExternal && (
        <p className="text-sm text-danger">
          No pudimos cargar los datos de uno de los autos seleccionados. Intenta elegirlo de nuevo.
        </p>
      )}

      {columns.length === 0 ? (
        <p className="text-sm text-muted text-center py-16">
          Selecciona al menos un vehículo para comenzar la comparación.
        </p>
      ) : (
        <>
          <div className={`grid grid-cols-1 gap-4 ${FIT_GRID_COLS[columns.length]}`}>
            {columns.map((column) => (
              <Card key={column.key} className="p-4 flex flex-col">
                <div>
                  <Badge variant={column.source === "inventory" ? "petrol" : "accent"}>{column.badge}</Badge>
                </div>
                <p className="font-heading font-bold text-sm mt-2">{column.title}</p>
                <p className="text-xs text-muted mt-1.5">{column.summaryLabel}</p>
                <p className="text-sm mt-0.5 leading-relaxed">{column.summary}</p>
                {column.cta && (
                  <a
                    href={column.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-sm text-accent hover:text-accent-hover transition-colors"
                  >
                    {column.cta.label}
                  </a>
                )}
              </Card>
            ))}
          </div>

          {chartSeries.length >= 2 && <CompareScoreChart series={chartSeries} />}

          <Card className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left text-xs text-muted font-normal p-4 align-bottom">Especificación</th>
                  {columns.map((column) => (
                    <th key={column.key} className="text-left p-4 align-bottom">
                      <p className="font-heading font-bold text-sm">{column.title}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-t border-border">
                    <td className="p-4 text-xs text-muted">{row.label}</td>
                    {columns.map((column) => (
                      <td key={column.key} className="p-4 font-medium">
                        {column.rows[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {hasExternal && (
            <p className="text-xs text-muted leading-relaxed">
              Los autos marcados como referencia usan datos de fueleconomy.gov (mercado de EE. UU.). El
              consumo se muestra en km por galón y puede variar según la versión y el mercado. Para precio
              y disponibilidad, consúltanos por WhatsApp.
            </p>
          )}
        </>
      )}
    </main>
  );
}
