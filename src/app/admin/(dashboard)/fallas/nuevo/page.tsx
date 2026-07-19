import { IssueForm } from "../IssueForm";
import { createCommonIssueAction } from "../actions";

export default function NewCommonIssuePage() {
  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-xl">Agregar falla común</h1>
      <IssueForm action={createCommonIssueAction} submitLabel="Crear falla" />
    </div>
  );
}
