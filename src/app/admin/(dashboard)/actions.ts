"use server";

import { put } from "@vercel/blob";
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

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

async function resolveImageSlot(formData: FormData, index: number): Promise<string | null> {
  const file = formData.get(`image${index}`);
  const isValidImage =
    file instanceof File &&
    file.size > 0 &&
    file.size <= MAX_IMAGE_SIZE_BYTES &&
    ALLOWED_IMAGE_TYPES.includes(file.type);

  if (isValidImage) {
    const blob = await put(`vehicles/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return blob.url;
  }

  const existing = formData.get(`existingImage${index}`);
  return typeof existing === "string" && existing ? existing : null;
}

async function vehicleFromFormData(formData: FormData): Promise<Omit<Vehicle, "id">> {
  const images = (await Promise.all([resolveImageSlot(formData, 1), resolveImageSlot(formData, 2)])).filter(
    (url): url is string => Boolean(url),
  );

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
    images,
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
  await createVehicle(await vehicleFromFormData(formData));
  revalidateVehiclePages();
  redirect("/admin");
}

export async function updateVehicleAction(id: string, formData: FormData) {
  await updateVehicle(id, await vehicleFromFormData(formData));
  revalidateVehiclePages();
  redirect("/admin");
}
