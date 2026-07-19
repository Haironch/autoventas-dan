import { AccessoryForm } from "../AccessoryForm";
import { createAccessoryAction } from "../actions";

export default function NewAccessoryPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-xl">Agregar accesorio</h1>
      <AccessoryForm action={createAccessoryAction} submitLabel="Crear accesorio" />
    </div>
  );
}
