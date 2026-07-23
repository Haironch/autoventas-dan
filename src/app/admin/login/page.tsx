import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "@/proxy";

export const metadata: Metadata = {
  title: "Acceso administrador",
};

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password");

  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, "ok", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    redirect("/admin");
  }

  redirect("/admin/login?error=1");
}

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;

  return (
    <main className="max-w-sm mx-auto w-full px-6 py-24">
      <h1 className="font-heading font-bold text-2xl">Acceso administrador</h1>
      <p className="text-sm text-muted mt-1 mb-6">Autoventas Dan · panel interno</p>

      <form action={login} className="space-y-3">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Contraseña
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-accent outline-none transition-colors"
          />
        </label>

        {params.error && (
          <p className="text-xs text-danger">Contraseña incorrecta, intenta de nuevo.</p>
        )}

        <button
          type="submit"
          className="w-full font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
