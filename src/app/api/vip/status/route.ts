import { NextResponse } from "next/server";
import { getVipSession } from "@/lib/token";

export async function GET() {
  const session = await getVipSession();
  return NextResponse.json(session);
}
