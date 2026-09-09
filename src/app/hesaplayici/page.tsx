"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CoGCalculator from "@/components/modules/CoGCalculator";
import GearRatioCalculator from "@/components/modules/GearRatioCalculator";
import ExplodedCadView from "@/components/modules/ExplodedCadView";
import BatteryWizard from "@/components/modules/BatteryWizard";
import { useModules } from "@/lib/useModules";
import { Scale, Cog, Layers, BatteryCharging, Wrench, Shield } from "lucide-react";

function CalculatorContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "cog";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { isModuleActive } = useModules();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const tabs = [
    {
      id: "cog",
      key: "cog_simulator",
      name: "CoG Ağırlık Merkezi",
      icon: Scale,
      component: <CoGCalculator />,
    },
    {
      id: "gear",
      key: "gear_calculator",
      name: "FDR Dişli & Hız",
      icon: Cog,
      component: <GearRatioCalculator />,
    },
    {
      id: "cad",
      key: "exploded_cad",
      name: "3D CAD Şeması",
      icon: Layers,
      component: <ExplodedCadView />,
    },
    {
      id: "battery",
      key: "battery_wizard",
      name: "Pil & ESC Sihirbazı",
      icon: BatteryCharging,
      component: <BatteryWizard />,
    },
  ].filter((t) => isModuleActive(t.key));

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Üst Başlık Banner */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Wrench className="w-4 h-4" />
            <span>CIHANPOL ENGINEERING LAB</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white uppercase mt-2">
            RC Crawler Teknik Hesaplayıcılar & CAD Simülasyonu
          </h1>
          <p className="text-sm text-stone-400 mt-2 max-w-3xl leading-relaxed">
            Kayada devrilmeme dengesi, pinyon/spur tork çarpanı, ağırlık merkezi (CoG) optimizasyonu ve 3D patlatılmış şasi mimarisini milimetrik hassasiyetle hesaplayın.
          </p>
        </div>

        {/* Sekmeler (Tabs) */}
        {tabs.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 pb-4 mb-6 border-b border-[#1E2536]">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                        : "bg-[#121622] text-stone-300 border border-[#202738] hover:border-amber-400/50 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Seçili Sekme İçeriği */}
            <div>
              {tabs.find((t) => t.id === activeTab)?.component || tabs[0]?.component}
            </div>
          </>
        ) : (
          <div className="p-12 text-center bg-[#11141D] border border-[#1E2536] rounded-md">
            <Shield className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Hesaplayıcı Modülleri Geçici Olarak Kapalıdır</h3>
            <p className="text-xs text-stone-400 mt-1">Yönetici tarafından bakım çalışması yapılmaktadır.</p>
          </div>
        )}
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080A0F] flex items-center justify-center text-amber-400 font-mono text-sm">
        Hesaplayıcılar yükleniyor...
      </div>
    }>
      <CalculatorContent />
    </Suspense>
  );
}
