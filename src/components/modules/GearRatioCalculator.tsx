"use client";

import React, { useState } from "react";
import { Cog, Zap, Gauge, Flame, Check, HelpCircle } from "lucide-react";

export default function GearRatioCalculator() {
  const [pinion, setPinion] = useState(11); // Pinyon dişli (9 - 21)
  const [spur, setSpur] = useState(45); // Spur dişli (38 - 56)
  const [transRatio, setTransRatio] = useState(2.6); // Şanzıman içi redüksiyon (1.5 - 4.0)
  const [axleRatio, setAxleRatio] = useState(3.75); // Diferansiyel ayna mahruti (2.8 - 4.5)
  const [portalRatio, setPortalRatio] = useState(1.92); // Portal dişli kutusu (1.0 düz aks, 1.92 portal)
  const [overdrive, setOverdrive] = useState<number>(15); // Ön aks overdrive %
  const [motorKv, setMotorKv] = useState(2300); // Motor Kv (1200 - 3500)
  const [batteryVoltage, setBatteryVoltage] = useState(11.1); // 2S 7.4V, 3S 11.1V, 4S 14.8V
  const [tireDiameter, setTireDiameter] = useState(120); // Lastik çapı mm

  // Arka Aks Toplam FDR (Final Drive Ratio)
  // FDR = (Spur / Pinion) * TransRatio * AxleRatio * PortalRatio
  const baseFDR = (spur / pinion) * transRatio * axleRatio * portalRatio;

  // Ön Aks FDR (Overdrive ile ön tekerlekler daha hızlı döner, dolayısıyla oranı daha düşüktür)
  const frontFDR = baseFDR / (1 + overdrive / 100);

  // Motor Maksimum RPM (Yüksüz)
  const motorRPM = motorKv * batteryVoltage;

  // Tekerlek Dönüş Hızı (RPM)
  const rearWheelRPM = Math.round(motorRPM / baseFDR);
  const frontWheelRPM = Math.round(motorRPM / frontFDR);

  // Tahmini Son Hız (km/h)
  // Lastik çevresi = Pi * D (metre)
  const tireCircumferenceM = (Math.PI * tireDiameter) / 1000;
  const topSpeedKmH = Math.round(((rearWheelRPM * tireCircumferenceM * 60) / 1000) * 0.88 * 10) / 10; // %12 mekanik sürtünme kaybı

  // Crawlability Değerlendirmesi
  let crawlBadge = {
    title: "Yarışma Seviyesi Teknik Kaya (Extreme Slow Crawl)",
    color: "text-emerald-400 bg-emerald-950/60 border-emerald-500",
    desc: "Aşırı yüksek redüksiyon ve devasa tork. Santimetre hassasiyetinde yavaş kayma, sıfır motor kekelemesi.",
  };
  if (baseFDR < 40) {
    crawlBadge = {
      title: "Rock Bouncer / Hızlı Arazi (Speed & Trail)",
      color: "text-amber-400 bg-amber-950/60 border-amber-500",
      desc: "Yüksek tekerlek hızı, çamur ve dik toprak sıçramaları için ideal. Yavaş teknik kayalarda daha fazla motor ısınması yapabilir.",
    };
  } else if (baseFDR < 55) {
    crawlBadge = {
      title: "Dengeli Genel Parkur (Balanced Trail & Scale)",
      color: "text-blue-400 bg-blue-950/60 border-blue-500",
      desc: "Hem yürüyüş temposunda sürüş hem de dik kaya geçişleri için en popüler hobi oranı.",
    };
  }

  return (
    <div className="bg-[#10131A] border border-[#202738] rounded-md p-6 text-stone-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E2536]">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Cog className="w-4 h-4" />
            <span>Aktarma & Transmisyon Fiziği</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            FDR Dişli Oranı, Overdrive & Sürat Hesaplayıcı
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Pinyon/Spur kombinasyonunuzun tork çarpanını, ön aks overdrive hızını ve son süratini simüle edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#161B26] border border-[#2B354C] px-3.5 py-2 rounded text-right">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">Toplam FDR</span>
            <span className="text-lg font-mono font-bold text-amber-400">{baseFDR.toFixed(1)} : 1</span>
          </div>
          <div className="bg-[#161B26] border border-[#2B354C] px-3.5 py-2 rounded text-right">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">Tahmini Hız</span>
            <span className="text-lg font-mono font-bold text-emerald-400">{topSpeedKmH} km/s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Parametre Girişleri (Sol 7 Kolon) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Pinyon ve Spur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-stone-300">Pinyon Dişli (Pinion)</span>
                <span className="text-amber-400 font-bold">{pinion}T</span>
              </div>
              <input
                type="range"
                min={9}
                max={23}
                step={1}
                value={pinion}
                onChange={(e) => setPinion(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-[#1B2130] rounded cursor-pointer"
              />
              <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">Küçük pinyon = Yüksek tork, düşük hız</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-stone-300">Spur Dişli</span>
                <span className="text-amber-400 font-bold">{spur}T</span>
              </div>
              <input
                type="range"
                min={36}
                max={60}
                step={1}
                value={spur}
                onChange={(e) => setSpur(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-[#1B2130] rounded cursor-pointer"
              />
              <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">Büyük spur = Daha fazla tork</span>
            </div>
          </div>

          {/* Şanzıman ve Portal Tipi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1.5">Şanzıman / Transfer Oranı</label>
              <select
                value={transRatio}
                onChange={(e) => setTransRatio(Number(e.target.value))}
                className="w-full bg-[#161B26] border border-[#2B354C] text-xs font-mono text-stone-200 rounded px-3 py-2"
              >
                <option value={2.6}>TRX-4 Düşük Vites (Low Gear: 2.6:1)</option>
                <option value={1.54}>TRX-4 Yüksek Vites (High Gear: 1.54:1)</option>
                <option value={2.6}>Axial SCX10 II / III (2.6:1)</option>
                <option value={2.43}>Axial Capra 4WS (2.43:1)</option>
                <option value={1.8}>Element Stealth X (1.8:1)</option>
                <option value={3.2}>LCG Özel Şanzıman (3.2:1)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1.5">Aks Yapısı</label>
              <select
                value={portalRatio}
                onChange={(e) => setPortalRatio(Number(e.target.value))}
                className="w-full bg-[#161B26] border border-[#2B354C] text-xs font-mono text-stone-200 rounded px-3 py-2"
              >
                <option value={1.92}>Portal Aks (1.92:1 Redüksiyonlu - TRX-4 / Capra)</option>
                <option value={1.0}>Düz Aks / Straight Axle (1.0:1 - SCX10 II)</option>
                <option value={1.5}>Özel Hafif Portal Kiti (1.5:1)</option>
              </select>
            </div>
          </div>

          {/* Ön Aks Overdrive Oranı */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-stone-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Ön Aks Overdrive Oranı (Kaya Tırmanış Çekişi)
              </span>
              <span className="text-amber-400 font-bold">%{overdrive} Hızlı</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 15, 25, 33].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setOverdrive(val)}
                  className={`py-2 text-xs font-mono rounded border transition-all text-center ${
                    overdrive === val
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                      : "bg-[#161B26] border-[#2B354C] text-stone-400 hover:border-stone-500"
                  }`}
                >
                  {val === 0 ? "Standart (%0)" : `%${val} Overdrive`}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-stone-500 font-mono mt-1">
              *Overdrive, ön tekerleklerin arkadan daha hızlı dönmesini sağlayarak aracın burnunu kayaya çeker ve dönüş çapını daraltır.
            </p>
          </div>

          {/* Motor Kv ve Batarya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-stone-300">Motor Gücü (Kv Değeri)</span>
                <span className="text-amber-400 font-bold">{motorKv} Kv</span>
              </div>
              <input
                type="range"
                min={1200}
                max={3500}
                step={100}
                value={motorKv}
                onChange={(e) => setMotorKv(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-[#1B2130] rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1.5">Batarya Tipi (Voltaj)</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: "2S (7.4V)", v: 7.4 },
                  { label: "3S (11.1V)", v: 11.1 },
                  { label: "4S (14.8V)", v: 14.8 },
                ].map((b) => (
                  <button
                    key={b.v}
                    type="button"
                    onClick={() => setBatteryVoltage(b.v)}
                    className={`py-2 text-[11px] font-mono rounded border text-center transition-all ${
                      batteryVoltage === b.v
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                        : "bg-[#161B26] border-[#2B354C] text-stone-400"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sonuç Kartı & Analiz (Sağ 5 Kolon) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className={`p-4 rounded-md border ${crawlBadge.color}`}>
            <span className="text-[10px] font-mono uppercase tracking-wider block font-bold">Karakteristik Sınıfı</span>
            <h4 className="text-base font-bold mt-1 text-white">{crawlBadge.title}</h4>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">{crawlBadge.desc}</p>
          </div>

          <div className="bg-[#141824] border border-[#232C3F] rounded-md p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#202738]">
              <span className="text-stone-400">Arka Aks FDR Redüksiyonu:</span>
              <span className="font-bold text-white">{baseFDR.toFixed(1)} : 1</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#202738]">
              <span className="text-stone-400">Ön Aks FDR (Overdrive&apos;lı):</span>
              <span className="font-bold text-amber-400">{frontFDR.toFixed(1)} : 1</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#202738]">
              <span className="text-stone-400">Arka Tekerlek RPM (Maks):</span>
              <span className="font-bold text-white">{rearWheelRPM} RPM</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#202738]">
              <span className="text-stone-400">Ön Tekerlek RPM (Maks):</span>
              <span className="font-bold text-amber-400">{frontWheelRPM} RPM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Tahmini Düz Yol Sürati:</span>
              <span className="font-bold text-emerald-400 text-sm">{topSpeedKmH} km/saat</span>
            </div>
          </div>

          <div className="bg-[#181D2B] border-l-2 border-amber-500 p-3 rounded-r text-[11px] text-stone-300 leading-relaxed font-mono">
            💡 <strong>Tavsiye Dişli Kalibrasyonu:</strong> {pinion}T pinyon ve {spur}T spur ile motorunuz {batteryVoltage}V beslemede {Math.round(motorRPM)} RPM üretir. Dik kayalarda daha az ısı için 10T pinyona inebilirsiniz.
          </div>
        </div>
      </div>
    </div>
  );
}
