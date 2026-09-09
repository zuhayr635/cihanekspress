import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const tradeIns = await prisma.tradeIn.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, tradeIns });
  } catch (error) {
    console.error("Error fetching trade-ins:", error);
    return NextResponse.json({ success: false, error: "Talepler alınamadı" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, currentChassis, condition, expectedPrice, desiredProduct, photoUrls } = body;

    if (!customerName || !phone || !currentChassis) {
      return NextResponse.json({ error: "İsim, telefon ve mevcut şasi modeli zorunludur." }, { status: 400 });
    }

    const newTradeIn = await prisma.tradeIn.create({
      data: {
        customerName,
        phone,
        currentChassis,
        condition: condition || "TEMIZ",
        expectedPrice: expectedPrice ? Number(expectedPrice) : null,
        desiredProduct: desiredProduct || "",
        photoUrlsJson: photoUrls ? JSON.stringify(photoUrls) : "[]",
      },
    });

    return NextResponse.json({ success: true, tradeIn: newTradeIn });
  } catch (error) {
    console.error("Error creating trade-in:", error);
    return NextResponse.json({ success: false, error: "Takas başvurusu alınamadı" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, adminOfferPrice, status } = body;

    const updated = await prisma.tradeIn.update({
      where: { id },
      data: {
        ...(adminOfferPrice !== undefined ? { adminOfferPrice: Number(adminOfferPrice) } : {}),
        ...(status ? { status } : {}),
      },
    });

    return NextResponse.json({ success: true, tradeIn: updated });
  } catch (error) {
    console.error("Error updating trade-in:", error);
    return NextResponse.json({ success: false, error: "Güncellenemedi" }, { status: 500 });
  }
}
