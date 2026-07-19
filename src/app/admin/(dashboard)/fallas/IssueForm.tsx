import { TextField } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { CommonIssue } from "@/lib/types";

interface IssueFormProps {
  issue?: CommonIssue;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}

export function IssueForm({ issue, action, submitLabel }: IssueFormProps) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField label="Marca" name="brand" defaultValue={issue?.brand} required />
        <TextField label="Modelo" name="model" defaultValue={issue?.model} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField label="Año desde" name="yearFrom" type="number" defaultValue={issue?.yearFrom} required />
        <TextField label="Año hasta" name="yearTo" type="number" defaultValue={issue?.yearTo} required />
      </div>

      <TextField label="Título de la falla" name="title" defaultValue={issue?.title} placeholder="Ej. Falla en bomba de agua" required />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select label="Gravedad" name="severity" defaultValue={issue?.severity ?? "Leve"}>
          <option value="Leve">Leve</option>
          <option value="Moderada">Moderada</option>
          <option value="Grave">Grave</option>
        </Select>
        <TextField
          label="Costo estimado de reparación (Q, opcional)"
          name="estimatedRepairCost"
          type="number"
          defaultValue={issue?.estimatedRepairCost ?? ""}
        />
      </div>

      <Textarea label="Descripción" name="description" rows={4} defaultValue={issue?.description} required />

      <button
        type="submit"
        className="font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
