"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";
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
  Lock,
  KeyRound,
  Truck,
  Sparkles,
  Zap,
} from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discountAmount,
    discountPercent,
    bundleDiscount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    storeSettings,
    isSalesAllowed,
    setIsVipModalOpen,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [crossSellProducts, setCrossSellProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!isCartOpen) return;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sepette olmayan ilk 3 ürünü öner
          const inCartIds = new Set(items.map((i) => i.id));
          const available = data.filter((p) => !inCartIds.has(p.id)).slice(0, 3);
          setCrossSellProducts(available);
        }
      })
      .catch(() => {});
  }, [isCartOpen, items]);

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
    const itemList = items
      .map(
        (i, idx) =>
          `🔹 *${idx + 1}. ${i.title}*${i.variantName ? ` [Seçenek: ${i.variantName}]` : ""}\n   └ ${i.quantity} Adet × ${i.price.toLocaleString("tr-TR")} ₺ = ${(i.quantity * i.price).toLocaleString("tr-TR")} ₺`
      )
      .join("\n\n");

    const message = `*CIHANPOL RC ATELIER — ATÖLYE SİPARİŞ & TALEP LİSTESİ*\n\nMerhaba Cihan Usta, sitedeki katalog üzerinden aşağıdaki projeleri/parçaları seçtim:\n\n${itemList}\n\n─────────────────────\n*Ara Toplam:* ${subtotal.toLocaleString("tr-TR")} ₺\n${discountAmount > 0 ? `*Kupon/Kulüp İndirimi:* -${discountAmount.toLocaleString("tr-TR")} ₺\n` : ""}${bundleDiscount > 0 ? `*Set İndirimi (%5):* -${bundleDiscount.toLocaleString("tr-TR")} ₺\n` : ""}*Atölye Referans Toplamı:* ${total.toLocaleString("tr-TR")} ₺\n─────────────────────\n\nBu parçaların atölye teslimi / montaj durumu ve teslimat süresi hakkında görüşmek istiyorum.`;

    return getWhatsAppUrl(storeSettings?.whatsappPhone, message);
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

          {/* 1. Kargo Bedava İlerleme Çubuğu */}
          {(() => {
            const freeThreshold = storeSettings?.freeShippingThreshold ?? 2000;
            const remaining = Math.max(0, freeThreshold - subtotal);
            const percent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
            return (
              <div className="px-5 py-3 bg-orange-50/50 border-b border-orange-100/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  {remaining === 0 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                      <span>🎉 Tebrikler! Kargo BEDAVA</span>
                    </span>
                  ) : (
                    <span className="text-slate-700 font-medium flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#F27A1A]" />
                      <span>Kargo Bedava için <strong>{remaining.toLocaleString("tr-TR")} ₺</strong> ekleyin</span>
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-500">%{percent}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      percent >= 100 ? "bg-emerald-500" : "bg-[#F27A1A]"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })()}

          {/* Hukuki Hobi Kalkanı Bilgilendirmesi */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-600 font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F27A1A] flex-shrink-0" />
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
                        item.imageUrl ||
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

            {/* 2. Çapraz Satış: Birlikte İyi Gider */}
            {items.length > 0 && crossSellProducts.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#F27A1A]" />
                    <span>Birlikte İyi Gider</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Atölye Önerisi</span>
                </div>
                <div className="space-y-2">
                  {crossSellProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xs hover:border-[#F27A1A]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-10 h-10 relative bg-white rounded-xs overflow-hidden border border-slate-200 shrink-0">
                          <Image
                            src={p.imageUrl || "/cihanekspress-logo.png"}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono font-bold text-slate-900 truncate">
                            {p.title}
                          </p>
                          <p className="text-[11px] font-mono text-[#F27A1A] font-bold">
                            {p.price.toLocaleString("tr-TR")} ₺
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          addItem({
                            id: p.id,
                            title: p.title,
                            price: p.price,
                            imageUrl: p.imageUrl,
                            category: p.category,
                            stock: p.stock ?? 99,
                            maxStock: p.stock ?? 99,
                          })
                        }
                        className="ml-2 px-2.5 py-1.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white text-[10px] font-mono font-bold rounded-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ekle</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Alt Özet ve Aksiyonlar */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-slate-50/90 border-t border-slate-200 space-y-4">
              {/* 3. Paket / Set İndirimi Teşviki (Sepette 1 ürün varsa) */}
              {items.length === 1 && (
                <div className="p-2.5 bg-orange-50/80 border border-orange-200/80 rounded-xs text-[11px] font-mono text-orange-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F27A1A] shrink-0" />
                  <span>Sepete 1 parça daha ekleyin, <strong>%5 Set İndirimi</strong> anında kazanın! 🎯</span>
                </div>
              )}

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

              {/* Fiyat Detayları veya Davetiye Koruması */}
              {isSalesAllowed ? (
                <>
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

                    {bundleDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Çoklu Alım / Set İndirimi (%5)</span>
                        </span>
                        <span>-{bundleDiscount.toLocaleString("tr-TR")} ₺</span>
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
                </>
              ) : (
                <div className="border-t border-slate-200 pt-3 space-y-3">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-950">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span>Katalog Modu (Fiyatlar Korumalıdır)</span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-sans">
                      Sitemiz halka açık perakende satış yapmamaktadır. Fiyatları görmek ve talep iletmek için VIP davetiye kodunuzu giriniz.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsVipModalOpen(true);
                      }}
                      className="w-full py-2.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>VIP Davetiye Kodu Gir</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
