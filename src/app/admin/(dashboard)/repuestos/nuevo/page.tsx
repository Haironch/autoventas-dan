import { ProductForm } from "../ProductForm";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-xl">Agregar repuesto</h1>
      <ProductForm action={createProductAction} submitLabel="Crear repuesto" />
    </div>
  );
}
