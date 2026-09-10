import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, error: "Kupon kodu giriniz" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const cartSubtotal = Number(subtotal) || 0;

    // Özel Terk Edilmiş Sepet Kurtarma Kuponu (%5 İndirim)
    if (cleanCode === "SEPET5") {
      const discountAmount = Math.round((cartSubtotal * 5) / 100);
      return NextResponse.json({
        success: true,
        message: "%5 Terk Edilmiş Sepet Özel İndirimi Uygulandı!",
        couponCode: "SEPET5",
        discountAmount,
      });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ success: false, error: "Geçersiz veya süresi dolmuş kupon." }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, error: "Bu kuponun kullanım süresi sona ermiştir." }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: "Bu kuponun maksimum kullanım limitine ulaşılmıştır." }, { status: 400 });
    }

    if (coupon.minSpend && cartSubtotal < coupon.minSpend) {
      return NextResponse.json(
        {
          success: false,
          error: `Bu kupon en az ${coupon.minSpend.toLocaleString("tr-TR")} ₺ sepet tutarında geçerlidir.`,
        },
        { status: 400 }
      );
    }

    if (coupon.maxSpend && cartSubtotal > coupon.maxSpend) {
      return NextResponse.json(
        {
          success: false,
          error: `Bu kupon en fazla ${coupon.maxSpend.toLocaleString("tr-TR")} ₺ sepet tutarında geçerlidir.`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = (cartSubtotal * coupon.amount) / 100;
    } else {
      discountAmount = Math.min(coupon.amount, cartSubtotal);
    }

    return NextResponse.json({
      success: true,
      message: `%${coupon.type === "PERCENTAGE" ? coupon.amount : ""} İndirim Kuponu Uygulandı!`,
      couponCode: coupon.code,
      discountAmount,
    });
  } catch (err) {
    console.error("Coupon validation error:", err);
    return NextResponse.json({ success: false, error: "Kupon doğrulanırken hata oluştu" }, { status: 500 });
  }
}
