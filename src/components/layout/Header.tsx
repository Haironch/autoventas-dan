import Link from "next/link";
import { CartIndicator } from "@/components/cart-indicator";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-lg">
          Autoventas <span className="text-accent">Dan</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/catalogo" className="hover:text-foreground transition-colors">
            Catálogo
          </Link>
          <Link href="/comparar" className="hover:text-foreground transition-colors">
            Comparar
          </Link>
          <Link href="/repuestos" className="hover:text-foreground transition-colors">
            Repuestos
          </Link>
          <Link href="/accesorios" className="hover:text-foreground transition-colors">
            Accesorios
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <CartIndicator />
          <ThemeToggle />
          <Link
            href="/catalogo"
            className="hidden sm:inline-flex items-center font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </header>
  );
}
