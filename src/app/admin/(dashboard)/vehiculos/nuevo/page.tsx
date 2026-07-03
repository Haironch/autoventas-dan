import { VehicleForm } from "../VehicleForm";
import { createVehicleAction } from "../../actions";

export default function NewVehiclePage() {
  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-xl">Agregar vehículo</h1>
      <VehicleForm action={createVehicleAction} submitLabel="Crear vehículo" />
    </div>
  );
}
