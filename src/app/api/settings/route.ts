import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureInitialized } from "@/lib/db-init";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  await ensureInitialized();
  const settings = await prisma.storeSetting.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    return NextResponse.json({ error: "Ayarlar bulunamadı" }, { status: 404 });
  }

  let bankAccounts = [];
  try {
    bankAccounts = JSON.parse(settings.bankAccountsJson);
  } catch {
    bankAccounts = [];
  }

  return NextResponse.json({
    id: settings.id,
    storeName: settings.storeName,
    storeTagline: settings.storeTagline,
    storeMode: settings.storeMode,
    currency: settings.currency,
    currencySymbol: settings.currencySymbol,
    taxRate: settings.taxRate,
    pricesIncludeTax: settings.pricesIncludeTax,
    freeShippingThreshold: settings.freeShippingThreshold,
    defaultShippingFee: settings.defaultShippingFee,
    bankTransferEnabled: settings.bankTransferEnabled,
    bankAccounts,
    whatsappOrderEnabled: settings.whatsappOrderEnabled,
    whatsappPhone: settings.whatsappPhone,
    whatsappMessageTemplate: settings.whatsappMessageTemplate,
    creditCardEnabled: settings.creditCardEnabled,
    creditCardProvider: settings.creditCardProvider,
    ccTestMode: settings.ccTestMode,
    panicMode: settings.panicMode,
    usdRate: settings.usdRate,
    blockedIps: (() => {
      try {
        return JSON.parse(settings.blockedIpsJson || "[]");
      } catch {
        return [];
      }
    })(),
  });
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const updated = await prisma.storeSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        storeName: body.storeName || "ATELIER CIHANPOL",
        storeTagline: body.storeTagline || "",
        storeMode: body.storeMode || "CATALOG_ONLY",
        currency: body.currency || "TL",
        currencySymbol: body.currencySymbol || "₺",
        taxRate: Number(body.taxRate) || 20,
        pricesIncludeTax: Boolean(body.pricesIncludeTax),
        freeShippingThreshold: Number(body.freeShippingThreshold) || 2000,
        defaultShippingFee: Number(body.defaultShippingFee) || 95,
        bankTransferEnabled: Boolean(body.bankTransferEnabled),
        bankAccountsJson: JSON.stringify(body.bankAccounts || []),
        whatsappOrderEnabled: Boolean(body.whatsappOrderEnabled),
        whatsappPhone: body.whatsappPhone || "",
        whatsappMessageTemplate: body.whatsappMessageTemplate || "",
        creditCardEnabled: Boolean(body.creditCardEnabled),
        creditCardProvider: body.creditCardProvider || "paytr",
        ccApiKey: body.ccApiKey || "",
        ccSecretKey: body.ccSecretKey || "",
        ccMerchantId: body.ccMerchantId || "",
        ccTestMode: Boolean(body.ccTestMode),
        panicMode: Boolean(body.panicMode),
        usdRate: body.usdRate !== undefined ? Number(body.usdRate) : 38.5,
        blockedIpsJson: JSON.stringify(body.blockedIps || []),
      },
      update: {
        storeName: body.storeName,
        storeTagline: body.storeTagline,
        storeMode: body.storeMode,
        currency: body.currency,
        currencySymbol: body.currencySymbol,
        taxRate: Number(body.taxRate),
        pricesIncludeTax: Boolean(body.pricesIncludeTax),
        freeShippingThreshold: Number(body.freeShippingThreshold),
        defaultShippingFee: Number(body.defaultShippingFee),
        bankTransferEnabled: Boolean(body.bankTransferEnabled),
        bankAccountsJson: JSON.stringify(body.bankAccounts || []),
        whatsappOrderEnabled: Boolean(body.whatsappOrderEnabled),
        whatsappPhone: body.whatsappPhone,
        whatsappMessageTemplate: body.whatsappMessageTemplate,
        creditCardEnabled: Boolean(body.creditCardEnabled),
        creditCardProvider: body.creditCardProvider,
        ccApiKey: body.ccApiKey !== undefined ? body.ccApiKey : undefined,
        ccSecretKey: body.ccSecretKey !== undefined ? body.ccSecretKey : undefined,
        ccMerchantId: body.ccMerchantId !== undefined ? body.ccMerchantId : undefined,
        ccTestMode: Boolean(body.ccTestMode),
        panicMode: body.panicMode !== undefined ? Boolean(body.panicMode) : undefined,
        usdRate: body.usdRate !== undefined ? Number(body.usdRate) : undefined,
        blockedIpsJson: body.blockedIps !== undefined ? JSON.stringify(body.blockedIps) : undefined,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 });
  }
}
