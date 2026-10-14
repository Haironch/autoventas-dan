/**
 * Puntajes orientativos (0 a 100) para comparar autos en cinco temas que le importan a un comprador.
 *
 * No son mediciones: salen de reglas simples sobre los datos que tenemos de cada auto
 * (consumo, tamaño del motor, categoría, transmisión, año, tracción). Las mismas reglas se
 * aplican a los autos del inventario y a los externos para que sean comparables entre sí.
 */

export type CategoryKey =
  | "subcompact"
  | "compact"
  | "hatchback"
  | "coupe"
  | "twoseater"
  | "midsize"
  | "wagon"
  | "suv"
  | "pickup"
  | "large"
  | "van";

export type DriveKey = "fwd" | "rwd" | "awd" | "4x4";

export type AxisKey = "economy" | "speed" | "comfort" | "space" | "terrain";

export type Scores = Record<AxisKey, number | null>;

export interface ScoreInput {
  category: CategoryKey;
  displacementLiters: number | null;
  kmPerGallon: number | null;
  isElectric: boolean;
  automatic: boolean;
  seats: number | null;
  year: number;
  drive: DriveKey | null;
}

export const AXES: { key: AxisKey; label: string; rule: string }[] = [
  {
    key: "economy",
    label: "Economía",
    rule: "Según el consumo de combustible: 20 km/gal o menos suma 0 y 70 km/gal o más suma 100. Los eléctricos suman 100.",
  },
  {
    key: "speed",
    label: "Velocidad",
    rule: "Potencia estimada por el tamaño del motor: 1.0 L suma 0 y 5.0 L suma 100. No considera turbo; los eléctricos se estiman en 80.",
  },
  {
    key: "comfort",
    label: "Comodidad",
    rule: "Según el tamaño de la categoría, más 15 puntos si es automático y hasta 10 por ser más reciente (2005 a 2025).",
  },
  {
    key: "space",
    label: "Espacio familiar",
    rule: "Según la categoría (una van o una SUV rinden más que un coupé), con ajuste por asientos: 7 o más suman, 4 o menos restan.",
  },
  {
    key: "terrain",
    label: "Terreno difícil",
    rule: "SUV y pickup parten con ventaja; la tracción 4x4 o integral suma mucho. En autos del inventario la tracción se deduce del nombre del modelo.",
  },
];

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const scale = (value: number, low: number, high: number) => clamp(((value - low) / (high - low)) * 100);

const COMFORT_BASE: Record<CategoryKey, number> = {
  subcompact: 35,
  compact: 45,
  hatchback: 45,
  coupe: 40,
  twoseater: 30,
  midsize: 60,
  wagon: 62,
  suv: 65,
  pickup: 50,
  large: 75,
  van: 70,
};

const SPACE_BASE: Record<CategoryKey, number> = {
  subcompact: 25,
  compact: 35,
  hatchback: 38,
  coupe: 18,
  twoseater: 5,
  midsize: 55,
  wagon: 70,
  suv: 72,
  pickup: 60,
  large: 70,
  van: 92,
};

const TERRAIN_BASE: Partial<Record<CategoryKey, number>> = {
  suv: 50,
  pickup: 55,
  wagon: 25,
  van: 20,
};
const TERRAIN_DEFAULT = 12;

export function computeScores(input: ScoreInput): Scores {
  const economy = input.isElectric ? 100 : input.kmPerGallon ? scale(input.kmPerGallon, 20, 70) : null;

  const speed = input.isElectric ? 80 : input.displacementLiters ? scale(input.displacementLiters, 1, 5) : null;

  const ageBonus = scale(input.year, 2005, 2025) / 10;
  const comfort = clamp(COMFORT_BASE[input.category] + (input.automatic ? 15 : 0) + ageBonus);

  let seatAdjustment = 0;
  if (input.seats !== null) {
    if (input.seats >= 7) seatAdjustment = 15;
    else if (input.seats >= 6) seatAdjustment = 8;
    else if (input.seats <= 4) seatAdjustment = -10;
  }
  const space = clamp(SPACE_BASE[input.category] + seatAdjustment);

  const driveBonus = input.drive === "4x4" ? 40 : input.drive === "awd" ? 30 : 0;
  const terrain = clamp((TERRAIN_BASE[input.category] ?? TERRAIN_DEFAULT) + driveBonus);

  const round = (value: number | null) => (value === null ? null : Math.round(value));
  return {
    economy: round(economy),
    speed: round(speed),
    comfort: round(comfort),
    space: round(space),
    terrain: round(terrain),
  };
}
