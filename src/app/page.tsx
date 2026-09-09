"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import CrawlerConfigurator from "@/components/CrawlerConfigurator";
import { useCart } from "@/lib/cart-context";
import {
  Shield,
  ArrowRight,
  MessageCircle,
  Wrench,
  Flame,
  Zap,
  Cpu,
  Search,
  Compass,
  Layers,
  Award,
  ChevronRight,
  Check,
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

  const phone = storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905551234567";

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
    <div className="space-y-20 sm:space-y-28 pb-24 bg-[#060709] text-[#EDE8DF] selection:bg-amber-600 selection:text-black">
      
      {/* 1. HERO BÖLÜMÜ (Obsidian & Masif Pirinç Zanaat Atölyesi) */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#060709] overflow-hidden border-b border-[#1E1B18] pt-12 sm:pt-0">
        
        {/* Arka Plan Blueprint Izgarası ve Crawler Görseli */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-30 z-0 pointer-events-none" />
        
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=2000&q=85"
            alt="Custom RC Crawler Rigs"
            fill
            priority
            className="object-cover object-center filter contrast-125 brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-[#060709]/85 to-transparent" />
        </div>

        {/* Hero Köşe Telemetri İşaretleri (CAD / HUD Overlay) */}
        <div className="hidden xl:block absolute top-10 left-10 text-[10px] font-mono text-stone-500 space-y-1.5 z-10 border-l border-amber-600/50 pl-3">
          <p className="text-amber-400 font-bold tracking-wider">// ATELIER LAT: 39°55'N · ALT: 1850M</p>
          <p className="tracking-wide">CHASSIS LAB // BILLET & SCALE WORKS</p>
          <p className="text-stone-400">PORTAL CLEARANCE: +18.5MM HEAVY BRASS</p>
        </div>

        <div className="hidden xl:block absolute top-10 right-10 text-[10px] font-mono text-stone-500 text-right space-y-1.5 z-10 border-r border-amber-600/50 pr-3">
          <p className="text-amber-400 font-bold tracking-wider">WEIGHT BIAS: %64 FRONT / %36 REAR //</p>
          <p className="tracking-wide">STATUS: ATELIER ORDER QUEUE ACTIVE</p>
          <p className="text-stone-400">CNC 6061-T6 BILLET & SOLID YELLOW BRASS</p>
        </div>

        {/* Hero Ana İçerik */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 py-16">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 border border-amber-600/40 bg-amber-950/20 rounded-xs text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-amber-300 backdrop-blur-md font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Özel Hobi & Ağır Mekanik Proje Kataloğu</span>
          </div>

          <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] font-black uppercase text-white">
            ZAMANSIZ METALLER, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-lg">
              KUSURSUZ TIRMANIŞ DENGESİ
            </span>
          </h1>

          <p className="text-xs sm:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed font-sans">
            1/10 ve 1/24 profesyonel kaya tırmanıcı şasileri, ağırlık merkezini tabana kilitleyen masif pirinç portal akslar, FOC fırçasız güç üniteleri ve el yapımı CNC modifikasyon projeleri. Çevrim içi perakende satış yapılmaz; her proje usta ile WhatsApp veya randevu ile istişare edilir.
          </p>

          {/* Eylem Butonları */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono">
            <a
              href="#garaj"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs uppercase tracking-[0.2em] font-black transition-all rounded-xs flex items-center justify-center gap-2 group shadow-xl shadow-amber-600/20"
            >
              <span>KATALOĞU İNCELE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={`https://wa.me/${phone}?text=Merhaba%20Cihan%20Usta,%20%C3%B6zel%20crawler%20projeleri%20hakk%C4%B1nda%20dan%C4%B1%C5%9Fmak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 border border-[#25D366]/50 bg-[#0E1F16] hover:bg-[#25D366] text-[#25D366] hover:text-black text-xs uppercase tracking-[0.2em] font-black transition-all rounded-xs flex items-center justify-center gap-2 group shadow-lg shadow-[#25D366]/10"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WHATSAPP'TAN PROJENİ DANIŞ</span>
            </a>

            <a
              href="#rig-builder"
              className="w-full sm:w-auto px-6 py-4 border border-[#2A241F] bg-[#0E0F14] text-stone-200 hover:text-amber-400 text-xs uppercase tracking-[0.2em] font-bold hover:border-amber-500/50 transition-all rounded-xs flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4 text-amber-500" />
              <span>RİG SİHİRBAZI</span>
            </a>
          </div>

          {/* Hızlı Platform Etiketleri */}
          <div className="pt-6 border-t border-[#1E1B18] flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mr-1">
              ŞASİ PLATFORMU:
            </span>
            {["TRX-4", "SCX10", "SCX24", "Capra", "Overdrive", "Pirinç Aks"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  const el = document.getElementById("garaj");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-2.5 py-1 bg-[#0E0F14] hover:bg-amber-600/15 border border-[#1E1B18] hover:border-amber-500/60 rounded-xs text-[10px] font-mono text-stone-300 hover:text-amber-300 transition-all"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ATÖLYE ÇALIŞMA İLKELERİ VE HUKUKİ HOBİ KALKANI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="bg-[#0A0B0F] border border-[#1E1B18] rounded-xs p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 font-mono brass-glow">
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xs bg-[#11131A] border border-amber-600/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Shield className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-white">
                Hobi Atölyesi Çekincesi
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed font-sans font-light">
                Perakende e-ticaret mağazası değildir. Şasi modifikasyon ve CNC prototip projelerini içeren zanaatkar kataloğudur.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xs bg-[#11131A] border border-amber-600/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Wrench className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-white">
                Kişiye Özel CNC & El Montajı
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed font-sans font-light">
                Her crawler aracı arazi eğim testlerinden geçirilir, ağırlık merkezi (CoG) dengelenir ve talep üzerine toplanır.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xs bg-[#11131A] border border-[#25D366]/40 flex items-center justify-center text-[#25D366] flex-shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-white">
                Doğrudan Atölye İletişimi
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed font-sans font-light">
                Sipariş ve parça tedariği WhatsApp üzerinden usta ile birebir istişare edilerek elden veya kargo ile teslim edilir.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. ÖNE ÇIKAN MASTERPIECE TANITIMI (Bespoke Atelier Commission) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A0C10] border border-[#1E1B18] p-6 sm:p-10 rounded-xs brass-glow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 relative aspect-[4/3] bg-black border border-[#1E1B18] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1200&q=85"
              alt="Custom Billet Rig"
              fill
              className="object-cover group-hover:scale-105 transition-all duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-xs font-mono">
              <span className="bg-black/90 px-3 py-1 text-white font-bold tracking-widest text-xs border border-amber-600/40">
                PROJE NO: #CR-08X TITANIUM
              </span>
              <span className="bg-amber-600/90 text-black font-black px-2.5 py-1 uppercase text-[10px] tracking-wider">
                REZERVASYONA AÇIK
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-amber-500 font-mono text-xs tracking-[0.25em] uppercase block">
                // ATÖLYE ÖZEL İMALATI
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white uppercase">
                CAPRA 4WS COMPETITION // TİTANYUM EDİSYON
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-light font-sans">
                Bu araçta tüm bağlantı linkleri 7075 sertleştirilmiş uçak alüminyumundan işlenmiş, şanzıman iç dişlileri helisel çeliğe dönüştürülmüştür. Ön portal kütlesi +450 gram pirinç ilavesi ile 60° tırmanışlarda arka takla atmasını kesin olarak engeller.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-[#1E1B18] py-4 text-xs font-mono">
              <div>
                <span className="text-stone-500 uppercase tracking-wider block text-[10px]">İŞÇİLİK SÜRESİ</span>
                <span className="text-white text-sm font-bold">42 SAAT EL MONTAJI</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase tracking-wider block text-[10px]">TORK & MOTOR</span>
                <span className="text-amber-400 text-sm font-bold">FOC 1800KV SENSÖRLÜ</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase tracking-wider block text-[10px]">AĞIRLIK DAĞILIMI</span>
                <span className="text-white text-sm font-bold">%64 ÖN / %36 ARKA</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase tracking-wider block text-[10px]">ZEMİN AÇIKLIĞI</span>
                <span className="text-emerald-400 text-sm font-bold">+18.5MM PORTAL</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <span className="text-stone-500 text-[10px] font-mono uppercase block tracking-wider">
                  ATÖLYE MALİYET REFERANSI
                </span>
                <span className="text-amber-400 font-mono text-2xl font-black">
                  28.500 ₺
                </span>
              </div>
              <a
                href={`https://wa.me/${phone}?text=Merhaba%20Cihan%20Usta,%20CR-08X%20Titanium%20Edition%20Capra%20projesi%20hakk%C4%B1nda%20rezervasyon%20ve%20detay%20g%C3%B6r%C3%BC%C5%9Fmesi%20talep%20ediyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-black text-xs font-mono font-black tracking-wider uppercase transition-all rounded-xs text-center flex items-center justify-center gap-2"
              >
                <span>BU PROJE İÇİN TALEP OLUŞTUR</span>
                <span>↗</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 4. ÜRÜN VE PARÇA VİTRİNİ (#garaj) */}
      <section id="garaj" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1E1B18] pb-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-500 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Performance Catalog
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl text-white font-black uppercase">
              RC Crawler & Modifikasyon Parçaları
            </h2>
          </div>

          {/* Kategori Filtreleri */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none font-mono">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-xs transition-all whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-amber-600 text-black shadow-md shadow-amber-600/20"
                  : "bg-[#0E0F14] border border-[#1E1B18] text-stone-400 hover:text-white hover:border-amber-500/40"
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
                    ? "bg-amber-600 text-black shadow-md shadow-amber-600/20"
                    : "bg-[#0E0F14] border border-[#1E1B18] text-stone-400 hover:text-white hover:border-amber-500/40"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Arama & Ölçek Filtreleme Barı */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0A0C10] p-4 rounded-xs border border-[#1E1B18]">
          
          {/* Arama Kutusu */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Parça adı, portal aks, pirinç veya TRX4..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#060709] border border-[#1E1B18] rounded-xs text-xs font-mono text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
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
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 font-mono">
            <span className="text-[11px] text-stone-500 uppercase mr-1 whitespace-nowrap">ÖLÇEK:</span>
            <button
              onClick={() => setSelectedScale("all")}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs transition-all ${
                selectedScale === "all"
                  ? "bg-stone-200 text-black"
                  : "bg-[#0E0F14] border border-[#1E1B18] text-stone-400 hover:text-white"
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedScale("1/10")}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs transition-all ${
                selectedScale === "1/10"
                  ? "bg-amber-500 text-black font-extrabold shadow-sm"
                  : "bg-[#0E0F14] border border-[#1E1B18] text-stone-400 hover:text-white"
              }`}
            >
              1/10 Pro
            </button>
            <button
              onClick={() => setSelectedScale("1/24")}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs transition-all ${
                selectedScale === "1/24"
                  ? "bg-amber-500 text-black font-extrabold shadow-sm"
                  : "bg-[#0E0F14] border border-[#1E1B18] text-stone-400 hover:text-white"
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
              <div key={n} className="animate-pulse space-y-4 bg-[#0A0C10] p-4 rounded-xs border border-[#1E1B18]">
                <div className="aspect-3/4 bg-[#141822] rounded-xs" />
                <div className="h-4 bg-[#141822] w-3/4 rounded-xs" />
                <div className="h-3 bg-[#141822] w-1/2 rounded-xs" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#1E1B18] rounded-xs space-y-3 bg-[#0A0C10] font-mono">
            <p className="text-base text-stone-300">Aramanıza veya filtrelerinize uygun parça bulunamadı.</p>
            <p className="text-xs text-stone-500 font-sans">Lütfen farklı bir anahtar kelime veya ölçek seçiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. CRAWLER SETUP & RIG SİHİRBAZI */}
      <section id="rig-builder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CrawlerConfigurator />
      </section>

      {/* 6. ZANAATKAR MANİFESTOSU & TEKNİK STANDARTLAR (#about) */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1E1B18] pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="relative aspect-4/5 w-full bg-[#0A0C10] rounded-xs overflow-hidden border border-[#1E1B18] group">
            <Image
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
              alt="RC Crawler CNC & Tuning Garage"
              fill
              className="object-cover group-hover:scale-105 transition-all duration-700 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/85 border border-amber-600/30 text-[10px] font-mono text-amber-400">
              // ATÖLYE HASSAS TEST PARKURU · 60° TIRMANIŞ MASASI
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-500 font-bold">
              // KAYA TIRMANIŞI MÜHENDİSLİĞİ
            </span>
            <h2 className="font-mono text-3xl sm:text-4xl text-white font-bold uppercase leading-tight">
              Ağırlık Merkezi (CoG), Artikülasyon ve Sıfır Tork Bükülmesi
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light font-sans">
              Standart fabrika çıkışı plastik RC araçlar dik kaya tırmanışlarında kolayca geriye takla atar ve diferansiyel dişlilerini sıyırır. Cihanpol RC Atölyesi olarak, döküm pirinç portal ağırlıkları, sertleştirilmiş çelik şaftlar ve akıllı FOC fırçasız motor sistemleriyle araçların tırmanma sınırlarını yeniden çiziyoruz.
            </p>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light font-sans">
              Her özel toplanan crawler şasisi, eğim platformu ve kayalık parkur testlerinden geçirildikten sonra sahibine teslim edilir.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#1E1B18] font-mono">
              <div>
                <span className="text-2xl sm:text-3xl text-amber-400 font-black block">65°+</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400">
                  Tırmanış Eğimi Güvencesi
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl text-amber-400 font-black block">+420g</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400">
                  Pirinç Alt Kütle Takviyesi
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. DOĞRUDAN USTA İSTİŞARE & TALEP MASASI (#contact) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1E1B18] pt-20">
        <div className="text-center max-w-2xl mx-auto space-y-5 bg-[#0A0C10] border border-[#1E1B18] p-8 sm:p-12 rounded-xs brass-glow">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-500 font-bold">
            // DOĞRUDAN USTA İLETİŞİMİ
          </span>
          <h2 className="font-mono text-2xl sm:text-4xl text-white font-bold uppercase">
            Özel Şasi Toplama & Parça Uyumluluğu
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light font-sans">
            Mevcut TRX-4, Axial SCX10, Element RC veya Vanquish aracınız için doğru pirinç ağırlık, şasi büküm açısı ve fırçasız motor seçimi yapmak için atölyemizle doğrudan WhatsApp üzerinden görüşebilirsiniz.
          </p>
          <div className="pt-2 flex justify-center font-mono">
            <a
              href={`https://wa.me/${phone}?text=Merhaba%20Cihan%20Usta,%20arac%C4%B1ma%20%C3%B6zel%20crawler%20par%C3%A7a%20ve%20montaj%20tavsiyesi%20almak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs uppercase tracking-widest font-black rounded-xs transition-all flex items-center gap-2 shadow-xl shadow-amber-600/20"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>WHATSAPP RC UZMANINA DANIŞIN</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
