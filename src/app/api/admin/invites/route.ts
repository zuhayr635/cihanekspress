import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { generateTokenString } from "@/lib/token";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const invites = await prisma.inviteToken.findMany({
      include: {
        orders: {
          select: { id: true, orderNumber: true, total: true, status: true, customerName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invites });
  } catch (err) {
    console.error("Invites fetch error:", err);
    return NextResponse.json({ error: "Davetiye linkleri alınamadı" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { note, discountPercent, durationDays } = await req.json();

    const token = generateTokenString();
    let expiresAt: Date | null = null;

    if (durationDays && Number(durationDays) > 0) {
      expiresAt = new Date(Date.now() + Number(durationDays) * 24 * 60 * 60 * 1000);
    }

    const invite = await prisma.inviteToken.create({
      data: {
        token,
        status: "ACTIVE",
        note: note || "Özel VIP Müşteri",
        discountPercent: Number(discountPercent) || 0,
        expiresAt,
      },
    });

    return NextResponse.json({ success: true, invite });
  } catch (err) {
    console.error("Invite create error:", err);
    return NextResponse.json({ error: "Davetiye linki üretilemedi" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gereklidir" }, { status: 400 });
    }

    if (searchParams.get("permanent") === "true") {
      await prisma.inviteToken.delete({ where: { id } });
    } else {
      await prisma.inviteToken.update({
        where: { id },
        data: { status: "REVOKED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Invite revoke error:", err);
    return NextResponse.json({ error: "Davetiye işlemi başarısız" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID ve status zorunludur" }, { status: 400 });
    }

    const updated = await prisma.inviteToken.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, invite: updated });
  } catch (err) {
    console.error("Invite update error:", err);
    return NextResponse.json({ error: "Davetiye güncellenemedi" }, { status: 500 });
  }
}
