import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      shortDescription,
      images,
      videoUrl,
      type,
      basePrice,
      salePrice,
      costPrice,
      compatibleModels,
      sku,
      stockQuantity,
      isFeatured,
      categoryId,
      attributesJson,
      variants,
    } = body;

    if (!title || !basePrice) {
      return NextResponse.json({ error: "Başlık ve fiyat zorunludur" }, { status: 400 });
    }

    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-") + `-${Date.now().toString().slice(-4)}`;

    const imagesJson = Array.isArray(images)
      ? JSON.stringify(images)
      : typeof images === "string"
      ? images
      : "[]";

    const product = await prisma.product.create({
      data: {
        title,
        slug: finalSlug,
        description: description || "",
        shortDescription: shortDescription || null,
        images: imagesJson,
        videoUrl: videoUrl || null,
        type: type || "SIMPLE",
        basePrice: Number(basePrice),
        salePrice: salePrice ? Number(salePrice) : null,
        costPrice: costPrice ? Number(costPrice) : null,
        compatibleModels: compatibleModels ? (typeof compatibleModels === "string" ? compatibleModels : JSON.stringify(compatibleModels)) : "[]",
        sku: sku || null,
        stockQuantity: Number(stockQuantity) || 10,
        isFeatured: Boolean(isFeatured),
        categoryId: categoryId || null,
        attributesJson: JSON.stringify(attributesJson || []),
      },
    });

    // Fotoğraflı Varyasyonları ekle
    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        if (!v.name) continue;
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: v.name,
            sku: v.sku || null,
            price: Number(v.price) || Number(basePrice),
            stock: Number(v.stock) ?? 5,
            image: v.image || null,
            attributes: typeof v.attributes === "string" ? v.attributes : JSON.stringify(v.attributes || {}),
          },
        });
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { variants: true, category: true },
    });

    return NextResponse.json({ success: true, product: fullProduct });
  } catch (err) {
    console.error("Product create error:", err);
    return NextResponse.json({ error: "Ürün kaydedilemedi" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      title,
      description,
      shortDescription,
      images,
      videoUrl,
      basePrice,
      salePrice,
      costPrice,
      compatibleModels,
      sku,
      stockQuantity,
      isFeatured,
      categoryId,
      variants,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Ürün ID gereklidir" }, { status: 400 });
    }

    const imagesJson = images !== undefined
      ? Array.isArray(images)
        ? JSON.stringify(images)
        : typeof images === "string"
        ? images
        : undefined
      : undefined;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        shortDescription,
        images: imagesJson,
        videoUrl: videoUrl !== undefined ? (videoUrl || null) : undefined,
        basePrice: basePrice ? Number(basePrice) : undefined,
        salePrice: salePrice !== undefined ? (salePrice ? Number(salePrice) : null) : undefined,
        costPrice: costPrice !== undefined ? (costPrice ? Number(costPrice) : null) : undefined,
        compatibleModels: compatibleModels !== undefined ? (typeof compatibleModels === "string" ? compatibleModels : JSON.stringify(compatibleModels)) : undefined,
        sku: sku !== undefined ? sku : undefined,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        categoryId: categoryId || undefined,
      },
    });

    // Fotoğraflı Varyasyonları Senkronize Et
    if (variants && Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({
        where: { productId: id },
      });

      for (const v of variants) {
        if (!v.name) continue;
        await prisma.productVariant.create({
          data: {
            productId: id,
            name: v.name,
            sku: v.sku || null,
            price: Number(v.price) || Number(basePrice || updated.basePrice),
            stock: Number(v.stock) ?? 5,
            image: v.image || null,
            attributes: typeof v.attributes === "string" ? v.attributes : JSON.stringify(v.attributes || {}),
          },
        });
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, category: true },
    });

    return NextResponse.json({ success: true, product: fullProduct });
  } catch (err) {
    console.error("Product update error:", err);
    return NextResponse.json({ error: "Ürün güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Ürün ID gereklidir" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product delete error:", err);
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 });
  }
}
