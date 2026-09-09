"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Printer,
  Building2,
  Upload,
  ArrowRight,
  ShieldCheck,
  Clock,
  Check,
  FileText,
  Truck,
  AlertCircle,
  ExternalLink,
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
  receiptUrl: string | null;
  createdAt: string;
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
  const [order, setOrder] = useState<OrderData | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [copied, setCopied] = useState(false);
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
        if (data.order) setOrder(data.order);
        if (data.bankAccounts) setBankAccounts(data.bankAccounts);
      } catch (err) {
        console.error("Order load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handleCopyOrderNumber = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          throw new Error(uploadData.error || "Dosya sunucuya y�klenemedi.");
        }
        finalUrl = uploadData.url;
      }

      if (!finalUrl) {
        throw new Error("L�tfen bir dekont dosyas� se�iniz.");
      }

      const res = await fetch(`/api/orders/${order.id}/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptUrl: finalUrl,
          note: receiptNote.trim() || "M��teri dekont y�kledi.",
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
      setUploadError(err.message || "Dekont y�klenirken bir hata olu�tu.");
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
        <h2 className="font-mono text-2xl font-bold">Sipari� Kayd� Bulunamad�</h2>
        <Link href="/" className="text-xs font-mono uppercase tracking-wider text-amber-400 underline">
          Garaja D�n
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 text-[#E2E8F0]">
      {/* 1. Ba�ar� Rozeti ve Sipari� Numaras� */}
      <div className="tactical-box bg-[#11151F] border border-[#232B3B] p-8 sm:p-12 rounded-xs shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/40 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <CheckCircle2 className="w-9 h-9 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-[0.25em] text-amber-400 font-bold uppercase">
            RC Crawler Lab Kayd� Olu�turuldu
          </span>
          <h1 className="font-mono text-3xl sm:text-4xl text-white font-black uppercase">
            Sipari�iniz Al�nd�
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto font-light leading-relaxed">
            Te�ekk�rler <strong className="text-white">{order.customerName}</strong>. 
            Sipari� detaylar�n�z ve at�lye haz�rl�k bildiriminiz sistemimize kaydedildi.
          </p>
        </div>

        {/* Sipari� Numaras� Kutusu */}
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#0B0E14] border border-stone-800 rounded-xs">
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono text-stone-500 tracking-wider block">
              Sipari� Kodu
            </span>
            <span className="font-mono text-base font-extrabold text-white tracking-wider">
              {order.orderNumber}
            </span>
          </div>
          <button
            onClick={handleCopyOrderNumber}
            className="p-2 text-stone-400 hover:text-amber-400 transition-colors"
            title="Sipari� Kodunu Kopyala"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <Link
            href="/order-tracking"
            className="px-6 py-2.5 bg-amber-500 text-black text-xs font-mono uppercase tracking-wider font-extrabold rounded-xs hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Truck className="w-4 h-4" />
            <span>Sipari�i Canl� Takip Et</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 border border-stone-700 bg-[#161D2A] text-white text-xs font-mono uppercase tracking-wider font-bold rounded-xs hover:border-amber-400 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Makbuzu Yazd�r</span>
          </button>
        </div>
      </div>

      {/* 2. Havale / EFT Bilgileri ve Ger�ek Dosya Y�kleme Dropzone */}
      {order.paymentMethod === "BANK_TRANSFER" && (
        <div className="tactical-box bg-[#11151F] border border-amber-500/30 p-8 rounded-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-stone-800 pb-4">
            <Building2 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-mono text-base sm:text-lg text-white font-bold uppercase">
                Havale / EFT �deme Talimatlar�
              </h2>
              <p className="text-[11px] text-stone-400 font-mono">
                L�tfen sipari� tutar�n� 24 saat i�inde a�a��daki hesaplar�m�zdan birine iletiniz.
              </p>
            </div>
          </div>

          {/* Banka Hesaplar� */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bankAccounts.map((acc, i) => (
              <div key={i} className="p-4 bg-[#0B0E14] border border-stone-800 rounded-xs space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase block">
                  {acc.bankName}
                </span>
                <div className="text-[11px] font-mono text-stone-400">
                  <span>Al�c�: </span>
                  <span className="text-white font-semibold">{acc.accountHolder}</span>
                </div>
                <div className="text-xs font-mono font-bold text-white bg-[#141A25] p-2 rounded-xs border border-stone-800 break-all select-all">
                  {acc.iban}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono rounded-xs space-y-1">
            <p className="font-bold uppercase tracking-wider">�nemli Transfer A��klamas�:</p>
            <p className="text-[11px] text-stone-300">
              Banka havalesi yaparken a��klama k�sm�na yaln�zca{" "}
              <strong className="text-amber-400 underline font-extrabold">{order.orderNumber}</strong> kodunuzu yaz�n�z.
            </p>
          </div>

          {/* DEKONT Y�KLEME ALANI (GER�EK MULTIPART DOSYA Y�KLEME) */}
          <div className="border-t border-stone-800 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-sm text-white font-bold uppercase flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Dekont Foto�raf� / PDF Y�kleyin</span>
                </h3>
                <p className="text-[11px] text-stone-400 font-mono">
                  �demenizi h�zla onaylay�p kargo sevk s�recine ge�ebilmemiz i�in dekontunuzu y�kleyin.
                </p>
              </div>

              {order.receiptUrl && (
                <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[10px] font-mono font-bold uppercase rounded-xs">
                  ? Dekont �letildi
                </span>
              )}
            </div>

            {receiptSubmitted ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-mono rounded-xs flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Dekontunuz ba�ar�yla y�klendi ve y�netici onay kuyru�una al�nd�. Sipari�iniz k�sa s�re i�inde haz�rlanacakt�r.</span>
              </div>
            ) : (
              <form onSubmit={handleReceiptSubmit} className="space-y-4">
                {/* S�r�kle B�rak / Dosya Se�ici */}
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
                        <p className="text-[10px] font-mono text-stone-500">{(receiptFile.size / 1024).toFixed(1)} KB - De�i�tirmek i�in t�klay�n</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-mono font-bold text-stone-300 group-hover:text-amber-400">
                          Dekont dosyas�n� buraya s�r�kleyin veya se�mek i�in t�klay�n
                        </p>
                        <p className="text-[10px] font-mono text-stone-500">JPG, PNG veya PDF formatlar� desteklenir</p>
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
                    Ek Not veya G�nderici Ad� (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    placeholder="�rn: Garanti hesab�mdan havale yap�ld�"
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#0B0E14] border border-stone-700 text-white rounded-xs focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading || !receiptFile}
                  className="px-6 py-2.5 bg-amber-500 text-black text-xs font-mono uppercase tracking-widest font-black rounded-xs hover:bg-amber-400 transition-all disabled:opacity-40 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? "Y�kleniyor..." : "Dekontu G�nder ve Onaya �let"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. Yazd�r�labilir Fatura & Sipari� �zeti Tablosu */}
      <div className="tactical-box bg-[#11151F] border border-[#232B3B] p-6 sm:p-8 rounded-xs space-y-6 print:bg-white print:text-black print:border-none print:shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div>
            <h2 className="font-mono text-lg text-white font-bold uppercase print:text-black">
              Sipari� & Makbuz D�k�m�
            </h2>
            <p className="text-xs font-mono text-stone-400">
              Tarih: {new Date(order.createdAt).toLocaleDateString("tr-TR")}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-stone-700 text-stone-300 hover:text-amber-400 hover:border-amber-400 text-xs font-mono uppercase tracking-wider rounded-xs transition-all print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>Yazd�r</span>
          </button>
        </div>

        {/* M��teri ve Teslimat Bilgisi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-[#0B0E14] p-4 rounded-xs border border-stone-800 print:bg-stone-50 print:text-black">
          <div>
            <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px] print:text-black">
              Al�c� Bilgileri
            </span>
            <p className="mt-1 font-semibold text-white print:text-black">{order.customerName}</p>
            <p className="text-stone-400 print:text-stone-700">{order.customerPhone}</p>
            <p className="text-stone-400 print:text-stone-700">{order.customerEmail}</p>
          </div>
          <div>
            <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px] print:text-black">
              Teslimat Adresi
            </span>
            <p className="mt-1 text-white print:text-black">{order.shippingAddress}</p>
            <p className="text-stone-400 print:text-stone-700">
              {order.district ? `${order.district} / ` : ""}
              {order.city}
            </p>
          </div>
        </div>

        {/* �r�nler Tablosu */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-stone-800 text-stone-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Par�a / Model</th>
                <th className="py-2.5">Varyant</th>
                <th className="py-2.5 text-center">Adet</th>
                <th className="py-2.5 text-right">Birim</th>
                <th className="py-2.5 text-right">Toplam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {order.items.map((item) => (
                <tr key={item.id} className="text-stone-300">
                  <td className="py-3 font-semibold text-white print:text-black">{item.productTitle}</td>
                  <td className="py-3 text-stone-500">{item.variantName || "-"}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">{item.price.toLocaleString("tr-TR")} ?</td>
                  <td className="py-3 text-right font-bold text-amber-400 print:text-black">
                    {item.total.toLocaleString("tr-TR")} ?
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-stone-800 font-bold text-xs">
              <tr>
                <td colSpan={4} className="py-2.5 text-right text-stone-400">Ara Toplam:</td>
                <td className="py-2.5 text-right text-white print:text-black">{order.subtotal.toLocaleString("tr-TR")} ?</td>
              </tr>
              {order.discountTotal > 0 && (
                <tr>
                  <td colSpan={4} className="py-1 text-right text-amber-400">VIP / Kupon �ndirimi:</td>
                  <td className="py-1 text-right text-amber-400">-{order.discountTotal.toLocaleString("tr-TR")} ?</td>
                </tr>
              )}
              <tr>
                <td colSpan={4} className="py-1 text-right text-stone-400">Kargo Bedeli:</td>
                <td className="py-1 text-right text-white print:text-black">
                  {order.shippingFee === 0 ? "�cretsiz" : `${order.shippingFee} ?`}
                </td>
              </tr>
              <tr className="text-sm border-t border-stone-700">
                <td colSpan={4} className="py-3 text-right font-black text-amber-400">Genel Toplam:</td>
                <td className="py-3 text-right font-black text-amber-400 print:text-black">
                  {order.total.toLocaleString("tr-TR")} ?
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
