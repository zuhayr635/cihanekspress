"use client";

import React, { useState } from "react";
import { Wrench, CheckCircle2, ShieldCheck, Clock, MessageCircle, Sparkles, Flame } from "lucide-react";
import { useModules } from "@/lib/useModules";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface ServicePack {
  id: string;
  name: string;
  level: string;
  price: number;
  duration: string;
  badge: string;
  color: string;
  description: string;
  features: string[];
}

const SERVICE_PACKS: ServicePack[] = [
  {
    id: "pack_light",
    name: "Sezon Başı Hafif Tırmanış Bakımı",
    level: "AŞAMA 1",
    price: 750,
    duration: "1 İş Günü",
    badge: "RUTİN KORUMA",
    color: "border-[#2A344A]",
    description: "Kaya sezonuna girmeden önce aktarma organlarını rahatlatan ve aşınmayı önleyen temel atölye bakımı.",
    features: [
      "Ön & Arka aks diferansiyel dişli temizliği ve taze sentetik gresleme",
      "4 Amortisör silikon yağ seviyesi kontrolü ve hava tahliyesi",
      "Pinyon / Spur dişli mesafesi (backlash) hassas mikrometre ayarı",
      "Gevşeyen link vidalarının Loctite kilitlenmesi ve genel sıkılık kontrolü",
      "Alıcı anteni ve pil soketleri korozyon temizliği",
    ],
  },
  {
    id: "pack_pro",
    name: "Pro Kaya & IP68 Su Geçirmezlik Paketi",
    level: "AŞAMA 2",
    price: 1450,
    duration: "2 İş Günü",
    badge: "EN ÇOK TERCİH EDİLEN",
    color: "border-amber-500/70 shadow-[0_0_25px_rgba(245,158,11,0.2)]",
    description: "Derin nehir geçişleri ve çamurlu tırmanışlar için tüm yürüyen aksamı ve elektroniği su geçirmez zırhla kaplar.",
    features: [
      "Aşama 1'deki tüm işlemler eksiksiz uygulanır",
      "Tüm aks ve şanzıman rulmanlarının ultrasonik banyoda yıkanıp seramik greslenmesi",
      "IP68 Marin sınıfı conta ve dielektrik silikon ile su geçirmezlik mühürlemesi",
      "Portal aks dişli kutularının sökülüp molibdenli yüksek basınç gresi ile dolumu",
      "CoG (Ağırlık Merkezi) terazisinde ön/arka ağırlık balansı optimizasyonu",
      "Şasi link açıları ve süspansiyon artikülasyon limit testi",
    ],
  },
  {
    id: "pack_master",
    name: "Master Yarışma Revizyonu & Şasi Kalibrasyonu",
    level: "AŞAMA 3",
    price: 2850,
    duration: "3 - 4 İş Günü",
    badge: "ULTRA PERFORMANS",
    color: "border-blue-500/70",
    description: "Aracın cıvatasına kadar dağıtılıp sıfır fabrika toleranslarına ve yarışma standartlarına kavuşturulması.",
    features: [
      "Aşama 1 ve Aşama 2'deki tüm işlemler dahil",
      "Şasinin tamamen dağıtılıp karbon / çelik kirişlerin mikron düzeyinde düzeltilmesi",
      "Aşınmış tüm bilyalı rulmanların yüksek devirli paslanmaz rulmanlarla değişimi",
      "Fırçasız FOC motor içi temizliği, rulman yenilemesi ve rotor manyetik testi",
      "45KG yön servosu potansiyometre kalibrasyonu ve tork dinamometre testi",
      "Yapay kaya parkuru simülatöründe 45 dakikalık zorlu tırmanış stres testi",
      "CIHANPOL Islak İmzalı Atölye Bakım Raporu & Usta Kaşesi",
    ],
  },
];

export default function MaintenancePage() {
  const { isModuleActive } = useModules();
  const { storeSettings } = useCart();

  if (!isModuleActive("maintenance_packs")) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center max-w-md bg-[#11141D] p-8 border border-[#1E2536] rounded">
          <Wrench className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Atölye Bakım Servisi Kapalıdır</h2>
          <p className="text-xs text-stone-400 mt-2">Bu modül yönetici tarafından geçici olarak durdurulmuştur.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>Resmi Atölye Servisi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight uppercase">
            Periyodik Sezonluk RC Crawler Bakım Paketleri
          </h1>
          <p className="text-sm text-stone-400 mt-3 leading-relaxed">
            Kayaların, kumun ve çamurun aşındırdığı diferansiyelleri, rulmanları ve amortisörleri zanaatkar dokunuşuyla ilk günkü tork ve sessizliğe kavuşturun.
          </p>
        </div>

        {/* 3 Paket Kartı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {SERVICE_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`bg-[#10141E] border ${pack.color} rounded-lg p-6 flex flex-col justify-between transition-all duration-300 relative shadow-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 font-mono text-xs">
                  <span className="text-amber-400 font-bold">{pack.level}</span>
                  <span className="text-[10px] bg-[#192030] text-stone-300 px-2 py-0.5 rounded border border-[#2B354C]">
                    {pack.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-mono leading-snug">
                  {pack.name}
                </h3>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  {pack.description}
                </p>

                <div className="mt-4 flex items-center gap-2 font-mono text-xs text-stone-400 pb-4 border-b border-[#1E2536]">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Servis Süresi: <strong className="text-white">{pack.duration}</strong></span>
                </div>

                {/* Maddeler */}
                <div className="mt-5 space-y-2.5 font-mono text-xs">
                  {pack.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-stone-300 leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fiyat ve Rezervasyon */}
              <div className="mt-8 pt-5 border-t border-[#1E2536]">
                <div className="flex items-baseline justify-between mb-4 font-mono">
                  <span className="text-xs text-stone-400">Sabit Servis Ücreti:</span>
                  <span className="text-2xl font-bold text-amber-400">
                    {pack.price.toLocaleString("tr-TR")} ₺
                  </span>
                </div>

                <a
                  href={getWhatsAppUrl(
                    storeSettings?.whatsappPhone,
                    `Merhaba, ${pack.name} için atölyenizden servis randevusu almak istiyorum.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-black font-mono text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(37,211,102,0.3)]"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>Atölye Randevusu Oluştur</span>
                </a>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
