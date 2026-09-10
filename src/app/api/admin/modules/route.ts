import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { ensureInitialized } from "@/lib/db-init";

export async function GET() {
  try {
    await ensureInitialized();
    const modules = await prisma.moduleConfig.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ success: true, modules });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json({ success: true, modules: [] });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { key, isEnabled, settingsJson } = body;

    if (!key) {
      return NextResponse.json({ error: "Modül anahtarı (key) zorunludur" }, { status: 400 });
    }

    const updated = await prisma.moduleConfig.update({
      where: { key },
      data: {
        ...(typeof isEnabled === "boolean" ? { isEnabled } : {}),
        ...(settingsJson !== undefined ? { settingsJson: typeof settingsJson === "string" ? settingsJson : JSON.stringify(settingsJson) } : {}),
      },
    });

    return NextResponse.json({ success: true, module: updated });
  } catch (error) {
    console.error("Error updating module:", error);
    return NextResponse.json({ success: false, error: "Modül güncellenemedi" }, { status: 500 });
  }
}
