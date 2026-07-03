import { notFound } from "next/navigation";
import { VehicleForm } from "../../VehicleForm";
import { updateVehicleAction } from "../../../actions";
import { getVehicleById } from "@/lib/vehicle-store";

interface EditVehiclePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params;
  const vehicle = getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  async function action(formData: FormData) {
    "use server";
    await updateVehicleAction(id, formData);
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-xl">
        Editar {vehicle.brand} {vehicle.model}
      </h1>
      <VehicleForm vehicle={vehicle} action={action} submitLabel="Guardar cambios" />
    </div>
  );
}
