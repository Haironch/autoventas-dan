import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { listCommonIssues } from "@/lib/common-issue-store";
import type { IssueSeverity } from "@/lib/types";
import { deleteCommonIssueAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin · Fallas comunes",
};

const SEVERITY_BADGE: Record<IssueSeverity, "success" | "accent" | "danger"> = {
  Leve: "success",
  Moderada: "accent",
  Grave: "danger",
};

export default async function AdminCommonIssuesPage() {
  const issues = await listCommonIssues();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-xl">Fallas comunes</h1>
          <p className="text-sm text-muted mt-0.5">{issues.length} registradas</p>
        </div>
        <Link
          href="/admin/fallas/nuevo"
          className="font-heading font-bold text-sm px-4.5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-colors"
        >
          Agregar falla
        </Link>
      </div>

      <div className="sm:hidden space-y-3">
        {issues.map((issue) => (
          <Card key={issue.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-heading font-bold text-sm">{issue.title}</p>
                <p className="text-xs text-muted mt-0.5">
                  {issue.brand} {issue.model} · {issue.yearFrom}–{issue.yearTo}
                </p>
              </div>
              <Badge variant={SEVERITY_BADGE[issue.severity]}>{issue.severity}</Badge>
            </div>
            <div className="flex items-center gap-4 border-t border-border pt-3">
              <Link
                href={`/admin/fallas/${issue.id}/editar`}
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Editar
              </Link>
              <form action={deleteCommonIssueAction}>
                <input type="hidden" name="id" value={issue.id} />
                <button type="submit" className="text-sm text-danger hover:opacity-80 transition-opacity">
                  Eliminar
                </button>
              </form>
            </div>
          </Card>
        ))}
      </div>

      <Card className="max-sm:hidden overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-muted font-normal p-3">Falla</th>
              <th className="text-left text-xs text-muted font-normal p-3">Vehículo</th>
              <th className="text-left text-xs text-muted font-normal p-3">Años</th>
              <th className="text-left text-xs text-muted font-normal p-3">Gravedad</th>
              <th className="text-right text-xs text-muted font-normal p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{issue.title}</td>
                <td className="p-3 text-muted">
                  {issue.brand} {issue.model}
                </td>
                <td className="p-3 text-muted">
                  {issue.yearFrom}–{issue.yearTo}
                </td>
                <td className="p-3">
                  <Badge variant={SEVERITY_BADGE[issue.severity]}>{issue.severity}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/fallas/${issue.id}/editar`}
                      className="text-accent hover:text-accent-hover transition-colors"
                    >
                      Editar
                    </Link>
                    <form action={deleteCommonIssueAction}>
                      <input type="hidden" name="id" value={issue.id} />
                      <button type="submit" className="text-danger hover:opacity-80 transition-opacity">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
