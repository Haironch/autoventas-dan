"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ad-theme");
    const light = stored === "light";
    setIsLight(light);
    document.documentElement.classList.toggle("light", light);
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("ad-theme", next ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      className="flex items-center justify-center size-9 rounded-lg border border-border text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
    >
      {isLight ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}
    </button>
  );
}
