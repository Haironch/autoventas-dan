import { TextField } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PhotoField } from "./PhotoField";
import type { Vehicle } from "@/lib/types";

interface VehicleFormProps {
  vehicle?: Vehicle;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}

export function VehicleForm({ vehicle, action, submitLabel }: VehicleFormProps) {
  return (
    <form action={action} encType="multipart/form-data" className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TextField label="Marca" name="brand" defaultValue={vehicle?.brand} required />
        <TextField label="Modelo" name="model" defaultValue={vehicle?.model} required />
        <TextField label="Año" name="year" type="number" defaultValue={vehicle?.year} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TextField label="Precio (Q)" name="price" type="number" defaultValue={vehicle?.price} required />
        <TextField label="Kilometraje" name="mileageKm" type="number" defaultValue={vehicle?.mileageKm} required />
        <Select label="Categoría" name="bodyType" defaultValue={vehicle?.bodyType ?? "Sedán"}>
          <option value="Sedán">Sedán</option>
          <option value="Hatchback">Hatchback</option>
          <option value="SUV">SUV</option>
          <option value="Pickup">Pickup</option>
          <option value="Coupé">Coupé</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TextField label="Pasajeros" name="seats" type="number" defaultValue={vehicle?.seats ?? 5} required />
        <TextField
          label="Cilindraje (L)"
          name="engineDisplacementLiters"
          type="number"
          step="0.1"
          defaultValue={vehicle?.engineDisplacementLiters}
          required
        />
        <TextField
          label="Consumo (km/gal)"
          name="fuelConsumptionKmPerGalon"
          type="number"
          defaultValue={vehicle?.fuelConsumptionKmPerGalon}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select label="Transmisión" name="transmission" defaultValue={vehicle?.transmission ?? "Automático"}>
          <option value="Automático">Automático</option>
          <option value="Manual">Manual</option>
        </Select>
        <Select label="Combustible" name="fuelType" defaultValue={vehicle?.fuelType ?? "Gasolina"}>
          <option value="Gasolina">Gasolina</option>
          <option value="Diésel">Diésel</option>
          <option value="Híbrido">Híbrido</option>
          <option value="Eléctrico">Eléctrico</option>
        </Select>
        <Select label="Estado" name="status" defaultValue={vehicle?.status ?? "Disponible"}>
          <option value="Disponible">Disponible</option>
          <option value="Reservado">Reservado</option>
          <option value="Vendido">Vendido</option>
        </Select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isNew"
            defaultChecked={vehicle?.isNew}
            style={{ accentColor: "var(--accent)" }}
          />
          Nuevo ingreso
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isVerified"
            defaultChecked={vehicle?.isVerified}
            style={{ accentColor: "var(--accent)" }}
          />
          Verificado
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted">Fotos (máximo 2) — JPG, PNG o WEBP, hasta 8MB</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PhotoField name="image1" existingImageName="existingImage1" existingImageUrl={vehicle?.images[0] ?? ""} />
          <PhotoField name="image2" existingImageName="existingImage2" existingImageUrl={vehicle?.images[1] ?? ""} />
        </div>
      </div>

      <Textarea label="Descripción" name="description" rows={3} defaultValue={vehicle?.description} required />
      <Textarea
        label="Ideal para (frase corta de estilo de vida, ej. “Familias que viajan seguido”)"
        name="idealFor"
        rows={2}
        defaultValue={vehicle?.idealFor}
        required
      />

      <button
        type="submit"
        className="font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
