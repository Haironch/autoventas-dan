/**
 * Cliente de fueleconomy.gov (servicio público del gobierno de EE. UU., sin llave).
 * Sirve para comparar vehículos que no están en el inventario: cubre casi todos los
 * modelos vendidos en EE. UU. desde 1984, que es de donde viene la mayoría de lo que se importa.
 */

import { EXTERNAL_VEHICLE_PREFIX } from "@/lib/constants";
import type { CategoryKey, DriveKey } from "@/lib/compare-scores";

const BASE_URL = "https://www.fueleconomy.gov/ws/rest/vehicle";
const MENU_REVALIDATE_SECONDS = 60 * 60 * 24;
const VEHICLE_REVALIDATE_SECONDS = 60 * 60 * 24 * 7;
const KM_PER_MILE = 1.60934;

export interface MenuItem {
  text: string;
  value: string;
}

export type MenuKind = "year" | "make" | "model" | "options";

export interface ExternalVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  displacementLiters: number | null;
  cylinders: number | null;
  transmission: string;
  fuel: string;
  drive: string;
  category: string;
  isElectric: boolean;
  /** Valores normalizados para calcular puntajes de comparación. */
  categoryKey: CategoryKey;
  driveKey: DriveKey | null;
  automatic: boolean;
  /** Rendimiento combinado en km por galón (null en eléctricos). */
  kmPerGallon: number | null;
  /** Solo eléctricos: eficiencia combinada en MPGe. */
  mpge: number | null;
}

interface RawMenuResponse {
  menuItem?: MenuItem | MenuItem[];
}

type RawVehicle = Record<string, string | null | undefined>;

async function fetchJson<T>(url: string, revalidate: number): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/** Cuando el menú tiene una sola opción la API devuelve un objeto en vez de una lista. */
function toArray(menuItem: MenuItem | MenuItem[] | undefined): MenuItem[] {
  if (!menuItem) return [];
  return Array.isArray(menuItem) ? menuItem : [menuItem];
}

export async function fetchMenu(
  kind: MenuKind,
  params: { year?: string; make?: string; model?: string },
): Promise<MenuItem[] | null> {
  const query = new URLSearchParams();
  if (params.year) query.set("year", params.year);
  if (params.make) query.set("make", params.make);
  if (params.model) query.set("model", params.model);

  const suffix = query.size > 0 ? `?${query}` : "";
  const data = await fetchJson<RawMenuResponse>(`${BASE_URL}/menu/${kind}${suffix}`, MENU_REVALIDATE_SECONDS);
  if (!data) return null;

  const items = toArray(data.menuItem);
  return kind === "options" ? numberRepeatedOptions(items.map((item) => ({ ...item, text: formatOptionText(item.text) }))) : items;
}

/** Versiones distintas pueden quedar con el mismo texto al traducirlas; se numeran para poder elegirlas. */
function numberRepeatedOptions(items: MenuItem[]): MenuItem[] {
  const totals = new Map<string, number>();
  for (const item of items) totals.set(item.text, (totals.get(item.text) ?? 0) + 1);

  const seen = new Map<string, number>();
  return items.map((item) => {
    if ((totals.get(item.text) ?? 0) < 2) return item;
    const position = (seen.get(item.text) ?? 0) + 1;
    seen.set(item.text, position);
    return { ...item, text: `${item.text} · variante ${position}` };
  });
}

function toNumber(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatOptionText(text: string): string {
  const translated = translateOptionText(text);
  // Una sola velocidad es típico de los eléctricos; "Automático 1 vel." no se entiende solo.
  return /^Automático 1 vel\./.test(translated) ? translated.replace("Automático 1 vel.", "Eléctrico · 1 velocidad") : translated;
}

function translateOptionText(text: string): string {
  return text
    .replace(/^Automatic|^Auto/i, "Automático")
    .replace(/^Manual|^Man/i, "Manual")
    .replace(/variable gear ratios|\bAV(-S\d+)?\b/i, "CVT")
    .replace(/\((?:S|AM-S|SA-S?|A)(\d+)\)/i, "$1 vel.")
    .replace(/(\d+)-spd/gi, "$1 vel.")
    .replace(/(\d+) cyl/gi, "$1 cil.")
    .replace(/Electricity|Electric Motor/i, "Motor eléctrico");
}

function translateTransmission(raw: string | null | undefined): string {
  if (!raw) return "—";
  if (/^man/i.test(raw)) {
    const speeds = raw.match(/(\d+)-spd/)?.[1];
    return speeds ? `Manual ${speeds} vel.` : "Manual";
  }
  if (/variable gear ratios|\(AV/i.test(raw)) return "Automático (CVT)";
  const speeds = raw.match(/(\d+)-spd/)?.[1] ?? raw.match(/\((?:S|AM-S|SA)(\d+)\)/)?.[1];
  return speeds ? `Automático ${speeds} vel.` : "Automático";
}

function translateFuel(vehicle: RawVehicle): string {
  const atv = vehicle.atvType ?? "";
  const fuel = vehicle.fuelType1 ?? vehicle.fuelType ?? "";
  if (/hybrid/i.test(atv)) return "Híbrido";
  if (/^ev$/i.test(atv) || /electric/i.test(fuel)) return "Eléctrico";
  if (/diesel/i.test(fuel)) return "Diésel";
  if (/premium/i.test(fuel)) return "Gasolina premium";
  return "Gasolina";
}

function classifyDrive(raw: string | null | undefined): { key: DriveKey | null; label: string } {
  if (!raw) return { key: null, label: "—" };
  if (/front/i.test(raw)) return { key: "fwd", label: "Delantera (FWD)" };
  if (/rear/i.test(raw)) return { key: "rwd", label: "Trasera (RWD)" };
  if (/all-wheel/i.test(raw) && !/4-wheel/i.test(raw)) return { key: "awd", label: "Integral (AWD)" };
  if (/4-wheel|all-wheel/i.test(raw)) return { key: "4x4", label: "4x4" };
  return { key: null, label: raw };
}

// El orden importa: "subcompact" contiene "compact" y "station wagon" contiene "midsize".
const CATEGORY_RULES: { pattern: RegExp; key: CategoryKey; label: string }[] = [
  { pattern: /two seater/i, key: "twoseater", label: "Biplaza" },
  { pattern: /station wagon/i, key: "wagon", label: "Station wagon" },
  { pattern: /pickup/i, key: "pickup", label: "Pickup" },
  { pattern: /minivan|van/i, key: "van", label: "Van / Minivan" },
  { pattern: /sport utility|suv/i, key: "suv", label: "SUV" },
  { pattern: /minicompact|subcompact/i, key: "subcompact", label: "Auto subcompacto" },
  { pattern: /compact/i, key: "compact", label: "Auto compacto" },
  { pattern: /midsize/i, key: "midsize", label: "Auto mediano" },
  { pattern: /large/i, key: "large", label: "Auto grande" },
];

function classifyCategory(raw: string | null | undefined): { key: CategoryKey; label: string } {
  if (!raw) return { key: "midsize", label: "—" };
  const rule = CATEGORY_RULES.find((candidate) => candidate.pattern.test(raw));
  return rule ? { key: rule.key, label: rule.label } : { key: "midsize", label: raw };
}

export function parseExternalId(value: string | undefined): string | null {
  if (!value?.startsWith(EXTERNAL_VEHICLE_PREFIX)) return null;
  const id = value.slice(EXTERNAL_VEHICLE_PREFIX.length);
  return /^\d{1,8}$/.test(id) ? id : null;
}

export async function getExternalVehicle(id: string): Promise<ExternalVehicle | null> {
  const raw = await fetchJson<RawVehicle>(`${BASE_URL}/${id}`, VEHICLE_REVALIDATE_SECONDS);
  const year = toNumber(raw?.year);
  if (!raw || !year || !raw.make || !raw.model) return null;

  const fuel = translateFuel(raw);
  const isElectric = fuel === "Eléctrico";
  const combinedMpg = toNumber(raw.comb08);
  const drive = classifyDrive(raw.drive);
  const category = classifyCategory(raw.VClass);

  return {
    id,
    year,
    make: raw.make,
    model: raw.model,
    displacementLiters: toNumber(raw.displ),
    cylinders: toNumber(raw.cylinders),
    transmission: translateTransmission(raw.trany),
    fuel,
    drive: drive.label,
    driveKey: drive.key,
    category: category.label,
    categoryKey: category.key,
    automatic: !/^man/i.test(raw.trany ?? ""),
    isElectric,
    kmPerGallon: !isElectric && combinedMpg ? Math.round(combinedMpg * KM_PER_MILE) : null,
    mpge: isElectric ? combinedMpg : null,
  };
}
