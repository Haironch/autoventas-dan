import { prisma } from "@/lib/prisma";
import type {
  Vehicle,
  Transmission,
  FuelType,
  VehicleStatus,
  BodyType,
} from "@/lib/types";
import type { Vehicle as VehicleRecord } from "@prisma/client";

const TRANSMISSION_TO_DB: Record<Transmission, "AUTOMATICO" | "MANUAL"> = {
  Automático: "AUTOMATICO",
  Manual: "MANUAL",
};
const TRANSMISSION_FROM_DB: Record<string, Transmission> = {
  AUTOMATICO: "Automático",
  MANUAL: "Manual",
};

const FUEL_TYPE_TO_DB: Record<FuelType, "GASOLINA" | "DIESEL" | "HIBRIDO" | "ELECTRICO"> = {
  Gasolina: "GASOLINA",
  Diésel: "DIESEL",
  Híbrido: "HIBRIDO",
  Eléctrico: "ELECTRICO",
};
const FUEL_TYPE_FROM_DB: Record<string, FuelType> = {
  GASOLINA: "Gasolina",
  DIESEL: "Diésel",
  HIBRIDO: "Híbrido",
  ELECTRICO: "Eléctrico",
};

const STATUS_TO_DB: Record<VehicleStatus, "DISPONIBLE" | "RESERVADO" | "VENDIDO"> = {
  Disponible: "DISPONIBLE",
  Reservado: "RESERVADO",
  Vendido: "VENDIDO",
};
const STATUS_FROM_DB: Record<string, VehicleStatus> = {
  DISPONIBLE: "Disponible",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
};

const BODY_TYPE_TO_DB: Record<BodyType, "SEDAN" | "HATCHBACK" | "SUV" | "PICKUP"> = {
  Sedán: "SEDAN",
  Hatchback: "HATCHBACK",
  SUV: "SUV",
  Pickup: "PICKUP",
};
const BODY_TYPE_FROM_DB: Record<string, BodyType> = {
  SEDAN: "Sedán",
  HATCHBACK: "Hatchback",
  SUV: "SUV",
  PICKUP: "Pickup",
};

function toAppVehicle(record: VehicleRecord): Vehicle {
  return {
    id: record.id,
    brand: record.brand,
    model: record.model,
    year: record.year,
    price: record.price,
    mileageKm: record.mileageKm,
    transmission: TRANSMISSION_FROM_DB[record.transmission],
    fuelType: FUEL_TYPE_FROM_DB[record.fuelType],
    status: STATUS_FROM_DB[record.status],
    isNew: record.isNew,
    isVerified: record.isVerified,
    description: record.description,
    bodyType: BODY_TYPE_FROM_DB[record.bodyType],
    seats: record.seats,
    engineDisplacementLiters: record.engineDisplacementLiters,
    fuelConsumptionKmPerGalon: record.fuelConsumptionKmPerGalon,
    idealFor: record.idealFor,
  };
}

function toDbData(data: Omit<Vehicle, "id">) {
  return {
    brand: data.brand,
    model: data.model,
    year: data.year,
    price: data.price,
    mileageKm: data.mileageKm,
    transmission: TRANSMISSION_TO_DB[data.transmission],
    fuelType: FUEL_TYPE_TO_DB[data.fuelType],
    status: STATUS_TO_DB[data.status],
    isNew: data.isNew,
    isVerified: data.isVerified,
    description: data.description,
    bodyType: BODY_TYPE_TO_DB[data.bodyType],
    seats: data.seats,
    engineDisplacementLiters: data.engineDisplacementLiters,
    fuelConsumptionKmPerGalon: data.fuelConsumptionKmPerGalon,
    idealFor: data.idealFor,
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
  while (await prisma.vehicle.findUnique({ where: { id } })) {
    id = `${base}-${counter}`;
    counter++;
  }
  return id;
}

export async function listVehicles(): Promise<Vehicle[]> {
  const records = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
  return records.map(toAppVehicle);
}

export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
  const record = await prisma.vehicle.findUnique({ where: { id } });
  return record ? toAppVehicle(record) : undefined;
}

export async function createVehicle(data: Omit<Vehicle, "id">): Promise<Vehicle> {
  const id = await uniqueId(slugify(`${data.brand}-${data.model}-${data.year}`));
  const record = await prisma.vehicle.create({ data: { id, ...toDbData(data) } });
  return toAppVehicle(record);
}

export async function updateVehicle(id: string, data: Omit<Vehicle, "id">): Promise<Vehicle | undefined> {
  try {
    const record = await prisma.vehicle.update({ where: { id }, data: toDbData(data) });
    return toAppVehicle(record);
  } catch {
    return undefined;
  }
}

export async function deleteVehicle(id: string): Promise<void> {
  await prisma.vehicle.delete({ where: { id } }).catch(() => undefined);
}
