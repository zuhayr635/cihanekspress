import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    // Mağaza banka hesaplarını da ekleyelim (Havale talimatı için)
    const settings = await prisma.storeSetting.findUnique({ where: { id: "default" } });
    let bankAccounts = [];
    try {
      bankAccounts = JSON.parse(settings?.bankAccountsJson || "[]");
    } catch {
      bankAccounts = [];
    }

    return NextResponse.json({ order, bankAccounts });
  } catch (err) {
    console.error("Order fetch error:", err);
    return NextResponse.json({ error: "Sipariş bilgisi alınamadı" }, { status: 500 });
  }
}

// Admin Durum Güncelleme
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { status, paymentStatus, trackingNumber, trackingUrl, adminNote } = body;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : undefined,
        trackingUrl: trackingUrl !== undefined ? trackingUrl : undefined,
        adminNote: adminNote !== undefined ? adminNote : undefined,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error("Order patch error:", err);
    return NextResponse.json({ error: "Sipariş güncellenemedi" }, { status: 500 });
  }
}
