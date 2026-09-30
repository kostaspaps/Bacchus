/**
 * Owner sign-in for /admin: a single shared password (ADMIN_PASSWORD) and a signed, expiring cookie.
 * Uses Web Crypto only, so it runs in both the Node runtime and the middleware (edge) runtime.
 */
export const ADMIN_COOKIE = "bacchus_admin";
const TTL_S = 60 * 60 * 24 * 30; // 30 days

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.IP_HASH_SALT || process.env.ADMIN_PASSWORD || "";
}

export const isAdminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  return timingSafeEqual(await hmac(input), await hmac(expected));
}

/** Cookie value: "<expiry-epoch-seconds>.<hmac>" */
export async function createSessionValue() {
  const exp = Math.floor(Date.now() / 1000) + TTL_S;
  return `${exp}.${await hmac(String(exp))}`;
}

export async function verifySessionValue(value: string | undefined | null) {
  if (!value || !secret()) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  return timingSafeEqual(sig, await hmac(exp));
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/admin",
  maxAge: TTL_S,
};
