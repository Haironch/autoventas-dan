import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { listProducts } from "@/lib/product-store";
import { deleteProductAction } from "./actions";

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-xl">Repuestos</h1>
          <p className="text-sm text-muted mt-0.5">{products.length} en la tienda</p>
        </div>
        <Link
          href="/admin/repuestos/nuevo"
          className="font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
        >
          Agregar repuesto
        </Link>
      </div>

      <div className="sm:hidden space-y-3">
        {products.map((p) => (
          <Card key={p.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-heading font-bold text-sm">{p.name}</p>
                <p className="text-xs text-muted mt-0.5">{p.category}</p>
              </div>
              <Badge variant={p.inStock ? "success" : "petrol"}>{p.inStock ? "En stock" : "Agotado"}</Badge>
            </div>
            <p className="font-heading font-bold text-accent">{currency.format(p.price)}</p>
            <div className="flex items-center gap-4 border-t border-border pt-3">
              <Link
                href={`/admin/repuestos/${p.id}/editar`}
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Editar
              </Link>
              <form action={deleteProductAction}>
                <input type="hidden" name="id" value={p.id} />
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
              <th className="text-left text-xs text-muted font-normal p-3">Producto</th>
              <th className="text-left text-xs text-muted font-normal p-3">Categoría</th>
              <th className="text-left text-xs text-muted font-normal p-3">Precio</th>
              <th className="text-left text-xs text-muted font-normal p-3">Estado</th>
              <th className="text-right text-xs text-muted font-normal p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-muted">{p.category}</td>
                <td className="p-3">{currency.format(p.price)}</td>
                <td className="p-3">
                  <Badge variant={p.inStock ? "success" : "petrol"}>{p.inStock ? "En stock" : "Agotado"}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/repuestos/${p.id}/editar`}
                      className="text-accent hover:text-accent-hover transition-colors"
                    >
                      Editar
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
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
