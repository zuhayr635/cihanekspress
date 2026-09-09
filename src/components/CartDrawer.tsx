"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  MessageCircle,
  Wrench,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discountAmount,
    discountPercent,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    storeSettings,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponCode.trim());
    if (res.success) {
      setCouponMsg({ type: "success", text: res.message });
      setCouponCode("");
    } else {
      setCouponMsg({ type: "error", text: res.message });
    }
    setIsApplying(false);
  };

  // WhatsApp Sipariş & Atölye Talep Mesajı Oluşturucu
  const getWhatsAppOrderUrl = () => {
    const phone = storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905551234567";
    const itemList = items
      .map(
        (i, idx) =>
          `🔹 *${idx + 1}. ${i.title}*${i.variantName ? ` [Seçenek: ${i.variantName}]` : ""}\n   └ ${i.quantity} Adet × ${i.price.toLocaleString("tr-TR")} ₺ = ${(i.quantity * i.price).toLocaleString("tr-TR")} ₺`
      )
      .join("\n\n");

    const message = `*CIHANPOL RC ATELIER — ATÖLYE SİPARİŞ & TALEP LİSTESİ*\n\nMerhaba Cihan Usta, sitedeki katalog üzerinden aşağıdaki projeleri/parçaları seçtim:\n\n${itemList}\n\n─────────────────────\n*Ara Toplam:* ${subtotal.toLocaleString("tr-TR")} ₺\n${discountAmount > 0 ? `*İndirim:* -${discountAmount.toLocaleString("tr-TR")} ₺\n` : ""}*Atölye Referans Toplamı:* ${total.toLocaleString("tr-TR")} ₺\n─────────────────────\n\nBu parçaların atölye teslimi / montaj durumu ve teslimat süresi hakkında görüşmek istiyorum.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-12">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-900">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-white/95 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xs bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-mono text-sm tracking-wider text-slate-950 font-bold uppercase">
                  Atölye Talep Listesi
                </h2>
                <p className="text-[10px] font-mono text-slate-500">
                  {items.length} Kalem Seçili Parça / Proje
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xs transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hukuki Hobi Kalkanı Bilgilendirmesi */}
          <div className="px-5 py-2.5 bg-orange-50 border-b border-orange-100 text-[11px] text-orange-950 font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <span>Katalog Rezervasyonu: Birebir atölye istişaresiyle hazırlanır.</span>
          </div>

          {/* Ürün Listesi */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                  <Wrench className="w-8 h-8 stroke-[1.2]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-mono font-bold text-slate-950 uppercase">
                    Listenizde Parça Bulunmuyor
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Kataloğumuzdan crawler şasileri, ağır pirinç portal akslar ve CNC parçaları inceleyip ekleyebilirsiniz.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-6 py-2.5 bg-slate-900 text-white text-xs uppercase tracking-widest font-mono font-bold hover:bg-slate-800 transition-all rounded-xs shadow-sm"
                >
                  Kataloğu İncele
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 group">
                  <div className="relative w-20 h-24 bg-slate-50 rounded-xs overflow-hidden flex-shrink-0 border border-slate-200">
                    <Image
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-mono font-bold text-slate-950 group-hover:text-orange-600 transition-colors line-clamp-2 uppercase leading-snug">
                          {item.title}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Listeden Çıkar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.variantName && (
                        <p className="text-[10px] font-mono text-orange-600 mt-0.5 font-bold">
                          Opsiyon: {item.variantName}
                        </p>
                      )}
                      <p className="text-xs font-mono font-bold text-slate-700 mt-1.5">
                        {item.price.toLocaleString("tr-TR")} ₺
                      </p>
                    </div>

                    {/* Miktar Kontrolü */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-xs bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
                          aria-label="Azalt"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
                          aria-label="Artır"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-bold text-slate-950">
                        {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Alt Özet ve Aksiyonlar */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-slate-50/90 border-t border-slate-200 space-y-4">
              {/* Kupon Alanı */}
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Atölye Kulüp Kodu"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xs focus:outline-none focus:border-slate-900 uppercase font-mono text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplying || !couponCode.trim()}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs uppercase font-mono font-bold rounded-xs transition-colors disabled:opacity-50"
                >
                  Uygula
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xs font-mono">
                  <span>Kupon Aktif: {appliedCoupon}</span>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-500 hover:text-slate-900 text-[11px] underline"
                  >
                    Kaldır
                  </button>
                </div>
              )}

              {couponMsg && (
                <p
                  className={`text-xs font-mono ${
                    couponMsg.type === "success" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {couponMsg.text}
                </p>
              )}

              {/* Fiyat Detayları (Atölye Referans Değeri) */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3 font-mono">
                <div className="flex justify-between">
                  <span>Parça / Malzeme Toplamı</span>
                  <span className="text-slate-900 font-bold">{subtotal.toLocaleString("tr-TR")} ₺</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-orange-600 font-bold">
                    <span>
                      {discountPercent > 0 ? `Kulüp İndirimi (%${discountPercent})` : "Özel İndirim"}
                    </span>
                    <span>-{discountAmount.toLocaleString("tr-TR")} ₺</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Atölye Teslim & Kargo</span>
                  <span className="text-emerald-600 font-bold">
                    {shippingFee === 0 ? "Atölye İkramı (Ücretsiz)" : `${shippingFee} ₺`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-slate-950 border-t border-slate-200 pt-2.5">
                  <span className="text-slate-950">Atölye Referans Tutarı</span>
                  <span className="text-base text-slate-950 font-black">
                    {total.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
              </div>

              {/* Butonlar: 1. WhatsApp Doğrudan Sipariş (Öncelikli), 2. Atölye Rezervasyon Formu */}
              <div className="space-y-2.5 pt-1">
                <a
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-widest font-mono font-black rounded-xs transition-all shadow-md shadow-emerald-600/20 group"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                  <span>WhatsApp ile Siparişi Atölyeye İlet</span>
                </a>

                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-800 hover:text-slate-950 text-xs uppercase tracking-widest font-mono font-bold rounded-xs transition-all group shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>Atölye Rezervasyon & İletişim Formu</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
