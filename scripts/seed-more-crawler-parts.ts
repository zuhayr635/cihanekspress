import prisma from "../src/lib/prisma";

async function seedMoreParts() {
  console.log("RC Crawler Parça Kataloğu Genişletiliyor...");

  const catVehicles = await prisma.category.findUnique({ where: { slug: "rc-crawler-araclar" } });
  const catBrass = await prisma.category.findUnique({ where: { slug: "pirinc-ve-metal-aksam" } });
  const catElectronics = await prisma.category.findUnique({ where: { slug: "elektronik-motor-servo" } });
  const catWheels = await prisma.category.findUnique({ where: { slug: "jant-ve-lastik" } });
  const catAccessories = await prisma.category.findUnique({ where: { slug: "scale-aksesuar-vinc" } });

  const newProducts = [
    {
      title: "Axial SCX24 Deadbolt 1/24 Mini Rock Crawler 4WD RTR",
      slug: "axial-scx24-deadbolt-1-24-mini-crawler",
      description:
        "Masaüstünüzde, kitapların ve taşların üzerinde gerçek kaya tırmanış keyfi sunan 1/24 ölçekli kompakt efsane.\n\n" +
        "• Dayanıklı C-Kanal çelik şasi rayları\n" +
        "• 3-Link ön ve 4-Link arka süspansiyon geometrisi\n" +
        "• Gerçek zamanlı tam zamanlı 4 çeker ve kilitli diferansiyeller\n" +
        "• Kumanda, LiPo batarya ve USB şarj aleti kutuya dahildir (Kullanıma Hazır RTR).",
      shortDescription: "1/24 Mini Ölçek, 4WD, Dayanıklı Çelik Şasi, Kompakt Masaüstü Kaya Canavarı",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80"
      ]),
      type: "SIMPLE",
      basePrice: 6900,
      sku: "AXI-SCX24-DB",
      stockQuantity: 10,
      isFeatured: true,
      categoryId: catVehicles?.id,
    },
    {
      title: "Traxxas TRX-4 Land Rover Defender 1/10 Scale & Trail Crawler RTR",
      slug: "traxxas-trx4-defender-1-10-crawler-rtr",
      description:
        "Dünyanın en popüler ölçekli tırmanıcısı TRX-4 Defender platformu.\n\n" +
        "• Orijinal Portal Aks sistemi ile tekerlek göbeğinden ekstra zemin yüksekliği\n" +
        "• Kumandadan bağımsız kilitlenebilir ön ve arka T-Lock diferansiyeller\n" +
        "• Yüksek ve düşük hızlı 2 kademeli uzaktan kumandalı şanzıman\n" +
        "• XL-5 HV su geçirmez ESC ve Titan 21T tork motoru.",
      shortDescription: "1/10 Ölçek, Portal Akslar, 2 Vites, Kumandadan Kilitlenebilir T-Lock Diferansiyel",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1200&q=80"
      ]),
      type: "SIMPLE",
      basePrice: 32900,
      sku: "TRX-82056-4",
      stockQuantity: 5,
      isFeatured: true,
      categoryId: catVehicles?.id,
    },
    {
      title: "55KG Titanyum Dişli 8.4V Yüksek Voltaj Fırçasız Dijital Yön Servosu",
      slug: "55kg-titanyum-disli-fircasiz-dijital-yon-servosu",
      description:
        "Kaya arasında sıkışan geniş tırmanma lastiklerini tereddütsüz döndüren 55kg-cm ultra tork yön servosu.\n\n" +
        "• Tam CNC alüminyum soğutmalı kasa ve IP68 tam su/çamur geçirmez sızdırmazlık\n" +
        "• Aşınmaya karşı dirençli sertleştirilmiş titanyum ve çelik dişli grubu\n" +
        "• 6.0V - 8.4V doğrudan 2S LiPo besleme uyumu (BEC gerektirmez)\n" +
        "• 25T standart alüminyum servo kolu pakete dahildir.",
      shortDescription: "55kg-cm Devasa Tork, IP68 Su Geçirmez, Çelik & Titanyum Dişliler, 8.4V HV",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80"
      ]),
      type: "SIMPLE",
      basePrice: 2750,
      sku: "CP-SRV-55KG",
      stockQuantity: 20,
      isFeatured: true,
      categoryId: catElectronics?.id,
    },
    {
      title: "CNC Yüksek Açılı (High-Clearance) 4-Link Paslanmaz Çelik Askı Kolları Kiti (324mm)",
      slug: "cnc-yuksek-angilli-high-clearance-4-link-askı-kiti",
      description:
        "Kayalıklara tırmanırken alt şasi bağlantı kollarının sivri kayalara takılıp aracı askıda bırakmasını önleyen kavisli tasarım.\n\n" +
        "• Ağır hizmet 304 paslanmaz çelikten üretilmiştir (paslanmaz ve eğilmez)\n" +
        "• Ağır metal yapısıyla araç ağırlık merkezini daha da zemine çeker\n" +
        "• TRX-4 Defender, Tactical ve 324mm dingil mesafeli tüm şasiler ile birebir uyumludur.",
      shortDescription: "Kayalara Takılmayı Önleyen Özel Kavisli Tasarım, 304 Paslanmaz Çelik, 324mm",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80"
      ]),
      type: "SIMPLE",
      basePrice: 2450,
      sku: "CP-LNK-HC324",
      stockQuantity: 14,
      isFeatured: false,
      categoryId: catBrass?.id,
    },
    {
      title: "Portal Aks Overdrive Ön Hızlı Dişli Seti (%15 - TRX-4 / SCX10 Uyumlu)",
      slug: "portal-aks-overdrive-on-hizli-disli-seti",
      description:
        "Ön aksın arka aksa göre %15 daha hızlı dönmesini sağlayan yarışma sınıfı Overdrive dişli seti.\n\n" +
        "• Kaya tırmanışlarında ön tekerleklerin aracı yukarı çekmesini sağlayarak devrilmeyi önler\n" +
        "• Dönüş yarıçapını belirgin şekilde daraltır, dar kaya geçitlerinde çeviklik katar\n" +
        "• CNC sertleştirilmiş karbon çelik alaşım.",
      shortDescription: "Ön Aksı %15 Daha Hızlı Döndürerek Dik Kayada Tutunma ve Dar Dönüş Yarıçapı Sağlar",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
      ]),
      type: "SIMPLE",
      basePrice: 1850,
      sku: "CP-GEAR-OD15",
      stockQuantity: 16,
      isFeatured: false,
      categoryId: catBrass?.id,
    },
    {
      title: "Ağır Hizmet Sertleştirilmiş Çelik Teleskopik Ön/Arka Şaft Seti",
      slug: "agir-hizmet-sertlestirilmis-celik-teleskopik-saft-seti",
      description:
        "Yüksek torklu fırçasız motorların ve ağır tekerlek ağırlıklarının yarattığı burulma kuvvetine karşı eğilmeyen şaft kiti.\n\n" +
        "• Üniversal CVD mafsallı ve yivli (splined) teleskopik uzama geometrisi\n" +
        "• 100mm - 145mm çalışma mesafesi, 5mm şanzıman/aks pimi uyumu\n" +
        "• Isıl işlem görmüş endüstriyel siyah kaplamalı çelik.",
      shortDescription: "Yüksek Tork Altında Kırılmayan Isıl İşlemli Çelik CVD Şaft Takımı (100-145mm)",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80"
      ]),
      type: "SIMPLE",
      basePrice: 2150,
      sku: "CP-SHT-CVD10",
      stockQuantity: 18,
      isFeatured: false,
      categoryId: catBrass?.id,
    }
  ];

  for (const item of newProducts) {
    const exists = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (!exists) {
      await prisma.product.create({ data: item });
      console.log(`+ Eklendi: ${item.title}`);
    } else {
      console.log(`Zaten mevcut: ${item.title}`);
    }
  }

  const total = await prisma.product.count();
  console.log(`\nToplam Güncel Ürün Sayısı: ${total}`);
}

seedMoreParts()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
