"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "Giriş başarısız.");
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#F5F5F3]">
      <div className="w-full max-w-md bg-white border border-stone-300 p-8 sm:p-10 rounded-sm shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-900 border border-stone-300">
            <Lock className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-950 font-medium tracking-tight uppercase">
            Yönetici Girişi
          </h1>
          <p className="text-xs text-stone-500">
            ATELIER CIHANPOL Mağaza Kontrol Merkezi
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-semibold mb-1.5">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              required
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-sm focus:outline-none focus:border-black font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-semibold mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Giriş Yapılıyor...</span>
              ) : (
                <>
                  <span>Panele Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-[11px] text-stone-400">
          Varsayılan Giriş: <span className="font-mono text-stone-700">admin</span> /{" "}
          <span className="font-mono text-stone-700">admin123456</span>
        </div>
      </div>
    </div>
  );
}
