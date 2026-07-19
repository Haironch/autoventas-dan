"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAppointment } from "@/lib/appointment-store";
import type { AppointmentType } from "@/lib/types";

export async function createAppointmentAction(formData: FormData) {
  const notes = String(formData.get("notes") ?? "").trim();

  await createAppointment({
    name: String(formData.get("name")),
    phone: String(formData.get("phone")),
    type: formData.get("type") as AppointmentType,
    preferredDate: String(formData.get("preferredDate")),
    preferredTime: String(formData.get("preferredTime")),
    notes: notes || null,
  });

  revalidatePath("/admin/citas");
  redirect("/agendar?success=1");
}
