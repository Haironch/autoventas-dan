"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCommonIssue, deleteCommonIssue, updateCommonIssue } from "@/lib/common-issue-store";
import type { CommonIssue } from "@/lib/types";

function revalidateIssuePages() {
  revalidatePath("/admin/fallas");
  revalidatePath("/fallas");
}

function issueFromFormData(formData: FormData): Omit<CommonIssue, "id"> {
  const cost = formData.get("estimatedRepairCost");
  return {
    brand: String(formData.get("brand")),
    model: String(formData.get("model")),
    yearFrom: Number(formData.get("yearFrom")),
    yearTo: Number(formData.get("yearTo")),
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    severity: formData.get("severity") as CommonIssue["severity"],
    estimatedRepairCost: cost && String(cost).trim() !== "" ? Number(cost) : null,
  };
}

export async function deleteCommonIssueAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id === "string") {
    await deleteCommonIssue(id);
    revalidateIssuePages();
  }
}

export async function createCommonIssueAction(formData: FormData) {
  await createCommonIssue(issueFromFormData(formData));
  revalidateIssuePages();
  redirect("/admin/fallas");
}

export async function updateCommonIssueAction(id: string, formData: FormData) {
  await updateCommonIssue(id, issueFromFormData(formData));
  revalidateIssuePages();
  redirect("/admin/fallas");
}
