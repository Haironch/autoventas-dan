"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createVehicle, deleteVehicle, updateVehicle } from "@/lib/vehicle-store";
import type { Vehicle } from "@/lib/types";

function revalidateVehiclePages() {
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  revalidatePath("/comparar");
  revalidatePath("/");
}

function vehicleFromFormData(formData: FormData): Omit<Vehicle, "id"> {
  return {
    brand: String(formData.get("brand")),
    model: String(formData.get("model")),
    year: Number(formData.get("year")),
    price: Number(formData.get("price")),
    mileageKm: Number(formData.get("mileageKm")),
    transmission: formData.get("transmission") as Vehicle["transmission"],
    fuelType: formData.get("fuelType") as Vehicle["fuelType"],
    status: formData.get("status") as Vehicle["status"],
    bodyType: formData.get("bodyType") as Vehicle["bodyType"],
    seats: Number(formData.get("seats")),
    engineDisplacementLiters: Number(formData.get("engineDisplacementLiters")),
    fuelConsumptionKmPerGalon: Number(formData.get("fuelConsumptionKmPerGalon")),
    isNew: formData.get("isNew") === "on",
    isVerified: formData.get("isVerified") === "on",
    description: String(formData.get("description")),
    idealFor: String(formData.get("idealFor")),
  };
}

export async function deleteVehicleAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id === "string") {
    await deleteVehicle(id);
    revalidateVehiclePages();
  }
}

export async function createVehicleAction(formData: FormData) {
  await createVehicle(vehicleFromFormData(formData));
  revalidateVehiclePages();
  redirect("/admin");
}

export async function updateVehicleAction(id: string, formData: FormData) {
  await updateVehicle(id, vehicleFromFormData(formData));
  revalidateVehiclePages();
  redirect("/admin");
}
