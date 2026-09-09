"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import {
  CreditCard,
  Building2,
  MessageCircle,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Wrench,
  AlertCircle,
  Truck,
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
    vipSession,
    storeSettings,
  } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState("�stanbul");
  const [district, setDistrict] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"BANK_TRANSFER" | "WHATSAPP" | "CREDIT_CARD">("BANK_TRANSFER");

  // At�lye Montaj Hizmeti Opsiyonu
  const [includeAssemblyService, setIncludeAssemblyService] = useState(false);

  // Kredi Kart� Sim�lat�r�
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const assemblyFee = includeAssemblyService ? 750 : 0;
  const finalOrderTotal = total + assemblyFee;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 text-stone-300">
        <h2 className="font-mono text-2xl text-white font-bold">Sepetiniz Bo�</h2>
        <p className="text-xs text-stone-400 font-light">
          �deme yapabilmek i�in l�tfen katalo�umuzdan crawler par�as� veya ara� se�iniz.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-amber-500 text-black text-xs font-mono uppercase tracking-widest font-bold rounded-xs hover:bg-amber-400 transition-colors"
        >
          Garaj Katalo�una D�n
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !city) {
      setErrorMessage("L�tfen t�m zorunlu alanlar� doldurunuz.");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalItems = [...items];
      if (includeAssemblyService) {
        finalItems.push({
          id: `assembly-${Date.now()}`,
          productId: "service-assembly",
          title: "CIHANPOL At�lye Montaj�, Ya�lama ve 65� E�im Kaya Testi",
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
          customerEmail,
          customerPhone,
          shippingAddress,
          city,
          district,
          customerNote: includeAssemblyService
            ? `[AT�LYE MONTAJ TALEB�] ${customerNote}`.trim()
            : customerNote,
          paymentMethod,
          items: finalItems,
          couponCode: appliedCoupon,
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        clearCart();

        // E�er WhatsApp se�ildiyse do�rudan WhatsApp'a y�nlendir
        if (paymentMethod === "WHATSAPP") {
          const phone = storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905551234567";
          const itemList = finalItems
            .map(
              (i, idx) =>
                `${idx + 1}. ${i.title}${i.variantName ? ` (${i.variantName})` : ""} - ${i.quantity} Adet x ${i.price.toLocaleString("tr-TR")} ?`
            )
            .join("\n");

          const msg = `*CIHANPOL RC LAB - S�PAR�� KODU: ${data.order.orderNumber}*\n\n*M��teri:* ${customerName} (${customerPhone})\n*Adres:* ${shippingAddress}, ${city}\n\n*Sipari� Edilen Par�alar:*\n${itemList}\n\n*Toplam Tutar:* ${data.order.total.toLocaleString("tr-TR")} ?\n\nSipari�im sisteme kaydedildi, onaylamak ve �deme yapmak istiyorum.`;
          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
        }

        router.push(`/order-success/${data.order.orderNumber}`);
      } else {
        setErrorMessage(data.error || "Sipari� kaydedilirken bir hata olu�tu.");
      }
    } catch {
      setErrorMessage("Sunucu ba�lant� hatas� olu�tu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-[#E2E8F0]">
      <div className="mb-8 space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Garaja D�n</span>
        </Link>
        <h1 className="font-mono text-2xl sm:text-4xl text-white font-black uppercase">
          G�venli �deme & Sipari�
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sol Kolon: Teslimat ve �deme (7 Kolon) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. M��teri Bilgileri */}
            <div className="tactical-box bg-[#11151F] border border-[#222B3B] p-6 sm:p-8 rounded-xs space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400 pb-3 border-b border-stone-800 flex items-center gap-2">
                <span>1. Teslimat & �leti�im Bilgileri</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    Ad�n�z ve Soyad�n�z *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ahmet Y�lmaz"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#0B0E14] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    E-Posta Adresi *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ahmet@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#0B0E14] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    Telefon Numaras� *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0532 000 0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#0B0E14] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    �ehir (�l) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="�stanbul"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#0B0E14] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    �l�e (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    placeholder="Kad�k�y"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#0B0E14] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    A��k Teslimat Adresi *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Mahalle, Cadde, Sokak, Bina No, Daire..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#0B0E14] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                    Sipari� Notu (�asi / Par�a �zel Talepleri)
                  </label>
                  <input
                    type="text"
                    placeholder="�rn: Ara� �asim TRX-4 Defender 324mm, pirin� a��rl�klar �n aksa tak�ls�n."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#0B0E14] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* 2. �deme Y�ntemi Se�imi */}
            <div className="tactical-box bg-[#11151F] border border-[#222B3B] p-6 sm:p-8 rounded-xs space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400 pb-3 border-b border-stone-800">
                2. �deme Y�ntemi Belirleyin
              </h2>

              <div className="space-y-3">
                {/* Havale / EFT */}
                <label className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-amber-400 bg-[#161D2A] shadow-md shadow-amber-500/10"
                    : "border-stone-800 bg-[#0B0E14] hover:border-stone-700"
                }`}>
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
                        Banka Havalesi / EFT (Do�rudan Garaj �ndirimi)
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        Sipari� sonras� IBAN bilgileri ve dekont y�kleme ekran� a��l�r.
                      </span>
                    </div>
                  </div>
                </label>

                {/* WhatsApp */}
                <label className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                  paymentMethod === "WHATSAPP"
                    ? "border-amber-400 bg-[#161D2A] shadow-md shadow-amber-500/10"
                    : "border-stone-800 bg-[#0B0E14] hover:border-stone-700"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "WHATSAPP"}
                      onChange={() => setPaymentMethod("WHATSAPP")}
                      className="accent-amber-500"
                    />
                    <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]" />
                    <div>
                      <span className="text-xs font-mono font-bold text-white block uppercase">
                        WhatsApp �le An�nda Onayl� Sipari�
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        Sipari�iniz do�rudan RC dan��man�m�za formatl� mesaj olarak iletilir.
                      </span>
                    </div>
                  </div>
                </label>

                {/* Kredi Kart� */}
                <label className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                  paymentMethod === "CREDIT_CARD"
                    ? "border-amber-400 bg-[#161D2A] shadow-md shadow-amber-500/10"
                    : "border-stone-800 bg-[#0B0E14] hover:border-stone-700"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "CREDIT_CARD"}
                      onChange={() => setPaymentMethod("CREDIT_CARD")}
                      className="accent-amber-500"
                    />
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-mono font-bold text-white block uppercase">
                        Kredi / Banka Kart� (3D Secure 256-Bit SSL)
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        T�m banka ve kredi kartlar� ile an�nda tek �ekim veya taksitli �deme.
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Kart Bilgileri Alan� */}
              {paymentMethod === "CREDIT_CARD" && (
                <div className="p-4 bg-[#0B0E14] border border-stone-800 rounded-xs space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                      Kart �zerindeki �sim
                    </label>
                    <input
                      type="text"
                      placeholder="AHMET YILMAZ"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-[#11151F] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                      Kart Numaras�
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="**** **** **** ****"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-[#11151F] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                        Son Kullanma (AA/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono bg-[#11151F] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                        G�venlik Kodu (CVC)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="***"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono bg-[#11151F] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sa� Kolon: Sepet �zeti & At�lye Montaj Se�ene�i (5 Kolon) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="tactical-box bg-[#11151F] border border-[#222B3B] p-6 rounded-xs space-y-6 sticky top-28 shadow-2xl">
              <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400 pb-3 border-b border-stone-800">
                Sipari� �zeti ({items.length} Par�a)
              </h3>

              {/* �r�n Listesi */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-stone-800/60">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                    <div className="relative w-12 h-16 bg-[#0B0E14] rounded-xs overflow-hidden flex-shrink-0 border border-stone-800">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs font-mono">
                      <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                      {item.variantName && (
                        <p className="text-stone-400 text-[11px] mt-0.5">{item.variantName}</p>
                      )}
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-stone-400">{item.quantity} Adet</span>
                        <span className="font-bold text-amber-400">
                          {(item.price * item.quantity).toLocaleString("tr-TR")} ?
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AT�LYE MONTAJ VE TEST H�ZMET� OPS�YONU */}
              <div className="p-3.5 bg-[#141A25] border border-amber-500/30 rounded-xs space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeAssemblyService}
                    onChange={(e) => setIncludeAssemblyService(e.target.checked)}
                    className="mt-0.5 accent-amber-500 w-4 h-4 rounded-xs"
                  />
                  <div className="text-xs font-mono">
                    <span className="font-bold text-white block">
                      CIHANPOL At�lye Montaj� (+750 ?)
                    </span>
                    <span className="text-[10px] text-stone-400 font-light leading-snug block mt-0.5">
                      Pirin� a��rl�klar, �aftlar ve motor at�lyemizde toplan�r, CoG dengelenir ve 65� kaya testinden ge�irilir.
                    </span>
                  </div>
                </label>
              </div>

              {/* Hesap D�k�m� */}
              <div className="border-t border-stone-800 pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-stone-400">
                  <span>Par�a Toplam�</span>
                  <span className="text-white font-bold">{subtotal.toLocaleString("tr-TR")} ?</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>
                      {discountPercent > 0 ? `VIP Kul�p �ndirimi (%${discountPercent})` : "Kupon �ndirimi"}
                    </span>
                    <span>-{discountAmount.toLocaleString("tr-TR")} ?</span>
                  </div>
                )}

                {includeAssemblyService && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>At�lye Montaj Hizmeti</span>
                    <span>+750 ?</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-400">
                  <span>Kargo �creti</span>
                  <span className="text-white font-bold">
                    {shippingFee === 0 ? "�cretsiz" : `${shippingFee} ?`}
                  </span>
                </div>

                <div className="border-t border-stone-800 pt-3 flex justify-between items-baseline text-sm font-bold text-white">
                  <span>Genel Toplam</span>
                  <span className="font-mono text-xl font-black text-amber-400">
                    {finalOrderTotal.toLocaleString("tr-TR")} ?
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
                className="w-full py-4 bg-amber-500 text-black text-xs font-mono uppercase tracking-widest font-black rounded-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sipari� ��leniyor...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sipari�i Onayla & Tamamla</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-stone-400">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>256-Bit SSL �ifreli G�venli Garaj Altyap�s�</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
