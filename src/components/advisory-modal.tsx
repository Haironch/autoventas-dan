"use client";

import { MessageCircleQuestion, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const QUESTIONS = [
  { id: "comprar", label: "¿Necesitas comprar un vehículo?", messageLabel: "Comprar un vehículo" },
  { id: "importar", label: "¿Necesitas importar un vehículo?", messageLabel: "Importar un vehículo" },
  { id: "venta", label: "¿Buscas asesoría para venta de vehículo?", messageLabel: "Asesoría para venta de vehículo" },
  { id: "tramites", label: "¿Necesitas ayuda con trámites o papelería?", messageLabel: "Ayuda con trámites o papelería" },
  {
    id: "repuestos",
    label: "¿Buscas algún repuesto, accesorio o código específico?",
    messageLabel: "Buscar repuesto, accesorio o código específico",
  },
  { id: "cotizacion", label: "¿Necesitas cotización de algún vehículo?", messageLabel: "Cotización de un vehículo" },
  { id: "personalizada", label: "¿Quieres asesoría personalizada?", messageLabel: "Asesoría personalizada" },
] as const;

function buildWhatsAppUrl(selectedIds: Set<string>, detail: string) {
  const selectedLabels = QUESTIONS.filter((q) => selectedIds.has(q.id)).map((q) => `- ${q.messageLabel}`);

  let message = "Hola, quiero solicitar asesoría en Autoventas Dan.\n\nNecesito ayuda con:\n";
  message += selectedLabels.join("\n");

  if (selectedIds.has("repuestos") && detail.trim()) {
    message += `\n\nDetalle de lo que busco: ${detail.trim()}`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function AdvisoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  function toggleQuestion(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSubmit() {
    window.open(buildWhatsAppUrl(selectedIds, detail), "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setSelectedIds(new Set());
    setDetail("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center text-center bg-surface border border-border rounded-xl px-3 py-5 transition-colors hover:border-accent"
      >
        <MessageCircleQuestion className="size-5 text-accent" aria-hidden="true" />
        <span className="font-heading font-bold text-sm mt-2">Solicitar asesoría</span>
        <span className="text-xs text-muted mt-1">Habla con un experto</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="advisory-modal-title"
            className="relative bg-surface border border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="advisory-modal-title" className="font-heading font-bold text-xl">
                  Solicita tu asesoría
                </h2>
                <p className="text-xs text-muted mt-1">Cuéntanos qué necesitas y te contactamos por WhatsApp.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
                className="text-muted hover:text-foreground transition-colors shrink-0"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="bg-accent-soft rounded-lg px-4 py-3">
              <p className="text-sm text-accent-soft-foreground">
                El servicio de asesoría no es 100% gratuito. El costo dependerá del tipo de asesoría o gestión
                requerida.
              </p>
            </div>

            <div className="space-y-1">
              {QUESTIONS.map((q) => (
                <label key={q.id} className="flex items-start gap-3 text-sm py-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(q.id)}
                    onChange={() => toggleQuestion(q.id)}
                    className="mt-0.5 shrink-0"
                    style={{ accentColor: "var(--accent)" }}
                  />
                  <span>{q.label}</span>
                </label>
              ))}
            </div>

            {selectedIds.has("repuestos") && (
              <label className="flex flex-col gap-1 text-xs text-muted">
                ¿Qué repuesto, accesorio o código buscas?
                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={2}
                  placeholder="Ej. Código de falla P0301 para Toyota Corolla 2018"
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent outline-none transition-colors resize-none"
                />
              </label>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedIds.size === 0}
              className="w-full font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Enviar por WhatsApp
            </button>

            <Link
              href="/agendar"
              className="block text-center text-xs text-muted hover:text-foreground transition-colors"
            >
              ¿Prefieres una cita presencial? Agenda aquí
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
