"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  CheckCircle2,
  Copy,
  Printer,
  Building2,
  Upload,
  Clock,
  Check,
  FileText,
  Truck,
  AlertCircle,
  Sparkles,
  Flame,
  ShieldCheck,
  ShieldOff,
  Eye,
  EyeOff,
} from "lucide-react";

interface OrderItem {
  id: string;
  productTitle: string;
  variantName: string | null;
  price: number;
  quantity: number;
  total: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  district: string | null;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  total: number;
  exactAmount?: number;
  kuruSuffix?: number;
  safeMemo?: string;
  receiptUrl: string | null;
  createdAt: string;
  burnerExpiresAt?: string | null;
  isBurnerExpired?: boolean;
  items: OrderItem[];
}

interface BankAccount {
  bankName: string;
  accountHolder: string;
  iban: string;
}

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { storeSettings } = useCart();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [assignedIban, setAssignedIban] = useState<BankAccount | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [exactAmount, setExactAmount] = useState<number | null>(null);
  const [kuruSuffix, setKuruSuffix] = useState<number | null>(null);
  const [safeMemo, setSafeMemo] = useState<string>("Teknik Danışmanlık Hizmet Bedeli");
  const [stealthServiceTitle, setStealthServiceTitle] = useState<string>(
    "3D CAD Çizim ve Teknik Modelleme Hizmet Bedeli"
  );
  const [stealthCamouflageEnabled, setStealthCamouflageEnabled] = useState(true);
  const [isCamouflageReceiptView, setIsCamouflageReceiptView] = useState(false);

  // Hayalet Ödeme Odası (Burner Session)
  const [burnerExpiresAt, setBurnerExpiresAt] = useState<Date | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);
  const [isBurnerExpired, setIsBurnerExpired] = useState(false);

  // Kopyalama bildirimleri
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);

  // Dekont Yükleme State
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptNote, setReceiptNote] = useState("");
  const [receiptSubmitted, setReceiptSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
          setExactAmount(data.exactAmount ?? data.order.total);
          setKuruSuffix(data.kuruSuffix ?? null);
          setSafeMemo(data.safeMemo || "Teknik Danışmanlık Hizmet Bedeli");
          setStealthCamouflageEnabled(data.stealthCamouflageEnabled ?? true);
          setStealthServiceTitle(
            data.stealthServiceTitle || "3D CAD Çizim ve Teknik Modelleme Hizmet Bedeli"
          );

          if (data.burnerExpiresAt) {
            const exp = new Date(data.burnerExpiresAt);
            setBurnerExpiresAt(exp);
            const diff = Math.floor((exp.getTime() - Date.now()) / 1000);
            if (diff <= 0 || data.isBurnerExpired) {
              setIsBurnerExpired(true);
              setCountdownSeconds(0);
            } else {
              setCountdownSeconds(diff);
            }
          }
        }
        if (data.assignedIban) setAssignedIban(data.assignedIban);
        if (data.bankAccounts) setBankAccounts(data.bankAccounts);
      } catch (err) {
        console.error("Order load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  // Canlı Geri Sayım Sayacı (15 dk Burner Room)
  useEffect(() => {
    if (!burnerExpiresAt || isBurnerExpired) return;

    const timer = setInterval(() => {
      const remaining = Math.floor((burnerExpiresAt.getTime() - Date.now()) / 1000);
      if (remaining <= 0) {
        setCountdownSeconds(0);
        setIsBurnerExpired(true);
        clearInterval(timer);
      } else {
        setCountdownSeconds(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [burnerExpiresAt, isBurnerExpired]);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string, type: "order" | "iban" | "amount" | "memo") => {
    navigator.clipboard.writeText(text);
    if (type === "order") {
      setCopiedOrderNumber(true);
      setTimeout(() => setCopiedOrderNumber(false), 2000);
    } else if (type === "iban") {
      setCopiedIban(true);
      setTimeout(() => setCopiedIban(false), 2000);
    } else if (type === "amount") {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } else if (type === "memo") {
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setUploadError(null);
    }
  };

  const handleReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      let finalUrl = order.receiptUrl || "";

      if (receiptFile) {
        const formData = new FormData();
        formData.append("file", receiptFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success || !uploadData.url) {
          throw new Error(uploadData.error || "Dosya yüklenemedi.");
        }
        finalUrl = uploadData.url;
      }

      if (!finalUrl) {
        throw new Error("Lütfen bir dekont dosyası seçiniz.");
      }

      const res = await fetch(`/api/orders/${order.id}/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptUrl: finalUrl,
          note: receiptNote.trim() || "Müşteri dekont yükledi.",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReceiptSubmitted(true);
        setOrder(data.order);
      } else {
        setUploadError(data.error || "Dekont kaydedilemedi.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Dekont yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex items-center justify-center text-amber-400">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 text-stone-300">
        <h2 className="font-mono text-2xl font-bold">Sipariş Kaydı Bulunamadı</h2>
        <Link href="/" className="text-xs font-mono uppercase tracking-wider text-amber-400 underline">
          Kataloğa Dön
        </Link>
      </div>
    );
  }

  // Aktif gösterilecek IBAN (Dinamik havuzdan atanmış hesap öncelikli)
  const activeAccount = assignedIban || (bankAccounts.length > 0 ? bankAccounts[0] : null);
  const payableAmount = exactAmount ?? order.total;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 text-[#E2E8F0]">
      {/* 1. Başarı Rozeti ve Sipariş Numarası */}
      <div className="tactical-box bg-[#11151F] border border-[#232B3B] p-8 sm:p-12 rounded-xs shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/40 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <CheckCircle2 className="w-9 h-9 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-[0.25em] text-amber-400 font-bold uppercase">
            Atölye Rezervasyon Kaydı Onaylandı
          </span>
          <h1 className="font-mono text-3xl sm:text-4xl text-white font-black uppercase">
            Siparişiniz Alındı
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto font-light leading-relaxed">
            Teşekkürler <strong className="text-white">{order.customerName}</strong>. 
            Siparişiniz ve ödeme odanız güvenli olarak başlatıldı.
          </p>
        </div>

        {/* Sipariş Numarası Kutusu */}
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#0B0E14] border border-stone-800 rounded-xs">
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono text-stone-500 tracking-wider block">
              Sipariş Kodu
            </span>
            <span className="font-mono text-base font-extrabold text-white tracking-wider">
              {order.orderNumber}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(order.orderNumber, "order")}
            className="p-2 text-stone-400 hover:text-amber-400 transition-colors"
            title="Sipariş Kodunu Kopyala"
          >
            {copiedOrderNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <Link
            href="/order-tracking"
            className="px-6 py-2.5 bg-amber-500 text-black text-xs font-mono uppercase tracking-wider font-extrabold rounded-xs hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Truck className="w-4 h-4" />
            <span>Siparişi Canlı Takip Et</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 border border-stone-700 bg-[#161D2A] text-white text-xs font-mono uppercase tracking-wider font-bold rounded-xs hover:border-amber-400 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Makbuzu Yazdır</span>
          </button>
        </div>
      </div>

      {/* 2. STEALTH HAYALET ÖDEME ODASI & KURUŞLU REFERANS SİSTEMİ */}
      {order.paymentMethod === "BANK_TRANSFER" && (
        <div className="tactical-box bg-[#11151F] border border-amber-500/40 p-6 sm:p-8 rounded-xs space-y-6 shadow-xl">
          {/* Üst Başlık & Hayalet Sayaç */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xs bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-base sm:text-lg text-white font-black uppercase tracking-wide">
                    Hayalet Ödeme Odası
                  </h2>
                  <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold rounded-xs">
                    Geçici Oturum
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 font-mono">
                  Güvenli banka transferi için tahsis edilen geçici ödeme protokolü
                </p>
              </div>
            </div>

            {/* Geri Sayım Sayacı */}
            <div className={`px-4 py-2.5 rounded-xs border flex items-center gap-3 ${
              isBurnerExpired
                ? "bg-red-950/60 border-red-800 text-red-300"
                : "bg-[#0B0E14] border-amber-500/40 text-amber-400"
            }`}>
              <Clock className={`w-4 h-4 ${isBurnerExpired ? "text-red-400" : "animate-spin"}`} />
              <div className="text-left font-mono">
                <span className="text-[9px] uppercase tracking-wider block text-stone-500 font-bold">
                  {isBurnerExpired ? "Oturum Süresi" : "Kalan Süre"}
                </span>
                <span className="text-sm sm:text-base font-black tracking-widest">
                  {isBurnerExpired ? "İMHA EDİLDİ" : countdownSeconds !== null ? formatCountdown(countdownSeconds) : "--:--"}
                </span>
              </div>
            </div>
          </div>

          {/* SÜRE DOLDUYSA: IBAN İMHA BİLDİRİMİ */}
          {isBurnerExpired ? (
            <div className="p-8 bg-red-950/40 border border-red-900/80 rounded-xs text-center space-y-4">
              <div className="w-14 h-14 bg-red-900/30 border border-red-700 text-red-400 rounded-full flex items-center justify-center mx-auto">
                <ShieldOff className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-mono font-bold uppercase text-white">
                  Hayalet Ödeme Odası Süresi Doldu (IBAN İmha Edildi)
                </h3>
                <p className="text-xs text-stone-400 max-w-lg mx-auto font-mono leading-relaxed">
                  Güvenlik ve rotasyon kuralları gereğince bu sipariş için tahsis edilen geçici IBAN bilgisi ekrandan kalıcı olarak silinmiştir. Ödeme yapmadıysanız lütfen yeni oturum için WhatsApp atölye hattımızla iletişime geçiniz.
                </p>
              </div>
              <a
                href={getWhatsAppUrl(
                  storeSettings?.whatsappPhone,
                  `Merhaba, ${order.orderNumber} kodlu siparişim için ödeme odası süresi doldu. Yeni IBAN bilgisi alabilir miyim?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs transition-colors shadow-sm"
              >
                <span>WhatsApp ile Yeni IBAN Talep Et</span>
              </a>
            </div>
          ) : (
            <>
              {/* KURUŞLU REFERANS EŞLEŞTİRME KUTUSU */}
              <div className="p-5 bg-[#0B0E14] border-2 border-amber-500/60 rounded-xs space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold block">
                      Gönderilmesi Gereken Kesin Tutar (Kuruş Referanslı)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                        {payableAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                      </span>
                      {kuruSuffix !== null && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-black uppercase rounded-xs">
                          +{kuruSuffix.toFixed(2)} ₺ Eşleştirme Kuruşu
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(payableAmount.toFixed(2), "amount")}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 self-start sm:self-auto transition-colors"
                  >
                    {copiedAmount ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAmount ? "Kopyalandı" : "Tutarı Kopyala"}</span>
                  </button>
                </div>

                {/* SIFIR-AÇIKLAMA (ZERO-MEMO) KRİTİK UYARISI */}
                <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xs text-xs font-mono space-y-1">
                  <p className="font-black uppercase tracking-wider text-red-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>KRİTİK BANKA TRANSFER KURALI (SIFIR-AÇIKLAMA):</span>
                  </p>
                  <p className="text-[11px] text-stone-300 leading-relaxed pl-5">
                    Banka havalesi/EFT yaparken <strong>açıklama kısmını KESİNLİKLE BOŞ BIRAKINIZ!</strong> Tutarın sonundaki kuruş hanesi (<strong className="text-amber-400">{payableAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</strong>) siparişinizle birebir eşleşerek sistemimiz tarafından saniyeler içinde otomatik olarak onaylanır. Açıklamaya RC, crawler, araç veya sipariş kodu yazmayınız.
                  </p>
                </div>
              </div>

              {/* DİNAMİK ATANAN IBAN KARTI */}
              {activeAccount && (
                <div className="p-5 bg-[#0B0E14] border border-stone-800 rounded-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span className="font-mono text-xs font-bold text-amber-400 uppercase">
                        {activeAccount.bankName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-xs">
                      ● Aktif Havuz Hesabı
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase block">Hesap Sahibi (Alıcı):</span>
                      <span className="text-sm font-bold text-white block select-all">{activeAccount.accountHolder}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 uppercase block mb-1">IBAN Numarası:</span>
                      <div className="p-3 bg-[#141A25] border border-stone-800 rounded-xs flex items-center justify-between gap-2">
                        <span className="font-mono text-xs sm:text-sm font-black text-amber-300 break-all select-all tracking-wider">
                          {activeAccount.iban}
                        </span>
                        <button
                          onClick={() => copyToClipboard(activeAccount.iban, "iban")}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-bold uppercase rounded-xs transition-colors flex items-center gap-1.5 flex-shrink-0"
                          title="IBAN'ı Kopyala"
                        >
                          {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{copiedIban ? "Kopyalandı" : "Kopyala"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MASUM TRANSFER AÇIKLAMASI (ALTERNATİF) */}
                  {safeMemo && (
                    <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                      <div className="text-[11px] text-stone-400">
                        <span className="text-stone-500">Bankanız açıklama zorunlu kılıyorsa: </span>
                        <span className="text-amber-300 font-bold">&quot;{safeMemo}&quot;</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(safeMemo, "memo")}
                        className="text-[10px] uppercase font-bold text-stone-400 hover:text-amber-400 self-start sm:self-auto flex items-center gap-1"
                      >
                        {copiedMemo ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedMemo ? "Açıklama Kopyalandı" : "Açıklamayı Kopyala"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* DEKONT YÜKLEME ALANI */}
              <div className="border-t border-stone-800 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-mono text-sm text-white font-bold uppercase flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Dekont Fotoğrafı / PDF Yükleyin</span>
                    </h3>
                    <p className="text-[11px] text-stone-400 font-mono">
                      Ödemenizi hızla onaylayıp montaj ve sevk sürecine geçebilmemiz için dekontunuzu yükleyin.
                    </p>
                  </div>

                  {order.receiptUrl && (
                    <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[10px] font-mono font-bold uppercase rounded-xs">
                      ✓ Dekont İletildi
                    </span>
                  )}
                </div>

                {receiptSubmitted ? (
                  <div className="p-4 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-mono rounded-xs flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>Dekontunuz başarıyla yüklendi ve yönetici onay kuyruğuna alındı. Siparişiniz kısa süre içinde hazırlanacaktır.</span>
                  </div>
                ) : (
                  <form onSubmit={handleReceiptSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-stone-700 hover:border-amber-400 bg-[#0B0E14] p-6 rounded-xs text-center relative transition-colors cursor-pointer group">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        {receiptFile ? (
                          <div>
                            <p className="text-xs font-mono font-bold text-amber-400">{receiptFile.name}</p>
                            <p className="text-[10px] font-mono text-stone-500">{(receiptFile.size / 1024).toFixed(1)} KB - Değiştirmek için tıklayın</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-mono font-bold text-stone-300 group-hover:text-amber-400">
                              Dekont dosyasını buraya sürükleyin veya seçmek için tıklayın
                            </p>
                            <p className="text-[10px] font-mono text-stone-500">JPG, PNG veya PDF formatları desteklenir</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {uploadError && (
                      <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono rounded-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1 font-bold">
                        Ek Not veya Gönderici Adı (Opsiyonel)
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Garanti hesabımdan gönderildi"
                        value={receiptNote}
                        onChange={(e) => setReceiptNote(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-[#0B0E14] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading || !receiptFile}
                      className="px-6 py-2.5 bg-amber-500 text-black text-xs font-mono uppercase tracking-widest font-black rounded-xs hover:bg-amber-400 transition-all disabled:opacity-40 flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? "Yükleniyor..." : "Dekontu Gönder ve Onaya İlet"}</span>
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. YAZDIRILABİLİR SİPARİŞ & KAMUFLAJ FATURA / MAKBUZ DÖKÜMÜ */}
      <div className="tactical-box bg-[#11151F] border border-[#232B3B] p-6 sm:p-8 rounded-xs space-y-6 print:bg-white print:text-black print:border-none print:shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800 print:border-stone-300">
          <div>
            <h2 className="font-mono text-lg text-white font-bold uppercase print:text-black">
              {isCamouflageReceiptView ? "Resmi Hizmet & Danışmanlık Dökümü" : "Sipariş & Makbuz Dökümü"}
            </h2>
            <p className="text-xs font-mono text-stone-400 print:text-stone-600">
              Tarih: {new Date(order.createdAt).toLocaleDateString("tr-TR")} | Referans: {order.orderNumber}
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            {stealthCamouflageEnabled && (
              <button
                onClick={() => setIsCamouflageReceiptView(!isCamouflageReceiptView)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-xs border transition-colors cursor-pointer ${
                  isCamouflageReceiptView
                    ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                    : "bg-[#161D2A] border-stone-700 text-stone-300 hover:border-amber-400"
                }`}
                title="Banka dekont ve denetim kamuflaj görünümü"
              >
                {isCamouflageReceiptView ? <EyeOff className="w-3.5 h-3.5 text-emerald-400" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isCamouflageReceiptView ? "Kamuflaj Aktif" : "Kamuflaj Makbuzu"}</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-stone-700 text-stone-300 hover:text-amber-400 hover:border-amber-400 text-xs font-mono uppercase tracking-wider rounded-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır</span>
            </button>
          </div>
        </div>

        {/* Müşteri ve Teslimat Bilgisi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-[#0B0E14] p-4 rounded-xs border border-stone-800 print:bg-stone-50 print:text-black">
          <div>
            <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px] print:text-black">
              Alıcı Bilgileri
            </span>
            <p className="mt-1 font-semibold text-white print:text-black">{order.customerName}</p>
            <p className="text-stone-400 print:text-stone-700">{order.customerPhone}</p>
            <p className="text-stone-400 print:text-stone-700">{order.customerEmail}</p>
          </div>
          <div>
            <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px] print:text-black">
              {isCamouflageReceiptView ? "Hizmet Teslim Adresi / Bölge" : "Teslimat Adresi"}
            </span>
            <p className="mt-1 text-white print:text-black">{order.shippingAddress}</p>
            <p className="text-stone-400 print:text-stone-700">
              {order.district ? `${order.district} / ` : ""}
              {order.city}
            </p>
          </div>
        </div>

        {/* Ürünler Tablosu (Kamuflaj Modu vs. Standart Mod) */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-stone-800 text-stone-500 uppercase tracking-wider text-[10px] print:border-stone-300 print:text-stone-600">
                <th className="py-2.5">{isCamouflageReceiptView ? "Hizmet Tanımı & Açıklama" : "Parça / Model"}</th>
                <th className="py-2.5">{isCamouflageReceiptView ? "Kapsam" : "Varyant"}</th>
                <th className="py-2.5 text-center">Adet</th>
                <th className="py-2.5 text-right">Birim</th>
                <th className="py-2.5 text-right">Toplam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 print:divide-stone-200">
              {isCamouflageReceiptView ? (
                <tr className="text-stone-300">
                  <td className="py-3 font-semibold text-white print:text-black">
                    {stealthServiceTitle}
                    <span className="block text-[10px] text-stone-500 font-normal mt-0.5">
                      Referans Kodu: {order.orderNumber} - Teknik Danışmanlık ve Mühendislik Modellemesi
                    </span>
                  </td>
                  <td className="py-3 text-stone-500">Özel Tasarım</td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right">{payableAmount.toLocaleString("tr-TR")} ₺</td>
                  <td className="py-3 text-right font-bold text-amber-400 print:text-black">
                    {payableAmount.toLocaleString("tr-TR")} ₺
                  </td>
                </tr>
              ) : (
                order.items.map((item) => (
                  <tr key={item.id} className="text-stone-300">
                    <td className="py-3 font-semibold text-white print:text-black">{item.productTitle}</td>
                    <td className="py-3 text-stone-500">{item.variantName || "-"}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">{item.price.toLocaleString("tr-TR")} ₺</td>
                    <td className="py-3 text-right font-bold text-amber-400 print:text-black">
                      {item.total.toLocaleString("tr-TR")} ₺
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="border-t border-stone-800 font-bold text-xs print:border-stone-300">
              {!isCamouflageReceiptView && (
                <>
                  <tr className="text-stone-400 print:text-stone-600">
                    <td colSpan={4} className="pt-3 text-right uppercase">Ara Toplam:</td>
                    <td className="pt-3 text-right text-white print:text-black">{order.subtotal.toLocaleString("tr-TR")} ₺</td>
                  </tr>
                  {order.discountTotal > 0 && (
                    <tr className="text-emerald-400 print:text-emerald-700">
                      <td colSpan={4} className="py-1 text-right uppercase">VIP İndirim:</td>
                      <td className="py-1 text-right">-{order.discountTotal.toLocaleString("tr-TR")} ₺</td>
                    </tr>
                  )}
                  {kuruSuffix !== null && (
                    <tr className="text-amber-400 print:text-amber-700">
                      <td colSpan={4} className="py-1 text-right uppercase">Kuruş Referansı:</td>
                      <td className="py-1 text-right">+{kuruSuffix.toFixed(2)} ₺</td>
                    </tr>
                  )}
                </>
              )}
              <tr className="text-white text-sm print:text-black">
                <td colSpan={4} className="pt-2 text-right uppercase font-black">Net Ödenecek Tutar:</td>
                <td className="pt-2 text-right text-amber-400 font-black print:text-black">
                  {payableAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
