"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Cpu, MessageCircle, Wrench } from "lucide-react";
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

  let imageList: string[] = [];
  try {
    imageList = JSON.parse(product.images);
  } catch {
    imageList = [];
  }
  const mainImage =
    imageList[0] ||
    "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80";

  // Fiyat ve Atölye Referans Değeri
  const rawPrice = product.salePrice || product.basePrice;
  const vipDiscount = vipSession.discountPercent || 0;
  const finalPrice = vipDiscount > 0 ? rawPrice * (1 - vipDiscount / 100) : rawPrice;

  // Crawler Teknik Rozetlerini Çıkar
  const isMicro =
    product.title.includes("1/24") ||
    (product.shortDescription && product.shortDescription.includes("1/24"));
  const scaleTag = isMicro ? "1/24 MINI" : "1/10 PRO";

  const fitmentTag =
    product.title.includes("TRX-4") || product.description.includes("TRX-4")
      ? "TRX-4 / SCX10"
      : product.title.includes("SCX24")
      ? "SCX24 COMPATIBLE"
      : "ÖZEL ŞASİ FIT";

  const isBrass =
    product.title.toLowerCase().includes("pirinç") ||
    product.title.toLowerCase().includes("brass");

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

  // WhatsApp Doğrudan Sipariş / Bilgi Linki
  const phone = storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905551234567";
  const whatsAppMsg = `Merhaba Cihan Usta, katalogdaki *${product.title}* projesi hakkında bilgi almak ve atölye siparişi oluşturmak istiyorum. (Referans No: #${product.sku || product.slug})`;
  const directWhatsAppUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsAppMsg)}`;

  return (
    <div className="group relative flex flex-col bg-[#0E1119] border border-[#1E2536] hover:border-amber-500/50 rounded-xs overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)]">
      {/* Görsel Alanı */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-4/3 sm:aspect-3/4 w-full bg-[#080B10] overflow-hidden block border-b border-[#1A2130]"
      >
        {/* Arka plan blueprint ızgarası */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-25 z-0 pointer-events-none" />

        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out z-10"
        />

        {/* Karartma Gradyanı */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1119] via-transparent to-black/40 z-15 pointer-events-none" />

        {/* Üst Rozetler (Teknik Telemetri Formatında) */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 max-w-[85%]">
          <span className="px-2 py-0.5 bg-black/90 border border-amber-500/60 text-amber-400 text-[9px] font-mono tracking-wider uppercase font-black rounded-xs backdrop-blur-md shadow-sm">
            {scaleTag}
          </span>

          <span className="px-2 py-0.5 bg-[#151A26]/90 border border-stone-700 text-stone-300 text-[9px] font-mono tracking-wider uppercase rounded-xs backdrop-blur-md">
            {fitmentTag}
          </span>

          {isBrass && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-600 to-amber-700 text-black text-[9px] font-mono font-black uppercase rounded-xs shadow-xs">
              +AĞIR PİRİNÇ CNC
            </span>
          )}

          {vipSession.isVip && vipDiscount > 0 && (
            <span className="px-2 py-0.5 bg-amber-400 text-black text-[9px] font-mono tracking-wider uppercase font-black rounded-xs">
              -%{vipDiscount} KULÜP
            </span>
          )}
        </div>

        {/* Sağ Alt Atölye Durum Rozeti */}
        <div className="absolute bottom-3 right-3 z-20 px-2 py-1 bg-black/85 border border-white/10 text-stone-300 text-[9px] font-mono tracking-wider uppercase rounded-xs flex items-center gap-1.5 backdrop-blur-md">
          <Wrench className="w-3 h-3 text-amber-400" />
          <span>Atölye Üretimi</span>
        </div>
      </Link>

      {/* Ürün Bilgisi */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-[#0E1119]">
        <div>
          {/* Kategori ve SKU */}
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 border-b border-stone-800/60 pb-2 mb-2">
            <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3 h-3 text-amber-400" />
              {product.category?.name?.split(" ")[0] || "CRAWLER PROJE"}
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

        {/* Fiyat ve Hızlı Sipariş / İnceleme Aksiyonları */}
        <div className="pt-3 border-t border-[#1A2130] space-y-3">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500">
                Atölye Referans Değeri
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-base font-mono font-black text-amber-400">
                  {finalPrice.toLocaleString("tr-TR")} ₺
                </span>
                {(vipDiscount > 0 || product.salePrice) && (
                  <span className="text-[10px] text-stone-500 line-through font-mono">
                    {product.basePrice.toLocaleString("tr-TR")} ₺
                  </span>
                )}
              </div>
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400 hover:text-amber-400 transition-colors"
            >
              <span>Detaylar</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>

          {/* İkili Buton: 1. WhatsApp Hızlı Sipariş (Öncelikli), 2. Detaylı İncele */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 hover:border-[#25D366] text-[10px] font-mono uppercase font-black tracking-wider rounded-xs transition-all shadow-sm"
              title="WhatsApp üzerinden atölye ile görüşün"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Sipariş</span>
            </a>

            <Link
              href={`/products/${product.slug}`}
              className="w-full flex items-center justify-center gap-1 py-2.5 bg-[#141A26] hover:bg-amber-500 text-stone-300 hover:text-black border border-[#222C40] hover:border-amber-400 text-[10px] font-mono uppercase font-bold tracking-wider rounded-xs transition-all"
            >
              <span>Projeyi İncele</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Alt İnce Aksan Çizgisi */}
      <div className="h-0.5 w-full bg-[#18202E] flex">
        <div className="w-1/3 h-full bg-amber-500/40 group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  );
}
