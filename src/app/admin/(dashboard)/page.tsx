import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { listVehicles } from "@/lib/vehicle-store";
import { deleteVehicleAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin · Vehículos",
};

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

export default async function AdminVehiclesPage() {
  const vehicles = await listVehicles();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-xl">Vehículos</h1>
          <p className="text-sm text-muted mt-0.5">{vehicles.length} en el catálogo</p>
        </div>
        <Link
          href="/admin/vehiculos/nuevo"
          className="font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
        >
          Agregar vehículo
        </Link>
      </div>

      <div className="sm:hidden space-y-3">
        {vehicles.map((v) => (
          <Card key={v.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-heading font-bold text-sm">
                  {v.brand} {v.model} {v.year}
                </p>
                <p className="text-xs text-muted mt-0.5">{v.bodyType}</p>
              </div>
              <Badge variant={statusBadgeVariant[v.status]}>{v.status}</Badge>
            </div>
            <p className="font-heading font-bold text-accent">{currency.format(v.price)}</p>
            <div className="flex items-center gap-4 border-t border-border pt-3">
              <Link
                href={`/admin/vehiculos/${v.id}/editar`}
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Editar
              </Link>
              <form action={deleteVehicleAction}>
                <input type="hidden" name="id" value={v.id} />
                <button type="submit" className="text-sm text-danger hover:opacity-80 transition-opacity">
                  Eliminar
                </button>
              </form>
            </div>
          </Card>
        ))}
      </div>

      <Card className="max-sm:hidden overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-muted font-normal p-3">Vehículo</th>
              <th className="text-left text-xs text-muted font-normal p-3">Categoría</th>
              <th className="text-left text-xs text-muted font-normal p-3">Precio</th>
              <th className="text-left text-xs text-muted font-normal p-3">Estado</th>
              <th className="text-right text-xs text-muted font-normal p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">
                  {v.brand} {v.model} {v.year}
                </td>
                <td className="p-3 text-muted">{v.bodyType}</td>
                <td className="p-3">{currency.format(v.price)}</td>
                <td className="p-3">
                  <Badge variant={statusBadgeVariant[v.status]}>{v.status}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/vehiculos/${v.id}/editar`}
                      className="text-accent hover:text-accent-hover transition-colors"
                    >
                      Editar
                    </Link>
                    <form action={deleteVehicleAction}>
                      <input type="hidden" name="id" value={v.id} />
                      <button type="submit" className="text-danger hover:opacity-80 transition-opacity">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
