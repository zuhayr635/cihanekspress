"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  Building2,
  MessageCircle,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Wrench,
  AlertCircle,
  Clock,
  Sparkles,
  FileText,
  Lock,
  KeyRound,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discountAmount,
    discountPercent,
    shippingFee,
    total,
    appliedCoupon,
    clearCart,
    storeSettings,
    isSalesAllowed,
    setIsVipModalOpen,
  } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState("İstanbul");
  const [district, setDistrict] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"WHATSAPP" | "BANK_TRANSFER">("WHATSAPP");
  const [selectedSafeMemo, setSelectedSafeMemo] = useState<string>(
    storeSettings?.safeMemos?.[0] || "3D CAD Çizim ve Teknik Danışmanlık Hizmet Bedeli"
  );

  // Atölye Montaj Hizmeti Opsiyonu
  const [includeAssemblyService, setIncludeAssemblyService] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const assemblyFee = includeAssemblyService ? 750 : 0;
  const finalOrderTotal = total + assemblyFee;

  if (!isSalesAllowed) {
    if (storeSettings?.honeypotEnabled) {
      if (storeSettings.honeypotMode === "NOT_FOUND") {
        return (
          <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 text-slate-800 font-sans">
            <h1 className="text-6xl font-black text-slate-300">404</h1>
            <h2 className="text-xl font-bold text-slate-900">Sayfa Bulunamadı</h2>
            <p className="text-xs text-slate-500 font-mono">
              Talep ettiğiniz adres sistemde mevcut değil veya sunucu yapılandırması nedeniyle taşınmış olabilir.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link href="/" className="px-4 py-2 bg-slate-900 text-white text-xs rounded-xs font-semibold font-mono">
                Ana Sayfaya Dön
              </Link>
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="text-[11px] text-slate-400 hover:text-slate-600 underline font-mono"
              >
                VIP Doğrulama
              </button>
            </div>
          </div>
        );
      }

      // Default Honeypot: Sahte Banka Altyapı Bakım Ekranı
      return (
        <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 mx-auto">
            <Wrench className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-amber-700 font-bold uppercase px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
              SİSTEM ÇEVRİMDIŞI / ALTYAPI ÇALIŞMASI
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
              Bankacılık & Takas Altyapısı Bakımda
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-mono">
              {storeSettings?.honeypotMessage ||
                "Sistem Bakımı: Bankacılık API entegrasyonumuzda altyapı çalışması yapılmaktadır. Lütfen daha sonra tekrar deneyiniz."}
            </p>
            <div className="p-3 bg-slate-100 rounded-xs text-[10px] font-mono text-slate-500 border border-slate-200">
              Hata Kodu: SEC-GATEWAY-OFFLINE-503 (EFT & Fast Takas Protokolü)
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs hover:bg-slate-800"
            >
              Kataloğa Dön
            </Link>
            <button
              onClick={() => setIsVipModalOpen(true)}
              className="text-xs text-slate-400 hover:text-slate-700 underline font-mono"
            >
              VIP Girişi Doğrula
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-950 uppercase">
            VIP Davetiye Girişi Zorunludur
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            cihanekspress.com bir RC crawler atölye sergi kataloğudur. Halka açık ticari e-ticaret satışı yapılmamaktadır. Sipariş oluşturabilmek ve fiyatları görebilmek için yöneticinin tahsis ettiği <strong>VIP Davetiye Kodunu</strong> girmeniz gerekmektedir.
          </p>
        </div>

        <button
          onClick={() => setIsVipModalOpen(true)}
          className="w-full py-3.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white text-xs uppercase tracking-wider font-bold rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          <span>VIP Davetiye Kodunu Gir</span>
        </button>

        <div>
          <Link
            href="/"
            className="inline-block text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            ← Kataloğa Geri Dön
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 text-slate-700">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-orange-600 mx-auto">
          <Wrench className="w-8 h-8" />
        </div>
        <h2 className="font-mono text-2xl text-slate-950 font-bold uppercase">Talep Listeniz Boş</h2>
        <p className="text-xs text-slate-500 font-mono max-w-sm mx-auto">
          Atölye siparişi oluşturabilmek için lütfen katalogdan crawler şasisi veya CNC parça seçiniz.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-slate-950 text-white text-xs font-mono uppercase tracking-widest font-black rounded-xs hover:bg-slate-900 transition-colors shadow-sm"
        >
          Kataloğa Dön
        </Link>
      </div>
    );
  }

  // Doğrudan WhatsApp Hızlı Sipariş URL'i
  const getDirectWhatsAppUrl = () => {
    const itemList = items
      .map(
        (i, idx) =>
          `🔹 *${idx + 1}. ${i.title}*${i.variantName ? ` [${i.variantName}]` : ""} - ${i.quantity} Adet × ${i.price.toLocaleString("tr-TR")} ₺`
      )
      .join("\n");

    const msg = `*CIHANPOL RC ATELIER — ATÖLYE SİPARİŞİ*\n\n*İletişim:* ${customerName || "İsimsiz Müşteri"} (${customerPhone || "Tel Belirtilmedi"})\n*Konum:* ${city}${district ? ` / ${district}` : ""}\n\n*Seçilen Parçalar / Projeler:*\n${itemList}\n${includeAssemblyService ? `\n⚙️ *Özel Atölye Montajı ve Test:* Dahil (+750 ₺)\n` : ""}\n*Atölye Referans Toplamı:* ${finalOrderTotal.toLocaleString("tr-TR")} ₺\n\nBu siparişin tedariği, montajı ve teslimatı hakkında görüşmek istiyorum.`;

    return getWhatsAppUrl(storeSettings?.whatsappPhone, msg);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName || !customerPhone || !shippingAddress || !city) {
      setErrorMessage("Lütfen ad, telefon, şehir ve açık adres alanlarını doldurunuz.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Sipariş öğelerini hazırla
      let finalItems = [...items];
      if (includeAssemblyService) {
        finalItems.push({
          id: "service-assembly-750",
          productId: "custom-assembly-service",
          title: "CIHANPOL Özel RC Crawler Atölye Montaj & CoG Kalibrasyon Hizmeti",
          price: 750,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
          maxStock: 99,
        });
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail: customerEmail || undefined,
          customerPhone,
          shippingAddress,
          city,
          district: district || undefined,
          paymentMethod,
          items: finalItems,
          appliedCoupon: appliedCoupon || undefined,
          discountAmount,
          customerNote: customerNote || undefined,
          safeMemo: selectedSafeMemo,
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        clearCart();

        if (paymentMethod === "WHATSAPP") {
          const itemList = finalItems
            .map(
              (i, idx) =>
                `${idx + 1}. ${i.title}${i.variantName ? ` (${i.variantName})` : ""} - ${i.quantity} Adet x ${i.price.toLocaleString("tr-TR")} ₺`
            )
            .join("\n");

          const msg = `*CIHANPOL RC ATELIER - SİPARİŞ KODU: ${data.order.orderNumber}*\n\n*Müşteri:* ${customerName} (${customerPhone})\n*Adres:* ${shippingAddress}, ${city}\n\n*Sipariş Edilen Parçalar:*\n${itemList}\n\n*Toplam Referans Tutar:* ${data.order.total.toLocaleString("tr-TR")} ₺\n\nSipariş talebim sisteme kaydedildi, teyit etmek istiyorum.`;
          window.open(getWhatsAppUrl(storeSettings?.whatsappPhone, msg), "_blank");
        }

        router.push(`/order-success/${data.order.orderNumber}`);
      } else {
        setErrorMessage(data.error || "Sipariş kaydedilirken bir hata oluştu.");
      }
    } catch {
      setErrorMessage("Sunucu bağlantı hatası oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-slate-900">
      {/* Üst Başlık ve Geri Dön */}
      <div className="mb-8 space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kataloğa Dön</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h1 className="font-mono text-2xl sm:text-3xl text-slate-950 font-black uppercase">
              Atölye Rezervasyon & Sipariş Masası
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Özel Hobi & Mühendislik Kataloğu — Birebir Atölye İletişimi
            </p>
          </div>
          <span className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-mono font-bold uppercase rounded-xs">
            ● Atölye Sipariş Sırası Aktif
          </span>
        </div>
      </div>

      {/* HIZLI WHATSAPP BANNER'I */}
      <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-xs flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xs bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <MessageCircle className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-950 uppercase tracking-wider">
              En Hızlı Yol: WhatsApp Üzerinden Doğrudan Sipariş
            </h3>
            <p className="text-[11px] text-slate-600 font-mono mt-0.5">
              Form doldurmakla uğraşmadan, seçtiğiniz {items.length} kalemi tek tıkla ustanın WhatsApp hattına aktarın.
            </p>
          </div>
        </div>
        <a
          href={getDirectWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-black uppercase tracking-widest rounded-xs transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageCircle className="w-4 h-4 fill-white text-white" />
          <span>WhatsApp ile Gönder</span>
        </a>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sol Kolon: Teslimat ve İletişim Bilgileri (7 Kolon) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. İletişim ve Teslimat Bilgileri */}
            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-xs space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-slate-950 pb-3 border-b border-slate-200 flex items-center justify-between">
                <span>1. Atölye İletişim & Teslimat Bilgileri</span>
                <span className="text-[10px] text-slate-500 font-normal">* Zorunlu Alanlar</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                    Adınız ve Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet Kaya"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-slate-300 text-slate-900 rounded-xs focus:outline-none focus:border-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                    Telefon Numarası (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0532 000 0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-slate-300 text-slate-900 rounded-xs focus:outline-none focus:border-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                    E-Posta Adresi (Opsiyonel)
                  </label>
                  <input
                    type="email"
                    placeholder="ahmet@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-slate-300 text-slate-900 rounded-xs focus:outline-none focus:border-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                    Şehir (İl) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="İstanbul"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-slate-300 text-slate-900 rounded-xs focus:outline-none focus:border-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                    İlçe (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    placeholder="Kadıköy"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-slate-300 text-slate-900 rounded-xs focus:outline-none focus:border-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                    Açık Teslimat Adresi *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Mahalle, Cadde, Sokak, No, Daire veya Atölyeden Elden Teslim Notu..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-slate-300 text-slate-900 rounded-xs focus:outline-none focus:border-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                    Atölye Notu (Araç / Şasi / Dişli Uyumluluk İstekleri)
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: TRX-4 Defender aracıma takılacak, ön portal pirinç ağırlık öncelikli."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-slate-300 text-slate-900 rounded-xs focus:outline-none focus:border-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* 2. Tercih Edilen Sipariş İletişim Metodu */}
            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-xs space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-slate-950 pb-3 border-b border-slate-200">
                2. Tercih Edilen Atölye İletişim Şekli
              </h2>

              <div className="space-y-3">
                {/* WhatsApp */}
                <label
                  className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                    paymentMethod === "WHATSAPP"
                      ? "border-emerald-600 bg-emerald-50/60 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "WHATSAPP"}
                      onChange={() => setPaymentMethod("WHATSAPP")}
                      className="accent-emerald-600"
                    />
                    <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-950 block uppercase">
                        WhatsApp Üzerinden Birebir İstişare & Teyit (Tavsiye Edilen)
                      </span>
                      <span className="text-[11px] font-mono text-slate-600">
                        Talebiniz kaydedilir ve WhatsApp üzerinden usta ile doğrudan görüşebilirsiniz.
                      </span>
                    </div>
                  </div>
                </label>

                {/* Havale / EFT */}
                <div
                  className={`p-4 border rounded-xs transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-slate-950 bg-slate-100 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "BANK_TRANSFER"}
                      onChange={() => setPaymentMethod("BANK_TRANSFER")}
                      className="accent-slate-900"
                    />
                    <Building2 className="w-5 h-5 text-slate-900 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-950 block uppercase">
                        Banka Havalesi / EFT / Dinamik IBAN
                      </span>
                      <span className="text-[11px] font-mono text-slate-600">
                        Sipariş onayında kuruşlu net tutar ve 15 dakikalık güvenli IBAN tahsis edilir.
                      </span>
                    </div>
                  </label>

                  {paymentMethod === "BANK_TRANSFER" && (
                    <div className="mt-4 pt-3.5 border-t border-slate-200 space-y-3">
                      <div className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xs text-emerald-950 text-xs font-mono">
                        <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold uppercase tracking-wider text-[11px]">
                            Akıllı Kuruş Eşleştirme & Sıfır-Açıklama (Zero-Memo):
                          </p>
                          <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                            Banka transferi yaparken açıklama kısmını <strong>TAMAMEN BOŞ</strong> bırakabilirsiniz. Siparişiniz kuruş hanesi (,XX ₺) üzerinden banka ekstresiyle saniyeler içinde otomatik eşleşir.
                          </p>
                        </div>
                      </div>

                      {storeSettings?.stealthCamouflageEnabled && storeSettings?.safeMemos && storeSettings.safeMemos.length > 0 && (
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-mono font-bold text-slate-800 uppercase">
                            Önerilen Masum Transfer Açıklaması:
                          </label>
                          <select
                            value={selectedSafeMemo}
                            onChange={(e) => setSelectedSafeMemo(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xs focus:outline-none focus:border-slate-900 text-slate-900"
                          >
                            {storeSettings.safeMemos.map((memo: string, idx: number) => (
                              <option key={idx} value={memo}>
                                {memo}
                              </option>
                            ))}
                          </select>
                          <span className="text-[10px] font-mono text-slate-500 block">
                            Bankanın yapay zeka ve denetim algoritmalarına karşı masum mühendislik hizmeti tanımı kullanılır.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Sepet Özeti & Atölye Montaj Seçeneği (5 Kolon) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xs space-y-6 sticky top-28 shadow-lg">
              <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-slate-950 pb-3 border-b border-slate-200">
                Talep Özeti ({items.length} Kalem)
              </h3>

              {/* Ürün Listesi */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                    <div className="relative w-12 h-16 bg-slate-50 rounded-xs overflow-hidden flex-shrink-0 border border-slate-200">
                      <Image src={item.image || item.imageUrl || "/cihanekspress-logo.png"} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs font-mono">
                      <h4 className="font-bold text-slate-950 line-clamp-1">{item.title}</h4>
                      {item.variantName && (
                        <p className="text-orange-600 text-[10px] mt-0.5 font-bold">{item.variantName}</p>
                      )}
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-slate-500">{item.quantity} Adet</span>
                        <span className="font-bold text-slate-950">
                          {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ATÖLYE MONTAJ VE TEST HİZMETİ OPSİYONU */}
              <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xs space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeAssemblyService}
                    onChange={(e) => setIncludeAssemblyService(e.target.checked)}
                    className="mt-0.5 accent-orange-600 w-4 h-4 rounded-xs"
                  />
                  <div className="text-xs font-mono">
                    <span className="font-bold text-slate-950 block">
                      CIHANPOL Atölye Montajı (+750 ₺)
                    </span>
                    <span className="text-[10px] text-slate-600 font-normal leading-snug block mt-0.5">
                      Pirinç parçalar, şaftlar ve motor atölyemizde toplanır, CoG dengelenir ve rampa testinden geçirilir.
                    </span>
                  </div>
                </label>
              </div>

              {/* Hesap Dökümü */}
              <div className="border-t border-slate-200 pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Parça / Malzeme Bedeli</span>
                  <span className="text-slate-950 font-bold">{subtotal.toLocaleString("tr-TR")} ₺</span>
                </div>

                {includeAssemblyService && (
                  <div className="flex justify-between text-orange-600 font-bold">
                    <span>Özel Montaj Hizmeti</span>
                    <span>+750 ₺</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Atölye Teslimat & Kargo</span>
                  <span className="text-emerald-700 font-bold">
                    {shippingFee === 0 ? "Atölye İkramı (Ücretsiz)" : `${shippingFee} ₺`}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-sm font-bold text-slate-950">
                  <span className="text-slate-950">Atölye Referans Toplamı</span>
                  <span className="font-mono text-xl font-black text-slate-950">
                    {finalOrderTotal.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white text-xs font-mono uppercase tracking-widest font-black rounded-xs transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Talebiniz İletiliyor...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Atölye Sipariş Talebini Gönder</span>
                  </>
                )}
              </button>

              {/* Hukuki Hobi Kalkanı Notu */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs text-[10px] font-mono text-slate-600 leading-normal flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <span>
                  Bu talep formu çevrim içi perakende satış değildir. Atölye parça tedariği ve özel montaj rezervasyonudur. Usta ile WhatsApp veya telefon üzerinden birebir teyit edilir.
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
