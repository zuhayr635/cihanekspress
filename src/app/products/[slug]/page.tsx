"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
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
  Plus,
  Minus,
  Wrench,
  Cpu,
} from "lucide-react";

interface VariantItem {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  stock: number;
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
  type: string;
  basePrice: number;
  salePrice: number | null;
  sku: string | null;
  stockQuantity: number;
  isFeatured: boolean;
  category: { id: string; name: string } | null;
  variants: VariantItem[];
  reviews: ReviewItem[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { addItem, vipSession, storeSettings } = useCart();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [related, setRelated] = useState<ProductData[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<VariantItem | null>(null);
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
            setSelectedVariant(data.product.variants[0]);
          }
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
    const phone = storeSettings?.whatsappPhone?.replace(/[^0-9]/g, "") || "905551234567";
    const variantTxt = selectedVariant ? ` (Seçenek: ${selectedVariant.name})` : "";
    const msg = `Merhaba, ${product.title}${variantTxt} parçası/aracı hakkında teknik bilgi almak ve sipariş vermek istiyorum.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
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
        {/* Sol Kolon: Görsel Galerisi (7 Kolon) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-3/4 w-full bg-slate-50 rounded-xs overflow-hidden border border-slate-200">
            <Image
              src={selectedImage || images[0]}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-slate-950 text-white text-[10px] font-mono tracking-widest uppercase font-bold rounded-xs flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-orange-400" />
                Özel Crawler Projesi
              </span>
            )}
          </div>

          {/* Küçük Resimler (Thumbnails) */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 bg-slate-50 rounded-xs overflow-hidden border transition-all flex-shrink-0 ${
                    selectedImage === img
                      ? "border-slate-950 ring-1 ring-slate-950"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Önizleme ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
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

            {/* FİYAT BÖLÜMÜ (ATÖLYE REFERANS DEĞERİ) */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xs space-y-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                  Atölye Referans Değeri (Malzeme & İmalat)
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-3xl sm:text-4xl text-slate-950 font-black">
                    {finalPrice.toLocaleString("tr-TR")} ₺
                  </span>
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

            {/* VARYANT SEÇİCİ (Beden / Renk / Aks Tipi) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-950 font-bold">
                  Seçenek / Varyasyon
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2.5 text-xs font-mono font-bold tracking-wide rounded-xs border transition-all ${
                          isSelected
                            ? "border-slate-950 bg-slate-950 text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-800 hover:border-slate-400"
                        }`}
                      >
                        {variant.name}
                        {variant.price !== product.basePrice && (
                          <span className="ml-1 text-[10px] opacity-80">
                            ({variant.price.toLocaleString("tr-TR")} ₺)
                          </span>
                        )}
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

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-950 text-white text-xs font-mono uppercase tracking-widest font-bold rounded-xs transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Wrench className="w-4 h-4 text-orange-400" />
                  <span>Talep Listesine Ekle</span>
                </button>
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
                <span>WhatsApp İle Hemen Sipariş Ver & Danış</span>
              </a>
            </div>

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
