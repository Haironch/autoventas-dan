import type { Metadata } from "next";
import { VenderForm } from "./VenderForm";

export const metadata: Metadata = {
  title: "Vendemos tu vehículo",
  description: "Obtén una valoración preliminar gratuita de tu vehículo y cédelo en consignación.",
};

export default function VenderPage() {
  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-10 space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Vendemos tu vehículo</h1>
        <p className="text-sm text-muted mt-1 max-w-xl">
          Cuéntanos sobre tu carro y te contactamos con una valoración preliminar para que decidas si te conviene
          cederlo en consignación.
        </p>
      </div>

      <VenderForm />
    </main>
  );
}
