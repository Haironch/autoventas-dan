"use server";

import { revalidatePath } from "next/cache";
import { deleteAppointment, updateAppointmentStatus } from "@/lib/appointment-store";
import type { AppointmentStatus } from "@/lib/types";

function revalidateAppointmentPages() {
  revalidatePath("/admin/citas");
}

export async function updateAppointmentStatusAction(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status") as AppointmentStatus;
  if (typeof id === "string") {
    await updateAppointmentStatus(id, status);
    revalidateAppointmentPages();
  }
}

export async function deleteAppointmentAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id === "string") {
    await deleteAppointment(id);
    revalidateAppointmentPages();
  }
}
