"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Truck, Wrench, Heart, Lock, HelpCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  const { storeSettings } = useCart();
  const whatsappUrl = getWhatsAppUrl(
    storeSettings?.whatsappPhone,
    "Merhaba Cihan Usta, cihanekspress.com hakkında bilgi almak istiyorum."
  );

  return (
    <footer className="bg-white text-slate-700 border-t border-slate-200 mt-auto">
      {/* 1. KAT: Trendyol Güven Rozetleri */}
      <div className="border-b border-slate-100 bg-[#FAFBFD] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-orange-50 text-[#F27A1A] flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Hızlı & Bedava Kargo</h4>
                <p className="text-[11px] text-slate-500">Tüm parçalarda özel korumalı ambalaj</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">CNC Tolerans Güvencesi</h4>
                <p className="text-[11px] text-slate-500">Masif sarı pirinç & 7075 alüminyum</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">WhatsApp Usta Masası</h4>
                <p className="text-[11px] text-slate-500">Birebir teknik montaj ve şasi desteği</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Kulüp & Atölye Güvencesi</h4>
                <p className="text-[11px] text-slate-500">Kişisel modelcilik ve hobi dayanışması</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. KAT: Trendyol Çok Kolonlu Footer Menüsü */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Kolon 1: cihanekspress.com Logo & Bilgi */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-slate-950">
                cihan<span className="text-[#F27A1A]">ekspress</span>
              </span>
              <span className="text-xs font-bold text-slate-400">.com</span>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Türkiye&apos;nin RC Rock Crawler, CNC pirinç portal aks ve fırçasız motor sistemleri pazaryeri ve atölye kataloğu. Kişiye özel toplanan arazi araçları ve milimetrik dengelenen kaya canavarları.
            </p>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Usta Danışma Hattı</span>
              </a>
            </div>
          </div>

          {/* Kolon 2: Popüler Kategoriler */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Kategoriler
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/#vitrin" className="hover:text-[#F27A1A] transition-colors">
                  1/10 Kaya Şasileri
                </Link>
              </li>
              <li>
                <Link href="/#vitrin" className="hover:text-[#F27A1A] transition-colors">
                  Pirinç (Brass) Akslar
                </Link>
              </li>
              <li>
                <Link href="/#vitrin" className="hover:text-[#F27A1A] transition-colors">
                  FOC Fırçasız Motorlar
                </Link>
              </li>
              <li>
                <Link href="/#vitrin" className="hover:text-[#F27A1A] transition-colors">
                  1/24 Mini Crawler (SCX24)
                </Link>
              </li>
              <li>
                <Link href="/paketler" className="text-[#F27A1A] font-bold hover:underline">
                  ★ Paket Fırsatları
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolon 3: Müşteri Hizmetleri */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Müşteri Hizmetleri
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/order-tracking" className="hover:text-[#F27A1A] transition-colors">
                  Sipariş & Montaj Takibi
                </Link>
              </li>
              <li>
                <Link href="/rehber" className="hover:text-[#F27A1A] transition-colors">
                  📖 Sistem Rehberi
                </Link>
              </li>
              <li>
                <Link href="/rehber" className="hover:text-[#F27A1A] transition-colors">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-slate-700 transition-colors">
                  Yönetici Paneli
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolon 4: Özel Atölye Araçları */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Özel Araçlar
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="#rig-builder" className="hover:text-[#F27A1A] transition-colors">
                  🔧 Rig Toplama Sihirbazı
                </a>
              </li>
              <li>
                <Link href="/hesaplayici" className="hover:text-[#F27A1A] transition-colors">
                  ⚙️ CoG & Ağırlık Hesaplayıcı
                </Link>
              </li>
              <li>
                <Link href="/3d-baski" className="hover:text-[#F27A1A] transition-colors">
                  🖨️ 3D Parça Baskı Talebi
                </Link>
              </li>
              <li>
                <Link href="/tescil" className="hover:text-[#F27A1A] transition-colors">
                  🎖️ Şasi Tescil & Seri No
                </Link>
              </li>
              <li>
                <Link href="/takas" className="hover:text-[#F27A1A] transition-colors">
                  🔄 Eski Şasini Getir (Takas)
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. KAT: Hukuki Hobi Kalkanı & Açıklama */}
        <div className="mt-10 pt-6 border-t border-slate-100 bg-[#FAFBFD] p-5 rounded-xl text-[11px] text-slate-500 leading-relaxed">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-[#F27A1A]" />
            <span>Hukuki Bilgilendirme ve Hobi Atölyesi Çekincesi</span>
          </div>
          <p>
            Bu web sitesi, <strong className="text-slate-700">cihanekspress.com</strong> adresi altında kişisel hobi modelcilik, CNC pirinç parça işleme, 3D prototip parça üretimi ve rock crawler şasi modifikasyonlarını sergilemek amacıyla hazırlanmış bir <em>atölye çalışma ve istişare kataloğudur</em>. Sitede doğrudan çevrim içi sanal POS kart çekimi yapılmamaktadır. Görüntülenen tutarlar malzeme tedariği ve zanaat işçilik referans bedelleridir. Tüm teslimatlar ve teknik değerlendirmeler WhatsApp usta masası üzerinden birebir irtibatla yürütülür.
          </p>
        </div>

        {/* 4. KAT: Telif ve Alt Şerit */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} cihanekspress.com. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-1">
            <span>Designed for RC Rock Crawler Enthusiasts</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
