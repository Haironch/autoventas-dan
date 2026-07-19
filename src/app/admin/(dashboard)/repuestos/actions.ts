"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProduct, deleteProduct, updateProduct } from "@/lib/product-store";
import type { Product } from "@/lib/types";

function revalidateProductPages() {
  revalidatePath("/admin/repuestos");
  revalidatePath("/repuestos");
  revalidatePath("/carrito");
}

function productFromFormData(formData: FormData): Omit<Product, "id"> {
  return {
    name: String(formData.get("name")),
    category: formData.get("category") as Product["category"],
    price: Number(formData.get("price")),
    inStock: formData.get("inStock") === "on",
    compatibility: String(formData.get("compatibility")),
    description: String(formData.get("description")),
  };
}

export async function deleteProductAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id === "string") {
    await deleteProduct(id);
    revalidateProductPages();
  }
}

export async function createProductAction(formData: FormData) {
  await createProduct(productFromFormData(formData));
  revalidateProductPages();
  redirect("/admin/repuestos");
}

export async function updateProductAction(id: string, formData: FormData) {
  await updateProduct(id, productFromFormData(formData));
  revalidateProductPages();
  redirect("/admin/repuestos");
}
