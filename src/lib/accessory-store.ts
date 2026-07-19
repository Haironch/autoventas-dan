import { prisma } from "@/lib/prisma";
import type { Accessory } from "@/lib/types";
import type { Accessory as AccessoryRecord } from "@prisma/client";

function toAppAccessory(record: AccessoryRecord): Accessory {
  return {
    id: record.id,
    name: record.name,
    brand: record.brand,
    price: record.price,
    inStock: record.inStock,
    description: record.description,
  };
}

function toDbData(data: Omit<Accessory, "id">) {
  return {
    name: data.name,
    brand: data.brand,
    price: data.price,
    inStock: data.inStock,
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
  while (await prisma.accessory.findUnique({ where: { id } })) {
    id = `${base}-${counter}`;
    counter++;
  }
  return id;
}

export async function listAccessories(): Promise<Accessory[]> {
  const records = await prisma.accessory.findMany({ orderBy: { createdAt: "desc" } });
  return records.map(toAppAccessory);
}

export async function getAccessoryById(id: string): Promise<Accessory | undefined> {
  const record = await prisma.accessory.findUnique({ where: { id } });
  return record ? toAppAccessory(record) : undefined;
}

export async function createAccessory(data: Omit<Accessory, "id">): Promise<Accessory> {
  const id = await uniqueId(slugify(data.name));
  const record = await prisma.accessory.create({ data: { id, ...toDbData(data) } });
  return toAppAccessory(record);
}

export async function updateAccessory(id: string, data: Omit<Accessory, "id">): Promise<Accessory | undefined> {
  try {
    const record = await prisma.accessory.update({ where: { id }, data: toDbData(data) });
    return toAppAccessory(record);
  } catch {
    return undefined;
  }
}

export async function deleteAccessory(id: string): Promise<void> {
  await prisma.accessory.delete({ where: { id } }).catch(() => undefined);
}
