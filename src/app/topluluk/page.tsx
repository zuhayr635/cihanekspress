"use client";

import React, { useState, useEffect } from "react";
import { Trophy, ThumbsUp, Plus, CheckCircle2, ShieldAlert, X, Sparkles } from "lucide-react";
import { useModules } from "@/lib/useModules";

interface Rig {
  id: string;
  authorName: string;
  city: string;
  vehicleModel: string;
  specsJson: string;
  photoUrl: string;
  votesCount: number;
  isWinner: boolean;
}

export default function CommunityPage() {
  const { isModuleActive } = useModules();
  const [rigs, setRigs] = useState<Rig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRig, setNewRig] = useState({
    authorName: "",
    city: "",
    vehicleModel: "",
    photoUrl: "",
    aks: "Pirinç Portal",
    motor: "FOC Fırçasız",
    agirlik: "3200g",
    CoG: "%60 Ön",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function loadRigs() {
      try {
        const res = await fetch("/api/modules/community");
        const data = await res.json();
        if (data.success && data.rigs) {
          setRigs(data.rigs);
        }
      } catch (err) {
        console.error("Topluluk araçları yüklenemedi:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRigs();
  }, []);

  if (!isModuleActive("rig_of_month")) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center max-w-md bg-[#11141D] p-8 border border-[#1E2536] rounded">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Ayın Kaya Canavarı Galerisi Kapalıdır</h2>
          <p className="text-xs text-stone-400 mt-2">Bu modül yönetici tarafından geçici olarak durdurulmuştur.</p>
        </div>
      </div>
    );
  }

  const handleVote = async (rigId: string) => {
    if (votedMap[rigId]) return;

    try {
      const res = await fetch("/api/modules/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rigId }),
      });
      const data = await res.json();
      if (data.success) {
        setVotedMap((prev) => ({ ...prev, [rigId]: true }));
        setRigs((prev) =>
          prev.map((r) => (r.id === rigId ? { ...r, votesCount: r.votesCount + 1 } : r))
        );
      }
    } catch {
      alert("Oy verilemedi.");
    }
  };

  const handleAddRig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/modules/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: newRig.authorName,
          city: newRig.city,
          vehicleModel: newRig.vehicleModel,
          photoUrl: newRig.photoUrl,
          specsJson: JSON.stringify({
            aks: newRig.aks,
            motor: newRig.motor,
            agirlik: newRig.agirlik,
            CoG: newRig.CoG,
          }),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowAddModal(false);
          setSubmitSuccess(false);
        }, 1800);
      }
    } catch {
      alert("Gönderilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#1E2536]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>Kaya Şampiyonları Podyumu</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight uppercase">
              Ayın Kaya Canavarı Galerisi & Oylaması
            </h1>
            <p className="text-sm text-stone-400 mt-2 max-w-2xl leading-relaxed">
              Topluluğumuzun inşa ettiği en vahşi custom RC crawler projeleri. Beğendiğiniz canavara oy verin; ayın birincisine atölyemizden 1.500 ₺ hediye çeki!
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 transition-colors self-start md:self-auto shadow-[0_0_20px_rgba(245,158,11,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>Aracını Yarışmaya Gönder</span>
          </button>
        </div>

        {/* Galeri Kartları */}
        {isLoading ? (
          <div className="py-16 text-center font-mono text-xs text-amber-400">
            Canavarlar podyuma çıkıyor...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {rigs.map((rig) => {
              let specs: Record<string, string> = {};
              try {
                specs = JSON.parse(rig.specsJson);
              } catch {
                specs = {};
              }
              const hasVoted = votedMap[rig.id];

              return (
                <div
                  key={rig.id}
                  className="bg-[#10141E] border border-[#1E2536] rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 shadow-xl group"
                >
                  {/* Fotoğraf ve Rozetler */}
                  <div className="h-64 w-full overflow-hidden relative">
                    <img
                      src={rig.photoUrl}
                      alt={rig.vehicleModel}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10141E] via-transparent to-black/40" />

                    {rig.isWinner && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-black font-mono font-black text-xs px-3 py-1 rounded uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_#F59E0B]">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Ayın Şampiyonu</span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs font-mono font-bold text-white bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded border border-stone-700">
                        {rig.authorName} ({rig.city})
                      </span>
                    </div>
                  </div>

                  {/* Detaylar ve Donanım Reçetesi */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white font-mono leading-snug">
                        {rig.vehicleModel}
                      </h3>

                      <div className="grid grid-cols-2 gap-2 mt-4 font-mono text-xs">
                        {Object.entries(specs).map(([k, v]) => (
                          <div key={k} className="p-2 rounded bg-[#0B0E14] border border-[#1E2536]">
                            <span className="text-[10px] text-stone-400 uppercase block">{k}</span>
                            <span className="text-stone-200 font-bold">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Oylama Barı */}
                    <div className="mt-6 pt-4 border-t border-[#1A2233] flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-amber-400">{rig.votesCount}</span>
                        <span className="text-[11px] text-stone-400">Topluluk Oyu</span>
                      </div>

                      <button
                        onClick={() => handleVote(rig.id)}
                        disabled={hasVoted}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded uppercase font-bold text-xs transition-all ${
                          hasVoted
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default"
                            : "bg-amber-500 hover:bg-amber-400 text-black cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{hasVoted ? "Oyunuz Verildi" : "Kaya Canavarına Oy Ver"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Araç Gönderme Modalı */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#10141E] border border-[#222B3D] rounded-lg max-w-lg w-full p-6 relative font-mono text-xs">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white uppercase mb-1">Aracını Yarışmaya Gönder</h3>
              <p className="text-stone-400 text-[11px] mb-5">
                Kendi topladığınız crawler&apos;ı sergileyin ve ayın ödülü için yarışın.
              </p>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-white">Başvurunuz Alındı!</p>
                  <p className="text-[11px] text-stone-400">Aracınız moderatör onayının ardından vitrine eklenecektir.</p>
                </div>
              ) : (
                <form onSubmit={handleAddRig} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 mb-1">Kullanıcı / Takım Adı *</label>
                      <input
                        type="text"
                        required
                        value={newRig.authorName}
                        onChange={(e) => setNewRig({ ...newRig, authorName: e.target.value })}
                        placeholder="Örn: KayaPilotu34"
                        className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Şehir *</label>
                      <input
                        type="text"
                        required
                        value={newRig.city}
                        onChange={(e) => setNewRig({ ...newRig, city: e.target.value })}
                        placeholder="İstanbul"
                        className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">Araç / Şasi Modeli *</label>
                    <input
                      type="text"
                      required
                      value={newRig.vehicleModel}
                      onChange={(e) => setNewRig({ ...newRig, vehicleModel: e.target.value })}
                      placeholder="Örn: TRX-4 Custom Carbon Edition 2300Kv"
                      className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">Araç Fotoğraf URL (Doğrudan görsel linki) *</label>
                    <input
                      type="url"
                      required
                      value={newRig.photoUrl}
                      onChange={(e) => setNewRig({ ...newRig, photoUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... veya resim linki"
                      className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 mb-1">Aks Donanımı</label>
                      <input
                        type="text"
                        value={newRig.aks}
                        onChange={(e) => setNewRig({ ...newRig, aks: e.target.value })}
                        className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Motor / ESC</label>
                      <input
                        type="text"
                        value={newRig.motor}
                        onChange={(e) => setNewRig({ ...newRig, motor: e.target.value })}
                        className="w-full bg-[#0A0D14] border border-[#222B3D] text-white rounded px-3 py-2 outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Aracı Podyuma Yükle"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
