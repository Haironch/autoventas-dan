import { fetchMenu, type MenuKind } from "@/lib/fuel-economy";

const KINDS: MenuKind[] = ["year", "make", "model", "options"];
const YEAR_PATTERN = /^(19|20)\d{2}$/;
const MAX_TEXT_LENGTH = 80;

function isValidText(value: string | null): value is string {
  return Boolean(value) && value!.length <= MAX_TEXT_LENGTH;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as MenuKind | null;
  const year = searchParams.get("year");
  const make = searchParams.get("make");
  const model = searchParams.get("model");

  if (!type || !KINDS.includes(type)) {
    return Response.json({ error: "Tipo de consulta inválido." }, { status: 400 });
  }
  if (type !== "year" && !(year && YEAR_PATTERN.test(year))) {
    return Response.json({ error: "Año inválido." }, { status: 400 });
  }
  if ((type === "model" || type === "options") && !isValidText(make)) {
    return Response.json({ error: "Marca inválida." }, { status: 400 });
  }
  if (type === "options" && !isValidText(model)) {
    return Response.json({ error: "Modelo inválido." }, { status: 400 });
  }

  const items = await fetchMenu(type, {
    year: year ?? undefined,
    make: make ?? undefined,
    model: model ?? undefined,
  });

  if (!items) {
    return Response.json({ error: "No se pudo consultar el catálogo de autos." }, { status: 502 });
  }

  return Response.json(
    { items },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
