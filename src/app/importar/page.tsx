"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { calculateImportEstimate } from "@/lib/import-calculator";
import { cn } from "@/lib/utils";
import type { BodyType } from "@/lib/types";

type VehicleCondition = "Running" | "Salvage" | "Rebuilt";

const BODY_TYPES: BodyType[] = ["Sedán", "Hatchback", "SUV", "Pickup", "Coupé"];
const CONDITIONS: VehicleCondition[] = ["Running", "Salvage", "Rebuilt"];
const CURRENT_YEAR = new Date().getFullYear();

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function ImportarPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [bodyType, setBodyType] = useState<BodyType>("Sedán");
  const [condition, setCondition] = useState<VehicleCondition>("Running");

  const estimate = useMemo(
    () =>
      calculateImportEstimate({
        year: typeof year === "number" ? year : CURRENT_YEAR,
        purchasePriceUsd: typeof price === "number" ? price : 0,
      }),
    [year, price],
  );

  const hasValidInput = typeof year === "number" && typeof price === "number" && price > 0;

  function buildWhatsAppUrl() {
    const vehicleLabel = [brand, model, year || ""].filter(Boolean).join(" ");
    const lines = [
      "Hola, quiero asesoría personalizada para importar un vehículo.",
      "",
      vehicleLabel ? `Vehículo: ${vehicleLabel}` : "Vehículo: (sin especificar)",
      `Tipo: ${bodyType}`,
      `Estado: ${condition}`,
      `Precio de compra (USA): ${usd.format(typeof price === "number" ? price : 0)}`,
      "",
      "Estimado inicial del sistema:",
      `- Valor base: ${usd.format(estimate.baseValue)}`,
      `- IPRIMA (${Math.round(estimate.iprimaRate * 100)}%): ${usd.format(estimate.iprima)}`,
      `- IVA (12%): ${usd.format(estimate.iva)}`,
      `- Total estimado: ${usd.format(estimate.total)}`,
      "",
      "Este cálculo es un estimado inicial y puede variar según costos logísticos, aduanales y condiciones del vehículo.",
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-10 space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Calculadora de importación</h1>
        <p className="text-sm text-muted mt-1 max-w-xl">
          Estima cuánto te costaría traer un vehículo desde USA a Guatemala, antes de comprometerte con una
          cotización.
        </p>
      </div>

      <Card className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Mazda" />
          <TextField label="Modelo" value={model} onChange={(e) => setModel(e.target.value)} placeholder="3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField
            label="Año"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
            placeholder={String(CURRENT_YEAR)}
          />
          <TextField
            label="Precio de compra en USA (USD)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
            placeholder="18000"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select label="Tipo de vehículo" value={bodyType} onChange={(e) => setBodyType(e.target.value as BodyType)}>
            {BODY_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
          <Select
            label="Estado del vehículo"
            value={condition}
            onChange={(e) => setCondition(e.target.value as VehicleCondition)}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-heading font-bold text-lg">Estimado inicial</h2>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Valor base</span>
            <span className="font-medium">{usd.format(estimate.baseValue)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">
              IPRIMA ({Math.round(estimate.iprimaRate * 100)}% · antigüedad {estimate.vehicleAgeYears} años)
            </span>
            <span className="font-medium">{usd.format(estimate.iprima)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">IVA (12%)</span>
            <span className="font-medium">{usd.format(estimate.iva)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
            <span className="font-heading font-bold">Total estimado</span>
            <span className="font-heading font-bold text-xl text-accent">{usd.format(estimate.total)}</span>
          </div>
        </div>

        <div className="bg-accent-soft rounded-lg px-4 py-3">
          <p className="text-sm text-accent-soft-foreground">
            Este cálculo es un estimado inicial y puede variar según costos logísticos, aduanales y condiciones del
            vehículo.
          </p>
        </div>

        <a
          href={hasValidInput ? buildWhatsAppUrl() : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!hasValidInput}
          onClick={(e) => {
            if (!hasValidInput) e.preventDefault();
          }}
          className={cn(
            "block text-center w-full font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg transition-colors",
            hasValidInput
              ? "bg-accent text-accent-foreground hover:bg-accent-hover"
              : "bg-accent text-accent-foreground opacity-40 cursor-not-allowed",
          )}
        >
          Solicitar asesoría personalizada por WhatsApp
        </a>
      </Card>
    </main>
  );
}
