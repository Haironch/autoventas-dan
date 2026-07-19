"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAccessory, deleteAccessory, updateAccessory } from "@/lib/accessory-store";
import type { Accessory } from "@/lib/types";

function revalidateAccessoryPages() {
  revalidatePath("/admin/accesorios");
  revalidatePath("/accesorios");
  revalidatePath("/carrito");
}

function accessoryFromFormData(formData: FormData): Omit<Accessory, "id"> {
  return {
    name: String(formData.get("name")),
    brand: String(formData.get("brand")),
    price: Number(formData.get("price")),
    inStock: formData.get("inStock") === "on",
    description: String(formData.get("description")),
  };
}

export async function deleteAccessoryAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id === "string") {
    await deleteAccessory(id);
    revalidateAccessoryPages();
  }
}

export async function createAccessoryAction(formData: FormData) {
  await createAccessory(accessoryFromFormData(formData));
  revalidateAccessoryPages();
  redirect("/admin/accesorios");
}

export async function updateAccessoryAction(id: string, formData: FormData) {
  await updateAccessory(id, accessoryFromFormData(formData));
  revalidateAccessoryPages();
  redirect("/admin/accesorios");
}
