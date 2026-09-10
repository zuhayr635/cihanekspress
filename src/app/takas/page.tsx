"use client";

import React, { useState } from "react";
import { RefreshCw, CheckCircle2, ShieldAlert, Upload, ArrowRight, Truck } from "lucide-react";
import { useModules } from "@/lib/useModules";

export default function TradeInPage() {
  const { isModuleActive } = useModules();
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    currentChassis: "Traxxas TRX-4 (Standart)",
    condition: "TEMIZ",
    expectedPrice: "",
    desiredProduct: "",
    photoUrlsJson: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isModuleActive("trade_in")) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center max-w-md bg-[#11141D] p-8 border border-[#1E2536] rounded">
          <RefreshCw className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Takas & Değerleme Programı Kapalıdır</h2>
          <p className="text-xs text-stone-400 mt-2">Bu modül yönetici tarafından geçici olarak durdurulmuştur.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/modules/trade-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          phone: formData.phone,
          currentChassis: formData.currentChassis,
          condition: formData.condition,
          expectedPrice: formData.expectedPrice ? Number(formData.expectedPrice) : null,
          desiredProduct: formData.desiredProduct,
          photoUrlsJson: formData.photoUrlsJson ? JSON.stringify([formData.photoUrlsJson]) : "[]",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "Takas başvurusu alınamadı.");
      }
    } catch {
      setErrorMessage("Bağlantı hatası oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atölye Ekspertiz Programı</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight uppercase">
            Eski Şasini Getir, Yenisini Al (Takas)
          </h1>
          <p className="text-sm text-stone-400 mt-3 leading-relaxed">
            Mevcut RTR aracınızı veya rolling şasinizi CIHANPOL atölye ekspertizine gönderin; değerleme tutarını yeni nesil LCG şasi ve fırçasız yükseltmelerde anında bütçe mahsubu olarak kullanın.
          </p>
        </div>

        {/* 3 Adımda Takas Süreci */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#10141E] border border-[#1E2536] p-5 rounded font-mono">
            <span className="text-amber-400 font-black text-xl">01</span>
            <h4 className="text-white font-bold text-xs uppercase mt-2">Form & Görsel Yükleyin</h4>
            <p className="text-stone-400 text-[11px] mt-1">Aracınızın şasi, aks ve elektronik durumunu özetleyin.</p>
          </div>
          <div className="bg-[#10141E] border border-[#1E2536] p-5 rounded font-mono">
            <span className="text-amber-400 font-black text-xl">02</span>
            <h4 className="text-white font-bold text-xs uppercase mt-2">24 Saatte Ekspertiz</h4>
            <p className="text-stone-400 text-[11px] mt-1">Usta mekanikerlerimiz şasinize piyasa üstü takas teklifi biçer.</p>
          </div>
          <div className="bg-[#10141E] border border-[#1E2536] p-5 rounded font-mono">
            <span className="text-amber-400 font-black text-xl">03</span>
            <h4 className="text-white font-bold text-xs uppercase mt-2">Yeni Canavarınızı Alın</h4>
            <p className="text-stone-400 text-[11px] mt-1">Teklif tutarı doğrudan atölye siparişinizden mahsup edilir.</p>
          </div>
        </div>

        {/* Başvuru Formu */}
        <div className="bg-[#10141E] border border-[#1E2536] rounded-lg p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
          {submitted ? (
            <div className="text-center py-8 space-y-4 font-mono">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Ekspertiz Talebiniz Kaydedildi</h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                Şasi bilgileriniz atölye masamıza iletildi. Mekanik uzmanımız whatsapp üzerinden sizinle iletişime geçerek teklif tutarını ve ücretsiz kargo kodunuzu iletecektir.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
              {errorMessage && (
                <div className="p-3 bg-red-950/60 border border-red-500 text-red-300 rounded text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Örn: Burak Kaya"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1.5">Telefon (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="05XX XXX XX XX"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5">Mevcut Şasi / Araç Modeli *</label>
                  <input
                    type="text"
                    required
                    value={formData.currentChassis}
                    onChange={(e) => setFormData({ ...formData, currentChassis: e.target.value })}
                    placeholder="Örn: Traxxas TRX-4 Defender / SCX10 II"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1.5">Mevcut Kondisyon</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  >
                    <option value="TEMIZ">Temiz / Az Kullanılmış (Elektronikli)</option>
                    <option value="ORTA">Orta Seviye Çizikli (Aktif Sürülmüş)</option>
                    <option value="YIPRANMIS">Ağır Arazi Yıpranması / Bakım İsteyen</option>
                    <option value="SADECE_SASI">Sadece Şasi (Elektroniksiz Rolling)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5">Beklediğiniz Takas Değeri (₺ Opsiyonel)</label>
                  <input
                    type="number"
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    placeholder="Örn: 12500"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1.5">Almak İstediğiniz Yeni Şasi / Parça</label>
                  <input
                    type="text"
                    value={formData.desiredProduct}
                    onChange={(e) => setFormData({ ...formData, desiredProduct: e.target.value })}
                    placeholder="Örn: LCG Carbon Pro Kit + FOC Motor"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1.5">Araç Fotoğraf Bağlantısı (Drive / Hızlıresim vb.)</label>
                <input
                  type="url"
                  value={formData.photoUrlsJson}
                  onChange={(e) => setFormData({ ...formData, photoUrlsJson: e.target.value })}
                  placeholder="https://... (Fotoğraf linki varsa ekleyin)"
                  className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">Fotoğrafınız yoksa form sonrası WhatsApp üzerinden de iletebilirsiniz.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isSubmitting ? "Gönderiliyor..." : "Takas Değerleme Talebi Gönder"}</span>
              </button>
            </form>
          )}
        </div>
    </div>
  );
}
