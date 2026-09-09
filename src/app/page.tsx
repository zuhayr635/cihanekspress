"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import CrawlerConfigurator from "@/components/CrawlerConfigurator";
import { useCart } from "@/lib/cart-context";
import {
  Sparkles,
  Shield,
  ArrowRight,
  Lock,
  KeyRound,
  CheckCircle2,
  MessageCircle,
  Wrench,
  Flame,
  Zap,
  Cpu,
  Search,
} from "lucide-react";

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  images: string;
  basePrice: number;
  salePrice?: number | null;
  isFeatured?: boolean;
  category?: { name: string } | null;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export default function HomePage() {
  const { vipSession, storeSettings } = useCart();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScale, setSelectedScale] = useState<"all" | "1/10" | "1/24">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products?category=${selectedCategory}`);
        const data = await res.json();
        if (data.products) setProducts(data.products);
        if (data.categories) setCategories(data.categories);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedCategory]);

  const isSalesAllowed =
    storeSettings?.storeMode === "PUBLIC_SALE" ||
    (storeSettings?.storeMode === "INVITE_ONLY" && vipSession.isVip) ||
    vipSession.isVip;

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q);

    const matchesScale =
      selectedScale === "all" ||
      p.title.includes(selectedScale) ||
      (p.shortDescription && p.shortDescription.includes(selectedScale)) ||
      p.description.includes(selectedScale);

    return matchesSearch && matchesScale;
  });

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 bg-[#0F1115] text-[#E2E8F0]">
      {/* 1. HERO BÖLÜMÜ (RC Crawler High-Performance Industrial Hero) */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#07090D] overflow-hidden border-b border-[#1E2535]">
        {/* Arka Plan Blueprint Izgarası ve Crawler Görseli */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-35 z-0 pointer-events-none" />
        
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=2000&q=85"
            alt="Custom RC Crawler Rigs"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/75 to-transparent" />
        </div>

        {/* Hero Köşe Telemetri İşaretleri (CAD / HUD Overlay) */}
        <div className="hidden lg:block absolute top-8 left-8 text-[10px] font-mono text-stone-500 space-y-1 z-10 border-l border-amber-500/40 pl-3">
          <p className="text-amber-400 font-bold">LAT: 39°55'N // ELEV: 1850M</p>
          <p>STAGE 4 // ROCK CLIMBING BENCHMARK</p>
          <p>PORTAL AXLE CLEARANCE: +18.5MM</p>
        </div>

        <div className="hidden lg:block absolute top-8 right-8 text-[10px] font-mono text-stone-500 text-right space-y-1 z-10 border-r border-amber-500/40 pr-3">
          <p className="text-amber-400 font-bold">WEIGHT BIAS: %62 FRONT / %38 REAR</p>
          <p>MAX GRADE ATTAINED: 68.4°</p>
          <p>CNC 6061-T6 BILLET & BRASS</p>
        </div>

        {/* Hero İçerik */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-amber-500/40 bg-amber-500/10 rounded-xs text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-amber-400 backdrop-blur-md font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Scale Rock Crawling & CNC Brass Engineering</span>
          </div>

          <h1 className="font-mono text-3xl sm:text-6xl md:text-7xl tracking-tight leading-[1.08] font-black uppercase text-white">
            Kaya Parkurları İçin <br />
            <span className="text-amber-400 font-black drop-shadow-md">Ağır Metal Mühendisliği</span>
          </h1>

          <p className="text-xs sm:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            1/10 ve 1/24 profesyonel kaya tırmanıcı şasileri, ağırlık merkezini yere çeken ağır pirinç portal kapakları, FOC sensörlü fırçasız motorlar ve kilitli diferansiyeller. 
            Sınırlı parti CNC işleme parçalarımız kulüp davetiyelidir.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#garaj"
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-black text-xs uppercase tracking-[0.2em] font-black hover:bg-amber-400 transition-all rounded-xs flex items-center justify-center gap-2 group shadow-xl shadow-amber-500/20"
            >
              <span>Crawler Parçalarını İncele</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#rig-builder"
              className="w-full sm:w-auto px-8 py-4 border border-amber-500/50 bg-[#141A25] text-amber-400 text-xs uppercase tracking-[0.2em] font-extrabold hover:bg-amber-500/15 hover:border-amber-400 transition-all rounded-xs flex items-center justify-center gap-2 group"
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Rig Kurulum Sihirbazı</span>
            </a>

            {!vipSession.isVip && storeSettings?.storeMode !== "PUBLIC_SALE" && (
              <a
                href="#davetiye-bilgi"
                className="w-full sm:w-auto px-8 py-4 border border-stone-700 bg-stone-900/90 text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-stone-800 transition-all rounded-xs flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>VIP Girişi Yap</span>
              </a>
            )}
          </div>

          {/* Popüler Platform Hızlı Etiketleri */}
          <div className="pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mr-1">
              Şasi Uyumu:
            </span>
            {["TRX-4", "SCX10", "SCX24", "Capra", "Overdrive", "Pirinç"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  const el = document.getElementById("garaj");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-2.5 py-1 bg-[#121620] hover:bg-amber-500/15 border border-stone-800 hover:border-amber-400/60 rounded-xs text-[10px] font-mono text-stone-300 hover:text-amber-400 transition-all"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. TEKNİK AVANTAJLAR VE ERİŞİM PROTOKOLÜ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="bg-[#141822] border border-[#262F3F] rounded-sm p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-stone-900 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Shield className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-white">
                Tek Kullanımlık RC Token
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Her bağlantı tek kullanımlıktır. Tıklandığı an VIP oturum açılır, link yakılır ve başkasıyla paylaşılamaz.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-stone-900 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Lock className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-white">
                {isSalesAllowed ? "Kulüp Satış İzni Aktif" : "Özel Proje Vitrini"}
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {isSalesAllowed
                  ? "Tebrikler! Özel tırmanıcı parçaları ve sepet özellikleri oturumunuz için aktif edildi."
                  : "Genel ziyaretçiler yalnızca projeleri inceleyebilir. Fiyatlar ve sipariş kilitlidir."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-stone-900 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-white">
                Doğrudan Garaj Güvencesi
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Kurumsal IBAN havale ile dekont yükleme, WhatsApp parça danışmanlığı ve 3D Secure kart ödemesi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ÜRÜN VE PARÇA VİTRİNİ (#garaj) */}
      <section id="garaj" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#232A36] pb-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Performance Catalog
            </span>
            <h2 className="font-mono text-2xl sm:text-4xl text-white font-extrabold uppercase">
              RC Crawler & Yükseltme Parçaları
            </h2>
          </div>

          {/* Kategori Filtreleri */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-xs transition-all whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : "bg-[#161A22] border border-[#262E3D] text-stone-300 hover:border-amber-400"
              }`}
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-xs transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "bg-[#161A22] border border-[#262E3D] text-stone-300 hover:border-amber-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Arama & Ölçek Filtreleme Barı */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#141822] p-4 rounded-sm border border-[#232A36]">
          {/* Arama Kutusu */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Parça adı, portal, pirinç veya TRX4 ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0F1115] border border-stone-700 rounded-sm text-xs font-mono text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Ölçek Seçimi */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-mono text-stone-400 uppercase mr-1 whitespace-nowrap">Ölçek:</span>
            <button
              onClick={() => setSelectedScale("all")}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-xs transition-all ${
                selectedScale === "all"
                  ? "bg-stone-200 text-black"
                  : "bg-[#161A22] border border-stone-800 text-stone-400 hover:text-white"
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedScale("1/10")}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-xs transition-all ${
                selectedScale === "1/10"
                  ? "bg-amber-400 text-black font-extrabold shadow-sm"
                  : "bg-[#161A22] border border-stone-800 text-stone-400 hover:text-white"
              }`}
            >
              1/10 Pro
            </button>
            <button
              onClick={() => setSelectedScale("1/24")}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-xs transition-all ${
                selectedScale === "1/24"
                  ? "bg-amber-400 text-black font-extrabold shadow-sm"
                  : "bg-[#161A22] border border-stone-800 text-stone-400 hover:text-white"
              }`}
            >
              1/24 Mini
            </button>
          </div>
        </div>

        {/* Ürün Listesi */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse space-y-4 bg-[#141822] p-4 rounded-sm border border-stone-800">
                <div className="aspect-3/4 bg-stone-800 rounded-sm" />
                <div className="h-4 bg-stone-800 w-3/4 rounded-xs" />
                <div className="h-3 bg-stone-800 w-1/2 rounded-xs" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-stone-800 rounded-sm space-y-3 bg-[#12151C]">
            <p className="font-mono text-lg text-stone-300">Aramanıza veya filtrelerinize uygun parça bulunamadı.</p>
            <p className="text-xs text-stone-500">Lütfen farklı bir anahtar kelime veya ölçek seçiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. CRAWLER SETUP & RIG SİHİRBAZI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CrawlerConfigurator />
      </section>

      {/* 4. VIP DAVETİYE BİLGİLENDİRME BANNERI */}
      {!vipSession.isVip && storeSettings?.storeMode !== "PUBLIC_SALE" && (
        <section id="davetiye-bilgi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141822] border border-amber-500/30 text-white rounded-sm p-8 sm:p-14 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl relative z-10 space-y-6">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold">
                Özel Crawler Kulüp Politikası
              </span>
              <h2 className="font-mono text-3xl sm:text-4xl text-white font-extrabold uppercase leading-snug">
                RC Araç veya Parça Siparişi Vermek İçin Ne Yapmalısınız?
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Cihanpol RC Lab bünyesinde hazırlanan araçlar ve ağır pirinç döküm parçalar sınırlı partiler halinde üretilmektedir. 
                Yöneticimiz tarafından size iletilen tek kullanımlık linke tıkladığınızda tüm gizli parça fiyatları açılır, varyantlar seçilebilir ve sepet/ödeme aşamaları aktif olur.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/905551234567?text=Merhaba,%20RC%20Crawler%20parça%20ve%20araç%20siparişi%20için%20VIP%20davetiye%20kodu%20talep%20ediyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#25D366] text-black text-xs uppercase tracking-widest font-extrabold rounded-sm hover:bg-[#20bd5a] transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>WhatsApp ile VIP Davetiye Talep Et</span>
                </a>
              </div>
            </div>

            <div className="hidden lg:block absolute -right-10 -bottom-10 w-96 h-96 opacity-10 pointer-events-none text-amber-400">
              <Wrench className="w-full h-full stroke-[0.5]" />
            </div>
          </div>
        </section>
      )}

      {/* 5. ÖZEL YAPIM GARAJ & ATÖLYE HİKAYESİ (#about) */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1E232F] pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-4/5 w-full bg-[#161A22] rounded-sm overflow-hidden border border-[#283244]">
            <Image
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
              alt="RC Crawler CNC & Tuning Garage"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold">
              Kaya Tırmanışı Mühendisliği
            </span>
            <h2 className="font-mono text-3xl sm:text-4xl text-white font-extrabold uppercase leading-tight">
              Ağırlık Merkezi (CoG), Artikülasyon ve Sıfır Tork Bükülmesi
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Standart fabrika çıkışı RC araçlar dik kaya tırmanışlarında kolayca takla atar ve dişli sıyırır. Cihanpol RC Crawler Lab olarak, pirinç portal ağırlıkları, sertleştirilmiş çelik şaftlar ve akıllı FOC fırçasız motor sistemleriyle araçların tırmanma limitlerini yeniden tanımlıyoruz.
            </p>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Her özel toplanan crawler şasisi, eğim platformu ve kayalık parkur testlerinden geçirildikten sonra sahibine ulaştırılır.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#232A36]">
              <div>
                <span className="font-mono text-2xl text-amber-400 font-extrabold block">65°+</span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono">
                  Tırmanış Eğimi Güvencesi
                </span>
              </div>
              <div>
                <span className="font-mono text-2xl text-amber-400 font-extrabold block">+420g</span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono">
                  Pirinç Alt Ağırlık Desteği
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TEKNİK DESTEK & ÖZEL CRAWLER TOPLAMA TALEBİ (#contact) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1E232F] pt-20">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold">
            Özel Proje & Destek
          </span>
          <h2 className="font-mono text-3xl sm:text-4xl text-white font-extrabold uppercase">
            Özel Şasi Toplama & Parça Uyumluluğu
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
            Mevcut TRX-4, Axial SCX10, Element RC veya Vanquish aracınız için doğru pirinç ağırlık ve fırçasız motor seçimi yapmak için atölyemizle iletişime geçebilirsiniz.
          </p>
          <div className="pt-4 flex justify-center">
            <a
              href="https://wa.me/905551234567?text=Merhaba,%20aracıma%20özel%20crawler%20parça%20ve%20montaj%20tavsiyesi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-amber-500 text-black text-xs uppercase tracking-widest font-extrabold rounded-sm hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>WhatsApp RC Uzmanına Danışın</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
