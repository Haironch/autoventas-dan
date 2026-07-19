import { prisma } from "@/lib/prisma";
import type { Product, ProductCategory } from "@/lib/types";
import type { Product as ProductRecord } from "@prisma/client";

const CATEGORY_TO_DB: Record<ProductCategory, "FRENOS" | "FILTROS" | "ILUMINACION" | "LUBRICANTES" | "ACCESORIOS"> = {
  Frenos: "FRENOS",
  Filtros: "FILTROS",
  Iluminación: "ILUMINACION",
  Lubricantes: "LUBRICANTES",
  Accesorios: "ACCESORIOS",
};
const CATEGORY_FROM_DB: Record<string, ProductCategory> = {
  FRENOS: "Frenos",
  FILTROS: "Filtros",
  ILUMINACION: "Iluminación",
  LUBRICANTES: "Lubricantes",
  ACCESORIOS: "Accesorios",
};

function toAppProduct(record: ProductRecord): Product {
  return {
    id: record.id,
    name: record.name,
    category: CATEGORY_FROM_DB[record.category],
    price: record.price,
    inStock: record.inStock,
    compatibility: record.compatibility,
    description: record.description,
  };
}

function toDbData(data: Omit<Product, "id">) {
  return {
    name: data.name,
    category: CATEGORY_TO_DB[data.category],
    price: data.price,
    inStock: data.inStock,
    compatibility: data.compatibility,
    description: data.description,
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueId(base: string) {
  let id = base;
  let counter = 2;
  while (await prisma.product.findUnique({ where: { id } })) {
    id = `${base}-${counter}`;
    counter++;
  }
  return id;
}

export async function listProducts(): Promise<Product[]> {
  const records = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return records.map(toAppProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const record = await prisma.product.findUnique({ where: { id } });
  return record ? toAppProduct(record) : undefined;
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const id = await uniqueId(slugify(data.name));
  const record = await prisma.product.create({ data: { id, ...toDbData(data) } });
  return toAppProduct(record);
}

export async function updateProduct(id: string, data: Omit<Product, "id">): Promise<Product | undefined> {
  try {
    const record = await prisma.product.update({ where: { id }, data: toDbData(data) });
    return toAppProduct(record);
  } catch {
    return undefined;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } }).catch(() => undefined);
}
