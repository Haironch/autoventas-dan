import { ProductCard } from "@/components/product-card";
import { Select } from "@/components/ui/Select";
import { listProducts } from "@/lib/product-store";
import type { ProductCategory } from "@/lib/types";

const CATEGORIES: ProductCategory[] = ["Frenos", "Filtros", "Iluminación", "Lubricantes", "Accesorios"];

interface RepuestosPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function RepuestosPage({ searchParams }: RepuestosPageProps) {
  const params = await searchParams;
  const products = await listProducts();
  const results = params.categoria
    ? products.filter((p) => p.category === params.categoria)
    : products;

  return (
    <main className="max-w-5xl mx-auto w-full px-6 py-10 space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Repuestos y accesorios</h1>
        <p className="text-sm text-muted mt-1">
          {results.length} producto{results.length !== 1 ? "s" : ""}
        </p>
      </div>

      <form action="/repuestos" method="GET" className="flex items-end gap-3">
        <Select label="Categoría" name="categoria" defaultValue={params.categoria ?? ""}>
          <option value="">Todas</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
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
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted text-center py-16">No hay productos en esta categoría.</p>
      )}
    </main>
  );
}
