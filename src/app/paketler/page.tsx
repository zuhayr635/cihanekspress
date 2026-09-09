"use client";

import React, { useState } from "react";
import { Package, Sparkles, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { useModules } from "@/lib/useModules";
import { useCart } from "@/lib/cart-context";

interface Bundle {
  id: string;
  name: string;
  tag: string;
  discountRate: number;
  originalPrice: number;
  bundlePrice: number;
  description: string;
  items: { name: string; desc: string }[];
}

const BUNDLES: Bundle[] = [
  {
    id: "bundle_apex_comp",
    name: "Apex LCG Competition Master Kiti",
    tag: "YARIŞMA SINIFI",
    discountRate: 15,
    originalPrice: 18500,
    bundlePrice: 15725,
    description: "Sert kayalık tırmanış yarışmaları için tasarlanmış en üst düzey hafif şasi ve düşük devir tork paketi.",
    items: [
      { name: "LCG 3mm Karbon Fiber Şasi Kiti", desc: "Aşırı düşük ağırlık merkezi ve çoklu şok açıları" },
      { name: "Sensörlü FOC 2300Kv Fırçasız Güç Ünitesi", desc: "Milimetrik yavaş sürüş ve zero-cogging kontrolü" },
      { name: "CNC Ağır Pirinç Ön Portal Aks Seti (+380g)", desc: "Burnu kayaya kilitleyen ekstra ön basış" },
    ],
  },
  {
    id: "bundle_waterproof_trail",
    name: "Extreme Mud & Deep River Su Geçirmezlik Paketi",
    tag: "IP68 ZIRHLI",
    discountRate: 12,
    originalPrice: 9800,
    bundlePrice: 8620,
    description: "Derin su geçişleri, çamur çukurları ve ıslak kaya tırmanışlarında elektroniğinizi %100 güvende tutan donanım.",
    items: [
      { name: "45KG HV Çelik Dişli Su Geçirmez Servo", desc: "Sualtında bile 45kg/cm yön çevirme kuvveti" },
      { name: "IP68 Mühürlü Marin Gres & O-Ring Kiti", desc: "Rulman ve diferansiyel su tahliyesi kalkanı" },
      { name: "Silikon Kaplamalı Su Geçirmez Alıcı Kutusu", desc: "Basınçlı yıkamaya tam dayanıklı sızdırmaz hazne" },
    ],
  },
  {
    id: "bundle_overdrive_climb",
    name: "Scale Overdrive & Artikülasyon Mod Kiti",
    tag: "KAYA ÇEKİŞİ",
    discountRate: 11,
    originalPrice: 11200,
    bundlePrice: 9990,
    description: "Ön aksı %15 daha hızlı döndürerek tırmanışta burnu kayaya çeken ve dönüş çapını yarıya indiren paket.",
    items: [
      { name: "%15 Hardened Çelik Ön Portal Overdrive Dişli Kiti", desc: "Mükemmel kaya çekişi ve dar dönüş yarıçapı" },
      { name: "Yüksek Açılı Titanyum Link & Şaft Seti", desc: "Kaya takılmalarını engelleyen kavisli alt geometri" },
      { name: "Beadlock CNC Alüminyum Ağır Jant Seti", desc: "Yumuşak hamurlu lastiklerle maksimum sürtünme" },
    ],
  },
];

export default function BundlesPage() {
  const { isModuleActive } = useModules();
  const { addItem, setIsCartOpen } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  if (!isModuleActive("bundle_deals")) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center max-w-md bg-[#11141D] p-8 border border-[#1E2536] rounded">
          <Package className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Paket İndirim Motoru Kapalıdır</h2>
          <p className="text-xs text-stone-400 mt-2">Bu modül yönetici tarafından geçici olarak durdurulmuştur.</p>
        </div>
      </div>
    );
  }

  const handleAddBundle = (bundle: Bundle) => {
    addItem(
      {
        id: bundle.id,
        productId: bundle.id,
        title: bundle.name,
        price: bundle.bundlePrice,
        image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80",
        maxStock: 5,
      },
      1
    );

    setAddedId(bundle.id);
    setTimeout(() => {
      setAddedId(null);
      setIsCartOpen(true);
    }, 600);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atölye Kombinasyon Motoru</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight uppercase">
            Özel RC Crawler Paket (Bundle) Fırsatları
          </h1>
          <p className="text-sm text-stone-400 mt-3 leading-relaxed">
            Mühendislerimiz tarafından birbirleriyle %100 mekanik ve elektriksel uyum sağlayacak şekilde eşleştirilmiş özel kitler. Parçaları tek tek almak yerine paket olarak seçin, anında %15&apos;e varan indirim kazanın.
          </p>
        </div>

        {/* Paket Kartları */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {BUNDLES.map((bundle) => {
            const savings = bundle.originalPrice - bundle.bundlePrice;
            const isAdded = addedId === bundle.id;

            return (
              <div
                key={bundle.id}
                className="bg-[#10141E] border border-[#1E2536] hover:border-amber-500/50 rounded-lg p-6 flex flex-col justify-between transition-all duration-300 relative group shadow-xl"
              >
                {/* Rozet */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {bundle.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                    %{bundle.discountRate} TASARRUF
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-mono leading-snug">
                    {bundle.name}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    {bundle.description}
                  </p>

                  {/* Paket İçeriği */}
                  <div className="mt-5 space-y-2.5 font-mono text-xs border-t border-b border-[#1A2233] py-4">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
                      Pakete Dahil Parçalar:
                    </span>
                    {bundle.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-stone-200 font-semibold">{item.name}</span>
                          <span className="block text-[10px] text-stone-400">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fiyat ve Sepet Butonu */}
                <div className="mt-6 pt-4">
                  <div className="flex items-baseline justify-between mb-3 font-mono">
                    <span className="text-xs text-stone-400 line-through">
                      {bundle.originalPrice.toLocaleString("tr-TR")} ₺
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-amber-400">
                        {bundle.bundlePrice.toLocaleString("tr-TR")} ₺
                      </span>
                      <span className="block text-[10px] text-emerald-400 font-semibold">
                        ({savings.toLocaleString("tr-TR")} ₺ Cebinizde Kalır)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddBundle(bundle)}
                    className={`w-full py-3 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isAdded
                        ? "bg-emerald-500 text-black"
                        : "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Sepete Eklendi!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Paketi İndirimle Sepete Ekle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
}
