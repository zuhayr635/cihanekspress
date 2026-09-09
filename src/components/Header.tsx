"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useModules } from "@/lib/useModules";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Phone,
  Truck,
  BookOpen,
  Sparkles,
  Flame,
  Wrench,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import VehicleSelector from "@/components/VehicleSelector";

export default function Header() {
  const { itemCount, setIsCartOpen, storeSettings, subtotal, vipSession, refreshVipStatus } = useCart();
  const { isModuleActive } = useModules();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const el = document.getElementById("vitrin") || document.getElementById("tum-urunler");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTokenError("");

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
        await refreshVipStatus();
        setVipModalOpen(false);
        setTokenInput("");
      }
    } catch {
      setTokenError("Bağlantı hatası oluştu.");
    } finally {
      setIsVerifying(false);
    }
  };

  const whatsappPhone = storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905304784944";

  return (
    <>
      {/* 1. KAT: Trendyol Üst Mikro Bar */}
      <div className="bg-[#F8F8F8] text-slate-500 text-[11px] border-b border-slate-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-slate-600 font-medium">
              Türkiye&apos;nin RC Rock Crawler & CNC Parça Pazaryeri
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Atölye Çalışma & Danışma Kataloğu
            </span>
          </div>

          <div className="flex items-center gap-5 text-slate-600">
            <a
              href={`https://wa.me/${whatsappPhone}?text=Merhaba%20Cihan%20Usta,%20par%C3%A7a%20ve%20ara%C3%A7%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F27A1A] transition-colors flex items-center gap-1.5 font-medium"
            >
              <Phone className="w-3 h-3 text-[#F27A1A]" />
              <span>WhatsApp Usta Danışma Hattı</span>
            </a>

            <span className="text-slate-300">|</span>

            <Link
              href="/order-tracking"
              className="hover:text-[#F27A1A] transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-3 h-3 text-slate-400" />
              <span>Sipariş & Montaj Takibi</span>
            </Link>

            <span className="text-slate-300">|</span>

            <Link
              href="/rehber"
              className="hover:text-[#F27A1A] transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span>Sistem Rehberi</span>
            </Link>

            <span className="text-slate-300">|</span>

            <Link
              href="/admin"
              className="hover:text-slate-900 transition-colors text-slate-400 hover:text-slate-600"
            >
              Yönetici Paneli
            </Link>
          </div>
        </div>
      </div>

      {/* 2. KAT: Trendyol Ana Header (Logo, Geniş Arama Çubuğu, Giriş, Favoriler, Sepet) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sm:gap-8">
          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#F27A1A] transition-colors"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Trendyol Tarzı Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                cihan
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#F27A1A]">
                ekspress
              </span>
              <span className="text-xs font-semibold text-slate-400 ml-0.5">.com</span>
            </div>
            <p className="text-[9px] font-bold tracking-wider text-slate-400 -mt-1 uppercase">
              RC SCALE CRAWLER ATELIER
            </p>
          </Link>

          {/* Trendyol Geniş Arama Çubuğu */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative hidden sm:block"
          >
            <input
              type="text"
              placeholder="Aradığınız crawler şasisi, pirinç portal aks veya parçayı yazın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3F3F3] hover:bg-[#EBEBEB] focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-[#F27A1A] rounded-md py-2.5 pl-4 pr-12 text-xs sm:text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#F27A1A]"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 p-2 bg-[#F27A1A] hover:bg-[#E06A0A] text-white rounded-md transition-colors"
              aria-label="Ara"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Sağ Aksiyonlar: Giriş Yap, Favorilerim, Sepetim */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Link
              href="/admin/login"
              className="flex items-center gap-2 text-slate-700 hover:text-[#F27A1A] transition-colors py-1 px-1.5 sm:px-2 rounded-md group"
            >
              <User className="w-5 h-5 text-slate-700 group-hover:text-[#F27A1A] transition-colors" />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight">Giriş Yap</span>
                <span className="text-[10px] text-slate-400">veya Üye Ol</span>
              </div>
            </Link>

            <Link
              href="/topluluk"
              className="flex items-center gap-2 text-slate-700 hover:text-[#F27A1A] transition-colors py-1 px-1.5 sm:px-2 rounded-md group relative"
            >
              <Heart className="w-5 h-5 text-slate-700 group-hover:text-[#F27A1A] transition-colors" />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight">Favorilerim</span>
                <span className="text-[10px] text-slate-400">Kaydedilenler</span>
              </div>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-[#FFF3E8] hover:bg-[#FFE8D6] text-slate-900 border border-[#F27A1A]/30 hover:border-[#F27A1A] py-2 px-3 sm:px-3.5 rounded-md transition-all group relative"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#F27A1A]" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F27A1A] text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center animate-in zoom-in">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">Sepetim</span>
                <span className="text-[10px] font-semibold text-[#F27A1A] hidden sm:inline">
                  {itemCount > 0 ? `${subtotal.toLocaleString("tr-TR")} ₺` : "0 Ürün"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 3. KAT: Trendyol Yatay Kategori ve Hızlı Linkler Barı */}
        <div className="border-t border-slate-100 hidden lg:block bg-white text-xs font-semibold text-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-6 py-2.5">
              <Link href="/#vitrin" className="text-[#F27A1A] font-black flex items-center gap-1.5 hover:text-[#E06A0A]">
                <Flame className="w-4 h-4 fill-[#F27A1A]" />
                <span>FLAŞ İNDİRİMLER</span>
              </Link>
              <Link href="/#vitrin" className="hover:text-[#F27A1A] transition-colors">
                1/10 Kaya Şasileri
              </Link>
              <Link href="/#vitrin" className="hover:text-[#F27A1A] transition-colors">
                Ağır Pirinç (Brass) Akslar
              </Link>
              <Link href="/#vitrin" className="hover:text-[#F27A1A] transition-colors">
                FOC Fırçasız Motorlar
              </Link>
              <Link href="/#vitrin" className="hover:text-[#F27A1A] transition-colors">
                1/24 Mini Crawler
              </Link>
              <Link href="/#rig-builder" className="hover:text-[#F27A1A] transition-colors flex items-center gap-1 text-slate-900 font-bold">
                <Wrench className="w-3.5 h-3.5 text-[#F27A1A]" />
                <span>Rig Sihirbazı</span>
              </Link>
              <Link href="/paketler" className="text-[#F27A1A] hover:text-[#E06A0A] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Paket Fırsatları</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 py-2">
              <VehicleSelector />
            </div>
          </div>
        </div>

        {/* Mobil Menü Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-3 text-xs font-semibold">
            <Link
              href="/#vitrin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#F27A1A] font-bold"
            >
              ⚡ Flaş İndirimler
            </Link>
            <Link
              href="/#vitrin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 hover:text-orange-600"
            >
              🏔️ 1/10 & 1/24 Kaya Şasileri
            </Link>
            <Link
              href="/#vitrin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 hover:text-orange-600"
            >
              🔩 Pirinç Aks & Ağırlıklar
            </Link>
            <Link
              href="/#rig-builder"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 hover:text-orange-600"
            >
              🔧 Rig Toplama Sihirbazı
            </Link>
            <Link
              href="/paketler"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#F27A1A] font-bold"
            >
              ★ Özel Paket Fırsatları
            </Link>
            {isModuleActive("gear_calc") && (
              <Link
                href="/hesaplayici"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-orange-600"
              >
                ⚙️ CoG & Dişli Hesaplayıcı
              </Link>
            )}
            {isModuleActive("crawler_spots") && (
              <Link
                href="/parkurlar"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-orange-600"
              >
                📍 Türkiye Kaya Parkurları
              </Link>
            )}
            {isModuleActive("community_rigs") && (
              <Link
                href="/topluluk"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-orange-600"
              >
                🏆 Ayın Kaya Canavarı
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
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-wider font-bold bg-[#F27A1A] text-white rounded-md"
              >
                <KeyRound className="w-4 h-4" />
                Davetiye Kodu Gir
              </button>
            )}
            <div className="pt-2 border-t border-slate-200">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-500 text-xs flex items-center gap-1 hover:text-slate-800"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#F27A1A]" /> Yönetici Paneli
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Davetiye Kodu Modal */}
      {vipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md p-6 sm:p-8 rounded-xl shadow-2xl relative text-slate-900">
            <button
              onClick={() => setVipModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F27A1A]">
                <KeyRound className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl text-slate-950 font-black tracking-tight uppercase">
                RC Kulüp VIP Davetiyesi
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Yöneticinin size tahsis ettiği davetiye kodunu girerek özel crawler araçlarının ve parçaların sipariş yetkisini açabilirsiniz.
              </p>
            </div>

            <form onSubmit={handleVerifyToken} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 font-bold mb-1.5">
                  Davetiye Kodu (Token)
                </label>
                <input
                  type="text"
                  placeholder="Örn: vip-crawler-2026"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:border-[#F27A1A] font-mono"
                />
              </div>

              {tokenError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                  {tokenError}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-[#F27A1A] text-white text-xs uppercase tracking-wider font-bold rounded-md hover:bg-[#E06A0A] transition-colors disabled:opacity-50 shadow-md"
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
