import React from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Wrench, Flame, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0D0F14] text-[#E2E8F0] border-t border-[#1E232F] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Güven ve Hizmet Rozetleri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#1E232F]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#161A22] border border-[#262E3D] flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white">Özel RC Garaj Erişimi</h4>
              <p className="text-[12px] text-stone-400 mt-0.5">Sadece onaylı davetiye sahiplerine özel parça satışı.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#161A22] border border-[#262E3D] flex items-center justify-center text-amber-400">
              <Wrench className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white">CNC & Zanaatkar Montaj</h4>
              <p className="text-[12px] text-stone-400 mt-0.5">Pirinç ağırlıklar, çelik şaftlar ve fırçasız güç üniteleri.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#161A22] border border-[#262E3D] flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white">Zorlu Kaya Parkuru Testi</h4>
              <p className="text-[12px] text-stone-400 mt-0.5">Tüm özel araçlar teslimat öncesi tırmanış testinden geçer.</p>
            </div>
          </div>
        </div>

        {/* Ana Footer Alanı */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-12 border-b border-[#1E232F]">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <h3 className="font-mono text-lg tracking-[0.2em] font-extrabold text-white uppercase">
                CIHANPOL RC CRAWLER LAB
              </h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              1/10 ve 1/24 ölçekli profesyonel kaya tırmanıcılar (rock crawler), CNC pirinç portal aks yükseltmeleri, sensörlü fırçasız motor kombinasyonları ve özel proje şasileri üreten butik modelcilik atölyesi.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/905551234567?text=Merhaba,%20RC%20Crawler%20parça%20ve%20araç%20talebi%20hakkında%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                WhatsApp RC Teknik Danışmanı
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Kategoriler</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Crawler Araçlar (RTR & Kit)
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Ağır Pirinç (Brass) Parçalar
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Fırçasız Motor & Servo
                </Link>
              </li>
              <li>
                <Link href="/paketler" className="text-amber-300 font-bold hover:text-amber-200 transition-colors">
                  ★ Özel Paket Fırsatları
                </Link>
              </li>
              <li>
                <Link href="/rehber" className="text-amber-400 font-bold hover:text-amber-300 transition-colors">
                  📖 Sistem Rehberi
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">
                  Yönetici Girişi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Mühendislik & Topluluk</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/hesaplayici" className="hover:text-amber-400 transition-colors">
                  🛠️ CoG & Dişli Hesaplayıcı
                </Link>
              </li>
              <li>
                <Link href="/parkurlar" className="hover:text-amber-400 transition-colors">
                  📍 Türkiye Kaya Parkurları
                </Link>
              </li>
              <li>
                <Link href="/topluluk" className="hover:text-amber-400 transition-colors">
                  🏆 Ayın Kaya Canavarı
                </Link>
              </li>
              <li>
                <Link href="/takas" className="hover:text-amber-400 transition-colors">
                  🔄 Eski Şasini Getir (Takas)
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="hover:text-amber-400 transition-colors">
                  💼 B2B & Kulüp Masası
                </Link>
              </li>
              <li>
                <Link href="/bakim" className="hover:text-amber-400 transition-colors">
                  🔧 Sezonluk Bakım Paketleri
                </Link>
              </li>
              <li>
                <Link href="/3d-baski" className="hover:text-amber-400 transition-colors">
                  🖨️ 3D Baskı Parça Üretimi
                </Link>
              </li>
              <li>
                <Link href="/tescil" className="hover:text-amber-400 transition-colors">
                  🎖️ Şasi Tescil & Seri No
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Telif & Alt Bilgi */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} CIHANPOL RC CRAWLER LAB. Tüm hakları saklıdır.</p>
          <p className="tracking-wider uppercase font-mono">RC Scale Engineering & Private Invite Platform</p>
        </div>
      </div>
    </footer>
  );
}
