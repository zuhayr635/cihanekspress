"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  Wrench,
} from "lucide-react";

interface OrderItem {
  id: string;
  productTitle: string;
  variantName?: string | null;
  price: number;
  quantity: number;
  total: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  total: number;
  shippingFee: number;
  discountTotal: number;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  receiptUrl?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), phone: phone.trim() }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || "Sipariş bulunamadı. Lütfen bilgilerinizi kontrol ediniz.");
        setOrder(null);
      }
    } catch {
      setError("Bağlantı hatası oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPED":
        return 3;
      case "COMPLETED":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 1;

  return (
    <div className="min-h-[80vh] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-[#E2E8F0]">
      {/* Geri Dön Linki */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Garaja Dön</span>
        </Link>
      </div>

      {/* Başlık */}
      <div className="space-y-2 border-b border-[#1E2535] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase tracking-widest font-bold rounded-xs">
          <Truck className="w-3.5 h-3.5" />
          <span>Live Dispatch Telemetry</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl text-white font-extrabold uppercase">
          Sipariş & Kargo Durum Takibi
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 font-light max-w-xl">
          Sipariş kodunuz ve telefon numaranız ile atölye hazırlık, test ve kargo sevk durumunuzu canlı sorgulayın.
        </p>
      </div>

      {/* Sorgulama Formu */}
      <div className="tactical-box p-6 sm:p-8 bg-[#11151F] border border-[#222B3B] rounded-xs shadow-xl">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5 space-y-1.5">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold">
              Sipariş Kodu
            </label>
            <input
              type="text"
              required
              placeholder="Örn: CHP-174154"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-stone-700 rounded-xs text-xs font-mono text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="sm:col-span-4 space-y-1.5">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold">
              Telefon Numarası
            </label>
            <input
              type="text"
              required
              placeholder="05XX XXX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-stone-700 rounded-xs text-xs font-mono text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-amber-500 text-black text-xs font-mono uppercase tracking-widest font-black rounded-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? "Sorgulanıyor..." : "Sorgula"}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono rounded-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Sipariş Sonucu */}
      {order && (
        <div className="space-y-8 animate-in fade-in">
          {/* Durum Zaman Çizelgesi (Timeline) */}
          <div className="tactical-box p-6 sm:p-8 bg-[#11151F] border border-[#222B3B] rounded-xs space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Sipariş Kaydı</span>
                <h3 className="font-mono text-lg text-white font-bold">{order.orderNumber}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-stone-400 block">Sipariş Tarihi</span>
                <span className="text-xs font-mono text-stone-300">
                  {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Aşama Adımları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-3.5 rounded-xs border text-left space-y-1.5 ${
                currentStep >= 1 ? "border-amber-400 bg-[#161D2A]" : "border-stone-800 bg-[#0E1117] opacity-40"
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${currentStep >= 1 ? "text-amber-400" : "text-stone-600"}`} />
                  <span>1. Sipariş Alındı</span>
                </div>
                <p className="text-[10px] text-stone-400 font-mono">Kayıt oluşturuldu</p>
              </div>

              <div className={`p-3.5 rounded-xs border text-left space-y-1.5 ${
                currentStep >= 2 ? "border-amber-400 bg-[#161D2A]" : "border-stone-800 bg-[#0E1117] opacity-40"
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                  <Clock className={`w-3.5 h-3.5 ${currentStep >= 2 ? "text-amber-400" : "text-stone-600"}`} />
                  <span>2. Ödeme Onayı</span>
                </div>
                <p className="text-[10px] text-stone-400 font-mono">
                  {order.paymentStatus === "COMPLETED" ? "Ödeme doğrulandı" : "Dekont inceleniyor"}
                </p>
              </div>

              <div className={`p-3.5 rounded-xs border text-left space-y-1.5 ${
                currentStep >= 3 ? "border-amber-400 bg-[#161D2A]" : "border-stone-800 bg-[#0E1117] opacity-40"
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                  <Truck className={`w-3.5 h-3.5 ${currentStep >= 3 ? "text-amber-400" : "text-stone-600"}`} />
                  <span>3. Kargoya Verildi</span>
                </div>
                <p className="text-[10px] text-stone-400 font-mono">
                  {order.trackingNumber ? `Takip: ${order.trackingNumber}` : "Sevk aşamasında"}
                </p>
              </div>

              <div className={`p-3.5 rounded-xs border text-left space-y-1.5 ${
                currentStep >= 4 ? "border-emerald-500 bg-emerald-950/40" : "border-stone-800 bg-[#0E1117] opacity-40"
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                  <ShieldCheck className={`w-3.5 h-3.5 ${currentStep >= 4 ? "text-emerald-400" : "text-stone-600"}`} />
                  <span>4. Teslim Edildi</span>
                </div>
                <p className="text-[10px] text-stone-400 font-mono">Başarıyla tamamlandı</p>
              </div>
            </div>

            {/* Kargo Takip Linki (Varsa) */}
            {order.trackingNumber && (
              <div className="p-4 bg-[#141A25] border border-amber-500/40 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase">Kargo Takip Numarası:</span>
                  <p className="text-sm font-mono font-extrabold text-amber-400">{order.trackingNumber}</p>
                </div>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-amber-500 text-black text-xs font-mono uppercase font-bold rounded-xs hover:bg-amber-400 transition-colors inline-flex items-center gap-1.5 w-fit"
                  >
                    <span>Kargo Takip Sayfasına Git</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Parça Detayları */}
          <div className="tactical-box p-6 bg-[#11151F] border border-[#222B3B] rounded-xs space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-white border-b border-stone-800 pb-3">
              Siparişteki RC Crawler Parçaları
            </h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs font-mono text-stone-300">
                  <div>
                    <span className="font-bold text-white">{item.productTitle}</span>
                    {item.variantName && (
                      <span className="text-stone-400 block text-[11px]">{item.variantName}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span>{item.quantity} Adet</span>
                    <span className="text-amber-400 font-bold block">{item.total.toLocaleString("tr-TR")} ₺</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-800 flex justify-between font-mono text-sm">
              <span className="font-bold text-white">Toplam Tutar:</span>
              <span className="font-extrabold text-amber-400">{order.total.toLocaleString("tr-TR")} ₺</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
