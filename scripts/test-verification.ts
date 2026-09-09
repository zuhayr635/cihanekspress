import prisma from "../src/lib/prisma";
import { ensureInitialized } from "../src/lib/db-init";
import { consumeInviteToken } from "../src/lib/token";

async function runVerification() {
  console.log("--- 1. Başlangıç Veritabanı ve Tohum (Seed) Kontrolü ---");
  await ensureInitialized();

  const settings = await prisma.storeSetting.findUnique({ where: { id: "default" } });
  console.log("Mağaza Modu:", settings?.storeMode, "(Beklenen: CATALOG_ONLY)");
  if (settings?.storeMode !== "CATALOG_ONLY") {
    throw new Error("Mağaza modu başlangıçta CATALOG_ONLY olmalı!");
  }

  const productsCount = await prisma.product.count();
  console.log("Toplam Ürün Adedi:", productsCount);
  if (productsCount === 0) {
    throw new Error("Ürünler oluşturulamadı!");
  }

  console.log("\n--- 2. Tek Kullanımlık Davetiye Token Yaşam Döngüsü Testi ---");
  // Yeni tek kullanımlık token üret
  const testTokenStr = "vip-test-" + Date.now();
  await prisma.inviteToken.create({
    data: {
      token: testTokenStr,
      status: "ACTIVE",
      note: "Test Davetiye",
      discountPercent: 20,
    },
  });

  // İlk tıklama (Token kullanılmalı ve yanmalı)
  console.log("Adım 2.1: İlk tıklama yapılıyor...");
  const firstTry = await consumeInviteToken(testTokenStr, "192.168.1.1");
  console.log("İlk Deneme Sonucu:", firstTry.success, "İndirim: %" + firstTry.discountPercent);
  if (!firstTry.success) {
    throw new Error("Aktif token ilk denemede başarılı olmalı!");
  }

  // İkinci tıklama (Aynı token artık geçersiz olmalı!)
  console.log("Adım 2.2: Aynı token ile ikinci tıklama yapılıyor (Tek kullanım testi)...");
  const secondTry = await consumeInviteToken(testTokenStr, "192.168.1.2");
  console.log("İkinci Deneme Sonucu:", secondTry.success, "Hata Mesajı:", secondTry.error);
  if (secondTry.success) {
    throw new Error("Kullanılmış token ikinci kez çalışmamalıydı! Güvenlik açığı!");
  }
  console.log("✓ Tek kullanımlık token yakma mekanizması %100 başarılı.");

  console.log("\n--- 3. Sipariş Oluşturma ve Dekont Yükleme Testi ---");
  const sampleProduct = await prisma.product.findFirst({ include: { variants: true } });
  if (!sampleProduct) throw new Error("Örnek ürün bulunamadı!");

  const orderNumber = "CHP-TEST-" + Date.now();
  const testOrder = await prisma.order.create({
    data: {
      orderNumber,
      customerName: "Test Müşteri",
      customerEmail: "test@example.com",
      customerPhone: "05550000000",
      shippingAddress: "Levent Mah. No:1",
      city: "İstanbul",
      paymentMethod: "BANK_TRANSFER",
      status: "PENDING_PAYMENT",
      subtotal: sampleProduct.basePrice,
      total: sampleProduct.basePrice,
      items: {
        create: [
          {
            productId: sampleProduct.id,
            productTitle: sampleProduct.title,
            price: sampleProduct.basePrice,
            quantity: 1,
            total: sampleProduct.basePrice,
          },
        ],
      },
    },
  });
  console.log("Oluşturulan Test Siparişi:", testOrder.orderNumber, "Tutar:", testOrder.total, "₺");

  // Dekont bildirimi
  const updatedOrder = await prisma.order.update({
    where: { id: testOrder.id },
    data: {
      receiptUrl: "https://example.com/dekont.jpg",
      adminNote: "Müşteri dekont yükledi (Ref: 123456)",
      status: "PROCESSING",
      paymentStatus: "COMPLETED",
    },
  });
  console.log("Dekont Sonrası Sipariş Durumu:", updatedOrder.status, "Ödeme:", updatedOrder.paymentStatus);

  console.log("\n==========================================");
  console.log(" TÜM DOĞRULAMA TESTLERİ BAŞARIYLA GEÇTİ!");
  console.log("==========================================");
}

runVerification()
  .catch((err) => {
    console.error("Test Başarısız:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
