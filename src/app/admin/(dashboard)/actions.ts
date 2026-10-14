"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createVehicle, deleteVehicle, getVehicleById, updateVehicle } from "@/lib/vehicle-store";
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

/** Borra fotos del almacenamiento; si falla no bloquea la operación (solo queda un archivo huérfano). */
async function deleteBlobImages(urls: string[]) {
  const blobUrls = urls.filter((url) => url.includes(".public.blob.vercel-storage.com"));
  if (blobUrls.length === 0) return;

  try {
    await del(blobUrls);
  } catch (error) {
    console.error("No se pudieron borrar fotos de Blob", error);
  }
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
    const vehicle = await getVehicleById(id);
    await deleteVehicle(id);
    if (vehicle) await deleteBlobImages(vehicle.images);
    revalidateVehiclePages();
  }
}

export async function createVehicleAction(formData: FormData) {
  await createVehicle(await vehicleFromFormData(formData));
  revalidateVehiclePages();
  redirect("/admin");
}

export async function updateVehicleAction(id: string, formData: FormData) {
  const previous = await getVehicleById(id);
  const data = await vehicleFromFormData(formData);
  const updated = await updateVehicle(id, data);
  if (updated && previous) {
    await deleteBlobImages(previous.images.filter((url) => !data.images.includes(url)));
  }
  revalidateVehiclePages();
  redirect("/admin");
}
