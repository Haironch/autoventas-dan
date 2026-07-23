import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { listAccessories } from "@/lib/accessory-store";
import { deleteAccessoryAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin · Accesorios",
};

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

export default async function AdminAccessoriesPage() {
  const accessories = await listAccessories();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-xl">Accesorios</h1>
          <p className="text-sm text-muted mt-0.5">{accessories.length} en la tienda</p>
        </div>
        <Link
          href="/admin/accesorios/nuevo"
          className="font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
        >
          Agregar accesorio
        </Link>
      </div>

      <div className="sm:hidden space-y-3">
        {accessories.map((a) => (
          <Card key={a.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-heading font-bold text-sm">{a.name}</p>
                <p className="text-xs text-muted mt-0.5">{a.brand}</p>
              </div>
              <Badge variant={a.inStock ? "success" : "petrol"}>{a.inStock ? "En stock" : "Agotado"}</Badge>
            </div>
            <p className="font-heading font-bold text-accent">{currency.format(a.price)}</p>
            <div className="flex items-center gap-4 border-t border-border pt-3">
              <Link
                href={`/admin/accesorios/${a.id}/editar`}
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Editar
              </Link>
              <form action={deleteAccessoryAction}>
                <input type="hidden" name="id" value={a.id} />
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
              <th className="text-left text-xs text-muted font-normal p-3">Accesorio</th>
              <th className="text-left text-xs text-muted font-normal p-3">Marca</th>
              <th className="text-left text-xs text-muted font-normal p-3">Precio</th>
              <th className="text-left text-xs text-muted font-normal p-3">Estado</th>
              <th className="text-right text-xs text-muted font-normal p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {accessories.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3 text-muted">{a.brand}</td>
                <td className="p-3">{currency.format(a.price)}</td>
                <td className="p-3">
                  <Badge variant={a.inStock ? "success" : "petrol"}>{a.inStock ? "En stock" : "Agotado"}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/accesorios/${a.id}/editar`}
                      className="text-accent hover:text-accent-hover transition-colors"
                    >
                      Editar
                    </Link>
                    <form action={deleteAccessoryAction}>
                      <input type="hidden" name="id" value={a.id} />
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
