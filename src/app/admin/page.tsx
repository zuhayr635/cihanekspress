"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  KeyRound,
  Package,
  ShoppingBag,
  Tag,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Copy,
  AlertTriangle,
  Building2,
  CreditCard,
  MessageCircle,
  Eye,
  Check,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Scale,
  Cog,
  Layers,
  BatteryCharging,
  RefreshCw,
  Award,
  Wrench,
  Printer,
  MapPin,
  Trophy,
  Stethoscope,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "settings" | "invites" | "products" | "orders" | "coupons" | "reviews" | "modules"
  >("dashboard");

  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{ name: string; username: string } | null>(null);

  // Veriler
  const [reportData, setReportData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [invites, setInvites] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // 15 Yeni Modül Yönetimi
  const [modulesList, setModulesList] = useState<any[]>([]);
  const [b2bQuotes, setB2bQuotes] = useState<any[]>([]);
  const [tradeIns, setTradeIns] = useState<any[]>([]);
  const [printOrders, setPrintOrders] = useState<any[]>([]);
  const [activeModuleSection, setActiveModuleSection] = useState<"switches" | "b2b" | "trade" | "print">("switches");

  // Davetiye Üretim Formu
  const [inviteNote, setInviteNote] = useState("");
  const [inviteDiscount, setInviteDiscount] = useState<number>(0);
  const [inviteDays, setInviteDays] = useState<number>(7);
  const [createdInviteUrl, setCreatedInviteUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Bildirim ve Durum
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Yetki Kontrolü ve Veri Yükleme
  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.push("/admin/login");
          return;
        }
        const authData = await authRes.json();
        setAdminUser(authData.user);

        await refreshAllData();
      } catch {
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    }
    checkAuthAndLoad();
  }, [router]);

  const refreshAllData = async () => {
    try {
      const [repRes, setRes, invRes, prodRes, ordRes, coupRes, revRes, modRes, b2bRes, tradeRes, printRes] = await Promise.all([
        fetch("/api/admin/reports"),
        fetch("/api/settings"),
        fetch("/api/admin/invites"),
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/admin/coupons"),
        fetch("/api/admin/reviews"),
        fetch("/api/admin/modules"),
        fetch("/api/modules/b2b"),
        fetch("/api/modules/trade-in"),
        fetch("/api/modules/print3d"),
      ]);

      if (repRes.ok) setReportData(await repRes.json());
      if (setRes.ok) setSettings(await setRes.json());
      if (invRes.ok) {
        const data = await invRes.json();
        setInvites(data.invites || []);
      }
      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
      if (ordRes.ok) {
        const data = await ordRes.json();
        setOrders(data.orders || []);
      }
      if (coupRes.ok) {
        const data = await coupRes.json();
        setCoupons(data.coupons || []);
      }
      if (revRes.ok) {
        const data = await revRes.json();
        setReviews(data.reviews || []);
      }
      if (modRes.ok) {
        const data = await modRes.json();
        setModulesList(data.modules || []);
      }
      if (b2bRes.ok) {
        const data = await b2bRes.json();
        setB2bQuotes(data.quotes || []);
      }
      if (tradeRes.ok) {
        const data = await tradeRes.json();
        setTradeIns(data.tradeIns || []);
      }
      if (printRes.ok) {
        const data = await printRes.json();
        setPrintOrders(data.requests || []);
      }
    } catch (err) {
      console.error("Data refresh error:", err);
    }
  };

  // Modül Aç/Kapa Anahtarı Değişimi
  const handleToggleModule = async (key: string, currentEnabled: boolean) => {
    const nextState = !currentEnabled;
    // İyimser güncelleme (optimistic)
    setModulesList((prev) =>
      prev.map((m) => (m.key === key ? { ...m, isEnabled: nextState } : m))
    );

    try {
      const res = await fetch("/api/admin/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, isEnabled: nextState }),
      });
      const data = await res.json();
      if (data.success) {
        showNotify("success", `Modül ${nextState ? "AKTİF EDİLDİ" : "DEVRE DIŞI BIRAKILDI"}!`);
      } else {
        // Geri al
        setModulesList((prev) =>
          prev.map((m) => (m.key === key ? { ...m, isEnabled: currentEnabled } : m))
        );
        showNotify("error", data.error || "Modül güncellenemedi.");
      }
    } catch {
      setModulesList((prev) =>
        prev.map((m) => (m.key === key ? { ...m, isEnabled: currentEnabled } : m))
      );
      showNotify("error", "Bağlantı hatası oluştu.");
    }
  };

  // B2B Teklif Durumu
  const handleUpdateB2BStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/modules/b2b", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showNotify("success", "B2B teklif durumu güncellendi!");
        refreshAllData();
      }
    } catch {
      showNotify("error", "Güncellenemedi.");
    }
  };

  // Takas Durumu
  const handleUpdateTradeStatus = async (id: string, status: string, adminOfferPrice?: number) => {
    try {
      const res = await fetch("/api/modules/trade-in", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminOfferPrice }),
      });
      if (res.ok) {
        showNotify("success", "Takas başvurusu güncellendi!");
        refreshAllData();
      }
    } catch {
      showNotify("error", "Güncellenemedi.");
    }
  };

  const showNotify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Davetiye Linki Üretme
  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: inviteNote,
          discountPercent: inviteDiscount,
          durationDays: inviteDays,
        }),
      });
      const data = await res.json();
      if (data.success && data.invite) {
        const fullUrl = `${window.location.origin}/vip/access/${data.invite.token}`;
        setCreatedInviteUrl(fullUrl);
        setInviteNote("");
        setInviteDiscount(0);
        showNotify("success", "Yeni tek kullanımlık VIP davetiye linki üretildi!");
        refreshAllData();
      }
    } catch {
      showNotify("error", "Davetiye linki üretilemedi.");
    }
  };

  // Sipariş Durumu Güncelleme
  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (res.ok) {
        showNotify("success", "Sipariş durumu güncellendi!");
        refreshAllData();
      }
    } catch {
      showNotify("error", "Sipariş güncellenemedi.");
    }
  };

  // Ayarları Güncelleme
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showNotify("success", "Mağaza ayarları başarıyla kaydedildi!");
        refreshAllData();
      } else {
        showNotify("error", data.error || "Ayarlar kaydedilemedi.");
      }
    } catch {
      showNotify("error", "Ayarlar kaydedilirken hata oluştu.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col">
      {/* Üst Bar */}
      <header className="bg-stone-900 text-white px-6 py-3.5 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif text-lg tracking-widest uppercase font-medium">
            ATELIER CIHANPOL
          </Link>
          <span className="text-[10px] bg-amber-400 text-black font-bold uppercase px-2 py-0.5 rounded-xs">
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-stone-300">Yönetici: <strong>{adminUser?.name}</strong></span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış</span>
          </button>
        </div>
      </header>

      {/* Bildirim */}
      {notification && (
        <div
          className={`px-6 py-3 text-xs font-semibold flex items-center justify-between ${
            notification.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* Ana Gövde */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-8">
        {/* Sol Menü (Tabs) */}
        <aside className="w-full md:w-64 space-y-1.5 flex-shrink-0">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "dashboard"
                ? "bg-black text-white"
                : "bg-white text-stone-700 hover:bg-stone-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Genel Bakış</span>
          </button>

          <button
            onClick={() => setActiveTab("invites")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "invites"
                ? "bg-black text-white"
                : "bg-white text-stone-700 hover:bg-stone-200"
            }`}
          >
            <span className="flex items-center gap-3">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Davetiye Linkleri</span>
            </span>
            <span className="font-mono text-[11px] bg-stone-100 text-stone-900 px-2 py-0.5 rounded-full">
              {invites.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "orders"
                ? "bg-black text-white"
                : "bg-white text-stone-700 hover:bg-stone-200"
            }`}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Siparişler</span>
            </span>
            {orders.length > 0 && (
              <span className="font-mono text-[11px] bg-stone-100 text-stone-900 px-2 py-0.5 rounded-full">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "products"
                ? "bg-black text-white"
                : "bg-white text-stone-700 hover:bg-stone-200"
            }`}
          >
            <span className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Ürünler & Stok</span>
            </span>
            <span className="font-mono text-[11px] bg-stone-100 text-stone-900 px-2 py-0.5 rounded-full">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "settings"
                ? "bg-black text-white"
                : "bg-white text-stone-700 hover:bg-stone-200"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Mağaza Modu & Ödeme</span>
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "coupons"
                ? "bg-black text-white"
                : "bg-white text-stone-700 hover:bg-stone-200"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>İndirim Kuponları</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "reviews"
                ? "bg-black text-white"
                : "bg-white text-stone-700 hover:bg-stone-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Yorum Onay Havuzu</span>
          </button>

          <button
            onClick={() => setActiveTab("modules")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "modules"
                ? "bg-amber-500 text-black font-bold shadow-md"
                : "bg-stone-900 text-amber-400 hover:bg-black border border-amber-500/40"
            }`}
          >
            <span className="flex items-center gap-3">
              <Sliders className="w-4 h-4" />
              <span>Modüller (15 Modül)</span>
            </span>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "modules" ? "bg-black text-amber-400" : "bg-amber-500 text-black"
            }`}>
              {modulesList.length || 15}
            </span>
          </button>
        </aside>

        {/* Sağ İçerik Alanı */}
        <main className="flex-1">
          {/* TAB 1: GENEL BAKIŞ (DASHBOARD) */}
          {activeTab === "dashboard" && reportData && (
            <div className="space-y-8 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 border border-stone-200 rounded-sm">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                    Toplam Ciro
                  </span>
                  <span className="font-mono text-2xl font-bold text-stone-900 block mt-2">
                    {reportData.totalRevenue.toLocaleString("tr-TR")} ₺
                  </span>
                </div>

                <div className="bg-white p-6 border border-stone-200 rounded-sm">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                    Toplam Sipariş
                  </span>
                  <span className="font-mono text-2xl font-bold text-stone-900 block mt-2">
                    {reportData.totalOrders}
                  </span>
                </div>

                <div className="bg-white p-6 border border-stone-200 rounded-sm">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                    Bekleyen Havaleler
                  </span>
                  <span className="font-mono text-2xl font-bold text-amber-600 block mt-2">
                    {reportData.pendingBankTransfers} Adet
                  </span>
                </div>

                <div className="bg-white p-6 border border-stone-200 rounded-sm">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                    Davetiye Satış Oranı
                  </span>
                  <span className="font-mono text-2xl font-bold text-emerald-600 block mt-2">
                    {reportData.conversionRate}
                  </span>
                </div>
              </div>

              {/* Kritik Stok Uyarıları */}
              {reportData.lowStockProducts && reportData.lowStockProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Kritik Stok Uyarısı (WooCommerce Envanter Alarmı)</span>
                  </div>
                  <ul className="text-xs text-amber-800 space-y-1">
                    {reportData.lowStockProducts.map((p: any) => (
                      <li key={p.id}>
                        • <strong>{p.title}</strong>: Kalan Stok: {p.stockQuantity} Adet (Eşik: {p.lowStockThreshold})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Son Siparişler Tablosu */}
              <div className="bg-white border border-stone-200 rounded-sm p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                  Son Gelen Siparişler
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px]">
                        <th className="py-2">Sipariş No</th>
                        <th className="py-2">Müşteri</th>
                        <th className="py-2">Tutar</th>
                        <th className="py-2">Ödeme Türü</th>
                        <th className="py-2">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {reportData.recentOrders.map((o: any) => (
                        <tr key={o.id}>
                          <td className="py-3 font-mono font-bold text-stone-900">{o.orderNumber}</td>
                          <td className="py-3">{o.customerName}</td>
                          <td className="py-3 font-mono">{o.total.toLocaleString("tr-TR")} ₺</td>
                          <td className="py-3">{o.paymentMethod}</td>
                          <td className="py-3 font-medium">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAVETİYE LİNKLERİ (INVITES) */}
          {activeTab === "invites" && (
            <div className="space-y-8 animate-in fade-in">
              {/* Yeni Link Üretme Kartı */}
              <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-sm space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <KeyRound className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                    Tek Kullanımlık VIP Davetiye Linki Üret
                  </h2>
                </div>

                <form onSubmit={handleCreateInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                      Müşteri / Not
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Ahmet Bey - VIP"
                      value={inviteNote}
                      onChange={(e) => setInviteNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                      Özel VIP İndirimi (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Örn: 20 (%20 indirim)"
                      value={inviteDiscount}
                      onChange={(e) => setInviteDiscount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                      Geçerlilik Süresi (Gün)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={inviteDays}
                      onChange={(e) => setInviteDays(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tek Kullanımlık Link Oluştur</span>
                    </button>
                  </div>
                </form>

                {/* Üretilen Link Gösterimi */}
                {createdInviteUrl && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm space-y-2 animate-in fade-in">
                    <p className="text-xs font-semibold text-amber-900">
                      Oluşturulan Tek Kullanımlık VIP Bağlantısı:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={createdInviteUrl}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-amber-300 rounded-sm font-mono text-stone-800 select-all"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(createdInviteUrl);
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 2000);
                        }}
                        className="px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium rounded-sm flex items-center gap-1"
                      >
                        {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copySuccess ? "Kopyalandı" : "Kopyala"}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Bu link müşteriniz tarafından bir kez tıklandığı an güvenle yakılacak ve başka kimse tarafından kullanılamayacaktır.
                    </p>
                  </div>
                )}
              </div>

              {/* Davetiye Listesi */}
              <div className="bg-white border border-stone-200 rounded-sm p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                  Tüm Davetiye Kayıtları & Kullanım Takibi
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px]">
                        <th className="py-2.5">Token Kodu</th>
                        <th className="py-2.5">Not / Müşteri</th>
                        <th className="py-2.5">İndirim</th>
                        <th className="py-2.5">Durum</th>
                        <th className="py-2.5">Kullanım Bilgisi</th>
                        <th className="py-2.5">Oluşturulma</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {invites.map((inv) => (
                        <tr key={inv.id}>
                          <td className="py-3 font-mono font-bold text-stone-900 select-all">{inv.token}</td>
                          <td className="py-3 font-medium text-stone-700">{inv.note || "-"}</td>
                          <td className="py-3 font-mono text-amber-600 font-semibold">
                            {inv.discountPercent > 0 ? `%${inv.discountPercent}` : "-"}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                inv.status === "ACTIVE"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : inv.status === "USED"
                                  ? "bg-stone-200 text-stone-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {inv.status === "ACTIVE" ? "Aktif" : inv.status === "USED" ? "Kullanıldı (Yandı)" : "Geçersiz"}
                            </span>
                          </td>
                          <td className="py-3 text-stone-500 font-mono text-[11px]">
                            {inv.usedAt ? (
                              <span>{new Date(inv.usedAt).toLocaleString("tr-TR")} ({inv.usedByIp})</span>
                            ) : (
                              <span className="text-stone-400">Henüz kullanılmadı</span>
                            )}
                          </td>
                          <td className="py-3 text-stone-400">
                            {new Date(inv.createdAt).toLocaleDateString("tr-TR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SİPARİŞLER (ORDERS & RECEIPT APPROVAL) */}
          {activeTab === "orders" && (
            <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                  Tüm Siparişler & Havale Dekont Kontrolü
                </h2>
                <span className="text-xs text-stone-500 font-mono">{orders.length} Sipariş Kayıtlı</span>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-xs text-stone-500 py-8 text-center italic">Henüz sipariş kaydı bulunmuyor.</p>
                ) : (
                  orders.map((ord) => (
                    <div key={ord.id} className="p-5 border border-stone-200 rounded-sm space-y-4 bg-stone-50/50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                        <div>
                          <span className="font-mono text-sm font-bold text-stone-950">{ord.orderNumber}</span>
                          <span className="text-stone-400 text-xs ml-2 font-mono">
                            {new Date(ord.createdAt).toLocaleString("tr-TR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-200 font-semibold text-stone-800">
                            {ord.paymentMethod}
                          </span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              ord.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "PROCESSING"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-700">
                        <div>
                          <p className="font-semibold text-stone-900">Müşteri:</p>
                          <p>{ord.customerName}</p>
                          <p className="font-mono text-stone-500">{ord.customerPhone}</p>
                          <p className="text-stone-500">{ord.customerEmail}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900">Teslimat Adresi:</p>
                          <p>{ord.shippingAddress}</p>
                          <p>{ord.city}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="font-semibold text-stone-900">Toplam Tutar:</p>
                          <p className="font-mono text-base font-bold text-stone-950">
                            {ord.total.toLocaleString("tr-TR")} ₺
                          </p>
                        </div>
                      </div>

                      {/* Dekont Bilgisi Varsa */}
                      {ord.receiptUrl && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-amber-900">
                            <Eye className="w-4 h-4 text-amber-700" />
                            <span>Müşteri Dekont Yükledi: <strong>{ord.adminNote || "Dekont eklendi"}</strong></span>
                          </div>
                          <a
                            href={ord.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-amber-800 underline font-semibold flex items-center gap-1"
                          >
                            <span>Dekontu İncele</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {/* Durum Güncelleme Butonları */}
                      <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-stone-200">
                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mr-2">
                          Hızlı İşlemler:
                        </span>

                        {ord.status === "PENDING_PAYMENT" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, "PROCESSING", "COMPLETED")}
                            className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-xs hover:bg-emerald-700"
                          >
                            ✓ Havaleyi Onayla & Hazırlanıyor Yap
                          </button>
                        )}

                        {ord.status === "PROCESSING" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, "SHIPPED")}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-xs hover:bg-blue-700"
                          >
                            Kargoya Verildi Olarak İşaretle
                          </button>
                        )}

                        {ord.status === "SHIPPED" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, "COMPLETED")}
                            className="px-3 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xs hover:bg-black"
                          >
                            Teslim Edildi (Tamamlandı)
                          </button>
                        )}

                        <Link
                          href={`/order-success/${ord.orderNumber}`}
                          target="_blank"
                          className="px-3 py-1 border border-stone-300 text-stone-700 text-xs font-medium rounded-xs hover:bg-white"
                        >
                          Faturayı / Makbuzu Görüntüle
                        </Link>
                      </div>

                      {/* WhatsApp Otomatik Sipariş Bildirimleri (Modül 10) */}
                      <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-800 font-bold flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          WhatsApp Şablonları:
                        </span>
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Merhaba ${ord.customerName}, CIHANPOL RC Crawler Lab'den ${ord.orderNumber} numaralı siparişiniz onaylandı! Atölyemizde montaj hazırlığı başladı.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[11px] bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <span>✓ Onaylandı</span>
                        </a>
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Merhaba ${ord.customerName}, ${ord.orderNumber} numaralı siparişinizin atölye montaj ve kaya tırmanış testleri başarıyla tamamlandı, kargoya hazırlanıyor!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[11px] bg-emerald-700 text-white font-medium rounded hover:bg-emerald-800 flex items-center gap-1"
                        >
                          <span>🛠️ Montaj Bitti</span>
                        </a>
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Merhaba ${ord.customerName}, ${ord.orderNumber} numaralı siparişiniz kargoya verilmiştir. Takip no: ${ord.trackingNumber || "Hazırlanıyor"}. İyi tırmanışlar dileriz!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[11px] bg-emerald-800 text-white font-medium rounded hover:bg-emerald-900 flex items-center gap-1"
                        >
                          <span>📦 Kargolandı</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MAĞAZA MODU & ÖDEME AYARLARI (SETTINGS) */}
          {activeTab === "settings" && settings && (
            <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-8 animate-in fade-in">
              <div className="pb-3 border-b border-stone-100">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                  Mağaza Görünürlüğü & Ödeme Altyapıları Kontrolü
                </h2>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* 1. Mağaza Modu (Çekirdek Gizlilik Kontrolü) */}
                <div className="p-5 bg-stone-50 border border-stone-200 rounded-sm space-y-3">
                  <label className="block text-xs uppercase tracking-widest font-bold text-stone-900">
                    Mağaza Görünürlük & Satış Modu
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label
                      className={`p-4 border rounded-sm cursor-pointer transition-all flex flex-col justify-between ${
                        settings.storeMode === "CATALOG_ONLY"
                          ? "bg-white border-black ring-1 ring-black"
                          : "bg-stone-100 border-stone-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="storeMode"
                        value="CATALOG_ONLY"
                        checked={settings.storeMode === "CATALOG_ONLY"}
                        onChange={(e) => setSettings({ ...settings, storeMode: e.target.value })}
                        className="sr-only"
                      />
                      <span className="font-bold text-xs text-stone-900">Katalog / Vitrin Modu</span>
                      <span className="text-[11px] text-stone-500 mt-1">
                        Varsayılan mod. Fiyatlar ve sepet gizlidir. Sadece görseller ve hikaye görünür.
                      </span>
                    </label>

                    <label
                      className={`p-4 border rounded-sm cursor-pointer transition-all flex flex-col justify-between ${
                        settings.storeMode === "INVITE_ONLY"
                          ? "bg-white border-black ring-1 ring-black"
                          : "bg-stone-100 border-stone-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="storeMode"
                        value="INVITE_ONLY"
                        checked={settings.storeMode === "INVITE_ONLY"}
                        onChange={(e) => setSettings({ ...settings, storeMode: e.target.value })}
                        className="sr-only"
                      />
                      <span className="font-bold text-xs text-stone-900">Sadece VIP Davetiye</span>
                      <span className="text-[11px] text-stone-500 mt-1">
                        Yalnızca tek kullanımlık linke tıklayan VIP müşteriler fiyat görür ve sipariş verir.
                      </span>
                    </label>

                    <label
                      className={`p-4 border rounded-sm cursor-pointer transition-all flex flex-col justify-between ${
                        settings.storeMode === "PUBLIC_SALE"
                          ? "bg-white border-black ring-1 ring-black"
                          : "bg-stone-100 border-stone-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="storeMode"
                        value="PUBLIC_SALE"
                        checked={settings.storeMode === "PUBLIC_SALE"}
                        onChange={(e) => setSettings({ ...settings, storeMode: e.target.value })}
                        className="sr-only"
                      />
                      <span className="font-bold text-xs text-stone-900">Genel Açık Satış</span>
                      <span className="text-[11px] text-stone-500 mt-1">
                        Tüm ziyaretçilere standart e-ticaret gibi satış yapılır.
                      </span>
                    </label>
                  </div>
                </div>

                {/* 2. IBAN & Havale Ayarları */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>IBAN / Havale Ödeme Sistemi</span>
                    </h3>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.bankTransferEnabled}
                        onChange={(e) => setSettings({ ...settings, bankTransferEnabled: e.target.checked })}
                      />
                      <span>Havale ile Ödemeyi Açık Tut</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    {settings.bankAccounts?.map((acc: any, i: number) => (
                      <div key={i} className="grid grid-cols-3 gap-2 p-3 bg-stone-50 border border-stone-200 rounded-sm">
                        <input
                          type="text"
                          placeholder="Banka Adı"
                          value={acc.bankName}
                          onChange={(e) => {
                            const copy = [...settings.bankAccounts];
                            copy[i].bankName = e.target.value;
                            setSettings({ ...settings, bankAccounts: copy });
                          }}
                          className="px-2 py-1 text-xs border border-stone-300 rounded-xs"
                        />
                        <input
                          type="text"
                          placeholder="Alıcı Adı"
                          value={acc.accountHolder}
                          onChange={(e) => {
                            const copy = [...settings.bankAccounts];
                            copy[i].accountHolder = e.target.value;
                            setSettings({ ...settings, bankAccounts: copy });
                          }}
                          className="px-2 py-1 text-xs border border-stone-300 rounded-xs"
                        />
                        <input
                          type="text"
                          placeholder="IBAN"
                          value={acc.iban}
                          onChange={(e) => {
                            const copy = [...settings.bankAccounts];
                            copy[i].iban = e.target.value;
                            setSettings({ ...settings, bankAccounts: copy });
                          }}
                          className="px-2 py-1 text-xs border border-stone-300 rounded-xs font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. WhatsApp Sipariş Ayarları */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>WhatsApp Hızlı Sipariş Entegrasyonu</span>
                    </h3>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.whatsappOrderEnabled}
                        onChange={(e) => setSettings({ ...settings, whatsappOrderEnabled: e.target.checked })}
                      />
                      <span>WhatsApp Siparişi Aktif</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                      WhatsApp Telefon Numarası (Ülke kodlu)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappPhone}
                      onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-sm"
                    />
                  </div>
                </div>

                {/* 4. Kredi Kartı / Sanal POS Ayarları */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Kredi Kartı / Sanal POS Modülü (PayTR / iyzico)</span>
                    </h3>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.creditCardEnabled}
                        onChange={(e) => setSettings({ ...settings, creditCardEnabled: e.target.checked })}
                      />
                      <span>Kartla Ödemeyi Aktif Et</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                        Sağlayıcı
                      </label>
                      <select
                        value={settings.creditCardProvider}
                        onChange={(e) => setSettings({ ...settings, creditCardProvider: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-sm"
                      >
                        <option value="paytr">PayTR</option>
                        <option value="iyzico">iyzico</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                        Çalışma Modu
                      </label>
                      <select
                        value={settings.ccTestMode ? "test" : "live"}
                        onChange={(e) => setSettings({ ...settings, ccTestMode: e.target.value === "test" })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-sm"
                      >
                        <option value="test">Test / Sandbox Modu</option>
                        <option value="live">Canlı / Üretim Modu</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 5. Kargo ve Vergi */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                      Ücretsiz Kargo Sepet Eşiği (TL)
                    </label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                      Standart Kargo Ücreti (TL)
                    </label>
                    <input
                      type="number"
                      value={settings.defaultShippingFee}
                      onChange={(e) => setSettings({ ...settings, defaultShippingFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-sm"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-stone-800 transition-colors"
                  >
                    Tüm Ayarları Kaydet
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: ÜRÜNLER (PRODUCTS) */}
          {activeTab === "products" && (
            <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                  Ürün & Varyasyon Yönetimi ({products.length} Ürün)
                </h2>
              </div>

              <div className="divide-y divide-stone-100">
                {products.map((p) => (
                  <div key={p.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-18 bg-stone-100 rounded-sm overflow-hidden flex-shrink-0">
                        {p.images && (
                          <Image
                            src={JSON.parse(p.images)[0] || ""}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-medium text-stone-900">{p.title}</h4>
                        <p className="text-[11px] text-stone-500">{p.category?.name || "Kategorisiz"}</p>
                        <p className="font-mono text-xs font-semibold text-stone-900 mt-1">
                          {p.basePrice.toLocaleString("tr-TR")} ₺ • Stok: {p.stockQuantity}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 border border-stone-300 text-stone-700 text-xs font-medium rounded-xs hover:bg-stone-50 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Vitrinde Gör</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: KUPONLAR (COUPONS) */}
          {activeTab === "coupons" && (
            <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="pb-3 border-b border-stone-100">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                  İndirim Kuponları ({coupons.length})
                </h2>
              </div>
              <div className="space-y-3">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 bg-stone-50 border border-stone-200 rounded-sm flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm font-bold text-stone-900">{c.code}</span>
                      <span className="text-xs text-stone-500 ml-3">
                        {c.type === "PERCENTAGE" ? `%${c.amount} İndirim` : `${c.amount} ₺ Sabit İndirim`}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-stone-600">
                      Kullanım: {c.usageCount} / {c.usageLimit || "Sınırsız"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: YORUM ONAY HAVUZU (REVIEWS) */}
          {activeTab === "reviews" && (
            <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="pb-3 border-b border-stone-100">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                  Müşteri Değerlendirmeleri ({reviews.length})
                </h2>
              </div>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">Yorum bulunmuyor.</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="p-4 bg-stone-50 border border-stone-200 rounded-sm space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-900">{r.authorName} ({r.product?.title})</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          r.isApproved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {r.isApproved ? "Yayında" : "Onay Bekliyor"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: 15 MODÜL & ÖZELLİK KONTROL MERKEZİ (MODULES) */}
          {activeTab === "modules" && (
            <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-8 animate-in fade-in">
              {/* Üst Başlık & İstatistikler */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2 text-amber-600 font-mono text-xs font-bold uppercase tracking-wider">
                    <Sliders className="w-4 h-4" />
                    <span>Feature Flag & Switchboard</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-stone-900 mt-1">
                    15 Modül & Özellik Yönetim Merkezi
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Tüm teknik hesaplayıcıları, ticari masaları ve topluluk özelliklerini tek tıkla açıp kapatın.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-stone-50 border border-stone-200 px-3.5 py-2 rounded text-right">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-mono">Aktif Modüller</span>
                    <span className="text-lg font-mono font-bold text-emerald-600">
                      {modulesList.filter((m) => m.isEnabled).length} / {modulesList.length || 15}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alt Sekmeler (Sub-Tabs) */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-stone-200">
                <button
                  onClick={() => setActiveModuleSection("switches")}
                  className={`px-4 py-2 text-xs font-semibold rounded uppercase tracking-wider transition-all ${
                    activeModuleSection === "switches"
                      ? "bg-black text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  🎛️ Tüm Modül Anahtarları (15)
                </button>
                <button
                  onClick={() => setActiveModuleSection("b2b")}
                  className={`px-4 py-2 text-xs font-semibold rounded uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeModuleSection === "b2b"
                      ? "bg-black text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <span>💼 Gelen B2B Teklifleri</span>
                  {b2bQuotes.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[10px] rounded-full font-bold">
                      {b2bQuotes.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveModuleSection("trade")}
                  className={`px-4 py-2 text-xs font-semibold rounded uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeModuleSection === "trade"
                      ? "bg-black text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <span>🔄 Gelen Takas Talepleri</span>
                  {tradeIns.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[10px] rounded-full font-bold">
                      {tradeIns.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveModuleSection("print")}
                  className={`px-4 py-2 text-xs font-semibold rounded uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeModuleSection === "print"
                      ? "bg-black text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <span>🖨️ 3D Baskı Siparişleri</span>
                  {printOrders.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[10px] rounded-full font-bold">
                      {printOrders.length}
                    </span>
                  )}
                </button>
              </div>

              {/* BÖLÜM 1: TÜM 15 MODÜLÜN AÇIK/KAPALI ANAHTARLARI */}
              {activeModuleSection === "switches" && (
                <div className="space-y-6">
                  {["TEKNIK", "TICARI", "ATOLYE", "TOPLULUK"].map((cat) => {
                    const catModules = modulesList.filter((m) => m.category === cat);
                    const catTitles: Record<string, { label: string; desc: string }> = {
                      TEKNIK: {
                        label: "🛠️ Kategori 1: Teknik RC & Hesaplayıcı Araçları",
                        desc: "Ağırlık merkezi, dişli oranları, patlatılmış şema ve pil sihirbazı.",
                      },
                      TICARI: {
                        label: "💼 Kategori 2: Ticari & B2B Büyüme Masaları",
                        desc: "Toplu kulüp teklifleri, takas değerleme, paket indirimleri ve tescil.",
                      },
                      ATOLYE: {
                        label: "📦 Kategori 3: Atölye Operasyonları & Hizmetler",
                        desc: "Canlı montaj günlüğü, WhatsApp şablonları, bakım paketleri ve 3D baskı.",
                      },
                      TOPLULUK: {
                        label: "🧗 Kategori 4: Topluluk, Parkurlar & Yapay Zeka Teşhis",
                        desc: "Türkiye parkur haritası, ayın canavarı oylaması ve AI Crawler Doctor.",
                      },
                    };

                    const info = catTitles[cat] || { label: cat, desc: "" };

                    const previewLinks: Record<string, string> = {
                      cog_simulator: "/hesaplayici?tab=cog",
                      gear_calculator: "/hesaplayici?tab=gear",
                      exploded_cad: "/hesaplayici?tab=cad",
                      battery_wizard: "/hesaplayici?tab=battery",
                      b2b_quotes: "/b2b",
                      trade_in: "/takas",
                      bundle_deals: "/paketler",
                      serial_plaque: "/tescil",
                      build_log: "/order-tracking",
                      whatsapp_bot: "#",
                      maintenance_packs: "/bakim",
                      print3d_demand: "/3d-baski",
                      trail_map: "/parkurlar",
                      rig_of_month: "/topluluk",
                      ai_crawler_doctor: "/",
                    };

                    return (
                      <div key={cat} className="border border-stone-200 rounded-sm overflow-hidden bg-white shadow-xs">
                        <div className="bg-stone-50 px-5 py-3 border-b border-stone-200">
                          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-900">
                            {info.label}
                          </h3>
                          <p className="text-[11px] text-stone-500 mt-0.5">{info.desc}</p>
                        </div>

                        <div className="divide-y divide-stone-100">
                          {catModules.map((mod) => {
                            const link = previewLinks[mod.key] || "/";

                            return (
                              <div
                                key={mod.key}
                                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                                  mod.isEnabled ? "bg-white" : "bg-stone-50/70 opacity-75"
                                }`}
                              >
                                <div className="space-y-1 max-w-xl">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-bold">
                                      #{mod.orderIndex}
                                    </span>
                                    <h4 className="font-mono font-bold text-sm text-stone-900">
                                      {mod.name}
                                    </h4>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                      mod.isEnabled ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                                    }`}>
                                      {mod.isEnabled ? "AKTİF" : "DEVRE DIŞI"}
                                    </span>
                                  </div>
                                  <p className="text-xs text-stone-600">{mod.description}</p>
                                </div>

                                <div className="flex items-center gap-3 self-end sm:self-center">
                                  {link !== "#" && (
                                    <Link
                                      href={link}
                                      target="_blank"
                                      className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded text-xs font-mono flex items-center gap-1"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>Sayfaya Git</span>
                                    </Link>
                                  )}

                                  {/* Açık/Kapalı Switch */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleModule(mod.key, mod.isEnabled)}
                                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                                      mod.isEnabled ? "bg-emerald-600" : "bg-stone-300"
                                    }`}
                                    aria-label={`Toggle ${mod.name}`}
                                  >
                                    <span
                                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                        mod.isEnabled ? "translate-x-8" : "translate-x-1"
                                      }`}
                                    />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BÖLÜM 2: GELEN B2B TEKLİF TALEPLERİ */}
              {activeModuleSection === "b2b" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-stone-900 font-mono">
                      Gelen B2B & Kulüp Teklif Listesi ({b2bQuotes.length})
                    </h3>
                  </div>

                  {b2bQuotes.length === 0 ? (
                    <p className="text-xs text-stone-500 py-8 text-center italic">Henüz B2B teklif talebi bulunmuyor.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px]">
                            <th className="py-2.5">Firma / Kulüp</th>
                            <th className="py-2.5">Yetkili</th>
                            <th className="py-2.5">İletişim</th>
                            <th className="py-2.5">Araç Adedi</th>
                            <th className="py-2.5">Hedef Bütçe</th>
                            <th className="py-2.5">Notlar</th>
                            <th className="py-2.5">Durum</th>
                            <th className="py-2.5 text-right">İşlem</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {b2bQuotes.map((q) => (
                            <tr key={q.id}>
                              <td className="py-3 font-bold text-stone-900">{q.companyName}</td>
                              <td className="py-3 text-stone-700">{q.contactName}</td>
                              <td className="py-3 text-stone-600">
                                <div>{q.phone}</div>
                                <div className="text-[10px] text-stone-400">{q.email}</div>
                              </td>
                              <td className="py-3 font-bold text-stone-900">{q.vehicleCount} Adet</td>
                              <td className="py-3 text-stone-800">
                                {q.targetBudget ? `${q.targetBudget.toLocaleString("tr-TR")} ₺` : "-"}
                              </td>
                              <td className="py-3 text-stone-600 max-w-xs truncate">{q.notes}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  q.status === "OFFER_SENT" ? "bg-emerald-100 text-emerald-800" :
                                  q.status === "REVIEWED" ? "bg-blue-100 text-blue-800" :
                                  q.status === "REJECTED" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                                }`}>
                                  {q.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleUpdateB2BStatus(q.id, "OFFER_SENT")}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px]"
                                  >
                                    Teklif Gönderildi
                                  </button>
                                  <a
                                    href={`https://wa.me/${q.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                      `Merhaba ${q.contactName}, ${q.companyName} için oluşturduğunuz RC crawler teklif talebi incelendi.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 bg-[#25D366] text-black rounded"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* BÖLÜM 3: GELEN TAKAS BAŞVURULARI */}
              {activeModuleSection === "trade" && (
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-stone-900 font-mono">
                    Gelen Eski Şasini Getir / Takas Talepleri ({tradeIns.length})
                  </h3>

                  {tradeIns.length === 0 ? (
                    <p className="text-xs text-stone-500 py-8 text-center italic">Henüz takas talebi bulunmuyor.</p>
                  ) : (
                    <div className="space-y-3">
                      {tradeIns.map((t) => (
                        <div key={t.id} className="p-4 border border-stone-200 rounded bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-sm">{t.customerName}</span>
                              <span className="text-stone-500">({t.phone})</span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                                {t.condition}
                              </span>
                            </div>
                            <p className="text-stone-700">Mevcut Şasi: <strong>{t.currentChassis}</strong></p>
                            <p className="text-stone-500 text-[11px]">
                              İstenen Yeni Ürün: {t.desiredProduct || "-"} • Müşteri Beklentisi: {t.expectedPrice ? `${t.expectedPrice} ₺` : "-"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${t.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Merhaba ${t.customerName}, CIHANPOL atölyesinden ${t.currentChassis} şasinizin takas ekspertiz değerlendirmesi için yazıyoruz.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-[#25D366] text-black font-bold rounded flex items-center gap-1 text-[11px]"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Ekspertiz</span>
                            </a>
                            <button
                              onClick={() => handleUpdateTradeStatus(t.id, "ACCEPTED")}
                              className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded text-[11px]"
                            >
                              Onayla
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* BÖLÜM 4: GELEN 3D BASKI TALEPLERİ */}
              {activeModuleSection === "print" && (
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-stone-900 font-mono">
                    Gelen 3D Baskı Talepleri ({printOrders.length})
                  </h3>

                  {printOrders.length === 0 ? (
                    <p className="text-xs text-stone-500 py-8 text-center italic">Henüz 3D baskı talebi bulunmuyor.</p>
                  ) : (
                    <div className="space-y-3">
                      {printOrders.map((p) => (
                        <div key={p.id} className="p-4 border border-stone-200 rounded bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-sm">{p.projectTitle}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-bold">
                                {p.material} ({p.scale})
                              </span>
                            </div>
                            <p className="text-stone-700">Müşteri: {p.customerName} ({p.phone})</p>
                            {p.notes && <p className="text-stone-500 text-[11px]">Notlar: {p.notes}</p>}
                          </div>

                          <div className="flex items-center gap-2">
                            {p.fileUrl && (
                              <a
                                href={p.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 border border-stone-300 text-stone-700 rounded text-[11px] flex items-center gap-1"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>STL İndir</span>
                              </a>
                            )}
                            <a
                              href={`https://wa.me/${p.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Merhaba ${p.customerName}, 3D baskı projeniz (${p.projectTitle}) için baskı süresi ve fiyat teklifimiz hazırdır.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-[#25D366] text-black font-bold rounded flex items-center gap-1 text-[11px]"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Fiyat Teklifi İlet</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
