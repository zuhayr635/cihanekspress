"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import CrawlerConfigurator from "@/components/CrawlerConfigurator";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  Shield,
  ArrowRight,
  MessageCircle,
  Wrench,
  Flame,
  Zap,
  Cpu,
  Search,
  Truck,
  Sparkles,
  Timer,
  ChevronRight,
  ChevronLeft,
  Award,
  CheckCircle2,
  Lock,
  KeyRound,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
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

// Trendyol Story Daireleri (Hızlı Kategori Butonları)
const STORY_CATEGORIES = [
  {
    name: "1/10 Şasi",
    tag: "1/10",
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=300&q=80",
    badge: "Fırsat",
  },
  {
    name: "Pirinç Aks",
    tag: "Pirinç",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80",
    badge: "Çok Satan",
  },
  {
    name: "FOC Motor",
    tag: "Motor",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "TRX-4 Parça",
    tag: "TRX-4",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "SCX24 Mini",
    tag: "1/24",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "3D Özel Baskı",
    href: "/3d-baski",
    image: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Paket Fırsatı",
    href: "/paketler",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80",
    badge: "%30",
  },
  {
    name: "Rig Sihirbazı",
    anchor: "#rig-builder",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80",
  },
];

// Trendyol Vitrin Kampanya Bannerları
const HERO_BANNERS = [
  {
    id: 1,
    title: "KAYA TIRMANIŞI SEZONU BAŞLADI",
    subtitle: "TRX-4 & Capra Şasilerde Yüksek Torklu Masif CNC Pirinç Ağırlık Yükseltmeleri",
    tag: "AYNI GÜN KARGO · ATÖLYE TESTLİ",
    bgGradient: "from-[#F27A1A] via-[#E06A0A] to-[#C95300]",
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1200&q=85",
    linkText: "Fırsatları Yakala",
    target: "#vitrin",
  },
  {
    id: 2,
    title: "60° DİK TIRMANIŞ GARANTİSİ",
    subtitle: "Düşük CoG Ağırlık Merkezi ve FOC Akıllı Fırçasız Motor ile Takla Atmaya Son",
    tag: "PROFESYONEL RC SETUP",
    bgGradient: "from-slate-900 via-slate-800 to-slate-950",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
    linkText: "Rig Sihirbazını Aç",
    target: "#rig-builder",
  },
];

export default function HomePage() {
  const { storeSettings, isSalesAllowed, setIsVipModalOpen, vipSession, recentlyViewed } = useCart();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "deals" | "top" | "micro">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  // 8. Çok Yönlü Katalog Filtreleri (Faceted Filter)
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFacetedFilters, setShowFacetedFilters] = useState<boolean>(false);

  // Trendyol Geri Sayım Sayacı (Flaş İndirimler)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Banner otomatik kaydırma
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Veri yükleme
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

  const whatsappUrl = getWhatsAppUrl(
    storeSettings?.whatsappPhone,
    "Merhaba Cihan Usta, sitedeki kampanya hakkında bilgi almak istiyorum."
  );

  // 8. Çok Yönlü Filtreleme ve Sıralama (Faceted Filtering)
  const filteredProducts = products
    .filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeTab === "deals") {
        if (!(p.salePrice || p.basePrice > 10000)) return false;
      }
      if (activeTab === "top") {
        if (!(p.isFeatured || p.title.toLowerCase().includes("şasi"))) return false;
      }
      if (activeTab === "micro") {
        if (!(p.title.includes("1/24") || p.title.includes("SCX24"))) return false;
      }

      const price = p.salePrice || p.basePrice;
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      if (inStockOnly) {
        if ((p as any).stockQuantity !== undefined && (p as any).stockQuantity <= 0) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const priceA = a.salePrice || a.basePrice;
      const priceB = b.salePrice || b.basePrice;
      if (sortBy === "price_asc") return priceA - priceB;
      if (sortBy === "price_desc") return priceB - priceA;
      if (sortBy === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return 0;
    });

  const hasActiveFilters = Boolean(minPrice || maxPrice || inStockOnly || sortBy !== "default");

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSortBy("default");
    setSearchQuery("");
  };

  const flashDealProducts = products.slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 bg-[#F4F5F7] text-[#1E242C]">
      
      {/* 1. KAT: TRENDYOL STORY / KATEGORİ DAİRELERİ */}
      <div className="bg-white border-b border-slate-200 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
            {STORY_CATEGORIES.map((cat, idx) => {
              const content = (
                <div className="flex flex-col items-center gap-1.5 min-w-[70px] sm:min-w-[84px] group cursor-pointer">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#F27A1A] to-amber-300 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white border border-white">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {cat.badge && (
                      <span className="absolute -top-1 -right-1 bg-[#F27A1A] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 group-hover:text-[#F27A1A] transition-colors text-center truncate max-w-[80px]">
                    {cat.name}
                  </span>
                </div>
              );

              if (cat.href) {
                return (
                  <Link key={idx} href={cat.href}>
                    {content}
                  </Link>
                );
              }
              if (cat.anchor) {
                return (
                  <a key={idx} href={cat.anchor}>
                    {content}
                  </a>
                );
              }
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (cat.tag) {
                      setSearchQuery(cat.tag);
                      const el = document.getElementById("vitrin");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KATALOG VE HUKUKİ BİLGİLENDİRME BANTI */}
      {!isSalesAllowed && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3.5 sm:p-4 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-200/60 flex items-center justify-center text-amber-800 flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block text-slate-900 text-sm">
                  RC Modelcilik & Hobi Atölyesi Çalışma Kataloğu
                </span>
                <span className="text-amber-900/80 text-[11px] font-normal leading-snug">
                  Sitemiz halka açık perakende e-ticaret satışı yapmamaktadır. Yalnızca atölye sergi kataloğudur. Fiyatları görmek ve talep oluşturabilmek için <strong>VIP Davetiye Kodu</strong> zorunludur.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsVipModalOpen(true)}
              className="px-4 py-2 bg-[#F27A1A] hover:bg-[#E06A0A] text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs self-end sm:self-center"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Davetiye Kodu Gir</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. KAT: TRENDYOL HERO KAMPANYA BANNERLARI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Ana Geniş Banner Slider */}
          <div className="lg:col-span-8 relative rounded-xl overflow-hidden shadow-sm bg-gradient-to-r min-h-[280px] sm:min-h-[360px] flex items-center">
            {HERO_BANNERS.map((banner, idx) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 flex items-center bg-gradient-to-r ${
                  banner.bgGradient
                } ${idx === bannerIndex ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"}`}
              >
                <div className="relative z-10 w-full p-6 sm:p-10 text-white max-w-lg space-y-4">
                  <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white font-bold text-[10px] tracking-wider uppercase rounded">
                    {banner.tag}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight uppercase">
                    {banner.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                    {banner.subtitle}
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    {isSalesAllowed ? (
                      <a
                        href={banner.target}
                        className="px-6 py-3 bg-white text-[#F27A1A] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-md hover:bg-slate-100 transition-all shadow-md flex items-center gap-2"
                      >
                        <span>{banner.linkText}</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        onClick={() => setIsVipModalOpen(true)}
                        className="px-6 py-3 bg-white text-[#F27A1A] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-md hover:bg-slate-100 transition-all shadow-md flex items-center gap-2"
                      >
                        <KeyRound className="w-4 h-4 text-[#F27A1A]" />
                        <span>Davetiye Kodu Gir</span>
                      </button>
                    )}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-md transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Usta Masası</span>
                    </a>
                  </div>
                </div>

                <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block overflow-hidden">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover opacity-85 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/60" />
                </div>
              </div>
            ))}

            {/* Slider Kontrolleri */}
            <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
              {HERO_BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setBannerIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === bannerIndex ? "w-6 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sağ Sabit Kampanya Kartları (Trendyol İkili Promosyon) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Kart 1: Rig Sihirbazı */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#F27A1A]/50 transition-colors">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] font-bold text-[#F27A1A] bg-orange-50 px-2 py-0.5 rounded uppercase">
                  Akıllı Asistan
                </span>
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  Kendi Crawler&apos;ını Kendin Topla
                </h3>
                <p className="text-xs text-slate-500">
                  Şasi, aks ve motorunu seç; uyumluluk analizini hemen gör.
                </p>
              </div>
              <div className="pt-4 relative z-10 flex items-center justify-between">
                <a
                  href="#rig-builder"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#F27A1A] hover:underline"
                >
                  <span>Sihirbazı Başlat</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
                <Wrench className="w-8 h-8 text-orange-200 group-hover:text-[#F27A1A] transition-colors" />
              </div>
            </div>

            {/* Kart 2: 3D Baskı ve Tescil */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                  Özel İmalat
                </span>
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  3D Parça Baskı & Şasi Tescil
                </h3>
                <p className="text-xs text-slate-500">
                  STL dosyanı gönder, karbon/PETG malzeme ile üretelim.
                </p>
              </div>
              <div className="pt-4 relative z-10 flex items-center justify-between">
                <Link
                  href="/3d-baski"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                >
                  <span>Talep Oluştur</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Cpu className="w-8 h-8 text-emerald-200 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. KAT: TRENDYOL "SÜPER FIRSATLAR" GERİ SAYIM ŞERİDİ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#F27A1A] to-[#FF9036] rounded-xl p-4 sm:p-5 text-white shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Flame className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight uppercase">
                    ⚡ {isSalesAllowed ? "SÜPER FIRSATLAR" : "ÖZEL KULÜP SERGİSİ"}
                  </h2>
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded shadow-xs ${
                    isSalesAllowed ? "bg-rose-600 text-white" : "bg-slate-900 text-amber-300"
                  }`}>
                    {isSalesAllowed ? "GÜNÜN İNDİRİMLERİ" : "DAVETİYELİ ERİŞİM"}
                  </span>
                </div>
                <p className="text-xs text-white/90">
                  {isSalesAllowed
                    ? "Sınırlı sayıda masif pirinç ve CNC şasi paketleri stoklarla sınırlıdır."
                    : "Özel şasi ve pirinç modifikasyon parçaları. Fiyatları görmek için VIP davetiye kodu zorunludur."}
                </p>
              </div>
            </div>

            {/* Geri Sayım Kutusu (Trendyol Timer) */}
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <Timer className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white/90 uppercase mr-1">Kalan Süre:</span>
              <div className="flex items-center gap-1 text-sm font-black font-mono">
                <span className="bg-white text-slate-900 px-2 py-0.5 rounded shadow-xs">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-white text-slate-900 px-2 py-0.5 rounded shadow-xs">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-white text-slate-900 px-2 py-0.5 rounded shadow-xs">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4. KAT: TRENDYOL GÜVEN VE HİZMET ROZETLERİ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 p-2">
            <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-[#F27A1A] flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Hızlı & Bedava Kargo</p>
              <p className="text-[11px] text-slate-500">Tüm parçalarda aynı gün çıkış</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">CNC Hassas İşçilik</p>
              <p className="text-[11px] text-slate-500">7075 Alüminyum & Sarı Pirinç</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Canlı Usta Desteği</p>
              <p className="text-[11px] text-slate-500">WhatsApp üzerinden anında cevap</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">60° Eğim Testi</p>
              <p className="text-[11px] text-slate-500">Teslimat öncesi parkur kalibrasyonu</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. KAT: TRENDYOL VİTRİN ÜRÜN KARTLARI & TABLAR (#vitrin) */}
      <div id="vitrin" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Tab Menüsü & Arama Barı */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            
            {/* Trendyol Tab Butonları */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => { setActiveTab("all"); setSelectedCategory("all"); }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-[#F27A1A] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Tüm Ürünler ({products.length})
              </button>
              <button
                onClick={() => setActiveTab("deals")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeTab === "deals"
                    ? "bg-[#F27A1A] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                Flaş İndirimler
              </button>
              <button
                onClick={() => setActiveTab("top")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeTab === "top"
                    ? "bg-[#F27A1A] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Çok Satan Şasiler
              </button>
              <button
                onClick={() => setActiveTab("micro")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === "micro"
                    ? "bg-[#F27A1A] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                1/24 Mini Crawler
              </button>
            </div>

            {/* Arama Inputu */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ürün, marka veya parça ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#F27A1A]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

          </div>

          {/* Alt Kategori Filtre Butonları */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
              Kategori:
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Hepsi
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-2.5 py-1 text-[11px] rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* 8. Çok Yönlü Katalog Filtreleri (Faceted Filter Bar) */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Fiyat Aralığı */}
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-[11px] font-bold text-slate-500">Fiyat (₺):</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-[#F27A1A]"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-[#F27A1A]"
                />
              </div>

              {/* Sadece Stoktakiler Butonu */}
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  inStockOnly
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${inStockOnly ? "text-white" : "text-transparent"}`} />
                <span>Hazır Stok</span>
              </button>

              {/* Sıfırla Butonu */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  title="Tüm filtreleri kaldır"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sıfırla</span>
                </button>
              )}
            </div>

            {/* Sıralama Dropdown */}
            <div className="flex items-center gap-1.5 font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#F27A1A] cursor-pointer"
              >
                <option value="default">Varsayılan Sıralama</option>
                <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="featured">Öne Çıkan Projeler</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ürün Listesi (Trendyol 4-5 Kolonlu Grid) */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="animate-pulse bg-white p-3 rounded-lg border border-slate-200 space-y-3">
                <div className="aspect-square bg-slate-100 rounded-md" />
                <div className="h-3 bg-slate-100 w-3/4 rounded" />
                <div className="h-3 bg-slate-100 w-1/2 rounded" />
                <div className="h-8 bg-slate-100 w-full rounded" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl space-y-2">
            <p className="text-base font-bold text-slate-800">Aramanıza uygun ürün bulunamadı.</p>
            <p className="text-xs text-slate-500">Farklı bir arama kelimesi deneyebilir veya kategorileri sıfırlayabilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>

      {/* 10. SON GEZİLEN PARÇALAR (RECENTLY VIEWED) */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#F27A1A]">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-mono text-sm sm:text-base font-bold text-slate-900 uppercase">
                    Son İncelediğiniz Parçalar
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    Daha önce göz gezdirdiğiniz parçalar ve şasiler
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {recentlyViewed.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug || item.id}`}
                  className="group bg-slate-50 hover:bg-orange-50/50 p-2.5 rounded-lg border border-slate-200 hover:border-[#F27A1A]/40 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-square relative rounded-md overflow-hidden bg-white mb-2 border border-slate-100">
                    <Image
                      src={item.imageUrl || "/cihanekspress-logo.png"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-slate-900 line-clamp-1 group-hover:text-[#F27A1A]">
                      {item.title}
                    </p>
                    <p className="text-xs font-mono font-bold text-[#F27A1A] mt-1">
                      {Number(item.price).toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. KAT: RIG SİHİRBAZI & KONFİGÜRATÖR (#rig-builder) */}
      <div id="rig-builder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <CrawlerConfigurator />
      </div>

      {/* 7. KAT: ATÖLYE HUKUKİ BİLGİLENDİRME & HOBİ KALKANI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs text-xs text-slate-600 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Shield className="w-4 h-4 text-[#F27A1A]" />
            <span>Hobi Atölyesi ve Danışma Kataloğu Bilgilendirmesi</span>
          </div>
          <p className="leading-relaxed text-slate-500">
            <strong>cihanekspress.com</strong>, modelcilik tutkunları için hazırlanmış bir RC Rock Crawler teknik sergileme ve atölye tasarım kataloğudur. Doğrudan sanal POS ile ticari kart çekimi yapılmamakta olup, ürün bedelleri hobi malzeme ve zanaatkar işçilik referans değerleridir. Tüm sipariş, montaj ve teknik uyumluluk istişareleri WhatsApp usta hattı üzerinden birebir görüşülerek tamamlanır.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-semibold text-slate-700">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Kişisel Modelcilik Portfolyosu
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Doğrudan Usta İstişaresi
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Test Parkuru Kalibrasyonu
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
