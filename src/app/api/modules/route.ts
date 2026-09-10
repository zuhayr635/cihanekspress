import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureInitialized } from "@/lib/db-init";

export async function GET() {
  try {
    await ensureInitialized();
    const modules = await prisma.moduleConfig.findMany({
      select: {
        key: true,
        name: true,
        category: true,
        isEnabled: true,
        settingsJson: true,
      },
      orderBy: { orderIndex: "asc" },
    });

    const activeMap: Record<string, boolean> = {};
    const configsMap: Record<string, any> = {};

    modules.forEach((m) => {
      activeMap[m.key] = m.isEnabled;
      try {
        configsMap[m.key] = JSON.parse(m.settingsJson);
      } catch {
        configsMap[m.key] = {};
      }
    });

    return NextResponse.json({
      success: true,
      active: activeMap,
      configs: configsMap,
      list: modules,
    });
  } catch (error) {
    console.error("Error fetching public modules:", error);
    return NextResponse.json({
      success: true,
      active: {},
      configs: {},
      list: [],
    });
  }
}
