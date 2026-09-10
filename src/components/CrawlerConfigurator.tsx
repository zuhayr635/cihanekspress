"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  Wrench,
  Compass,
  Gauge,
  Check,
  Shield,
  MessageCircle,
  ShoppingBag,
  Zap,
  Flame,
  Info,
  Layers,
} from "lucide-react";

interface RigOption {
  id: string;
  name: string;
  price: number;
  weightDelta: number; // in grams
  frontWeightRatio: number; // 0 to 1
  climbAngleBonus: number; // degrees
  description: string;
  badge?: string;
}

// 1. Şasi & Platform Seçenekleri
const CHASSIS_OPTIONS: RigOption[] = [
  {
    id: "trx4",
    name: "Traxxas TRX-4 Pro Platform (324mm)",
    price: 24500,
    weightDelta: 3100,
    frontWeightRatio: 0.52,
    climbAngleBonus: 48,
    description: "Portal aks uyumlu, 2 vitesli şanzıman ve uzaktan kilitlenebilir T-Lock diferansiyeller.",
    badge: "En Popüler",
  },
  {
    id: "scx10iii",
    name: "Axial SCX10-III Base Camp (LCG Şasi)",
    price: 21800,
    weightDelta: 2750,
    frontWeightRatio: 0.54,
    climbAngleBonus: 51,
    description: "Düşük ağırlık merkezi (LCG), tek parça hafif şanzıman ve yarışma tipi artikülasyon.",
    badge: "Hafif & Çevik",
  },
  {
    id: "vs410",
    name: "Vanquish VS4-10 Phoenix Scale Rig",
    price: 38900,
    weightDelta: 3200,
    frontWeightRatio: 0.56,
    climbAngleBonus: 56,
    description: "Ön Overdrive ve VFD Dig şanzıman özellikli elit mühendislik tırmanma şasisi.",
    badge: "Elit Yarışma",
  },
  {
    id: "scx24",
    name: "Axial SCX24 Deadbolt 1/24 Mini Platform",
    price: 6900,
    weightDelta: 240,
    frontWeightRatio: 0.53,
    climbAngleBonus: 46,
    description: "Masaüstü ve salon kayalık parkurları için ultra kompakt 4WD mikro crawler.",
    badge: "1/24 Mini",
  },
];

// 2. Aks & Pirinç Ağırlık Paketleri
const AXLE_OPTIONS: RigOption[] = [
  {
    id: "stock",
    name: "Standart Kompozit Düz Akslar",
    price: 0,
    weightDelta: 0,
    frontWeightRatio: 0.5,
    climbAngleBonus: 0,
    description: "Fabrika çıkış ağırlık dengesi. Dik tırmanışlarda arka takla riski standart seviyededir.",
  },
  {
    id: "stage1_brass",
    name: "Stage 1: Ağır Pirinç Ön Portal Kapakları (+220g)",
    price: 2400,
    weightDelta: 220,
    frontWeightRatio: 0.6,
    climbAngleBonus: 8,
    description: "Ağırlığı doğrudan ön tekerlek göbeklerine vererek ön basışı artırır, taklayı önler.",
    badge: "Tavsiye Edilen",
  },
  {
    id: "stage2_brass",
    name: "Stage 2: Tam Yarışma Ağır Pirinç Paketi (+450g)",
    price: 4950,
    weightDelta: 450,
    frontWeightRatio: 0.65,
    climbAngleBonus: 14,
    description: "Ön Knuckle, C-Hub ve Arka Portal ağırlıklarıyla %65/35 yarışma CoG dengesi sağlar.",
    badge: "Maksimum Tutunma",
  },
];

// 3. Güç Ünitesi & Motor
const MOTOR_OPTIONS: RigOption[] = [
  {
    id: "fusion_pro",
    name: "Hobbywing Fusion Pro 2300Kv FOC Fırçasız",
    price: 7900,
    weightDelta: 210,
    frontWeightRatio: 0.55,
    climbAngleBonus: 6,
    description: "Entegre ESC, FOC sensörlü kontrol, sıfır geri kaçırma ve milimetrik gaz hassasiyeti.",
    badge: "FOC Teknolojisi",
  },
  {
    id: "holmes_brushed",
    name: "Holmes Hobbies CrawlMaster 540 Fırçalı + WP 1080 ESC",
    price: 3450,
    weightDelta: 240,
    frontWeightRatio: 0.52,
    climbAngleBonus: 2,
    description: "Yumuşak düşük devir kontrolü ve ekonomik su geçirmez kaya tırmanma kiti.",
  },
  {
    id: "castle_mamba",
    name: "Castle Mamba Micro X2 & Slate 2850Kv Kombo",
    price: 8600,
    weightDelta: 190,
    frontWeightRatio: 0.54,
    climbAngleBonus: 5,
    description: "4S LiPo desteği, veri loglama ve üstün hız-tork dinamik geçişleri.",
  },
];

// 4. Jant & Lastik Hamuru
const WHEEL_OPTIONS: RigOption[] = [
  {
    id: "predator_19",
    name: "1.9\" CNC Beadlock + Predator Sticky Lastik (Dual-Stage)",
    price: 4600,
    weightDelta: 380,
    frontWeightRatio: 0.55,
    climbAngleBonus: 7,
    description: "Vidalı alüminyum beadlock ve yapışkan hamurlu 120mm tırmanma deseni.",
    badge: "En İyi Tutuş",
  },
  {
    id: "heavy_22",
    name: "2.2\" Ekstra Geniş Çamur & Kaya Canavarı Seti",
    price: 5200,
    weightDelta: 520,
    frontWeightRatio: 0.53,
    climbAngleBonus: 5,
    description: "Büyük kaya engelleri için maksimum zemin açıklığı sağlayan 135mm derin dişli lastikler.",
  },
  {
    id: "scx24_micro_wheels",
    name: "1.0\" Mini Pirinç Beadlock Seti (SCX24 Özel)",
    price: 1850,
    weightDelta: 95,
    frontWeightRatio: 0.58,
    climbAngleBonus: 6,
    description: "1/24 ölçekli araçlara tekerlek başına +24g saf pirinç ağırlık katan micro jant seti.",
  },
];

// 5. İlave Donanım & Aksesuarlar
const ACCESSORY_OPTIONS: RigOption[] = [
  {
    id: "warn_winch",
    name: "Warn Scale 1/10 Kablosuz Çift Motorlu Kurtarma Vinci",
    price: 2850,
    weightDelta: 160,
    frontWeightRatio: 0.75,
    climbAngleBonus: 3,
    description: "8kg çekme kapasitesi, uzaktan kumanda ve kırmızı dövme kanca.",
    badge: "Scale Kurtarma",
  },
  {
    id: "servo_55kg",
    name: "55KG Titanyum Dişli 8.4V Yüksek Voltaj Dijital Servo",
    price: 2750,
    weightDelta: 85,
    frontWeightRatio: 0.7,
    climbAngleBonus: 3,
    description: "Kaya arasında sıkışan tekerlekleri anında döndüren su geçirmez mega tork.",
  },
  {
    id: "none",
    name: "Aksesuar İstemiyorum (Yalın Hafif Setup)",
    price: 0,
    weightDelta: 0,
    frontWeightRatio: 0.5,
    climbAngleBonus: 0,
    description: "Maksimum hafiflik ve çevik yarışma kurulumu.",
  },
];

export default function CrawlerConfigurator() {
  const { vipSession, storeSettings, addItem } = useCart();

  const [selectedChassis, setSelectedChassis] = useState<RigOption>(CHASSIS_OPTIONS[0]);
  const [selectedAxle, setSelectedAxle] = useState<RigOption>(AXLE_OPTIONS[1]);
  const [selectedMotor, setSelectedMotor] = useState<RigOption>(MOTOR_OPTIONS[0]);
  const [selectedWheel, setSelectedWheel] = useState<RigOption>(WHEEL_OPTIONS[0]);
  const [selectedAccessory, setSelectedAccessory] = useState<RigOption>(ACCESSORY_OPTIONS[0]);

  const [copiedNotification, setCopiedNotification] = useState(false);

  // Satış İzni Kontrolü
  const isSalesAllowed =
    storeSettings?.storeMode === "PUBLIC_SALE" ||
    (storeSettings?.storeMode === "INVITE_ONLY" && vipSession.isVip) ||
    vipSession.isVip;

  // Hesaplamalar
  const baseTotal =
    selectedChassis.price +
    selectedAxle.price +
    selectedMotor.price +
    selectedWheel.price +
    selectedAccessory.price;

  const vipDiscount = 0;
  const finalTotal = baseTotal;

  // Toplam Ağırlık ve CoG Hesaplaması
  const totalWeight =
    selectedChassis.weightDelta +
    selectedAxle.weightDelta +
    selectedMotor.weightDelta +
    selectedWheel.weightDelta +
    selectedAccessory.weightDelta;

  const totalClimbAngle = Math.min(
    70,
    Math.round(
      selectedChassis.climbAngleBonus +
        selectedAxle.climbAngleBonus +
        selectedMotor.climbAngleBonus +
        selectedWheel.climbAngleBonus +
        selectedAccessory.climbAngleBonus
    )
  );

  // Ortalama Ön Ağırlık Oranı
  const frontRatio = Math.min(
    68,
    Math.max(
      50,
      Math.round(
        50 +
          (selectedAxle.frontWeightRatio - 0.5) * 45 +
          (selectedChassis.frontWeightRatio - 0.5) * 30 +
          (selectedAccessory.id !== "none" ? 3 : 0)
      )
    )
  );
  const rearRatio = 100 - frontRatio;

  // WhatsApp Mesajı Oluştur
  const buildConfigText = "CIHANPOL RC LAB - ÖZEL CRAWLER KURULUM TALEBİ:\n" +
    "• Şasi: " + selectedChassis.name + "\n" +
    "• Aks & Pirinç: " + selectedAxle.name + "\n" +
    "• Güç Ünitesi: " + selectedMotor.name + "\n" +
    "• Lastik & Jant: " + selectedWheel.name + "\n" +
    "• Aksesuar: " + selectedAccessory.name + "\n" +
    "-----------------------------\n" +
    "Toplam Ağırlık: Yaklaşık " + totalWeight + "g\n" +
    "Ağırlık Dağılımı (CoG): %" + frontRatio + " Ön / %" + rearRatio + " Arka\n" +
    "Tırmanış Açısı Skoru: " + totalClimbAngle + "°\n" +
    "Tahmini Tutar: " + (isSalesAllowed ? (finalTotal.toLocaleString("tr-TR") + " ₺") : "VIP Fiyatı Talep Ediliyor") + "\n" +
    "-----------------------------\n" +
    "Bu kurulumun montajı ve şasi uyumluluğu hakkında detaylı bilgi rica ediyorum.";

  const whatsappUrl = getWhatsAppUrl(storeSettings?.whatsappPhone, buildConfigText);

  const handleAddAllToCart = () => {
    if (!isSalesAllowed) return;

    const setupItems = [
      selectedChassis,
      selectedAxle,
      selectedMotor,
      selectedWheel,
      selectedAccessory,
    ].filter((item) => item.price > 0);

    setupItems.forEach((item) => {
      const discountedItemPrice =
        vipDiscount > 0 ? item.price * (1 - vipDiscount / 100) : item.price;

      addItem({
        id: "config-" + item.id + "-" + Date.now(),
        productId: "config-" + item.id,
        title: item.name,
        variantName: "Özel Setup Bileşeni",
        price: discountedItemPrice,
        image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=400&q=80",
        maxStock: 5,
      });
    });

    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div id="rig-builder" className="bg-[#12161F] border border-[#232B3B] rounded-sm p-6 sm:p-10 shadow-2xl space-y-10">
      {/* Başlık Bölümü */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#222A38] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xs text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>Interactive RC Crawler Rig Configurator</span>
          </div>
          <h2 className="font-mono text-2xl sm:text-4xl text-white font-extrabold uppercase tracking-tight">
            Kaya Canavarı Kurulum Sihirbazı
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-2xl font-light">
            Platform, pirinç ağırlık dağılımı, fırçasız güç ünitesi ve lastik kombinasyonunuzu seçin.
            Gerçek zamanlı tırmanma açısı ve ağırlık merkezi (CoG) simülasyonunu anında görün.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0E1118] px-4 py-2.5 rounded-sm border border-stone-800 text-stone-300 text-xs font-mono">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Tüm parçalar CNC işçilikli & atölye testlidir</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Sol Kolon: Seçim Aşamaları (7 Kolon) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Adım 1: Şasi & Platform */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-extrabold">
                  1
                </span>
                Şasi / Platform Mimarisi
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                {selectedChassis.name.split(" ")[0]}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHASSIS_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChassis(c)}
                  className={`p-4 text-left rounded-sm border transition-all relative ${
                    selectedChassis.id === c.id
                      ? "border-amber-400 bg-[#1A212E] shadow-lg shadow-amber-500/10"
                      : "border-stone-800 bg-[#141822] hover:border-stone-700"
                  }`}
                >
                  {c.badge && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-stone-900 border border-amber-500/30 text-amber-400 text-[9px] font-mono font-bold uppercase rounded-xs">
                      {c.badge}
                    </span>
                  )}
                  <h4 className="text-xs font-mono font-bold text-white uppercase pr-16">
                    {c.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1.5 line-clamp-2 leading-relaxed font-light">
                    {c.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-stone-400">~{c.weightDelta}g</span>
                    {isSalesAllowed && (
                      <span className="text-amber-400 font-bold">
                        {c.price.toLocaleString("tr-TR")} ₺
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Adım 2: Aks & Pirinç Ağırlık Kiti */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-extrabold">
                2
              </span>
              Yürüyen Aksam & Pirinç Portal Ağırlıkları
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {AXLE_OPTIONS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAxle(a)}
                  className={`p-3.5 text-left rounded-sm border transition-all relative ${
                    selectedAxle.id === a.id
                      ? "border-amber-400 bg-[#1A212E] shadow-lg shadow-amber-500/10"
                      : "border-stone-800 bg-[#141822] hover:border-stone-700"
                  }`}
                >
                  {a.badge && (
                    <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block mb-1">
                      ★ {a.badge}
                    </span>
                  )}
                  <h4 className="text-xs font-mono font-bold text-white leading-tight">
                    {a.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-snug font-light">
                    {a.description}
                  </p>
                  <div className="mt-2.5 pt-1.5 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-stone-400">+{a.weightDelta}g</span>
                    {isSalesAllowed && (
                      <span className="text-amber-400 font-bold">
                        {a.price > 0 ? `${a.price.toLocaleString("tr-TR")} ₺` : "Dahil"}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Adım 3: Güç Ünitesi & Motor */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-extrabold">
                3
              </span>
              Fırçasız Sensörlü Güç Ünitesi (ESC & Motor)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOTOR_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMotor(m)}
                  className={`p-3.5 text-left rounded-sm border transition-all ${
                    selectedMotor.id === m.id
                      ? "border-amber-400 bg-[#1A212E] shadow-lg shadow-amber-500/10"
                      : "border-stone-800 bg-[#141822] hover:border-stone-700"
                  }`}
                >
                  {m.badge && (
                    <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block mb-1">
                      {m.badge}
                    </span>
                  )}
                  <h4 className="text-xs font-mono font-bold text-white leading-tight">
                    {m.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-snug font-light">
                    {m.description}
                  </p>
                  <div className="mt-2.5 pt-1.5 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-stone-400">Sensörlü</span>
                    {isSalesAllowed && (
                      <span className="text-amber-400 font-bold">
                        {m.price.toLocaleString("tr-TR")} ₺
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Adım 4 & 5: Jant/Lastik ve Aksesuar (Yan Yana) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Jant & Lastik */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-extrabold">
                  4
                </span>
                Beadlock Jant & Lastik
              </span>
              <div className="space-y-2">
                {WHEEL_OPTIONS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWheel(w)}
                    className={`w-full p-3 text-left rounded-sm border transition-all ${
                      selectedWheel.id === w.id
                        ? "border-amber-400 bg-[#1A212E]"
                        : "border-stone-800 bg-[#141822] hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-white">
                      <span className="line-clamp-1">{w.name}</span>
                      {isSalesAllowed && (
                        <span className="text-amber-400 ml-2 whitespace-nowrap">
                          {w.price.toLocaleString("tr-TR")} ₺
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aksesuar & Vinç */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-extrabold">
                  5
                </span>
                Vinç & Donanım
              </span>
              <div className="space-y-2">
                {ACCESSORY_OPTIONS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccessory(acc)}
                    className={`w-full p-3 text-left rounded-sm border transition-all ${
                      selectedAccessory.id === acc.id
                        ? "border-amber-400 bg-[#1A212E]"
                        : "border-stone-800 bg-[#141822] hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-white">
                      <span className="line-clamp-1">{acc.name}</span>
                      {isSalesAllowed && (
                        <span className="text-amber-400 ml-2 whitespace-nowrap">
                          {acc.price > 0 ? `${acc.price.toLocaleString("tr-TR")} ₺` : "0 ₺"}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Canlı Performans & Mühendislik Telemetri Paneli (5 Kolon) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-[#0D1016] border border-[#232A36] rounded-sm p-6 sm:p-7 space-y-6 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-1.5">
                <Gauge className="w-4 h-4" /> Live Rig Telemetry
              </span>
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] rounded-xs font-bold">
                Simülasyon Aktif
              </span>
            </div>

            {/* 1. Tırmanış Eğimi Simülasyonu */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-stone-300 uppercase tracking-wider font-semibold">
                  Maksimum Tırmanış Eğimi
                </span>
                <span className="text-amber-400 font-bold text-base">{totalClimbAngle}°</span>
              </div>
              <div className="w-full h-3 bg-stone-900 rounded-xs overflow-hidden border border-stone-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${(totalClimbAngle / 70) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-stone-500 font-mono">
                * Dikey kaya tırmanışında devrilmeden tutunabileceği teorik açı.
              </p>
            </div>

            {/* 2. CoG (Ağırlık Merkezi) Ön/Arka Dengesi */}
            <div className="space-y-2 pt-2 border-t border-stone-800/80">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-stone-300 uppercase tracking-wider font-semibold">
                  CoG Ağırlık Dengesi (Ön / Arka)
                </span>
                <span className="text-white font-bold">
                  %{frontRatio} Ön / %{rearRatio} Arka
                </span>
              </div>
              <div className="flex h-3 rounded-xs overflow-hidden border border-stone-800 text-[9px] font-mono text-center">
                <div
                  className="bg-amber-500 text-black font-bold flex items-center justify-center transition-all duration-500"
                  style={{ width: `${frontRatio}%` }}
                >
                  Ön
                </div>
                <div
                  className="bg-stone-700 text-stone-300 flex items-center justify-center transition-all duration-500"
                  style={{ width: `${rearRatio}%` }}
                >
                  Arka
                </div>
              </div>
              <p className="text-[10px] text-stone-500 font-mono">
                * Profesyonel kaya crawlerlarında optimum oran %60-%65 ön ağırlıktır.
              </p>
            </div>

            {/* 3. Toplam Kuru Ağırlık */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 font-mono text-xs">
              <span className="text-stone-400 uppercase tracking-wider">Tahmini Toplam Ağırlık</span>
              <span className="text-white font-bold text-sm">~{totalWeight} gram</span>
            </div>

            {/* 4. FİYAT VE SATIŞ ALANI */}
            <div className="pt-4 border-t border-stone-800 space-y-4">
              <div className="p-4 bg-[#141822] border border-amber-500/20 rounded-sm">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">
                  Kurulum Toplamı (5 Parça / Modül)
                </span>
                {isSalesAllowed ? (
                  <div className="space-y-1">
                    <span className="font-mono text-3xl font-extrabold text-white">
                      {baseTotal.toLocaleString("tr-TR")} ₺
                    </span>
                    <p className="text-[10px] text-stone-400 font-mono">
                      KDV dahildir. Ücretsiz sigortalı kargo ile gönderilir.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-white font-bold text-xs font-mono">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Fiyatlar Yalnızca Onaylı Üyelere Açıktır</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed font-light">
                      Özel parçaların siparişi için yönetici davetiyesi gereklidir.
                    </p>
                  </div>
                )}
              </div>

              {/* Aksiyon Butonları */}
              <div className="space-y-3">
                {/* 1. Buton: WhatsApp ile Danış / Sipariş Ver */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#25D366] text-black text-xs uppercase tracking-widest font-extrabold rounded-sm hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>Setup'ı WhatsApp Atölyesine İlet</span>
                </a>

                {/* 2. Buton: VIP Sepete Ekle (Satış İzni Varsa) */}
                {isSalesAllowed && (
                  <button
                    onClick={handleAddAllToCart}
                    className="w-full py-3.5 bg-amber-500 text-black text-xs uppercase tracking-widest font-extrabold rounded-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Tüm Setup Parçalarını Sepete Ekle</span>
                  </button>
                )}

                {copiedNotification && (
                  <div className="p-2.5 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-mono text-center rounded-xs animate-in fade-in">
                    ✓ Tüm seçili kurulum parçaları sepetinize eklendi!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
