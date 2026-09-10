"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";
import {
  ShoppingBag,
  Lock,
  Star,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Wrench,
  Cpu,
  KeyRound,
  Play,
  Video,
  Zap,
  Heart,
} from "lucide-react";

interface VariantItem {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  stock: number;
  image?: string | null;
  attributes: string; // JSON
}

interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductData {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  images: string;
  videoUrl?: string | null;
  type: string;
  basePrice: number;
  salePrice: number | null;
  priceUsd?: number | null;
  salePriceUsd?: number | null;
  sku: string | null;
  stockQuantity: number;
  isFeatured: boolean;
  category: { id: string; name: string } | null;
  variants: VariantItem[];
  reviews: ReviewItem[];
}

function getEmbedVideoUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`;
  }
  return url;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const {
    addItem,
    vipSession,
    storeSettings,
    setIsVipModalOpen,
    addRecentlyViewed,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [related, setRelated] = useState<ProductData[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<VariantItem | null>(null);
  const [activeMediaType, setActiveMediaType] = useState<"image" | "video">("image");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Yorum Formu
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          let images: string[] = [];
          try {
            images = JSON.parse(data.product.images);
          } catch {
            images = [];
          }
          if (images.length > 0) setSelectedImage(images[0]);
          if (data.product.variants && data.product.variants.length > 0) {
            const firstVariant = data.product.variants[0];
            setSelectedVariant(firstVariant);
            if (firstVariant.image) {
              setSelectedImage(firstVariant.image);
            }
          }

          // 10. Son Gezilenler Listesine Ekle
          addRecentlyViewed({
            id: data.product.id,
            title: data.product.title,
            slug: data.product.slug,
            price: data.product.salePrice || data.product.basePrice,
            imageUrl: images[0] || "/cihanekspress-logo.png",
            category: data.product.category?.name || "RC Parça",
            stock: data.product.stockQuantity,
          });
        }
        if (data.relatedProducts) {
          setRelated(data.relatedProducts);
        }
      } catch (err) {
        console.error("Fetch product detail error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center min-h-[50vh] text-orange-600">
        <div className="animate-spin w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4 text-slate-700">
        <h2 className="font-mono text-2xl font-bold text-slate-950">Parça / Araç Bulunamadı</h2>
        <Link href="/" className="inline-block text-xs font-mono uppercase tracking-wider text-orange-600 hover:text-orange-700 underline font-bold">
          Garaj Kataloğuna Geri Dön
        </Link>
      </div>
    );
  }

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = [];
  }
  if (images.length === 0) {
    images = ["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1000&q=80"];
  }

  const isSalesAllowed =
    storeSettings?.storeMode === "PUBLIC_SALE" ||
    (storeSettings?.storeMode === "INVITE_ONLY" && vipSession.isVip) ||
    vipSession.isVip;

  const currentPrice = selectedVariant ? selectedVariant.price : product.salePrice || product.basePrice;
  const vipDiscount = vipSession.discountPercent || 0;
  const finalPrice = vipDiscount > 0 ? currentPrice * (1 - vipDiscount / 100) : currentPrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stockQuantity;

  const handleAddToCart = () => {
    if (!isSalesAllowed) return;

    addItem(
      {
        id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
        productId: product.id,
        variantId: selectedVariant ? selectedVariant.id : undefined,
        title: product.title,
        variantName: selectedVariant ? selectedVariant.name : undefined,
        price: finalPrice,
        image: selectedImage || images[0],
        maxStock: currentStock,
      },
      quantity
    );
  };

  const handleExpressBuy = () => {
    if (!isSalesAllowed) {
      setIsVipModalOpen(true);
      return;
    }
    handleAddToCart();
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess(data.message);
        setAuthorName("");
        setComment("");
      }
    } catch {
      // ignore
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getDirectWhatsAppUrl = () => {
    const variantTxt = selectedVariant ? ` (Seçenek: ${selectedVariant.name})` : "";
    const msg = `Merhaba, ${product.title}${variantTxt} parçası/aracı hakkında teknik bilgi almak ve sipariş vermek istiyorum.`;
    return getWhatsAppUrl(storeSettings?.whatsappPhone, msg);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-slate-900">
      {/* Geri Dön Linki */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kataloğa Dön</span>
        </Link>
      </div>

      {/* Üst Ürün Grid (Galeri ve Detay) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Sol Kolon: Görsel Galerisi & Video Oynatıcı (7 Kolon) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-3/4 w-full bg-slate-900 rounded-xs overflow-hidden border border-slate-200">
            {activeMediaType === "video" && product.videoUrl ? (
              getEmbedVideoUrl(product.videoUrl)?.includes("youtube") || getEmbedVideoUrl(product.videoUrl)?.includes("vimeo") ? (
                <iframe
                  src={getEmbedVideoUrl(product.videoUrl)!}
                  title={`${product.title} Test & Tanıtım Videosu`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={product.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <Image
                src={selectedImage || images[0]}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center"
              />
            )}
            {product.isFeatured && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-slate-950 text-white text-[10px] font-mono tracking-widest uppercase font-bold rounded-xs flex items-center gap-1.5 shadow-sm z-10">
                <Sparkles className="w-3 h-3 text-orange-400" />
                Özel Crawler Projesi
              </span>
            )}
          </div>

          {/* Küçük Resimler (Thumbnails) & Video Butonu */}
          {(images.length > 1 || product.videoUrl) && (
            <div className="flex gap-3 overflow-x-auto pb-2 items-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedImage(img);
                    setActiveMediaType("image");
                  }}
                  className={`relative w-20 h-24 bg-slate-50 rounded-xs overflow-hidden border transition-all flex-shrink-0 cursor-pointer ${
                    activeMediaType === "image" && selectedImage === img
                      ? "border-[#F27A1A] ring-2 ring-[#F27A1A]/50"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Önizleme ${i + 1}`} fill className="object-cover" />
                </button>
              ))}

              {product.videoUrl && (
                <button
                  type="button"
                  onClick={() => setActiveMediaType("video")}
                  className={`relative w-20 h-24 bg-slate-950 text-white rounded-xs overflow-hidden border flex flex-col items-center justify-center gap-1.5 transition-all flex-shrink-0 cursor-pointer ${
                    activeMediaType === "video"
                      ? "border-[#F27A1A] ring-2 ring-[#F27A1A]"
                      : "border-slate-800 opacity-80 hover:opacity-100 hover:border-slate-600"
                  }`}
                  title="Parkur ve Test Videosunu Oynat"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F27A1A] text-white flex items-center justify-center shadow-sm">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-200">
                    Video İzle
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sağ Kolon: Bilgiler ve Satın Alma Alanı (5 Kolon) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              {product.category && (
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-orange-600 font-bold mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  {product.category.name}
                </p>
              )}
              <h1 className="font-mono text-2xl sm:text-3xl text-slate-950 font-black uppercase leading-tight">
                {product.title}
              </h1>
              {product.sku && (
                <p className="text-[11px] font-mono text-slate-500 mt-1">Parça / Model Kodu: #{product.sku}</p>
              )}
            </div>

            {/* FİYAT BÖLÜMÜ (ATÖLYE REFERANS DEĞERİ / DAVETİYE KORUMASI) */}
            {isSalesAllowed ? (
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xs space-y-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                    Atölye Referans Değeri (Malzeme & İmalat)
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-3xl sm:text-4xl text-slate-950 font-black">
                      {finalPrice.toLocaleString("tr-TR")} ₺
                    </span>
                    {storeSettings?.usdRate && storeSettings.usdRate > 0 && (
                      <span className="text-xs font-bold text-slate-600 font-mono bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md self-center">
                        (${(product.priceUsd ? Number(product.priceUsd) : (finalPrice / storeSettings.usdRate)).toFixed(2)} USD)
                      </span>
                    )}
                    {(vipDiscount > 0 || product.salePrice) && (
                      <>
                        <span className="text-base text-slate-400 line-through font-mono">
                          {currentPrice.toLocaleString("tr-TR")} ₺
                        </span>
                        {vipDiscount > 0 && (
                          <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-mono font-bold tracking-wider rounded-xs">
                            % {vipDiscount} Kulüp İndirimi
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans mt-1.5 leading-relaxed font-normal">
                    Bu çalışma hobi atölyesi özel üretimidir. Siparişler doğrudan atölye istişaresi, özel montaj ve teslimat mutabakatı ile hazırlanır.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Özel Hobi & Atölye Çalışma Kataloğu</span>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed font-sans font-normal">
                  Bu çalışma ve parçalar bir atölye sergisidir. Sitemizde halka açık ticari satış yapılmamaktadır. Parça tedariği ve referans fiyat detayları yalnızca yöneticinin onayladığı <strong>VIP Davetiye Koduna</strong> sahip kulüp üyelerine açılmaktadır.
                </p>
                <button
                  onClick={() => setIsVipModalOpen(true)}
                  className="w-full py-3 bg-[#F27A1A] hover:bg-[#E06A0A] text-white text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>VIP Davetiye Kodunu Gir & Fiyatları Gör</span>
                </button>
              </div>
            )}

            {/* VARYANT SEÇİCİ (Fotoğraflı Seçenekler) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-950 font-bold">
                    Seçenek / Varyasyon
                  </label>
                  {selectedVariant && (
                    <span className="text-xs text-[#F27A1A] font-bold font-mono">
                      Seçilen: {selectedVariant.name}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(variant);
                          if (variant.image) {
                            setSelectedImage(variant.image);
                            setActiveMediaType("image");
                          }
                        }}
                        className={`p-2.5 text-xs font-mono font-bold tracking-wide rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer ${
                          isSelected
                            ? "border-slate-950 bg-slate-950 text-white shadow-xs ring-1 ring-slate-950"
                            : "border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {variant.image && (
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-300/60">
                            <Image src={variant.image} alt={variant.name} fill className="object-cover" />
                          </div>
                        )}
                        <div className="text-left">
                          <div>{variant.name}</div>
                          {isSalesAllowed && variant.price !== product.basePrice && (
                            <div className={`text-[10px] ${isSelected ? "text-orange-300" : "text-[#F27A1A]"}`}>
                              {variant.price.toLocaleString("tr-TR")} ₺
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MİKTAR VE TALEP LİSTESİNE EKLEME */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-950 font-bold">
                  Adet Belirleyin
                </span>
                <span className="text-xs font-mono">
                  {currentStock > 0 ? (
                    <span className="text-emerald-700 font-bold">● Atölyede Hazırlanabilir</span>
                  ) : (
                    <span className="text-orange-700 font-bold">● Özel Talep Üzerine Üretim</span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xs bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-slate-500 hover:text-slate-950 transition-colors"
                    aria-label="Azalt"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-slate-950">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock || 99, quantity + 1))}
                    className="p-3 text-slate-500 hover:text-slate-950 transition-colors"
                    aria-label="Artır"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isSalesAllowed ? (
                  <div className="flex-1 flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white text-xs uppercase tracking-wider font-bold rounded-md transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Wrench className="w-4 h-4 text-white" />
                      <span>Sepete Ekle</span>
                    </button>
                    {/* 5. Tek Tıkla Hemen Satın Al (Express Checkout) */}
                    <button
                      onClick={handleExpressBuy}
                      className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs uppercase tracking-wider font-bold rounded-md transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      title="Sepeti atlayarak doğrudan sipariş formuna git"
                    >
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>Hemen Al</span>
                    </button>
                    {/* 11. Favorilere Ekle / Çıkar */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleWishlist({
                          id: product.id,
                          title: product.title,
                          slug: product.slug,
                          price: finalPrice,
                          imageUrl: selectedImage || images[0],
                          category: product.category?.name || "RC Parça",
                          stock: product.stockQuantity,
                        })
                      }
                      className={`p-3.5 rounded-md border transition-all cursor-pointer ${
                        isInWishlist(product.id)
                          ? "bg-red-50 border-red-200 text-red-600"
                          : "bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200"
                      }`}
                      title={isInWishlist(product.id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                      aria-label="Favori"
                    >
                      <Heart
                        className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-red-600" : ""}`}
                      />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsVipModalOpen(true)}
                    className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs uppercase tracking-wider font-bold rounded-md transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Fiyat & Sipariş İçin Davetiye Kodu Girin</span>
                  </button>
                )}
              </div>
            </div>

            {/* BÜYÜK WHATSAPP DOĞRUDAN SİPARİŞ BUTONU */}
            <div className="pt-2">
              <a
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase tracking-widest font-black rounded-xs transition-all shadow-md shadow-emerald-600/20 group"
              >
                <MessageCircle className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                <span>{isSalesAllowed ? "WhatsApp İle Hemen Sipariş Ver & Danış" : "WhatsApp İle Atölye Bilgisi Al (Katalog)"}</span>
              </a>
            </div>

            {/* 2. Sıkça Birlikte Alınanlar & Set İndirimi Paketi */}
            {isSalesAllowed && related && related.length > 0 && (() => {
              const partner = related[0];
              const partnerPrice = partner.salePrice || partner.basePrice;
              const bundleRaw = finalPrice + partnerPrice;
              const bundleSavings = Math.round(bundleRaw * 0.05);
              const bundleFinal = bundleRaw - bundleSavings;

              const handleAddBundle = () => {
                handleAddToCart();
                let partnerImg = "/cihanekspress-logo.png";
                try {
                  const parsed = JSON.parse(partner.images);
                  if (Array.isArray(parsed) && parsed.length > 0) partnerImg = parsed[0];
                } catch {}

                addItem({
                  id: partner.id,
                  title: partner.title,
                  price: partnerPrice,
                  imageUrl: partnerImg,
                  category: partner.category?.name || "RC Parça",
                  stock: partner.stockQuantity,
                  maxStock: partner.stockQuantity,
                });
              };

              let partnerImg = "/cihanekspress-logo.png";
              try {
                const parsed = JSON.parse(partner.images);
                if (Array.isArray(parsed) && parsed.length > 0) partnerImg = parsed[0];
              } catch {}

              return (
                <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-lg space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#F27A1A]" />
                      <span>Sıkça Birlikte Alınanlar</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-xs">
                      %5 Set İndirimi
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative bg-white border border-slate-200 rounded-xs overflow-hidden shrink-0">
                      <Image src={selectedImage || images[0]} alt={product.title} fill className="object-cover" />
                    </div>
                    <span className="text-slate-400 font-black text-sm">+</span>
                    <div className="w-12 h-12 relative bg-white border border-slate-200 rounded-xs overflow-hidden shrink-0">
                      <Image
                        src={partnerImg}
                        alt={partner.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-900 truncate">
                        {partner.title}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-black text-[#F27A1A]">
                          {bundleFinal.toLocaleString("tr-TR")} ₺
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          {bundleRaw.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddBundle}
                    className="w-full py-2.5 bg-slate-900 hover:bg-[#F27A1A] text-white text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>İki Parçayı Birlikte İndirimle Al</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })()}

            {/* Atölye Güvence & Hobi Beyanı */}
            <div className="border-t border-slate-200 pt-5 space-y-2.5 text-xs text-slate-600 font-mono">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>TRX-4, SCX10 ve SCX24 şasileri için doğrudan montaj ve uyumluluk desteği</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>%100 Sertifikalı CNC pirinç ve T6 havacılık alüminyumu</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>Darbe emici koruyucu ambalaj ile kargo veya atölyeden teslim</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RC CRAWLER MÜHENDİSLİK VE PARÇA UYUMLULUK TELEMETRİ TABLOSU */}
      <div className="border-t border-slate-200 pt-16 space-y-8">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-orange-600 font-bold flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4" /> RC Crawler Lab Engineering Data
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl text-slate-950 font-black uppercase">
            Mühendislik & Atölye Uyumluluk Tablosu
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl font-normal">
            Parçanın tırmanış açısı, ağırlık merkezi etkisi ve şasi montaj standartları atölye testlerimizle doğrulanmıştır.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Şasi Uyumluluğu</span>
            <p className="text-xs font-mono font-bold text-slate-950">TRX-4 / SCX10 / Capra / Evrensel</p>
            <p className="text-[10px] text-slate-500 leading-snug">Standart 12mm hex veya doğrudan şasi montajı</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Ağırlık Merkezi (CoG) Etkisi</span>
            <p className="text-xs font-mono font-bold text-orange-600">+Ön Aks Basışı (%60-%65 CoG)</p>
            <p className="text-[10px] text-slate-500 leading-snug">Dik tırmanışlarda takla atma riskini minimize eder</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Malzeme Standardı</span>
            <p className="text-xs font-mono font-bold text-slate-950">CNC 6061-T6 & Saf Ağır Pirinç</p>
            <p className="text-[10px] text-slate-500 leading-snug">Talaşlı imalat, korozyona dayanıklı siyah/altın kaplama</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Kaya Testi & Dayanıklılık</span>
            <p className="text-xs font-mono font-bold text-emerald-700">65° Eğim & IP68 Su İzolasyonu</p>
            <p className="text-[10px] text-slate-500 leading-snug">Çamur, nehir geçişi ve dikey kaya tırmanışına uygun</p>
          </div>
        </div>

        {/* Detaylı Açıklama */}
        <div className="p-6 bg-slate-50 rounded-xs border border-slate-200 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-950 font-bold">
            Montaj Kılavuzu ve Detaylı Teknik Bilgiler
          </h3>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
            {product.description}
          </div>
        </div>
      </div>

      {/* MÜŞTERİ DEĞERLENDİRMELERİ (Reviews) */}
      <div className="border-t border-slate-200 pt-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-orange-600 font-bold">
              Kullanıcı Deneyimleri
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl text-slate-950 font-black uppercase">
              Kulüp İncelemeleri ({product.reviews.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Yorumlar Listesi */}
          <div className="space-y-4">
            {product.reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Bu parça için henüz onaylanmış bir kullanıcı incelemesi bulunmuyor. İlk yorumu siz yazabilirsiniz.
              </p>
            ) : (
              product.reviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-950">{rev.authorName}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                        <Check className="w-2.5 h-2.5 text-emerald-600" /> Doğrulanmış Alıcı
                      </span>
                    </div>
                    <div className="flex items-center text-orange-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-orange-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Yorum Yazma Formu */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xs space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-950">
              Performans İncelemesi Paylaşın
            </h3>
            <p className="text-[11px] text-slate-500 font-normal">
              Yorumunuz yönetici kontrolünden geçtikten sonra vitrinde yer alacaktır.
            </p>

            {reviewSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs">
                {reviewSuccess}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1">
                  Adınız ve Soyadınız
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 text-slate-900 rounded-xs focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1">
                  Puanınız
                </label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs border transition-all ${
                        rating === num ? "bg-slate-950 text-white border-slate-950" : "border-slate-300 text-slate-600 bg-white hover:border-slate-400"
                      }`}
                    >
                      {num} Yıldız
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1">
                  İncelemeniz & Saha Deneyimi
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 text-slate-900 rounded-xs focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-2.5 bg-slate-950 text-white text-xs font-mono uppercase tracking-wider font-bold rounded-xs hover:bg-slate-900 transition-colors disabled:opacity-50 shadow-xs"
              >
                {isSubmittingReview ? "İletiliyor..." : "İncelemeyi Gönder"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BENZER / TAMAMLAYICI PARÇALAR */}
      {related.length > 0 && (
        <div className="border-t border-slate-200 pt-16 space-y-8">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-orange-600 font-bold">
            Birlikte Tercih Edilen Parçalar
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl text-slate-950 font-black uppercase">
            Tamamlayıcı Yükseltmeler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
