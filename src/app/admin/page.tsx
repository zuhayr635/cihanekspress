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
  ShieldAlert,
  DollarSign,
  FolderTree,
  Upload,
  ArrowRight,
  Kanban,
  CheckSquare,
  Star,
  ShieldOff,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "settings" | "invites" | "products" | "categories" | "orders" | "coupons" | "reviews" | "modules"
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

  // Manuel Dolar Kuru & Zabıta Kalkanı
  const [usdRateInput, setUsdRateInput] = useState<string>("38.5");
  const [isSavingUsdRate, setIsSavingUsdRate] = useState(false);
  const [isTogglingPanic, setIsTogglingPanic] = useState(false);

  // Kategoriler (Kategori & Şasi Ölçeği Ağacı)
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Siparişler: Tablo vs. Atölye Montaj Kanbanı
  const [orderViewMode, setOrderViewMode] = useState<"table" | "kanban">("table");

  // Ürün Düzenleme, Toplu Yükleme & Kritik Stok
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  // IP Bloklama & VIP Radar
  const [newBlockIp, setNewBlockIp] = useState("");
  const [isBlockingIp, setIsBlockingIp] = useState(false);

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
      const [repRes, setRes, invRes, prodRes, ordRes, coupRes, revRes, modRes, b2bRes, tradeRes, printRes, catRes] = await Promise.all([
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
        fetch("/api/admin/categories"),
      ]);

      if (repRes.ok) setReportData(await repRes.json());
      if (setRes.ok) {
        const setData = await setRes.json();
        setSettings(setData);
        if (setData.usdRate) setUsdRateInput(String(setData.usdRate));
      }
      if (invRes.ok) {
        const data = await invRes.json();
        setInvites(data.invites || []);
      }
      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data.categories || []);
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

  // Ürün Düzenleme Kaydet (Uyumluluk & COGS Maliyet Dahil)
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
          costPrice: editingProduct.costPrice ? Number(editingProduct.costPrice) : null,
          compatibleModels: typeof editingProduct.compatibleModels === "string" && !editingProduct.compatibleModels.trim().startsWith("[")
            ? JSON.stringify(editingProduct.compatibleModels.split(",").map((s: string) => s.trim()).filter(Boolean))
            : editingProduct.compatibleModels,
          stockQuantity: Number(editingProduct.stockQuantity),
          isFeatured: Boolean(editingProduct.isFeatured),
          categoryId: editingProduct.categoryId || null,
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
    const headers = ["ID", "Ürün Adı", "Kategori", "Fiyat (TL)", "İndirimli Fiyat (TL)", "Maliyet (TL)", "Stok", "Slug", "Uyumlu Modeller"];
    const rows = products.map((p) => {
      return [
        p.id,
        `"${(p.title || "").replace(/"/g, '""')}"`,
        `"${(p.category?.name || "Kategorisiz").replace(/"/g, '""')}"`,
        p.basePrice,
        p.salePrice || "",
        p.costPrice || "",
        p.stockQuantity,
        p.slug,
        `"${(p.compatibleModels || "").replace(/"/g, '""')}"`,
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

  // 1. ZABITA & DENETİM ACİL DURUM BUTONU (PANIC MODE)
  const handleTogglePanicMode = async () => {
    if (!settings) return;
    setIsTogglingPanic(true);
    const nextMode = !settings.panicMode;
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, panicMode: nextMode }),
      });
      if (res.ok) {
        setSettings((prev: any) => ({ ...prev, panicMode: nextMode }));
        showNotify(
          "success",
          nextMode
            ? "🛡️ ZABITA KALKANI AKTİF: Fiyatlar ve sepet sitede anında gizlendi. Site resmi hobi proje sergisi moduna geçti."
            : "✓ Zabıta Kalkanı Devre Dışı: Standart mağaza moduna dönüldü."
        );
      }
    } catch {
      showNotify("error", "Kalkan modu değiştirilemedi.");
    } finally {
      setIsTogglingPanic(false);
    }
  };

  // 2. ÖZEL DOLAR KURU (USD/TRY) GÜNCELLEME
  const handleSaveUsdRate = async () => {
    const rate = parseFloat(usdRateInput);
    if (isNaN(rate) || rate <= 0) {
      showNotify("error", "Lütfen geçerli bir dolar kuru girin.");
      return;
    }
    setIsSavingUsdRate(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, usdRate: rate }),
      });
      if (res.ok) {
        setSettings((prev: any) => ({ ...prev, usdRate: rate }));
        showNotify("success", `✓ Dolar Kuru 1 USD = ${rate.toFixed(2)} ₺ olarak güncellendi.`);
      }
    } catch {
      showNotify("error", "Dolar kuru kaydedilemedi.");
    } finally {
      setIsSavingUsdRate(false);
    }
  };

  // 3. VIP RADAR: TOKEN İPTAL & KALICI SİLME
  const handleRevokeInvite = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/invites?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInvites((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "REVOKED" } : inv)));
        showNotify("success", "VIP token iptal edildi (REVOKED).");
      }
    } catch {
      showNotify("error", "Token iptal edilemedi.");
    }
  };

  const handleDeleteInvitePermanent = async (id: string) => {
    if (!window.confirm("Bu davetiye kaydını kalıcı olarak silmek istiyor musunuz?")) return;
    try {
      const res = await fetch(`/api/admin/invites?id=${id}&permanent=true`, { method: "DELETE" });
      if (res.ok) {
        setInvites((prev) => prev.filter((inv) => inv.id !== id));
        showNotify("success", "Davetiye kaydı silindi.");
      }
    } catch {
      showNotify("error", "Silme başarısız.");
    }
  };

  // 4. ŞÜPHELİ IP ENGELLEME / KALDIRMA
  const handleBlockIp = async (ip: string) => {
    if (!ip) return;
    const currentList: string[] = settings?.blockedIps || [];
    if (currentList.includes(ip)) {
      showNotify("error", "Bu IP adresi zaten engelli.");
      return;
    }
    const updatedList = [...currentList, ip];
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, blockedIps: updatedList }),
      });
      if (res.ok) {
        setSettings((prev: any) => ({ ...prev, blockedIps: updatedList }));
        showNotify("success", `🚫 ${ip} IP adresi başarıyla engellendi.`);
        setNewBlockIp("");
      }
    } catch {
      showNotify("error", "IP engellenemedi.");
    }
  };

  const handleUnblockIp = async (ip: string) => {
    const currentList: string[] = settings?.blockedIps || [];
    const updatedList = currentList.filter((item) => item !== ip);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, blockedIps: updatedList }),
      });
      if (res.ok) {
        setSettings((prev: any) => ({ ...prev, blockedIps: updatedList }));
        showNotify("success", `✓ ${ip} engeli kaldırıldı.`);
      }
    } catch {
      showNotify("error", "İşlem başarısız.");
    }
  };

  // 5. TOPLU ÜRÜN İÇE AKTARMA (CSV / EXCEL IMPORT)
  const handleImportProducts = async () => {
    if (!importCsvText.trim()) {
      showNotify("error", "Lütfen CSV verisi yapıştırın veya dosya seçin.");
      return;
    }
    setIsImporting(true);
    try {
      const lines = importCsvText.trim().split("\n");
      if (lines.length < 2) {
        showNotify("error", "Geçersiz CSV formatı: En az başlık ve 1 satır veri gereklidir.");
        setIsImporting(false);
        return;
      }
      const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
      const parsedProducts: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = line.split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
        const row: any = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx];
        });

        if (row.title && row.basePrice) {
          parsedProducts.push({
            title: row.title,
            basePrice: parseFloat(row.basePrice),
            salePrice: row.salePrice ? parseFloat(row.salePrice) : null,
            costPrice: row.costPrice ? parseFloat(row.costPrice) : null,
            stockQuantity: row.stockQuantity ? parseInt(row.stockQuantity, 10) : 10,
            shortDescription: row.shortDescription || null,
            sku: row.sku || null,
            isFeatured: row.isFeatured === "true" || row.isFeatured === "1",
          });
        }
      }

      if (parsedProducts.length === 0) {
        showNotify("error", "İçe aktarılacak geçerli ürün verisi bulunamadı.");
        setIsImporting(false);
        return;
      }

      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: parsedProducts }),
      });

      if (res.ok) {
        const data = await res.json();
        showNotify("success", `✓ ${data.message}`);
        setIsImportModalOpen(false);
        setImportCsvText("");
        refreshAllData();
      } else {
        showNotify("error", "Toplu yükleme sunucu tarafından reddedildi.");
      }
    } catch {
      showNotify("error", "Toplu içe aktarma başarısız.");
    } finally {
      setIsImporting(false);
    }
  };

  // 6. KRİTİK STOK TEDARİKÇİ SİPARİŞ LİSTESİ İNDİRME
  const handleExportLowStockSupplierCSV = () => {
    const lowStockList = products.filter((p) => p.stockQuantity <= (p.lowStockThreshold || 3));
    if (lowStockList.length === 0) {
      showNotify("success", "Tebrikler! Kritik seviyede ürününüz bulunmuyor.");
      return;
    }
    const headers = ["Ürün Kodu (SKU)", "Ürün Başlığı", "Kategori", "Mevcut Stok", "Kritik Eşik", "Önerilen Tedarik Adedi"];
    const rows = lowStockList.map((p) => [
      `"${p.sku || p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category?.name || "Kategorisiz"}"`,
      p.stockQuantity,
      p.lowStockThreshold || 3,
      Math.max(10, (p.lowStockThreshold || 3) * 3 - p.stockQuantity),
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tedarikci-siparis-listesi-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotify("success", `✓ ${lowStockList.length} adet kritik parça için tedarikçi sipariş listesi indirildi.`);
  };

  // 7. KATEGORİ OLUŞTURMA & SİLME
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    setIsCreatingCategory(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName,
          slug: newCatSlug || undefined,
          description: newCatDesc || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((prev) => [...prev, data.category]);
        setNewCatName("");
        setNewCatSlug("");
        setNewCatDesc("");
        showNotify("success", "✓ Kategori başarıyla eklendi.");
        refreshAllData();
      }
    } catch {
      showNotify("error", "Kategori eklenemedi.");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" kategorisini silmek istediğinizden emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showNotify("success", "Kategori silindi.");
        refreshAllData();
      }
    } catch {
      showNotify("error", "Kategori silinemedi.");
    }
  };

  // 8. ATÖLYE MONTAJ KANBANI & WHATSAPP ŞABLONLARI
  const handleSendWhatsAppTemplate = (order: any, stage: "CONFIRM" | "ASSEMBLING" | "TESTING" | "SHIPPED") => {
    const phone = order.customerPhone.replace(/[^0-9]/g, "");
    let message = "";
    if (stage === "CONFIRM") {
      message = `Merhaba Sayın ${order.customerName}, #${order.orderNumber} numaralı siparişiniz onaylandı! Atölyemizde parçalar montaj sırasına alındı. Bizi tercih ettiğiniz için teşekkür ederiz. - CIHANPOL RC ATÖLYESİ`;
    } else if (stage === "ASSEMBLING") {
      message = `Merhaba ${order.customerName}, #${order.orderNumber} siparişiniz şu an Cihan Usta'nın montaj masasında! Özel aks, şanzıman ve elektronik montajınız özenle yapılıyor.`;
    } else if (stage === "TESTING") {
      message = `Sayın ${order.customerName}, #${order.orderNumber} siparişinizin montajı bitti. Şu an kaya tırmanış parkurunda elektronik, servo ve süspansiyon test sürüşü yapılıyor!`;
    } else {
      message = `Müjde ${order.customerName}! #${order.orderNumber} siparişiniz testleri başarıyla geçti, özenle paketlendi ve kargoya verildi. Kargo takip kodunuz: ${order.trackingNumber || "Sistemde Güncelleniyor"}. Keyifli sürüşler dileriz!`;
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // 9. YORUM VE FOTOĞRAF ONAYLAMA
  const handleToggleReviewApproval = async (id: string, currentApproved: boolean) => {
    const nextState = !currentApproved;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: nextState }),
      });
      if (res.ok) {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: nextState } : r)));
        showNotify("success", nextState ? "✓ Yorum onaylandı ve vitrine alındı." : "Yorum onayı kaldırıldı.");
      }
    } catch {
      showNotify("error", "Yorum güncellenemedi.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        showNotify("success", "Yorum silindi.");
      }
    } catch {
      showNotify("error", "Yorum silinemedi.");
    }
  };

  // 10. 3D BASKI FİYATLANDIRMA & DURUM
  const handleUpdatePrintRequest = async (id: string, adminPrice: number, status: string) => {
    try {
      const res = await fetch("/api/modules/print3d", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminPrice, status }),
      });
      if (res.ok) {
        setPrintOrders((prev) => prev.map((p) => (p.id === id ? { ...p, adminPrice, status } : p)));
        showNotify("success", "✓ 3D Baskı talebi güncellendi.");
      }
    } catch {
      showNotify("error", "Güncelleme başarısız.");
    }
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

        <div className="flex items-center gap-2.5 sm:gap-4 text-xs">
          {/* Zabıta & Denetim Acil Durum Butonu */}
          <button
            onClick={handleTogglePanicMode}
            disabled={isTogglingPanic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all border cursor-pointer ${
              settings?.panicMode
                ? "bg-rose-600 text-white border-rose-500 shadow-md animate-pulse"
                : "bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:border-slate-600"
            }`}
            title="Zabıta / Denetim Acil Durum Kalkanı: Sitedeki tüm fiyatları ve sepeti tek tıkla gizler"
          >
            <ShieldAlert className={`w-4 h-4 ${settings?.panicMode ? "text-white" : "text-amber-400"}`} />
            <span className="hidden sm:inline">{settings?.panicMode ? "🛡️ KALKAN AKTİF" : "Zabıta Kalkanı"}</span>
          </button>

          {/* Manuel Dolar Kuru (USD/TRY) Hızlı Düzenleyici */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-lg shadow-2xs">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-slate-300 font-medium">USD:</span>
            <input
              type="number"
              step="0.1"
              value={usdRateInput}
              onChange={(e) => setUsdRateInput(e.target.value)}
              className="w-16 bg-slate-900 text-white font-mono text-xs px-1.5 py-0.5 rounded border border-slate-600 text-center focus:border-emerald-500 focus:outline-none"
              title="Sitede gösterilecek 1 Dolar = TL kuru"
            />
            <span className="text-[11px] text-slate-400">₺</span>
            <button
              onClick={handleSaveUsdRate}
              disabled={isSavingUsdRate}
              className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-0.5 rounded cursor-pointer transition-colors"
            >
              {isSavingUsdRate ? "..." : "Uygula"}
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#F27A1A]" />
            <span>Mağaza Vitrini</span>
          </Link>
          <div className="flex items-center gap-2 border-l border-slate-700/80 pl-3 sm:pl-4">
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

          {/* Kategori & Şasi Ölçeği Ağacı Sekmesi */}
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "categories"
                ? "bg-[#F27A1A] text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/60"
            }`}
          >
            <span className="flex items-center gap-3">
              <FolderTree className="w-4 h-4" />
              <span>Kategori & Ölçekler</span>
            </span>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "categories" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-800"
            }`}>
              {categories.length}
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

              {/* COGS & Net Kârlılık / Maliyet Muhasebesi Raporu (Özellik 14) */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">Ciro, Maliyet (COGS) & Net Kârlılık Analizi</h3>
                      <p className="text-[11px] text-slate-400">Atölye parça alış maliyeti vs. satış brüt kâr marjı dökümü</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Net Kâr Marjı: {reportData.profitMargin || "0%"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Toplam Satış Hacmi</span>
                    <span className="text-xl font-bold font-mono text-white mt-1 block">
                      {reportData.totalRevenue?.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Tahmini Parça Maliyeti (COGS)</span>
                    <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
                      {reportData.totalCost?.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Tahmini Brüt Kâr</span>
                    <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                      +{reportData.grossProfit?.toLocaleString("tr-TR")} ₺
                    </span>
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
                        <th className="py-2.5 px-3">Kullanım / IP Radarı</th>
                        <th className="py-2.5 px-3">Oluşturulma</th>
                        <th className="py-2.5 px-3 text-right">İşlemler</th>
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
                              {inv.status === "ACTIVE" ? "Aktif" : inv.status === "USED" ? "Kullanıldı" : "İptal Edildi"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                            {inv.usedAt ? (
                              <div>
                                <span className="font-semibold text-slate-800 block">
                                  {new Date(inv.usedAt).toLocaleString("tr-TR")}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200 mt-0.5">
                                  📡 {inv.usedByIp || "Bilinmiyor"}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400">Giriş Yapılmadı</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">
                            {new Date(inv.createdAt).toLocaleDateString("tr-TR")}
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                            {inv.usedByIp && !(settings?.blockedIps || []).includes(inv.usedByIp) && (
                              <button
                                type="button"
                                onClick={() => handleBlockIp(inv.usedByIp)}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold rounded cursor-pointer transition-colors"
                                title={`${inv.usedByIp} adresini engelle`}
                              >
                                🚫 IP Engelle
                              </button>
                            )}
                            {inv.status === "ACTIVE" && (
                              <button
                                type="button"
                                onClick={() => handleRevokeInvite(inv.id)}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold rounded cursor-pointer transition-colors"
                                title="Tokenı derhal iptal et"
                              >
                                İptal Et
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteInvitePermanent(inv.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                              title="Kaydı Kalıcı Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Engellenen Şüpheli IP Listesi Kartı */}
                <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span>Engellenen Şüpheli IP Listesi ({settings?.blockedIps?.length || 0})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Bu IP adreslerinden gelen tüm istekler ve sepet işlemleri güvenlik duvarı tarafından engellenir.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Örn: 192.168.1.1"
                        value={newBlockIp}
                        onChange={(e) => setNewBlockIp(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:border-rose-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleBlockIp(newBlockIp)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Engelle
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(settings?.blockedIps || []).length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic">Şu anda engelli IP adresi bulunmuyor.</span>
                    ) : (
                      (settings?.blockedIps || []).map((ip: string) => (
                        <span
                          key={ip}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-bold rounded-lg"
                        >
                          <span>{ip}</span>
                          <button
                            onClick={() => handleUnblockIp(ip)}
                            className="text-rose-500 hover:text-rose-700 ml-1 font-bold cursor-pointer"
                            title="Engeli Kaldır"
                          >
                            ✕
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SİPARİŞLER (ORDERS & RECEIPT APPROVAL) */}
          {activeTab === "orders" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                    Sipariş Yönetimi & Atölye Montaj Takibi
                  </h2>
                  <p className="text-[11px] text-slate-500">Müşteri sipariş durumları, dekont doğrulama ve 5 aşamalı atölye kanbanı</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setOrderViewMode("table")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        orderViewMode === "table"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      📋 Liste Görünümü
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderViewMode("kanban")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                        orderViewMode === "kanban"
                          ? "bg-[#F27A1A] text-white shadow-2xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Kanban className="w-3.5 h-3.5" />
                      <span>Atölye Kanbanı (5 Aşama)</span>
                    </button>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-2 rounded-xl border border-slate-200">
                    {orders.length} Sipariş
                  </span>
                </div>
              </div>

              {orderViewMode === "kanban" ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                  {[
                    { key: "PENDING_PAYMENT", label: "1. Sipariş Alındı", color: "border-amber-400 bg-amber-50/50 text-amber-900" },
                    { key: "PROCESSING", label: "2. Parça Toplama", color: "border-blue-400 bg-blue-50/50 text-blue-900" },
                    { key: "ASSEMBLING", label: "3. Montaj Masasında", color: "border-purple-400 bg-purple-50/50 text-purple-900" },
                    { key: "TESTING", label: "4. Parkur Testinde", color: "border-orange-400 bg-orange-50/50 text-orange-900" },
                    { key: "COMPLETED", label: "5. Kargolandı", color: "border-emerald-400 bg-emerald-50/50 text-emerald-900" },
                  ].map((col) => {
                    const colOrders = orders.filter((o) => {
                      if (col.key === "PENDING_PAYMENT") return o.status === "PENDING_PAYMENT" || o.status === "PENDING";
                      if (col.key === "PROCESSING") return o.status === "PROCESSING";
                      if (col.key === "ASSEMBLING") return o.status === "ASSEMBLING";
                      if (col.key === "TESTING") return o.status === "TESTING";
                      if (col.key === "COMPLETED") return o.status === "SHIPPED" || o.status === "COMPLETED";
                      return false;
                    });

                    return (
                      <div key={col.key} className="flex flex-col bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 min-h-[480px]">
                        <div className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-between mb-3 shadow-2xs ${col.color}`}>
                          <span>{col.label}</span>
                          <span className="font-mono px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-slate-800">
                            {colOrders.length}
                          </span>
                        </div>

                        <div className="space-y-2.5 flex-1 overflow-y-auto">
                          {colOrders.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-[11px] italic">Bu aşamada sipariş yok</div>
                          ) : (
                            colOrders.map((ord) => (
                              <div key={ord.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2 hover:border-[#F27A1A]/70 transition-all">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-xs font-bold text-slate-900">{ord.orderNumber}</span>
                                  <span className="font-mono text-[11px] font-black text-[#F27A1A]">
                                    {ord.total.toLocaleString("tr-TR")} ₺
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-slate-800 leading-tight">{ord.customerName}</p>
                                <p className="text-[10px] text-slate-500 font-mono">{ord.customerPhone}</p>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                                  {col.key !== "PENDING_PAYMENT" && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const prevStatus = col.key === "COMPLETED" ? "TESTING" : col.key === "TESTING" ? "ASSEMBLING" : col.key === "ASSEMBLING" ? "PROCESSING" : "PENDING_PAYMENT";
                                        handleUpdateOrderStatus(ord.id, prevStatus);
                                      }}
                                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                                      title="Önceki Aşamaya Al"
                                    >
                                      ◀
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleSendWhatsAppTemplate(ord, col.key === "PENDING_PAYMENT" ? "CONFIRM" : col.key === "PROCESSING" ? "CONFIRM" : col.key === "ASSEMBLING" ? "ASSEMBLING" : col.key === "TESTING" ? "TESTING" : "SHIPPED")}
                                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer flex-1 justify-center"
                                  >
                                    <MessageCircle className="w-3 h-3 text-[#25D366]" />
                                    <span>WhatsApp</span>
                                  </button>
                                  {col.key !== "COMPLETED" && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextStatus = col.key === "PENDING_PAYMENT" ? "PROCESSING" : col.key === "PROCESSING" ? "ASSEMBLING" : col.key === "ASSEMBLING" ? "TESTING" : "COMPLETED";
                                        handleUpdateOrderStatus(ord.id, nextStatus);
                                      }}
                                      className="p-1.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                      title="Sonraki Aşamaya İlerlet"
                                    >
                                      ▶
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
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
                          <button
                            type="button"
                            onClick={() => handleSendWhatsAppTemplate(ord, "CONFIRM")}
                            className="px-3 py-1 text-[11px] bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-900 border border-emerald-300 font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>✓ Onay Mesajı</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendWhatsAppTemplate(ord, "ASSEMBLING")}
                            className="px-3 py-1 text-[11px] bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-900 border border-emerald-300 font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>🛠️ Montajda Mesajı</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendWhatsAppTemplate(ord, "SHIPPED")}
                            className="px-3 py-1 text-[11px] bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-900 border border-emerald-300 font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>📦 Kargolandı Mesajı</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
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
                {/* 0. ACİL DURUM ZABITA & VERGİ KALKANI (PANIC MODE) */}
                <div className={`p-6 rounded-2xl border transition-all ${
                  settings.panicMode
                    ? "bg-rose-50/80 border-rose-300 ring-2 ring-rose-200"
                    : "bg-white border-slate-200/80 shadow-xs"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className={`w-5 h-5 ${settings.panicMode ? "text-rose-600 animate-pulse" : "text-slate-400"}`} />
                        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                          Acil Zabıta & Denetim Kalkanı (Panic Shield Switch)
                        </h3>
                        {settings.panicMode && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold">
                            KALKAN AKTİF
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                        Bu anahtarı açtığınız anda: Sitedeki tüm fiyatlar, sepete ekleme butonları, sepet çekmecesi ve VIP giriş linkleri derhal yok edilir.
                        Site resmi <em>&quot;T.C. Hobi ve Modelleme Proje Sergisi / Arşivi&quot;</em> kurumsal kamuflajına bürünür ve hiçbir ticari faaliyet izi bırakmaz.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleTogglePanicMode}
                      disabled={isTogglingPanic}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer ${
                        settings.panicMode
                          ? "bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-300"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {settings.panicMode ? "Kalkanı Kapat (Normale Dön)" : "Kalkanı Aç (Acil Kamuflaj)"}
                    </button>
                  </div>
                </div>

                {/* 0.5 MANUEL DOLAR KURU (USD/TRY) YÖNETİMİ */}
                <div className="p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span>Manuel Dolar Kuru (USD/TRY Belirleme)</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Sitedeki tüm ürünlerin altında TL fiyatının yanında yaklaşık Dolar karşılığı gösterilir.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={usdRateInput}
                          onChange={(e) => setUsdRateInput(e.target.value)}
                          className="w-28 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono text-slate-900 font-bold focus:border-[#F27A1A] focus:outline-none text-right pr-7"
                        />
                        <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">₺</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveUsdRate}
                        disabled={isSavingUsdRate}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                      >
                        {isSavingUsdRate ? "Kaydediliyor..." : "Kuru Kaydet"}
                      </button>
                    </div>
                  </div>
                </div>

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
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                    Ürün & Envanter Yönetimi
                  </h2>
                  <p className="text-[11px] text-slate-500">Katalog ürünlerini düzenleyin, stokları güncelleyin, toplu içe aktarın veya tedarik listesi alın</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Kritik Stok Filtresi Butonu */}
                  <button
                    type="button"
                    onClick={() => setShowOnlyLowStock(!showOnlyLowStock)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      showOnlyLowStock
                        ? "bg-rose-600 text-white border-rose-500 shadow-2xs"
                        : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200/80"
                    }`}
                  >
                    <AlertTriangle className={`w-3.5 h-3.5 ${showOnlyLowStock ? "text-white" : "text-amber-600"}`} />
                    <span>Kritik Stoklar (≤3)</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      showOnlyLowStock ? "bg-white text-rose-700" : "bg-rose-600 text-white"
                    }`}>
                      {products.filter((p) => p.stockQuantity <= (p.lowStockThreshold || 3)).length}
                    </span>
                  </button>

                  {/* Tedarikçi Sipariş Listesi CSV İndir */}
                  <button
                    type="button"
                    onClick={handleExportLowStockSupplierCSV}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title="Kritik parçaları tedarikçi sipariş formu olarak indir"
                  >
                    <Truck className="w-3.5 h-3.5 text-rose-600" />
                    <span>Tedarikçi Formu</span>
                  </button>

                  {/* Toplu Ürün İçe Aktarma (CSV) */}
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(true)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                    <span>Toplu Yükle (CSV)</span>
                  </button>

                  {/* CSV / Excel Dışa Aktar */}
                  <button
                    type="button"
                    onClick={handleExportProductsCSV}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Tüm ürünleri Excel uyumlu CSV olarak dışa aktar"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Excel İndir</span>
                  </button>

                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200">
                    {products.length} Ürün
                  </span>
                </div>
              </div>

              {/* Arama / Filtreleme Çubuğu */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ürün adı, slug, kategori veya model uyumluluğuna göre ara..."
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
                    if (showOnlyLowStock && p.stockQuantity > (p.lowStockThreshold || 3)) {
                      return false;
                    }
                    if (!productSearchTerm) return true;
                    const term = productSearchTerm.toLowerCase();
                    return (
                      p.title?.toLowerCase().includes(term) ||
                      p.slug?.toLowerCase().includes(term) ||
                      p.category?.name?.toLowerCase().includes(term) ||
                      (p.compatibleModels && p.compatibleModels.toLowerCase().includes(term))
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
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-sans text-sm font-bold text-slate-900">{p.title}</h4>
                            {p.isFeatured && (
                              <span className="text-[9px] bg-orange-100 text-[#F27A1A] font-bold px-1.5 py-0.5 rounded">
                                Öne Çıkan
                              </span>
                            )}
                            {p.stockQuantity <= (p.lowStockThreshold || 3) && (
                              <span className="text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded border border-rose-200">
                                Kritik Stok
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mt-0.5">
                            <span>{p.category?.name || "Kategorisiz"}</span>
                            {p.compatibleModels && (
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200 font-mono">
                                Uyumlu: {p.compatibleModels}
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-xs font-black text-[#F27A1A] mt-0.5">
                            {p.basePrice.toLocaleString("tr-TR")} ₺{" "}
                            {p.salePrice && (
                              <span className="line-through text-slate-400 font-normal ml-1">
                                {p.salePrice.toLocaleString("tr-TR")} ₺
                              </span>
                            )}
                            {p.costPrice && (
                              <span className="text-slate-400 font-normal font-mono ml-2">
                                (Maliyet: {p.costPrice.toLocaleString("tr-TR")} ₺)
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

          {/* YENİ TAB: KATEGORİ & ŞASİ ÖLÇEĞİ AĞAÇ YÖNETİCİSİ (CATEGORIES) */}
          {activeTab === "categories" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900">
                    Kategori & Şasi Ölçeği Ağaç Yöneticisi
                  </h2>
                  <p className="text-[11px] text-slate-500">Ürün kategorilerini, şasi ölçeklerini ve hiyerarşik vitrin sıralamasını yönetin</p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200">
                  {categories.length} Kategori
                </span>
              </div>

              {/* Yeni Kategori Ekleme Formu */}
              <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#F27A1A]" />
                  <span>Yeni Kategori / Ölçek Tanımla</span>
                </h3>

                <form onSubmit={handleCreateCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Kategori Adı *
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Portal Aks & Diferansiyel"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#F27A1A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Slug (URL Bağlantısı - Opsiyonel)
                    </label>
                    <input
                      type="text"
                      placeholder="portal-aks-diferansiyel"
                      value={newCatSlug}
                      onChange={(e) => setNewCatSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-mono focus:border-[#F27A1A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Kısa Açıklama (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      placeholder="CNC pirinç ve alüminyum akslar"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#F27A1A] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-1">
                    <button
                      type="submit"
                      disabled={isCreatingCategory}
                      className="px-6 py-2.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isCreatingCategory ? "Ekleniyor..." : "Kategoriyi Kaydet"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Kategori Listesi */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200/80 text-slate-500 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">Kategori Adı</th>
                      <th className="py-2.5 px-3">Slug (Bağlantı)</th>
                      <th className="py-2.5 px-3">Açıklama</th>
                      <th className="py-2.5 px-3 text-center">Bağlı Ürün</th>
                      <th className="py-2.5 px-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                          Henüz kategori eklenmedi.
                        </td>
                      </tr>
                    ) : (
                      categories.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                          <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">/{c.slug}</td>
                          <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{c.description || "-"}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#F27A1A] font-bold text-[11px]">
                              {c._count?.products ?? 0}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(c.id, c.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Kategoriyi Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                t.status === "REJECTED" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                "bg-amber-50 text-amber-800 border border-amber-200/60"
                              }`}>
                                {t.status || "BEKLEMEDE"}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
                                {t.condition}
                              </span>
                            </div>
                            <p className="text-slate-700">Mevcut Şasi: <strong className="text-slate-900">{t.currentChassis}</strong></p>
                            <p className="text-slate-500 text-[11px]">
                              İstenen Yeni Ürün: <span className="font-semibold text-slate-700">{t.desiredProduct || "-"}</span> • Müşteri Beklentisi: <span className="font-bold text-[#F27A1A]">{t.expectedPrice ? `${t.expectedPrice.toLocaleString("tr-TR")} ₺` : "-"}</span>
                              {t.adminOfferPrice && (
                                <span className="ml-2 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                  Teklifimiz: {t.adminOfferPrice.toLocaleString("tr-TR")} ₺
                                </span>
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <a
                              href={`https://wa.me/${t.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Merhaba ${t.customerName}, CIHANPOL atölyesinden ${t.currentChassis} şasinizin takas ekspertiz değerlendirmesi için yazıyoruz.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg flex items-center gap-1.5 text-xs shadow-xs transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <button
                              onClick={() => {
                                const offer = prompt("Takas teklif tutarını (TL) girin:", t.adminOfferPrice?.toString() || "");
                                if (offer !== null) {
                                  handleUpdateTradeStatus(t.id, "ACCEPTED", Number(offer) || undefined);
                                }
                              }}
                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                            >
                              Teklif Ver & Onayla
                            </button>
                            <button
                              onClick={() => handleUpdateTradeStatus(t.id, "REJECTED")}
                              className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              Reddet
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
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                p.status === "PRINTING" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" :
                                p.status === "PRICED" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                                "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}>
                                {p.status || "BEKLEMEDE"}
                              </span>
                            </div>
                            <p className="text-slate-700">Müşteri: <span className="font-semibold text-slate-900">{p.customerName}</span> <span className="text-slate-500 font-mono">({p.phone})</span></p>
                            {p.notes && <p className="text-slate-500 text-[11px] leading-relaxed">Notlar: {p.notes}</p>}
                            {p.adminPrice && (
                              <p className="text-emerald-700 font-bold text-xs">
                                Belirlenen Baskı Fiyatı: {p.adminPrice.toLocaleString("tr-TR")} ₺
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
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
                            <button
                              onClick={() => {
                                const pr = prompt("Bu 3D baskı için teklif fiyatını (TL) girin:", p.adminPrice?.toString() || "");
                                if (pr !== null) {
                                  handleUpdatePrintRequest(p.id, Number(pr), "PRICED");
                                }
                              }}
                              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                            >
                              Fiyat Belirle
                            </button>
                            <button
                              onClick={() => handleUpdatePrintRequest(p.id, p.adminPrice || 0, "PRINTING")}
                              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                            >
                              Baskıya Al
                            </button>
                            <button
                              onClick={() => handleUpdatePrintRequest(p.id, p.adminPrice || 0, "COMPLETED")}
                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                            >
                              Tamamlandı
                            </button>
                            <a
                              href={`https://wa.me/${p.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Merhaba ${p.customerName}, 3D baskı projeniz (${p.projectTitle}) için baskı süresi ve ${p.adminPrice ? `${p.adminPrice} TL tutarındaki ` : ""}fiyat teklifimiz hazırdır.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg flex items-center gap-1.5 text-xs shadow-xs transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Taban Fiyat (TL)
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
                    İndirimli Fiyat (TL)
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
                    Alış Maliyeti / COGS (TL)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    placeholder="Maliyet"
                    value={editingProduct.costPrice ?? ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: e.target.value ? Number(e.target.value) : null })}
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
                  Uyumlu Crawler / Şasi Modelleri (Virgülle ayırarak yazın)
                </label>
                <input
                  type="text"
                  placeholder="Örn: TRX-4, SCX10 III, SCX24, CC-01, Enduro"
                  value={
                    typeof editingProduct.compatibleModels === "string" && editingProduct.compatibleModels.startsWith("[")
                      ? (() => {
                          try {
                            return JSON.parse(editingProduct.compatibleModels).join(", ");
                          } catch {
                            return editingProduct.compatibleModels;
                          }
                        })()
                      : (editingProduct.compatibleModels || "")
                  }
                  onChange={(e) => setEditingProduct({ ...editingProduct, compatibleModels: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-medium text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Müşteri vitrinde şasi filtrelediğinde yeşil uyumluluk rozeti gösterilir.
                </p>
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

      {/* TOPLU ÜRÜN İÇE AKTARMA MODALI (CSV / EXCEL) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Başlık */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F27A1A] border border-orange-100 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Toplu Ürün Yükleme (CSV / Excel)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    CSV formatında ürünlerinizi tek seferde içe aktarın veya güncelleyin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Şablon İndirme ve Bilgi */}
            <div className="p-4 bg-orange-50/60 border border-orange-200/70 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-[#F27A1A]" />
                  Örnek CSV Sütun Formatı
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const sample = "title,basePrice,salePrice,costPrice,stockQuantity,shortDescription,sku,isFeatured\nTraxxas TRX-4 Defender 1/10 Crawler,32500,29900,21000,5,Profesyonel 1/10 ölçekli lisanslı crawler,TRX4-DEF-01,true\nAxial SCX10 III Jeep Gladiator,28500,26500,18000,8,Portal akslı yüksek performanslı kit,AX-SCX10-GLAD,false";
                    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "ornek_urun_sablonu.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-orange-100 text-[#F27A1A] border border-orange-200 rounded-lg text-[11px] font-bold shadow-2xs cursor-pointer transition-colors"
                >
                  Örnek Şablonu İndir (.csv)
                </button>
              </div>
              <p className="text-[11px] text-orange-900/80 leading-relaxed font-mono">
                title, basePrice, salePrice, costPrice, stockQuantity, shortDescription, sku, isFeatured
              </p>
            </div>

            {/* Dosya Seçici */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                CSV Dosyası Seç
              </label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setImportCsvText(event.target?.result as string || "");
                    };
                    reader.readAsText(file, "UTF-8");
                  }
                }}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#F27A1A] hover:file:bg-orange-100 cursor-pointer border border-slate-200 rounded-xl p-1"
              />
            </div>

            {/* CSV Metin Alanı */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Veya CSV Verisini Buraya Yapıştırın
              </label>
              <textarea
                rows={6}
                value={importCsvText}
                onChange={(e) => setImportCsvText(e.target.value)}
                placeholder={`title,basePrice,salePrice,costPrice,stockQuantity,shortDescription,sku,isFeatured\n"Traxxas TRX-4",32500,29900,21000,5,"1/10 Crawler","TRX4",true`}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] focus:bg-white font-mono text-slate-800 leading-relaxed resize-y"
              />
            </div>

            {/* Aksiyon Butonları */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleImportProducts}
                disabled={isImporting || !importCsvText.trim()}
                className="px-6 py-2.5 bg-[#F27A1A] hover:bg-[#E06A0A] active:bg-[#C85B03] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isImporting ? <span>İçe Aktarılıyor...</span> : <span>Toplu Ürünleri Yükle & Kaydet</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
