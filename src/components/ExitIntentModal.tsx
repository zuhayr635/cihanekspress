"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { X, Sparkles, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

export default function ExitIntentModal() {
  const { itemCount, applyCoupon, setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    // Sepet boşsa veya daha önce kapatıldıysa tetikleme
    if (itemCount === 0) return;

    try {
      if (sessionStorage.getItem("cihan_exit_intent_dismissed")) {
        return;
      }
    } catch {
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Fare pencerenin üst kısmından dışarı çıktığında tetikle
      if (e.clientY <= 15) {
        setIsOpen(true);
        try {
          sessionStorage.setItem("cihan_exit_intent_dismissed", "true");
        } catch {}
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [itemCount]);

  if (!isOpen || itemCount === 0) return null;

  const handleApplyCoupon = async () => {
    setIsApplying(true);
    await applyCoupon("SEPET5");
    setIsApplying(false);
    setIsOpen(false);
    setIsCartOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border-2 border-orange-500 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Top Accent Ribbon */}
        <div className="bg-[#F27A1A] py-2 px-4 text-center text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Atölye Özel Fırsatı — Gitmeden Önce Yakala!</span>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white rounded-full transition-colors z-20 cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-5 text-center">
          {/* Badge Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-[#F27A1A] border-2 border-orange-300">
            <ShoppingBag className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono uppercase">
              Sepetindeki Parçaları Unutma!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              RC Crawler projen için seçtiğin parçalar sepette seni bekliyor.
              Şimdi siparişini oluştur, sepetine anında <strong>%5 indirim</strong> hediye edelim!
            </p>
          </div>

          {/* Coupon Code Presentation Box */}
          <div className="bg-orange-50 border-2 border-dashed border-[#F27A1A] rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono tracking-wider text-orange-800 font-bold block">
                Özel İndirim Kodu
              </span>
              <span className="text-2xl font-black font-mono tracking-wider text-slate-950">
                SEPET5
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-sm">
                %5 ANINDA İNDİRİM
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleApplyCoupon}
              disabled={isApplying}
              className="w-full py-3.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white font-mono font-black text-sm uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isApplying ? "Kupon Uygulanıyor..." : "Kuponu Uygula & Sepetime Git"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="text-xs font-mono text-slate-400 hover:text-slate-600 underline transition-colors cursor-pointer"
            >
              Teşekkürler, indirimi kaçırmak istiyorum
            </button>
          </div>

          {/* Trust Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Atölye garantisi & aynı gün kargo desteği</span>
          </div>
        </div>
      </div>
    </div>
  );
}
