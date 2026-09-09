import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const rigs = await prisma.rigShowcase.findMany({
      where: { isApproved: true },
      orderBy: [{ isWinner: "desc" }, { votesCount: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, rigs });
  } catch (error) {
    console.error("Error fetching community rigs:", error);
    return NextResponse.json({ success: false, error: "Galeri yüklenemedi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, authorName, city, vehicleModel, specs, photoUrl } = body;

    // Oy Verme İşlemi
    if (action === "vote" && id) {
      const updated = await prisma.rigShowcase.update({
        where: { id },
        data: { votesCount: { increment: 1 } },
      });
      return NextResponse.json({ success: true, rig: updated });
    }

    // Yeni Araç Yükleme İşlemi
    if (!authorName || !vehicleModel || !photoUrl) {
      return NextResponse.json({ error: "Lütfen sürücü adı, araç modeli ve fotoğraf URL girin." }, { status: 400 });
    }

    const newRig = await prisma.rigShowcase.create({
      data: {
        authorName,
        city: city || "Türkiye",
        vehicleModel,
        specsJson: specs ? JSON.stringify(specs) : "{}",
        photoUrl,
        isApproved: true,
      },
    });

    return NextResponse.json({ success: true, rig: newRig });
  } catch (error) {
    console.error("Error with community rig action:", error);
    return NextResponse.json({ success: false, error: "İşlem gerçekleştirilemedi" }, { status: 500 });
  }
}
