"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";

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
        setError(data.error || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch {
      setError("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F4F5F7]">
      <div className="w-full max-w-md bg-white border border-slate-200/80 p-8 sm:p-10 rounded-2xl shadow-sm space-y-6">
        {/* Logo ve Başlık */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-1 group">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              cihan<span className="text-[#F27A1A]">ekspress</span>
              <span className="text-slate-400 text-sm font-semibold">.com</span>
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-orange-50 text-[#F27A1A] border border-orange-200/60 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Yönetici Portalı
            </span>
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Mağaza envanteri, VIP davetiyeleri ve sipariş yönetim merkezi
          </p>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200/80 text-red-700 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Giriş Formu */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Yönetici Kullanıcı Adı
            </label>
            <input
              type="text"
              required
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] focus:ring-2 focus:ring-orange-100 font-medium text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Yönetici Şifresi
              </label>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] focus:ring-2 focus:ring-orange-100 font-medium text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#F27A1A] hover:bg-[#E06A0A] active:bg-[#C85B03] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Giriş Yapılıyor...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Panele Güvenli Giriş</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Bilgi Kutusu */}
        <div className="text-center pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
          <p>
            Varsayılan Giriş: <span className="font-mono text-slate-700 font-semibold">admin</span> /{" "}
            <span className="font-mono text-slate-700 font-semibold">admin123456</span>
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-[#F27A1A] font-medium transition-colors"
            >
              ← Mağaza Vitrinine Geri Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
