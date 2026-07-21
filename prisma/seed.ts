import { vehicles } from "../src/lib/vehicles";
import { products } from "../src/lib/products";
import { accessories } from "../src/lib/accessories";
import { prisma } from "../src/lib/prisma";
import type {
  Transmission as AppTransmission,
  FuelType as AppFuelType,
  VehicleStatus as AppVehicleStatus,
  BodyType as AppBodyType,
  ProductCategory as AppProductCategory,
} from "../src/lib/types";

const TRANSMISSION_MAP: Record<AppTransmission, "AUTOMATICO" | "MANUAL"> = {
  Automático: "AUTOMATICO",
  Manual: "MANUAL",
};

const FUEL_TYPE_MAP: Record<AppFuelType, "GASOLINA" | "DIESEL" | "HIBRIDO" | "ELECTRICO"> = {
  Gasolina: "GASOLINA",
  Diésel: "DIESEL",
  Híbrido: "HIBRIDO",
  Eléctrico: "ELECTRICO",
};

const STATUS_MAP: Record<AppVehicleStatus, "DISPONIBLE" | "RESERVADO" | "VENDIDO"> = {
  Disponible: "DISPONIBLE",
  Reservado: "RESERVADO",
  Vendido: "VENDIDO",
};

const BODY_TYPE_MAP: Record<AppBodyType, "SEDAN" | "HATCHBACK" | "SUV" | "PICKUP" | "COUPE"> = {
  Sedán: "SEDAN",
  Hatchback: "HATCHBACK",
  SUV: "SUV",
  Pickup: "PICKUP",
  Coupé: "COUPE",
};

const PRODUCT_CATEGORY_MAP: Record<
  AppProductCategory,
  "FRENOS" | "FILTROS" | "ILUMINACION" | "LUBRICANTES" | "ACCESORIOS"
> = {
  Frenos: "FRENOS",
  Filtros: "FILTROS",
  Iluminación: "ILUMINACION",
  Lubricantes: "LUBRICANTES",
  Accesorios: "ACCESORIOS",
};

async function main() {
  await prisma.vehicle.deleteMany();
  await prisma.product.deleteMany();
  await prisma.accessory.deleteMany();

  await prisma.vehicle.createMany({
    data: vehicles.map((v) => ({
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      price: v.price,
      mileageKm: v.mileageKm,
      transmission: TRANSMISSION_MAP[v.transmission],
      fuelType: FUEL_TYPE_MAP[v.fuelType],
      status: STATUS_MAP[v.status],
      isNew: v.isNew,
      isVerified: v.isVerified,
      description: v.description,
      bodyType: BODY_TYPE_MAP[v.bodyType],
      seats: v.seats,
      engineDisplacementLiters: v.engineDisplacementLiters,
      fuelConsumptionKmPerGalon: v.fuelConsumptionKmPerGalon,
      idealFor: v.idealFor,
    })),
  });

  await prisma.product.createMany({
    data: products.map((p) => ({
      id: p.id,
      name: p.name,
      category: PRODUCT_CATEGORY_MAP[p.category],
      price: p.price,
      inStock: p.inStock,
      compatibility: p.compatibility,
      description: p.description,
    })),
  });

  await prisma.accessory.createMany({
    data: accessories.map((a) => ({
      id: a.id,
      name: a.name,
      brand: a.brand,
      price: a.price,
      inStock: a.inStock,
      description: a.description,
    })),
  });

  console.log(
    `Seed listo: ${vehicles.length} vehículos, ${products.length} repuestos, ${accessories.length} accesorios.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
