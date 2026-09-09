import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getVipSession } from "@/lib/token";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      city,
      district,
      customerNote,
      paymentMethod,
      items,
      couponCode,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !city) {
      return NextResponse.json(
        { error: "Lütfen zorunlu müşteri ve teslimat alanlarını eksiksiz doldurunuz." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Sepetinizde ürün bulunmamaktadır." }, { status: 400 });
    }

    const settings = await prisma.storeSetting.findUnique({ where: { id: "default" } });
    const vipSession = await getVipSession();

    // Satış izni kontrolü
    const isSalesAllowed =
      settings?.storeMode === "PUBLIC_SALE" ||
      (settings?.storeMode === "INVITE_ONLY" && vipSession.isVip) ||
      vipSession.isVip;

    if (!isSalesAllowed) {
      return NextResponse.json(
        { error: "Bu mağazada satış yalnızca yöneticinin özel davetiyesiyle yapılmaktadır." },
        { status: 403 }
      );
    }

    // Ara toplam ve indirim hesaplama
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const lineTotal = Number(item.price) * Number(item.quantity);
      subtotal += lineTotal;
      orderItemsData.push({
        productId: item.productId,
        productTitle: item.title,
        variantName: item.variantName || null,
        price: Number(item.price),
        quantity: Number(item.quantity),
        total: lineTotal,
      });

      // Stok düşümü
      if (item.variantId) {
        await prisma.productVariant.updateMany({
          where: { id: item.variantId },
          data: { stock: { decrement: Number(item.quantity) } },
        });
      } else if (item.productId) {
        await prisma.product.updateMany({
          where: { id: item.productId, manageStock: true },
          data: { stockQuantity: { decrement: Number(item.quantity) } },
        });
      }
    }

    // İndirimler
    let discountTotal = 0;
    if (vipSession.isVip && vipSession.discountPercent) {
      discountTotal = (subtotal * vipSession.discountPercent) / 100;
    } else if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive) {
        if (coupon.type === "PERCENTAGE") {
          discountTotal = (subtotal * coupon.amount) / 100;
        } else {
          discountTotal = Math.min(coupon.amount, subtotal);
        }
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    // Kargo
    const freeThreshold = settings?.freeShippingThreshold ?? 2000;
    const defaultFee = settings?.defaultShippingFee ?? 95;
    const shippingFee = subtotal > 0 && subtotal < freeThreshold ? defaultFee : 0;
    const total = Math.max(0, subtotal - discountTotal + shippingFee);

    // Benzersiz Sipariş Numarası
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CHP-${dateStr}-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        city,
        district: district || null,
        customerNote: customerNote || null,
        paymentMethod: paymentMethod || "BANK_TRANSFER",
        status: paymentMethod === "CREDIT_CARD" ? "PROCESSING" : "PENDING_PAYMENT",
        paymentStatus: paymentMethod === "CREDIT_CARD" ? "COMPLETED" : "PENDING",
        subtotal,
        discountTotal,
        taxTotal: (total * (settings?.taxRate ?? 20)) / (100 + (settings?.taxRate ?? 20)),
        shippingFee,
        total,
        inviteTokenId: vipSession.tokenId || null,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Sipariş oluşturulamadı." }, { status: 500 });
  }
}

// Yönetici Sipariş Listeleme
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        inviteToken: { select: { token: true, note: true, discountPercent: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json({ error: "Siparişler alınamadı" }, { status: 500 });
  }
}
