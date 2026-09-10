import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const [
      categories,
      products,
      variants,
      settings,
      coupons,
      orders,
      inviteTokens,
      ibanAccounts,
      modules,
      b2bQuotes,
      tradeIns,
      print3ds,
      trailSpots,
      rigShowcases,
      certifiedChassis,
      buildLogs,
      reviews,
    ] = await Promise.all([
      prisma.category.findMany(),
      prisma.product.findMany(),
      prisma.productVariant.findMany(),
      prisma.storeSetting.findUnique({ where: { id: "default" } }),
      prisma.coupon.findMany(),
      prisma.order.findMany({ include: { items: true } }),
      prisma.inviteToken.findMany(),
      prisma.ibanAccount.findMany(),
      prisma.moduleConfig.findMany(),
      prisma.b2BQuote.findMany(),
      prisma.tradeIn.findMany(),
      prisma.print3d.findMany(),
      prisma.trailSpot.findMany(),
      prisma.rigShowcase.findMany(),
      prisma.certifiedChassis.findMany(),
      prisma.buildLog.findMany(),
      prisma.productReview.findMany(),
    ]);

    const backupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      storeName: settings?.storeName || "CIHANPOL RC CRAWLER LAB",
      data: {
        categories,
        products,
        variants,
        settings,
        coupons,
        orders,
        inviteTokens,
        ibanAccounts,
        modules,
        b2bQuotes,
        tradeIns,
        print3ds,
        trailSpots,
        rigShowcases,
        certifiedChassis,
        buildLogs,
        reviews,
      },
    };

    const dateStr = new Date().toISOString().split("T")[0];
    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="cihanekspress-backup-${dateStr}.json"`,
      },
    });
  } catch (err) {
    console.error("Backup export error:", err);
    return NextResponse.json({ error: "Yedekleme oluşturulamadı" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = body.data || body;

    let restoredCategories = 0;
    let restoredProducts = 0;

    if (Array.isArray(data.categories)) {
      for (const cat of data.categories) {
        if (!cat.id || !cat.name || !cat.slug) continue;
        await prisma.category.upsert({
          where: { id: cat.id },
          update: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.image,
            order: cat.order ?? 0,
          },
          create: {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.image,
            order: cat.order ?? 0,
          },
        });
        restoredCategories++;
      }
    }

    if (Array.isArray(data.products)) {
      for (const p of data.products) {
        if (!p.id || !p.title || !p.slug) continue;
        await prisma.product.upsert({
          where: { id: p.id },
          update: {
            title: p.title,
            slug: p.slug,
            description: p.description,
            shortDescription: p.shortDescription,
            images: p.images ?? "[]",
            type: p.type ?? "SIMPLE",
            basePrice: Number(p.basePrice) || 0,
            salePrice: p.salePrice ? Number(p.salePrice) : null,
            costPrice: p.costPrice ? Number(p.costPrice) : null,
            sku: p.sku,
            stockQuantity: p.stockQuantity ?? 10,
            manageStock: p.manageStock ?? true,
            allowBackorders: p.allowBackorders ?? false,
            lowStockThreshold: p.lowStockThreshold ?? 3,
            isFeatured: p.isFeatured ?? false,
            digitalFileUrl: p.digitalFileUrl,
            videoUrl: p.videoUrl,
            weight: p.weight,
            dimensions: p.dimensions,
            attributesJson: p.attributesJson ?? "[]",
            compatibleModels: p.compatibleModels ?? "[]",
            categoryId: p.categoryId,
          },
          create: {
            id: p.id,
            title: p.title,
            slug: p.slug,
            description: p.description,
            shortDescription: p.shortDescription,
            images: p.images ?? "[]",
            type: p.type ?? "SIMPLE",
            basePrice: Number(p.basePrice) || 0,
            salePrice: p.salePrice ? Number(p.salePrice) : null,
            costPrice: p.costPrice ? Number(p.costPrice) : null,
            sku: p.sku,
            stockQuantity: p.stockQuantity ?? 10,
            manageStock: p.manageStock ?? true,
            allowBackorders: p.allowBackorders ?? false,
            lowStockThreshold: p.lowStockThreshold ?? 3,
            isFeatured: p.isFeatured ?? false,
            digitalFileUrl: p.digitalFileUrl,
            videoUrl: p.videoUrl,
            weight: p.weight,
            dimensions: p.dimensions,
            attributesJson: p.attributesJson ?? "[]",
            compatibleModels: p.compatibleModels ?? "[]",
            categoryId: p.categoryId,
          },
        });
        restoredProducts++;
      }
    }

    if (Array.isArray(data.variants)) {
      for (const v of data.variants) {
        if (!v.id || !v.productId || !v.name) continue;
        await prisma.productVariant.upsert({
          where: { id: v.id },
          update: {
            productId: v.productId,
            name: v.name,
            sku: v.sku,
            price: Number(v.price) || 0,
            stock: v.stock ?? 5,
            attributes: v.attributes ?? "{}",
            image: v.image,
          },
          create: {
            id: v.id,
            productId: v.productId,
            name: v.name,
            sku: v.sku,
            price: Number(v.price) || 0,
            stock: v.stock ?? 5,
            attributes: v.attributes ?? "{}",
            image: v.image,
          },
        });
      }
    }

    if (data.settings && data.settings.storeName) {
      await prisma.storeSetting.upsert({
        where: { id: "default" },
        update: {
          storeName: data.settings.storeName,
          storeTagline: data.settings.storeTagline,
          logoUrl: data.settings.logoUrl,
          headerBrandMode: data.settings.headerBrandMode,
          headerPrimaryText: data.settings.headerPrimaryText,
          headerSecondaryText: data.settings.headerSecondaryText,
          headerSuffixText: data.settings.headerSuffixText,
          showHeaderSubtitle: data.settings.showHeaderSubtitle,
          headerSubtitle: data.settings.headerSubtitle,
          logoHeight: data.settings.logoHeight,
          freeShippingThreshold: data.settings.freeShippingThreshold,
          defaultShippingFee: data.settings.defaultShippingFee,
          whatsappPhone: data.settings.whatsappPhone,
          bankAccountsJson: data.settings.bankAccountsJson,
        },
        create: {
          id: "default",
          storeName: data.settings.storeName,
          storeTagline: data.settings.storeTagline,
          logoUrl: data.settings.logoUrl,
          headerBrandMode: data.settings.headerBrandMode,
          headerPrimaryText: data.settings.headerPrimaryText,
          headerSecondaryText: data.settings.headerSecondaryText,
          headerSuffixText: data.settings.headerSuffixText,
          showHeaderSubtitle: data.settings.showHeaderSubtitle,
          headerSubtitle: data.settings.headerSubtitle,
          logoHeight: data.settings.logoHeight,
          freeShippingThreshold: data.settings.freeShippingThreshold,
          defaultShippingFee: data.settings.defaultShippingFee,
          whatsappPhone: data.settings.whatsappPhone,
          bankAccountsJson: data.settings.bankAccountsJson,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Yedek başarıyla geri yüklendi! (${restoredCategories} kategori, ${restoredProducts} ürün)`,
    });
  } catch (err) {
    console.error("Backup restore error:", err);
    return NextResponse.json({ error: "Yedek geri yüklenirken hata oluştu" }, { status: 500 });
  }
}
