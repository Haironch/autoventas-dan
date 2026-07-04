/**
 * Fase 1 (MVP) del módulo de importación: solo Valor Base, IPRIMA e IVA.
 * Rate de transporte en USA, flete marítimo, seguro, cambio de divisas,
 * gastos aduanales adicionales, honorarios, transporte interno y placas
 * quedan para fases futuras.
 */

/** Tabla configurable de tasas IPRIMA según antigüedad del vehículo. Ajustar aquí. */
export const IPRIMA_BRACKETS: { maxAgeYears: number; rate: number }[] = [
  { maxAgeYears: 1, rate: 0.2 },
  { maxAgeYears: 2, rate: 0.18 },
  { maxAgeYears: 3, rate: 0.16 },
  { maxAgeYears: 4, rate: 0.14 },
  { maxAgeYears: 5, rate: 0.12 },
  { maxAgeYears: Infinity, rate: 0.1 },
];

export const IVA_RATE = 0.12;

export interface ImportEstimateInput {
  year: number;
  purchasePriceUsd: number;
}

export interface ImportEstimate {
  vehicleAgeYears: number;
  baseValue: number;
  iprimaRate: number;
  iprima: number;
  iva: number;
  total: number;
}

export function getIprimaRate(vehicleAgeYears: number): number {
  const bracket = IPRIMA_BRACKETS.find((b) => vehicleAgeYears <= b.maxAgeYears);
  return bracket ? bracket.rate : IPRIMA_BRACKETS[IPRIMA_BRACKETS.length - 1].rate;
}

export function calculateImportEstimate({ year, purchasePriceUsd }: ImportEstimateInput): ImportEstimate {
  const vehicleAgeYears = Math.max(0, new Date().getFullYear() - year);
  const baseValue = Math.max(0, purchasePriceUsd);
  const iprimaRate = getIprimaRate(vehicleAgeYears);
  const iprima = baseValue * iprimaRate;
  const iva = (baseValue + iprima) * IVA_RATE;
  const total = baseValue + iprima + iva;

  return { vehicleAgeYears, baseValue, iprimaRate, iprima, iva, total };
}
