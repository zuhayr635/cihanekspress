import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const trails = await prisma.trailSpot.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, trails });
  } catch (error) {
    console.error("Error fetching trails:", error);
    return NextResponse.json({ success: false, error: "Parkurlar alınamadı" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, city, difficulty, terrain, description, coordinates, coverImage } = body;

    if (!name || !city || !description) {
      return NextResponse.json({ error: "Parkur adı, şehir ve açıklama zorunludur." }, { status: 400 });
    }

    const session = await getAdminSession();
    // Normal kullanıcı eklerse otomatik onay veya admin kontrolü
    const trail = await prisma.trailSpot.create({
      data: {
        name,
        city,
        difficulty: difficulty || "ORTA",
        terrain: terrain || "KAYA",
        description,
        coordinates: coordinates || "",
        coverImage: coverImage || "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1000&q=80",
        isApproved: !!session, // Admin eklediyse direkt onaylı
      },
    });

    return NextResponse.json({ success: true, trail });
  } catch (error) {
    console.error("Error adding trail:", error);
    return NextResponse.json({ success: false, error: "Parkur kaydedilemedi" }, { status: 500 });
  }
}
