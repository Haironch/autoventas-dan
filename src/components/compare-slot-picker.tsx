"use client";

import { useRef, useState } from "react";
import { EXTERNAL_VEHICLE_PREFIX } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/fuel-economy";

const SELECT_CLASS =
  "w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-accent outline-none transition-colors disabled:opacity-60";

interface CompareSlotPickerProps {
  name: string;
  label: string;
  inventory: { value: string; label: string }[];
  initialValue: string;
  /** Texto del auto externo ya elegido (la página lo resuelve en el servidor). */
  initialExternalLabel?: string;
}

type Mode = "inventory" | "external";

export function CompareSlotPicker({
  name,
  label,
  inventory,
  initialValue,
  initialExternalLabel,
}: CompareSlotPickerProps) {
  const startsExternal = initialValue.startsWith(EXTERNAL_VEHICLE_PREFIX);

  const [mode, setMode] = useState<Mode>(startsExternal ? "external" : "inventory");
  const [value, setValue] = useState(initialValue);
  const [externalLabel, setExternalLabel] = useState(initialExternalLabel ?? "");
  const [editing, setEditing] = useState(false);

  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [years, setYears] = useState<MenuItem[]>([]);
  const [makes, setMakes] = useState<MenuItem[]>([]);
  const [models, setModels] = useState<MenuItem[]>([]);
  const [options, setOptions] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solo se aplica la respuesta de la consulta más reciente (el usuario puede cambiar de opción rápido).
  const latestRequest = useRef(0);

  async function loadMenu(params: Record<string, string>): Promise<MenuItem[] | null> {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/autos?${new URLSearchParams(params)}`);
      const data = (await response.json()) as { items?: MenuItem[] };
      if (requestId !== latestRequest.current) return null;
      if (!response.ok || !data.items) throw new Error("menu");
      return data.items;
    } catch {
      if (requestId === latestRequest.current) {
        setError("No se pudo cargar la lista de autos. Intenta de nuevo en un momento.");
      }
      return null;
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }

  async function openSearch() {
    setEditing(true);
    if (years.length > 0) return;
    const items = await loadMenu({ type: "year" });
    if (items) setYears(items);
  }

  function chooseMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setValue("");
    setExternalLabel("");
    setError(null);
    if (next === "external") void openSearch();
    else setEditing(false);
  }

  async function handleYear(nextYear: string) {
    setYear(nextYear);
    setMake("");
    setModel("");
    setMakes([]);
    setModels([]);
    setOptions([]);
    if (!nextYear) return;
    const items = await loadMenu({ type: "make", year: nextYear });
    if (items) setMakes(items);
  }

  async function handleMake(nextMake: string) {
    setMake(nextMake);
    setModel("");
    setModels([]);
    setOptions([]);
    if (!nextMake) return;
    const items = await loadMenu({ type: "model", year, make: nextMake });
    if (items) setModels(items);
  }

  async function handleModel(nextModel: string) {
    setModel(nextModel);
    setOptions([]);
    if (!nextModel) return;
    const items = await loadMenu({ type: "options", year, make, model: nextModel });
    if (items) setOptions(items);
  }

  function handleOption(id: string) {
    const option = options.find((item) => item.value === id);
    if (!option) return;
    setValue(`${EXTERNAL_VEHICLE_PREFIX}${id}`);
    setExternalLabel(`${year} ${make} ${model} · ${option.text}`);
    setEditing(false);
  }

  const showChip = mode === "external" && !editing && value.startsWith(EXTERNAL_VEHICLE_PREFIX);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted">{label}</span>
        <div role="group" aria-label={`Origen de ${label}`} className="flex rounded-lg border border-border overflow-hidden text-xs">
          {(["inventory", "external"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={mode === option}
              onClick={() => chooseMode(option)}
              className={cn(
                "px-2.5 py-1 transition-colors",
                mode === option ? "bg-accent text-accent-foreground font-medium" : "text-muted hover:text-foreground",
              )}
            >
              {option === "inventory" ? "Mi inventario" : "Otro auto"}
            </button>
          ))}
        </div>
      </div>

      <input type="hidden" name={name} value={value} />

      {mode === "inventory" && (
        <select
          aria-label={label}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">Sin seleccionar</option>
          {inventory.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      )}

      {mode === "external" && showChip && (
        <div className="flex items-center justify-between gap-2 bg-surface border border-border rounded-lg px-3 py-2 text-sm">
          <span className="truncate">{externalLabel || "Auto seleccionado"}</span>
          <button type="button" onClick={() => void openSearch()} className="text-xs text-accent shrink-0">
            Cambiar
          </button>
        </div>
      )}

      {mode === "external" && !showChip && (
        <div className="flex flex-col gap-2">
          <select aria-label="Año" value={year} onChange={(event) => void handleYear(event.target.value)} className={SELECT_CLASS}>
            <option value="">{loading && years.length === 0 ? "Cargando años…" : "Año"}</option>
            {years.map((item) => (
              <option key={item.value} value={item.value}>
                {item.text}
              </option>
            ))}
          </select>

          {year && (
            <select
              aria-label="Marca"
              value={make}
              onChange={(event) => void handleMake(event.target.value)}
              disabled={makes.length === 0}
              className={SELECT_CLASS}
            >
              <option value="">{makes.length === 0 && loading ? "Cargando marcas…" : "Marca"}</option>
              {makes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.text}
                </option>
              ))}
            </select>
          )}

          {make && (
            <select
              aria-label="Modelo"
              value={model}
              onChange={(event) => void handleModel(event.target.value)}
              disabled={models.length === 0}
              className={SELECT_CLASS}
            >
              <option value="">{models.length === 0 && loading ? "Cargando modelos…" : "Modelo"}</option>
              {models.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.text}
                </option>
              ))}
            </select>
          )}

          {model && (
            <select
              aria-label="Versión"
              value=""
              onChange={(event) => handleOption(event.target.value)}
              disabled={options.length === 0}
              className={SELECT_CLASS}
            >
              <option value="">{options.length === 0 && loading ? "Cargando versiones…" : "Versión (motor y transmisión)"}</option>
              {options.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.text}
                </option>
              ))}
            </select>
          )}

          {error && <p className="text-xs text-danger leading-relaxed">{error}</p>}
        </div>
      )}
    </div>
  );
}
