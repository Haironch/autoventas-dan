import { vehicles as seedVehicles } from "@/lib/vehicles";
import type { Vehicle } from "@/lib/types";

/**
 * Store en memoria (no persiste entre reinicios del servidor ni recompilaciones
 * de Turbopack). Suficiente para probar el flujo de administrador; cuando se
 * conecte una base de datos real, estas funciones se reemplazan por consultas
 * a Prisma manteniendo la misma firma.
 */
let vehicles: Vehicle[] = [...seedVehicles];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueId(base: string) {
  let id = base;
  let counter = 2;
  while (vehicles.some((v) => v.id === id)) {
    id = `${base}-${counter}`;
    counter++;
  }
  return id;
}

export function listVehicles(): Vehicle[] {
  return vehicles;
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function createVehicle(data: Omit<Vehicle, "id">): Vehicle {
  const id = uniqueId(slugify(`${data.brand}-${data.model}-${data.year}`));
  const vehicle: Vehicle = { ...data, id };
  vehicles = [vehicle, ...vehicles];
  return vehicle;
}

export function updateVehicle(id: string, data: Omit<Vehicle, "id">): Vehicle | undefined {
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return undefined;
  const updated: Vehicle = { ...data, id };
  vehicles = vehicles.map((v, i) => (i === index ? updated : v));
  return updated;
}

export function deleteVehicle(id: string) {
  vehicles = vehicles.filter((v) => v.id !== id);
}
