"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Compass, Plus, CheckCircle2, ShieldAlert, X } from "lucide-react";
import { useModules } from "@/lib/useModules";

interface Trail {
  id: string;
  name: string;
  city: string;
  difficulty: string;
  terrain: string;
  description: string;
  coordinates?: string;
  coverImage?: string;
}

export default function TrailsPage() {
  const { isModuleActive } = useModules();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrail, setNewTrail] = useState({
    name: "",
    city: "",
    difficulty: "ORTA",
    terrain: "KAYA",
    description: "",
    coordinates: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function loadTrails() {
      try {
        const res = await fetch("/api/modules/trails");
        const data = await res.json();
        if (data.success && data.trails) {
          setTrails(data.trails);
        }
      } catch (err) {
        console.error("Parkurlar alınamadı:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTrails();
  }, []);

  if (!isModuleActive("trail_map")) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center max-w-md bg-[#11141D] p-8 border border-[#1E2536] rounded">
          <MapPin className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Parkur Haritası Kapalıdır</h2>
          <p className="text-xs text-stone-400 mt-2">Bu modül yönetici tarafından geçici olarak durdurulmuştur.</p>
        </div>
      </div>
    );
  }

  const handleAddTrail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/modules/trails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTrail),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowAddModal(false);
          setSubmitSuccess(false);
          setNewTrail({ name: "", city: "", difficulty: "ORTA", terrain: "KAYA", description: "", coordinates: "" });
        }, 1800);
      }
    } catch {
      alert("Hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "ASIRI_KAYA":
        return { label: "Aşırı Kaya (Hardcore)", color: "text-red-400 bg-red-950/70 border-red-500" };
      case "ZOR":
        return { label: "Zorlu Tırmanış", color: "text-amber-400 bg-amber-950/70 border-amber-500" };
      case "ORTA":
        return { label: "Orta Parkur", color: "text-blue-400 bg-blue-950/70 border-blue-500" };
      default:
        return { label: "Hafif Gezinti", color: "text-emerald-400 bg-emerald-950/70 border-emerald-500" };
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#1E2536]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Topluluk Keşif Rehberi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight uppercase">
              Türkiye RC Crawler Kaya Parkurları & Rotaları
            </h1>
            <p className="text-sm text-stone-400 mt-2 max-w-2xl leading-relaxed">
              Doğal granit kayalıklar, peri bacaları tırmanış hatları ve dik çamur etapları. En iyi tırmanış noktalarını keşfedin, GPS koordinatlarıyla navigasyonu başlatın.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 transition-colors self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Parkur Öner</span>
          </button>
        </div>

        {/* Parkur Listesi */}
        {isLoading ? (
          <div className="py-16 text-center font-mono text-xs text-amber-400">
            Parkurlar taranıyor...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {trails.map((trail) => {
              const diffBadge = getDifficultyBadge(trail.difficulty);

              return (
                <div
                  key={trail.id}
                  className="bg-[#10141E] border border-[#1E2536] rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 shadow-xl group"
                >
                  {/* Fotoğraf Başlığı */}
                  {trail.coverImage && (
                    <div className="h-48 w-full overflow-hidden relative">
                      <img
                        src={trail.coverImage}
                        alt={trail.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#10141E] via-transparent to-black/40" />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${diffBadge.color}`}>
                          {diffBadge.label}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-stone-700 px-2 py-1 rounded text-[10px] font-mono text-stone-200">
                        Zemin: {trail.terrain}
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{trail.city}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white font-mono leading-snug">
                        {trail.name}
                      </h3>

                      <p className="text-xs text-stone-300 mt-3 leading-relaxed">
                        {trail.description}
                      </p>
                    </div>

                    {/* Aksiyon Barı */}
                    <div className="mt-6 pt-4 border-t border-[#1A2233] flex items-center justify-between font-mono text-xs">
                      <span className="text-[10px] text-stone-500">
                        {trail.coordinates ? `GPS: ${trail.coordinates}` : "Harita Lokasyonu"}
                      </span>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          trail.coordinates || `${trail.name} ${trail.city}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:text-amber-300 rounded transition-colors text-xs font-bold uppercase"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Rotayı Aç</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Yeni Parkur Ekleme Modalı */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#10141E] border border-[#222B3D] rounded-lg max-w-lg w-full p-6 relative font-mono text-xs">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white uppercase mb-1">Yeni Parkur / Rota Öner</h3>
              <p className="text-stone-400 text-[11px] mb-5">
                Bildiğiniz güzel bir RC kaya tırmanış rotasını diğer crawler tutkunlarıyla paylaşın.
              </p>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-white">Parkur Öneriniz Alındı!</p>
                  <p className="text-[11px] text-stone-400">Yönetici onayının ardından haritada yayınlanacaktır.</p>
                </div>
              ) : (
                <form onSubmit={handleAddTrail} className="space-y-4">
                  <div>
                    <label className="block text-stone-300 mb-1">Parkur Adı *</label>
                    <input
                      type="text"
                      required
                      value={newTrail.name}
                      onChange={(e) => setNewTrail({ ...newTrail, name: e.target.value })}
                      placeholder="Örn: Ballıkayalar Kanyon Girişi"
                      className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 mb-1">Şehir / İlçe *</label>
                      <input
                        type="text"
                        required
                        value={newTrail.city}
                        onChange={(e) => setNewTrail({ ...newTrail, city: e.target.value })}
                        placeholder="Kocaeli / Gebze"
                        className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Zorluk Derecesi</label>
                      <select
                        value={newTrail.difficulty}
                        onChange={(e) => setNewTrail({ ...newTrail, difficulty: e.target.value })}
                        className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                      >
                        <option value="KOLAY">Kolay (Scale Trail)</option>
                        <option value="ORTA">Orta (Kaya & Toprak)</option>
                        <option value="ZOR">Zor (Dik Granitler)</option>
                        <option value="ASIRI_KAYA">Aşırı Kaya (Comp Only)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">GPS Koordinatları (Opsiyonel)</label>
                    <input
                      type="text"
                      value={newTrail.coordinates}
                      onChange={(e) => setNewTrail({ ...newTrail, coordinates: e.target.value })}
                      placeholder="40.8521, 29.5122"
                      className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">Açıklama & Parkur Tavsiyeleri *</label>
                    <textarea
                      rows={3}
                      required
                      value={newTrail.description}
                      onChange={(e) => setNewTrail({ ...newTrail, description: e.target.value })}
                      placeholder="Zemin yapısı, su geçişi var mı, hangi lastik hamuru tutunur..."
                      className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    {isSubmitting ? "Kaydediliyor..." : "Parkuru Haritaya Ekle"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
