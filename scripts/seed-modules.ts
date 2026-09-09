import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MODULES_DATA = [
  {
    key: "cog_simulator",
    name: "CoG Ağırlık Merkezi & Eğim Simülatörü",
    category: "TEKNIK",
    isEnabled: true,
    description: "Ön/arka ağırlık dağılımı, CoG yüksekliği ve 70° eğim devrilme açısı interaktif hesaplayıcısı.",
    orderIndex: 1,
    settingsJson: JSON.stringify({ defaultTippingAngle: 68, defaultFrontBias: 60 }),
  },
  {
    key: "gear_calculator",
    name: "FDR Dişli Oranı & Sürat Hesaplayıcı",
    category: "TEKNIK",
    isEnabled: true,
    description: "Pinyon, spur, şanzıman oranı, motor Kv ve portal overdrive ile crawlability ve hız analizi.",
    orderIndex: 2,
    settingsJson: JSON.stringify({ defaultPinion: 11, defaultSpur: 45, defaultTransmissionRatio: 2.6 }),
  },
  {
    key: "exploded_cad",
    name: "3D İnteraktif Şasi Patlatılmış CAD Şeması",
    category: "TEKNIK",
    isEnabled: true,
    description: "Tıklanabilir aks, şanzıman, süspansiyon ve elektronik montaj noktaları ile parça keşfi.",
    orderIndex: 3,
    settingsJson: JSON.stringify({ cadModel: "TRX-4 / SCX10 PRO CHASSIS" }),
  },
  {
    key: "battery_wizard",
    name: "Pil & ESC Akım Uyumluluk Sihirbazı",
    category: "TEKNIK",
    isEnabled: true,
    description: "Motor akım çekimine ve sürüş stiline göre en ideal 2S/3S/4S LiPo pil ve deşarj C oranı eşleştirme.",
    orderIndex: 4,
    settingsJson: JSON.stringify({ minVoltage: 7.4, maxVoltage: 14.8 }),
  },
  {
    key: "b2b_quotes",
    name: "Toplu B2B & Kulüp Teklif Masası",
    category: "TICARI",
    isEnabled: true,
    description: "Model kulüpleri, yarışma takımları ve toptan alıcılar için özel iskonto ve teklif formu.",
    orderIndex: 5,
    settingsJson: JSON.stringify({ minTeamSize: 3, defaultDiscountTier: 15 }),
  },
  {
    key: "trade_in",
    name: "Eski Şasini Getir, Yenisini Al (Takas)",
    category: "TICARI",
    isEnabled: true,
    description: "Eski crawler şasilerini atölye ekspertizine gönderip yeni araç alımında indirim kuponu kazanma.",
    orderIndex: 6,
    settingsJson: JSON.stringify({ maxDiscountRate: 40 }),
  },
  {
    key: "bundle_deals",
    name: "Özel Paket (Bundle) İndirim Motoru",
    category: "TICARI",
    isEnabled: true,
    description: "Şasi + Fırçasız Motor + Pirinç Aks Kiti gibi çoklu alımlarda anında %15 sepet indirimi.",
    orderIndex: 7,
    settingsJson: JSON.stringify({ defaultDiscountPercent: 15 }),
  },
  {
    key: "serial_plaque",
    name: "Sınırlı Üretim Plaka & Tescil Sistemi",
    category: "TICARI",
    isEnabled: true,
    description: "Özel toplanan RTR araçlar için şasi seri numarası doğrulama, tescil belgesi ve usta imzası.",
    orderIndex: 8,
    settingsJson: JSON.stringify({ totalProduced: 100, prefix: "CHP-CRAWLER" }),
  },
  {
    key: "build_log",
    name: "Canlı Atölye Montaj Günlüğü (Build Log)",
    category: "ATOLYE",
    isEnabled: true,
    description: "Sipariş takibinde müşteriye özel montaj aşaması fotoğrafları ve usta notları akışı.",
    orderIndex: 9,
    settingsJson: JSON.stringify({ enableCustomerUpload: true }),
  },
  {
    key: "whatsapp_bot",
    name: "WhatsApp Otomatik Sipariş Bildirimleri",
    category: "ATOLYE",
    isEnabled: true,
    description: "Sipariş onayında, montaj başlangıcında ve kargo çıkışında tek tıkla WhatsApp bildirim şablonları.",
    orderIndex: 10,
    settingsJson: JSON.stringify({ autoRedirect: true }),
  },
  {
    key: "maintenance_packs",
    name: "Periyodik Sezonluk Bakım Paketleri",
    category: "ATOLYE",
    isEnabled: true,
    description: "Rulman değişimi, su geçirmezlik yenileme ve amortisör silikon yağı bakım servisleri.",
    orderIndex: 11,
    settingsJson: JSON.stringify({ packageCount: 3 }),
  },
  {
    key: "print3d_demand",
    name: "3D Baskı İsteğe Bağlı Parça Üretimi",
    category: "ATOLYE",
    isEnabled: true,
    description: "STL dosya yükleme veya atölye hazır scale aksesuar kataloğundan PETG/Karbon fiber 3D baskı siparişi.",
    orderIndex: 12,
    settingsJson: JSON.stringify({ allowedMaterials: ["PETG", "Karbon Fiber", "TPU", "Reçine"] }),
  },
  {
    key: "trail_map",
    name: "Türkiye RC Crawler Parkur & Rota Haritası",
    category: "TOPLULUK",
    isEnabled: true,
    description: "Aydos, Riva, Polonezköy, Kapadokya gibi popüler kaya tırmanış rotaları, zorluk dereceleri ve koordinatları.",
    orderIndex: 13,
    settingsJson: JSON.stringify({ showCoordinates: true }),
  },
  {
    key: "rig_of_month",
    name: "Ayın Kaya Canavarı Galerisi & Oylaması",
    category: "TOPLULUK",
    isEnabled: true,
    description: "Kullanıcıların araç fotoğraflarını yükleyip oylattığı vitrin; her ay 1. seçilene kupon ödülü.",
    orderIndex: 14,
    settingsJson: JSON.stringify({ monthlyPrize: "1500 ₺ Hediye Kuponu" }),
  },
  {
    key: "ai_crawler_doctor",
    name: "Yapay Zeka Destekli RC Arıza Teşhis Asistanı",
    category: "TOPLULUK",
    isEnabled: true,
    description: "Takla atma, tork bükülmesi, servo ısınması ve diferansiyel kilit problemlerine anlık akıllı çözüm botu.",
    orderIndex: 15,
    settingsJson: JSON.stringify({ assistantName: "Crawler Doctor AI" }),
  },
];

const SAMPLE_TRAILS = [
  {
    name: "Aydos Ormanı Kaya Parkuru",
    city: "İstanbul / Kartal",
    difficulty: "ZOR",
    terrain: "KAYA",
    description: "Doğal granit kayalıklar, %60 dik yokuşlar ve dar kaya yarıkları. High-clearance linkler ve aşırı ağır pirinç portal aks gerektirir.",
    coordinates: "40.9412, 29.2481",
    coverImage: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1000&q=80",
    isApproved: true,
  },
  {
    name: "Riva Kayalıkları & Sahil Tırmanışı",
    city: "İstanbul / Beykoz",
    difficulty: "ORTA",
    terrain: "KAYA",
    description: "Islak zemin tutunma testleri ve tuzlu su sıçramalarına dayanıklılık. IP67 su geçirmez elektronik ve yumuşak beadlock lastikler önerilir.",
    coordinates: "41.2241, 29.2201",
    coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
    isApproved: true,
  },
  {
    name: "Kapadokya Peri Bacaları Tuff Rotaları",
    city: "Nevşehir / Göreme",
    difficulty: "ASIRI_KAYA",
    terrain: "KAYA",
    description: "Dünyanın en zorlu doğal RC crawler rotalarından biri. Dik tuff tırmanışları, tozlu zemin ve aşırı tork talebi.",
    coordinates: "38.6431, 34.8291",
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    isApproved: true,
  },
  {
    name: "Polonezköy Çamurlu Orman Parkuru",
    city: "İstanbul / Beykoz",
    difficulty: "ORTA",
    terrain: "CAMUR",
    description: "Ağaç kökleri, çamur çukurları ve derin su geçişleri. 45kg yön servosu ve beadlock jant köpük testi için ideal.",
    coordinates: "41.1167, 29.2067",
    coverImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
    isApproved: true,
  },
];

const SAMPLE_COMMUNITY_RIGS = [
  {
    authorName: "KayaUstasi34",
    city: "İstanbul",
    vehicleModel: "TRX-4 Tactical Beast (Carbon Edition)",
    specsJson: JSON.stringify({ aks: "Pirinç Portal", motor: "Fusion Pro 2300Kv", agirlik: "3450g", CoG: "%62 Ön" }),
    photoUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1000&q=80",
    votesCount: 47,
    isWinner: true,
    isApproved: true,
  },
  {
    authorName: "AnkaraCrawlerTeam",
    city: "Ankara",
    vehicleModel: "Axial SCX10 III Early Ford Bronco",
    specsJson: JSON.stringify({ aks: "CNC Alüminyum", motor: "Holmes Hobbies 540", agirlik: "3100g", CoG: "%58 Ön" }),
    photoUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
    votesCount: 32,
    isWinner: false,
    isApproved: true,
  },
];

const SAMPLE_CERTIFIED_CHASSIS = [
  {
    serialNumber: "CHP-CRAWLER-001",
    ownerName: "Bülent Bey (Özel Sipariş)",
    buildDate: "09.09.2026",
    builderSignature: "CIHANPOL MASTER BUILDER",
    specsJson: JSON.stringify({
      sasi: "Titanium Tube Chassis 1/10",
      aks: "Ağır Pirinç Portal Aks Kiti (+420g)",
      elektronik: "Hobbywing Fusion Pro 2300Kv FOC",
      lastik: "1.9 Super Swamper Dual-Stage",
    }),
    isVerified: true,
  },
  {
    serialNumber: "CHP-CRAWLER-007",
    ownerName: "Atölye Demo Aracı",
    buildDate: "01.09.2026",
    builderSignature: "CIHANPOL CHIEF ENGINEER",
    specsJson: JSON.stringify({
      sasi: "TRX-4 Long Wheelbase (324mm)",
      aks: "%15 Overdrive Ön Portal",
      elektronik: "TorqueMaster 2300Kv + 45Kg Servo",
      lastik: "CNC Beadlock Alüminyum Jant Seti",
    }),
    isVerified: true,
  },
];

async function main() {
  console.log("Seeding 15 modules...");

  for (const mod of MODULES_DATA) {
    await prisma.moduleConfig.upsert({
      where: { key: mod.key },
      update: {
        name: mod.name,
        category: mod.category,
        description: mod.description,
        orderIndex: mod.orderIndex,
        settingsJson: mod.settingsJson,
      },
      create: mod,
    });
  }
  console.log("✓ All 15 modules registered!");

  // Sample Trail spots
  for (const trail of SAMPLE_TRAILS) {
    const existing = await prisma.trailSpot.findFirst({ where: { name: trail.name } });
    if (!existing) {
      await prisma.trailSpot.create({ data: trail });
    }
  }
  console.log("✓ Trail spots seeded!");

  // Sample Community Rigs
  for (const rig of SAMPLE_COMMUNITY_RIGS) {
    const existing = await prisma.rigShowcase.findFirst({ where: { vehicleModel: rig.vehicleModel } });
    if (!existing) {
      await prisma.rigShowcase.create({ data: rig });
    }
  }
  console.log("✓ Community rigs seeded!");

  // Sample Certified Chassis
  for (const chassis of SAMPLE_CERTIFIED_CHASSIS) {
    await prisma.certifiedChassis.upsert({
      where: { serialNumber: chassis.serialNumber },
      update: {},
      create: chassis,
    });
  }
  console.log("✓ Certified chassis plaques seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
