import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "./prisma";
import { verifyPassword } from "./password";

const COOKIE_NAME = "portfolio_admin";

function getSecret() {
  return process.env.ADMIN_SECRET || "dev-fallback-secret";
}

export function signAdminToken(username: string): string {
  const payload = `owner:${username}:${Date.now()}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyAdminToken(token: string | undefined): { ok: boolean; username?: string } {
  if (!token) return { ok: false };
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const [payload, sig] = raw.split(".");
    if (!payload || !sig) return { ok: false };
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false };
    const parts = payload.split(":");
    if (parts[0] !== "owner" || !parts[1]) return { ok: false };
    return { ok: true, username: parts[1] };
  } catch {
    return { ok: false };
  }
}

export async function authenticateOwner(
  username: string,
  password: string
): Promise<{ ok: true; username: string; displayName: string } | { ok: false }> {
  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) return { ok: false };
  if (!verifyPassword(password, user.passwordHash)) return { ok: false };
  return { ok: true, username: user.username, displayName: user.displayName };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE_NAME)?.value).ok;
}

export async function getAdminSession(): Promise<{
  username: string;
  displayName: string;
  email: string | null;
} | null> {
  const jar = await cookies();
  const v = verifyAdminToken(jar.get(COOKIE_NAME)?.value);
  if (!v.ok || !v.username) return null;
  try {
    const user = await prisma.adminUser.findUnique({ where: { username: v.username } });
    if (!user) return null;
    return {
      username: user.username,
      displayName: user.displayName,
      email: user.email,
    };
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
