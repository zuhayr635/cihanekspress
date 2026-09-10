"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export default function WishlistDrawer() {
  const {
    wishlist,
    toggleWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    addItem,
    setIsCartOpen,
  } = useCart();

  if (!isWishlistOpen) return null;

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      stock: product.stock ?? 99,
      maxStock: product.stock ?? 99,
    });
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      handleAddToCart(product);
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-12">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-900">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-white/95 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xs bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <Heart className="w-4 h-4 fill-red-600" />
              </div>
              <div>
                <h2 className="font-mono text-sm tracking-wider text-slate-950 font-bold uppercase">
                  Favori Parçalarım
                </h2>
                <p className="text-[10px] font-mono text-slate-500">
                  {wishlist.length} Parça Kayıtlı
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xs transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-slate-100">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                  <Heart className="w-8 h-8 stroke-[1.2]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-mono font-bold text-slate-950 uppercase">
                    Favori Listeniz Boş
                  </p>
                  <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                    İncelediğiniz RC Crawler modellerini ve parçalarını kalp ikonuna tıklayarak buraya ekleyebilirsiniz.
                  </p>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer"
                >
                  Kataloğu Keşfet
                </button>
              </div>
            ) : (
              wishlist.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                  <div className="w-16 h-16 relative bg-slate-50 border border-slate-200 rounded-xs overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl || "/cihanekspress-logo.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/products/${item.slug || item.id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="text-xs font-mono font-bold text-slate-900 hover:text-[#F27A1A] line-clamp-1 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs font-mono font-bold text-[#F27A1A]">
                      {Number(item.price).toLocaleString("tr-TR")} ₺
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-[#F27A1A] text-white text-[10px] font-mono font-bold uppercase rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Sepete Ekle</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(item)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Favorilerden Kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {wishlist.length > 0 && (
            <div className="p-5 sm:p-6 bg-slate-50/90 border-t border-slate-200 space-y-3">
              <button
                onClick={handleAddAllToCart}
                className="w-full py-3 bg-[#F27A1A] hover:bg-[#E06A0A] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Tümünü Sepete Ekle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
