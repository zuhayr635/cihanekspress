import prisma from "./prisma";
import bcrypt from "bcryptjs";

export async function ensureInitialized() {
  try {
    // 0. Auto-Migration for SQLite Schema: Ensure all tables and columns exist
    try {
      const cols: any[] = await prisma.$queryRawUnsafe("PRAGMA table_info(StoreSetting)");
      const colNames = new Set(cols.map((c: any) => c.name));

      const storeSettingCols: [string, string][] = [
        ["logoUrl", "TEXT DEFAULT ''"],
        ["headerBrandMode", "TEXT DEFAULT 'BOTH'"],
        ["headerPrimaryText", "TEXT DEFAULT 'cihan'"],
        ["headerSecondaryText", "TEXT DEFAULT 'ekspress'"],
        ["headerSuffixText", "TEXT DEFAULT '.com'"],
        ["showHeaderSubtitle", "BOOLEAN DEFAULT 1"],
        ["headerSubtitle", "TEXT DEFAULT 'RC SCALE CRAWLER ATÖLYE SERGİ KATALOĞU'"],
        ["logoHeight", "INTEGER DEFAULT 38"],
        ["panicMode", "BOOLEAN DEFAULT 0"],
        ["usdRate", "REAL DEFAULT 38.5"],
        ["blockedIpsJson", "TEXT DEFAULT '[]'"],
        ["kuruEslestirmeEnabled", "BOOLEAN DEFAULT 1"],
        ["burnerTimeoutMinutes", "INTEGER DEFAULT 15"],
        ["stealthCamouflageEnabled", "BOOLEAN DEFAULT 1"],
        ["stealthServiceTitle", "TEXT DEFAULT '3D CAD Çizim ve Teknik Modelleme Hizmet Bedeli'"],
        ["safeMemosJson", "TEXT DEFAULT '[\"Teknik Danışmanlık Hizmet Bedeli\",\"3D CAD Modelleme\",\"Emanet İadesi\",\"Yazılım ve Tasarım Desteği\",\"Proje Çizim Bedeli\"]'"],
        ["honeypotEnabled", "BOOLEAN DEFAULT 1"],
        ["honeypotMode", "TEXT DEFAULT 'MAINTENANCE'"],
        ["honeypotMessage", "TEXT DEFAULT 'Sistem Bakımı: Bankacılık API entegrasyonumuzda altyapı çalışması yapılmaktadır.'"],
      ];

      for (const [col, def] of storeSettingCols) {
        if (!colNames.has(col)) {
          await prisma.$executeRawUnsafe(`ALTER TABLE StoreSetting ADD COLUMN ${col} ${def}`);
        }
      }

      const prodCols: any[] = await prisma.$queryRawUnsafe("PRAGMA table_info(Product)");
      const prodColNames = new Set(prodCols.map((c: any) => c.name));
      const productCols: [string, string][] = [
        ["costPrice", "REAL"],
        ["videoUrl", "TEXT"],
        ["weight", "REAL"],
        ["dimensions", "TEXT"],
        ["compatibleModels", "TEXT DEFAULT '[]'"],
      ];
      for (const [col, def] of productCols) {
        if (!prodColNames.has(col)) {
          await prisma.$executeRawUnsafe(`ALTER TABLE Product ADD COLUMN ${col} ${def}`);
        }
      }

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS IbanAccount (
          id TEXT PRIMARY KEY,
          bankName TEXT NOT NULL,
          accountHolder TEXT NOT NULL,
          iban TEXT NOT NULL UNIQUE,
          dailyLimit REAL DEFAULT 75000.0,
          currentDailyTotal REAL DEFAULT 0.0,
          dailyOrderLimit INTEGER DEFAULT 15,
          currentOrderCount INTEGER DEFAULT 0,
          isActive BOOLEAN DEFAULT 1,
          priorityOrder INTEGER DEFAULT 0,
          notes TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS ModuleConfig (
          id TEXT PRIMARY KEY,
          key TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          isEnabled BOOLEAN DEFAULT 1,
          description TEXT NOT NULL,
          settingsJson TEXT DEFAULT '{}',
          orderIndex INTEGER DEFAULT 0,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS B2BQuote (
          id TEXT PRIMARY KEY,
          companyName TEXT NOT NULL,
          contactName TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT NOT NULL,
          vehicleCount INTEGER DEFAULT 1,
          targetBudget REAL,
          notes TEXT NOT NULL,
          status TEXT DEFAULT 'PENDING',
          adminReplyNote TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS TradeIn (
          id TEXT PRIMARY KEY,
          customerName TEXT NOT NULL,
          phone TEXT NOT NULL,
          currentChassis TEXT NOT NULL,
          condition TEXT NOT NULL,
          expectedPrice REAL,
          desiredProduct TEXT,
          photoUrlsJson TEXT DEFAULT '[]',
          adminOfferPrice REAL,
          status TEXT DEFAULT 'PENDING',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS Print3d (
          id TEXT PRIMARY KEY,
          customerName TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT NOT NULL,
          projectTitle TEXT NOT NULL,
          fileUrl TEXT,
          scale TEXT DEFAULT '1/10',
          material TEXT DEFAULT 'PETG',
          color TEXT DEFAULT 'Siyah',
          notes TEXT,
          adminPrice REAL,
          status TEXT DEFAULT 'PENDING',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS TrailSpot (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          city TEXT NOT NULL,
          difficulty TEXT DEFAULT 'ORTA',
          terrain TEXT DEFAULT 'KAYA',
          description TEXT NOT NULL,
          coordinates TEXT,
          coverImage TEXT,
          isApproved BOOLEAN DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS RigShowcase (
          id TEXT PRIMARY KEY,
          authorName TEXT NOT NULL,
          city TEXT NOT NULL,
          vehicleModel TEXT NOT NULL,
          specsJson TEXT DEFAULT '{}',
          photoUrl TEXT NOT NULL,
          votesCount INTEGER DEFAULT 0,
          isWinner BOOLEAN DEFAULT 0,
          isApproved BOOLEAN DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS CertifiedChassis (
          id TEXT PRIMARY KEY,
          serialNumber TEXT NOT NULL UNIQUE,
          ownerName TEXT NOT NULL,
          buildDate TEXT NOT NULL,
          builderSignature TEXT DEFAULT 'CIHANPOL MASTER BUILDER',
          specsJson TEXT DEFAULT '{}',
          isVerified BOOLEAN DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS BuildLog (
          id TEXT PRIMARY KEY,
          orderNumber TEXT NOT NULL,
          stageTitle TEXT NOT NULL,
          description TEXT NOT NULL,
          photoUrl TEXT,
          date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 15 Modülü otomatik tohumla (Eğer boşsa)
      const moduleCount = await prisma.moduleConfig.count();
      if (moduleCount === 0) {
        const defaultModules = [
          { key: "cog_simulator", name: "Ağırlık Merkezi (CoG) & Tırmanış Simülatörü", category: "TEKNIK", isEnabled: true, description: "Aks ağırlık dağılımı ve tırmanma açısı fizik motoru.", orderIndex: 1 },
          { key: "gear_calculator", name: "Dişli Oranı & Crawl Ratio Hesaplayıcı", category: "TEKNIK", isEnabled: true, description: "Pinyon, spur ve şanzıman Crawl Ratio hesaplayıcı.", orderIndex: 2 },
          { key: "exploded_cad", name: "Patlatılmış CAD Şema & Parça Bulucu", category: "TEKNIK", isEnabled: true, description: "İnteraktif şema üzerinden araca uyumlu yedek parça tespiti.", orderIndex: 3 },
          { key: "battery_wizard", name: "LiPo Batarya & Sürüş Süresi Sihirbazı", category: "TEKNIK", isEnabled: true, description: "Motor kv, pil mah ve voltaja göre tahmini parkur süresi.", orderIndex: 4 },
          { key: "b2b_quotes", name: "B2B & Kulüp Toplu Teklif Masası", category: "TICARI", isEnabled: true, description: "RC kulüpleri ve etkinlikler için toplu alım teklif formu.", orderIndex: 5 },
          { key: "trade_in", name: "Eski Şasini Getir / Takas Değerleme", category: "TICARI", isEnabled: true, description: "Eski şasiyi takasa verip yeni modelde indirim talep etme masası.", orderIndex: 6 },
          { key: "bundle_deals", name: "Atölye Montaj Paketleri (Bundle Deals)", category: "TICARI", isEnabled: true, description: "Şasi + Pirinç + Motor kombolarında sepet indirimi.", orderIndex: 7 },
          { key: "serial_plaque", name: "Tescilli Şasi Seri Numarası Sistemi", category: "TICARI", isEnabled: true, description: "Özel montaj araçlar için benzersiz şasi kimlik plakası.", orderIndex: 8 },
          { key: "build_log", name: "Canlı Atölye Montaj Günlüğü", category: "ATOLYE", isEnabled: true, description: "Sipariş toplanırken usta fotoğrafları ve montaj notları günlüğü.", orderIndex: 9 },
          { key: "whatsapp_bot", name: "WhatsApp Hızlı Danışman & Sipariş Hattı", category: "ATOLYE", isEnabled: true, description: "Teknik usta desteği ve doğrudan WhatsApp sipariş butonu.", orderIndex: 10 },
          { key: "maintenance_packs", name: "Periyodik Bakım & Gresleme Paketleri", category: "ATOLYE", isEnabled: true, description: "Kaya tırmanışı sonrası aks, şanzıman ve su yalıtım bakım paketleri.", orderIndex: 11 },
          { key: "print3d_demand", name: "3D Baskı Özel Parça İmalat Masası", category: "ATOLYE", isEnabled: true, description: "STL dosyasıyla karbon fiber/PETG baskı talep etme masası.", orderIndex: 12 },
          { key: "trail_map", name: "Türkiye RC Crawler Parkur Haritası", category: "TOPLULUK", isEnabled: true, description: "Şehir şehir crawler tırmanış rotaları ve koordinatlar.", orderIndex: 13 },
          { key: "rig_of_month", name: "Ayın Kaya Canavarı & Topluluk Oylaması", category: "TOPLULUK", isEnabled: true, description: "Kullanıcıların araç fotoğraflarını yükleyip oylamaya katıldığı galeri.", orderIndex: 14 },
          { key: "ai_crawler_doctor", name: "AI Usta: Telemetri & Arıza Teşhis", category: "TOPLULUK", isEnabled: true, description: "ESC ısınması ve mekanik arızalara yapay zeka çözümleri.", orderIndex: 15 },
        ];
        for (const mod of defaultModules) {
          try {
            await prisma.moduleConfig.create({
              data: mod,
            });
          } catch {}
        }
      }
    } catch (migErr) {
      console.error("Auto-migration column check error:", migErr);
    }

    // 1. Mağaza Ayarları Kontrolü
    const settings = await prisma.storeSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      await prisma.storeSetting.create({
        data: {
          id: "default",
          storeName: "CIHANPOL RC CRAWLER LAB",
          storeTagline: "Özel Yapım Kaya Tırmanıcılar & CNC Performans Parçaları",
          storeMode: "CATALOG_ONLY", // Başlangıçta vitrin modu
          currency: "TL",
          currencySymbol: "₺",
          taxRate: 20,
          pricesIncludeTax: true,
          freeShippingThreshold: 2500,
          defaultShippingFee: 95,
          bankTransferEnabled: true,
          bankAccountsJson: JSON.stringify([
            {
              bankName: "Garanti BBVA",
              accountHolder: "CIHANPOL RC MODELCİLİK A.Ş.",
              iban: "TR12 0006 2000 0001 2345 6789 01",
            },
            {
              bankName: "Türkiye İş Bankası",
              accountHolder: "CIHANPOL RC MODELCİLİK A.Ş.",
              iban: "TR34 0006 4000 0002 3456 7890 12",
            },
          ]),
          whatsappOrderEnabled: true,
          whatsappPhone: "+905551234567",
          whatsappMessageTemplate:
            "Merhaba, CIHANPOL RC CRAWLER LAB mağazanızdan aşağıdaki siparişi vermek istiyorum:\n\n{items}\n\nToplam Tutar: {total}\nAlıcı: {customerName}\nTeslimat Adresi: {address}",
          creditCardEnabled: true,
          creditCardProvider: "paytr",
          ccApiKey: "",
          ccSecretKey: "",
          ccMerchantId: "",
          ccTestMode: true,
        },
      });
    } else if (settings.storeName.includes("ATELIER")) {
      // Eğer eski moda mağazası adı kalmışsa RC Crawler Lab'e güncelle
      await prisma.storeSetting.update({
        where: { id: "default" },
        data: {
          storeName: "CIHANPOL RC CRAWLER LAB",
          storeTagline: "Özel Yapım Kaya Tırmanıcılar & CNC Performans Parçaları",
        },
      });
    }

    // 2. Yönetici Hesabı
    const adminCount = await prisma.adminUser.count();
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash("admin123456", 10);
      await prisma.adminUser.create({
        data: {
          username: "admin",
          name: "RC Lab Yöneticisi",
          passwordHash,
        },
      });
    }

    // 3. RC Crawler Kategorileri ve Ürünleri
    // Eğer veritabanında eski giyim ürünleri varsa temizleyip RC Crawler ürünlerini yükle
    const hasOldClothing = await prisma.category.findFirst({
      where: { slug: "dis-giyim" },
    });

    if (hasOldClothing) {
      await prisma.orderItem.deleteMany({});
      await prisma.order.deleteMany({});
      await prisma.productVariant.deleteMany({});
      await prisma.productReview.deleteMany({});
      await prisma.product.deleteMany({});
      await prisma.category.deleteMany({});
    }

    const catCount = await prisma.category.count();
    if (catCount === 0) {
      const catVehicles = await prisma.category.create({
        data: {
          name: "RC Crawler Araçlar (RTR & Kit)",
          slug: "rc-crawler-araclar",
          description: "1/10 ve 1/24 ölçekli profesyonel tırmanma şasileri, portal akslı özel yapım kaya canavarları.",
          order: 1,
        },
      });

      const catBrass = await prisma.category.create({
        data: {
          name: "Ağır Pirinç (Brass) & Metal Yürüyen Aksam",
          slug: "pirinc-ve-metal-aksam",
          description: "Ağırlık merkezini (CoG) aşağı çeken CNC işlenmiş ağır pirinç portal kapakları, C-Hub ve link setleri.",
          order: 2,
        },
      });

      const catElectronics = await prisma.category.create({
        data: {
          name: "Fırçasız Motor & Yüksek Tork Servo",
          slug: "elektronik-motor-servo",
          description: "Kaya tırmanışına özel sensörlü fırçasız (brushless) motorlar, 50kg+ çelik dişli su geçirmez servolar.",
          order: 3,
        },
      });

      const catWheels = await prisma.category.create({
        data: {
          name: "CNC Beadlock Jant & Kaya Lastikleri",
          slug: "jant-ve-lastik",
          description: "1.9\" ve 2.2\" vidalı alüminyum beadlock jantlar ve ekstra yumuşak yapışkan hamurlu tırmanma lastikleri.",
          order: 4,
        },
      });

      const catAccessories = await prisma.category.create({
        data: {
          name: "Ölçekli Kurtarma & Vinç Aksesuarları",
          slug: "scale-aksesuar-vinc",
          description: "Kablosuz kumandalı çelik halatlı vinçler, LED ışık barları, metal kum paletleri ve scale ekipmanlar.",
          order: 5,
        },
      });

      // 4. Profesyonel RC Crawler Ürünleri
      // Ürün 1: Özel Yapım 1/10 Portal Akslı Kaya Tırmanıcı (Varyantlı)
      const p1 = await prisma.product.create({
        data: {
          title: "Apex Predator 1/10 Pro Scale Rock Crawler (Custom RTR)",
          slug: "apex-predator-1-10-pro-scale-crawler",
          description:
            "Zorlu kaya parkurları ve dikey tırmanışlar için sıfırdan el işçiliğiyle toplanmış özel yarışma sınıfı 1/10 Rock Crawler.\n\n" +
            "Öne Çıkan Mühendislik Detayları:\n" +
            "• Ağır hizmet portal akslar ile ekstra yüksek zemin mesafesi ve minimum tork bükülmesi (torque twist).\n" +
            "• Tam metal dişlili 2 vitesli şanzıman ve bağımsız uzaktan kilitlenebilir ön/arka diferansiyeller (T-Lock).\n" +
            "• Alüminyum CNC yağlı amortisörler (Threaded Body Shock) ve yüksek artikülasyonlu 4-Link paslanmaz çelik askı sistemi.\n" +
            "• 45kg torklu fırçasız çelik dişli su geçirmez yön servosu ve Hobbywing Fusion Pro sensörlü motor/ESC entegrasyonu.\n" +
            "• Ağırlaştırılmış pirinç ön tekerlek ağırlıklarıyla optimize edilmiş %60 ön / %40 arka ağırlık dengesi.",
          shortDescription: "1/10 Ölçek, Portal Aks, Sensörlü Fırçasız Motor, Çift Kilitli Diferansiyel",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
          ]),
          type: "VARIABLE",
          basePrice: 34500,
          salePrice: null,
          sku: "CP-CRW-APEX10",
          stockQuantity: 6,
          isFeatured: true,
          attributesJson: JSON.stringify([
            { name: "Gövde Rengi", options: ["Mat Taktik Haki", "Kaya Grisi", "Alev Turuncusu"] },
            { name: "Aks Tipi", options: ["Ağır Pirinç Portal Aks", "Hafifletilmiş CNC Alüminyum"] },
          ]),
          categoryId: catVehicles.id,
        },
      });

      await prisma.productVariant.createMany({
        data: [
          {
            productId: p1.id,
            name: "Mat Taktik Haki / Ağır Pirinç Portal Aks",
            sku: "CP-CRW-HK-BRS",
            price: 36800,
            stock: 2,
            attributes: JSON.stringify({ "Gövde Rengi": "Mat Taktik Haki", "Aks Tipi": "Ağır Pirinç Portal Aks" }),
          },
          {
            productId: p1.id,
            name: "Kaya Grisi / Ağır Pirinç Portal Aks",
            sku: "CP-CRW-GRY-BRS",
            price: 36800,
            stock: 2,
            attributes: JSON.stringify({ "Gövde Rengi": "Kaya Grisi", "Aks Tipi": "Ağır Pirinç Portal Aks" }),
          },
          {
            productId: p1.id,
            name: "Alev Turuncusu / Hafifletilmiş CNC Alüminyum",
            sku: "CP-CRW-ORN-ALU",
            price: 34500,
            stock: 2,
            attributes: JSON.stringify({ "Gövde Rengi": "Alev Turuncusu", "Aks Tipi": "Hafifletilmiş CNC Alüminyum" }),
          },
        ],
      });

      // Ürün 2: Ağır Pirinç Portal Aks Kapakları Seti (Ön + Arka)
      await prisma.product.create({
        data: {
          title: "CNC Ağır Pirinç (Brass) Portal Aks Ağırlık Kiti (TRX-4 / SCX10 Uyumlu)",
          slug: "cnc-agir-pirinc-portal-aks-agirlik-kiti",
          description:
            "Kaya tırmanışında devrilmeyi önlemek için tekerlek merkezine toplam +420 gram ekstra ağırlık ekleyen saf pirinç portal aks kiti.\n\n" +
            "Paket İçeriği:\n" +
            "• 2x Ön Ağır Portal Dış Kapağı (Her biri 110g)\n" +
            "• 2x Arka Portal Dış Kapağı (Her biri 100g)\n" +
            "• Yüksek hassasiyetli paslanmaz çelik montaj vidaları ve rulman yuvaları.\n" +
            "• Ağırlık merkezini doğrudan zemin seviyesine indirerek %60 eğimlerde bile takla atma riskini ortadan kaldırır.",
          shortDescription: "+420g Saf Ağır Pirinç, Alt Ağırlık Merkezi (CoG) Optimizasyonu",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80",
          ]),
          type: "SIMPLE",
          basePrice: 3850,
          salePrice: null,
          sku: "CP-BRS-420G",
          stockQuantity: 18,
          isFeatured: true,
          categoryId: catBrass.id,
        },
      });

      // Ürün 3: Sensörlü Fırçasız Crawler Motor & ESC Kombo
      await prisma.product.create({
        data: {
          title: "TorqueMaster 2300Kv FOC Sensörlü Fırçasız Crawler Motor & Akıllı ESC",
          slug: "torquemaster-2300kv-sensorlu-fircasiz-crawler-motor-esc",
          description:
            "Düşük hızlarda milimetrik gaz tepkisi, dik yokuşlarda sıfır geri kayma (Field-Oriented Control Akıllı Yokuş Freni) sağlayan en üst seviye crawler güç ünitesi.\n\n" +
            "Teknik Özellikler:\n" +
            "• 2300Kv sensörlü fırçasız motor tasarımı\n" +
            "• 2S-4S LiPo pil desteği\n" +
            "• Akıllı tork kontrol algoritması (kaya üzerinde asla teklemez, gaz koluna paralel güç üretir)\n" +
            "• IP67 tam su ve çamur geçirmez sızdırmazlık.",
          shortDescription: "FOC Sensörlü Kontrol, Yokuşta Asılı Kalma (Drag Brake), 2S-4S LiPo",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80",
          ]),
          type: "SIMPLE",
          basePrice: 7900,
          salePrice: null,
          sku: "CP-ELE-2300KV",
          stockQuantity: 8,
          isFeatured: true,
          categoryId: catElectronics.id,
        },
      });

      // Ürün 4: 1.9 Alüminyum Beadlock Jant ve Süper Yapışkan Kaya Lastiği Seti
      await prisma.product.create({
        data: {
          title: "RockClaw 1.9\" CNC Alüminyum Beadlock Jant & Süper Yumuşak Kaya Lastiği (4'lü Set)",
          slug: "rockclaw-1-9-cnc-beadlock-jant-lastik-seti",
          description:
            "Yapıştırma gerektirmeyen gerçek vidalı beadlock montajlı, iç ağırlık halkalı CNC kütük alüminyum jant ve ultra yumuşak 'Predator Sticky' kauçuk hamurlu 120mm derin dişli kaya lastiği takımı.\n\n" +
            "Özellikler:\n" +
            "• 1.9 inç çap, 12mm hex göbek uyumu\n" +
            "• Çift kademeli (Dual-Stage) sünger köpük içi ile mükemmel yan duvar desteği\n" +
            "• Islak kayada ve gevşek toprakta maksimum tutunma geometrisi.",
          shortDescription: "4 Adet Komple Set, Vidalı Beadlock, Dual-Stage Sünger, 120mm Çap",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
          ]),
          type: "SIMPLE",
          basePrice: 4600,
          salePrice: null,
          sku: "CP-WHL-19BEAD",
          stockQuantity: 12,
          isFeatured: true,
          categoryId: catWheels.id,
        },
      });

      // Ürün 5: Kablosuz Kumandalı Çift Motorlu Çelik Halatlı Ölçekli Vinç
      await prisma.product.create({
        data: {
          title: "Warn Scale 1/10 Kablosuz Uzaktan Kumandalı Çift Motorlu Ağır Hizmet Vinci",
          slug: "warn-scale-1-10-kablosuz-kumandali-cift-motorlu-vinc",
          description:
            "Araç bataryasından doğrudan beslenen, 8kg çekme kapasiteli çift motorlu ve 1.5 metre paslanmaz çelik halatlı gerçekçi ölçekli kurtarma vinci.\n\n" +
            "Özellikler:\n" +
            "• Bağımsız 2.4GHz mikro uzaktan kumanda ünitesi dahildir\n" +
            "• Döküm çinko gövde ve kırmızı dövme kanca\n" +
            "• Çamur ve suya dayanıklı gövde mimarisi.",
          shortDescription: "8kg Çekme Kapasitesi, Kablosuz Kumanda, Çift Motor, Çelik Halat",
          images: JSON.stringify([
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
          ]),
          type: "SIMPLE",
          basePrice: 2850,
          salePrice: null,
          sku: "CP-ACC-WNC01",
          stockQuantity: 15,
          isFeatured: false,
          categoryId: catAccessories.id,
        },
      });

      // 5. Test VIP Token'ı (RC Kulüp Üyelerine Özel)
      await prisma.inviteToken.create({
        data: {
          token: "vip-crawler-2026",
          status: "ACTIVE",
          note: "Crawler Kulübü Özel VIP Davetiyesi (%15 Parça İndirimi)",
          discountPercent: 15,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
      });

      // 6. Örnek RC Kuponu
      await prisma.coupon.create({
        data: {
          code: "CRAWLER10",
          type: "PERCENTAGE",
          amount: 10,
          minSpend: 2500,
          usageLimit: 100,
          isActive: true,
        },
      });
    }
  } catch (err) {
    console.error("Initialization error:", err);
  }
}
