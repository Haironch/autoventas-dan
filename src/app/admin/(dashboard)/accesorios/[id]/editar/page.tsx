import { notFound } from "next/navigation";
import { AccessoryForm } from "../../AccessoryForm";
import { updateAccessoryAction } from "../../actions";
import { getAccessoryById } from "@/lib/accessory-store";

interface EditAccessoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAccessoryPage({ params }: EditAccessoryPageProps) {
  const { id } = await params;
  const accessory = await getAccessoryById(id);

  if (!accessory) {
    notFound();
  }

  async function action(formData: FormData) {
    "use server";
    await updateAccessoryAction(id, formData);
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-xl">Editar {accessory.name}</h1>
      <AccessoryForm accessory={accessory} action={action} submitLabel="Guardar cambios" />
    </div>
  );
}
