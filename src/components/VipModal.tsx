"use client";

import React, { useState } from "react";
import { KeyRound, X, CheckCircle2, Shield, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function VipModal() {
  const { isVipModalOpen, setIsVipModalOpen, vipSession, refreshVipStatus, storeSettings } = useCart();
  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isVipModalOpen) return null;

  const whatsappUrl = getWhatsAppUrl(
    storeSettings?.whatsappPhone,
    "Merhaba Cihan Usta, cihanekspress.com için VIP davetiye kodu talep ediyorum."
  );

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsVerifying(true);
    setTokenError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/vip/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTokenError(data.error || "Geçersiz veya süresi dolmuş davetiye kodu.");
      } else {
        setSuccessMessage(`Davetiye onaylandı! ${data.discountPercent ? `%${data.discountPercent} indiriminiz tanımlandı.` : ""}`);
        await refreshVipStatus();
        setTimeout(() => {
          setIsVipModalOpen(false);
          setTokenInput("");
          setSuccessMessage("");
        }, 1200);
      }
    } catch {
      setTokenError("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl relative text-slate-900">
        
        {/* Kapat Butonu */}
        <button
          onClick={() => {
            setIsVipModalOpen(false);
            setTokenError("");
            setSuccessMessage("");
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Başlık ve İkon */}
        <div className="text-center space-y-2.5 mb-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F27A1A] shadow-inner">
            <KeyRound className="w-7 h-7 stroke-[1.8]" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider rounded-full">
            <Shield className="w-3 h-3" />
            <span>Kulüp Davetiyeli Katalog Sistemi</span>
          </div>

          <h3 className="text-xl sm:text-2xl text-slate-950 font-black tracking-tight uppercase">
            VIP Fiyat & Sipariş Erişimi
          </h3>
          
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Sitemiz halka açık perakende satış yapmamaktadır. Özel rock crawler şasilerini, pirinç parçaları ve fiyatları görüntüleyebilmek için lütfen <strong>VIP Davetiye Kodunuzu</strong> giriniz.
          </p>
        </div>

        {/* Durum veya Form */}
        {vipSession.isVip ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1.5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-emerald-900">VIP Kulüp Üyeliğiniz Aktif!</p>
              <p className="text-xs text-emerald-700">
                Tüm ürün fiyatları ve sipariş yetkisi hesabınıza tanımlanmıştır.
                {vipSession.discountPercent ? ` (%${vipSession.discountPercent} Kulüp İndirimi)` : ""}
              </p>
            </div>
            <button
              onClick={() => setIsVipModalOpen(false)}
              className="w-full py-3 bg-[#F27A1A] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#E06A0A] transition-colors shadow-sm"
            >
              Kataloğu Fiyatlarla İncelemeye Devam Et
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                VIP Davetiye Kodu (Token)
              </label>
              <input
                type="text"
                placeholder="Örn: vip-crawler-2026"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#F27A1A] focus:ring-2 focus:ring-[#F27A1A]/20 font-mono tracking-wider"
              />
            </div>

            {tokenError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg animate-in shake">
                {tokenError}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white text-xs uppercase tracking-wider font-extrabold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.99]"
            >
              {isVerifying ? "Doğrulanıyor..." : "Fiyatları & Sipariş Yetkisini Aç"}
            </button>

            <div className="pt-2 text-center border-t border-slate-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                <span>Davetiye kodunuz yok mu? WhatsApp&apos;tan talep edin ↗</span>
              </a>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
