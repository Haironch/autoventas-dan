import { prisma } from "@/lib/prisma";
import type { Appointment, AppointmentStatus, AppointmentType } from "@/lib/types";
import type { Appointment as AppointmentRecord } from "@prisma/client";

const TYPE_TO_DB: Record<AppointmentType, "EVALUACION_VENTA" | "VER_VEHICULO" | "ASESORIA"> = {
  "Evaluación para venta": "EVALUACION_VENTA",
  "Ver un vehículo": "VER_VEHICULO",
  "Asesoría general": "ASESORIA",
};
const TYPE_FROM_DB: Record<string, AppointmentType> = {
  EVALUACION_VENTA: "Evaluación para venta",
  VER_VEHICULO: "Ver un vehículo",
  ASESORIA: "Asesoría general",
};

const STATUS_TO_DB: Record<AppointmentStatus, "PENDIENTE" | "CONFIRMADA" | "CANCELADA"> = {
  Pendiente: "PENDIENTE",
  Confirmada: "CONFIRMADA",
  Cancelada: "CANCELADA",
};
const STATUS_FROM_DB: Record<string, AppointmentStatus> = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
};

function toAppAppointment(record: AppointmentRecord): Appointment {
  return {
    id: record.id,
    name: record.name,
    phone: record.phone,
    type: TYPE_FROM_DB[record.type],
    preferredDate: record.preferredDate.toISOString().slice(0, 10),
    preferredTime: record.preferredTime,
    notes: record.notes,
    status: STATUS_FROM_DB[record.status],
  };
}

export interface NewAppointment {
  name: string;
  phone: string;
  type: AppointmentType;
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
}

export async function listAppointments(): Promise<Appointment[]> {
  const records = await prisma.appointment.findMany({ orderBy: { preferredDate: "asc" } });
  return records.map(toAppAppointment);
}

export async function createAppointment(data: NewAppointment): Promise<Appointment> {
  const record = await prisma.appointment.create({
    data: {
      name: data.name,
      phone: data.phone,
      type: TYPE_TO_DB[data.type],
      preferredDate: new Date(`${data.preferredDate}T00:00:00.000Z`),
      preferredTime: data.preferredTime,
      notes: data.notes,
    },
  });
  return toAppAppointment(record);
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment | undefined> {
  try {
    const record = await prisma.appointment.update({
      where: { id },
      data: { status: STATUS_TO_DB[status] },
    });
    return toAppAppointment(record);
  } catch {
    return undefined;
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  await prisma.appointment.delete({ where: { id } }).catch(() => undefined);
}
