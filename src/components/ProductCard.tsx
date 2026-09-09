"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, ArrowUpRight, Sparkles, Cpu } from "lucide-react";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku?: string | null;
    description: string;
    shortDescription?: string | null;
    images: string; // JSON array
    basePrice: number;
    salePrice?: number | null;
    isFeatured?: boolean;
    category?: { name: string } | null;
    variants?: { id: string; name: string; price: number; stock: number }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { vipSession, storeSettings, selectedVehicle } = useCart();

  const isSalesAllowed =
    storeSettings?.storeMode === "PUBLIC_SALE" ||
    (storeSettings?.storeMode === "INVITE_ONLY" && vipSession.isVip) ||
    vipSession.isVip;

  let imageList: string[] = [];
  try {
    imageList = JSON.parse(product.images);
  } catch {
    imageList = [];
  }
  const mainImage =
    imageList[0] ||
    "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80";

  // Fiyat ve VIP İndirim Hesaplaması
  const rawPrice = product.salePrice || product.basePrice;
  const vipDiscount = vipSession.discountPercent || 0;
  const finalPrice = vipDiscount > 0 ? rawPrice * (1 - vipDiscount / 100) : rawPrice;

  // Crawler Teknik Rozetlerini Çıkar
  const isMicro = product.title.includes("1/24") || (product.shortDescription && product.shortDescription.includes("1/24"));
  const scaleTag = isMicro ? "1/24 MINI" : "1/10 PRO";
  
  const fitmentTag = product.title.includes("TRX-4") || product.description.includes("TRX-4")
    ? "TRX-4 / SCX10"
    : product.title.includes("SCX24")
    ? "SCX24 FIT"
    : "EVRENSEL / UNIVERSAL";

  const isBrass = product.title.toLowerCase().includes("pirinç") || product.title.toLowerCase().includes("brass");
  const isMotor = product.title.toLowerCase().includes("motor") || product.title.toLowerCase().includes("servo");
  const isWheel = product.title.toLowerCase().includes("beadlock") || product.title.toLowerCase().includes("jant");

  // Garaj Araç Uyumluluk Kontrolü
  let isVehicleCompatible = true;
  if (selectedVehicle) {
    const fullText = `${product.title} ${product.shortDescription || ""} ${product.description}`.toLowerCase();
    const isTargetMicro = selectedVehicle === "SCX24";
    const isItemMicro = fullText.includes("1/24") || fullText.includes("scx24");

    if (isTargetMicro && !isItemMicro) {
      isVehicleCompatible = false;
    } else if (!isTargetMicro && isItemMicro) {
      isVehicleCompatible = false;
    }
  }

  return (
    <div className="tactical-box group flex flex-col bg-[#11151F] border border-[#222B3B] rounded-xs overflow-hidden hover:border-amber-400/80 transition-all duration-300 shadow-xl relative">
      {/* Görsel Alanı */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-4/3 sm:aspect-3/4 w-full bg-[#0A0D14] overflow-hidden block border-b border-[#1E2535]"
      >
        {/* Arka plan blueprint ızgarası */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-30 z-0 pointer-events-none" />

        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out z-10"
        />

        {/* Üst Rozetler (Teknik Telemetri Formatında) */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap gap-1.5 max-w-[85%]">
          <span className="px-2 py-0.5 bg-black/90 border border-amber-500/50 text-amber-400 text-[9px] font-mono tracking-wider uppercase font-bold rounded-xs backdrop-blur-md">
            {scaleTag}
          </span>

          <span className="px-2 py-0.5 bg-[#171C26]/90 border border-stone-700 text-stone-300 text-[9px] font-mono tracking-wider uppercase rounded-xs backdrop-blur-md">
            {fitmentTag}
          </span>

          {isBrass && (
            <span className="px-2 py-0.5 bg-amber-600/90 text-black text-[9px] font-mono font-black uppercase rounded-xs">
              +AĞIR PİRİNÇ
            </span>
          )}

          {vipSession.isVip && vipDiscount > 0 && (
            <span className="px-2 py-0.5 bg-amber-400 text-black text-[9px] font-mono tracking-wider uppercase font-black rounded-xs">
              -%{vipDiscount} VIP
            </span>
          )}
        </div>

        {/* Sağ Alt Kilit / Durum */}
        {!isSalesAllowed ? (
          <div className="absolute bottom-2.5 right-2.5 z-20 px-2 py-1 bg-black/90 border border-amber-500/40 text-amber-400 text-[10px] font-mono tracking-wider uppercase rounded-xs flex items-center gap-1.5 shadow-md">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Katalog Vitrini</span>
          </div>
        ) : (
          <div className="absolute bottom-2.5 right-2.5 z-20 px-2 py-1 bg-emerald-950/90 border border-emerald-600/60 text-emerald-400 text-[9px] font-mono tracking-wider uppercase rounded-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Stokta</span>
          </div>
        )}
      </Link>

      {/* Ürün Bilgisi */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-[#11151F]">
        <div>
          {/* Kategori ve SKU */}
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 border-b border-stone-800/80 pb-2 mb-2">
            <span className="text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3 h-3 text-amber-400" />
              {product.category?.name?.split(" ")[0] || "CRAWLER"}
            </span>
            {product.sku && (
              <span className="text-stone-500 tracking-wider">#{product.sku}</span>
            )}
          </div>

          {/* Garaj Araç Uyumluluk Rozeti */}
          {selectedVehicle && (
            <div className="mb-2">
              {isVehicleCompatible ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 text-[9px] font-mono font-bold uppercase rounded-xs">
                  ✓ {selectedVehicle} ile Uyumlu
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-950/80 border border-amber-600/70 text-amber-300 text-[9px] font-mono font-bold uppercase rounded-xs">
                  ⚠️ {selectedVehicle} İçin Uyumsuz
                </span>
              )}
            </div>
          )}

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-mono text-xs sm:text-sm text-white font-bold group-hover:text-amber-400 transition-colors line-clamp-2 uppercase leading-snug">
              {product.title}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-[11px] text-stone-400 mt-2 line-clamp-2 leading-relaxed font-light">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Fiyat ve Buton Alanı */}
        <div className="pt-3 border-t border-[#1C2331] flex items-end justify-between">
          {isSalesAllowed ? (
            <div className="flex flex-col">
              {vipDiscount > 0 || product.salePrice ? (
                <>
                  <span className="text-[10px] text-stone-500 line-through font-mono">
                    {product.basePrice.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="text-sm sm:text-base font-mono font-extrabold text-amber-400">
                    {finalPrice.toLocaleString("tr-TR")} ₺
                  </span>
                </>
              ) : (
                <span className="text-sm sm:text-base font-mono font-extrabold text-white">
                  {product.basePrice.toLocaleString("tr-TR")} ₺
                </span>
              )}
            </div>
          ) : (
            <div className="text-[10px] text-stone-400 font-mono tracking-wider uppercase font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
              <span>Davetiye Gerekir</span>
            </div>
          )}

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#18202D] border border-stone-700 text-[11px] font-mono font-bold uppercase tracking-wider text-stone-200 group-hover:border-amber-400 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-all rounded-xs"
          >
            <span>{isSalesAllowed ? "Sipariş Ver" : "Parça İncele"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-amber-400" />
          </Link>
        </div>
      </div>

      {/* Alt Kalibrasyon Çizgisi */}
      <div className="h-1 w-full bg-[#18202E] flex">
        <div className="w-1/4 h-full bg-amber-500/40" />
        <div className="w-1/12 h-full bg-amber-500" />
      </div>
    </div>
  );
}
