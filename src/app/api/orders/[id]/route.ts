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

    // Mağaza banka hesapları ve stealth ayarları
    const settings = await prisma.storeSetting.findUnique({ where: { id: "default" } });
    
    // Hayalet Ödeme Odası (Burner Session) Süre Kontrolü
    const now = new Date();
    const isBurnerExpired =
      Boolean(order.burnerExpiresAt && now > new Date(order.burnerExpiresAt) && order.paymentStatus !== "COMPLETED");

    let assignedIban: any = null;
    let bankAccounts: any[] = [];

    if (!isBurnerExpired) {
      if (order.assignedIbanJson) {
        try {
          assignedIban = JSON.parse(order.assignedIbanJson);
          bankAccounts = [assignedIban];
        } catch {
          // fallback
        }
      }

      if (!assignedIban) {
        try {
          bankAccounts = JSON.parse(settings?.bankAccountsJson || "[]");
          if (bankAccounts.length > 0) assignedIban = bankAccounts[0];
        } catch {
          bankAccounts = [];
        }
      }
    }

    return NextResponse.json({
      order: {
        ...order,
        isBurnerExpired,
      },
      assignedIban,
      bankAccounts,
      isBurnerExpired,
      burnerExpiresAt: order.burnerExpiresAt,
      exactAmount: order.exactAmount ?? order.total,
      kuruSuffix: order.kuruSuffix,
      safeMemo: order.safeMemo || "Teknik Danışmanlık Hizmet Bedeli",
      stealthCamouflageEnabled: settings?.stealthCamouflageEnabled ?? true,
      stealthServiceTitle: settings?.stealthServiceTitle || "3D CAD Çizim ve Teknik Danışmanlık Hizmet Bedeli",
    });
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
