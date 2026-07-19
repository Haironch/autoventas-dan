import { prisma } from "@/lib/prisma";
import type { CommonIssue, IssueSeverity } from "@/lib/types";
import type { CommonIssue as CommonIssueRecord } from "@prisma/client";

const SEVERITY_TO_DB: Record<IssueSeverity, "LEVE" | "MODERADA" | "GRAVE"> = {
  Leve: "LEVE",
  Moderada: "MODERADA",
  Grave: "GRAVE",
};
const SEVERITY_FROM_DB: Record<string, IssueSeverity> = {
  LEVE: "Leve",
  MODERADA: "Moderada",
  GRAVE: "Grave",
};

function toAppIssue(record: CommonIssueRecord): CommonIssue {
  return {
    id: record.id,
    brand: record.brand,
    model: record.model,
    yearFrom: record.yearFrom,
    yearTo: record.yearTo,
    title: record.title,
    description: record.description,
    severity: SEVERITY_FROM_DB[record.severity],
    estimatedRepairCost: record.estimatedRepairCost,
  };
}

function toDbData(data: Omit<CommonIssue, "id">) {
  return {
    brand: data.brand,
    model: data.model,
    yearFrom: data.yearFrom,
    yearTo: data.yearTo,
    title: data.title,
    description: data.description,
    severity: SEVERITY_TO_DB[data.severity],
    estimatedRepairCost: data.estimatedRepairCost,
  };
}

export async function listCommonIssues(): Promise<CommonIssue[]> {
  const records = await prisma.commonIssue.findMany({ orderBy: { createdAt: "desc" } });
  return records.map(toAppIssue);
}

export async function getCommonIssueById(id: string): Promise<CommonIssue | undefined> {
  const record = await prisma.commonIssue.findUnique({ where: { id } });
  return record ? toAppIssue(record) : undefined;
}

export async function searchCommonIssues(filters: {
  brand?: string;
  model?: string;
  year?: number;
}): Promise<CommonIssue[]> {
  const records = await prisma.commonIssue.findMany({
    where: {
      ...(filters.brand ? { brand: { equals: filters.brand, mode: "insensitive" } } : {}),
      ...(filters.model ? { model: { equals: filters.model, mode: "insensitive" } } : {}),
      ...(filters.year ? { yearFrom: { lte: filters.year }, yearTo: { gte: filters.year } } : {}),
    },
    orderBy: { brand: "asc" },
  });
  return records.map(toAppIssue);
}

export async function createCommonIssue(data: Omit<CommonIssue, "id">): Promise<CommonIssue> {
  const record = await prisma.commonIssue.create({ data: toDbData(data) });
  return toAppIssue(record);
}

export async function updateCommonIssue(id: string, data: Omit<CommonIssue, "id">): Promise<CommonIssue | undefined> {
  try {
    const record = await prisma.commonIssue.update({ where: { id }, data: toDbData(data) });
    return toAppIssue(record);
  } catch {
    return undefined;
  }
}

export async function deleteCommonIssue(id: string): Promise<void> {
  await prisma.commonIssue.delete({ where: { id } }).catch(() => undefined);
}
