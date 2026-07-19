import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "@/proxy";

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <Link href="/admin" className="font-heading font-bold text-lg">
            Panel de administrador
          </Link>
          <p className="text-xs text-muted mt-0.5">Autoventas Dan</p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-muted hover:text-foreground transition-colors">
            Cerrar sesión
          </button>
        </form>
      </header>

      <nav className="flex items-center gap-5 text-sm font-medium text-muted -mt-2">
        <Link href="/admin" className="hover:text-foreground transition-colors">
          Vehículos
        </Link>
        <Link href="/admin/repuestos" className="hover:text-foreground transition-colors">
          Repuestos
        </Link>
        <Link href="/admin/accesorios" className="hover:text-foreground transition-colors">
          Accesorios
        </Link>
        <Link href="/admin/fallas" className="hover:text-foreground transition-colors">
          Fallas
        </Link>
      </nav>

      {children}
    </div>
  );
}
