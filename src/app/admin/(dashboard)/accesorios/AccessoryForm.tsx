import { TextField } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Accessory } from "@/lib/types";

interface AccessoryFormProps {
  accessory?: Accessory;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}

export function AccessoryForm({ accessory, action, submitLabel }: AccessoryFormProps) {
  return (
    <form action={action} className="space-y-5">
      <TextField label="Nombre" name="name" defaultValue={accessory?.name} required />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField label="Marca" name="brand" defaultValue={accessory?.brand} required />
        <TextField label="Precio (Q)" name="price" type="number" defaultValue={accessory?.price} required />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={accessory?.inStock ?? true}
          style={{ accentColor: "var(--accent)" }}
        />
        En stock
      </label>

      <Textarea label="Descripción" name="description" rows={3} defaultValue={accessory?.description} required />

      <button
        type="submit"
        className="font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
