import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderNumber, phone } = await req.json();

    if (!orderNumber || !phone) {
      return NextResponse.json({ error: "Sipariş numarası ve telefon gereklidir." }, { status: 400 });
    }

    const cleanOrderNo = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { contains: cleanOrderNo },
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Belirtilen sipariş numarası bulunamadı." }, { status: 404 });
    }

    // Telefon doğrulaması (güvenlik için son 4 hane veya genel eşleşme)
    const orderPhoneClean = order.customerPhone.replace(/[^0-9]/g, "");
    if (!orderPhoneClean.endsWith(cleanPhone.slice(-4)) && !cleanPhone.endsWith(orderPhoneClean.slice(-4))) {
      return NextResponse.json({ error: "Telefon numarası sipariş kaydıyla uyuşmuyor." }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        total: order.total,
        shippingFee: order.shippingFee,
        discountTotal: order.discountTotal,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        receiptUrl: order.receiptUrl,
        createdAt: order.createdAt,
        items: order.items,
      },
    });
  } catch (err) {
    console.error("Order tracking error:", err);
    return NextResponse.json({ error: "Sipariş sorgulanırken bir hata oluştu." }, { status: 500 });
  }
}
