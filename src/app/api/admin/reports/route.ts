import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const [orders, products, invites] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        select: { id: true, title: true, stockQuantity: true, lowStockThreshold: true, basePrice: true },
      }),
      prisma.inviteToken.findMany({
        include: { orders: { select: { id: true, total: true } } },
      }),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status !== "CANCELLED" && o.status !== "REFUNDED")
      .reduce((sum, o) => sum + o.total, 0);

    const pendingBankTransfers = orders.filter(
      (o) => o.status === "PENDING_PAYMENT" && o.paymentMethod === "BANK_TRANSFER"
    ).length;

    const lowStockProducts = products.filter(
      (p) => p.stockQuantity <= p.lowStockThreshold
    );

    const totalInvites = invites.length;
    const usedInvites = invites.filter((i) => i.status === "USED").length;
    const ordersWithInvite = invites.filter((i) => i.orders.length > 0).length;
    const conversionRate = usedInvites > 0 ? ((ordersWithInvite / usedInvites) * 100).toFixed(1) : "0";

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
      pendingBankTransfers,
      activeProductsCount: products.length,
      lowStockProducts,
      totalInvites,
      usedInvites,
      ordersWithInvite,
      conversionRate: `${conversionRate}%`,
      recentOrders: orders.slice(0, 5),
    });
  } catch (err) {
    console.error("Reports error:", err);
    return NextResponse.json({ error: "Raporlar hesaplanamadı" }, { status: 500 });
  }
}
