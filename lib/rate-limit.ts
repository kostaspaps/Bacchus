import "server-only";
import { createHash } from "node:crypto";
import { countRecentByIp, isDbConfigured } from "./db";

export const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

const memory = new Map<string, number[]>();

export function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT || "bacchus";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function clientIp(headers: Headers) {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return headers.get("x-real-ip") || "0.0.0.0";
}

/** True when the caller has exceeded RATE_LIMIT. Uses the database when available, else per-instance memory. */
export async function isRateLimited(ipHash: string) {
  const now = Date.now();
  const recent = (memory.get(ipHash) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  memory.set(ipHash, recent);
  if (recent.length >= RATE_LIMIT.max) return true;

  if (isDbConfigured()) {
    try {
      const n = await countRecentByIp(ipHash, RATE_LIMIT.windowMs);
      if (n >= RATE_LIMIT.max) return true;
    } catch (e) {
      console.error("[rate-limit] db count failed", e);
    }
  }
  return false;
}

export function recordHit(ipHash: string) {
  const list = memory.get(ipHash) || [];
  list.push(Date.now());
  memory.set(ipHash, list);
}
