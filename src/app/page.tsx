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
  Sparkles,
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
    <div className="space-y-16 sm:space-y-24 pb-24 bg-[#F8FAFC] text-[#0F172A] selection:bg-orange-500 selection:text-white">
      
      {/* 1. HERO BÖLÜMÜ (Daylight Titanium & Clean Prototyping Lab) */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-white border-b border-slate-200 lab-grid overflow-hidden pt-12 sm:pt-0">
        
        {/* Hero Köşe Telemetri İşaretleri */}
        <div className="hidden xl:block absolute top-10 left-10 text-[11px] font-mono text-slate-400 space-y-1 border-l-2 border-orange-600 pl-3">
          <p className="text-slate-900 font-bold tracking-wider">// ATELIER LAT: 39°55'N · ALT: 1850M</p>
          <p className="tracking-wide">CHASSIS LAB // CNC BILLET & SCALE WORKS</p>
          <p className="text-slate-500">PORTAL CLEARANCE: +18.5MM HEAVY BRASS</p>
        </div>

        <div className="hidden xl:block absolute top-10 right-10 text-[11px] font-mono text-slate-400 text-right space-y-1 border-r-2 border-orange-600 pr-3">
          <p className="text-slate-900 font-bold tracking-wider">WEIGHT BIAS: %64 FRONT / %36 REAR //</p>
          <p className="tracking-wide">STATUS: ATELIER ORDER QUEUE ACTIVE</p>
          <p className="text-slate-500">CNC 6061-T6 BILLET & SOLID YELLOW BRASS</p>
        </div>

        {/* Hero Ana İçerik */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 py-16 sm:py-24">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-200 bg-slate-50 rounded-xs text-[11px] tracking-widest uppercase text-slate-700 font-mono">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            <span>1/10 & 1/24 Scale Crawler Lab</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl tracking-tight font-black uppercase text-slate-950 leading-[1.05]">
            AĞIR METAL VE <br />
            <span className="text-orange-600">CNC MİKRON</span> KALİBRASYONU
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Seri üretim kalıp plastik araçlar yerine; masif sarı pirinç ağırlık blokları, 7075 sertleştirilmiş uçak alüminyumu ve eğim parkurlarında milimetrik dengelenen profesyonel kaya tırmanıcı şasileri. Çevrim içi perakende satış yapılmaz; her proje usta ile doğrudan istişare edilir.
          </p>

          {/* Eylem Butonları */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider">
            <a
              href="#garaj"
              className="w-full sm:w-auto px-8 py-4 bg-slate-950 hover:bg-slate-800 text-white transition-all rounded-xs flex items-center justify-center gap-2 group shadow-sm"
            >
              <span>KATALOĞU İNCELE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={`https://wa.me/${phone}?text=Merhaba%20Cihan%20Usta,%20%C3%B6zel%20crawler%20projeleri%20hakk%C4%B1nda%20dan%C4%B1%C5%9Fmak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 border border-emerald-600 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white transition-all rounded-xs flex items-center justify-center gap-2 group shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WHATSAPP'TAN PROJENİ DANIŞ</span>
            </a>

            <a
              href="#rig-builder"
              className="w-full sm:w-auto px-6 py-4 border border-slate-200 bg-white text-slate-800 hover:border-slate-400 transition-all rounded-xs flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4 text-orange-600" />
              <span>RİG SİHİRBAZI</span>
            </a>
          </div>

          {/* Hızlı Platform Etiketleri */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mr-1">
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
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-400 rounded-xs text-[11px] font-mono text-slate-700 transition-all"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ATÖLYE ÇALIŞMA İLKELERİ VE HUKUKİ HOBİ KALKANI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
        <div className="bg-white border border-slate-200 rounded-xs p-6 sm:p-8 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xs bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 flex-shrink-0">
              <Shield className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-950">
                Hobi Atölyesi Çekincesi
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">
                Perakende e-ticaret mağazası değildir. Şasi modifikasyon ve CNC prototip projelerini içeren zanaatkar kataloğudur.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xs bg-slate-50 border border-slate-200 flex items-center justify-center text-orange-600 flex-shrink-0">
              <Wrench className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-950">
                Kişiye Özel CNC & El Montajı
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">
                Her crawler aracı arazi eğim testlerinden geçirilir, ağırlık merkezi (CoG) dengelenir ve talep üzerine toplanır.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xs bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-950">
                Doğrudan Atölye İletişimi
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">
                Sipariş ve parça tedariği WhatsApp üzerinden usta ile birebir istişare edilerek elden veya kargo ile teslim edilir.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. ÖNE ÇIKAN MASTERPIECE TANITIMI (Daylight Lab Precision Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 p-6 sm:p-10 rounded-xs shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 relative aspect-[4/3] bg-slate-50 border border-slate-200 rounded-xs overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1200&q=85"
              alt="Custom Billet Rig"
              fill
              className="object-cover group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-xs font-mono">
              <span className="bg-white/95 backdrop-blur px-3 py-1 text-slate-900 font-bold tracking-widest text-xs border border-slate-200">
                PROJE NO: #CR-08X TITANIUM
              </span>
              <span className="bg-slate-950 text-white font-bold px-2.5 py-1 uppercase text-[10px] tracking-wider">
                REZERVASYONA AÇIK
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-orange-600 font-mono text-xs tracking-widest uppercase block font-bold">
                // ATÖLYE ÖZEL İMALATI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                CAPRA 4WS COMPETITION // TİTANYUM EDİSYON
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                Bu araçta tüm bağlantı linkleri 7075 sertleştirilmiş uçak alüminyumundan işlenmiş, şanzıman iç dişlileri helisel çeliğe dönüştürülmüştür. Ön portal kütlesi +450 gram pirinç ilavesi ile 60° tırmanışlarda arka takla atmasını kesin olarak engeller.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 uppercase tracking-wider block text-[10px]">İŞÇİLİK SÜRESİ</span>
                <span className="text-slate-900 text-sm font-bold">42 SAAT EL MONTAJI</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider block text-[10px]">TORK & MOTOR</span>
                <span className="text-orange-600 text-sm font-bold">FOC 1800KV SENSÖRLÜ</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider block text-[10px]">AĞIRLIK DAĞILIMI</span>
                <span className="text-slate-900 text-sm font-bold">%64 ÖN / %36 ARKA</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider block text-[10px]">ZEMİN AÇIKLIĞI</span>
                <span className="text-emerald-600 text-sm font-bold">+18.5MM PORTAL</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <span className="text-slate-400 text-[10px] font-mono uppercase block tracking-wider">
                  ATÖLYE MALİYET REFERANSI
                </span>
                <span className="text-slate-950 font-mono text-2xl font-black">
                  28.500 ₺
                </span>
              </div>
              <a
                href={`https://wa.me/${phone}?text=Merhaba%20Cihan%20Usta,%20CR-08X%20Titanium%20Edition%20Capra%20projesi%20hakk%C4%B1nda%20rezervasyon%20ve%20detay%20g%C3%B6r%C3%BC%C5%9Fmesi%20talep%20ediyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider uppercase transition-all rounded-xs text-center flex items-center justify-center gap-2 shadow-xs"
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
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Performance Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl text-slate-950 font-black uppercase tracking-tight">
              RC Crawler & Modifikasyon Parçaları
            </h2>
          </div>

          {/* Kategori Filtreleri */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none font-mono">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-xs transition-all whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-slate-400"
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
                    ? "bg-slate-950 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-slate-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Arama & Ölçek Filtreleme Barı */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xs border border-slate-200 shadow-xs">
          
          {/* Arama Kutusu */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Parça adı, portal aks, pirinç veya TRX4..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Ölçek Seçimi */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 font-mono">
            <span className="text-[11px] text-slate-400 uppercase mr-1 whitespace-nowrap">ÖLÇEK:</span>
            <button
              onClick={() => setSelectedScale("all")}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs transition-all ${
                selectedScale === "all"
                  ? "bg-slate-950 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedScale("1/10")}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs transition-all ${
                selectedScale === "1/10"
                  ? "bg-orange-600 text-white font-black"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              1/10 Pro
            </button>
            <button
              onClick={() => setSelectedScale("1/24")}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs transition-all ${
                selectedScale === "1/24"
                  ? "bg-orange-600 text-white font-black"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
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
              <div key={n} className="animate-pulse space-y-4 bg-white p-5 rounded-xs border border-slate-200">
                <div className="aspect-3/4 bg-slate-100 rounded-xs" />
                <div className="h-4 bg-slate-100 w-3/4 rounded-xs" />
                <div className="h-3 bg-slate-100 w-1/2 rounded-xs" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-xs space-y-3 bg-white font-mono">
            <p className="text-base text-slate-700">Aramanıza veya filtrelerinize uygun parça bulunamadı.</p>
            <p className="text-xs text-slate-400 font-sans">Lütfen farklı bir anahtar kelime veya ölçek seçiniz.</p>
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
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="relative aspect-4/5 w-full bg-slate-100 rounded-xs overflow-hidden border border-slate-200 group shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
              alt="RC Crawler CNC & Tuning Garage"
              fill
              className="object-cover group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/95 border border-slate-200 text-[11px] font-mono text-slate-900 font-bold">
              // ATÖLYE HASSAS TEST PARKURU · 60° TIRMANIŞ MASASI
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold">
              // KAYA TIRMANIŞI MÜHENDİSLİĞİ
            </span>
            <h2 className="text-3xl sm:text-4xl text-slate-950 font-black uppercase tracking-tight leading-tight">
              Ağırlık Merkezi (CoG), Artikülasyon ve Sıfır Tork Bükülmesi
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Standart fabrika çıkışı plastik RC araçlar dik kaya tırmanışlarında kolayca geriye takla atar ve diferansiyel dişlilerini sıyırır. Cihanpol RC Atölyesi olarak, döküm pirinç portal ağırlıkları, sertleştirilmiş çelik şaftlar ve akıllı FOC fırçasız motor sistemleriyle araçların tırmanma sınırlarını yeniden çiziyoruz.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Her özel toplanan crawler şasisi, eğim platformu ve kayalık parkur testlerinden geçirildikten sonra sahibine teslim edilir.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 font-mono">
              <div>
                <span className="text-2xl sm:text-3xl text-slate-950 font-black block">65°+</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-500">
                  Tırmanış Eğimi Güvencesi
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl text-orange-600 font-black block">+420g</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-500">
                  Pirinç Alt Kütle Takviyesi
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. DOĞRUDAN USTA İSTİŞARE & TALEP MASASI (#contact) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-16">
        <div className="text-center max-w-2xl mx-auto space-y-5 bg-white border border-slate-200 p-8 sm:p-12 rounded-xs shadow-md">
          <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold">
            // DOĞRUDAN USTA İLETİŞİMİ
          </span>
          <h2 className="text-2xl sm:text-3xl text-slate-950 font-black uppercase tracking-tight">
            Özel Şasi Toplama & Parça Uyumluluğu
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Mevcut TRX-4, Axial SCX10, Element RC veya Vanquish aracınız için doğru pirinç ağırlık, şasi büküm açısı ve fırçasız motor seçimi yapmak için atölyemizle doğrudan WhatsApp üzerinden görüşebilirsiniz.
          </p>
          <div className="pt-2 flex justify-center">
            <a
              href={`https://wa.me/${phone}?text=Merhaba%20Cihan%20Usta,%20arac%C4%B1ma%20%C3%B6zel%20crawler%20par%C3%A7a%20ve%20montaj%20tavsiyesi%20almak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-all flex items-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WHATSAPP RC UZMANINA DANIŞIN</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
