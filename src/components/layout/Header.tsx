"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CartIndicator } from "@/components/cart-indicator";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import logo from "../../../public/logo/Dan.png";

const NAV_GROUPS = [
  {
    label: "Comprar",
    links: [
      { href: "/catalogo", label: "Catálogo" },
      { href: "/comparar", label: "Comparar" },
    ],
  },
  {
    label: "Tienda",
    links: [
      { href: "/repuestos", label: "Repuestos" },
      { href: "/accesorios", label: "Accesorios" },
    ],
  },
  {
    label: "Servicios",
    links: [
      { href: "/vender", label: "Vender" },
      { href: "/importar", label: "Importar" },
      { href: "/fallas", label: "Fallas comunes" },
      { href: "/agendar", label: "Agendar" },
    ],
  },
];

function DesktopNav() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openGroup) return;

    function onPointerDown(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenGroup(null);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openGroup]);

  return (
    <nav ref={navRef} className="max-sm:hidden sm:flex items-center gap-1 text-sm font-medium text-muted">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="relative">
          <button
            type="button"
            onClick={() => setOpenGroup((current) => (current === group.label ? null : group.label))}
            aria-expanded={openGroup === group.label}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-lg hover:text-foreground transition-colors",
              openGroup === group.label && "text-foreground",
            )}
          >
            {group.label}
            <ChevronDown
              className={cn("size-3.5 transition-transform", openGroup === group.label && "rotate-180")}
              aria-hidden="true"
            />
          </button>

          {openGroup === group.label && (
            <div className="absolute top-full left-0 mt-1 min-w-40 bg-surface border border-border rounded-lg p-1.5 shadow-lg flex flex-col">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpenGroup(null)}
                  className="px-3 py-2 rounded-md text-sm hover:bg-background hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Autoventas Dan" className="h-10 w-auto" priority />
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-3">
          <CartIndicator />
          <ThemeToggle />
          <Link
            href="/catalogo"
            className="max-sm:hidden sm:inline-flex items-center font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
          >
            Ver catálogo
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="sm:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-border text-foreground"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="sm:hidden border-t border-border bg-background px-6 py-3 flex flex-col gap-4 text-sm font-medium text-muted">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-xs uppercase tracking-wide text-muted/70 mb-1">{group.label}</p>
              <div className="flex flex-col">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-2 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
