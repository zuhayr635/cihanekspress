"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { KeyRound, CheckCircle2, XCircle, ArrowRight, Sparkles, ShieldAlert } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function VipAccessPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { refreshVipStatus, storeSettings } = useCart();

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    async function verifyInvite() {
      try {
        const res = await fetch("/api/vip/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setDiscountPercent(data.discountPercent || 0);
          setNote(data.note || "");
          await refreshVipStatus();
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Geçersiz veya daha önce kullanılmış davetiye bağlantısı.");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Bağlantı doğrulanırken sunucu hatası oluştu.");
      }
    }

    verifyInvite();
  }, [token, refreshVipStatus]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-white border border-stone-200 p-8 sm:p-12 rounded-sm shadow-xl text-center space-y-6">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center animate-spin">
              <KeyRound className="w-6 h-6 text-stone-800" />
            </div>
            <h2 className="font-serif text-2xl text-stone-900 font-medium">
              Özel Davetiyeniz Doğrulanıyor...
            </h2>
            <p className="text-xs text-stone-500">
              Lütfen bekleyiniz, güvenli VIP oturumunuz başlatılıyor.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-amber-600 font-bold">
                Ayrıcalıklı Erişim Onaylandı
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-medium leading-tight">
                Hoş Geldiniz
              </h2>
              {note && (
                <p className="text-xs font-serif italic text-stone-600">
                  &ldquo;{note}&rdquo;
                </p>
              )}
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm space-y-2 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tek Kullanımlık Link Güvenle Yakıldı</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tarayıcınıza güvenli bir VIP alışveriş oturumu tanımlandı. Ürünlerimizin gizli fiyatları ve satın alma yetkisi 24 saat boyunca açık kalacaktır.
              </p>
              {discountPercent > 0 && (
                <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-amber-700">
                  <span>Size Özel Tanımlanan İndirim:</span>
                  <span>% {discountPercent}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/#koleksiyon"
                className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2 group shadow-sm"
              >
                <span>Koleksiyonu Keşfet & Sipariş Ver</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-red-600 font-bold">
                Erişim Sağlanamadı
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-medium">
                Geçersiz veya Kullanılmış Link
              </h2>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm text-left text-xs text-stone-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                <ShieldAlert className="w-4 h-4 text-stone-600" />
                <span>Tek Kullanımlık Güvenlik İlkesi</span>
              </div>
              <p className="text-stone-500">
                Davetiye bağlantılarımız tek seferliktir. Eğer bağlantıyı daha önce tıkladıysanız veya başka biriyle paylaştıysanız bağlantı otomatik olarak devre dışı kalır.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 py-3 border border-stone-300 text-stone-800 text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-stone-50 transition-colors"
              >
                Kataloğa Dön
              </Link>
              <a
                href={getWhatsAppUrl(
                  storeSettings?.whatsappPhone,
                  "Merhaba, davetiye bağlantım hakkında destek almak istiyorum."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#25D366] text-black text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#20bd5a] transition-colors"
              >
                Yöneticiye Ulaş
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
