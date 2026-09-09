"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { X, Plus, Minus, Trash2, Tag, ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";

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

  // WhatsApp Sipariş Linki Oluşturucu
  const getWhatsAppOrderUrl = () => {
    const phone = storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905551234567";
    const itemList = items
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.title}${i.variantName ? ` (${i.variantName})` : ""} - ${i.quantity} Adet x ${i.price.toLocaleString("tr-TR")} ₺`
      )
      .join("\n");

    const message = `*ATELIER CIHANPOL - YENİ SİPARİŞ TALEBİ*\n\n*Ürünler:*\n${itemList}\n\n*Ara Toplam:* ${subtotal.toLocaleString("tr-TR")} ₺\n*İndirim:* -${discountAmount.toLocaleString("tr-TR")} ₺\n*Kargo:* ${shippingFee === 0 ? "Ücretsiz" : `${shippingFee} ₺`}\n*Genel Toplam:* ${total.toLocaleString("tr-TR")} ₺\n\nAdres ve ödeme detayları için iletişime geçmek istiyorum.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] border-l border-stone-300 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-stone-900 stroke-[1.5]" />
              <h2 className="font-serif text-lg tracking-wider text-stone-900 font-medium uppercase">
                Alışveriş Çantanız
              </h2>
              <span className="text-xs text-stone-500 font-mono">({items.length})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-black rounded-sm transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ürün Listesi */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-stone-200">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-500 space-y-3">
                <ShoppingBag className="w-12 h-12 stroke-[1] text-stone-300" />
                <p className="text-sm font-medium text-stone-700">Çantanız henüz boş.</p>
                <p className="text-xs text-stone-400 max-w-xs">
                  Özel koleksiyonumuzdan dilediğiniz parçayı ekleyebilirsiniz.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 border border-stone-300 text-stone-800 text-xs uppercase tracking-wider font-medium hover:bg-stone-100 transition-all rounded-sm"
                >
                  Koleksiyonu Keşfet
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-6 first:pt-0 flex gap-4">
                  <div className="relative w-20 h-24 bg-stone-100 rounded-sm overflow-hidden flex-shrink-0 border border-stone-200">
                    <Image
                      src={item.image || "https://images.unsplash.com/photo-1539533018447-63fcce667883?auto=format&fit=crop&w=400&q=80"}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-stone-900 leading-snug">
                          {item.title}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-0.5"
                          title="Ürünü Kaldır"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variantName && (
                        <p className="text-xs text-stone-500 mt-0.5 font-sans">
                          {item.variantName}
                        </p>
                      )}
                      <p className="text-xs font-mono font-medium text-stone-900 mt-1">
                        {item.price.toLocaleString("tr-TR")} ₺
                      </p>
                    </div>

                    {/* Miktar Kontrolü */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-stone-300 rounded-sm bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-stone-600 hover:text-black transition-colors"
                          aria-label="Azalt"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-mono text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-stone-600 hover:text-black transition-colors"
                          aria-label="Artır"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-semibold text-stone-900">
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
            <div className="p-6 bg-white border-t border-stone-200 space-y-4">
              {/* Kupon Alanı */}
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="İndirim Kuponu"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-sm focus:outline-none focus:border-black uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplying || !couponCode.trim()}
                  className="px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-black transition-colors disabled:opacity-50"
                >
                  Uygula
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-sm">
                  <span>Kupon Aktif: {appliedCoupon}</span>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-black text-[11px] underline"
                  >
                    Kaldır
                  </button>
                </div>
              )}

              {couponMsg && (
                <p
                  className={`text-xs ${
                    couponMsg.type === "success" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {couponMsg.text}
                </p>
              )}

              {/* Fiyat Detayları */}
              <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="font-mono text-stone-900">
                    {subtotal.toLocaleString("tr-TR")} ₺
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>
                      {discountPercent > 0 ? `VIP İndirimi (%${discountPercent})` : "Kupon İndirimi"}
                    </span>
                    <span className="font-mono">
                      -{discountAmount.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Kargo</span>
                  <span className="font-mono text-stone-900">
                    {shippingFee === 0 ? "Ücretsiz" : `${shippingFee} ₺`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-stone-950 border-t border-stone-200 pt-2">
                  <span>Toplam</span>
                  <span className="font-mono text-base">
                    {total.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
              </div>

              {/* Butonlar */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white text-xs uppercase tracking-widest font-medium rounded-sm hover:bg-stone-800 transition-all shadow-sm group"
                >
                  <span>Siparişi Tamamla</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-black text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#20bd5a] transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>WhatsApp ile Hızlı Sipariş</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
