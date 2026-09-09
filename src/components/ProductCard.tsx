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
    <div className="group relative flex flex-col bg-white border border-slate-200 hover:border-slate-400 rounded-xs overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Görsel Alanı */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-4/3 sm:aspect-3/4 w-full bg-slate-50 overflow-hidden block border-b border-slate-100"
      >
        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out z-10"
        />

        {/* Üst Rozetler */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 max-w-[85%]">
          <span className="px-2 py-0.5 bg-slate-950 text-white text-[9px] font-mono tracking-wider uppercase font-bold rounded-xs shadow-xs">
            {scaleTag}
          </span>

          <span className="px-2 py-0.5 bg-white/95 border border-slate-200 text-slate-700 text-[9px] font-mono tracking-wider uppercase rounded-xs">
            {fitmentTag}
          </span>

          {isBrass && (
            <span className="px-2 py-0.5 bg-orange-600 text-white text-[9px] font-mono font-bold uppercase rounded-xs shadow-xs">
              +AĞIR PİRİNÇ CNC
            </span>
          )}

          {vipSession.isVip && vipDiscount > 0 && (
            <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-mono tracking-wider uppercase font-bold rounded-xs">
              -%{vipDiscount} KULÜP
            </span>
          )}
        </div>

        {/* Sağ Alt Atölye Durum Rozeti */}
        <div className="absolute bottom-3 right-3 z-20 px-2 py-1 bg-white/90 border border-slate-200 text-slate-700 text-[9px] font-mono tracking-wider uppercase rounded-xs flex items-center gap-1.5 backdrop-blur-xs">
          <Wrench className="w-3 h-3 text-orange-600" />
          <span>Atölye İmalatı</span>
        </div>
      </Link>

      {/* Ürün Bilgisi */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        <div>
          {/* Kategori ve SKU */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-100 pb-2 mb-2">
            <span className="text-orange-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3 h-3 text-orange-600" />
              {product.category?.name?.split(" ")[0] || "CRAWLER PROJE"}
            </span>
            {product.sku && (
              <span className="text-slate-400 tracking-wider">#{product.sku}</span>
            )}
          </div>

          {/* Garaj Araç Uyumluluk Rozeti */}
          {selectedVehicle && (
            <div className="mb-2">
              {isVehicleCompatible ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[9px] font-mono font-bold uppercase rounded-xs">
                  ✓ {selectedVehicle} ile Uyumlu
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-300 text-amber-800 text-[9px] font-mono font-bold uppercase rounded-xs">
                  ⚠️ {selectedVehicle} İçin Uyumsuz
                </span>
              )}
            </div>
          )}

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-mono text-xs sm:text-sm text-slate-900 font-bold group-hover:text-orange-600 transition-colors line-clamp-2 uppercase leading-snug">
              {product.title}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed font-normal">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Fiyat ve Hızlı Sipariş / İnceleme Aksiyonları */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                Atölye Referans Değeri
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-base font-mono font-black text-slate-950">
                  {finalPrice.toLocaleString("tr-TR")} ₺
                </span>
                {(vipDiscount > 0 || product.salePrice) && (
                  <span className="text-[10px] text-slate-400 line-through font-mono">
                    {product.basePrice.toLocaleString("tr-TR")} ₺
                  </span>
                )}
              </div>
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 hover:text-orange-600 transition-colors"
            >
              <span>Detaylar</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-orange-600" />
            </Link>
          </div>

          {/* İkili Buton: 1. WhatsApp Hızlı Sipariş, 2. Detaylı İncele */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-300 hover:border-emerald-600 text-[10px] font-mono uppercase font-bold tracking-wider rounded-xs transition-all shadow-xs"
              title="WhatsApp üzerinden atölye ile görüşün"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>

            <Link
              href={`/products/${product.slug}`}
              className="w-full flex items-center justify-center gap-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-white border border-slate-950 text-[10px] font-mono uppercase font-bold tracking-wider rounded-xs transition-all shadow-xs"
            >
              <span>İncele</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Alt İnce Çizgi */}
      <div className="h-0.5 w-full bg-slate-100 flex">
        <div className="w-1/4 h-full bg-orange-600 group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  );
}
