import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const quotes = await prisma.b2BQuote.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, quotes });
  } catch (error) {
    console.error("Error fetching B2B quotes:", error);
    return NextResponse.json({ success: false, error: "Teklifler alınamadı" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, contactName, phone, email, vehicleCount, targetBudget, notes } = body;

    if (!contactName || !phone || !notes) {
      return NextResponse.json({ error: "Lütfen ad, telefon ve proje notlarınızı eksiksiz girin." }, { status: 400 });
    }

    const newQuote = await prisma.b2BQuote.create({
      data: {
        companyName: companyName || "Bireysel Takım Talebi",
        contactName,
        phone,
        email: email || "",
        vehicleCount: Number(vehicleCount) || 1,
        targetBudget: targetBudget ? Number(targetBudget) : null,
        notes,
      },
    });

    return NextResponse.json({ success: true, quote: newQuote });
  } catch (error) {
    console.error("Error creating B2B quote:", error);
    return NextResponse.json({ success: false, error: "Teklif iletilemedi" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, adminReplyNote } = body;

    const updated = await prisma.b2BQuote.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(adminReplyNote !== undefined ? { adminReplyNote } : {}),
      },
    });

    return NextResponse.json({ success: true, quote: updated });
  } catch (error) {
    console.error("Error updating B2B quote:", error);
    return NextResponse.json({ success: false, error: "Güncellenemedi" }, { status: 500 });
  }
}
