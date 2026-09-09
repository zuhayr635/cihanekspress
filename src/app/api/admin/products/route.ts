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
      type,
      basePrice,
      salePrice,
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

    const product = await prisma.product.create({
      data: {
        title,
        slug: finalSlug,
        description: description || "",
        shortDescription: shortDescription || null,
        images: JSON.stringify(images || []),
        type: type || "SIMPLE",
        basePrice: Number(basePrice),
        salePrice: salePrice ? Number(salePrice) : null,
        sku: sku || null,
        stockQuantity: Number(stockQuantity) || 10,
        isFeatured: Boolean(isFeatured),
        categoryId: categoryId || null,
        attributesJson: JSON.stringify(attributesJson || []),
      },
    });

    // Varyasyonları ekle
    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: v.name,
            sku: v.sku || null,
            price: Number(v.price) || Number(basePrice),
            stock: Number(v.stock) || 5,
            attributes: JSON.stringify(v.attributes || {}),
          },
        });
      }
    }

    return NextResponse.json({ success: true, product });
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
    const { id, title, description, shortDescription, images, basePrice, salePrice, stockQuantity, isFeatured, categoryId } = body;

    if (!id) {
      return NextResponse.json({ error: "Ürün ID gereklidir" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        shortDescription,
        images: images ? JSON.stringify(images) : undefined,
        basePrice: basePrice ? Number(basePrice) : undefined,
        salePrice: salePrice !== undefined ? (salePrice ? Number(salePrice) : null) : undefined,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        categoryId: categoryId || undefined,
      },
    });

    return NextResponse.json({ success: true, product: updated });
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
