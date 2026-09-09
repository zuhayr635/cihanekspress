"use client";

import React, { useState } from "react";
import { Printer, CheckCircle2, ShieldAlert, Upload, Cpu, Sparkles, Send } from "lucide-react";
import { useModules } from "@/lib/useModules";

export default function Print3dPage() {
  const { isModuleActive } = useModules();
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    projectTitle: "",
    fileUrl: "",
    scale: "1/10",
    material: "PETG",
    color: "Mat Siyah",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isModuleActive("print3d_demand")) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center max-w-md bg-[#11141D] p-8 border border-[#1E2536] rounded">
          <Printer className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">3D Baskı Üretim Masası Kapalıdır</h2>
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
      const res = await fetch("/api/modules/print3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "3D baskı talebi gönderilemedi.");
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
            <Printer className="w-3.5 h-3.5" />
            <span>Hızlı Prototipleme & Scale Parça Laboratuvarı</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight uppercase">
            3D Baskı İsteğe Bağlı Parça Üretimi
          </h1>
          <p className="text-sm text-stone-400 mt-3 leading-relaxed">
            Crawlerınız için bulamadığınız şnorkel, scale vinç, roll-cage aksesuarları, pil kızakları veya LCG şasi parçalarınızı endüstriyel PETG, Karbon Fiber ve TPU ile 0.1mm toleransta üretiyoruz.
          </p>
        </div>

        {/* Malzeme Rehberi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 font-mono text-xs">
          <div className="bg-[#10141E] border border-[#1E2536] p-4 rounded">
            <span className="text-amber-400 font-bold text-sm block">Karbon Fiber PETG</span>
            <p className="text-stone-400 text-[11px] mt-1">Esnemeyen yüksek mukavemet. Şasi kirişleri ve servo braketleri için ideal.</p>
          </div>
          <div className="bg-[#10141E] border border-[#1E2536] p-4 rounded">
            <span className="text-emerald-400 font-bold text-sm block">TPU 95A Esnek Kauçuk</span>
            <p className="text-stone-400 text-[11px] mt-1">Darbe emici kırılmaz malzeme. Yan aynalar, çamurluklar ve tamponlar için.</p>
          </div>
          <div className="bg-[#10141E] border border-[#1E2536] p-4 rounded">
            <span className="text-blue-400 font-bold text-sm block">Yüksek Detaylı Reçine</span>
            <p className="text-stone-400 text-[11px] mt-1">Katman izi olmayan 8K mikron hassasiyet. Kokpit, şoför figürü ve göstergeler.</p>
          </div>
        </div>

        {/* Sipariş Formu */}
        <div className="bg-[#10141E] border border-[#1E2536] rounded-lg p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
          {submitted ? (
            <div className="text-center py-8 space-y-4 font-mono">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">3D Baskı Talebiniz Alındı</h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                Dosyanız dilimleme yazılımımızda incelenerek baskı süresi ve malzeme maliyeti hesaplanacak; WhatsApp üzerinden fiyat ve teslim tarihi iletilecektir.
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
                    placeholder="Örn: Ahmet Demir"
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
                  <label className="block text-stone-300 mb-1.5">E-Posta Adresi *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ahmet@posta.com"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1.5">Parça / Proje Adı *</label>
                  <input
                    type="text"
                    required
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    placeholder="Örn: TRX-4 Low-CG Batarya Tepsisi"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5">Model Ölçeği</label>
                  <select
                    value={formData.scale}
                    onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  >
                    <option value="1/10">1/10 Standard</option>
                    <option value="1/24">1/24 Micro</option>
                    <option value="1/18">1/18 Mini</option>
                    <option value="OZEL">Özel Ölçek / Birebir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1.5">Filament / Malzeme</label>
                  <select
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  >
                    <option value="PETG">Endüstriyel Dayanıklı PETG</option>
                    <option value="KARBON_FIBER">Karbon Fiber Katkılı PETG</option>
                    <option value="TPU">TPU 95A Esnek Darbe Emici</option>
                    <option value="REÇINE">8K Ultra Detaylı Sert Reçine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1.5">Renk Tercihi</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Örn: Mat Siyah"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1.5">STL / CAD Dosya Bağlantısı (Thingiverse, Printables, Drive)</label>
                <input
                  type="url"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://www.thingiverse.com/thing:... veya Drive linki"
                  className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1.5">Baskı Notları & Duvar Kalınlığı İstekleri</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Örn: %100 dolulukta basılsın, vida delikleri M3 kılavuz çekilecek..."
                  className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Gönderiliyor..." : "3D Baskı Fiyat Teklifi İste"}</span>
              </button>
            </form>
          )}
        </div>
    </div>
  );
}
