import { computeScores, type CategoryKey, type DriveKey, type Scores } from "@/lib/compare-scores";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import type { ExternalVehicle } from "@/lib/fuel-economy";
import type { Vehicle } from "@/lib/types";

export const NO_DATA = "—";

export type RowKey =
  | "category"
  | "seats"
  | "displacement"
  | "cylinders"
  | "consumption"
  | "transmission"
  | "fuel"
  | "drive"
  | "price"
  | "year"
  | "mileage"
  | "status";

export const ROWS: { key: RowKey; label: string }[] = [
  { key: "category", label: "Categoría" },
  { key: "seats", label: "Pasajeros" },
  { key: "displacement", label: "Cilindraje" },
  { key: "cylinders", label: "Cilindros" },
  { key: "consumption", label: "Consumo" },
  { key: "transmission", label: "Transmisión" },
  { key: "fuel", label: "Combustible" },
  { key: "drive", label: "Tracción" },
  { key: "price", label: "Precio" },
  { key: "year", label: "Año" },
  { key: "mileage", label: "Kilometraje" },
  { key: "status", label: "Estado" },
];

export interface CompareColumn {
  key: string;
  title: string;
  source: "inventory" | "external";
  badge: string;
  /** Texto principal de la tarjeta: "Ideal para" en inventario, resumen técnico en externos. */
  summaryLabel: string;
  summary: string;
  rows: Record<RowKey, string>;
  scores: Scores;
  cta?: { href: string; label: string };
}

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

const BODY_TYPE_CATEGORY: Record<Vehicle["bodyType"], CategoryKey> = {
  Sedán: "midsize",
  Hatchback: "hatchback",
  SUV: "suv",
  Pickup: "pickup",
  Coupé: "coupe",
};

/** El inventario no tiene un campo de tracción: se deduce del nombre ("RAV4 Sport 4x4", "CRV AWD EX"). */
function driveFromName(vehicle: Vehicle): DriveKey | null {
  const name = `${vehicle.brand} ${vehicle.model}`;
  if (/\b(4x4|4wd)\b/i.test(name)) return "4x4";
  if (/\bawd\b/i.test(name)) return "awd";
  return null;
}

export function inventoryColumn(vehicle: Vehicle): CompareColumn {
  return {
    key: `v:${vehicle.id}`,
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    source: "inventory",
    badge: vehicle.bodyType,
    summaryLabel: "Ideal para",
    summary: vehicle.idealFor,
    rows: {
      category: vehicle.bodyType,
      seats: `${vehicle.seats} personas`,
      displacement: `${vehicle.engineDisplacementLiters.toFixed(1)}L`,
      cylinders: NO_DATA,
      consumption: `${vehicle.fuelConsumptionKmPerGalon} km/gal`,
      transmission: vehicle.transmission,
      fuel: vehicle.fuelType,
      drive: NO_DATA,
      price: currency.format(vehicle.price),
      year: String(vehicle.year),
      mileage: `${vehicle.mileageKm.toLocaleString("es-GT")} km`,
      status: vehicle.status,
    },
    scores: computeScores({
      category: BODY_TYPE_CATEGORY[vehicle.bodyType],
      displacementLiters: vehicle.engineDisplacementLiters,
      kmPerGallon: vehicle.fuelConsumptionKmPerGalon,
      isElectric: vehicle.fuelType === "Eléctrico",
      automatic: vehicle.transmission === "Automático",
      seats: vehicle.seats,
      year: vehicle.year,
      drive: driveFromName(vehicle),
    }),
  };
}

export function externalColumn(vehicle: ExternalVehicle): CompareColumn {
  const title = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
  const displacement = vehicle.displacementLiters ? `${vehicle.displacementLiters.toFixed(1)}L` : NO_DATA;

  let consumption = NO_DATA;
  if (vehicle.kmPerGallon) consumption = `${vehicle.kmPerGallon} km/gal`;
  if (vehicle.mpge) consumption = `Eléctrico · ${vehicle.mpge} MPGe`;

  const summaryParts = [displacement, vehicle.transmission, vehicle.drive].filter((part) => part !== NO_DATA);
  const message = `Hola, me interesa un ${title}. ¿Pueden conseguirlo o tienen algo similar?`;

  return {
    key: `fe:${vehicle.id}`,
    title,
    source: "external",
    badge: "Referencia · no está en inventario",
    summaryLabel: "Ficha técnica",
    summary: summaryParts.join(" · ") || "Datos de referencia",
    rows: {
      category: vehicle.category,
      seats: NO_DATA,
      displacement,
      cylinders: vehicle.cylinders ? String(vehicle.cylinders) : NO_DATA,
      consumption,
      transmission: vehicle.transmission,
      fuel: vehicle.fuel,
      drive: vehicle.drive,
      price: NO_DATA,
      year: String(vehicle.year),
      mileage: NO_DATA,
      status: NO_DATA,
    },
    scores: computeScores({
      category: vehicle.categoryKey,
      displacementLiters: vehicle.displacementLiters,
      kmPerGallon: vehicle.kmPerGallon,
      isElectric: vehicle.isElectric,
      automatic: vehicle.automatic,
      seats: null,
      year: vehicle.year,
      drive: vehicle.driveKey,
    }),
    cta: {
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      label: "Consultar disponibilidad",
    },
  };
}

/** Oculta las filas donde ningún vehículo tiene dato, para no llenar la tabla de guiones. */
export function visibleRows(columns: CompareColumn[]) {
  return ROWS.filter((row) => columns.some((column) => column.rows[row.key] !== NO_DATA));
}
