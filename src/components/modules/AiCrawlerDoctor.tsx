"use client";

import React, { useState } from "react";
import { MessageSquare, Stethoscope, X, Send, Sparkles, AlertTriangle, CheckCircle2, ChevronRight, Wrench, ShieldAlert } from "lucide-react";
import { useModules } from "@/lib/useModules";
import Link from "next/link";

interface DiagnosisResult {
  diagnosis: string;
  immediateChecks: string[];
  recommendedFixes: string[];
  recommendedProducts: string[];
}

const PRESET_ISSUES = [
  "Yokuşta takla atıyor / Ön taraf havaya kalkıyor",
  "Yön servosu çok ısınıyor ve kilitleniyor",
  "Tork bükülmesi (Torque Twist) var, sağ tekerlek kalkıyor",
  "Yokuş aşağı inerken araç kayıyor (Drag brake tutmuyor)",
  "Şanzımandan çıtırtı / dişli sıyırma sesi geliyor",
];

export default function AiCrawlerDoctor() {
  const { isModuleActive } = useModules();
  const [isOpen, setIsOpen] = useState(false);
  const [symptomInput, setSymptomInput] = useState("");
  const [vehicleModel, setVehicleModel] = useState("TRX-4 / SCX10");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // Modül admin panelden kapatılmışsa widget hiç görünmez
  if (!isModuleActive("ai_crawler_doctor")) {
    return null;
  }

  const handleDiagnose = async (queryText?: string) => {
    const text = queryText || symptomInput;
    if (!text.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/modules/ai-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptom: text.trim(),
          vehicleModel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          diagnosis: data.diagnosis,
          immediateChecks: data.immediateChecks || [],
          recommendedFixes: data.recommendedFixes || [],
          recommendedProducts: data.recommendedProducts || [],
        });
      }
    } catch {
      // Hata durumunda yerel fallback
      setResult({
        diagnosis: "Aktarma organlarında sürtünme veya merkezkaç dengesizliği tespit edildi.",
        immediateChecks: ["Pinyon ve spur dişli boşluğunu kontrol edin.", "Tekerlek somunlarının aşırı sıkılmadığından emin olun."],
        recommendedFixes: ["Pirinç aks ağırlıkları ile ağırlık merkezini düşürün.", "Gres yağlamasını tazeleyin."],
        recommendedProducts: ["CNC Pirinç Aks Kiti", "TorkMaster Fırçasız Motor"],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Yüzen Başlatıcı Buton (Floating Trigger) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#121722] hover:bg-[#1A2130] text-amber-400 border border-amber-500/50 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.6)] group transition-all duration-300 hover:scale-105"
          aria-label="RC Crawler Arıza Teşhis Doktoru"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
          </span>
          <Stethoscope className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white hidden sm:inline">
            Crawler Doctor AI
          </span>
        </button>
      )}

      {/* Doktor Teşhis Penceresi (Modal / Drawer) */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[460px] max-h-[85vh] bg-[#0E121B] border border-[#222B3D] rounded-lg shadow-2xl flex flex-col overflow-hidden text-stone-200 animate-in slide-in-from-bottom-5">
          {/* Başlık Çubuğu */}
          <div className="bg-[#141926] px-4 py-3 border-b border-[#222B3D] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  CIHANPOL CRAWLER DOCTOR AI
                  <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-mono font-black">
                    v2.4
                  </span>
                </h4>
                <p className="text-[10px] text-stone-400 font-mono">
                  Mekanik & Elektronik Arıza Teşhis Asistanı
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* İçerik Alanı */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
            {/* Araç Modeli Seçimi */}
            <div>
              <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Araç Platformu:</span>
              <div className="flex gap-2">
                {["TRX-4 Platform", "Axial SCX10", "LCG Tube Pro", "1/24 Mini"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setVehicleModel(m)}
                    className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                      vehicleModel === m
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                        : "bg-[#141824] border-[#222B3D] text-stone-400"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Sık Karşılaşılan Arızalar (Hazır Butonlar) */}
            <div>
              <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1.5">Hızlı Belirti Seçin:</span>
              <div className="space-y-1.5">
                {PRESET_ISSUES.map((issue) => (
                  <button
                    key={issue}
                    onClick={() => {
                      setSymptomInput(issue);
                      handleDiagnose(issue);
                    }}
                    className="w-full text-left p-2 rounded bg-[#141824] hover:bg-[#1A2234] border border-[#222B3D] hover:border-amber-500/40 text-[11px] text-stone-300 transition-colors flex items-center justify-between group"
                  >
                    <span>{issue}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Teşhis Sonucu Gösterimi */}
            {isLoading && (
              <div className="p-6 text-center space-y-2 bg-[#121622] rounded border border-[#202738]">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-amber-300">Crawler mekanik veritabanı taranıyor...</p>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-3 p-4 rounded bg-[#131926] border border-amber-500/30 font-mono animate-in fade-in">
                {/* Teşhis Başlığı */}
                <div className="flex items-start gap-2">
                  <Wrench className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider">Mühendis Teşhisi</h5>
                    <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">{result.diagnosis}</p>
                  </div>
                </div>

                {/* Acil Kontrol Listesi */}
                {result.immediateChecks.length > 0 && (
                  <div className="pt-2 border-t border-[#1F273A]">
                    <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">
                      Önce Bunları Kontrol Edin:
                    </span>
                    <ul className="space-y-1 text-[11px] text-stone-300">
                      {result.immediateChecks.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Çözüm Yolu */}
                {result.recommendedFixes.length > 0 && (
                  <div className="pt-2 border-t border-[#1F273A]">
                    <span className="text-[10px] text-blue-400 font-bold uppercase block mb-1">
                      Önerilen Mekanik Çözüm:
                    </span>
                    <ul className="space-y-1 text-[11px] text-stone-300">
                      {result.recommendedFixes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400">▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Parça Tavsiyeleri */}
                {result.recommendedProducts.length > 0 && (
                  <div className="pt-2 border-t border-[#1F273A]">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1.5">
                      Gerekli Yükseltme Parçaları:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.recommendedProducts.map((p, idx) => (
                        <Link
                          key={idx}
                          href="/#products"
                          onClick={() => setIsOpen(false)}
                          className="px-2 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-300 rounded text-[10px] hover:bg-amber-500/20 transition-colors"
                        >
                          {p} →
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Soru Giriş Çubuğu */}
          <div className="p-3 bg-[#141926] border-t border-[#222B3D]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDiagnose();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="Crawler'ınızdaki sorunu tarif edin..."
                className="flex-1 bg-[#0A0D14] border border-[#242E42] text-xs text-white placeholder-stone-500 rounded px-3 py-2 outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="submit"
                disabled={isLoading || !symptomInput.trim()}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded font-bold transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
