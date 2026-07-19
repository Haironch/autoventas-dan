import { notFound } from "next/navigation";
import { IssueForm } from "../../IssueForm";
import { updateCommonIssueAction } from "../../actions";
import { getCommonIssueById } from "@/lib/common-issue-store";

interface EditCommonIssuePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCommonIssuePage({ params }: EditCommonIssuePageProps) {
  const { id } = await params;
  const issue = await getCommonIssueById(id);

  if (!issue) {
    notFound();
  }

  async function action(formData: FormData) {
    "use server";
    await updateCommonIssueAction(id, formData);
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-xl">Editar {issue.title}</h1>
      <IssueForm issue={issue} action={action} submitLabel="Guardar cambios" />
    </div>
  );
}
