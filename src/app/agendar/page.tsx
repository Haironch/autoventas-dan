import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { createAppointmentAction } from "./actions";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

interface AgendarPageProps {
  searchParams: Promise<{ success?: string }>;
}

export default async function AgendarPage({ searchParams }: AgendarPageProps) {
  const params = await searchParams;
  const today = new Date().toISOString().slice(0, 10);

  if (params.success) {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Hola, acabo de agendar una cita en Autoventas Dan y quiero confirmar los detalles.",
    )}`;

    return (
      <main className="max-w-2xl mx-auto w-full px-6 py-10">
        <Card className="p-6 text-center space-y-4">
          <CheckCircle2
            className="size-10 mx-auto"
            style={{ color: "var(--accent)" }}
            aria-hidden="true"
          />
          <div>
            <h1 className="font-heading font-bold text-xl">Solicitud enviada</h1>
            <p className="text-sm text-muted mt-1">
              Recibimos tu solicitud de cita. Te contactaremos pronto para confirmar fecha y hora.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
          >
            Confirmar por WhatsApp ahora
          </a>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto w-full px-6 py-10 space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Agenda tu cita</h1>
        <p className="text-sm text-muted mt-1 max-w-xl">
          Reserva una cita presencial para evaluar tu vehículo, ver uno del catálogo, o recibir asesoría.
        </p>
      </div>

      <Card className="p-5">
        <form action={createAppointmentAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label="Nombre" name="name" required />
            <TextField label="Teléfono" name="phone" type="tel" required />
          </div>

          <Select label="Tipo de cita" name="type" defaultValue="Evaluación para venta">
            <option value="Evaluación para venta">Evaluación para venta</option>
            <option value="Ver un vehículo">Ver un vehículo</option>
            <option value="Asesoría general">Asesoría general</option>
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label="Fecha preferida" name="preferredDate" type="date" min={today} required />
            <Select label="Hora preferida" name="preferredTime" defaultValue={TIME_SLOTS[0]}>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </Select>
          </div>

          <Textarea label="Notas (opcional)" name="notes" rows={3} placeholder="Ej. vehículo que quiero vender, modelo que me interesa ver, etc." />

          <button
            type="submit"
            className="w-full font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
          >
            Solicitar cita
          </button>
        </form>
      </Card>
    </main>
  );
}
