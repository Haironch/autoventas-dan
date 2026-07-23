"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartIndicator } from "@/components/cart-indicator";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import logo from "../../../public/logo/Dan.png";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/comparar", label: "Comparar" },
  { href: "/repuestos", label: "Repuestos" },
  { href: "/accesorios", label: "Accesorios" },
  { href: "/importar", label: "Importar" },
  { href: "/vender", label: "Vender" },
  { href: "/agendar", label: "Agendar" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Autoventas Dan" className="h-10 w-auto" priority />
        </Link>

        <nav className="max-sm:hidden sm:flex items-center gap-6 text-sm font-medium text-muted">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

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
        <nav className="sm:hidden border-t border-border bg-background px-6 py-3 flex flex-col gap-1 text-sm font-medium text-muted">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-2 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
