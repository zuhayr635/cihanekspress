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
  Lock,
} from "lucide-react";
import VehicleSelector from "@/components/VehicleSelector";
import VipModal from "@/components/VipModal";

export default function Header() {
  const {
    itemCount,
    setIsCartOpen,
    storeSettings,
    subtotal,
    vipSession,
    isSalesAllowed,
    setIsVipModalOpen,
  } = useCart();
  const { isModuleActive } = useModules();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const el = document.getElementById("vitrin") || document.getElementById("tum-urunler");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const whatsappPhone = storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905304784944";
  const logoUrl = storeSettings?.logoUrl || "";
  const brandMode = storeSettings?.headerBrandMode || "BOTH";
  const primaryText = storeSettings?.headerPrimaryText || "cihan";
  const secondaryText = storeSettings?.headerSecondaryText || "ekspress";
  const suffixText = storeSettings?.headerSuffixText !== undefined ? storeSettings.headerSuffixText : ".com";
  const showSubtitle = storeSettings?.showHeaderSubtitle !== undefined ? storeSettings.showHeaderSubtitle : true;
  const subtitleText = storeSettings?.headerSubtitle || "RC SCALE CRAWLER ATÖLYE SERGİ KATALOĞU";
  const logoHeight = storeSettings?.logoHeight || 38;

  return (
    <>
      <VipModal />

      {/* 1. KAT: Trendyol Üst Mikro Bar */}
      <div className="bg-[#F8F8F8] text-slate-500 text-[11px] border-b border-slate-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 font-medium">
              Türkiye&apos;nin RC Rock Crawler & CNC Parça Kataloğu
            </span>
            <span className="text-slate-300">|</span>

            {isSalesAllowed ? (
              <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                👑 VIP Kulüp Üyeliği Aktif {vipSession.discountPercent ? `(%${vipSession.discountPercent} İndirim)` : ""}
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Atölye Sergi Kataloğu (Fiyat & Satış İçin VIP Davetiyesi Zorunludur)
                </span>
                <button
                  onClick={() => setIsVipModalOpen(true)}
                  className="text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-colors text-[10px]"
                >
                  <KeyRound className="w-3 h-3 text-amber-700" />
                  <span>VIP Davetiye Kodu Gir</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-5 text-slate-600">
            <a
              href={`https://wa.me/${whatsappPhone}?text=Merhaba%20Cihan%20Usta,%20katalog%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`}
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-8">
          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-slate-700 hover:text-[#F27A1A] transition-colors flex-shrink-0"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Logo & Marka Başlığı */}
          <Link href="/" className="flex-shrink-0 group max-w-[170px] sm:max-w-none">
            {logoUrl && brandMode !== "TEXT_ONLY" ? (
              <div className="flex flex-col items-start justify-center">
                <img
                  src={logoUrl}
                  alt={`${primaryText} ${secondaryText}`}
                  style={{
                    height: `${logoHeight}px`,
                    maxHeight: `${logoHeight}px`,
                    width: "auto",
                    objectFit: "contain",
                  }}
                  className="block select-none max-w-full"
                  loading="eager"
                  decoding="async"
                />
                {brandMode === "BOTH" && (
                  <div className="flex items-baseline gap-0.5 leading-none mt-1">
                    <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-950 leading-none">
                      {primaryText}
                    </span>
                    <span className="text-lg sm:text-2xl font-black tracking-tight text-[#F27A1A] leading-none">
                      {secondaryText}
                    </span>
                    {suffixText && (
                      <span className="text-[9px] sm:text-xs font-semibold text-slate-400 ml-0.5 leading-none">
                        {suffixText}
                      </span>
                    )}
                  </div>
                )}
                {showSubtitle && (
                  <p className="text-[7.5px] sm:text-[9px] font-bold tracking-wider text-slate-400 mt-1 uppercase leading-none max-w-[170px] sm:max-w-none truncate">
                    {subtitleText}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl sm:text-3xl font-black tracking-tight text-slate-950">
                    {primaryText}
                  </span>
                  <span className="text-xl sm:text-3xl font-black tracking-tight text-[#F27A1A]">
                    {secondaryText}
                  </span>
                  {suffixText && (
                    <span className="text-xs font-semibold text-slate-400 ml-0.5">
                      {suffixText}
                    </span>
                  )}
                </div>
                {showSubtitle && (
                  <p className="text-[8px] sm:text-[9px] font-bold tracking-wider text-slate-400 -mt-0.5 uppercase tracking-wider max-w-[170px] sm:max-w-none truncate">
                    {subtitleText}
                  </p>
                )}
              </div>
            )}
          </Link>

          {/* Trendyol Geniş Arama Çubuğu (Tablet & Masaüstü) */}
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

          {/* Sağ Aksiyonlar: Davetiye Butonu, Giriş Yap, Favorilerim, Sepetim */}
          <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
            
            {/* Davetiye Kodu Butonu */}
            {!isSalesAllowed ? (
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-black py-1.5 px-2 sm:px-3 rounded-md text-xs font-bold transition-all shadow-xs flex-shrink-0"
                title="VIP Davetiye Kodunuzu girerek fiyatları ve sipariş yetkisini açın"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Davetiye Kodu</span>
              </button>
            ) : (
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 py-1.5 px-2 sm:px-3 rounded-md text-xs font-bold transition-all shadow-xs flex-shrink-0"
                title="VIP oturumunuz aktiftir"
              >
                <span>👑</span>
                <span className="hidden sm:inline"> VIP Üye</span>
              </button>
            )}

            {/* Giriş Yap (Mobilde Hamburger Menüye Alındı) */}
            <Link
              href="/admin/login"
              className="hidden md:flex items-center gap-1.5 text-slate-700 hover:text-[#F27A1A] transition-colors py-1 px-1 sm:px-2 rounded-md group"
            >
              <User className="w-5 h-5 text-slate-700 group-hover:text-[#F27A1A] transition-colors" />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight">Giriş Yap</span>
                <span className="text-[10px] text-slate-400">veya Üye Ol</span>
              </div>
            </Link>

            {/* Favorilerim (Mobilde Hamburger Menüye Alındı) */}
            <Link
              href="/topluluk"
              className="hidden md:flex items-center gap-1.5 text-slate-700 hover:text-[#F27A1A] transition-colors py-1 px-1 sm:px-2 rounded-md group relative"
            >
              <Heart className="w-5 h-5 text-slate-700 group-hover:text-[#F27A1A] transition-colors" />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight">Favorilerim</span>
                <span className="text-[10px] text-slate-400">Kaydedilenler</span>
              </div>
            </Link>

            {/* Sepetim Butonu (Mobilde Sağa Taşmayı Önleyen Kompakt Badge) */}
            <button
              onClick={() => {
                if (!isSalesAllowed && itemCount === 0) {
                  setIsVipModalOpen(true);
                } else {
                  setIsCartOpen(true);
                }
              }}
              className="flex items-center gap-1.5 sm:gap-2 bg-[#FFF3E8] hover:bg-[#FFE8D6] text-slate-900 border border-[#F27A1A]/30 hover:border-[#F27A1A] p-2 sm:py-2 sm:px-3.5 rounded-md transition-all group relative flex-shrink-0"
              aria-label="Sepetim"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#F27A1A]" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F27A1A] text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center animate-in zoom-in">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">Sepetim</span>
                <span className="text-[10px] font-semibold text-[#F27A1A]">
                  {isSalesAllowed
                    ? itemCount > 0
                      ? `${subtotal.toLocaleString("tr-TR")} ₺`
                      : "0 Ürün"
                    : "Katalog Modu"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobil Özel Arama Çubuğu (Mobilde Sağa Kaymayı Engelleyen ve Erişimi Kolaylaştıran Satır) */}
        <div className="sm:hidden px-3 pb-2.5 pt-0.5 border-t border-slate-100 bg-white">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Crawler şasisi, pirinç aks veya parça ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3F3F3] hover:bg-[#EBEBEB] focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-[#F27A1A] rounded-lg py-2 pl-3.5 pr-10 text-xs transition-all focus:outline-none focus:ring-1 focus:ring-[#F27A1A]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 p-1.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white rounded-md transition-colors"
              aria-label="Ara"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
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
            {!isSalesAllowed ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsVipModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-wider font-bold bg-amber-500 text-black rounded-md shadow-xs"
              >
                <KeyRound className="w-4 h-4" />
                VIP Davetiye Kodu Gir (Fiyatları Aç)
              </button>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-center text-xs font-bold">
                👑 VIP Kulüp Oturumu Aktif
              </div>
            )}

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

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 text-xs font-bold flex items-center gap-2 hover:text-[#F27A1A]"
              >
                <User className="w-4 h-4 text-slate-500" /> Giriş Yap / Üye Ol
              </Link>
              <Link
                href="/topluluk"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 text-xs font-bold flex items-center gap-2 hover:text-[#F27A1A]"
              >
                <Heart className="w-4 h-4 text-slate-500" /> Favorilerim (Kaydedilenler)
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}?text=Merhaba%20Cihan%20Usta,%20katalog%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-emerald-700 text-xs font-bold flex items-center gap-2 hover:text-emerald-800"
              >
                <Phone className="w-4 h-4 text-emerald-600" /> WhatsApp Usta Danışma Hattı
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-500 text-xs flex items-center gap-1 hover:text-slate-800 pt-1"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#F27A1A]" /> Yönetici Paneli
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
