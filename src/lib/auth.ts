import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "luxe_admin_token";
const SECRET = process.env.ADMIN_SECRET || "luxe-atelier-secret-key-2026-cihanpol";

export function signToken(payload: { username: string; timestamp: number }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}.${signature}`;
}

export function verifyToken(token: string): { username: string; timestamp: number } | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    const expectedSig = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      const json = Buffer.from(data, "base64url").toString("utf-8");
      return JSON.parse(json);
    }
    return null;
  } catch {
    return null;
  }
}

export async function setAdminSession(username: string) {
  const token = signToken({ username, timestamp: Date.now() });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAdminSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!cookie?.value) return null;

  const verified = verifyToken(cookie.value);
  if (!verified) return null;

  return { username: verified.username };
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
