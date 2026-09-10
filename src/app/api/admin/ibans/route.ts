import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { ensureInitialized } from "@/lib/db-init";

// GET: Tüm dinamik IBAN havuzunu listele (boşsa varsayılanları aktar)
export async function GET() {
  try {
    await ensureInitialized();
    let ibans = await prisma.ibanAccount.findMany({
      orderBy: [{ priorityOrder: "asc" }, { createdAt: "desc" }],
    });

    // Eğer havuzda hiç IBAN yoksa, StoreSetting'deki banka hesaplarını havuza tohumla
    if (ibans.length === 0) {
      const settings = await prisma.storeSetting.findUnique({ where: { id: "default" } });
      let seedAccounts = [];
      try {
        seedAccounts = JSON.parse(settings?.bankAccountsJson || "[]");
      } catch {
        seedAccounts = [];
      }

      if (seedAccounts.length > 0) {
        for (const [idx, acc] of seedAccounts.entries()) {
          try {
            await prisma.ibanAccount.create({
              data: {
                bankName: acc.bankName || "Banka",
                accountHolder: acc.accountHolder || "Hesap Sahibi",
                iban: acc.iban || `TR00 0000 0000 0000 0000 0000 0${idx + 1}`,
                dailyLimit: 85000,
                dailyOrderLimit: 15,
                priorityOrder: idx + 1,
                notes: `Birincil Tohum Hesap ${idx + 1}`,
              },
            });
          } catch {
            // Uniq iban çakışması olursa yoksay
          }
        }
        ibans = await prisma.ibanAccount.findMany({
          orderBy: [{ priorityOrder: "asc" }, { createdAt: "desc" }],
        });
      }
    }

    return NextResponse.json({ success: true, ibans });
  } catch (err) {
    console.error("IBAN fetch error:", err);
    return NextResponse.json({ success: true, ibans: [] });
  }
}

// POST: Yeni IBAN ekle
export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bankName, accountHolder, iban, dailyLimit, dailyOrderLimit, priorityOrder, notes } = body;

    if (!bankName || !accountHolder || !iban) {
      return NextResponse.json(
        { error: "Banka adı, hesap sahibi ve IBAN zorunludur." },
        { status: 400 }
      );
    }

    // Temiz IBAN formatı
    const cleanIban = iban.replace(/\s+/g, " ").trim().toUpperCase();

    const created = await prisma.ibanAccount.create({
      data: {
        bankName,
        accountHolder,
        iban: cleanIban,
        dailyLimit: dailyLimit !== undefined ? Number(dailyLimit) : 75000,
        dailyOrderLimit: dailyOrderLimit !== undefined ? Number(dailyOrderLimit) : 15,
        priorityOrder: priorityOrder !== undefined ? Number(priorityOrder) : 0,
        notes: notes || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, iban: created });
  } catch (err: any) {
    console.error("IBAN create error:", err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Bu IBAN adresi zaten havuzda kayıtlı." }, { status: 400 });
    }
    return NextResponse.json({ error: "IBAN eklenemedi" }, { status: 500 });
  }
}

// PATCH: IBAN güncelle veya günün sayaçlarını sıfırla
export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Tüm havuzun günlük sayaçlarını sıfırlama aksiyonu
    if (body.action === "reset_all_daily") {
      await prisma.ibanAccount.updateMany({
        data: {
          currentDailyTotal: 0,
          currentOrderCount: 0,
        },
      });
      return NextResponse.json({ success: true, message: "Tüm IBAN günlük limit ve sayaçları sıfırlandı." });
    }

    const { id, bankName, accountHolder, iban, dailyLimit, dailyOrderLimit, priorityOrder, isActive, notes, resetDaily } = body;

    if (!id) {
      return NextResponse.json({ error: "IBAN ID gereklidir." }, { status: 400 });
    }

    const updateData: any = {};
    if (bankName !== undefined) updateData.bankName = bankName;
    if (accountHolder !== undefined) updateData.accountHolder = accountHolder;
    if (iban !== undefined) updateData.iban = iban.replace(/\s+/g, " ").trim().toUpperCase();
    if (dailyLimit !== undefined) updateData.dailyLimit = Number(dailyLimit);
    if (dailyOrderLimit !== undefined) updateData.dailyOrderLimit = Number(dailyOrderLimit);
    if (priorityOrder !== undefined) updateData.priorityOrder = Number(priorityOrder);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (notes !== undefined) updateData.notes = notes;
    if (resetDaily) {
      updateData.currentDailyTotal = 0;
      updateData.currentOrderCount = 0;
    }

    const updated = await prisma.ibanAccount.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, iban: updated });
  } catch (err) {
    console.error("IBAN update error:", err);
    return NextResponse.json({ error: "IBAN güncellenemedi" }, { status: 500 });
  }
}

// DELETE: IBAN sil
export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID parametresi gereklidir" }, { status: 400 });
    }

    await prisma.ibanAccount.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "IBAN havuzdan kaldırıldı." });
  } catch (err) {
    console.error("IBAN delete error:", err);
    return NextResponse.json({ error: "IBAN silinemedi" }, { status: 500 });
  }
}
