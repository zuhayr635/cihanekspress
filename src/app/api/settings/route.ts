import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureInitialized } from "@/lib/db-init";
import { getAdminSession } from "@/lib/auth";

const DEFAULT_STORE_SETTINGS = {
  id: "default",
  storeName: "CIHANPOL RC CRAWLER LAB",
  storeTagline: "Özel Yapım Kaya Tırmanıcılar & CNC Performans Parçaları",
  storeMode: "CATALOG_ONLY",
  logoUrl: "",
  headerBrandMode: "BOTH",
  headerPrimaryText: "cihan",
  headerSecondaryText: "ekspress",
  headerSuffixText: ".com",
  showHeaderSubtitle: true,
  headerSubtitle: "RC SCALE CRAWLER ATÖLYE SERGİ KATALOĞU",
  logoHeight: 38,
  currency: "TL",
  currencySymbol: "₺",
  taxRate: 20,
  pricesIncludeTax: true,
  freeShippingThreshold: 2000,
  defaultShippingFee: 95,
  bankTransferEnabled: true,
  bankAccounts: [
    {
      bankName: "Garanti BBVA",
      accountHolder: "CIHANPOL RC MODELCİLİK A.Ş.",
      iban: "TR12 0006 2000 0001 2345 6789 01",
    },
  ],
  whatsappOrderEnabled: true,
  whatsappPhone: "+905551234567",
  whatsappMessageTemplate: "Merhaba, sipariş vermek istiyorum.",
  creditCardEnabled: true,
  creditCardProvider: "paytr",
  ccTestMode: true,
  panicMode: false,
  usdRate: 38.5,
  blockedIps: [],
  kuruEslestirmeEnabled: true,
  burnerTimeoutMinutes: 15,
  stealthCamouflageEnabled: true,
  stealthServiceTitle: "3D CAD Çizim ve Teknik Danışmanlık Hizmet Bedeli",
  safeMemos: [
    "Teknik Danışmanlık Hizmet Bedeli",
    "3D CAD Modelleme",
    "Emanet İadesi",
    "Yazılım ve Tasarım Desteği",
    "Proje Çizim Bedeli",
  ],
  honeypotEnabled: true,
  honeypotMode: "MAINTENANCE",
  honeypotMessage: "Sistem Bakımı: Bankacılık API entegrasyonumuzda altyapı çalışması yapılmaktadır. Lütfen daha sonra tekrar deneyiniz.",
};

export async function GET() {
  try {
    await ensureInitialized();
    const settings = await prisma.storeSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return NextResponse.json(DEFAULT_STORE_SETTINGS);
    }

    let bankAccounts = [];
    try {
      bankAccounts = JSON.parse(settings.bankAccountsJson);
    } catch {
      bankAccounts = DEFAULT_STORE_SETTINGS.bankAccounts;
    }

    return NextResponse.json({
      id: settings.id,
      storeName: settings.storeName || DEFAULT_STORE_SETTINGS.storeName,
      storeTagline: settings.storeTagline || "",
      storeMode: settings.storeMode || "CATALOG_ONLY",
      logoUrl: settings.logoUrl || "",
      headerBrandMode: settings.headerBrandMode || "BOTH",
      headerPrimaryText: settings.headerPrimaryText || "cihan",
      headerSecondaryText: settings.headerSecondaryText || "ekspress",
      headerSuffixText: settings.headerSuffixText || ".com",
      showHeaderSubtitle: settings.showHeaderSubtitle !== undefined ? settings.showHeaderSubtitle : true,
      headerSubtitle: settings.headerSubtitle || "RC SCALE CRAWLER ATÖLYE SERGİ KATALOĞU",
      logoHeight: settings.logoHeight || 38,
      currency: settings.currency || "TL",
      currencySymbol: settings.currencySymbol || "₺",
      taxRate: settings.taxRate ?? 20,
      pricesIncludeTax: settings.pricesIncludeTax ?? true,
      freeShippingThreshold: settings.freeShippingThreshold ?? 2000,
      defaultShippingFee: settings.defaultShippingFee ?? 95,
      bankTransferEnabled: settings.bankTransferEnabled ?? true,
      bankAccounts,
      whatsappOrderEnabled: settings.whatsappOrderEnabled ?? true,
      whatsappPhone: settings.whatsappPhone || "",
      whatsappMessageTemplate: settings.whatsappMessageTemplate || "",
      creditCardEnabled: settings.creditCardEnabled ?? true,
      creditCardProvider: settings.creditCardProvider || "paytr",
      ccTestMode: settings.ccTestMode ?? true,
      panicMode: settings.panicMode ?? false,
      usdRate: settings.usdRate ?? 38.5,
      blockedIps: (() => {
        try {
          return JSON.parse(settings.blockedIpsJson || "[]");
        } catch {
          return [];
        }
      })(),
      kuruEslestirmeEnabled: settings.kuruEslestirmeEnabled ?? true,
      burnerTimeoutMinutes: settings.burnerTimeoutMinutes ?? 15,
      stealthCamouflageEnabled: settings.stealthCamouflageEnabled ?? true,
      stealthServiceTitle: settings.stealthServiceTitle || "3D CAD Çizim ve Teknik Danışmanlık Hizmet Bedeli",
      safeMemos: (() => {
        try {
          return JSON.parse(settings.safeMemosJson || "[]");
        } catch {
          return DEFAULT_STORE_SETTINGS.safeMemos;
        }
      })(),
      honeypotEnabled: settings.honeypotEnabled ?? true,
      honeypotMode: settings.honeypotMode || "MAINTENANCE",
      honeypotMessage: settings.honeypotMessage || "Sistem Bakımı: Bankacılık API entegrasyonumuzda altyapı çalışması yapılmaktadır. Lütfen daha sonra tekrar deneyiniz.",
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(DEFAULT_STORE_SETTINGS);
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    await ensureInitialized();
    const body = await req.json();

    const updated = await prisma.storeSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        storeName: body.storeName || "ATELIER CIHANPOL",
        storeTagline: body.storeTagline || "",
        storeMode: body.storeMode || "CATALOG_ONLY",
        logoUrl: body.logoUrl !== undefined ? body.logoUrl : "",
        headerBrandMode: body.headerBrandMode || "BOTH",
        headerPrimaryText: body.headerPrimaryText || "cihan",
        headerSecondaryText: body.headerSecondaryText || "ekspress",
        headerSuffixText: body.headerSuffixText !== undefined ? body.headerSuffixText : ".com",
        showHeaderSubtitle: body.showHeaderSubtitle !== undefined ? Boolean(body.showHeaderSubtitle) : true,
        headerSubtitle: body.headerSubtitle !== undefined ? body.headerSubtitle : "RC SCALE CRAWLER ATÖLYE SERGİ KATALOĞU",
        logoHeight: body.logoHeight !== undefined ? Number(body.logoHeight) : 38,
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
        kuruEslestirmeEnabled: body.kuruEslestirmeEnabled !== undefined ? Boolean(body.kuruEslestirmeEnabled) : true,
        burnerTimeoutMinutes: body.burnerTimeoutMinutes !== undefined ? Number(body.burnerTimeoutMinutes) : 15,
        stealthCamouflageEnabled: body.stealthCamouflageEnabled !== undefined ? Boolean(body.stealthCamouflageEnabled) : true,
        stealthServiceTitle: body.stealthServiceTitle || "3D CAD Çizim ve Teknik Danışmanlık Hizmet Bedeli",
        safeMemosJson: body.safeMemos !== undefined ? JSON.stringify(body.safeMemos) : undefined,
        honeypotEnabled: body.honeypotEnabled !== undefined ? Boolean(body.honeypotEnabled) : true,
        honeypotMode: body.honeypotMode || "MAINTENANCE",
        honeypotMessage: body.honeypotMessage || "Sistem Bakımı: Bankacılık API entegrasyonumuzda altyapı çalışması yapılmaktadır.",
      },
      update: {
        storeName: body.storeName,
        storeTagline: body.storeTagline,
        storeMode: body.storeMode,
        logoUrl: body.logoUrl !== undefined ? body.logoUrl : undefined,
        headerBrandMode: body.headerBrandMode !== undefined ? body.headerBrandMode : undefined,
        headerPrimaryText: body.headerPrimaryText !== undefined ? body.headerPrimaryText : undefined,
        headerSecondaryText: body.headerSecondaryText !== undefined ? body.headerSecondaryText : undefined,
        headerSuffixText: body.headerSuffixText !== undefined ? body.headerSuffixText : undefined,
        showHeaderSubtitle: body.showHeaderSubtitle !== undefined ? Boolean(body.showHeaderSubtitle) : undefined,
        headerSubtitle: body.headerSubtitle !== undefined ? body.headerSubtitle : undefined,
        logoHeight: body.logoHeight !== undefined ? Number(body.logoHeight) : undefined,
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
        kuruEslestirmeEnabled: body.kuruEslestirmeEnabled !== undefined ? Boolean(body.kuruEslestirmeEnabled) : undefined,
        burnerTimeoutMinutes: body.burnerTimeoutMinutes !== undefined ? Number(body.burnerTimeoutMinutes) : undefined,
        stealthCamouflageEnabled: body.stealthCamouflageEnabled !== undefined ? Boolean(body.stealthCamouflageEnabled) : undefined,
        stealthServiceTitle: body.stealthServiceTitle !== undefined ? body.stealthServiceTitle : undefined,
        safeMemosJson: body.safeMemos !== undefined ? JSON.stringify(body.safeMemos) : undefined,
        honeypotEnabled: body.honeypotEnabled !== undefined ? Boolean(body.honeypotEnabled) : undefined,
        honeypotMode: body.honeypotMode !== undefined ? body.honeypotMode : undefined,
        honeypotMessage: body.honeypotMessage !== undefined ? body.honeypotMessage : undefined,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 });
  }
}
