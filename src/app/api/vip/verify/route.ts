import { NextResponse } from "next/server";
import { consumeInviteToken } from "@/lib/token";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ success: false, error: "Geçerli bir davetiye kodu giriniz." }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const result = await consumeInviteToken(token.trim(), ip);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      discountPercent: result.discountPercent,
      note: result.note,
    });
  } catch (err) {
    console.error("VIP verify error:", err);
    return NextResponse.json({ success: false, error: "Doğrulama sırasında bir hata oluştu." }, { status: 500 });
  }
}
