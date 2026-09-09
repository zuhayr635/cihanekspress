"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { ShieldCheck, ChevronDown, Wrench, X } from "lucide-react";

export const VEHICLE_OPTIONS = [
  { id: "TRX-4", name: "Traxxas TRX-4 (324mm / 313mm)", scale: "1/10" },
  { id: "SCX10", name: "Axial SCX10 II & III", scale: "1/10" },
  { id: "SCX24", name: "Axial SCX24 Mini Crawler", scale: "1/24" },
  { id: "Capra", name: "Axial Capra 1.9 4WS Buggy", scale: "1/10" },
  { id: "VS4-10", name: "Vanquish VS4-10 Phoenix", scale: "1/10" },
  { id: "Gen8", name: "Redcat Gen8 Scout II", scale: "1/10" },
];

export default function VehicleSelector() {
  const { selectedVehicle, setSelectedVehicle } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const currentVehicleObj = VEHICLE_OPTIONS.find((v) => v.id === selectedVehicle);

  return (
    <div className="relative inline-block text-left">
      {selectedVehicle ? (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#171D29] border border-amber-500/50 rounded-xs text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-stone-400">Garaj Aracım:</span>
          <span className="text-amber-400 font-bold">{currentVehicleObj?.name || selectedVehicle}</span>
          <button
            onClick={() => setSelectedVehicle(null)}
            className="ml-1 p-0.5 text-stone-500 hover:text-white rounded-xs transition-colors"
            title="Aracı Kaldır"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#121620] hover:bg-[#181F2C] border border-stone-700 hover:border-amber-400/80 rounded-xs text-xs font-mono text-stone-300 transition-all"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Aracımı Seç (Uyumluluk Filtresi)</span>
            <ChevronDown className="w-3 h-3 text-stone-500" />
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-1.5 w-72 bg-[#121620] border border-[#232B3B] rounded-xs shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 text-[10px] font-mono text-stone-500 uppercase tracking-widest border-b border-stone-800">
                Garajınızdaki RC Crawler Modeli:
              </div>
              {VEHICLE_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVehicle(v.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs font-mono text-stone-300 hover:text-white hover:bg-amber-500/15 rounded-xs flex items-center justify-between group transition-colors"
                >
                  <span className="font-semibold group-hover:text-amber-400">{v.name}</span>
                  <span className="text-[10px] text-stone-500 border border-stone-800 px-1.5 py-0.5 rounded-xs">
                    {v.scale}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
