import { Car, HandCoins, Search, Ship } from "lucide-react";
import Link from "next/link";
import { AdvisoryModal } from "@/components/advisory-modal";
import { VehicleCard } from "@/components/vehicle-card";
import { listVehicles } from "@/lib/vehicle-store";
import { cn } from "@/lib/utils";

const journeySteps = [
  { icon: Car, title: "Comprar", subtitle: "Explora el catálogo verificado", href: "/catalogo" },
  { icon: HandCoins, title: "Vender", subtitle: "Valoración gratuita de tu auto", href: null },
  { icon: Ship, title: "Importar", subtitle: "Cotiza impuestos y logística", href: "/importar" },
];

export default async function Home() {
  const featured = (await listVehicles())
    .filter((v) => v.status === "Disponible")
    .slice(0, 3);

  return (
    <main className="max-w-5xl mx-auto w-full px-6 py-14 space-y-14">
      <section className="text-center space-y-5">
        <h1 className="font-heading font-bold text-4xl leading-tight">
          ¿Qué buscas hoy?
        </h1>
        <p className="text-sm text-muted max-w-md mx-auto">
          Comprar, vender, importar o recibir asesoría automotriz, todo en un solo lugar.
        </p>

        <form action="/catalogo" method="GET" className="max-w-md mx-auto flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5 focus-within:border-accent transition-colors">
          <Search className="size-4 text-muted shrink-0" aria-hidden="true" />
          <input
            name="q"
            placeholder="Ej. Honda CR-V 2021"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
          />
        </form>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {journeySteps.map((step) => {
          const Icon = step.icon;
          const content = (
            <>
              <Icon className="size-5 text-accent" aria-hidden="true" />
              <span className="font-heading font-bold text-sm mt-2">{step.title}</span>
              <span className="text-xs text-muted mt-1">{step.subtitle}</span>
              {!step.href && (
                <span className="text-[10px] text-muted mt-2 border border-border rounded-full px-2 py-0.5">
                  Próximamente
                </span>
              )}
            </>
          );

          const cardClasses = cn(
            "flex flex-col items-center text-center bg-surface border border-border rounded-xl px-3 py-5 transition-colors",
            step.href ? "hover:border-accent" : "opacity-60 cursor-default",
          );

          return step.href ? (
            <Link key={step.title} href={step.href} className={cardClasses}>
              {content}
            </Link>
          ) : (
            <div key={step.title} className={cardClasses}>
              {content}
            </div>
          );
        })}
        <AdvisoryModal />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl">Vehículos destacados</h2>
          <Link href="/catalogo" className="text-sm text-accent hover:text-accent-hover transition-colors">
            Ver todo el catálogo
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featured.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>
    </main>
  );
}
