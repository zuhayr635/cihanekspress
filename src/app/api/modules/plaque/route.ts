import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serial = searchParams.get("serial");

  if (!serial) {
    return NextResponse.json({ error: "Seri numarası gereklidir." }, { status: 400 });
  }

  try {
    const chassis = await prisma.certifiedChassis.findUnique({
      where: { serialNumber: serial.trim().toUpperCase() },
    });

    if (!chassis) {
      return NextResponse.json({
        success: false,
        found: false,
        message: "Bu seri numarasına ait onaylı tescil sertifikası bulunamadı.",
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      chassis,
    });
  } catch (error) {
    console.error("Error querying certified chassis:", error);
    return NextResponse.json({ success: false, error: "Sorgulanamadı" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { serialNumber, ownerName, buildDate, builderSignature, specs } = body;

    if (!serialNumber || !ownerName) {
      return NextResponse.json({ error: "Seri numarası ve araç sahibi zorunludur." }, { status: 400 });
    }

    const created = await prisma.certifiedChassis.create({
      data: {
        serialNumber: serialNumber.trim().toUpperCase(),
        ownerName,
        buildDate: buildDate || new Date().toLocaleDateString("tr-TR"),
        builderSignature: builderSignature || "CIHANPOL MASTER BUILDER",
        specsJson: specs ? JSON.stringify(specs) : "{}",
      },
    });

    return NextResponse.json({ success: true, chassis: created });
  } catch (error) {
    console.error("Error registering chassis plaque:", error);
    return NextResponse.json({ success: false, error: "Plaka kaydedilemedi" }, { status: 500 });
  }
}
