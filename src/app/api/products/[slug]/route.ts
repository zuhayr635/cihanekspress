import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Benzer / Çapraz satış ürünleri (Aynı kategoriden diğer ürünler)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        category: true,
      },
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (err) {
    console.error("Product fetch error:", err);
    return NextResponse.json({ error: "Ürün detayları alınamadı" }, { status: 500 });
  }
}

// Müşteri Yorum Gönderme (Admin Onayına Düşer)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { authorName, rating, comment } = await req.json();

    if (!authorName || !comment) {
      return NextResponse.json({ error: "İsim ve yorum alanları zorunludur" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    const review = await prisma.productReview.create({
      data: {
        productId: product.id,
        authorName: String(authorName).trim(),
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        comment: String(comment).trim(),
        isApproved: false, // Yönetici onayı bekler
        isVerifiedOwner: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Değerlendirmeniz başarıyla iletildi. Yönetici onayından sonra yayınlanacaktır.",
      review,
    });
  } catch (err) {
    console.error("Review submit error:", err);
    return NextResponse.json({ error: "Yorum kaydedilemedi" }, { status: 500 });
  }
}
