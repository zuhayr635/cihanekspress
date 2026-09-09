"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Lock, Unlock, KeyRound, Menu, X, ShieldAlert, Cpu } from "lucide-react";

import VehicleSelector from "@/components/VehicleSelector";

export default function Header() {
  const { itemCount, setIsCartOpen, vipSession, storeSettings } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // VIP Canlı Geri Sayım Sayacı (24 Saatlik Geri Sayım)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 48,
    seconds: 15,
  });

  React.useEffect(() => {
    if (!vipSession.isVip) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [vipSession.isVip]);

  const isSalesAllowed =
    storeSettings?.storeMode === "PUBLIC_SALE" ||
    (storeSettings?.storeMode === "INVITE_ONLY" && vipSession.isVip) ||
    vipSession.isVip;

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsVerifying(true);
    setTokenError("");

    try {
      const res = await fetch("/api/vip/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        setTokenError(data.error || "Geçersiz veya daha önce kullanılmış davetiye kodu.");
      }
    } catch {
      setTokenError("Bağlantı hatası oluştu.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      {/* Üst Bilgi Barı (Industrial Top Bar) */}
      <div className="bg-[#0B0E14] text-[#A0AEC0] text-[11px] tracking-widest uppercase py-2 px-4 border-b border-[#1E2535]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {vipSession.isVip ? (
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
                <span className="flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5" />
                  VIP Kulüp Erişimi
                </span>
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                <span className="text-white bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 rounded-xs">
                  ⏱️ Kalan: {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </span>
                {vipSession.discountPercent ? (
                  <span className="text-black bg-amber-400 px-1.5 py-0.5 rounded-xs font-black">
                    -%{vipSession.discountPercent} İndirim
                  </span>
                ) : null}
              </div>
            ) : storeSettings?.storeMode === "PUBLIC_SALE" ? (
              <span className="text-stone-300">Resmi Parça & Araç Satış Mağazası</span>
            ) : (
              <span className="flex items-center gap-1.5 text-stone-400 font-medium font-mono text-[10px]">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Özel Vitrin: Parça Satışı Onaylı VIP Davetiye ile Yapılmaktadır
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-stone-400 text-[10px] font-mono">
            {/* Garaj Araç Seçicisi */}
            <VehicleSelector />

            <span className="w-1 h-1 rounded-full bg-stone-700 hidden md:block" />
            <Link href="/order-tracking" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <span>Sipariş Takibi</span>
            </Link>

            <span className="w-1 h-1 rounded-full bg-stone-700 hidden md:block" />
            <Link href="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-500" /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Ana Header */}
      <header className="sticky top-0 z-40 bg-[#14171E]/95 backdrop-blur-md border-b border-[#232A36] text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-400 hover:text-white focus:outline-none"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Sol Navigasyon Linkleri (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-[12px] tracking-[0.15em] uppercase font-semibold text-stone-300">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Araçlar & Parçalar
            </Link>
            <Link href="/#rig-builder" className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Kurulum Sihirbazı
            </Link>
            <Link href="/#about" className="hover:text-amber-400 transition-colors">
              Özel Yapım Garajı
            </Link>
            <Link href="/#contact" className="hover:text-amber-400 transition-colors">
              Teknik Destek
            </Link>
          </nav>

          {/* Logo (RC Crawler Rugged Industrial Brand) */}
          <div className="text-center">
            <Link href="/" className="inline-block group">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-amber-500 rotate-45" />
                <h1 className="font-mono text-xl sm:text-2xl tracking-[0.2em] font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase">
                  CIHANPOL<span className="text-amber-500 font-light">.RC</span>
                </h1>
                <span className="w-2 h-2 rounded-xs bg-amber-500 rotate-45" />
              </div>
              <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-stone-400 -mt-0.5">
                CRAWLER & SCALE PERFORMANCE LAB
              </p>
            </Link>
          </div>

          {/* Sağ Aksiyonlar */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Davetiye Kodu Giriş Butonu */}
            {!vipSession.isVip && storeSettings?.storeMode !== "PUBLIC_SALE" && (
              <button
                onClick={() => setVipModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase border border-amber-500/40 rounded-sm text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 transition-all"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                Davetiye Kodu
              </button>
            )}

            {/* Sepet Butonu (Yalnızca Satışa İzin Verildiğinde Görünür) */}
            {isSalesAllowed ? (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-white hover:text-amber-400 rounded-sm border border-stone-700 hover:border-amber-400 transition-all group flex items-center gap-2"
                aria-label="Sepeti Aç"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                <span className="hidden sm:inline text-xs tracking-wider uppercase font-semibold">Sepet</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-in zoom-in">
                    {itemCount}
                  </span>
                )}
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] tracking-wider uppercase text-stone-400 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-sm">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Özel Vitrin
              </div>
            )}
          </div>
        </div>

        {/* Mobil Açılır Menü */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-800 bg-[#14171E] px-6 py-6 space-y-4 text-[13px] uppercase tracking-wider font-semibold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-stone-200 hover:text-amber-400"
            >
              Araçlar & Parçalar
            </Link>
            <Link
              href="/#rig-builder"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-amber-400 font-bold hover:text-amber-300"
            >
              ★ Kurulum Sihirbazı (Rig Builder)
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-stone-200 hover:text-amber-400"
            >
              Özel Yapım Garajı
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-stone-200 hover:text-amber-400"
            >
              Teknik Destek
            </Link>
            {!vipSession.isVip && storeSettings?.storeMode !== "PUBLIC_SALE" && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setVipModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-wider font-bold bg-amber-500 text-black rounded-sm"
              >
                <KeyRound className="w-4 h-4" />
                Davetiye Kodu Gir
              </button>
            )}
            <div className="pt-2 border-t border-stone-800">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-stone-400 text-xs flex items-center gap-1 hover:text-white"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Yönetici Paneli
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Davetiye Kodu Modal */}
      {vipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181C24] border border-stone-700 w-full max-w-md p-8 rounded-sm shadow-2xl relative text-white">
            <button
              onClick={() => setVipModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-900 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <KeyRound className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-mono text-2xl text-white font-bold tracking-tight uppercase">
                RC Kulüp VIP Davetiyesi
              </h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                Yöneticinin size tahsis ettiği tek kullanımlık kodu girerek özel crawler araçlarının ve performans yükseltme parçalarının fiyatlarını ve sipariş yetkisini açabilirsiniz.
              </p>
            </div>

            <form onSubmit={handleVerifyToken} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1.5">
                  Davetiye Kodu (Token)
                </label>
                <input
                  type="text"
                  placeholder="Örn: vip-crawler-2026"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-sm text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {tokenError && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-sm">
                  {tokenError}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-amber-500 text-black text-xs uppercase tracking-widest font-bold rounded-sm hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {isVerifying ? "Doğrulanıyor..." : "VIP Girişini Başlat"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
