import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { listAppointments } from "@/lib/appointment-store";
import type { AppointmentStatus } from "@/lib/types";
import { deleteAppointmentAction, updateAppointmentStatusAction } from "./actions";

const STATUS_BADGE: Record<AppointmentStatus, "accent" | "success" | "danger"> = {
  Pendiente: "accent",
  Confirmada: "success",
  Cancelada: "danger",
};

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function StatusActions({ id, status }: { id: string; status: AppointmentStatus }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {status !== "Confirmada" && (
        <form action={updateAppointmentStatusAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="Confirmada" />
          <button type="submit" className="text-sm text-success-soft-foreground hover:opacity-80 transition-opacity">
            Confirmar
          </button>
        </form>
      )}
      {status !== "Cancelada" && (
        <form action={updateAppointmentStatusAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="Cancelada" />
          <button type="submit" className="text-sm text-danger hover:opacity-80 transition-opacity">
            Cancelar
          </button>
        </form>
      )}
      <form action={deleteAppointmentAction}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className="text-sm text-muted hover:text-foreground transition-colors">
          Eliminar
        </button>
      </form>
    </div>
  );
}

export default async function AdminAppointmentsPage() {
  const appointments = await listAppointments();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading font-bold text-xl">Citas</h1>
        <p className="text-sm text-muted mt-0.5">{appointments.length} solicitadas</p>
      </div>

      <div className="sm:hidden space-y-3">
        {appointments.map((a) => (
          <Card key={a.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-heading font-bold text-sm">{a.name}</p>
                <p className="text-xs text-muted mt-0.5">{a.phone}</p>
              </div>
              <Badge variant={STATUS_BADGE[a.status]}>{a.status}</Badge>
            </div>
            <p className="text-sm">{a.type}</p>
            <p className="text-xs text-muted">
              {formatDate(a.preferredDate)} · {a.preferredTime}
            </p>
            {a.notes && <p className="text-xs text-muted italic">"{a.notes}"</p>}
            <div className="border-t border-border pt-3">
              <StatusActions id={a.id} status={a.status} />
            </div>
          </Card>
        ))}
        {appointments.length === 0 && <p className="text-sm text-muted text-center py-16">Sin citas solicitadas.</p>}
      </div>

      <Card className="max-sm:hidden overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-muted font-normal p-3">Cliente</th>
              <th className="text-left text-xs text-muted font-normal p-3">Tipo</th>
              <th className="text-left text-xs text-muted font-normal p-3">Fecha</th>
              <th className="text-left text-xs text-muted font-normal p-3">Estado</th>
              <th className="text-right text-xs text-muted font-normal p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-muted">{a.phone}</p>
                </td>
                <td className="p-3 text-muted">{a.type}</td>
                <td className="p-3 text-muted">
                  {formatDate(a.preferredDate)} · {a.preferredTime}
                </td>
                <td className="p-3">
                  <Badge variant={STATUS_BADGE[a.status]}>{a.status}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex justify-end">
                    <StatusActions id={a.id} status={a.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && <p className="text-sm text-muted text-center py-16">Sin citas solicitadas.</p>}
      </Card>
    </div>
  );
}
