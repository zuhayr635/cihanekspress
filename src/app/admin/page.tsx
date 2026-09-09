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
  Edit3,
  Download,
  Search,
  X,
  FileSpreadsheet,
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

  // Ürün Düzenleme & Dışa Aktarma
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");

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

  // Ürün Düzenleme Kaydet
  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSavingProduct(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          title: editingProduct.title,
          description: editingProduct.description,
          shortDescription: editingProduct.shortDescription,
          basePrice: Number(editingProduct.basePrice),
          salePrice: editingProduct.salePrice ? Number(editingProduct.salePrice) : null,
          stockQuantity: Number(editingProduct.stockQuantity),
          isFeatured: Boolean(editingProduct.isFeatured),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotify("success", `"${editingProduct.title}" başarıyla güncellendi!`);
        setEditingProduct(null);
        refreshAllData();
      } else {
        showNotify("error", data.error || "Ürün güncellenemedi.");
      }
    } catch {
      showNotify("error", "Bağlantı hatası oluştu.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Ürün Silme
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`"${title}" ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showNotify("success", `"${title}" silindi.`);
        refreshAllData();
      } else {
        showNotify("error", data.error || "Ürün silinemedi.");
      }
    } catch {
      showNotify("error", "Bağlantı hatası oluştu.");
    }
  };

  // Ürünleri CSV Olarak Dışa Aktar
  const handleExportProductsCSV = () => {
    if (products.length === 0) {
      showNotify("error", "Dışa aktarılacak ürün bulunamadı.");
      return;
    }
    const headers = ["ID", "Ürün Adı", "Kategori", "Fiyat (TL)", "İndirimli Fiyat (TL)", "Stok", "Slug", "Görsel URL"];
    const rows = products.map((p) => {
      let firstImg = "";
      try {
        const imgs = p.images ? JSON.parse(p.images) : [];
        firstImg = imgs[0] || "";
      } catch {}
      return [
        p.id,
        `"${(p.title || "").replace(/"/g, '""')}"`,
        `"${(p.category?.name || "Kategorisiz").replace(/"/g, '""')}"`,
        p.basePrice,
        p.salePrice || "",
        p.stockQuantity,
        p.slug,
        `"${firstImg.replace(/"/g, '""')}"`,
      ];
    });
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cihanekspress-urunler-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotify("success", `${products.length} ürün CSV formatında dışa aktarıldı!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7]">
        <div className="animate-spin w-10 h-10 border-3 border-[#F27A1A] border-t-transparent rounded-full mb-3" />
        <span className="text-xs font-semibold text-slate-500">Yönetim Paneli Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col font-sans">
      {/* Üst Bar */}
      <header className="sticky top-0 z-30 bg-[#0F172A] text-white px-4 sm:px-8 py-3.5 border-b border-slate-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
              cihan<span className="text-[#F27A1A]">ekspress</span>
              <span className="text-slate-400 text-xs font-semibold">.com</span>
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full">
            Yönetim Paneli
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 text-xs">
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#F27A1A]" />
            <span>Mağaza Vitrini</span>
          </Link>
          <div className="flex items-center gap-2 border-l border-slate-700/80 pl-3 sm:pl-5">
            <div className="w-7 h-7 rounded-full bg-[#F27A1A] text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <span className="font-semibold text-slate-100 block">{adminUser?.name || "Yönetici"}</span>
              <span className="text-[10px] text-slate-400 font-mono">@{adminUser?.username || "admin"}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </header>

      {/* Bildirim Banner */}
      {notification && (
        <div
          className={`px-6 py-3 text-xs font-semibold flex items-center justify-between shadow-xs transition-all animate-in fade-in ${
            notification.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white font-bold px-2 cursor-pointer">✕</button>
        </div>
      )}

      {/* Ana Gövde */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-8">
        {/* Sol Menü (Tabs) */}
        <aside className="w-full md:w-64 space-y-1.5 flex-shrink-0">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#F27A1A] text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/60"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Genel Bakış</span>
          </button>

          <button
            onClick={() => setActiveTab("invites")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "invites"
                ? "bg-[#F27A1A] text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/60"
            }`}
          >
            <span className="flex items-center gap-3">
              <KeyRound className={`w-4 h-4 ${activeTab === "invites" ? "text-white" : "text-[#F27A1A]"}`} />
              <span>Davetiye Linkleri</span>
            </span>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "invites" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-800"
            }`}>
              {invites.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-[#F27A1A] text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/60"
            }`}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Siparişler</span>
            </span>
            {orders.length > 0 && (
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === "orders" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-800"
              }`}>
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "products"
                ? "bg-[#F27A1A] text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/60"
            }`}
          >
            <span className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Ürünler & Stok</span>
            </span>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "products" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-800"
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#F27A1A] text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/60"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Mağaza Modu & Ödeme</span>
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "coupons"
                ? "bg-[#F27A1A] text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/60"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>İndirim Kuponları</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "reviews"
                ? "bg-[#F27A1A] text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/60"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Yorum Onay Havuzu</span>
          </button>

          <button
            onClick={() => setActiveTab("modules")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "modules"
                ? "bg-[#F27A1A] text-white font-bold shadow-xs"
                : "bg-white hover:bg-orange-50/60 text-slate-800 border border-orange-200/80"
            }`}
          >
            <span className="flex items-center gap-3">
              <Sliders className={`w-4 h-4 ${activeTab === "modules" ? "text-white" : "text-[#F27A1A]"}`} />
              <span>Modüller (15 Modül)</span>
            </span>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "modules" ? "bg-white/20 text-white" : "bg-orange-100 text-[#F27A1A]"
            }`}>
              {modulesList.length || 15}
            </span>
          </button>
        </aside>

        {/* Sağ İçerik Alanı */}
        <main className="flex-1">
          {/* TAB 1: GENEL BAKIŞ (DASHBOARD) */}
          {activeTab === "dashboard" && reportData && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                      Toplam Ciro
                    </span>
                    <span className="font-sans text-2xl font-bold text-slate-900 block mt-1">
                      {reportData.totalRevenue.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#F27A1A] border border-orange-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                      Toplam Sipariş
                    </span>
                    <span className="font-sans text-2xl font-bold text-slate-900 block mt-1">
                      {reportData.totalOrders}
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                      Bekleyen Havaleler
                    </span>
                    <span className="font-sans text-2xl font-bold text-amber-600 block mt-1">
                      {reportData.pendingBankTransfers} Adet
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                      Davetiye Satış Oranı
                    </span>
                    <span className="font-sans text-2xl font-bold text-emerald-600 block mt-1">
                      {reportData.conversionRate}
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Kritik Stok Uyarıları */}
              {reportData.lowStockProducts && reportData.lowStockProducts.length > 0 && (
                <div className="bg-amber-50/90 border border-amber-200/80 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Kritik Stok Uyarısı (WooCommerce Envanter Alarmı)</span>
                  </div>
                  <ul className="text-xs text-amber-800 space-y-1 font-medium">
                    {reportData.lowStockProducts.map((p: any) => (
                      <li key={p.id}>
                        • <strong>{p.title}</strong>: Kalan Stok: <span className="font-bold text-rose-700">{p.stockQuantity} Adet</span> (Eşik: {p.lowStockThreshold})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Son Siparişler Tablosu */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                    Son Gelen Siparişler
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Güncel kayıtlar</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-200/80 text-slate-500 uppercase text-[10px] font-bold">
                        <th className="py-2.5 px-3">Sipariş No</th>
                        <th className="py-2.5 px-3">Müşteri</th>
                        <th className="py-2.5 px-3">Tutar</th>
                        <th className="py-2.5 px-3">Ödeme Türü</th>
                        <th className="py-2.5 px-3">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportData.recentOrders.map((o: any) => (
                        <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                          <td className="py-3 px-3 font-medium text-slate-800">{o.customerName}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{o.total.toLocaleString("tr-TR")} ₺</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-semibold">
                              {o.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : o.status === "PROCESSING"
                                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                            }`}>
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
            <div className="space-y-6 animate-in fade-in">
              {/* Yeni Link Üretme Kartı */}
              <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F27A1A] border border-orange-100 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                      Tek Kullanımlık VIP Davetiye Linki Üret
                    </h2>
                    <p className="text-[11px] text-slate-500">Müşteriye özel tek tıklamalık satış kilidi açma anahtarı</p>
                  </div>
                </div>

                <form onSubmit={handleCreateInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Müşteri / Not
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Ahmet Bey - VIP"
                      value={inviteNote}
                      onChange={(e) => setInviteNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] focus:ring-2 focus:ring-orange-100 font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Özel VIP İndirimi (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Örn: 20 (%20 indirim)"
                      value={inviteDiscount}
                      onChange={(e) => setInviteDiscount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] focus:ring-2 focus:ring-orange-100 font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Geçerlilik Süresi (Gün)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={inviteDays}
                      onChange={(e) => setInviteDays(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] focus:ring-2 focus:ring-orange-100 font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#F27A1A] hover:bg-[#E06A0A] active:bg-[#C85B03] text-white text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tek Kullanımlık Link Oluştur</span>
                    </button>
                  </div>
                </form>

                {/* Üretilen Link Gösterimi */}
                {createdInviteUrl && (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 rounded-xl space-y-2.5 animate-in fade-in">
                    <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#F27A1A]" />
                      Oluşturulan Tek Kullanımlık VIP Bağlantısı:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={createdInviteUrl}
                        className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-amber-300/80 rounded-lg font-mono text-slate-900 font-medium select-all shadow-2xs"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(createdInviteUrl);
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 2000);
                        }}
                        className="px-4 py-2.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        {copySuccess ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                        <span>{copySuccess ? "Kopyalandı!" : "Kopyala"}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-700 font-medium">
                      🔒 Bu link müşteriniz tarafından bir kez tıklandığı an güvenle yakılacak ve başka kimse tarafından kullanılamayacaktır.
                    </p>
                  </div>
                )}
              </div>

              {/* Davetiye Listesi */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                    Tüm Davetiye Kayıtları & Kullanım Takibi
                  </h3>
                  <span className="text-xs text-slate-400 font-mono font-medium">{invites.length} Toplam Kayıt</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-200/80 text-slate-500 uppercase text-[10px] font-bold">
                        <th className="py-2.5 px-3">Token Kodu</th>
                        <th className="py-2.5 px-3">Not / Müşteri</th>
                        <th className="py-2.5 px-3">İndirim</th>
                        <th className="py-2.5 px-3">Durum</th>
                        <th className="py-2.5 px-3">Kullanım Bilgisi</th>
                        <th className="py-2.5 px-3">Oluşturulma</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invites.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 select-all">{inv.token}</td>
                          <td className="py-3 px-3 font-medium text-slate-700">{inv.note || "-"}</td>
                          <td className="py-3 px-3 font-mono text-[#F27A1A] font-bold">
                            {inv.discountPercent > 0 ? `%${inv.discountPercent}` : "-"}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                inv.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                  : inv.status === "USED"
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-rose-50 text-rose-700 border border-rose-200/60"
                              }`}
                            >
                              {inv.status === "ACTIVE" ? "Aktif" : inv.status === "USED" ? "Kullanıldı (Yandı)" : "Geçersiz"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                            {inv.usedAt ? (
                              <span className="font-semibold text-slate-700">{new Date(inv.usedAt).toLocaleString("tr-TR")} ({inv.usedByIp})</span>
                            ) : (
                              <span className="text-slate-400">Henüz kullanılmadı</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-400">
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
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                    Tüm Siparişler & Havale Dekont Kontrolü
                  </h2>
                  <p className="text-[11px] text-slate-500">Müşteri sipariş durumları ve dekont doğrulama merkezi</p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
                  {orders.length} Sipariş Kayıtlı
                </span>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-12 text-center italic">Henüz sipariş kaydı bulunmuyor.</p>
                ) : (
                  orders.map((ord) => (
                    <div key={ord.id} className="p-5 sm:p-6 border border-slate-200/80 rounded-2xl space-y-4 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
                        <div>
                          <span className="font-mono text-sm font-bold text-slate-900">{ord.orderNumber}</span>
                          <span className="text-slate-400 text-xs ml-2 font-mono">
                            {new Date(ord.createdAt).toLocaleString("tr-TR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/80 font-semibold text-slate-800">
                            {ord.paymentMethod}
                          </span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              ord.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : ord.status === "PROCESSING"
                                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                        <div>
                          <p className="font-bold text-slate-900">Müşteri:</p>
                          <p className="font-medium text-slate-800">{ord.customerName}</p>
                          <p className="font-mono text-slate-500">{ord.customerPhone}</p>
                          <p className="text-slate-500">{ord.customerEmail}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Teslimat Adresi:</p>
                          <p className="text-slate-800">{ord.shippingAddress}</p>
                          <p className="text-slate-500 font-medium">{ord.city}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="font-bold text-slate-900">Toplam Tutar:</p>
                          <p className="font-sans text-lg font-black text-[#F27A1A]">
                            {ord.total.toLocaleString("tr-TR")} ₺
                          </p>
                        </div>
                      </div>

                      {/* Dekont Bilgisi Varsa */}
                      {ord.receiptUrl && (
                        <div className="p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-amber-900">
                            <Eye className="w-4 h-4 text-amber-600" />
                            <span>Müşteri Dekont Yükledi: <strong>{ord.adminNote || "Dekont eklendi"}</strong></span>
                          </div>
                          <a
                            href={ord.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-amber-800 hover:text-amber-900 underline font-bold flex items-center gap-1"
                          >
                            <span>Dekontu İncele</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {/* Durum Güncelleme Butonları */}
                      <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-200/70">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mr-2">
                          Hızlı İşlemler:
                        </span>

                        {ord.status === "PENDING_PAYMENT" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, "PROCESSING", "COMPLETED")}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            ✓ Havaleyi Onayla & Hazırlanıyor Yap
                          </button>
                        )}

                        {ord.status === "PROCESSING" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, "SHIPPED")}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            Kargoya Verildi Olarak İşaretle
                          </button>
                        )}

                        {ord.status === "SHIPPED" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, "COMPLETED")}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            Teslim Edildi (Tamamlandı)
                          </button>
                        )}

                        <Link
                          href={`/order-success/${ord.orderNumber}`}
                          target="_blank"
                          className="px-3.5 py-1.5 border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Faturayı / Makbuzu Görüntüle
                        </Link>
                      </div>

                      {/* WhatsApp Otomatik Sipariş Bildirimleri (Modül 10) */}
                      <div className="pt-2 border-t border-slate-200/50 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-800 font-bold flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                          WhatsApp Şablonları:
                        </span>
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Merhaba ${ord.customerName}, CIHANPOL RC Crawler Lab'den ${ord.orderNumber} numaralı siparişiniz onaylandı! Atölyemizde montaj hazırlığı başladı.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-[11px] bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-900 border border-emerald-300 font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>✓ Onaylandı</span>
                        </a>
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Merhaba ${ord.customerName}, ${ord.orderNumber} numaralı siparişinizin atölye montaj ve kaya tırmanış testleri başarıyla tamamlandı, kargoya hazırlanıyor!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-[11px] bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-900 border border-emerald-300 font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>🛠️ Montaj Bitti</span>
                        </a>
                        <a
                          href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Merhaba ${ord.customerName}, ${ord.orderNumber} numaralı siparişiniz kargoya verilmiştir. Takip no: ${ord.trackingNumber || "Hazırlanıyor"}. İyi tırmanışlar dileriz!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-[11px] bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-900 border border-emerald-300 font-semibold rounded-lg transition-colors flex items-center gap-1"
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
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in shadow-xs">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                  Mağaza Görünürlüğü & Ödeme Altyapıları Kontrolü
                </h2>
                <p className="text-[11px] text-slate-500">Mevzuat kalkanı, satış kısıtlamaları ve tahsilat kanalları yapılandırması</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* 1. Mağaza Modu (Çekirdek Gizlilik Kontrolü) */}
                <div className="p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-900">
                      Mağaza Görünürlük & Satış Modu
                    </label>
                    <p className="text-[11px] text-slate-500">Sitenin dışarıya nasıl görüneceğini ve kimlerin fiyat görebileceğini belirler</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label
                      className={`p-4 sm:p-5 border rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                        settings.storeMode === "CATALOG_ONLY"
                          ? "bg-orange-50/40 border-[#F27A1A] ring-2 ring-orange-200 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
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
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">Katalog / Vitrin Modu</span>
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Zabıta Kalkanı</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                          Varsayılan mod. Fiyatlar ve sepet gizlidir. Sadece sergi ve atölye hikayesi görünür.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`p-4 sm:p-5 border rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                        settings.storeMode === "INVITE_ONLY"
                          ? "bg-orange-50/40 border-[#F27A1A] ring-2 ring-orange-200 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
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
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">Sadece VIP Davetiye</span>
                          <span className="text-[9px] bg-[#F27A1A]/10 text-[#F27A1A] font-bold px-1.5 py-0.5 rounded">Özel VIP</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                          Yalnızca tek kullanımlık linke tıklayan VIP müşteriler fiyat görür ve sipariş verir.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`p-4 sm:p-5 border rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                        settings.storeMode === "PUBLIC_SALE"
                          ? "bg-orange-50/40 border-[#F27A1A] ring-2 ring-orange-200 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
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
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">Genel Açık Satış</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Standart</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                          Tüm ziyaretçilere standart e-ticaret gibi fiyatlar ve sipariş açıktır.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 2. IBAN & Havale Ayarları */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#F27A1A]" />
                      <span>IBAN / Havale Ödeme Sistemi</span>
                    </h3>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.bankTransferEnabled}
                        onChange={(e) => setSettings({ ...settings, bankTransferEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-[#F27A1A] focus:ring-[#F27A1A]"
                      />
                      <span>Havale ile Ödemeyi Açık Tut</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    {settings.bankAccounts?.map((acc: any, i: number) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                        <input
                          type="text"
                          placeholder="Banka Adı"
                          value={acc.bankName}
                          onChange={(e) => {
                            const copy = [...settings.bankAccounts];
                            copy[i].bankName = e.target.value;
                            setSettings({ ...settings, bankAccounts: copy });
                          }}
                          className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#F27A1A] focus:outline-none"
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
                          className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#F27A1A] focus:outline-none"
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
                          className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:border-[#F27A1A] focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. WhatsApp Sipariş Ayarları */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>WhatsApp Hızlı Sipariş Entegrasyonu</span>
                    </h3>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.whatsappOrderEnabled}
                        onChange={(e) => setSettings({ ...settings, whatsappOrderEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-[#F27A1A] focus:ring-[#F27A1A]"
                      />
                      <span>WhatsApp Siparişi Aktif</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      WhatsApp Telefon Numarası (Ülke kodlu)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappPhone}
                      onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#F27A1A] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* 4. Kredi Kartı / Sanal POS Ayarları */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Kredi Kartı / Sanal POS Modülü (PayTR / iyzico)</span>
                    </h3>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.creditCardEnabled}
                        onChange={(e) => setSettings({ ...settings, creditCardEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-[#F27A1A] focus:ring-[#F27A1A]"
                      />
                      <span>Kartla Ödemeyi Aktif Et</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Sağlayıcı
                      </label>
                      <select
                        value={settings.creditCardProvider}
                        onChange={(e) => setSettings({ ...settings, creditCardProvider: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#F27A1A] focus:outline-none"
                      >
                        <option value="paytr">PayTR</option>
                        <option value="iyzico">iyzico</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Çalışma Modu
                      </label>
                      <select
                        value={settings.ccTestMode ? "test" : "live"}
                        onChange={(e) => setSettings({ ...settings, ccTestMode: e.target.value === "test" })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#F27A1A] focus:outline-none"
                      >
                        <option value="test">Test / Sandbox Modu</option>
                        <option value="live">Canlı / Üretim Modu</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 5. Kargo ve Vergi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Ücretsiz Kargo Sepet Eşiği (TL)
                    </label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#F27A1A] focus:outline-none font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Standart Kargo Ücreti (TL)
                    </label>
                    <input
                      type="number"
                      value={settings.defaultShippingFee}
                      onChange={(e) => setSettings({ ...settings, defaultShippingFee: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#F27A1A] focus:outline-none font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#F27A1A] hover:bg-[#E06A0A] active:bg-[#C85B03] text-white text-xs uppercase tracking-wider font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Tüm Ayarları Kaydet
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: ÜRÜNLER (PRODUCTS) */}
          {activeTab === "products" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                    Ürün & Envanter Yönetimi
                  </h2>
                  <p className="text-[11px] text-slate-500">Katalog ürünlerini düzenleyin, stokları güncelleyin veya dışa aktarın</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleExportProductsCSV}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Tüm ürünleri Excel uyumlu CSV olarak dışa aktar"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV / Excel İndir</span>
                  </button>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
                    {products.length} Ürün
                  </span>
                </div>
              </div>

              {/* Arama / Filtreleme Çubuğu */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ürün adı, slug veya kategoriye göre ara..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#F27A1A] focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                />
                {productSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setProductSearchTerm("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Ürün Listesi */}
              <div className="divide-y divide-slate-100">
                {products
                  .filter((p) => {
                    if (!productSearchTerm) return true;
                    const term = productSearchTerm.toLowerCase();
                    return (
                      p.title?.toLowerCase().includes(term) ||
                      p.slug?.toLowerCase().includes(term) ||
                      p.category?.name?.toLowerCase().includes(term)
                    );
                  })
                  .map((p) => (
                    <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/60">
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
                          <div className="flex items-center gap-2">
                            <h4 className="font-sans text-sm font-bold text-slate-900">{p.title}</h4>
                            {p.isFeatured && (
                              <span className="text-[9px] bg-orange-100 text-[#F27A1A] font-bold px-1.5 py-0.5 rounded">
                                Öne Çıkan
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-slate-500">{p.category?.name || "Kategorisiz"}</p>
                          <p className="font-sans text-xs font-black text-[#F27A1A] mt-0.5">
                            {p.basePrice.toLocaleString("tr-TR")} ₺{" "}
                            {p.salePrice && (
                              <span className="line-through text-slate-400 font-normal ml-1">
                                {p.salePrice.toLocaleString("tr-TR")} ₺
                              </span>
                            )}
                            <span className="font-mono text-slate-500 font-normal ml-2">
                              • Stok: <span className={`font-bold ${p.stockQuantity <= 3 ? "text-rose-600" : "text-slate-700"}`}>{p.stockQuantity}</span>
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...p })}
                          className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#F27A1A] border border-orange-200/80 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Düzenle</span>
                        </button>
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="px-3 py-1.5 border border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Vitrinde Gör</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Ürünü Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 6: KUPONLAR (COUPONS) */}
          {activeTab === "coupons" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                    İndirim Kuponları
                  </h2>
                  <p className="text-[11px] text-slate-500">Müşteri sepet promosyonları ve kullanım limitleri</p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
                  {coupons.length} Kupon
                </span>
              </div>
              <div className="space-y-3">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 sm:p-5 bg-slate-50/60 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl flex items-center justify-between transition-all shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black bg-orange-50 text-[#F27A1A] border border-orange-200/60 px-3 py-1 rounded-lg">
                        {c.code}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {c.type === "PERCENTAGE" ? `%${c.amount} İndirim` : `${c.amount} ₺ Sabit İndirim`}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-500 font-medium">
                      Kullanım: <strong className="text-slate-800">{c.usageCount}</strong> / {c.usageLimit || "Sınırsız"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: YORUM ONAY HAVUZU (REVIEWS) */}
          {activeTab === "reviews" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                    Müşteri Değerlendirmeleri
                  </h2>
                  <p className="text-[11px] text-slate-500">Kullanıcı yorumları denetleme ve yayına alma paneli</p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
                  {reviews.length} Değerlendirme
                </span>
              </div>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-12 text-center italic">Henüz onay bekleyen yorum bulunmuyor.</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="p-4 sm:p-5 bg-slate-50/60 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl space-y-2.5 transition-all shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{r.authorName} <span className="text-slate-400 font-normal">({r.product?.title})</span></span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.isApproved ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"
                        }`}>
                          {r.isApproved ? "Yayında" : "Onay Bekliyor"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: 15 MODÜL & ÖZELLİK KONTROL MERKEZİ (MODULES) */}
          {activeTab === "modules" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in shadow-xs">
              {/* Üst Başlık & İstatistikler */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-[#F27A1A] text-xs font-bold uppercase tracking-wider">
                    <Sliders className="w-4 h-4" />
                    <span>Feature Flag & Switchboard</span>
                  </div>
                  <h2 className="text-xl font-sans font-black text-slate-900 mt-1">
                    15 Modül & Özellik Yönetim Merkezi
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Tüm teknik hesaplayıcıları, ticari büyüme masalarını ve topluluk araçlarını anlık açıp kapatın.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 border border-orange-200/80 px-4 py-2.5 rounded-xl text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-bold">Aktif Modüller</span>
                    <span className="text-lg font-mono font-black text-[#F27A1A]">
                      {modulesList.filter((m) => m.isEnabled).length} / {modulesList.length || 15}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alt Sekmeler (Sub-Tabs) */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
                <button
                  onClick={() => setActiveModuleSection("switches")}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer ${
                    activeModuleSection === "switches"
                      ? "bg-[#F27A1A] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  🎛️ Tüm Modül Anahtarları (15)
                </button>
                <button
                  onClick={() => setActiveModuleSection("b2b")}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeModuleSection === "b2b"
                      ? "bg-[#F27A1A] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  <span>💼 Gelen B2B Teklifleri</span>
                  {b2bQuotes.length > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      activeModuleSection === "b2b" ? "bg-white/20 text-white" : "bg-orange-100 text-[#F27A1A]"
                    }`}>
                      {b2bQuotes.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveModuleSection("trade")}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeModuleSection === "trade"
                      ? "bg-[#F27A1A] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  <span>🔄 Gelen Takas Talepleri</span>
                  {tradeIns.length > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      activeModuleSection === "trade" ? "bg-white/20 text-white" : "bg-orange-100 text-[#F27A1A]"
                    }`}>
                      {tradeIns.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveModuleSection("print")}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeModuleSection === "print"
                      ? "bg-[#F27A1A] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  <span>🖨️ 3D Baskı Siparişleri</span>
                  {printOrders.length > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      activeModuleSection === "print" ? "bg-white/20 text-white" : "bg-orange-100 text-[#F27A1A]"
                    }`}>
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
                      <div key={cat} className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
                        <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200/80">
                          <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-900">
                            {info.label}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">{info.desc}</p>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {catModules.map((mod) => {
                            const link = previewLinks[mod.key] || "/";

                            return (
                              <div
                                key={mod.key}
                                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                                  mod.isEnabled ? "bg-white" : "bg-slate-50/60 opacity-75"
                                }`}
                              >
                                <div className="space-y-1 max-w-xl">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                                      #{mod.orderIndex}
                                    </span>
                                    <h4 className="font-sans font-bold text-sm text-slate-900">
                                      {mod.name}
                                    </h4>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      mod.isEnabled ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-slate-100 text-slate-600"
                                    }`}>
                                      {mod.isEnabled ? "AKTİF" : "DEVRE DIŞI"}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{mod.description}</p>
                                </div>

                                <div className="flex items-center gap-3 self-end sm:self-center">
                                  {link !== "#" && (
                                    <Link
                                      href={link}
                                      target="_blank"
                                      className="px-3.5 py-1.5 border border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-[#F27A1A]" />
                                      <span>Sayfaya Git</span>
                                    </Link>
                                  )}

                                  {/* Açık/Kapalı Switch */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleModule(mod.key, mod.isEnabled)}
                                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                                      mod.isEnabled ? "bg-[#F27A1A]" : "bg-slate-300"
                                    }`}
                                    aria-label={`Toggle ${mod.name}`}
                                  >
                                    <span
                                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
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
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                      Gelen B2B & Kulüp Teklif Listesi
                    </h3>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
                      {b2bQuotes.length} Talep
                    </span>
                  </div>

                  {b2bQuotes.length === 0 ? (
                    <p className="text-xs text-slate-400 py-12 text-center italic">Henüz B2B teklif talebi bulunmuyor.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-y border-slate-200/80 text-slate-500 uppercase text-[10px] font-bold">
                            <th className="py-2.5 px-3">Firma / Kulüp</th>
                            <th className="py-2.5 px-3">Yetkili</th>
                            <th className="py-2.5 px-3">İletişim</th>
                            <th className="py-2.5 px-3">Araç Adedi</th>
                            <th className="py-2.5 px-3">Hedef Bütçe</th>
                            <th className="py-2.5 px-3">Notlar</th>
                            <th className="py-2.5 px-3">Durum</th>
                            <th className="py-2.5 px-3 text-right">İşlem</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {b2bQuotes.map((q) => (
                            <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3 px-3 font-bold text-slate-900">{q.companyName}</td>
                              <td className="py-3 px-3 text-slate-700 font-medium">{q.contactName}</td>
                              <td className="py-3 px-3 text-slate-600">
                                <div className="font-mono">{q.phone}</div>
                                <div className="text-[10px] text-slate-400">{q.email}</div>
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-900">{q.vehicleCount} Adet</td>
                              <td className="py-3 px-3 font-bold text-[#F27A1A]">
                                {q.targetBudget ? `${q.targetBudget.toLocaleString("tr-TR")} ₺` : "-"}
                              </td>
                              <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{q.notes}</td>
                              <td className="py-3 px-3">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  q.status === "OFFER_SENT" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" :
                                  q.status === "REVIEWED" ? "bg-blue-50 text-blue-700 border border-blue-200/60" :
                                  q.status === "REJECTED" ? "bg-rose-50 text-rose-700 border border-rose-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"
                                }`}>
                                  {q.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleUpdateB2BStatus(q.id, "OFFER_SENT")}
                                    className="px-2.5 py-1 bg-[#F27A1A] hover:bg-[#E06A0A] text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer transition-colors"
                                  >
                                    Teklif Gönderildi
                                  </button>
                                  <a
                                    href={`https://wa.me/${q.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                      `Merhaba ${q.contactName}, ${q.companyName} için oluşturduğunuz RC crawler teklif talebi incelendi.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors"
                                    title="WhatsApp'tan Yaz"
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
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                      Gelen Eski Şasini Getir / Takas Talepleri
                    </h3>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
                      {tradeIns.length} Başvuru
                    </span>
                  </div>

                  {tradeIns.length === 0 ? (
                    <p className="text-xs text-slate-400 py-12 text-center italic">Henüz takas talebi bulunmuyor.</p>
                  ) : (
                    <div className="space-y-3">
                      {tradeIns.map((t) => (
                        <div key={t.id} className="p-5 border border-slate-200/80 rounded-2xl bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{t.customerName}</span>
                              <span className="text-slate-500 font-mono">({t.phone})</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-800 border border-amber-200/60 font-bold">
                                {t.condition}
                              </span>
                            </div>
                            <p className="text-slate-700">Mevcut Şasi: <strong className="text-slate-900">{t.currentChassis}</strong></p>
                            <p className="text-slate-500 text-[11px]">
                              İstenen Yeni Ürün: <span className="font-semibold text-slate-700">{t.desiredProduct || "-"}</span> • Müşteri Beklentisi: <span className="font-bold text-[#F27A1A]">{t.expectedPrice ? `${t.expectedPrice.toLocaleString("tr-TR")} ₺` : "-"}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${t.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Merhaba ${t.customerName}, CIHANPOL atölyesinden ${t.currentChassis} şasinizin takas ekspertiz değerlendirmesi için yazıyoruz.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg flex items-center gap-1.5 text-xs shadow-xs transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Ekspertiz</span>
                            </a>
                            <button
                              onClick={() => handleUpdateTradeStatus(t.id, "ACCEPTED")}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
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
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                      Gelen 3D Baskı Talepleri
                    </h3>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
                      {printOrders.length} Sipariş
                    </span>
                  </div>

                  {printOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 py-12 text-center italic">Henüz 3D baskı talebi bulunmuyor.</p>
                  ) : (
                    <div className="space-y-3">
                      {printOrders.map((p) => (
                        <div key={p.id} className="p-5 border border-slate-200/80 rounded-2xl bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{p.projectTitle}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200/60 font-bold">
                                {p.material} ({p.scale})
                              </span>
                            </div>
                            <p className="text-slate-700">Müşteri: <span className="font-semibold text-slate-900">{p.customerName}</span> <span className="text-slate-500 font-mono">({p.phone})</span></p>
                            {p.notes && <p className="text-slate-500 text-[11px] leading-relaxed">Notlar: {p.notes}</p>}
                          </div>

                          <div className="flex items-center gap-2">
                            {p.fileUrl && (
                              <a
                                href={p.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 border border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-[#F27A1A]" />
                                <span>STL İndir</span>
                              </a>
                            )}
                            <a
                              href={`https://wa.me/${p.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Merhaba ${p.customerName}, 3D baskı projeniz (${p.projectTitle}) için baskı süresi ve fiyat teklifimiz hazırdır.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg flex items-center gap-1.5 text-xs shadow-xs transition-colors"
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

      {/* ÜRÜN DÜZENLEME MODALI */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Başlık */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F27A1A] border border-orange-100 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Ürün Bilgilerini Düzenle
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">ID: {editingProduct.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProductEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ürün Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] focus:ring-2 focus:ring-orange-100 font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Taban Satış Fiyatı (TL)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="any"
                    value={editingProduct.basePrice ?? ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kampanyalı Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    placeholder="Boş bırakılabilir"
                    value={editingProduct.salePrice ?? ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Stok Adedi
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.stockQuantity ?? 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kısa Açıklama (Vitrin Özeti)
                </label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detaylı Ürün Açıklaması
                </label>
                <textarea
                  rows={4}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-medium text-slate-900 leading-relaxed resize-y"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isFeatured)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#F27A1A] focus:ring-[#F27A1A]"
                  />
                  <span>Ana sayfada ve vitrinde öne çıkarılan ürün olarak işaretle</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 bg-[#F27A1A] hover:bg-[#E06A0A] active:bg-[#C85B03] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingProduct ? <span>Kaydediliyor...</span> : <span>Değişiklikleri Kaydet</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
