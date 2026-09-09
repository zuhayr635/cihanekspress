"use client";

import { useEffect, useState } from "react";

interface ModulesState {
  active: Record<string, boolean>;
  configs: Record<string, any>;
  isLoading: boolean;
}

let cachedState: ModulesState = {
  active: {
    cog_simulator: true,
    gear_calculator: true,
    exploded_cad: true,
    battery_wizard: true,
    b2b_quotes: true,
    trade_in: true,
    bundle_deals: true,
    serial_plaque: true,
    build_log: true,
    whatsapp_bot: true,
    maintenance_packs: true,
    print3d_demand: true,
    trail_map: true,
    rig_of_month: true,
    ai_crawler_doctor: true,
  },
  configs: {},
  isLoading: true,
};

const listeners = new Set<() => void>();

export function useModules() {
  const [state, setState] = useState<ModulesState>(cachedState);

  useEffect(() => {
    const listener = () => setState({ ...cachedState });
    listeners.add(listener);

    if (cachedState.isLoading) {
      fetch("/api/modules")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.active) {
            cachedState = {
              active: data.active,
              configs: data.configs || {},
              isLoading: false,
            };
            listeners.forEach((l) => l());
          }
        })
        .catch(() => {
          cachedState.isLoading = false;
          listeners.forEach((l) => l());
        });
    }

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const isModuleActive = (key: string): boolean => {
    return state.active[key] !== false;
  };

  const getModuleConfig = (key: string): any => {
    return state.configs[key] || {};
  };

  return {
    active: state.active,
    configs: state.configs,
    isLoading: state.isLoading,
    isModuleActive,
    getModuleConfig,
  };
}
