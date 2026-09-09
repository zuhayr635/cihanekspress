import React from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Wrench, Flame, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-900 border-t border-slate-200 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Güven ve Hizmet Rozetleri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-200">
          <div className="flex items-center gap-4 p-4 rounded-xs bg-slate-50/80 border border-slate-200">
            <div className="w-12 h-12 rounded-xs bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-black text-slate-950 font-mono">Özel RC Garaj Erişimi</h4>
              <p className="text-[12px] text-slate-600 mt-0.5 font-normal">Sadece onaylı davetiye ve kulüp üyelerine özel proje hazırlığı.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xs bg-slate-50/80 border border-slate-200">
            <div className="w-12 h-12 rounded-xs bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0">
              <Wrench className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-black text-slate-950 font-mono">CNC & Masif Pirinç Montaj</h4>
              <p className="text-[12px] text-slate-600 mt-0.5 font-normal">Pirinç ağırlıklar, çelik şaftlar ve FOC fırçasız güç üniteleri.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xs bg-slate-50/80 border border-slate-200">
            <div className="w-12 h-12 rounded-xs bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0">
              <Flame className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-black text-slate-950 font-mono">65° Eğim ve Tırmanış Testi</h4>
              <p className="text-[12px] text-slate-600 mt-0.5 font-normal">Tüm özel araçlar teslimat öncesi eğim parkurunda kalibre edilir.</p>
            </div>
          </div>
        </div>

        {/* Ana Footer Alanı */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-slate-200">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <h3 className="font-mono text-base sm:text-lg tracking-[0.2em] font-black text-slate-950 uppercase">
                CIHANPOL RC // SCALE ATELIER
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md font-normal">
              1/10 ve 1/24 ölçekli profesyonel kaya tırmanıcılar (rock crawler), CNC pirinç portal aks yükseltmeleri, sensörlü fırçasız motor kombinasyonları ve özel proje şasileri üreten butik modelcilik atölyesi.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/905551234567?text=Merhaba%20Cihan%20Usta,%20RC%20Crawler%20par%C3%A7a%20ve%20ara%C3%A7%20talebi%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp RC Usta Masası</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-black text-slate-950 font-mono mb-4">Katalog & Parça</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-mono">
              <li>
                <Link href="/" className="hover:text-orange-600 transition-colors">
                  Crawler Şasiler (1/10 & 1/24)
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-orange-600 transition-colors">
                  Ağır Pirinç (Brass) Akslar
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-orange-600 transition-colors">
                  Fırçasız FOC Motor & ESC
                </Link>
              </li>
              <li>
                <Link href="/paketler" className="text-orange-600 font-bold hover:text-orange-700 transition-colors">
                  ★ Özel Paket Fırsatları
                </Link>
              </li>
              <li>
                <Link href="/rehber" className="text-orange-600 font-bold hover:text-orange-700 transition-colors">
                  📖 Sistem Rehberi
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-orange-600 transition-colors text-slate-400 hover:text-slate-600">
                  Yönetici Girişi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-black text-slate-950 font-mono mb-4">Mühendislik & Topluluk</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-mono">
              <li>
                <Link href="/hesaplayici" className="hover:text-orange-600 transition-colors">
                  🛠️ CoG & Dişli Hesaplayıcı
                </Link>
              </li>
              <li>
                <Link href="/parkurlar" className="hover:text-orange-600 transition-colors">
                  📍 Türkiye Kaya Parkurları
                </Link>
              </li>
              <li>
                <Link href="/topluluk" className="hover:text-orange-600 transition-colors">
                  🏆 Ayın Kaya Canavarı
                </Link>
              </li>
              <li>
                <Link href="/takas" className="hover:text-orange-600 transition-colors">
                  🔄 Eski Şasini Getir (Takas)
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="hover:text-orange-600 transition-colors">
                  💼 B2B & Kulüp Masası
                </Link>
              </li>
              <li>
                <Link href="/bakim" className="hover:text-orange-600 transition-colors">
                  🔧 Sezonluk Bakım Paketleri
                </Link>
              </li>
              <li>
                <Link href="/3d-baski" className="hover:text-orange-600 transition-colors">
                  🖨️ 3D Baskı Parça Üretimi
                </Link>
              </li>
              <li>
                <Link href="/tescil" className="hover:text-orange-600 transition-colors">
                  🎖️ Şasi Tescil & Seri No
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Hukuki Hobi Kalkanı & Atölye Manifestosu */}
        <div className="py-6 px-6 bg-slate-50 border border-slate-200 rounded-xs text-[11px] text-slate-600 font-mono space-y-2 leading-relaxed mt-8">
          <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-wider text-xs">
            <ShieldCheck className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <span>Hukuki Bilgilendirme & Hobi Atölyesi Çekincesi</span>
          </div>
          <p className="font-sans font-normal text-slate-600">
            Bu platform, <strong className="text-slate-900 font-bold">Cihanpol RC Atelier</strong> tarafından yürütülen kişisel modelleme, CNC pirinç parça işleme, 3D prototip baskı ve özel rock crawler şasi modifikasyonlarını sergileyen bir <em>atölye çalışma ve tasarım kataloğudur</em>. Sitede çevrim içi perakende satış veya sanal POS ödemesi yapılmamaktadır. Listelenen tüm bedeller hobi malzeme tedariği ve zanaat işçiliği referans değerleridir. Tüm montaj, şasi kalibrasyonu ve parça teslimatları kulüp üyeleri ve model meraklıları ile birebir atölye istişaresiyle gerçekleştirilir.
          </p>
        </div>

        {/* Telif & Alt Bilgi */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4 font-mono">
          <p>© {new Date().getFullYear()} CIHANPOL RC ATELIER LAB. Kişisel Hobi & Zanaat Portfolyosu.</p>
          <p className="tracking-wider uppercase">Custom Rock Crawler Engineering & Spec Portfolio</p>
        </div>
      </div>
    </footer>
  );
}
