import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { receiptUrl, note } = await req.json();

    if (!receiptUrl && !note) {
      return NextResponse.json({ error: "Dekont bilgisi gereklidir" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        receiptUrl: receiptUrl || order.receiptUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        adminNote: note ? `Müşteri Dekont Notu: ${note} (Tarih: ${new Date().toLocaleString("tr-TR")})` : order.adminNote,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ödeme dekontunuz başarıyla sisteme iletildi. Yetkili onayından sonra siparişiniz hazırlanacaktır.",
      order: updated,
    });
  } catch (err) {
    console.error("Receipt upload error:", err);
    return NextResponse.json({ error: "Dekont kaydedilemedi" }, { status: 500 });
  }
}
