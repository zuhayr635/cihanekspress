import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const prints = await prisma.print3d.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, prints });
  } catch (error) {
    console.error("Error fetching 3D print requests:", error);
    return NextResponse.json({ success: false, error: "Talepler alınamadı" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, email, projectTitle, fileUrl, scale, material, color, notes } = body;

    if (!customerName || !phone || !projectTitle) {
      return NextResponse.json({ error: "Lütfen ad, telefon ve proje başlığı alanlarını doldurun." }, { status: 400 });
    }

    const print = await prisma.print3d.create({
      data: {
        customerName,
        phone,
        email: email || "",
        projectTitle,
        fileUrl: fileUrl || "",
        scale: scale || "1/10",
        material: material || "PETG",
        color: color || "Siyah",
        notes: notes || "",
      },
    });

    return NextResponse.json({ success: true, print });
  } catch (error) {
    console.error("Error creating 3D print request:", error);
    return NextResponse.json({ success: false, error: "3D baskı talebi oluşturulamadı" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, adminPrice, status } = body;

    const updated = await prisma.print3d.update({
      where: { id },
      data: {
        ...(adminPrice !== undefined ? { adminPrice: Number(adminPrice) } : {}),
        ...(status ? { status } : {}),
      },
    });

    return NextResponse.json({ success: true, print: updated });
  } catch (error) {
    console.error("Error updating 3D print request:", error);
    return NextResponse.json({ success: false, error: "Güncellenemedi" }, { status: 500 });
  }
}
