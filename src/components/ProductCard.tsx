"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Check, MessageCircle, Star, Truck, Lock, KeyRound } from "lucide-react";
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
  const {
    addItem,
    vipSession,
    storeSettings,
    selectedVehicle,
    isSalesAllowed,
    setIsVipModalOpen,
  } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  let imageList: string[] = [];
  try {
    imageList = JSON.parse(product.images);
  } catch {
    imageList = [];
  }
  const mainImage =
    imageList[0] ||
    "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80";

  // Fiyat hesaplama
  const rawPrice = product.salePrice || product.basePrice;
  const vipDiscount = vipSession.discountPercent || 0;
  const finalPrice = vipDiscount > 0 ? rawPrice * (1 - vipDiscount / 100) : rawPrice;
  const hasDiscount = product.basePrice > finalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - finalPrice) / product.basePrice) * 100)
    : 0;

  // Marka & Ölçek tespiti
  const isMicro =
    product.title.includes("1/24") ||
    (product.shortDescription && product.shortDescription.includes("1/24"));
  const brandName = product.title.includes("TRX")
    ? "TRAXXAS"
    : product.title.includes("SCX")
    ? "AXIAL"
    : product.title.toLowerCase().includes("pirinç") || product.title.toLowerCase().includes("brass")
    ? "BRASS LAB"
    : "CIHANPOL";

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

  // Sepete Ekle Aksiyonu
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSalesAllowed) {
      setIsVipModalOpen(true);
      return;
    }

    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: finalPrice,
      image: mainImage,
      maxStock: 99,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  // WhatsApp Sipariş / Danışma Linki
  const phone = storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905304784944";
  const whatsAppMsg = isSalesAllowed
    ? `Merhaba Cihan Usta, Trendyol vitrindeki *${product.title}* hakkında bilgi almak ve sipariş vermek istiyorum. (Ref: #${product.sku || product.slug}, Fiyat: ${finalPrice.toLocaleString("tr-TR")} TL)`
    : `Merhaba Cihan Usta, *${product.title}* atölye sergisi ve model hakkında teknik bilgi almak istiyorum. (Katalog No: #${product.sku || product.slug})`;
  const directWhatsAppUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsAppMsg)}`;

  // Değerlendirme puanı simülasyonu (Trendyol tarzı 4.7 - 5.0)
  const rating = 4.8 + ((product.title.length % 3) * 0.1);
  const reviewCount = 24 + ((product.title.length * 7) % 180);

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border border-slate-200 hover:border-[#F27A1A]/60 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Görsel Alanı */}
      <div className="relative aspect-[1/1] w-full bg-[#FAFAFA] overflow-hidden p-2 flex items-center justify-center">
        <Link href={`/products/${product.slug}`} className="relative w-full h-full block">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        </Link>

        {/* Favori Butonu (Trendyol Sağ Üst Kalp) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow flex items-center justify-center transition-transform active:scale-90"
          title="Favorilere Ekle"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-slate-400 group-hover:text-slate-600"
            }`}
          />
        </button>

        {/* Trendyol Rozetleri (Sol Üst) */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 items-start">
          <span className="px-1.5 py-0.5 bg-[#0BC15C] text-white text-[9px] font-bold rounded shadow-xs flex items-center gap-1">
            <Truck className="w-2.5 h-2.5" />
            KARGO BEDAVA
          </span>

          <span className="px-1.5 py-0.5 bg-[#F27A1A] text-white text-[9px] font-bold rounded shadow-xs">
            HIZLI TESLİMAT
          </span>

          {isSalesAllowed && hasDiscount && (
            <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded shadow-xs">
              %{discountPercent} İNDİRİM
            </span>
          )}

          {!isSalesAllowed && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-black text-[9px] font-bold rounded shadow-xs flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              KATALOG
            </span>
          )}

          {isMicro && (
            <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-mono font-bold rounded">
              1/24 MİKRO
            </span>
          )}
        </div>

        {/* Garaj Uyumluluk Etiketi */}
        {selectedVehicle && (
          <div className="absolute bottom-2 left-2 z-20">
            {isVehicleCompatible ? (
              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-semibold rounded">
                ✓ {selectedVehicle} Uyumlu
              </span>
            ) : (
              <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 text-[9px] font-semibold rounded">
                ⚠️ Uyumsuz
              </span>
            )}
          </div>
        )}
      </div>

      {/* Ürün Detayları */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2 bg-white">
        <div className="space-y-1.5">
          {/* Başlık (Trendyol Kalın Marka + Başlık) */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-[13px] text-slate-800 group-hover:text-[#F27A1A] transition-colors line-clamp-2 leading-snug">
              <strong className="font-bold text-slate-950 mr-1 uppercase">
                {brandName}
              </strong>
              {product.title}
            </h3>
          </Link>

          {/* Yıldız Değerlendirme & Yorum Sayısı */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span className="font-bold text-amber-500 flex items-center">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline mr-0.5" />
              {rating.toFixed(1)}
            </span>
            <span className="text-slate-400">({reviewCount})</span>
            <span className="text-[9px] bg-orange-50 text-[#F27A1A] font-semibold px-1 rounded ml-auto">
              Çok Satan
            </span>
          </div>

          {/* Fiyat Bloğu (Davetiyesiz Ziyaretçiler İçin Gizli) */}
          <div className="pt-1 min-h-[46px] flex flex-col justify-center">
            {isSalesAllowed ? (
              <>
                {hasDiscount && (
                  <span className="text-[11px] text-slate-400 line-through block font-medium">
                    {product.basePrice.toLocaleString("tr-TR")} TL
                  </span>
                )}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-[#F27A1A] tracking-tight">
                    {finalPrice.toLocaleString("tr-TR")} TL
                  </span>
                </div>
              </>
            ) : (
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider leading-none mb-1">
                  Atölye Sergi Kataloğu
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsVipModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2 py-1 rounded-md transition-colors w-full text-left"
                  title="Fiyatları görmek için tıklayın"
                >
                  <Lock className="w-3 h-3 text-amber-600 flex-shrink-0" />
                  <span className="truncate">Fiyat İçin Davetiye Girin</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Butonlar: Davetiye Kodu Gir VEYA Sepete Ekle + WhatsApp */}
        <div className="pt-2 space-y-1.5">
          {isSalesAllowed ? (
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-[#F27A1A] hover:bg-[#E06A0A] text-white"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Sepete Eklendi</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Sepete Ekle</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsVipModalOpen(true);
              }}
              className="w-full py-2 px-3 rounded-md text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Davetiye Kodu Gir</span>
            </button>
          )}

          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1 px-2 rounded-md text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors flex items-center justify-center gap-1"
          >
            <MessageCircle className="w-3 h-3 text-emerald-600" />
            <span>{isSalesAllowed ? "WhatsApp ile Sor & Sipariş Ver" : "WhatsApp ile Bilgi Al"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
