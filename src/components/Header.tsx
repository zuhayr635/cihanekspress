"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useModules } from "@/lib/useModules";
import { ShoppingBag, Lock, Unlock, KeyRound, Menu, X, ShieldAlert, Cpu, BookOpen, Wrench, Sparkles, MapPin, Trophy } from "lucide-react";

import VehicleSelector from "@/components/VehicleSelector";

export default function Header() {
  const { itemCount, setIsCartOpen, vipSession, storeSettings } = useCart();
  const { isModuleActive } = useModules();
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
      {/* Üst Bilgi Barı (Daylight Titanium Telemetry Bar) */}
      <div className="bg-white text-slate-500 text-[10px] tracking-widest uppercase py-2 px-4 border-b border-slate-200 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 text-slate-700">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-900 font-bold tracking-wider">CİHAN LAB //</span>
            <span className="text-slate-500 hidden sm:inline font-normal">
              Özel Mekanik & CNC Hobi Kataloğu — Projeler Birebir Atölye İstişaresiyle Hazırlanır
            </span>
            <span className="text-slate-500 sm:hidden">Özel Atölye Çalışma Kataloğu</span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            {/* WhatsApp Doğrudan Usta Hattı */}
            <a
              href={`https://wa.me/${storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905551234567"}?text=Merhaba%20Cihan%20Usta,%20at%C3%B6lye%20projeleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>WhatsApp Danışma</span>
            </a>

            <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
            {/* Garaj Araç Seçicisi */}
            <VehicleSelector />

            <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
            <Link href="/rehber" className="hover:text-orange-600 transition-colors flex items-center gap-1 text-slate-600">
              <BookOpen className="w-3 h-3 text-orange-600" />
              <span>Rehber</span>
            </Link>

            <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
            <Link href="/order-tracking" className="hover:text-orange-600 transition-colors text-slate-600">
              <span>Talep Takibi</span>
            </Link>

            <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
            <Link href="/admin" className="hover:text-slate-900 transition-colors flex items-center gap-1 text-slate-400 hover:text-slate-700">
              <ShieldAlert className="w-3 h-3 text-slate-500" /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Ana Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-950 focus:outline-none"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Sol Navigasyon Linkleri (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs tracking-wide uppercase font-semibold text-slate-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Katalog
            </Link>
            <Link href="/#rig-builder" className="text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
              Rig Sihirbazı
            </Link>
            {(isModuleActive("cog_simulator") || isModuleActive("gear_calculator") || isModuleActive("exploded_cad") || isModuleActive("battery_wizard")) && (
              <Link href="/hesaplayici" className="hover:text-orange-600 transition-colors flex items-center gap-1 text-slate-600">
                <Wrench className="w-3.5 h-3.5 text-orange-600" />
                Hesaplayıcı
              </Link>
            )}
            {isModuleActive("bundle_deals") && (
              <Link href="/paketler" className="hover:text-orange-600 transition-colors flex items-center gap-1 text-slate-600">
                <Sparkles className="w-3 h-3 text-orange-600" />
                Paketler
              </Link>
            )}
            {isModuleActive("trail_map") && (
              <Link href="/parkurlar" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                Parkurlar
              </Link>
            )}
            {isModuleActive("rig_of_month") && (
              <Link href="/topluluk" className="hover:text-orange-600 transition-colors flex items-center gap-1">
                <Trophy className="w-3 h-3 text-orange-600" />
                Topluluk
              </Link>
            )}
          </nav>

          {/* Logo (Clean High-Tech Lab Brand) */}
          <div className="text-center">
            <Link href="/" className="inline-block group">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-xs bg-slate-950" />
                <h1 className="font-mono text-xl sm:text-2xl tracking-widest font-black text-slate-950 group-hover:text-orange-600 transition-colors uppercase">
                  CIHANPOL<span className="text-orange-600 font-light">.RC</span>
                </h1>
                <span className="w-2 h-2 rounded-xs bg-slate-950" />
              </div>
              <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-slate-400 mt-0.5">
                CRAWLER PROTOTYPING LAB
              </p>
            </Link>
          </div>

          {/* Sağ Aksiyonlar: WhatsApp İletişim + Talep Listesi Butonu */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905551234567"}?text=Merhaba%20Cihan%20Usta,%20%C3%B6zel%20crawler%20projeleri%20hakk%C4%B1nda%20dan%C4%B1%C5%9Fmak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-all shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>WhatsApp İstişare</span>
            </a>

            {/* Talep Listesi Butonu (Katalog Sepeti) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3.5 sm:px-4 py-2 text-slate-800 hover:text-slate-950 rounded-xs border border-slate-200 hover:border-slate-400 bg-white transition-all group flex items-center gap-2 font-mono shadow-xs"
              aria-label="Talep Listesini Aç"
            >
              <Wrench className="w-4 h-4 text-slate-700 stroke-[2]" />
              <span className="text-xs uppercase font-bold tracking-wider">Talep Masası</span>
              {itemCount > 0 && (
                <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded-xs font-black animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobil Açılır Menü */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-6 py-6 space-y-4 text-[13px] uppercase tracking-wider font-semibold text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-800 hover:text-orange-600"
            >
              Araçlar & Parçalar
            </Link>
            <Link
              href="/#rig-builder"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-orange-600 font-bold hover:text-orange-700"
            >
              ★ Kurulum Sihirbazı (Rig Builder)
            </Link>
            {(isModuleActive("cog_simulator") || isModuleActive("gear_calculator") || isModuleActive("exploded_cad") || isModuleActive("battery_wizard")) && (
              <Link
                href="/hesaplayici"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-orange-600"
              >
                🛠️ Teknik Hesaplayıcılar & CAD
              </Link>
            )}
            {isModuleActive("bundle_deals") && (
              <Link
                href="/paketler"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-orange-600 font-bold"
              >
                ✨ Özel Paket (Bundle) Fırsatları
              </Link>
            )}
            {isModuleActive("trail_map") && (
              <Link
                href="/parkurlar"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-emerald-600 font-bold"
              >
                📍 Türkiye Kaya Parkurları
              </Link>
            )}
            {isModuleActive("rig_of_month") && (
              <Link
                href="/topluluk"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-orange-600"
              >
                🏆 Ayın Kaya Canavarı & Oylama
              </Link>
            )}
            {isModuleActive("b2b_quotes") && (
              <Link
                href="/b2b"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-orange-600"
              >
                💼 B2B & Kulüp Teklif Masası
              </Link>
            )}
            {isModuleActive("trade_in") && (
              <Link
                href="/takas"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-orange-600"
              >
                🔄 Eski Şasini Getir (Takas)
              </Link>
            )}
            {isModuleActive("maintenance_packs") && (
              <Link
                href="/bakim"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-orange-600"
              >
                🔧 Periyodik Bakım Servisi
              </Link>
            )}
            {isModuleActive("print3d_demand") && (
              <Link
                href="/3d-baski"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-orange-600"
              >
                🖨️ 3D Baskı Parça Üretimi
              </Link>
            )}
            {isModuleActive("serial_plaque") && (
              <Link
                href="/tescil"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-orange-600"
              >
                🎖️ Şasi Tescil & Doğrulama
              </Link>
            )}
            <Link
              href="/rehber"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 hover:text-orange-600"
            >
              📖 Sistem Rehberi (Nasıl Çalışır?)
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
