import { cookies } from "next/headers";
import crypto from "crypto";
import prisma from "./prisma";

const VIP_COOKIE_NAME = "luxe_vip_session";
const SECRET = process.env.VIP_SECRET || "luxe-vip-session-secret-2026-cihanpol";

export function generateTokenString(): string {
  return "vip-" + crypto.randomBytes(12).toString("hex");
}

export function signVipPayload(payload: { tokenId: string; discountPercent: number; note?: string }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}.${signature}`;
}

export function verifyVipPayload(tokenStr: string): { tokenId: string; discountPercent: number; note?: string } | null {
  try {
    const [data, signature] = tokenStr.split(".");
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

/**
 * Atomik olarak token'ı kontrol eder ve tek kullanım kuralı gereği tıklandığı an USED işaretler.
 * Tarayıcıya VIP oturumu bırakır.
 */
export async function consumeInviteToken(
  tokenString: string,
  ipAddress?: string
): Promise<{ success: boolean; error?: string; discountPercent?: number; note?: string }> {
  try {
    const invite = await prisma.inviteToken.findUnique({
      where: { token: tokenString },
    });

    if (!invite) {
      return { success: false, error: "Geçersiz davetiye bağlantısı." };
    }

    if (invite.status === "USED") {
      return {
        success: false,
        error: "Bu özel davetiye bağlantısı daha önce kullanılmıştır ve tek kullanımlıktır.",
      };
    }

    if (invite.status === "REVOKED") {
      return { success: false, error: "Bu davetiye bağlantısı yönetici tarafından iptal edilmiştir." };
    }

    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      await prisma.inviteToken.update({
        where: { id: invite.id },
        data: { status: "EXPIRED" },
      });
      return { success: false, error: "Bu davetiye bağlantısının geçerlilik süresi dolmuştur." };
    }

    // Atomik olarak yak
    await prisma.inviteToken.update({
      where: { id: invite.id },
      data: {
        status: "USED",
        usedAt: new Date(),
        usedByIp: ipAddress || null,
      },
    });

    // Oturumu çerez olarak kaydet (HTTP request scope içindeyse)
    const sessionCookie = signVipPayload({
      tokenId: invite.id,
      discountPercent: invite.discountPercent,
      note: invite.note || undefined,
    });

    try {
      const cookieStore = await cookies();
      cookieStore.set(VIP_COOKIE_NAME, sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 saat geçerli VIP oturumu
      });
    } catch {
      // CLI veya test bağlamında cookies() bulunmayabilir
    }

    return {
      success: true,
      discountPercent: invite.discountPercent,
      note: invite.note || undefined,
    };
  } catch (err) {
    console.error("Token consume error:", err);
    return { success: false, error: "Davetiye doğrulanırken bir hata oluştu." };
  }
}

/**
 * Mevcut ziyaretçinin VIP alışveriş oturumu olup olmadığını kontrol eder.
 */
export async function getVipSession(): Promise<{ isVip: boolean; tokenId?: string; discountPercent?: number; note?: string }> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(VIP_COOKIE_NAME);
    if (!cookie?.value) return { isVip: false };

    const payload = verifyVipPayload(cookie.value);
    if (!payload) return { isVip: false };

    return {
      isVip: true,
      tokenId: payload.tokenId,
      discountPercent: payload.discountPercent || 0,
      note: payload.note,
    };
  } catch {
    return { isVip: false };
  }
}
