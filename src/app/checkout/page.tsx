"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
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

  // Atölye Montaj Hizmeti Opsiyonu
  const [includeAssemblyService, setIncludeAssemblyService] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const assemblyFee = includeAssemblyService ? 750 : 0;
  const finalOrderTotal = total + assemblyFee;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 text-stone-300">
        <div className="w-16 h-16 rounded-full bg-[#121622] border border-stone-800 flex items-center justify-center text-amber-400 mx-auto">
          <Wrench className="w-8 h-8" />
        </div>
        <h2 className="font-mono text-2xl text-white font-bold uppercase">Talep Listeniz Boş</h2>
        <p className="text-xs text-stone-400 font-mono max-w-sm mx-auto">
          Atölye siparişi oluşturabilmek için lütfen katalogdan crawler şasisi veya CNC parça seçiniz.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-amber-500 text-black text-xs font-mono uppercase tracking-widest font-black rounded-xs hover:bg-amber-400 transition-colors"
        >
          Kataloğa Dön
        </Link>
      </div>
    );
  }

  // Doğrudan WhatsApp Hızlı Sipariş URL'i
  const phone = storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905551234567";
  const getDirectWhatsAppUrl = () => {
    const itemList = items
      .map(
        (i, idx) =>
          `🔹 *${idx + 1}. ${i.title}*${i.variantName ? ` [${i.variantName}]` : ""} - ${i.quantity} Adet × ${i.price.toLocaleString("tr-TR")} ₺`
      )
      .join("\n");

    const msg = `*CIHANPOL RC ATELIER — ATÖLYE SİPARİŞİ*\n\n*İletişim:* ${customerName || "İsimsiz Müşteri"} (${customerPhone || "Tel Belirtilmedi"})\n*Konum:* ${city}${district ? ` / ${district}` : ""}\n\n*Seçilen Parçalar / Projeler:*\n${itemList}\n${includeAssemblyService ? `\n⚙️ *Özel Atölye Montajı ve Test:* Dahil (+750 ₺)\n` : ""}\n*Atölye Referans Toplamı:* ${finalOrderTotal.toLocaleString("tr-TR")} ₺\n\nBu siparişin tedariği, montajı ve teslimatı hakkında görüşmek istiyorum.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
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
      const finalItems = [...items];
      if (includeAssemblyService) {
        finalItems.push({
          id: `assembly-${Date.now()}`,
          productId: "service-assembly",
          title: "CIHANPOL Atölye Montajı, Yağlama ve 65° Eğim Kaya Testi",
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
          customerEmail: customerEmail || "musteri@cihanekspress.com",
          customerPhone,
          shippingAddress,
          city,
          district,
          customerNote: includeAssemblyService
            ? `[ATÖLYE MONTAJ TALEBİ] ${customerNote}`.trim()
            : customerNote,
          paymentMethod,
          items: finalItems,
          couponCode: appliedCoupon,
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        clearCart();

        // Eğer WhatsApp seçildiyse doğrudan WhatsApp'a yönlendir
        if (paymentMethod === "WHATSAPP") {
          const itemList = finalItems
            .map(
              (i, idx) =>
                `${idx + 1}. ${i.title}${i.variantName ? ` (${i.variantName})` : ""} - ${i.quantity} Adet x ${i.price.toLocaleString("tr-TR")} ₺`
            )
            .join("\n");

          const msg = `*CIHANPOL RC ATELIER - SİPARİŞ KODU: ${data.order.orderNumber}*\n\n*Müşteri:* ${customerName} (${customerPhone})\n*Adres:* ${shippingAddress}, ${city}\n\n*Sipariş Edilen Parçalar:*\n${itemList}\n\n*Toplam Referans Tutar:* ${data.order.total.toLocaleString("tr-TR")} ₺\n\nSipariş talebim sisteme kaydedildi, teyit etmek istiyorum.`;
          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-[#E2E8F0]">
      {/* Üst Başlık ve Geri Dön */}
      <div className="mb-8 space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kataloğa Dön</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#1E2536] pb-4">
          <div>
            <h1 className="font-mono text-2xl sm:text-3xl text-white font-black uppercase">
              Atölye Rezervasyon & Sipariş Masası
            </h1>
            <p className="text-xs text-stone-400 font-mono mt-1">
              Özel Hobi & Mühendislik Kataloğu — Birebir Atölye İletişimi
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase rounded-xs">
            ● Atölye Sipariş Sırası Aktif
          </span>
        </div>
      </div>

      {/* HIZLI WHATSAPP BANNER'I */}
      <div className="mb-8 p-5 bg-gradient-to-r from-[#0D2418] via-[#101F18] to-[#0D151F] border border-[#25D366]/40 rounded-xs flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-[#25D366]/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xs bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] flex-shrink-0">
            <MessageCircle className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              En Hızlı Yol: WhatsApp Üzerinden Doğrudan Sipariş
            </h3>
            <p className="text-[11px] text-stone-300 font-mono mt-0.5">
              Form doldurmakla uğraşmadan, seçtiğiniz {items.length} kalemi tek tıkla ustanın WhatsApp hattına aktarın.
            </p>
          </div>
        </div>
        <a
          href={getDirectWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-mono font-black uppercase tracking-widest rounded-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20"
        >
          <MessageCircle className="w-4 h-4 fill-black text-black" />
          <span>WhatsApp ile Gönder</span>
        </a>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sol Kolon: Teslimat ve İletişim Bilgileri (7 Kolon) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. İletişim ve Teslimat Bilgileri */}
            <div className="bg-[#0E1119] border border-[#1E2536] p-6 sm:p-8 rounded-xs space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400 pb-3 border-b border-stone-800/80 flex items-center justify-between">
                <span>1. Atölye İletişim & Teslimat Bilgileri</span>
                <span className="text-[10px] text-stone-500 font-normal">* Zorunlu Alanlar</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    Adınız ve Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet Kaya"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#080B10] border border-[#232B3D] text-white rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    Telefon Numarası (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0532 000 0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#080B10] border border-[#232B3D] text-white rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    E-Posta Adresi (Opsiyonel)
                  </label>
                  <input
                    type="email"
                    placeholder="ahmet@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#080B10] border border-[#232B3D] text-white rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    Şehir (İl) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="İstanbul"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#080B10] border border-[#232B3D] text-white rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    İlçe (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    placeholder="Kadıköy"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#080B10] border border-[#232B3D] text-white rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    Açık Teslimat Adresi *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Mahalle, Cadde, Sokak, No, Daire veya Atölyeden Elden Teslim Notu..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#080B10] border border-[#232B3D] text-white rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    Atölye Notu (Araç / Şasi / Dişli Uyumluluk İstekleri)
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: TRX-4 Defender aracıma takılacak, ön portal pirinç ağırlık öncelikli."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#080B10] border border-[#232B3D] text-white rounded-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                  />
                </div>
              </div>
            </div>

            {/* 2. Tercih Edilen Sipariş İletişim Metodu */}
            <div className="bg-[#0E1119] border border-[#1E2536] p-6 sm:p-8 rounded-xs space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400 pb-3 border-b border-stone-800/80">
                2. Tercih Edilen Atölye İletişim Şekli
              </h2>

              <div className="space-y-3">
                {/* WhatsApp */}
                <label
                  className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                    paymentMethod === "WHATSAPP"
                      ? "border-[#25D366] bg-[#0E1E17]"
                      : "border-[#1E2536] bg-[#080B10] hover:border-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "WHATSAPP"}
                      onChange={() => setPaymentMethod("WHATSAPP")}
                      className="accent-[#25D366]"
                    />
                    <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]" />
                    <div>
                      <span className="text-xs font-mono font-bold text-white block uppercase">
                        WhatsApp Üzerinden Birebir İstişare & Teyit (Tavsiye Edilen)
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        Talebiniz kaydedilir ve WhatsApp üzerinden usta ile doğrudan görüşebilirsiniz.
                      </span>
                    </div>
                  </div>
                </label>

                {/* Havale / EFT */}
                <label
                  className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-amber-400 bg-[#161D2A]"
                      : "border-[#1E2536] bg-[#080B10] hover:border-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "BANK_TRANSFER"}
                      onChange={() => setPaymentMethod("BANK_TRANSFER")}
                      className="accent-amber-500"
                    />
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-mono font-bold text-white block uppercase">
                        Banka Havalesi / EFT / Atölyede Elden Teslimat
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        Sipariş sonrası atölye IBAN bilgisi gösterilir ve sipariş teyidi için aranacaksınız.
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Sepet Özeti & Atölye Montaj Seçeneği (5 Kolon) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0E1119] border border-[#1E2536] p-6 rounded-xs space-y-6 sticky top-28 shadow-2xl">
              <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400 pb-3 border-b border-stone-800/80">
                Talep Özeti ({items.length} Kalem)
              </h3>

              {/* Ürün Listesi */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-[#1A2130]">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                    <div className="relative w-12 h-16 bg-[#080B10] rounded-xs overflow-hidden flex-shrink-0 border border-stone-800">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs font-mono">
                      <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                      {item.variantName && (
                        <p className="text-amber-400/80 text-[10px] mt-0.5">{item.variantName}</p>
                      )}
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-stone-400">{item.quantity} Adet</span>
                        <span className="font-bold text-amber-400">
                          {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ATÖLYE MONTAJ VE TEST HİZMETİ OPSİYONU */}
              <div className="p-3.5 bg-[#121622] border border-amber-500/30 rounded-xs space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeAssemblyService}
                    onChange={(e) => setIncludeAssemblyService(e.target.checked)}
                    className="mt-0.5 accent-amber-500 w-4 h-4 rounded-xs"
                  />
                  <div className="text-xs font-mono">
                    <span className="font-bold text-white block">
                      CIHANPOL Atölye Montajı (+750 ₺)
                    </span>
                    <span className="text-[10px] text-stone-400 font-light leading-snug block mt-0.5">
                      Pirinç parçalar, şaftlar ve motor atölyemizde toplanır, CoG dengelenir ve rampa testinden geçirilir.
                    </span>
                  </div>
                </label>
              </div>

              {/* Hesap Dökümü */}
              <div className="border-t border-[#1E2536] pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-stone-400">
                  <span>Parça / Malzeme Bedeli</span>
                  <span className="text-white font-bold">{subtotal.toLocaleString("tr-TR")} ₺</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>
                      {discountPercent > 0 ? `Kulüp İndirimi (%${discountPercent})` : "İndirim"}
                    </span>
                    <span>-{discountAmount.toLocaleString("tr-TR")} ₺</span>
                  </div>
                )}

                {includeAssemblyService && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>Özel Montaj Hizmeti</span>
                    <span>+750 ₺</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-400">
                  <span>Atölye Teslimat & Kargo</span>
                  <span className="text-emerald-400 font-bold">
                    {shippingFee === 0 ? "Atölye İkramı (Ücretsiz)" : `${shippingFee} ₺`}
                  </span>
                </div>

                <div className="border-t border-[#1E2536] pt-3 flex justify-between items-baseline text-sm font-bold text-white">
                  <span className="text-amber-400">Atölye Referans Toplamı</span>
                  <span className="font-mono text-xl font-black text-amber-400">
                    {finalOrderTotal.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono uppercase tracking-widest font-black rounded-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Talebiniz İletiliyor...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Atölye Sipariş Talebini Gönder</span>
                  </>
                )}
              </button>

              {/* Hukuki Hobi Kalkanı Notu */}
              <div className="p-3 bg-[#080B10] border border-stone-800 rounded-xs text-[10px] font-mono text-stone-400 leading-normal flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
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
