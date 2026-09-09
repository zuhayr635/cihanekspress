"use client";

import React, { useState } from "react";
import { Eye, Layers, Shield, Wrench, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface CadPart {
  id: string;
  name: string;
  category: string;
  sku: string;
  weight: string;
  material: string;
  description: string;
  compat: string;
  x: number; // Yüzdelik konum X
  y: number; // Yüzdelik konum Y
  explodedOffsetY: number;
}

const CAD_PARTS: CadPart[] = [
  {
    id: "front_axle",
    name: "CNC Ağır Pirinç Portal Ön Aks Kiti",
    category: "Aks & Aktarma",
    sku: "CHP-AXL-001",
    weight: "+380g (Aşağı Çekiş)",
    material: "Solid Brass & Hardened Steel",
    description: "Yerçekimi merkezini (CoG) 18mm aşağı çeken, CNC işleme pirinç portal kutuları ve aşınmaya dayanıklı çelik dişliler.",
    compat: "TRX-4, SCX10 II/III, Capra",
    x: 22,
    y: 72,
    explodedOffsetY: 35,
  },
  {
    id: "lcg_chassis",
    name: "LCG 3mm Karbon Fiber Şasi Kirişleri",
    category: "Şasi & Gövde",
    sku: "CHP-CF-042",
    weight: "145g (Ultra Hafif)",
    material: "Toray 3K Karbon Fiber",
    description: "Amortisör açılarını agresif yatırmaya olanak sağlayan çoklu delik dizilimi ve daraltılmış kızak (skid) geometrisi.",
    compat: "Evrensel 1/10 LCG Projeleri",
    x: 50,
    y: 35,
    explodedOffsetY: -40,
  },
  {
    id: "brushless_power",
    name: "Sensörlü FOC 2300Kv Fırçasız Motor & Entegre ESC",
    category: "Elektronik & Güç",
    sku: "CHP-FOC-230",
    weight: "210g",
    material: "Alüminyum Kasa, Neodimyum Mıknatıs",
    description: "Sıfır devirde bile titremesiz milimetrik tork kontrolü. Yokuşta milim milim kayma (Field-Oriented Control).",
    compat: "2S - 4S LiPo Destekli",
    x: 48,
    y: 52,
    explodedOffsetY: -15,
  },
  {
    id: "steering_servo",
    name: "45KG HV Fırçasız Çelik Dişli Su Geçirmez Servo",
    category: "Yönlendirme",
    sku: "CHP-SRV-45K",
    weight: "78g",
    material: "CNC Alüminyum & Titanyum Dişliler",
    description: "Kaya arasına sıkışan tekerlekleri tek hamlede kurtaran 45kg/cm canavar tork, IP67 su geçirmezlik.",
    compat: "Tüm 1/10 ve 1/8 Crawlerlar",
    x: 18,
    y: 48,
    explodedOffsetY: -25,
  },
  {
    id: "shocks",
    name: "Piggyback Harici Rezervuarlı Alüminyum Amortisörler",
    category: "Süspansiyon",
    sku: "CHP-SHK-090",
    weight: "115g (4 Adet)",
    material: "Eloksallı 6061-T6 Alüminyum",
    description: "90mm strok, çift yay sistemi (Dual-Rate) ve ayarlanabilir hidrolik sönümleme ile kusursuz artikülasyon.",
    compat: "90mm / 100mm Montaj Noktaları",
    x: 35,
    y: 40,
    explodedOffsetY: -30,
  },
  {
    id: "rear_axle",
    name: "Hafifletilmiş Alüminyum Kilitli Arka Aks",
    category: "Aks & Aktarma",
    sku: "CHP-AXL-002",
    weight: "185g",
    material: "Havacılık Sınıfı Alüminyum",
    description: "Ön tarafın ağır basması için arka aks hafifletilmiştir. Sabit diferansiyel kilidi ile maksimum kaya tutuşu.",
    compat: "TRX-4, SCX10",
    x: 78,
    y: 70,
    explodedOffsetY: 35,
  },
];

export default function ExplodedCadView() {
  const [selectedPart, setSelectedPart] = useState<CadPart>(CAD_PARTS[0]);
  const [isExploded, setIsExploded] = useState(false);

  return (
    <div className="bg-[#0D111A] border border-[#1F2637] rounded-md p-6 text-stone-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E2536]">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>İnteraktif 3D / CAD Şematik İnceleme</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            Kaya Canavarı Şasi & Bileşen Mimarisi
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Şasi üzerindeki bileşen noktalarına tıklayarak teknik toleransları, malzeme analizini ve montaj konumunu inceleyin.
          </p>
        </div>

        {/* Patlatılmış Görünüm Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all ${
              isExploded
                ? "bg-amber-500 text-black border-amber-400 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                : "bg-[#161B26] text-stone-300 border-[#2B354C] hover:border-amber-400"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isExploded ? "Normal Şemaya Dön" : "Patlatılmış CAD Görünümü"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* CAD Blueprint Sahnesi (Sol 8 Kolon) */}
        <div className="lg:col-span-8 bg-[#090C12] border border-[#1A2233] rounded-md p-6 relative overflow-hidden flex items-center justify-center min-h-[380px]">
          {/* Blueprint Izgarası */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, #2563EB 1px, transparent 1px), linear-gradient(to bottom, #2563EB 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Cetvel Ölçüm Çizgileri */}
          <div className="absolute top-2 left-3 font-mono text-[9px] text-blue-400/80 tracking-widest uppercase">
            SCALE: 1/10 CRAWLER PROTO · CAD MODEL REV-3.4 · DİNGİL: 313MM
          </div>
          <div className="absolute bottom-2 right-3 font-mono text-[9px] text-stone-500">
            {isExploded ? "STATUS: EXPLODED VIEW ACTIVE" : "STATUS: ASSEMBLED CHASSIS"}
          </div>

          {/* Şasi Vektörel Çizim Alanı */}
          <div className="relative w-full max-w-xl h-64 flex items-center justify-center">
            {/* Merkez Şasi Kiriş Silueti */}
            <div
              className={`absolute w-3/4 h-8 border-2 border-dashed border-blue-500/40 rounded transition-transform duration-700 ${
                isExploded ? "-translate-y-8 scale-95" : ""
              }`}
            />

            {/* Hotspot Noktaları */}
            {CAD_PARTS.map((part) => {
              const isSelected = selectedPart.id === part.id;
              const offsetY = isExploded ? part.explodedOffsetY : 0;

              return (
                <button
                  key={part.id}
                  onClick={() => setSelectedPart(part)}
                  style={{
                    left: `${part.x}%`,
                    top: `${part.y}%`,
                    transform: `translate(-50%, calc(-50% + ${offsetY}px))`,
                  }}
                  className={`absolute z-20 transition-all duration-700 group flex flex-col items-center cursor-pointer`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border-2 transition-all ${
                      isSelected
                        ? "bg-amber-400 text-black border-white shadow-[0_0_18px_#F59E0B] scale-125"
                        : "bg-[#141B2B] text-stone-300 border-blue-400/60 hover:border-amber-400 hover:scale-110"
                    }`}
                  >
                    +
                  </span>
                  <span
                    className={`mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-amber-400 text-black font-bold"
                        : "bg-[#090C12]/80 text-stone-400 group-hover:text-white"
                    }`}
                  >
                    {part.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seçilen Parça Detay Paneli (Sağ 4 Kolon) */}
        <div className="lg:col-span-4 bg-[#121622] border border-[#212A3E] rounded-md p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 pb-3 border-b border-[#1E2536]">
              <span className="text-amber-400 font-bold uppercase">{selectedPart.category}</span>
              <span>SKU: {selectedPart.sku}</span>
            </div>

            <h4 className="text-lg font-bold text-white mt-3 leading-snug">
              {selectedPart.name}
            </h4>

            <p className="text-xs text-stone-300 mt-3 leading-relaxed">
              {selectedPart.description}
            </p>

            {/* Teknik Özellik Matrisi */}
            <div className="mt-5 space-y-2 font-mono text-xs">
              <div className="flex justify-between p-2 rounded bg-[#0D1017]">
                <span className="text-stone-400">Malzeme Kalitesi:</span>
                <span className="text-white font-semibold">{selectedPart.material}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0D1017]">
                <span className="text-stone-400">Ağırlık Dinamiği:</span>
                <span className="text-amber-400 font-bold">{selectedPart.weight}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0D1017]">
                <span className="text-stone-400">Şasi Uyumluluğu:</span>
                <span className="text-stone-300">{selectedPart.compat}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1E2536] mt-6">
            <Link
              href="/#products"
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors"
            >
              <span>Katalogda İncele & Ekle</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
