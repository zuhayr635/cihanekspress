import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };
  return text
    .split("")
    .map((c) => trMap[c] || c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const items = Array.isArray(body.products) ? body.products : [];

    if (items.length === 0) {
      return NextResponse.json({ error: "İçe aktarılacak ürün verisi bulunamadı" }, { status: 400 });
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const item of items) {
      if (!item.title || !item.basePrice) continue;

      const title = String(item.title).trim();
      const basePrice = Number(item.basePrice) || 0;
      const salePrice = item.salePrice ? Number(item.salePrice) : null;
      const costPrice = item.costPrice ? Number(item.costPrice) : null;
      const stockQuantity = item.stockQuantity !== undefined ? parseInt(item.stockQuantity, 10) : 10;
      const description = item.description || title;
      const shortDescription = item.shortDescription || null;
      const sku = item.sku || null;
      const isFeatured = Boolean(item.isFeatured);

      // Otomatik benzersiz slug oluştur
      let baseSlug = slugify(title);
      let uniqueSlug = baseSlug;
      let counter = 1;

      // Ürün başlığına veya SKU'ya göre mevcut mu kontrol et
      const existingProduct = await prisma.product.findFirst({
        where: {
          OR: [
            ...(sku ? [{ sku }] : []),
            { title: title },
          ],
        },
      });

      if (existingProduct) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            title,
            basePrice,
            salePrice,
            costPrice,
            stockQuantity,
            description,
            shortDescription,
            isFeatured,
          },
        });
        updatedCount++;
      } else {
        while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }

        await prisma.product.create({
          data: {
            title,
            slug: uniqueSlug,
            sku,
            basePrice,
            salePrice,
            costPrice,
            stockQuantity,
            description,
            shortDescription,
            isFeatured,
            images: item.images ? (typeof item.images === "string" ? item.images : JSON.stringify(item.images)) : "[]",
          },
        });
        createdCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdCount} yeni ürün eklendi, ${updatedCount} ürün güncellendi.`,
      createdCount,
      updatedCount,
    });
  } catch (err) {
    console.error("Bulk product import error:", err);
    return NextResponse.json({ error: "Toplu içe aktarma sırasında hata oluştu" }, { status: 500 });
  }
}
