import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Cpu,
  Wrench,
  ShieldCheck,
  ShoppingBag,
  KeyRound,
  FileCheck2,
  Truck,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  Flame,
  CreditCard,
  MessageCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Sistem ve Çalışma Rehberi | CIHANPOL RC CRAWLER LAB",
  description:
    "Özel yapım RC crawler atölyesi, parça uyumluluk filtresi, rig builder, VIP davetiye motoru ve yönetici paneli kullanım kılavuzu.",
};

export default function RehberPage() {
  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E2E8F0] pb-24">
      {/* Header Banner */}
      <div className="relative border-b border-[#1E2535] bg-[#07090D] overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-amber-500/10 border border-amber-500/40 text-amber-400 font-mono text-[11px] uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" />
            Resmi Platform Kullanım ve Mimari Rehberi
          </div>

          <h1 className="font-mono text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Sistem ve Mağaza <span className="text-amber-400">Nasıl Çalışır?</span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-light">
            CIHANPOL RC CRAWLER LAB, standart bir e-ticaret sitesinden farklı olarak{" "}
            <strong className="text-white font-medium">butik zanaatkar atölyesi</strong> ve{" "}
            <strong className="text-white font-medium">özel davetiye korumalı satış motoru</strong> hibrit mimarisiyle çalışır.
            Aşağıda hem müşteri alışveriş döngüsünü hem de yönetici operasyonlarını adım adım inceleyebilirsiniz.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            <a
              href="#musteri-akisi"
              className="px-4 py-2 bg-[#141A25] border border-amber-500/40 hover:border-amber-400 text-amber-400 rounded-xs transition-colors"
            >
              1. Müşteri Alışveriş Akışı ↓
            </a>
            <a
              href="#yonetici-akisi"
              className="px-4 py-2 bg-[#141A25] border border-stone-700 hover:border-stone-500 text-stone-200 rounded-xs transition-colors"
            >
              2. Yönetici (Admin) Masası ↓
            </a>
            <a
              href="#demo-baglantilari"
              className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xs hover:bg-amber-400 transition-colors"
            >
              3. Canlı Test & Demo Bağlantıları ↓
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-20">
        {/* ========================================================================= */}
        {/* 1. MÜŞTERİ ALIŞVERİŞ AKIŞI */}
        {/* ========================================================================= */}
        <section id="musteri-akisi" className="space-y-8 scroll-mt-24">
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-amber-500 uppercase">
                BÖLÜM 1
              </span>
              <h2 className="font-mono text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2.5 mt-0.5">
                <ShoppingBag className="w-6 h-6 text-amber-400" />
                Müşteri (Ziyaretçi) Tarafı Nasıl Çalışır?
              </h2>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xs">
              MÜŞTERİ DENEYİMİ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adım 1 */}
            <div className="bg-[#121620] border border-[#1E2535] rounded-xs p-6 relative group hover:border-amber-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xs bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-mono text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Araç Uyumluluk Filtresi
              </h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Müşteri sitede kaybolmaz. Üst bardaki <strong className="text-white">"Aracınızı Seçin"</strong> menüsünden kendi şasisini (Örn: <em className="text-amber-400">Traxxas TRX-4</em> veya <em className="text-amber-400">Axial SCX10</em>) seçer.
                Sistem tüm mağazada sadece o araca birebir uyan aksları, linkleri ve parçaları yeşil <strong className="text-emerald-400">"UYUMLU"</strong> rozetiyle filtreler.
              </p>
            </div>

            {/* Adım 2 */}
            <div className="bg-[#121620] border border-[#1E2535] rounded-xs p-6 relative group hover:border-amber-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xs bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-mono text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                İnteraktif Rig Builder
              </h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Kendi tırmanıcısını sıfırdan toplamak isteyen müşteriler ana sayfadaki <strong className="text-white">Kurulum Sihirbazı</strong>&apos;nı kullanır:
                Şasi ➔ Portal Aks ➔ Fırçasız Motor/ESC ➔ Jant/Lastik adımlarını seçer.
                Ağırlık dengesi (%60 Ön / %40 Arka) ve bütçe canlı hesaplanır, tek tıkla sepete aktarılır.
              </p>
            </div>

            {/* Adım 3 */}
            <div className="bg-[#121620] border border-[#1E2535] rounded-xs p-6 relative group hover:border-amber-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xs bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-mono text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Fiyat Politikası & VIP Davetiye
              </h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                <strong className="text-white">Katalog Modunda:</strong> Genel ziyaretçilere fiyatlar ve sepet gizlidir; ürünler bir sanat eseri ve teknik katalog gibi incelenir, WhatsApp ile bilgi alınır.<br />
                <strong className="text-white">VIP Davetiye ile:</strong> Yöneticinin ilettiği özel linke tıklayan müşteride fiyatlar açılır ve müşteriye özel indirim (örn: %20) anında sepete tanımlanır.
              </p>
            </div>

            {/* Adım 4 */}
            <div className="bg-[#121620] border border-[#1E2535] rounded-xs p-6 relative group hover:border-amber-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xs bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                04
              </div>
              <h3 className="font-mono text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Atölye Montaj Hizmeti (+750 ₺)
              </h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Müşteri parçaları kendisi toplamak istemiyorsa, ödeme sayfasında <strong className="text-white">&ldquo;Profesyonel Atölye Montajı & Su Geçirmezlik (Waterproofing)&rdquo;</strong> opsiyonunu işaretler.
                Parçalar atölyede zanaatkar ustalar tarafından toplanıp, rulmanlar yağlanarak ve test sürüşü yapılarak kargolanır.
              </p>
            </div>

            {/* Adım 5 */}
            <div className="bg-[#121620] border border-[#1E2535] rounded-xs p-6 relative group hover:border-amber-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xs bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                05
              </div>
              <h3 className="font-mono text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Modüler Ödeme & Dekont Yükleme
              </h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                <strong className="text-white">Havale / EFT:</strong> Garanti BBVA ve İş Bankası kurumsal IBAN&apos;ları verilir. Müşteri ödemeyi yaptıktan sonra ekrandan sürükle-bırak ile <strong className="text-amber-400">dekont fotoğrafını doğrudan sisteme yükler</strong>.<br />
                <strong className="text-white">WhatsApp:</strong> Sepet detaylarını tek tıkla WhatsApp hattınıza aktarır.<br />
                <strong className="text-white">Kredi Kartı:</strong> 3D Secure güvenli kart çekimi.
              </p>
            </div>

            {/* Adım 6 */}
            <div className="bg-[#121620] border border-[#1E2535] rounded-xs p-6 relative group hover:border-amber-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xs bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                06
              </div>
              <h3 className="font-mono text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Canlı Kargo & Montaj Takibi
              </h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Sipariş tamamlandığında müşteriye özel bir takip kodu üretilir (Örn: <code className="text-amber-400 font-mono">CHP-178897</code>).
                Müşteri istediği an <Link href="/order-tracking" className="text-amber-400 underline">/order-tracking</Link> sayfasına bu kodu girerek siparişinin montaj, test sürüşü ve kargo durumunu anlık izleyebilir.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. YÖNETİCİ OPERASYONLARI */}
        {/* ========================================================================= */}
        <section id="yonetici-akisi" className="space-y-8 scroll-mt-24">
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-amber-500 uppercase">
                BÖLÜM 2
              </span>
              <h2 className="font-mono text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2.5 mt-0.5">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                Yönetici (Admin) Kontrol Masası
              </h2>
            </div>
            <Link
              href="/admin"
              className="text-[11px] font-mono px-3 py-1.5 bg-amber-500 text-black font-bold rounded-xs hover:bg-amber-400 transition-colors flex items-center gap-1"
            >
              Paneli Aç <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-[#141822] border border-[#232A36] rounded-xs p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#0B0E14] border border-stone-800 rounded-xs">
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                  YÖNETİCİ GİRİŞ BİLGİLERİ
                </span>
                <div className="font-mono text-xs sm:text-sm text-white mt-1">
                  Panel: <code className="text-amber-400">/admin/login</code> | Kullanıcı:{" "}
                  <code className="text-amber-400">admin</code> | Şifre:{" "}
                  <code className="text-amber-400">admin123456</code>
                </div>
              </div>
              <Link
                href="/admin/login"
                className="px-4 py-2 text-xs font-mono font-bold uppercase bg-stone-800 hover:bg-amber-500 hover:text-black text-white rounded-xs transition-colors self-start sm:self-auto"
              >
                Giriş Yap →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Operasyon 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase">
                  <KeyRound className="w-4 h-4" />
                  1. Tek Kullanımlık VIP Link Üretimi
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Yönetici panelden müşteri adı, indirim oranı (%15, %20 vb.) ve süre belirleyerek tek tıkla özel link üretir.
                  Müşteri tıkladığı an link <strong className="text-white">&ldquo;USED&rdquo; (Kullanıldı)</strong> durumuna geçer ve o tarayıcıya kilitlenir. Başka birine devredilemez.
                </p>
              </div>

              {/* Operasyon 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase">
                  <FileCheck2 className="w-4 h-4" />
                  2. Dekont İnceleme & Tek Tık Onay
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Havale ile gelen siparişlerde müşterinin yüklediği banka dekontu yöneticinin ekranında önizleme olarak açılır.
                  Yönetici banka hesabını kontrol edip <strong className="text-white">&ldquo;Ödemeyi Onayla&rdquo;</strong> dediğinde sipariş otomatik montaj aşamasına geçer.
                </p>
              </div>

              {/* Operasyon 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase">
                  <Cpu className="w-4 h-4" />
                  3. Mağaza Modunu Değiştirme
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Yönetici tek bir butonla mağazayı <strong className="text-white">Katalog Modu</strong> (fiyatlar kapalı), <strong className="text-white">Sadece VIP Davetiyeliler</strong> veya <strong className="text-white">Herkese Açık Satış</strong> modlarına anında geçirebilir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CANLI TEST VE DEMO BAĞLANTILARI */}
        {/* ========================================================================= */}
        <section id="demo-baglantilari" className="space-y-8 scroll-mt-24">
          <div className="border-b border-stone-800 pb-4">
            <span className="text-[11px] font-mono tracking-widest text-amber-500 uppercase">
              BÖLÜM 3
            </span>
            <h2 className="font-mono text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2.5 mt-0.5">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Sistemi Test Etmek İçin Hızlı Bağlantılar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/"
              className="p-5 bg-[#121620] border border-[#1E2535] hover:border-amber-500/40 rounded-xs group transition-all"
            >
              <div className="text-amber-400 font-mono text-xs font-bold uppercase mb-1">Mağaza Vitrini</div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300">Ana Sayfa & Filtreler →</div>
              <p className="text-[11px] text-stone-400 mt-2">Kaya tırmanıcı araçlar, CNC parçalar ve araç seçici.</p>
            </Link>

            <Link
              href="/#rig-builder"
              className="p-5 bg-[#121620] border border-[#1E2535] hover:border-amber-500/40 rounded-xs group transition-all"
            >
              <div className="text-amber-400 font-mono text-xs font-bold uppercase mb-1">Rig Sihirbazı</div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300">Crawler Toplama Aracı →</div>
              <p className="text-[11px] text-stone-400 mt-2">Şasi, aks ve motor seçerek anlık ağırlık ve fiyat simülasyonu.</p>
            </Link>

            <Link
              href="/order-tracking"
              className="p-5 bg-[#121620] border border-[#1E2535] hover:border-amber-500/40 rounded-xs group transition-all"
            >
              <div className="text-amber-400 font-mono text-xs font-bold uppercase mb-1">Kargo & Montaj</div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300">Sipariş Takip Sayfası →</div>
              <p className="text-[11px] text-stone-400 mt-2">Sipariş kodu ile anlık hazırlık ve kargo sorgulama.</p>
            </Link>

            <Link
              href="/admin"
              className="p-5 bg-[#121620] border border-amber-500/40 hover:border-amber-400 bg-amber-500/5 rounded-xs group transition-all"
            >
              <div className="text-amber-400 font-mono text-xs font-bold uppercase mb-1">Yönetim Masası</div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300">Admin Paneli Girişi →</div>
              <p className="text-[11px] text-stone-400 mt-2">Kupon, sipariş, stok, dekont ve VIP link yönetimi.</p>
            </Link>
          </div>
        </section>

        {/* Geri Dönüş ve İletişim */}
        <div className="p-8 bg-[#141822] border border-[#232A36] rounded-xs text-center space-y-3">
          <h3 className="font-mono text-lg font-bold text-white uppercase">
            Sorularınız veya Özel Proje Talepleriniz mi Var?
          </h3>
          <p className="text-xs text-stone-400 max-w-xl mx-auto">
            Özel şasi toplama, CNC özel üretim parçalar veya toptan kulüp siparişleri için doğrudan teknik atölyemizle iletişime geçebilirsiniz.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/905551234567?text=Merhaba,%20CIHANPOL%20RC%20Crawler%20sistemi%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              WhatsApp Atölye Danışmanı ile Konuş
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
