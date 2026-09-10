"use client";

import React, { useState } from "react";
import { Building2, Users, CheckCircle2, ShieldAlert, Send, ArrowRight, MessageCircle } from "lucide-react";
import { useModules } from "@/lib/useModules";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function B2BQuotePage() {
  const { isModuleActive } = useModules();
  const { storeSettings } = useCart();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    phone: "",
    email: "",
    vehicleCount: 3,
    targetBudget: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isModuleActive("b2b_quotes")) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center max-w-md bg-[#11141D] p-8 border border-[#1E2536] rounded">
          <Building2 className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">B2B & Kulüp Masası Şu Anda Kapalıdır</h2>
          <p className="text-xs text-stone-400 mt-2">Bu modül yönetici tarafından geçici olarak devre dışı bırakılmıştır.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/modules/b2b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactName: formData.contactName,
          phone: formData.phone,
          email: formData.email,
          vehicleCount: Number(formData.vehicleCount),
          targetBudget: formData.targetBudget ? Number(formData.targetBudget) : null,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "Talep gönderilemedi.");
      }
    } catch {
      setErrorMessage("Bağlantı hatası oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Üst Başlık */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Kurumsal & Kulüp Masası</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight uppercase">
            Toplu B2B, Takım & Kulüp Teklif Masası
          </h1>
          <p className="text-sm text-stone-400 mt-3 leading-relaxed">
            RC Crawler model kulüpleri, yarışma ekipleri ve kurumsal etkinlik filoları için özel iskonto basamakları, toplu yedek parça tedariği ve anahtar teslim şasi montajı.
          </p>
        </div>

        {/* Avantajlar Şeridi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#121622] border border-[#202738] p-4 rounded text-center">
            <span className="text-2xl font-mono font-black text-amber-400">%15 - %35</span>
            <h4 className="text-xs font-mono font-bold text-white uppercase mt-1">Kademeli İskonto</h4>
            <p className="text-[11px] text-stone-400 mt-1">3 araç ve üzeri toplu alımlarda doğrudan distribütör fiyatlandırması.</p>
          </div>
          <div className="bg-[#121622] border border-[#202738] p-4 rounded text-center">
            <span className="text-2xl font-mono font-black text-emerald-400">Öncelikli Stok</span>
            <h4 className="text-xs font-mono font-bold text-white uppercase mt-1">Garantili Yedek Parça</h4>
            <p className="text-[11px] text-stone-400 mt-1">Yarışma sezonu boyunca kritik aks dişlileri ve servolarda anında temin.</p>
          </div>
          <div className="bg-[#121622] border border-[#202738] p-4 rounded text-center">
            <span className="text-2xl font-mono font-black text-blue-400">Atölye Setup</span>
            <h4 className="text-xs font-mono font-bold text-white uppercase mt-1">Özel Usta Kalibrasyonu</h4>
            <p className="text-[11px] text-stone-400 mt-1">Her aracın diferansiyel greslemesi, CoG dengesi ve şok yağı test edilir.</p>
          </div>
        </div>

        {/* Teklif Formu */}
        <div className="bg-[#10141E] border border-[#1E2536] rounded-lg p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
          {submitted ? (
            <div className="text-center py-8 space-y-4 font-mono">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Teklif Talebiniz Başarıyla Alındı</h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                Teknik satış mühendisimiz başvurunuzu inceleyerek 24 saat içinde kurumsal teklif dosyanızı ve iskonto oranınızı hazırlayacaktır.
              </p>
              <div className="pt-4">
                <a
                  href={getWhatsAppUrl(
                    storeSettings?.whatsappPhone,
                    `Merhaba, B2B teklif talebinde bulundum. Firma/Kulüp: ${formData.companyName}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-black text-xs font-bold uppercase rounded hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp ile Hızlı Takip Et</span>
                </a>
              </div>
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
                  <label className="block text-stone-300 mb-1.5">Kulüp / Takım / Şirket Adı *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Örn: Marmara RC Crawlers Team"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1.5">Yetkili Adı Soyadı *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Örn: Serdar Yılmaz"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5">Telefon / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="05XX XXX XX XX"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1.5">E-Posta Adresi *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yetkili@kulup.com"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5">Hedeflenen Araç / Şasi Adedi</label>
                  <input
                    type="number"
                    min={2}
                    max={100}
                    value={formData.vehicleCount}
                    onChange={(e) => setFormData({ ...formData, vehicleCount: Number(e.target.value) })}
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1.5">Hedef Toplam Bütçe (₺ Opsiyonel)</label>
                  <input
                    type="number"
                    value={formData.targetBudget}
                    onChange={(e) => setFormData({ ...formData, targetBudget: e.target.value })}
                    placeholder="Örn: 85000"
                    className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1.5">Talep Edilen Parça Listesi veya Proje Notları *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="İstenen şasiler, fırçasız güç kiti, pirinç portal donanımları veya özel montaj istekleri..."
                  className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2.5 outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Gönderiliyor..." : "Toplu Teklif Dosyası İste"}</span>
              </button>
            </form>
          )}
        </div>
    </div>
  );
}
