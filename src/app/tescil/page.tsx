"use client";

import React, { useState } from "react";
import { Award, Search, ShieldCheck, CheckCircle2, AlertCircle, FileCheck, QrCode } from "lucide-react";
import { useModules } from "@/lib/useModules";

interface CertifiedChassisData {
  serialNumber: string;
  ownerName: string;
  buildDate: string;
  builderSignature: string;
  specsJson: string;
  isVerified: boolean;
}

export default function ChassisPlaquePage() {
  const { isModuleActive } = useModules();
  const [serialInput, setSerialInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chassis, setChassis] = useState<CertifiedChassisData | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isModuleActive("serial_plaque")) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center max-w-md bg-[#11141D] p-8 border border-[#1E2536] rounded">
          <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Şasi Tescil Sistemi Kapalıdır</h2>
          <p className="text-xs text-stone-400 mt-2">Bu modül yönetici tarafından geçici olarak durdurulmuştur.</p>
        </div>
      </div>
    );
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;

    setIsLoading(true);
    setChassis(null);
    setErrorMessage("");
    setSearched(true);

    try {
      const res = await fetch(`/api/modules/plaque?serial=${encodeURIComponent(serialInput.trim())}`);
      const data = await res.json();
      if (data.success && data.chassis) {
        setChassis(data.chassis);
      } else {
        setErrorMessage(data.error || "Bu seri numarasına ait kayıtlı tescil bulunamadı.");
      }
    } catch {
      setErrorMessage("Doğrulama servisine bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  let parsedSpecs: Record<string, string> = {};
  if (chassis?.specsJson) {
    try {
      parsedSpecs = JSON.parse(chassis.specsJson);
    } catch {
      parsedSpecs = {};
    }
  }

  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Sertifikalı Zanaatkar Sicili</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight uppercase">
            Sınırlı Üretim Plaka & Tescil Doğrulama
          </h1>
          <p className="text-sm text-stone-400 mt-3 leading-relaxed">
            CIHANPOL atölyesinden çıkan her özel yapım (custom build) crawler, benzersiz bir lazer kazıma şasi plakasına ve dijital doğum sertifikasına sahiptir.
          </p>
        </div>

        {/* Doğrulama Sorgu Kutusu */}
        <div className="bg-[#10141E] border border-[#1E2536] rounded-lg p-6 max-w-xl mx-auto shadow-2xl mb-12">
          <form onSubmit={handleVerify} className="space-y-3 font-mono">
            <label className="block text-xs text-stone-300 font-bold uppercase tracking-wider">
              Şasi Seri Numarasını Girin:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                placeholder="Örn: CHP-CRAWLER-001 veya CHP-CRAWLER-007"
                className="flex-1 bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400 text-xs uppercase tracking-wider font-bold"
              />
              <button
                type="submit"
                disabled={isLoading || !serialInput.trim()}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold uppercase text-xs rounded flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>{isLoading ? "Sorgulanıyor..." : "Doğrula"}</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
              <span>Deneme Seri Noları: <button type="button" onClick={() => setSerialInput("CHP-CRAWLER-001")} className="text-amber-400 underline">CHP-CRAWLER-001</button> veya <button type="button" onClick={() => setSerialInput("CHP-CRAWLER-007")} className="text-amber-400 underline">CHP-CRAWLER-007</button></span>
            </div>
          </form>
        </div>

        {/* Sonuç Alanı */}
        {searched && (
          <div className="max-w-2xl mx-auto">
            {chassis ? (
              <div className="bg-gradient-to-b from-[#161B26] to-[#0D1017] border-2 border-amber-500/70 rounded-lg p-8 shadow-[0_0_35px_rgba(245,158,11,0.25)] relative overflow-hidden font-mono">
                {/* Lazer Plaka Metal Dokusu Efekti */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #F59E0B 25%, transparent 25%, transparent 75%, #F59E0B 75%, #F59E0B), linear-gradient(45deg, #F59E0B 25%, transparent 25%, transparent 75%, #F59E0B 75%, #F59E0B)",
                    backgroundSize: "8px 8px",
                  }}
                />

                {/* Plaka Üstü */}
                <div className="flex items-start justify-between pb-6 border-b border-amber-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500/20 border border-amber-500 rounded flex items-center justify-center text-amber-400">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                        RESMİ TESÇİL PLAKASI
                      </span>
                      <h3 className="text-2xl font-black text-white tracking-wider uppercase">
                        {chassis.serialNumber}
                      </h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500 text-emerald-400 text-xs font-bold rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ORİJİNAL ONAYLI
                  </span>
                </div>

                {/* Sertifika Detayları */}
                <div className="grid grid-cols-2 gap-4 py-6 border-b border-amber-500/30 text-xs">
                  <div>
                    <span className="text-stone-400 uppercase text-[10px] block">Kayıtlı Sahibi:</span>
                    <span className="text-white font-bold text-sm block mt-0.5">{chassis.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase text-[10px] block">İnşa / Teslim Tarihi:</span>
                    <span className="text-amber-300 font-bold text-sm block mt-0.5">{chassis.buildDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 uppercase text-[10px] block">Baş Usta İmzası:</span>
                    <span className="text-stone-200 font-bold text-xs tracking-wider block mt-0.5">
                      ✍️ {chassis.builderSignature}
                    </span>
                  </div>
                </div>

                {/* Özel Donanım Reçetesi */}
                {Object.keys(parsedSpecs).length > 0 && (
                  <div className="pt-6">
                    <span className="text-amber-400 uppercase text-[10px] font-bold tracking-wider block mb-3">
                      Atölye Kalibrasyon Donanım Özellikleri:
                    </span>
                    <div className="space-y-2 text-xs">
                      {Object.entries(parsedSpecs).map(([key, val]) => (
                        <div key={key} className="flex justify-between p-2 rounded bg-[#0A0D14]/80 border border-[#222B3D]">
                          <span className="text-stone-400 capitalize">{key}:</span>
                          <span className="text-white font-bold">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#10141E] border border-red-500/30 rounded-lg space-y-3 font-mono">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                <h4 className="text-white font-bold text-base">Seri Numarası Eşleşmedi</h4>
                <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                  {errorMessage || "Girdiğiniz seri numarasına ait bir CIHANPOL atölye tescili bulunamadı. Lütfen plakayı kontrol edin."}
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
