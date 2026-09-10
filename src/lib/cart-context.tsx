"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, VipSessionData, StoreSettingsData } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  bundleDiscount: number;
  shippingFee: number;
  total: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  vipSession: VipSessionData;
  storeSettings: StoreSettingsData | null;
  refreshStoreSettings: () => Promise<void>;
  refreshVipStatus: () => Promise<void>;
  selectedVehicle: string | null;
  setSelectedVehicle: (v: string | null) => void;
  isVipModalOpen: boolean;
  setIsVipModalOpen: (open: boolean) => void;
  isSalesAllowed: boolean;
  // Favori Listesi (Wishlist) & Son Gezilenler
  wishlist: any[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  recentlyViewed: any[];
  addRecentlyViewed: (product: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [vipSession, setVipSession] = useState<VipSessionData>({ isVip: false });
  const [storeSettings, setStoreSettings] = useState<StoreSettingsData | null>(null);
  const [selectedVehicle, setSelectedVehicleState] = useState<string | null>(null);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  // Favoriler (Wishlist) & Son Gezilenler
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  const isSalesAllowed =
    !storeSettings?.panicMode &&
    (storeSettings?.storeMode === "PUBLIC_SALE" || vipSession.isVip);

  const setSelectedVehicle = (v: string | null) => {
    setSelectedVehicleState(v);
    try {
      if (v) localStorage.setItem("rc_selected_vehicle", v);
      else localStorage.removeItem("rc_selected_vehicle");
    } catch {
      // ignore
    }
  };

  // Favori Ekle / Kaldır
  const toggleWishlist = (product: any) => {
    if (!product || !product.id) return;
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      const updated = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
      try {
        localStorage.setItem("luxe_wishlist", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Son Gezilenler
  const addRecentlyViewed = (product: any) => {
    if (!product || !product.id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10);
      try {
        localStorage.setItem("luxe_recently_viewed", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Yerel depolamadan sepet, favoriler ve son gezilenleri yükle
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("luxe_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedVehicle = localStorage.getItem("rc_selected_vehicle");
      if (savedVehicle) {
        setSelectedVehicleState(savedVehicle);
      }
      const savedWishlist = localStorage.getItem("luxe_wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      const savedRecent = localStorage.getItem("luxe_recently_viewed");
      if (savedRecent) {
        setRecentlyViewed(JSON.parse(savedRecent));
      }
    } catch {
      // localStorage erişim hatası
    }

    refreshVipStatus();
    fetchStoreSettings();
  }, []);

  // Sepet değiştikçe kaydet
  useEffect(() => {
    try {
      localStorage.setItem("luxe_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const refreshVipStatus = async () => {
    try {
      const res = await fetch("/api/vip/status");
      const data = await res.json();
      setVipSession(data);
    } catch {
      setVipSession({ isVip: false });
    }
  };

  const fetchStoreSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setStoreSettings(data);
      }
    } catch {
      // ignore
    }
  };

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, item.maxStock || 99);
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i));
      }
      return [...prev, { ...item, quantity: Math.min(quantity, item.maxStock || 99) }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(quantity, i.maxStock || 99) } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    try {
      localStorage.removeItem("luxe_cart");
    } catch {
      // ignore
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(code);
        setCouponDiscount(data.discountAmount);
        return { success: true, message: data.message || "Kupon uygulandı!" };
      } else {
        return { success: false, message: data.error || "Geçersiz kupon." };
      }
    } catch {
      return { success: false, message: "Kupon doğrulanırken hata oluştu." };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // VIP Davetiye indirimi varsa uygula
  const vipDiscountPercent = vipSession.discountPercent || 0;
  const vipDiscountAmount = (subtotal * vipDiscountPercent) / 100;
  const discountAmount = Math.max(vipDiscountAmount, couponDiscount);

  // 3. Paket / Set İndirimi: Sepette 2 veya daha fazla ürün varsa otomatik %5 Set İndirimi
  const bundleDiscount = itemCount >= 2 ? Math.round(subtotal * 0.05) : 0;

  const freeThreshold = storeSettings?.freeShippingThreshold ?? 2000;
  const defaultFee = storeSettings?.defaultShippingFee ?? 95;
  const shippingFee = subtotal > 0 && subtotal < freeThreshold ? defaultFee : 0;
  const total = Math.max(0, subtotal - discountAmount - bundleDiscount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemCount,
        subtotal,
        discountAmount,
        discountPercent: vipDiscountPercent,
        bundleDiscount,
        shippingFee,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        vipSession,
        storeSettings,
        refreshStoreSettings: fetchStoreSettings,
        refreshVipStatus,
        selectedVehicle,
        setSelectedVehicle,
        isVipModalOpen,
        setIsVipModalOpen,
        isSalesAllowed,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        recentlyViewed,
        addRecentlyViewed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
