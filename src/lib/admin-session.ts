export const ADMIN_SESSION_COOKIE = "ad_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

const encoder = new TextEncoder();

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Comparación en tiempo constante para no filtrar información por tiempos de respuesta. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * La firma usa ADMIN_PASSWORD como llave: sin conocer la contraseña no se puede
 * fabricar una cookie válida, y cambiar la contraseña cierra todas las sesiones abiertas.
 */
export async function createSessionToken(): Promise<string | null> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;

  const expiresAt = String(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000);
  return `${expiresAt}.${await sign(expiresAt, secret)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || !token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < Date.now()) return false;

  return safeEqual(signature, await sign(expiresAt, secret));
}
