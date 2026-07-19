export type Transmission = "Automático" | "Manual";
export type FuelType = "Gasolina" | "Diésel" | "Híbrido" | "Eléctrico";
export type VehicleStatus = "Disponible" | "Reservado" | "Vendido";
export type BodyType = "Sedán" | "Hatchback" | "SUV" | "Pickup";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileageKm: number;
  transmission: Transmission;
  fuelType: FuelType;
  status: VehicleStatus;
  isNew: boolean;
  isVerified: boolean;
  description: string;
  bodyType: BodyType;
  seats: number;
  engineDisplacementLiters: number;
  fuelConsumptionKmPerGalon: number;
  /** Frase curada por el administrador: para quién es ideal este vehículo. */
  idealFor: string;
  /** URLs de Vercel Blob, máximo 2 fotos. */
  images: string[];
}

export type ProductCategory = "Frenos" | "Filtros" | "Iluminación" | "Lubricantes" | "Accesorios";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  inStock: boolean;
  compatibility: string;
  description: string;
}

export interface Accessory {
  id: string;
  name: string;
  brand: string;
  price: number;
  inStock: boolean;
  description: string;
}

export type IssueSeverity = "Leve" | "Moderada" | "Grave";

export interface CommonIssue {
  id: string;
  brand: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  title: string;
  description: string;
  severity: IssueSeverity;
  estimatedRepairCost: number | null;
}
