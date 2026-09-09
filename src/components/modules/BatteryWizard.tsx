"use client";

import React, { useState } from "react";
import { BatteryCharging, Zap, ShieldCheck, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function BatteryWizard() {
  const [scale, setScale] = useState<"1_10_trail" | "1_10_lcg" | "1_24_micro">("1_10_trail");
  const [motorType, setMotorType] = useState<"brushed" | "brushless_foc" | "brushless_high">("brushless_foc");
  const [escAmps, setEscAmps] = useState<number>(80);
  const [runStyle, setRunStyle] = useState<"endurance" | "balanced" | "competition">("balanced");

  // Öneri Algoritması
  let recVoltage = "3S LiPo (11.1V)";
  let recCells = "3 Hücre (3S)";
  let recCapacity = "2200 - 3200 mAh";
  let recCRating = "50C - 100C";
  let recConnector = "XT60 (Altın Kaplama)";
  let recFormFactor = "Kompakt (Shorty) Paket";
  let estimatedRuntime = "~75 - 110 Dakika";
  let batteryWeight = "~190 - 240g";
  let advice = "FOC sensörlü fırçasız motor için 3S voltaj, düşük devirde olağanüstü tork kontrolü ve tekerlek temizleme hızı sağlar.";

  if (scale === "1_24_micro") {
    recVoltage = "2S LiPo (7.4V)";
    recCells = "2 Hücre (2S)";
    recCapacity = "350 - 600 mAh";
    recCRating = "30C - 50C";
    recConnector = "PH2.0 veya XT30";
    recFormFactor = "Micro Pack";
    estimatedRuntime = "~45 - 60 Dakika";
    batteryWeight = "~25 - 40g";
    advice = "1/24 micro crawlerlar için hafiflik hayati önemdedir. Şasi üzerinde ağırlık merkezini yükseltmemek için 450mAh altı tercih edin.";
  } else if (scale === "1_10_lcg" || runStyle === "competition") {
    recVoltage = "3S veya 4S LiPo (11.1V - 14.8V)";
    recCells = "3S / 4S High-Discharge";
    recCapacity = "850 - 1300 mAh (Ultra Hafif)";
    recCRating = "75C - 120C";
    recConnector = "XT60";
    recFormFactor = "Ultra-Shorty Comp Pack";
    estimatedRuntime = "~35 - 50 Dakika";
    batteryWeight = "~95 - 130g";
    advice = "Yarışma seviyesi LCG araçlarda gereksiz pil ağırlığı tırmanışı bozar. 1000mAh civarı hafif pille CoG yere yapışır.";
  } else if (motorType === "brushed") {
    recVoltage = "2S veya 3S LiPo (7.4V - 11.1V)";
    recCells = "2S / 3S";
    recCapacity = "3000 - 5000 mAh";
    recCRating = "35C - 50C";
    recConnector = "XT60 veya Deans (T-Plug)";
    recFormFactor = "Standart Hardcase / Softcase";
    estimatedRuntime = "~120 - 180 Dakika";
    batteryWeight = "~280 - 360g";
    advice = "Kömürlü 55T/35T motorlar daha düşük akım çeker. Uzun doğa yürüyüşleri için yüksek kapasite tercih edebilirsiniz.";
  }

  return (
    <div className="bg-[#10131A] border border-[#202738] rounded-md p-6 text-stone-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E2536]">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <BatteryCharging className="w-4 h-4" />
            <span>Enerji & Güç Eşleştirme</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            LiPo Pil & ESC Akım Uyumluluk Sihirbazı
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Motor tipinize, ESC amper kapasitenize ve sürüş tarzınıza göre en yüksek verim sağlayan batarya konfigürasyonunu belirleyin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Seçimler (Sol 6 Kolon) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Araç Ölçeği & Şasi Sınıfı */}
          <div>
            <label className="block text-xs font-mono text-stone-300 mb-2">1. Araç Platformu & Şasi Tipi</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScale("1_10_trail")}
                className={`p-3 text-xs font-mono rounded border transition-all text-left ${
                  scale === "1_10_trail"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400"
                }`}
              >
                <span className="block font-bold">1/10 Trail & Scale</span>
                <span className="text-[10px] text-stone-500 block mt-1">TRX-4, SCX10 vb.</span>
              </button>
              <button
                type="button"
                onClick={() => setScale("1_10_lcg")}
                className={`p-3 text-xs font-mono rounded border transition-all text-left ${
                  scale === "1_10_lcg"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400"
                }`}
              >
                <span className="block font-bold">1/10 LCG Comp</span>
                <span className="text-[10px] text-stone-500 block mt-1">Yarışma Şasileri</span>
              </button>
              <button
                type="button"
                onClick={() => setScale("1_24_micro")}
                className={`p-3 text-xs font-mono rounded border transition-all text-left ${
                  scale === "1_24_micro"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400"
                }`}
              >
                <span className="block font-bold">1/24 Micro</span>
                <span className="text-[10px] text-stone-500 block mt-1">SCX24, FCX24 vb.</span>
              </button>
            </div>
          </div>

          {/* Motor Teknolojisi */}
          <div>
            <label className="block text-xs font-mono text-stone-300 mb-2">2. Motor Teknolojisi</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMotorType("brushless_foc")}
                className={`p-3 text-xs font-mono rounded border transition-all text-left ${
                  motorType === "brushless_foc"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400"
                }`}
              >
                <span className="block font-bold">Sensörlü FOC Fırçasız</span>
                <span className="text-[10px] text-stone-500 block mt-1">Fusion Pro, AXE vb.</span>
              </button>
              <button
                type="button"
                onClick={() => setMotorType("brushed")}
                className={`p-3 text-xs font-mono rounded border transition-all text-left ${
                  motorType === "brushed"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400"
                }`}
              >
                <span className="block font-bold">Kömürlü (Brushed)</span>
                <span className="text-[10px] text-stone-500 block mt-1">35T / 55T Klasik</span>
              </button>
              <button
                type="button"
                onClick={() => setMotorType("brushless_high")}
                className={`p-3 text-xs font-mono rounded border transition-all text-left ${
                  motorType === "brushless_high"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400"
                }`}
              >
                <span className="block font-bold">Yüksek Devirli Fırçasız</span>
                <span className="text-[10px] text-stone-500 block mt-1">2800Kv+ Outrunner</span>
              </button>
            </div>
          </div>

          {/* ESC Akım Gücü */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-stone-300">3. ESC Akım Kapasitesi</span>
              <span className="text-amber-400 font-bold">{escAmps} Amper Devamlı</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[40, 60, 80, 120].map((amp) => (
                <button
                  key={amp}
                  type="button"
                  onClick={() => setEscAmps(amp)}
                  className={`py-2 text-xs font-mono rounded border transition-all text-center ${
                    escAmps === amp
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                      : "bg-[#161B26] border-[#2B354C] text-stone-400"
                  }`}
                >
                  {amp}A ESC
                </button>
              ))}
            </div>
          </div>

          {/* Sürüş Hedefi */}
          <div>
            <label className="block text-xs font-mono text-stone-300 mb-2">4. Kullanım Önceliği</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRunStyle("endurance")}
                className={`p-2.5 text-xs font-mono rounded border transition-all text-center ${
                  runStyle === "endurance"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400"
                }`}
              >
                Uzun Doğa Sürüşü
              </button>
              <button
                type="button"
                onClick={() => setRunStyle("balanced")}
                className={`p-2.5 text-xs font-mono rounded border transition-all text-center ${
                  runStyle === "balanced"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400"
                }`}
              >
                Dengeli Parkur
              </button>
              <button
                type="button"
                onClick={() => setRunStyle("competition")}
                className={`p-2.5 text-xs font-mono rounded border transition-all text-center ${
                  runStyle === "competition"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400"
                }`}
              >
                Hafif Yarışma (LCG)
              </button>
            </div>
          </div>
        </div>

        {/* Sonuç & Reçete (Sağ 6 Kolon) */}
        <div className="lg:col-span-6 bg-[#121724] border border-[#212C42] rounded-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-[#20293D]">
              <Zap className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-white text-base">Tavsiye Edilen Batarya Reçetesi</h4>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 font-mono text-xs">
              <div className="bg-[#0B0F17] p-3 rounded border border-[#1A2233]">
                <span className="text-[10px] text-stone-400 uppercase block">Hücre & Voltaj</span>
                <span className="text-amber-400 font-bold text-sm mt-0.5 block">{recVoltage}</span>
              </div>
              <div className="bg-[#0B0F17] p-3 rounded border border-[#1A2233]">
                <span className="text-[10px] text-stone-400 uppercase block">Kapasite Aralığı</span>
                <span className="text-white font-bold text-sm mt-0.5 block">{recCapacity}</span>
              </div>
              <div className="bg-[#0B0F17] p-3 rounded border border-[#1A2233]">
                <span className="text-[10px] text-stone-400 uppercase block">Deşarj Oranı (C-Rate)</span>
                <span className="text-emerald-400 font-bold text-sm mt-0.5 block">{recCRating}</span>
              </div>
              <div className="bg-[#0B0F17] p-3 rounded border border-[#1A2233]">
                <span className="text-[10px] text-stone-400 uppercase block">Kasa Tipi / Form</span>
                <span className="text-white font-bold text-sm mt-0.5 block">{recFormFactor}</span>
              </div>
              <div className="bg-[#0B0F17] p-3 rounded border border-[#1A2233]">
                <span className="text-[10px] text-stone-400 uppercase block">Konnektör Standartı</span>
                <span className="text-stone-200 font-bold text-sm mt-0.5 block">{recConnector}</span>
              </div>
              <div className="bg-[#0B0F17] p-3 rounded border border-[#1A2233]">
                <span className="text-[10px] text-stone-400 uppercase block">Tahmini Sürüş Süresi</span>
                <span className="text-amber-400 font-bold text-sm mt-0.5 block">{estimatedRuntime}</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded bg-[#182030] border-l-2 border-amber-400 text-xs text-stone-300 leading-relaxed font-mono">
              💡 <strong>Elektronik Uyumluluk Analizi:</strong> {advice}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#20293D] flex items-center justify-between">
            <span className="text-xs font-mono text-stone-400">Tahmini Pil Ağırlığı: <strong className="text-white">{batteryWeight}</strong></span>
            <Link
              href="/#products"
              className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase rounded flex items-center gap-1.5 transition-colors"
            >
              <span>Uyumlu Pilleri Gör</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
