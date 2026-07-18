"use client";

import { useState, type ChangeEvent } from "react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 8;

interface PhotoFieldProps {
  name: string;
  existingImageName: string;
  existingImageUrl: string;
}

export function PhotoField({ name, existingImageName, existingImageUrl }: PhotoFieldProps) {
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setError(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      const looksHeic = /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
      setError(
        looksHeic
          ? 'Formato HEIC (típico de iPhone) no compatible con la web. Cambia la cámara a "Más compatible" en Ajustes > Cámara > Formatos, o convierte la foto a JPG antes de subirla.'
          : "Formato no soportado. Usa JPG, PNG o WEBP.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`La foto pesa más de ${MAX_SIZE_MB}MB. Usa una imagen más liviana.`);
      event.target.value = "";
      return;
    }

    setError(null);
  }

  return (
    <div className="flex items-center gap-3">
      {existingImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={existingImageUrl}
          alt=""
          className="size-12 rounded-lg object-cover border border-border shrink-0"
        />
      )}
      <div className="flex-1 space-y-1">
        <input type="hidden" name={existingImageName} value={existingImageUrl} />
        <input
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="w-full text-xs text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-accent-soft file:text-accent-soft-foreground file:font-medium file:text-xs hover:file:bg-accent-soft file:cursor-pointer cursor-pointer"
        />
        {error && <p className="text-xs text-danger leading-relaxed">{error}</p>}
      </div>
    </div>
  );
}
