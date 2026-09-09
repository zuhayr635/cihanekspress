"use client";

import React, { useState, useId } from "react";
import { Scale, ArrowUpRight, AlertTriangle, CheckCircle, RotateCw, Compass } from "lucide-react";

export default function CoGCalculator() {
  const [baseWeight, setBaseWeight] = useState(2300); // Boş şasi ağırlığı (g)
  const [frontBrass, setFrontBrass] = useState(280); // Ön pirinç ağırlık (g)
  const [rearBrass, setRearBrass] = useState(60); // Arka pirinç ağırlık (g)
  const [wheelBrass, setWheelBrass] = useState(160); // 4 Teker jant içi pirinç (g)
  const [batteryPos, setBatteryPos] = useState<"forward" | "center" | "rear">("forward");
  const [rideHeight, setRideHeight] = useState(72); // Yerden şasi yüksekliği (mm)
  const [simAngle, setSimAngle] = useState(45); // Anlık test eğim açısı (derece)
  const clipId = useId();

  // Pil konumu ağırlık ve etki katsayıları
  const batteryWeight = 220; // 3S LiPo ortalama
  const batteryFrontShare = batteryPos === "forward" ? 0.75 : batteryPos === "center" ? 0.5 : 0.25;

  // Ön ve Arka toplam ağırlıklar
  const frontTotal =
    (baseWeight * 0.5) +
    frontBrass +
    (wheelBrass * 0.55) +
    (batteryWeight * batteryFrontShare);

  const rearTotal =
    (baseWeight * 0.5) +
    rearBrass +
    (wheelBrass * 0.45) +
    (batteryWeight * (1 - batteryFrontShare));

  const totalWeight = frontTotal + rearTotal;
  const frontBias = Math.round((frontTotal / totalWeight) * 100);
  const rearBias = 100 - frontBias;

  // Ağırlık merkezi (CoG) yüksekliği tahmini (mm)
  // Ağır pirinç akslar CoG'yi aşağı çeker (aks yüksekliği ~35mm)
  const brassRatio = (frontBrass + rearBrass + wheelBrass) / totalWeight;
  const estimatedCoGHeight = Math.max(38, Math.round(rideHeight * 0.85 - (brassRatio * 50)));

  // Maksimum tırmanış açısı (Derece cinsinden devrilme sınırı)
  // Dingil mesafesi ~313mm (Standart 1/10 crawler)
  const wheelbase = 313;
  const frontAxleDist = wheelbase * (rearBias / 100);
  const maxClimbAngle = Math.min(
    74,
    Math.max(30, Math.round(Math.atan(frontAxleDist / estimatedCoGHeight) * (180 / Math.PI)))
  );

  // Yan eğim dayanımı (Side Hill Angle)
  const trackWidth = 230; // İz genişliği
  const maxSideHillAngle = Math.min(
    58,
    Math.max(25, Math.round(Math.atan((trackWidth / 2) / estimatedCoGHeight) * (180 / Math.PI) - 5))
  );

  const isTippingOver = simAngle > maxClimbAngle;

  return (
    <div className="bg-[#10131A] border border-[#202738] rounded-md p-6 text-stone-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E2536]">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Kaya Tırmanış Mühendisliği</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            CoG (Ağırlık Merkezi) & Eğim Devrilme Simülatörü
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Ön/arka pirinç ağırlıklar, pil pozisyonu ve şasi yüksekliğine göre aracınızın devrilme limitini hesaplayın.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#161B26] border border-[#2B354C] px-3.5 py-2 rounded text-right">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">Toplam Ağırlık</span>
            <span className="text-lg font-mono font-bold text-amber-400">{Math.round(totalWeight)} g</span>
          </div>
          <div className="bg-[#161B26] border border-[#2B354C] px-3.5 py-2 rounded text-right">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">Ön / Arka Oranı</span>
            <span className={`text-lg font-mono font-bold ${frontBias >= 58 && frontBias <= 64 ? "text-emerald-400" : "text-amber-400"}`}>
              %{frontBias} / %{rearBias}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Kontroller (Sol 7 Kolon) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Boş Şasi Ağırlığı */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-stone-300">Temel Şasi & Gövde Ağırlığı</span>
              <span className="text-amber-400 font-bold">{baseWeight} g</span>
            </div>
            <input
              type="range"
              min={1500}
              max={3800}
              step={50}
              value={baseWeight}
              onChange={(e) => setBaseWeight(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-[#1B2130] rounded cursor-pointer"
            />
          </div>

          {/* Ön Aks Pirinç Ağırlık */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-stone-300">Ön Portal & Aks Pirinç Parçalar (Brass Knuckles/Covers)</span>
              <span className="text-amber-400 font-bold">+{frontBrass} g</span>
            </div>
            <input
              type="range"
              min={0}
              max={600}
              step={10}
              value={frontBrass}
              onChange={(e) => setFrontBrass(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-[#1B2130] rounded cursor-pointer"
            />
            <span className="text-[10px] text-stone-500 block mt-0.5 font-mono">Tavsiye: 200g - 350g arası dik tırmanışta burnu yerde tutar.</span>
          </div>

          {/* Arka Aks Pirinç Ağırlık */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-stone-300">Arka Aks Pirinç Ağırlık</span>
              <span className="text-amber-400 font-bold">+{rearBrass} g</span>
            </div>
            <input
              type="range"
              min={0}
              max={300}
              step={10}
              value={rearBrass}
              onChange={(e) => setRearBrass(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-[#1B2130] rounded cursor-pointer"
            />
          </div>

          {/* Tekerlek Jant Ağırlıkları */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-stone-300">Beadlock Jant İçi Pirinç Halkalar (4 Teker)</span>
              <span className="text-amber-400 font-bold">+{wheelBrass} g</span>
            </div>
            <input
              type="range"
              min={0}
              max={400}
              step={20}
              value={wheelBrass}
              onChange={(e) => setWheelBrass(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-[#1B2130] rounded cursor-pointer"
            />
          </div>

          {/* Pil Pozisyonu */}
          <div>
            <label className="block text-xs font-mono text-stone-300 mb-2">LiPo Pil Montaj Konumu</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBatteryPos("forward")}
                className={`py-2 px-3 text-xs font-mono rounded border transition-all text-center ${
                  batteryPos === "forward"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400 hover:border-stone-500"
                }`}
              >
                Ön Aks Üstü (Low Forward)
              </button>
              <button
                type="button"
                onClick={() => setBatteryPos("center")}
                className={`py-2 px-3 text-xs font-mono rounded border transition-all text-center ${
                  batteryPos === "center"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400 hover:border-stone-500"
                }`}
              >
                Şasi Ortası (Merkezi)
              </button>
              <button
                type="button"
                onClick={() => setBatteryPos("rear")}
                className={`py-2 px-3 text-xs font-mono rounded border transition-all text-center ${
                  batteryPos === "rear"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-[#161B26] border-[#2B354C] text-stone-400 hover:border-stone-500"
                }`}
              >
                Arka Bagaj / Şasi
              </button>
            </div>
          </div>

          {/* Şasi Yerden Yükseklik */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-stone-300">Yerden Gövde / Kızak Yüksekliği (Skid Clearance)</span>
              <span className="text-amber-400 font-bold">{rideHeight} mm</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={1}
              value={rideHeight}
              onChange={(e) => setRideHeight(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-[#1B2130] rounded cursor-pointer"
            />
          </div>

          {/* Eğim Açısı Testi */}
          <div className="p-4 bg-[#141824] border border-[#232C3F] rounded-md">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-white font-bold flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                Sanal Kaya Parkuru Test Açısı
              </span>
              <span className={`font-bold text-sm ${isTippingOver ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                {simAngle}° Eğim
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={75}
              step={1}
              value={simAngle}
              onChange={(e) => setSimAngle(Number(e.target.value))}
              className={`w-full h-2 rounded cursor-pointer ${
                isTippingOver ? "accent-red-500 bg-red-950/40" : "accent-emerald-500 bg-[#1B2130]"
              }`}
            />
          </div>
        </div>

        {/* Görsel Simülatör & Sonuçlar (Sağ 5 Kolon) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Eğim ve Araç İllüstrasyonu (SVG) */}
          <div className="bg-[#0A0D14] border border-[#1E2536] rounded-md p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            {/* Grid Blueprint Arka Planı */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#F59E0B 1px, transparent 1px), radial-gradient(#F59E0B 1px, #0A0D14 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Durum Rozeti */}
            <div className="absolute top-3 left-3 z-10">
              {isTippingOver ? (
                <span className="bg-red-950/80 border border-red-600 text-red-300 text-[10px] font-mono font-bold px-2 py-1 rounded flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  GERİYE TAKLA RİSKİ!
                </span>
              ) : (
                <span className="bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-[10px] font-mono font-bold px-2 py-1 rounded flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  KAYA TUTUNMASI GÜVENLİ
                </span>
              )}
            </div>

            {/* SVG Inclinometer Crawler Visual */}
            <svg viewBox="0 0 300 200" className="w-full max-w-[280px] h-auto z-0">
              <defs>
                <clipPath id={clipId}>
                  <rect x="0" y="0" width="300" height="200" />
                </clipPath>
              </defs>

              {/* Kaya Zemin Eğimi */}
              <line
                x1="20"
                y1={170}
                x2="280"
                y2={170 - Math.tan((simAngle * Math.PI) / 180) * 220}
                stroke={isTippingOver ? "#EF4444" : "#F59E0B"}
                strokeWidth="4"
                strokeDasharray="4 2"
              />

              {/* Araç Grubu - Açılı Rotasyon */}
              <g transform={`translate(150, 120) rotate(-${simAngle})`}>
                {/* Şasi Çizgisi */}
                <rect x="-65" y="-18" width="130" height="14" rx="3" fill="#2A344A" stroke="#4B5563" strokeWidth="1.5" />

                {/* Ön / Arka Tekerlekler */}
                <circle cx="-50" cy="12" r="18" fill="#1A1F2C" stroke="#F59E0B" strokeWidth="2.5" />
                <circle cx="-50" cy="12" r="7" fill="#F59E0B" />
                <circle cx="50" cy="12" r="18" fill="#1A1F2C" stroke="#9CA3AF" strokeWidth="2" />
                <circle cx="50" cy="12" r="7" fill="#4B5563" />

                {/* Gövde Silueti (Cage) */}
                <path d="M -45 -18 L -20 -42 L 25 -42 L 48 -18 Z" fill="none" stroke="#60A5FA" strokeWidth="2" />

                {/* CoG Noktası (Ağırlık Merkezi) */}
                <circle
                  cx={-30 + (rearBias / 100) * 60}
                  cy={-estimatedCoGHeight / 3}
                  r="6"
                  fill="#F59E0B"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
                <text
                  x={-30 + (rearBias / 100) * 60}
                  y={-estimatedCoGHeight / 3 - 10}
                  fill="#F59E0B"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  CoG
                </text>
              </g>
            </svg>

            <span className="text-[11px] font-mono text-stone-400 mt-2">
              Maksimum Güvenli Tırmanış Sınırı: <strong className="text-white">{maxClimbAngle}°</strong>
            </span>
          </div>

          {/* Mühendislik Değerleri Tablosu */}
          <div className="bg-[#141824] border border-[#232C3F] rounded-md p-4 space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-[#202738]">
              <span className="text-stone-400">Ön/Arka Ağırlık Dağılımı:</span>
              <span className={`font-bold ${frontBias >= 58 && frontBias <= 64 ? "text-emerald-400" : "text-amber-400"}`}>
                %{frontBias} Ön / %{rearBias} Arka
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#202738]">
              <span className="text-stone-400">CoG Yüksekliği (Skid Üstü):</span>
              <span className="text-white font-bold">{estimatedCoGHeight} mm</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#202738]">
              <span className="text-stone-400">Maks. Yan Eğim (Side Hill):</span>
              <span className="text-amber-400 font-bold">{maxSideHillAngle}°</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Tırmanış Eğim Limiti:</span>
              <span className="text-emerald-400 font-bold">{maxClimbAngle}°</span>
            </div>
          </div>

          {/* Usta Yorumu & Tavsiyesi */}
          <div className="bg-[#181D2B] border-l-2 border-amber-500 p-3 rounded-r text-[11px] text-stone-300 leading-relaxed">
            {frontBias < 55 ? (
              <span className="text-amber-300">
                ⚠️ <strong>Usta Tavsiyesi:</strong> Ön tarafınız hafif (%{frontBias}). Dik kayalara tırmanırken tekerlekler havaya kalkabilir. Ön portallara en az +150g pirinç eklemeniz önerilir.
              </span>
            ) : frontBias > 66 ? (
              <span className="text-amber-300">
                ⚠️ <strong>Usta Tavsiyesi:</strong> Ön taraf aşırı ağır (%{frontBias}). Tırmanış iyi olsa da dik inişlerde takla riski ve ön süspansiyon çökmesi yaşayabilirsiniz.
              </span>
            ) : (
              <span className="text-emerald-300">
                ✅ <strong>Kusursuz Tırmanıcı:</strong> %{frontBias}/%{rearBias} oranı uluslararası yarışma standartlarındadır (Class 1 & Class 2). Yerçekimi merkezi ideal seviyede.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
