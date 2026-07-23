import type { Metadata } from "next";
import { ImportarForm } from "./ImportarForm";

export const metadata: Metadata = {
  title: "Calculadora de importación",
  description: "Estima cuánto te costaría traer un vehículo desde USA a Guatemala: IPRIMA, IVA y total estimado.",
};

export default function ImportarPage() {
  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-10 space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Calculadora de importación</h1>
        <p className="text-sm text-muted mt-1 max-w-xl">
          Estima cuánto te costaría traer un vehículo desde USA a Guatemala, antes de comprometerte con una
          cotización.
        </p>
      </div>

      <ImportarForm />
    </main>
  );
}
