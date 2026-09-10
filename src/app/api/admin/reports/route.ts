import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { ensureInitialized } from "@/lib/db-init";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    await ensureInitialized();
    const [orders, products, invites] = await Promise.all([
      prisma.order.findMany({
        include: {
          items: {
            include: {
              product: { select: { costPrice: true, basePrice: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        select: { id: true, title: true, stockQuantity: true, lowStockThreshold: true, basePrice: true, costPrice: true },
      }),
      prisma.inviteToken.findMany({
        include: { orders: { select: { id: true, total: true } } },
      }),
    ]);

    const completedOrders = orders.filter(
      (o) => o.status !== "CANCELLED" && o.status !== "REFUNDED"
    );

    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    // COGS & Kârlılık Hesabı
    let totalCost = 0;
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        // Eğer ürünün maliyet fiyatı tanımlıysa onu al, yoksa varsayılan %55 maliyet baz al
        const unitCost = item.product?.costPrice ?? item.price * 0.55;
        totalCost += unitCost * item.quantity;
      });
    });

    const grossProfit = Math.max(0, totalRevenue - totalCost);
    const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : "0";

    const pendingBankTransfers = orders.filter(
      (o) => o.status === "PENDING_PAYMENT" && o.paymentMethod === "BANK_TRANSFER"
    ).length;

    const lowStockProducts = products.filter(
      (p) => p.stockQuantity <= (p.lowStockThreshold || 3)
    );

    const totalInvites = invites.length;
    const usedInvites = invites.filter((i) => i.status === "USED").length;
    const ordersWithInvite = invites.filter((i) => i.orders.length > 0).length;
    const conversionRate = usedInvites > 0 ? ((ordersWithInvite / usedInvites) * 100).toFixed(1) : "0";

    return NextResponse.json({
      totalRevenue,
      totalCost: Math.round(totalCost),
      grossProfit: Math.round(grossProfit),
      profitMargin: `${profitMargin}%`,
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
    return NextResponse.json({
      totalRevenue: 0,
      totalCost: 0,
      grossProfit: 0,
      profitMargin: "0%",
      totalOrders: 0,
      pendingBankTransfers: 0,
      activeProductsCount: 0,
      lowStockProducts: [],
      totalInvites: 0,
      usedInvites: 0,
      ordersWithInvite: 0,
      conversionRate: "0%",
      recentOrders: [],
    });
  }
}
