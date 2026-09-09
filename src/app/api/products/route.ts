import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureInitialized } from "@/lib/db-init";

export async function GET(req: Request) {
  await ensureInitialized();
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  const searchQuery = searchParams.get("q");
  const featured = searchParams.get("featured");

  try {
    const where: Record<string, unknown> = {};

    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { shortDescription: { contains: searchQuery } },
      ];
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: true,
          reviews: {
            where: { isApproved: true },
            select: { id: true, rating: true, comment: true, authorName: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { order: "asc" },
      }),
    ]);

    return NextResponse.json({ products, categories });
  } catch (err) {
    console.error("Products fetch error:", err);
    return NextResponse.json({ error: "Ürünler alınırken hata oluştu" }, { status: 500 });
  }
}
