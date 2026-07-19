import { TextField } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { Product } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}

export function ProductForm({ product, action, submitLabel }: ProductFormProps) {
  return (
    <form action={action} className="space-y-5">
      <TextField label="Nombre" name="name" defaultValue={product?.name} required />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select label="Categoría" name="category" defaultValue={product?.category ?? "Frenos"}>
          <option value="Frenos">Frenos</option>
          <option value="Filtros">Filtros</option>
          <option value="Iluminación">Iluminación</option>
          <option value="Lubricantes">Lubricantes</option>
          <option value="Accesorios">Accesorios</option>
        </Select>
        <TextField label="Precio (Q)" name="price" type="number" defaultValue={product?.price} required />
      </div>

      <TextField
        label="Compatibilidad"
        name="compatibility"
        defaultValue={product?.compatibility}
        placeholder="Ej. Toyota Corolla 2014–2022"
        required
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={product?.inStock ?? true}
          style={{ accentColor: "var(--accent)" }}
        />
        En stock
      </label>

      <Textarea label="Descripción" name="description" rows={3} defaultValue={product?.description} required />

      <button
        type="submit"
        className="font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
