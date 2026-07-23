"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { BodyType, Transmission, FuelType } from "@/lib/types";

type Condition = "Excelente" | "Bueno" | "Regular" | "Necesita reparaciones";

const BODY_TYPES: BodyType[] = ["Sedán", "Hatchback", "SUV", "Pickup", "Coupé"];
const TRANSMISSIONS: Transmission[] = ["Automático", "Manual"];
const FUEL_TYPES: FuelType[] = ["Gasolina", "Diésel", "Híbrido", "Eléctrico"];
const CONDITIONS: Condition[] = ["Excelente", "Bueno", "Regular", "Necesita reparaciones"];
const CURRENT_YEAR = new Date().getFullYear();

const currency = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

export function VenderForm() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [mileageKm, setMileageKm] = useState<number | "">("");
  const [bodyType, setBodyType] = useState<BodyType>("Sedán");
  const [transmission, setTransmission] = useState<Transmission>("Automático");
  const [fuelType, setFuelType] = useState<FuelType>("Gasolina");
  const [condition, setCondition] = useState<Condition>("Bueno");
  const [expectedPrice, setExpectedPrice] = useState<number | "">("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const hasValidInput = brand.trim() !== "" && model.trim() !== "" && typeof year === "number" && typeof mileageKm === "number";

  function buildWhatsAppUrl() {
    const lines = [
      name.trim() ? `Hola, soy ${name.trim()} y quiero vender mi vehículo en Autoventas Dan.` : "Hola, quiero vender mi vehículo en Autoventas Dan.",
      "",
      `Vehículo: ${brand} ${model} ${year}`.trim(),
      `Kilometraje: ${typeof mileageKm === "number" ? mileageKm.toLocaleString("es-GT") : "-"} km`,
      `Tipo: ${bodyType}`,
      `Transmisión: ${transmission}`,
      `Combustible: ${fuelType}`,
      `Estado general: ${condition}`,
      `Precio esperado: ${typeof expectedPrice === "number" && expectedPrice > 0 ? currency.format(expectedPrice) : "No especificado"}`,
    ];

    if (notes.trim()) {
      lines.push("", `Observaciones: ${notes.trim()}`);
    }

    lines.push(
      "",
      "Esta valoración es preliminar y puede ajustarse tras una evaluación física del vehículo.",
    );

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  return (
    <>
      <Card className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Toyota" />
          <TextField label="Modelo" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Corolla" />
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
            label="Kilometraje"
            type="number"
            value={mileageKm}
            onChange={(e) => setMileageKm(e.target.value ? Number(e.target.value) : "")}
            placeholder="65000"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select label="Tipo de vehículo" value={bodyType} onChange={(e) => setBodyType(e.target.value as BodyType)}>
            {BODY_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
          <Select
            label="Transmisión"
            value={transmission}
            onChange={(e) => setTransmission(e.target.value as Transmission)}
          >
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select label="Combustible" value={fuelType} onChange={(e) => setFuelType(e.target.value as FuelType)}>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select label="Estado general" value={condition} onChange={(e) => setCondition(e.target.value as Condition)}>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <TextField
            label="Precio esperado (Q, opcional)"
            type="number"
            value={expectedPrice}
            onChange={(e) => setExpectedPrice(e.target.value ? Number(e.target.value) : "")}
            placeholder="95000"
          />
        </div>

        <TextField
          label="Tu nombre (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Ana López"
        />

        <Textarea
          label="Observaciones (opcional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Ej. único dueño, mantenimientos al día, algún detalle a mencionar"
        />
      </Card>

      <Card className="p-5 space-y-3">
        <div className="bg-accent-soft rounded-lg px-4 py-3">
          <p className="text-sm text-accent-soft-foreground">
            Esta valoración es preliminar y puede ajustarse tras una evaluación física del vehículo.
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
          Solicitar valoración por WhatsApp
        </a>
      </Card>
    </>
  );
}
