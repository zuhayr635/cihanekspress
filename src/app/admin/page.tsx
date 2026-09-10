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
  ShieldCheck,
  Flame,
  FileText,
  Play,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { formatWhatsAppNumber, getWhatsAppUrl } from "@/lib/whatsapp";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "settings" | "invites" | "products" | "categories" | "orders" | "coupons" | "reviews" | "modules" | "stealth"
  >("dashboard");

  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{ name: string; username: string } | null>(null);

  // 5 Gizli IBAN & Stealth Kasası Yönetimi
  const [ibansList, setIbansList] = useState<any[]>([]);
  const [isIbanModalOpen, setIsIbanModalOpen] = useState(false);
  const [newIbanBank, setNewIbanBank] = useState("");
  const [newIbanHolder, setNewIbanHolder] = useState("");
  const [newIbanNumber, setNewIbanNumber] = useState("");
  const [newIbanDailyLimit, setNewIbanDailyLimit] = useState<number>(75000);
  const [newIbanDailyOrders, setNewIbanDailyOrders] = useState<number>(15);
  const [newIbanPriority, setNewIbanPriority] = useState<number>(0);
  const [newIbanNotes, setNewIbanNotes] = useState("");
  const [isSavingIban, setIsSavingIban] = useState(false);

  // Stealth Operasyon Ayarları (Local UI State)
  const [stealthKurusEnabled, setStealthKurusEnabled] = useState(true);
  const [stealthBurnerTimeout, setStealthBurnerTimeout] = useState(15);
  const [stealthCamouflageEnabled, setStealthCamouflageEnabled] = useState(true);
  const [stealthServiceTitle, setStealthServiceTitle] = useState("3D CAD Çizim ve Teknik Modelleme Hizmet Bedeli");
  const [stealthSafeMemos, setStealthSafeMemos] = useState<string[]>([
    "Teknik Danışmanlık Hizmet Bedeli",
    "3D CAD Modelleme",
    "Emanet İadesi",
    "Yazılım ve Tasarım Desteği",
    "Proje Çizim Bedeli",
  ]);
  const [newSafeMemoInput, setNewSafeMemoInput] = useState("");
  const [stealthHoneypotEnabled, setStealthHoneypotEnabled] = useState(true);
  const [stealthHoneypotMode, setStealthHoneypotMode] = useState("MAINTENANCE");
  const [stealthHoneypotMessage, setStealthHoneypotMessage] = useState(
    "Sistem Bakımı: Bankacılık API entegrasyonumuzda altyapı çalışması yapılmaktadır. Lütfen daha sonra tekrar deneyiniz."
  );
  const [isSavingStealthSettings, setIsSavingStealthSettings] = useState(false);

  // Veriler
  const [reportData, setReportData] = useState<any>({
    totalRevenue: 0,
    totalCost: 0,
    grossProfit: 0,
    profitMargin: "0%",
    totalOrders: 0,
    pendingBankTransfers: 0,
    activeProductsCount: 0,
    lowStockProducts: [],
    totalInvites: 0,
    usedInvites: 0,
    ordersWithInvite: 0,
    conversionRate: "0%",
    recentOrders: [],
  });
  const [settings, setSettings] = useState<any>({
    id: "default",
    storeName: "CIHANPOL RC CRAWLER LAB",
    storeTagline: "Özel Yapım Kaya Tırmanıcılar & CNC Performans Parçaları",
    storeMode: "CATALOG_ONLY",
    logoUrl: "/cihanekspress-logo.png",
    headerBrandMode: "BOTH",
    headerPrimaryText: "cihan",
    headerSecondaryText: "ekspress",
    headerSuffixText: ".com",
    showHeaderSubtitle: true,
    headerSubtitle: "RC SCALE CRAWLER ATÖLYE SERGİ KATALOĞU",
    logoHeight: 48,
    currency: "TL",
    currencySymbol: "₺",
    taxRate: 20,
    pricesIncludeTax: true,
    freeShippingThreshold: 2000,
    defaultShippingFee: 95,
    bankTransferEnabled: true,
    bankAccounts: [],
    whatsappOrderEnabled: true,
    whatsappPhone: "+905551234567",
    whatsappMessageTemplate: "",
    creditCardEnabled: true,
    creditCardProvider: "paytr",
    ccApiKey: "",
    ccSecretKey: "",
    ccMerchantId: "",
    ccTestMode: true,
    panicMode: false,
    usdRate: 38.5,
    blockedIps: [],
    kuruEslestirmeEnabled: true,
    burnerTimeoutMinutes: 15,
    stealthCamouflageEnabled: true,
    stealthServiceTitle: "3D CAD Çizim ve Teknik Danışmanlık Hizmet Bedeli",
    safeMemos: [
      "Teknik Danışmanlık Hizmet Bedeli",
      "3D CAD Modelleme",
      "Emanet İadesi",
      "Yazılım ve Tasarım Desteği",
      "Proje Çizim Bedeli",
    ],
    honeypotEnabled: true,
    honeypotMode: "MAINTENANCE",
    honeypotMessage: "Sistem Bakımı: Bankacılık API entegrasyonumuzda altyapı çalışması yapılmaktadır.",
  });
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
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
      const endpoints = [
        { key: "reports", url: "/api/admin/reports" },
        { key: "settings", url: "/api/settings" },
        { key: "invites", url: "/api/admin/invites" },
        { key: "products", url: "/api/products" },
        { key: "orders", url: "/api/orders" },
        { key: "coupons", url: "/api/admin/coupons" },
        { key: "reviews", url: "/api/admin/reviews" },
        { key: "modules", url: "/api/admin/modules" },
        { key: "b2b", url: "/api/modules/b2b" },
        { key: "trade", url: "/api/modules/trade-in" },
        { key: "print", url: "/api/modules/print3d" },
        { key: "categories", url: "/api/admin/categories" },
        { key: "ibans", url: "/api/admin/ibans" },
      ];

      const settled = await Promise.allSettled(
        endpoints.map(async (ep) => {
          const res = await fetch(ep.url);
          if (!res.ok) throw new Error(`HTTP ${res.status} on ${ep.url}`);
          const data = await res.json();
          return { key: ep.key, data };
        })
      );

      for (const item of settled) {
        if (item.status === "fulfilled") {
          const { key, data } = item.value;
          if (key === "reports" && data && !data.error) {
            setReportData(data);
          } else if (key === "settings" && data && !data.error) {
            setSettings((prev: any) => ({ ...prev, ...data }));
            if (data.usdRate) setUsdRateInput(String(data.usdRate));
            if (data.kuruEslestirmeEnabled !== undefined) setStealthKurusEnabled(Boolean(data.kuruEslestirmeEnabled));
            if (data.burnerTimeoutMinutes !== undefined) setStealthBurnerTimeout(Number(data.burnerTimeoutMinutes));
            if (data.stealthCamouflageEnabled !== undefined) setStealthCamouflageEnabled(Boolean(data.stealthCamouflageEnabled));
            if (data.stealthServiceTitle) setStealthServiceTitle(data.stealthServiceTitle);
            if (Array.isArray(data.safeMemos)) setStealthSafeMemos(data.safeMemos);
            if (data.honeypotEnabled !== undefined) setStealthHoneypotEnabled(Boolean(data.honeypotEnabled));
            if (data.honeypotMode) setStealthHoneypotMode(data.honeypotMode);
            if (data.honeypotMessage) setStealthHoneypotMessage(data.honeypotMessage);
          } else if (key === "invites") {
            setInvites(data.invites || []);
          } else if (key === "products") {
            setProducts(data.products || []);
          } else if (key === "categories") {
            setCategories(data.categories || []);
          } else if (key === "orders") {
            setOrders(data.orders || []);
          } else if (key === "coupons") {
            setCoupons(data.coupons || []);
          } else if (key === "reviews") {
            setReviews(data.reviews || []);
          } else if (key === "modules") {
            setModulesList(data.modules || []);
          } else if (key === "b2b") {
            setB2bQuotes(data.quotes || []);
          } else if (key === "trade") {
            setTradeIns(data.tradeIns || []);
          } else if (key === "print") {
            setPrintOrders(data.requests || []);
          } else if (key === "ibans") {
            setIbansList(data.ibans || []);
          }
        } else {
          console.warn("Endpoint failed in refreshAllData:", item.reason);
        }
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

  // Veritabanı Yedekleme & Geri Yükleme
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);
  const restoreFileRef = React.useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    window.location.href = "/api/admin/backup";
  };

  const handleRestoreBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm("Seçilen yedek veritabanına aktarılacak ve mevcut veriler güncellenecektir. Onaylıyor musunuz?")) {
      if (restoreFileRef.current) restoreFileRef.current.value = "";
      return;
    }
    setIsRestoringBackup(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const result = await res.json();
      if (res.ok) {
        showNotify("success", result.message || "Yedek başarıyla geri yüklendi!");
        refreshAllData();
      } else {
        showNotify("error", "Geri yükleme başarısız: " + (result.error || "Bilinmeyen hata"));
      }
    } catch (err: any) {
      showNotify("error", "Geçersiz yedek dosyası: " + err.message);
    } finally {
      setIsRestoringBackup(false);
      if (restoreFileRef.current) restoreFileRef.current.value = "";
    }
  };

  const handleUploadImageFile = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
      showNotify("error", data.error || "Görsel yüklenemedi.");
      return null;
    } catch {
      showNotify("error", "Görsel yükleme hatası.");
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Ürün Ekleme & Düzenleme Kaydet (Görseller, Video ve Fotoğraflı Varyasyonlar Dahil)
  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSavingProduct(true);
    try {
      const isNew = !editingProduct.id;
      const url = "/api/admin/products";
      const method = isNew ? "POST" : "PUT";

      let rawImages = editingProduct.images;
      if (typeof rawImages === "string") {
        try {
          rawImages = JSON.parse(rawImages);
        } catch {
          rawImages = rawImages ? [rawImages] : [];
        }
      }

      const payload: any = {
        title: editingProduct.title,
        description: editingProduct.description || "",
        shortDescription: editingProduct.shortDescription || null,
        basePrice: Number(editingProduct.basePrice),
        priceUsd: editingProduct.priceUsd ? Number(editingProduct.priceUsd) : null,
        salePrice: editingProduct.salePrice ? Number(editingProduct.salePrice) : null,
        salePriceUsd: editingProduct.salePriceUsd ? Number(editingProduct.salePriceUsd) : null,
        costPrice: editingProduct.costPrice ? Number(editingProduct.costPrice) : null,
        costPriceUsd: editingProduct.costPriceUsd ? Number(editingProduct.costPriceUsd) : null,
        compatibleModels: typeof editingProduct.compatibleModels === "string" && !editingProduct.compatibleModels.trim().startsWith("[")
          ? JSON.stringify(editingProduct.compatibleModels.split(",").map((s: string) => s.trim()).filter(Boolean))
          : editingProduct.compatibleModels,
        stockQuantity: Number(editingProduct.stockQuantity),
        sku: editingProduct.sku || null,
        isFeatured: Boolean(editingProduct.isFeatured),
        categoryId: editingProduct.categoryId || null,
        images: Array.isArray(rawImages) ? rawImages : [],
        videoUrl: editingProduct.videoUrl || null,
        variants: Array.isArray(editingProduct.variants) ? editingProduct.variants : [],
      };

      if (!isNew) {
        payload.id = editingProduct.id;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showNotify("success", isNew ? `"${editingProduct.title}" başarıyla oluşturuldu!` : `"${editingProduct.title}" başarıyla güncellendi!`);
        setEditingProduct(null);
        refreshAllData();
      } else {
        showNotify("error", data.error || "İşlem gerçekleştirilemedi.");
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
      const data = await res.json();
      if (res.ok) {
        setSettings((prev: any) => ({ ...prev, usdRate: rate }));
        showNotify("success", `✓ Dolar Kuru 1 USD = ${rate.toFixed(2)} ₺ olarak kaydedildi. Tüm ürünlerin TL fiyatları otomatik endekslendi! (${data.syncedProducts ?? "tüm"} ürün güncellendi)`);
        refreshAllData();
      } else {
        showNotify("error", data.error || "Dolar kuru kaydedilemedi.");
      }
    } catch {
      showNotify("error", "Dolar kuru kaydedilemedi.");
    } finally {
      setIsSavingUsdRate(false);
    }
  };

  // 2.5. WHATSAPP HATTI GÜNCELLEME (TÜM SİTEDE ENDEKSLİ)
  const [isSavingWhatsApp, setIsSavingWhatsApp] = useState(false);
  const handleSaveWhatsAppPhone = async (phoneToSave?: string) => {
    const rawPhone = phoneToSave !== undefined ? phoneToSave : (settings?.whatsappPhone || "");
    const formatted = formatWhatsAppNumber(rawPhone);
    setIsSavingWhatsApp(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, whatsappPhone: rawPhone }),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings((prev: any) => ({ ...prev, whatsappPhone: rawPhone }));
        showNotify(
          "success",
          `✓ WhatsApp Danışma Hattı güncellendi! Sitedeki tüm butonlar ve sayfalar wa.me/${formatted} numarasına bağlandı.`
        );
        refreshAllData();
      } else {
        showNotify("error", data.error || "WhatsApp numarası kaydedilemedi.");
      }
    } catch {
      showNotify("error", "WhatsApp numarası kaydedilemedi.");
    } finally {
      setIsSavingWhatsApp(false);
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
  const handleSendWhatsAppTemplate = (order: any, stage: "CONFIRM" | "ASSEMBLING" | "TESTING" | "SHIPPED" | "DELIVERED") => {
    const phone = order.customerPhone.replace(/[^0-9]/g, "");
    let message = "";
    if (stage === "CONFIRM") {
      message = `Merhaba Sayın ${order.customerName}, #${order.orderNumber} numaralı siparişiniz onaylandı! Atölyemizde parçalar montaj sırasına alındı. Bizi tercih ettiğiniz için teşekkür ederiz. - CIHANPOL RC ATÖLYESİ`;
    } else if (stage === "ASSEMBLING") {
      message = `Merhaba ${order.customerName}, #${order.orderNumber} siparişiniz şu an Cihan Usta'nın montaj masasında! Özel aks, şanzıman ve elektronik montajınız özenle yapılıyor.`;
    } else if (stage === "TESTING") {
      message = `Sayın ${order.customerName}, #${order.orderNumber} siparişinizin montajı bitti. Şu an kaya tırmanış parkurunda elektronik, servo ve süspansiyon test sürüşü yapılıyor!`;
    } else if (stage === "SHIPPED") {
      message = `Müjde ${order.customerName}! #${order.orderNumber} siparişiniz testleri başarıyla geçti, özenle paketlendi ve kargoya verildi. Kargo takip kodunuz: ${order.trackingNumber || "Sistemde Güncelleniyor"}. Keyifli sürüşler dileriz!`;
    } else if (stage === "DELIVERED") {
      message = `Merhaba ${order.customerName}! #${order.orderNumber} siparişinizin teslimatı tamamlandı. Yeni RC parçalarınızın montaj ve rodaj sürecinde her zaman atölyemizden teknik danışmanlık alabilirsiniz. Keyifli tırmanışlar dileriz! 🧗`;
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

  // --- 5 ZIRH: STEALTH SATIŞ & GİZLİ IBAN KASASI İŞLEMLERİ ---
  const handleCreateIban = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIbanBank || !newIbanHolder || !newIbanNumber) {
      showNotify("error", "Banka adı, hesap sahibi ve IBAN alanları zorunludur.");
      return;
    }
    setIsSavingIban(true);
    try {
      const res = await fetch("/api/admin/ibans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName: newIbanBank,
          accountHolder: newIbanHolder,
          iban: newIbanNumber,
          dailyLimit: Number(newIbanDailyLimit) || 75000,
          dailyOrderLimit: Number(newIbanDailyOrders) || 15,
          priorityOrder: Number(newIbanPriority) || 0,
          notes: newIbanNotes || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIbansList((prev) => [...prev, data.iban]);
        setIsIbanModalOpen(false);
        setNewIbanBank("");
        setNewIbanHolder("");
        setNewIbanNumber("");
        setNewIbanNotes("");
        showNotify("success", "✓ Yeni IBAN başarıyla havuz kasasına eklendi.");
      } else {
        showNotify("error", data.error || "IBAN eklenemedi.");
      }
    } catch {
      showNotify("error", "Bağlantı hatası.");
    } finally {
      setIsSavingIban(false);
    }
  };

  const handleToggleIbanActive = async (id: string, current: boolean) => {
    const next = !current;
    setIbansList((prev) => prev.map((item) => (item.id === id ? { ...item, isActive: next } : item)));
    try {
      const res = await fetch("/api/admin/ibans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: next }),
      });
      if (!res.ok) {
        setIbansList((prev) => prev.map((item) => (item.id === id ? { ...item, isActive: current } : item)));
        showNotify("error", "Durum güncellenemedi.");
      } else {
        showNotify("success", `IBAN ${next ? "AKTİF EDİLDİ" : "PASİFE ALINDI"}.`);
      }
    } catch {
      setIbansList((prev) => prev.map((item) => (item.id === id ? { ...item, isActive: current } : item)));
      showNotify("error", "Bağlantı hatası.");
    }
  };

  const handleResetIbanDaily = async (id: string) => {
    try {
      const res = await fetch("/api/admin/ibans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resetDaily: true }),
      });
      if (res.ok) {
        setIbansList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, currentDailyTotal: 0, currentOrderCount: 0 } : item))
        );
        showNotify("success", "✓ Bu hesabın günlük hacim ve işlem sayaçları sıfırlandı.");
      }
    } catch {
      showNotify("error", "Sıfırlama başarısız.");
    }
  };

  const handleResetAllIbansDaily = async () => {
    if (!window.confirm("Tüm havuzdaki IBAN'ların bugünkü hacim ve sayaçlarını sıfırlamak istiyor musunuz?")) return;
    try {
      const res = await fetch("/api/admin/ibans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_all_daily" }),
      });
      if (res.ok) {
        setIbansList((prev) =>
          prev.map((item) => ({ ...item, currentDailyTotal: 0, currentOrderCount: 0 }))
        );
        showNotify("success", "✓ Tüm IBAN sayaçları sıfırlandı. Yeni gün rotasyonu başladı.");
      }
    } catch {
      showNotify("error", "Sıfırlama başarısız.");
    }
  };

  const handleDeleteIban = async (id: string, bank: string) => {
    if (!window.confirm(`"${bank}" IBAN hesabını havuzdan silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/ibans?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setIbansList((prev) => prev.filter((item) => item.id !== id));
        showNotify("success", "✓ IBAN havuzdan kaldırıldı.");
      }
    } catch {
      showNotify("error", "Silme başarısız.");
    }
  };

  const handleSaveStealthSettings = async () => {
    setIsSavingStealthSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          kuruEslestirmeEnabled: stealthKurusEnabled,
          burnerTimeoutMinutes: Number(stealthBurnerTimeout),
          stealthCamouflageEnabled: stealthCamouflageEnabled,
          stealthServiceTitle: stealthServiceTitle,
          safeMemos: stealthSafeMemos,
          honeypotEnabled: stealthHoneypotEnabled,
          honeypotMode: stealthHoneypotMode,
          honeypotMessage: stealthHoneypotMessage,
        }),
      });
      if (res.ok) {
        setSettings((prev: any) => ({
          ...prev,
          kuruEslestirmeEnabled: stealthKurusEnabled,
          burnerTimeoutMinutes: Number(stealthBurnerTimeout),
          stealthCamouflageEnabled: stealthCamouflageEnabled,
          stealthServiceTitle: stealthServiceTitle,
          safeMemos: stealthSafeMemos,
          honeypotEnabled: stealthHoneypotEnabled,
          honeypotMode: stealthHoneypotMode,
          honeypotMessage: stealthHoneypotMessage,
        }));
        showNotify("success", "🛡️ 5 Stealth Savunma Ayarı Başarıyla Kaydedildi!");
      } else {
        showNotify("error", "Ayarlar kaydedilemedi.");
      }
    } catch {
      showNotify("error", "Bağlantı hatası.");
    } finally {
      setIsSavingStealthSettings(false);
    }
  };

  const handleAddSafeMemo = () => {
    if (!newSafeMemoInput.trim()) return;
    if (stealthSafeMemos.includes(newSafeMemoInput.trim())) {
      showNotify("error", "Bu açıklama etiketi zaten listede var.");
      return;
    }
    setStealthSafeMemos((prev) => [...prev, newSafeMemoInput.trim()]);
    setNewSafeMemoInput("");
  };

  const handleRemoveSafeMemo = (index: number) => {
    setStealthSafeMemos((prev) => prev.filter((_, idx) => idx !== index));
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

          {/* WhatsApp Usta Hattı Hızlı Düzenleyici */}
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-lg shadow-2xs">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span className="text-[11px] text-slate-300 font-medium">WhatsApp:</span>
            <input
              type="text"
              value={settings?.whatsappPhone || ""}
              onChange={(e) => setSettings((prev: any) => ({ ...prev, whatsappPhone: e.target.value }))}
              placeholder="+90 530..."
              className="w-28 bg-slate-900 text-white font-mono text-xs px-1.5 py-0.5 rounded border border-slate-600 focus:border-emerald-500 focus:outline-none"
              title="Sitedeki tüm WhatsApp butonlarının bağlandığı telefon numarası"
            />
            <button
              onClick={() => handleSaveWhatsAppPhone()}
              disabled={isSavingWhatsApp}
              className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-0.5 rounded cursor-pointer transition-colors"
            >
              {isSavingWhatsApp ? "..." : "Kaydet"}
            </button>
          </div>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === "settings"
                ? "bg-[#F27A1A] text-white border-[#F27A1A] shadow-xs"
                : "text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border-slate-700"
            }`}
            title="Site Ayarları, Header Logo ve Ödeme Kanalları"
          >
            <Settings className="w-3.5 h-3.5 text-orange-400" />
            <span>Ayarlar & Logo</span>
          </button>

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

      {/* Ana Gövde: Widescreen PC + Tablet & Mobil Tam Uyumlu */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto p-3 sm:p-5 lg:p-8 gap-5 lg:gap-8">
        {/* Mobil & Tablet Hızlı Sekme Çubuğu (Yatay Kaydırılabilir) */}
        <div className="lg:hidden w-full overflow-x-auto pb-2 scrollbar-none flex items-center gap-2 -mx-1 px-1 flex-shrink-0">
          {[
            { id: "dashboard", label: "Genel Bakış", icon: LayoutDashboard },
            { id: "settings", label: "⚙️ Site & Logo", icon: Settings, highlight: true },
            { id: "orders", label: "Siparişler", icon: ShoppingBag, count: orders.length },
            { id: "products", label: "Ürünler", icon: Package, count: products.length },
            { id: "categories", label: "Kategoriler", icon: FolderTree, count: categories.length },
            { id: "stealth", label: "Gizli IBAN", icon: ShieldCheck, count: "5 Zırh" },
            { id: "modules", label: "Modüller", icon: Sliders, count: modulesList.length || 15 },
            { id: "invites", label: "Davetiyeler", icon: KeyRound, count: invites.length },
            { id: "coupons", label: "Kuponlar", icon: Tag },
            { id: "reviews", label: "Yorumlar", icon: MessageSquare },
          ].map((tabItem) => {
            const IconComp = tabItem.icon;
            const isActive = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => setActiveTab(tabItem.id as any)}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs whitespace-nowrap ${
                  isActive
                    ? "bg-[#F27A1A] text-white ring-2 ring-orange-300"
                    : tabItem.highlight
                    ? "bg-orange-50 text-orange-950 border border-orange-300 font-extrabold"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tabItem.label}</span>
                {tabItem.count !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-800"
                  }`}>
                    {tabItem.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sol Menü: Profesyonel Kategorize Edilmiş Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 space-y-6 flex-shrink-0">
          {/* GRUP 1: YÖNETİM & SATIŞ */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-3 block mb-1">
              Yönetim & Satış
            </span>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#F27A1A] text-white shadow-xs ring-1 ring-[#F27A1A]"
                  : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/70"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Genel Bakış</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#F27A1A] text-white shadow-xs ring-1 ring-[#F27A1A]"
                  : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/70"
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-[#F27A1A] text-white shadow-xs ring-1 ring-[#F27A1A]"
                  : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/70"
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
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "categories"
                  ? "bg-[#F27A1A] text-white shadow-xs ring-1 ring-[#F27A1A]"
                  : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/70"
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
              onClick={() => setActiveTab("invites")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "invites"
                  ? "bg-[#F27A1A] text-white shadow-xs ring-1 ring-[#F27A1A]"
                  : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/70"
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
          </div>

          {/* GRUP 2: PAZARLAMA & MODÜLLER */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-3 block mb-1">
              Pazarlama & Eklentiler
            </span>

            <button
              onClick={() => setActiveTab("modules")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "modules"
                  ? "bg-[#F27A1A] text-white font-bold shadow-xs ring-1 ring-[#F27A1A]"
                  : "bg-white hover:bg-orange-50/60 text-slate-800 border border-slate-200/70"
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

            <button
              onClick={() => setActiveTab("coupons")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "coupons"
                  ? "bg-[#F27A1A] text-white shadow-xs ring-1 ring-[#F27A1A]"
                  : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/70"
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>İndirim Kuponları</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "reviews"
                  ? "bg-[#F27A1A] text-white shadow-xs ring-1 ring-[#F27A1A]"
                  : "bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/70"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Yorum Onay Havuzu</span>
            </button>
          </div>

          {/* GRUP 3: GÜVENLİK & STEALTH */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-3 block mb-1">
              Güvenlik & Savunma
            </span>

            <button
              onClick={() => setActiveTab("stealth")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "stealth"
                  ? "bg-emerald-700 text-white font-bold shadow-xs ring-1 ring-emerald-600"
                  : "bg-white hover:bg-emerald-50/60 text-slate-800 border border-emerald-300/80 shadow-2xs"
              }`}
            >
              <span className="flex items-center gap-3">
                <ShieldCheck className={`w-4 h-4 ${activeTab === "stealth" ? "text-white" : "text-emerald-700"}`} />
                <span>Gizli IBAN & Stealth</span>
              </span>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeTab === "stealth" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
              }`}>
                5 ZIRH
              </span>
            </button>
          </div>

          {/* GRUP 4: SİSTEM & AYARLAR (ÖZEL VURGULU) */}
          <div className="space-y-1 pt-2 border-t border-slate-200/80">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-3 block mb-1">
              Sistem & Yapılandırma
            </span>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#F27A1A] text-white shadow-md ring-2 ring-orange-300"
                  : "bg-orange-50/80 hover:bg-orange-100 text-orange-950 border border-orange-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-white" : "text-[#F27A1A]"}`} />
                <div className="text-left">
                  <span className="block font-bold">Site, Logo & Ayarlar</span>
                  <span className={`text-[10px] font-normal lowercase block ${activeTab === "settings" ? "text-orange-100" : "text-slate-500"}`}>
                    Logo, başlık, kur, ödeme
                  </span>
                </div>
              </div>
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase ${
                activeTab === "settings" ? "bg-white/20 text-white" : "bg-[#F27A1A] text-white"
              }`}>
                Logo & Başlık
              </span>
            </button>
          </div>
        </aside>

        {/* Sağ İçerik Alanı (Widescreen Fluid) */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: GENEL BAKIŞ (DASHBOARD) */}
          {activeTab === "dashboard" && (
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
                          <button
                            type="button"
                            onClick={() => handleSendWhatsAppTemplate(ord, "DELIVERED")}
                            className="px-3 py-1 text-[11px] bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-900 border border-emerald-300 font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>🎉 Teslim Edildi Mesajı</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SİTE, LOGO, HEADER & GENEL AYARLAR (SETTINGS) */}
          {activeTab === "settings" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in shadow-xs">
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#F27A1A]" />
                    <span>Site, Logo, Header & Genel Ayarlar</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Logo yükleme, slogan kontrolü, mağaza modu, kur belirleme, zabıta kalkanı ve tahsilat kanalları
                  </p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-orange-100/70 text-[#F27A1A] text-xs font-bold font-mono self-start sm:self-auto">
                  Yapılandırma Modu
                </span>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* KALICI VERİ DEPOLAMA VE VERİTABANI YEDEKLEME (PERSISTENT VOLUMES) */}
                <div className="p-6 bg-linear-to-r from-emerald-950/20 via-emerald-900/10 to-transparent border border-emerald-500/30 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                          Kalıcı Veri & Veritabanı Güvencesi (Persistent Storage)
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold">
                          KORUMA AKTİF
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                        Docker Persistent Storage sistemi devrededir. Siteye girdiğiniz tüm ürünler, kategoriler, siparişler, ayarlar ve yüklenen fotoğraflar sunucu güncellemelerinde veya yeni deploylarda <strong>asla silinmez, kalıcı olarak saklanır</strong>. Ayrıca istediğiniz an tek tıkla tam sistem JSON yedeği alabilir veya daha önce aldığınız bir yedeği geri yükleyebilirsiniz.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleExportBackup}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                        title="Tüm veritabanını JSON formatında bilgisayarınıza indirir"
                      >
                        <Download className="w-4 h-4" />
                        <span>Veritabanı Yedeği İndir</span>
                      </button>

                      <input
                        type="file"
                        ref={restoreFileRef}
                        onChange={handleRestoreBackup}
                        accept=".json,application/json"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => restoreFileRef.current?.click()}
                        disabled={isRestoringBackup}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        title="Daha önce indirilen JSON yedeğini sisteme aktarır"
                      >
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>{isRestoringBackup ? "Geri Yükleniyor..." : "Yedekten Geri Yükle"}</span>
                      </button>
                    </div>
                  </div>
                </div>

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

                {/* 0.5 MANUEL DOLAR KURU (USD/TRY) YÖNETİMİ & OTOMATİK ENDEKSLEME */}
                <div className="p-6 bg-linear-to-r from-emerald-950/15 via-emerald-900/5 to-transparent border border-emerald-500/30 rounded-2xl space-y-4 shadow-2xs">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                          Dolar Kuru & Otomatik Fiyat Endeksleme Motoru
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold">
                          CANLI ENDEKS
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                        Buraya gireceğiniz 1 Dolar (USD) kuru ile sitedeki tüm ürünlerin TL satış fiyatları ve varyasyonları otomatik olarak güncellenir. Ürünleri dolar bazında fiyatlandırabilir ve kur değiştikçe tek tıkla tüm sitedeki TL fiyatlarını yeniden endeksleyebilirsiniz.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={usdRateInput}
                          onChange={(e) => setUsdRateInput(e.target.value)}
                          className="w-32 px-3.5 py-2.5 text-xs bg-white border border-emerald-300 rounded-xl font-mono text-emerald-950 font-bold focus:border-emerald-600 focus:outline-none text-right pr-8 shadow-2xs"
                        />
                        <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">₺</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveUsdRate}
                        disabled={isSavingUsdRate}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSavingUsdRate ? "animate-spin" : ""}`} />
                        <span>{isSavingUsdRate ? "Endeksleniyor..." : "Kuru Kaydet & Tüm Fiyatları Güncelle"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 0.6 WHATSAPP USTA HATTI & DANIŞMA NUMARASI YÖNETİMİ (TÜM SİTEYİ GÜNCELLER) */}
                <div className="p-6 bg-linear-to-r from-emerald-950/20 via-emerald-900/10 to-transparent border border-emerald-500/40 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                          <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" />
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                          WhatsApp Usta Hattı & Doğrudan İletişim Numarası
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold">
                          TÜM SİTEDE GEÇERLİ
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                        Buraya gireceğiniz telefon numarası sitedeki <strong>TÜM</strong> WhatsApp butonlarını, üst menüyü (Header), alt bilgi alanını (Footer), ürün kartlarını, detay sayfalarını, sepeti, VIP davetiye taleplerini ve sipariş onay ekranlarını anında bu hatta bağlar.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                      <div className="relative">
                        <input
                          type="text"
                          value={settings.whatsappPhone}
                          onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                          placeholder="+90 530 478 49 44 veya 05304784944"
                          className="w-full sm:w-64 px-3.5 py-2.5 text-xs bg-white border border-emerald-300 rounded-xl font-mono text-emerald-950 font-bold focus:border-emerald-600 focus:outline-none shadow-2xs"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSaveWhatsAppPhone()}
                        disabled={isSavingWhatsApp}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <Check className={`w-3.5 h-3.5 ${isSavingWhatsApp ? "animate-spin" : ""}`} />
                        <span>{isSavingWhatsApp ? "Kaydediliyor..." : "Numarayı Kaydet & Uygula"}</span>
                      </button>

                      <a
                        href={getWhatsAppUrl(settings.whatsappPhone, "Merhaba Cihan Usta, WhatsApp hattı test mesajıdır.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 text-center"
                        title="Bu numarayı yeni sekmede açarak test edin"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Hattı Test Et</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Aktif WhatsApp Bağlantısı:</span>
                      <code className="bg-white/80 px-2 py-0.5 rounded border border-emerald-200 font-mono text-emerald-800 font-bold">
                        https://wa.me/{formatWhatsAppNumber(settings.whatsappPhone)}
                      </code>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                      <input
                        type="checkbox"
                        checked={settings.whatsappOrderEnabled}
                        onChange={(e) => setSettings({ ...settings, whatsappOrderEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Sitede Doğrudan WhatsApp ile Sipariş Butonları Açık Olsun</span>
                    </label>
                  </div>
                </div>

                {/* 0.8 HEADER LOGO & MARKA BAŞLIĞI YÖNETİMİ */}
                <div className="p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#F27A1A]" />
                        <span>Üst Header, Logo & Marka Başlığı Yönetimi</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Logo yükleme, marka yazısı düzenleme, sloganı gizleme ve mobil uyumluluk ayarları
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100/70 text-orange-950 text-[10px] font-bold">
                        <Sparkles className="w-3 h-3 text-[#F27A1A]" />
                        Kayıpsız Yüksek Netlik
                      </span>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Kaydet</span>
                      </button>
                    </div>
                  </div>

                  {/* Canlı Header Önizleme Kutusu */}
                  <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Sitedeki Canlı Görünüm Önizlemesi
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {settings.headerBrandMode || "BOTH"} Modu
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50/60 rounded-lg border border-dashed border-slate-200 flex items-center justify-center min-h-[90px]">
                      <div className="flex flex-col items-center text-center">
                        {settings.logoUrl && (settings.headerBrandMode || "BOTH") !== "TEXT_ONLY" ? (
                          <>
                            <img
                              src={settings.logoUrl}
                              alt="Logo Önizleme"
                              style={{
                                height: `${settings.logoHeight || 38}px`,
                                maxHeight: `${settings.logoHeight || 38}px`,
                                width: "auto",
                                objectFit: "contain",
                              }}
                              className="block select-none"
                            />
                            {(settings.headerBrandMode || "BOTH") === "BOTH" && (
                              <div className="flex items-baseline gap-0.5 leading-none mt-1.5">
                                <span className="text-xl font-black tracking-tight text-slate-950">
                                  {settings.headerPrimaryText || "cihan"}
                                </span>
                                <span className="text-xl font-black tracking-tight text-[#F27A1A]">
                                  {settings.headerSecondaryText || "ekspress"}
                                </span>
                                <span className="text-xs font-semibold text-slate-400 ml-0.5">
                                  {settings.headerSuffixText !== undefined ? settings.headerSuffixText : ".com"}
                                </span>
                              </div>
                            )}
                            {settings.showHeaderSubtitle !== false && (
                              <p className="text-[9px] font-bold tracking-wider text-slate-400 mt-1 uppercase">
                                {settings.headerSubtitle || "RC SCALE CRAWLER ATÖLYE SERGİ KATALOĞU"}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-2xl font-black tracking-tight text-slate-950">
                                {settings.headerPrimaryText || "cihan"}
                              </span>
                              <span className="text-2xl font-black tracking-tight text-[#F27A1A]">
                                {settings.headerSecondaryText || "ekspress"}
                              </span>
                              <span className="text-xs font-semibold text-slate-400 ml-0.5">
                                {settings.headerSuffixText !== undefined ? settings.headerSuffixText : ".com"}
                              </span>
                            </div>
                            {settings.showHeaderSubtitle !== false && (
                              <p className="text-[9px] font-bold tracking-wider text-slate-400 -mt-0.5 uppercase tracking-wider">
                                {settings.headerSubtitle || "RC SCALE CRAWLER ATÖLYE SERGİ KATALOĞU"}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 1. Görünüm Modu Seçimi (BOTH / LOGO_ONLY / TEXT_ONLY) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Header Görünüm Düzeni
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: "BOTH",
                          title: "Logo + Marka Yazısı",
                          desc: "Logonun hemen altında cihan ekspress yazısı gösterilir",
                          badge: "Önerilen",
                        },
                        {
                          id: "LOGO_ONLY",
                          title: "Yalnızca Logo",
                          desc: "Sadece yüklediğiniz logo görseli gösterilir",
                          badge: "Sade",
                        },
                        {
                          id: "TEXT_ONLY",
                          title: "Yalnızca Metin",
                          desc: "Logo gizlenir, sadece özel metinler gösterilir",
                          badge: "Tipografi",
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSettings({ ...settings, headerBrandMode: item.id })}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            (settings.headerBrandMode || "BOTH") === item.id
                              ? "bg-orange-50/60 border-[#F27A1A] ring-1 ring-[#F27A1A]"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{item.title}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Logo Yükleme, URL ve Boyutlandırma */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Logo Görseli Yükle & Düzenle
                      </span>
                      {settings.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, logoUrl: "" })}
                          className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Logoyu Kaldır
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* Dosya Yükle Butonu */}
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Bilgisayardan Logo Seç
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                            disabled={isUploadingImage}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = await handleUploadImageFile(file);
                              if (url) {
                                setSettings((prev: any) => ({ ...prev, logoUrl: url }));
                                showNotify("success", "Logo başarıyla yüklendi!");
                              }
                            }}
                            className="hidden"
                            id="header-logo-upload-input"
                          />
                          <label
                            htmlFor="header-logo-upload-input"
                            className={`w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                              isUploadingImage ? "opacity-60 pointer-events-none" : ""
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploadingImage ? "Yükleniyor..." : "Logo Seç (PNG/SVG/JPG)"}</span>
                          </label>
                        </div>
                      </div>

                      {/* Veya URL Girişi */}
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Veya Doğrudan Görsel URL&apos;si
                        </label>
                        <input
                          type="text"
                          placeholder="/uploads/... veya https://..."
                          value={settings.logoUrl || ""}
                          onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-mono text-slate-800"
                        />
                      </div>

                      {/* Logo Yüksekliği (px) */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Yükseklik
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={20}
                            max={120}
                            value={settings.logoHeight || 38}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                logoHeight: Number(e.target.value) || 38,
                              })
                            }
                            className="w-full px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-bold text-slate-800 text-center"
                          />
                          <span className="absolute right-2 top-2 text-[10px] text-slate-400">px</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      💡 Şeffaf arka planlı (PNG veya SVG) logo kullanmanız tavsiye edilir. Sistem görseli sıkıştırmadan orijinal netliğinde gösterir.
                    </p>
                  </div>

                  {/* 3. Marka Metinleri (Kişiselleştirilebilir Yazı) */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-slate-800 block">
                      Marka Yazısı Kelimeleri (Logonun Altında / Yerinde Görünür)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Birinci Kelime (Koyu Renk)
                        </label>
                        <input
                          type="text"
                          value={settings.headerPrimaryText ?? "cihan"}
                          onChange={(e) => setSettings({ ...settings, headerPrimaryText: e.target.value })}
                          placeholder="cihan"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          İkinci Kelime (Turuncu Vurgu)
                        </label>
                        <input
                          type="text"
                          value={settings.headerSecondaryText ?? "ekspress"}
                          onChange={(e) => setSettings({ ...settings, headerSecondaryText: e.target.value })}
                          placeholder="ekspress"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-bold text-[#F27A1A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Uzantı / Ek (Küçük Gri)
                        </label>
                        <input
                          type="text"
                          value={settings.headerSuffixText ?? ".com"}
                          onChange={(e) => setSettings({ ...settings, headerSuffixText: e.target.value })}
                          placeholder=".com"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-semibold text-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Alt Başlık / Slogan Yönetimi (Gizleme & Düzenleme) */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Alt Başlık / Slogan Yönetimi
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Logonun ve marka yazısının altındaki açıklama metnini düzenleyin veya tamamen kapatın
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            showHeaderSubtitle: settings.showHeaderSubtitle === false ? true : false,
                          })
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          settings.showHeaderSubtitle !== false
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                        }`}
                      >
                        {settings.showHeaderSubtitle !== false ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Görünür (Açık)</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Gizli (Kapalı)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {settings.showHeaderSubtitle !== false && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Alt Başlık Metni
                        </label>
                        <input
                          type="text"
                          value={settings.headerSubtitle ?? "RC SCALE CRAWLER ATÖLYE SERGİ KATALOĞU"}
                          onChange={(e) => setSettings({ ...settings, headerSubtitle: e.target.value })}
                          placeholder="RC SCALE CRAWLER ATÖLYE SERGİ KATALOĞU"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-bold text-slate-800"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          İstediğiniz sloganı yazabilir veya sağdaki butona tıklayarak tamamen görünmez yapabilirsiniz.
                        </p>
                      </div>
                    )}
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

                  {/* Yeni Ürün Ekle Butonu */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct({
                        id: "",
                        title: "",
                        description: "",
                        shortDescription: "",
                        basePrice: "",
                        salePrice: null,
                        costPrice: null,
                        stockQuantity: 10,
                        sku: "",
                        images: [],
                        videoUrl: "",
                        compatibleModels: "",
                        isFeatured: false,
                        categoryId: categories[0]?.id || "",
                        variants: [],
                      });
                    }}
                    className="px-3.5 py-1.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yeni Ürün Ekle</span>
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
                          <div className="flex items-center gap-2 flex-wrap font-sans text-xs mt-0.5">
                            <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded shadow-2xs">
                              ${(p.priceUsd ? Number(p.priceUsd) : (p.basePrice / (settings.usdRate || 38.5))).toFixed(2)} USD
                            </span>
                            <span className="font-black text-[#F27A1A]">
                              {p.basePrice.toLocaleString("tr-TR")} ₺
                            </span>
                            {p.salePrice && (
                              <span className="line-through text-slate-400 font-normal">
                                {p.salePrice.toLocaleString("tr-TR")} ₺
                              </span>
                            )}
                            {p.costPrice && (
                              <span className="text-slate-400 font-normal font-mono text-[11px]">
                                (Maliyet: {p.costPrice.toLocaleString("tr-TR")} ₺)
                              </span>
                            )}
                            <span className="font-mono text-slate-500 font-normal text-[11px]">
                              • Stok: <span className={`font-bold ${p.stockQuantity <= 3 ? "text-rose-600" : "text-slate-700"}`}>{p.stockQuantity}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            let pImages: string[] = [];
                            try {
                              pImages = typeof p.images === "string" ? JSON.parse(p.images) : (p.images || []);
                            } catch {
                              pImages = p.images ? [p.images] : [];
                            }
                            setEditingProduct({
                              ...p,
                              images: Array.isArray(pImages) ? pImages : [],
                              videoUrl: p.videoUrl || "",
                              variants: p.variants ? p.variants.map((v: any) => ({ ...v })) : [],
                            });
                          }}
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

          {/* TAB 10: 5 ZIRH - STEALTH SATIŞ & GİZLİ IBAN KASASI */}
          {activeTab === "stealth" && (
            <div className="space-y-8 animate-in fade-in">
              {/* Üst Başlık & Operasyonel Durum */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase rounded-full tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      5 Katmanlı Stealth Zırh Protokolü Aktif
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    Gizli Satış Operasyonu & IBAN Kasası
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    Banka yapay zeka denetim algoritmalarını (MASAK / AML), limit alarmlarını ve harici şüpheleri bertaraf eden profesyonel transfer yönetim merkezi. Sistem siparişleri kuruşla eşleştirir, hesapları gün içi otomatik rotasyona tabi tutar ve 15 dakikada kendini imha eden hayalet ödeme odaları açar.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleResetAllIbansDaily}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                    title="Tüm IBAN'ların günlük hacim ve işlem sayaçlarını sıfırlar"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
                    <span>Günü Sıfırla (Sayaçları Temizle)</span>
                  </button>
                  <button
                    onClick={() => setIsIbanModalOpen(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni IBAN Hesabı Ekle</span>
                  </button>
                </div>
              </div>

              {/* ZIRH 1: DİNAMİK IBAN HAVUZU & AKILLI HESAP ROTASYONU */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        1. Dinamik IBAN Havuzu & Akıllı Hesap Rotasyonu
                      </h3>
                      <p className="text-xs text-slate-500">
                        Gelen her sipariş, günlük limitini doldurmamış aktif hesaplar arasında otomatik paylaştırılır.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                      {ibansList.filter((i) => i.isActive).length} Aktif / {ibansList.length} Toplam IBAN
                    </span>
                  </div>
                </div>

                {/* IBAN Listesi Tablosu */}
                {ibansList.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-3">
                    <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-600 font-semibold">Havuzda kayıtlı IBAN bulunamadı.</p>
                    <button
                      onClick={() => setIsIbanModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                    >
                      İlk IBAN Hesabını Ekle
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {ibansList.map((acc) => {
                      const limitPercent = Math.min(
                        100,
                        Math.round((acc.currentDailyTotal / (acc.dailyLimit || 75000)) * 100)
                      );
                      const isFull = limitPercent >= 100 || acc.currentOrderCount >= (acc.dailyOrderLimit || 15);

                      return (
                        <div
                          key={acc.id}
                          className={`p-5 rounded-xl border transition-all space-y-4 ${
                            !acc.isActive
                              ? "bg-slate-50 border-slate-200 opacity-60"
                              : isFull
                              ? "bg-amber-50/40 border-amber-300 shadow-xs"
                              : "bg-white border-slate-200/90 shadow-2xs hover:border-emerald-500"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase text-slate-900">{acc.bankName}</span>
                                {acc.priorityOrder > 0 && (
                                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                    Öncelik: #{acc.priorityOrder}
                                  </span>
                                )}
                                {isFull && (
                                  <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                                    GÜNLÜK LİMİT DOLDU
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-semibold text-slate-600 block mt-0.5">
                                {acc.accountHolder}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleIbanActive(acc.id, acc.isActive)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                                  acc.isActive
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                }`}
                              >
                                {acc.isActive ? "Aktif" : "Pasif"}
                              </button>
                              <button
                                onClick={() => handleDeleteIban(acc.id, acc.bankName)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* IBAN Numarası */}
                          <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between font-mono text-xs font-bold text-slate-900 select-all break-all">
                            <span>{acc.iban}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(acc.iban);
                                showNotify("success", "IBAN panoya kopyalandı.");
                              }}
                              className="p-1 text-slate-500 hover:text-slate-900 ml-2 cursor-pointer"
                              title="Kopyala"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Günlük Limit İlerleme Barı */}
                          <div className="space-y-1.5 text-xs font-mono">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Bugünkü Hacim:</span>
                              <span className="font-bold text-slate-900">
                                {acc.currentDailyTotal.toLocaleString("tr-TR")} ₺ / {acc.dailyLimit.toLocaleString("tr-TR")} ₺ (%{limitPercent})
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                              <div
                                className={`h-full transition-all rounded-full ${
                                  limitPercent > 80 ? "bg-rose-500" : limitPercent > 50 ? "bg-amber-500" : "bg-emerald-500"
                                }`}
                                style={{ width: `${limitPercent}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <span className="text-slate-500">İşlem Kotası:</span>
                              <span className="font-semibold text-slate-700">
                                {acc.currentOrderCount} / {acc.dailyOrderLimit} Sipariş
                              </span>
                            </div>
                          </div>

                          {acc.notes && (
                            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                              Not: {acc.notes}
                            </p>
                          )}

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                            <button
                              onClick={() => handleResetIbanDaily(acc.id)}
                              className="text-[11px] text-slate-500 hover:text-orange-600 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Bu Hesabın Sayacını Sıfırla</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ZIRH 2 & 3: KURUŞLU REFERANS & HAYALET ÖDEME ODASI */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ZIRH 2: KURUŞLU REFERANS EŞLEŞTİRME MOTORU */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F27A1A] border border-orange-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                          2. Kuruşlu Referans Eşleştirme Motoru
                        </h3>
                        <p className="text-[11px] text-slate-500">Sıfır-Açıklama (Zero-Memo) Kalkanı</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setStealthKurusEnabled(!stealthKurusEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        stealthKurusEnabled ? "bg-emerald-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          stealthKurusEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Sipariş tutarına rastgele <strong>0.11 - 0.99 ₺</strong> kuruş eklenir. Müşteri banka transferi yaparken açıklama kısmını <strong>TAMAMEN BOŞ</strong> bırakır. Ekstrenizde her sipariş kuruş hanesinden anında ve benzersiz olarak eşleşir.
                  </p>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Canlı Simülasyon Örneği:
                    </span>
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Sipariş Tutarı:</span>
                      <span className="font-bold">25.000,00 ₺</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-700 font-bold">
                      <span>Müşterinin Yatıracağı:</span>
                      <span className="text-sm bg-emerald-100 px-2 py-0.5 rounded">25.000,37 ₺</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Banka Açıklaması:</span>
                      <span className="text-rose-600 font-bold uppercase">&quot;[BOŞ BIRAKILDI]&quot;</span>
                    </div>
                  </div>
                </div>

                {/* ZIRH 3: KENDİ KENDİNİ İMHA EDEN HAYALET ÖDEME ODASI */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center flex-shrink-0">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                          3. Hayalet Ödeme Odası (Burner Session)
                        </h3>
                        <p className="text-[11px] text-slate-500">Zamanlı Kendini İmha Eden IBAN Ekranı</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 font-mono font-bold text-xs rounded-lg">
                      {stealthBurnerTimeout} Dakika
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Müşteriye tahsis edilen IBAN ekranı belirlenen süre boyunca geri sayar. Süre bittiğinde IBAN müşterinin ekranından ve DOM&apos;dan kalıcı olarak silinir. Ekran görüntüsü arşivlenmesi veya eski IBAN&apos;a mükerrer transfer engellenir.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>Oturum Süresi (Dakika):</span>
                      <span className="font-mono text-slate-900">{stealthBurnerTimeout} dk</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={5}
                      value={stealthBurnerTimeout}
                      onChange={(e) => setStealthBurnerTimeout(Number(e.target.value))}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>5 dk (Ekstra Hızlı)</span>
                      <span>15 dk (Standart)</span>
                      <span>30 dk</span>
                      <span>60 dk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ZIRH 4 & 5: KAMUFLAJ FATURA & TERS AĞ TUZAĞI (HONEYPOT) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ZIRH 4: KAMUFLAJ DEKONT & MASUM HİZMET SÖZLÜĞÜ */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                          4. Kamuflaj Dekont & Masum Hizmet
                        </h3>
                        <p className="text-[11px] text-slate-500">Mühendislik / 3D CAD Beyan Kalkanı</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setStealthCamouflageEnabled(!stealthCamouflageEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        stealthCamouflageEnabled ? "bg-purple-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          stealthCamouflageEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Resmi Kamuflaj Hizmet Başlığı (Makbuz & Sipariş Özeti İçin):
                      </label>
                      <input
                        type="text"
                        value={stealthServiceTitle}
                        onChange={(e) => setStealthServiceTitle(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 font-medium text-slate-900"
                      />
                    </div>

                    {/* Masum Açıklamalar Etiket Yönetimi */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Müşteriye Önerilen Masum Transfer Açıklamaları (Bankanın Zorunlu Kıldığı Durumlarda):
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2.5">
                        {stealthSafeMemos.map((memo, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-800 text-xs font-mono font-medium rounded-lg border border-purple-200"
                          >
                            <span>{memo}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSafeMemo(idx)}
                              className="text-purple-400 hover:text-purple-700 cursor-pointer"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Yeni masum açıklama ekle (Örn: Proje Çizim Bedeli)"
                          value={newSafeMemoInput}
                          onChange={(e) => setNewSafeMemoInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSafeMemo();
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-600 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddSafeMemo}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ZIRH 5: TERS AĞ TUZAĞI (HONEYPOT & SAHTE BAKIM MODU) */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                          5. Ters Ağ Tuzağı (Reverse Honeypot)
                        </h3>
                        <p className="text-[11px] text-slate-500">Yetkisiz & Şüpheli Ziyaretçi Kalkanı</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setStealthHoneypotEnabled(!stealthHoneypotEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        stealthHoneypotEnabled ? "bg-blue-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          stealthHoneypotEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Davetiyesi olmayan veya şüpheli/denetim amaçlı IP adresleri ödeme ve checkout ekranına girdiğinde gerçek sistemi gizleyip sahte bir teknik bakım ekranı veya 404 yanıtı verir.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tuzak Ekranı Modu:
                      </label>
                      <select
                        value={stealthHoneypotMode}
                        onChange={(e) => setStealthHoneypotMode(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-semibold text-slate-900"
                      >
                        <option value="MAINTENANCE">Planlı Banka API Bakım Ekranı (Tavsiye Edilen - En İnandırıcı)</option>
                        <option value="NOT_FOUND">Sahte 404 Sayfa Bulunamadı Hatası</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gösterilecek Sahte Bakım Bildirimi:
                      </label>
                      <textarea
                        rows={2}
                        value={stealthHoneypotMessage}
                        onChange={(e) => setStealthHoneypotMessage(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-mono text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* EN ALTTI KAYDET BUTONU */}
              <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase text-emerald-400">
                    Stealth Operasyon Konfigürasyonu Hazır
                  </h4>
                  <p className="text-xs text-slate-400">
                    Değişiklikleri tüm sitede ve sipariş oluşturma motorunda anında yürürlüğe koymak için kaydedin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveStealthSettings}
                  disabled={isSavingStealthSettings}
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingStealthSettings ? "Kaydediliyor..." : "Tüm 5 Stealth Ayarını Kaydet & Devreye Al"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ÜRÜN DÜZENLEME & EKLEME MODALI */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
            {/* Modal Başlık */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F27A1A] border border-orange-100 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {editingProduct.id ? "Ürün Bilgilerini Düzenle" : "Yeni Parça / Araç Ekle"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {editingProduct.id ? `ID: ${editingProduct.id}` : "Yeni Ürün Tanımlama & Vitrine Alma"}
                  </p>
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
            <form onSubmit={handleSaveProductEdit} className="space-y-5">
              {/* Başlık ve Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ürün Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Traxxas TRX-4 Defender 1/10 Crawler"
                    value={editingProduct.title || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] focus:ring-2 focus:ring-orange-100 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kategori / Ölçek
                  </label>
                  <select
                    value={editingProduct.categoryId || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value || null })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-medium text-slate-900"
                  >
                    <option value="">Kategorisiz</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dolar Kuru Endeksli Fiyatlar, Stok ve Maliyet Bölümü */}
              <div className="p-4 bg-emerald-950/5 border border-emerald-500/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Dolar Kuru Endeksli Fiyatlandırma
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                    1 USD = {settings?.usdRate || 38.5} ₺
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Dolar Fiyatı ($) -> TL Otomatik */}
                  <div className="bg-white p-3 rounded-xl border border-emerald-300 shadow-2xs space-y-1.5">
                    <label className="block text-xs font-bold text-emerald-900">
                      Liste Fiyatı ($ USD) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min={0}
                        required
                        placeholder="Örn: 890"
                        value={
                          editingProduct.priceUsd !== undefined && editingProduct.priceUsd !== null
                            ? editingProduct.priceUsd
                            : (editingProduct.basePrice ? (Number(editingProduct.basePrice) / (settings?.usdRate || 38.5)).toFixed(2) : "")
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          const currentRate = settings?.usdRate && settings.usdRate > 0 ? settings.usdRate : 38.5;
                          if (val === "") {
                            setEditingProduct({ ...editingProduct, priceUsd: "", basePrice: "" });
                          } else {
                            const usdNum = parseFloat(val);
                            const tlNum = Math.round(usdNum * currentRate);
                            setEditingProduct({ ...editingProduct, priceUsd: val, basePrice: tlNum });
                          }
                        }}
                        className="w-full pl-6 pr-3 py-1.5 text-xs bg-emerald-50/50 border border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono font-black text-emerald-900"
                      />
                      <span className="absolute left-2 top-1.5 text-xs font-bold text-emerald-600">$</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>TL Karşılığı:</span>
                      <span className="font-mono font-bold text-slate-900">{editingProduct.basePrice ? Number(editingProduct.basePrice).toLocaleString("tr-TR") : 0} ₺</span>
                    </div>
                  </div>

                  {/* İndirimli Dolar Fiyatı ($) */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      İndirimli Fiyat ($ USD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min={0}
                        placeholder="Opsiyonel"
                        value={
                          editingProduct.salePriceUsd !== undefined && editingProduct.salePriceUsd !== null
                            ? editingProduct.salePriceUsd
                            : (editingProduct.salePrice ? (Number(editingProduct.salePrice) / (settings?.usdRate || 38.5)).toFixed(2) : "")
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          const currentRate = settings?.usdRate && settings.usdRate > 0 ? settings.usdRate : 38.5;
                          if (val === "") {
                            setEditingProduct({ ...editingProduct, salePriceUsd: null, salePrice: null });
                          } else {
                            const usdNum = parseFloat(val);
                            const tlNum = Math.round(usdNum * currentRate);
                            setEditingProduct({ ...editingProduct, salePriceUsd: val, salePrice: tlNum });
                          }
                        }}
                        className="w-full pl-6 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#F27A1A] font-mono font-medium text-slate-800"
                      />
                      <span className="absolute left-2 top-1.5 text-xs font-bold text-slate-400">$</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>TL Karşılığı:</span>
                      <span className="font-mono font-bold text-slate-700">{editingProduct.salePrice ? Number(editingProduct.salePrice).toLocaleString("tr-TR") : "-"} ₺</span>
                    </div>
                  </div>

                  {/* Alış Maliyeti ($) */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Alış / Parça Maliyeti ($ USD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min={0}
                        placeholder="Maliyet (COGS)"
                        value={
                          editingProduct.costPriceUsd !== undefined && editingProduct.costPriceUsd !== null
                            ? editingProduct.costPriceUsd
                            : (editingProduct.costPrice ? (Number(editingProduct.costPrice) / (settings?.usdRate || 38.5)).toFixed(2) : "")
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          const currentRate = settings?.usdRate && settings.usdRate > 0 ? settings.usdRate : 38.5;
                          if (val === "") {
                            setEditingProduct({ ...editingProduct, costPriceUsd: null, costPrice: null });
                          } else {
                            const usdNum = parseFloat(val);
                            const tlNum = Math.round(usdNum * currentRate);
                            setEditingProduct({ ...editingProduct, costPriceUsd: val, costPrice: tlNum });
                          }
                        }}
                        className="w-full pl-6 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#F27A1A] font-mono font-medium text-slate-800"
                      />
                      <span className="absolute left-2 top-1.5 text-xs font-bold text-slate-400">$</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>TL Karşılığı:</span>
                      <span className="font-mono font-bold text-slate-700">{editingProduct.costPrice ? Number(editingProduct.costPrice).toLocaleString("tr-TR") : "-"} ₺</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Doğrudan TL Fiyatı Düzenle (₺)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      placeholder="TL cinsinden fiyat"
                      value={editingProduct.basePrice ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const currentRate = settings?.usdRate && settings.usdRate > 0 ? settings.usdRate : 38.5;
                        if (val === "") {
                          setEditingProduct({ ...editingProduct, basePrice: "", priceUsd: "" });
                        } else {
                          const tlNum = parseFloat(val);
                          const usdNum = Math.round((tlNum / currentRate) * 100) / 100;
                          setEditingProduct({ ...editingProduct, basePrice: val, priceUsd: usdNum });
                        }
                      }}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Stok Adedi *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.stockQuantity ?? 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      SKU / Barkod
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: CP-CRW-01"
                      value={editingProduct.sku || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Uyumlu Şasi Modelleri */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Uyumlu Crawler / Şasi Modelleri (Virgülle ayırarak yazın)
                </label>
                <input
                  type="text"
                  placeholder="TRX-4, SCX10 III, SCX24, CC-01, Enduro, Element RC"
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
                  Müşteri vitrinde kendi crawler modelini filtrelediğinde yeşil uyumluluk rozeti aktif olur.
                </p>
              </div>

              {/* BÖLÜM 1: ÇOKLU ÜRÜN GÖRSELLERİ (UPLOAD & URL) */}
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#F27A1A] flex items-center justify-center">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Ürün Fotoğraf Galerisi
                      </span>
                      <p className="text-[10px] text-slate-500">
                        İlk fotoğraf vitrinde kapak görseli olarak kullanılır.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                    {(Array.isArray(editingProduct.images) ? editingProduct.images.length : 0)} Fotoğraf
                  </span>
                </div>

                {/* Görsel Thumbnails Şeridi */}
                <div className="flex flex-wrap gap-3 min-h-[76px] p-3 bg-white border border-slate-200/80 rounded-xl items-center">
                  {Array.isArray(editingProduct.images) && editingProduct.images.length > 0 ? (
                    editingProduct.images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group flex-shrink-0 shadow-2xs"
                      >
                        <img src={img} alt={`Görsel ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#F27A1A] text-white text-[8px] font-bold text-center py-0.5 tracking-wider uppercase z-10">
                            Kapak
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 z-20">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const imgs = [...editingProduct.images];
                                const [moved] = imgs.splice(idx, 1);
                                imgs.unshift(moved);
                                setEditingProduct({ ...editingProduct, images: imgs });
                              }}
                              title="Kapak Resmi Yap"
                              className="p-1 bg-white text-slate-900 rounded hover:bg-orange-50 hover:text-[#F27A1A] text-[10px] font-bold cursor-pointer"
                            >
                              ★
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const imgs = [...editingProduct.images];
                              imgs.splice(idx, 1);
                              setEditingProduct({ ...editingProduct, images: imgs });
                            }}
                            title="Görseli Sil"
                            className="p-1 bg-rose-600 text-white rounded hover:bg-rose-700 text-[10px] cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic py-2 px-1">
                      Henüz görsel eklenmedi. Bilgisayarınızdan fotoğraf yükleyin veya link yapıştırın.
                    </p>
                  )}
                </div>

                {/* Yükleme ve URL Ekleme Butonları */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <label className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors flex-shrink-0">
                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                    <span>{isUploadingImage ? "Yükleniyor..." : "Bilgisayardan Fotoğraf Yükle"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={isUploadingImage}
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        for (let i = 0; i < files.length; i++) {
                          const url = await handleUploadImageFile(files[i]);
                          if (url) {
                            setEditingProduct((prev: any) => {
                              const curr = Array.isArray(prev.images) ? [...prev.images] : [];
                              return { ...prev, images: [...curr, url] };
                            });
                          }
                        }
                      }}
                    />
                  </label>

                  <div className="flex items-center gap-1.5 w-full">
                    <input
                      type="url"
                      placeholder="Veya harici görsel URL'i yapıştırın (https://...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-medium text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newImageUrl.trim()) return;
                        const curr = Array.isArray(editingProduct.images) ? [...editingProduct.images] : [];
                        setEditingProduct({ ...editingProduct, images: [...curr, newImageUrl.trim()] });
                        setNewImageUrl("");
                      }}
                      className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-[#F27A1A] font-bold text-xs rounded-xl transition-colors flex-shrink-0 cursor-pointer"
                    >
                      Görsel Ekle
                    </button>
                  </div>
                </div>
              </div>

              {/* BÖLÜM 2: VİDEO BAĞLANTISI (YOUTUBE / VIMEO / MP4) */}
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Tanıtım & Parkur Videosu Linki
                      </span>
                      <p className="text-[10px] text-slate-500">
                        YouTube, Vimeo veya doğrudan MP4 bağlantısı tanımlayın.
                      </p>
                    </div>
                  </div>
                  {editingProduct.videoUrl && (editingProduct.videoUrl.includes("youtube.com") || editingProduct.videoUrl.includes("youtu.be")) && (
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      <Play className="w-2.5 h-2.5 fill-current" /> YouTube Algılandı
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Örn: https://www.youtube.com/watch?v=sU3Kq8_xxxx veya https://youtu.be/..."
                  value={editingProduct.videoUrl || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, videoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-medium text-slate-900 placeholder:text-slate-400"
                />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Video eklendiğinde vitrindeki ürün galerisinde <strong>&quot;Video İzle&quot;</strong> butonu çıkar ve müşteri gömülü oynatıcı üzerinden arazi test sürüşünü izleyebilir.
                </p>
              </div>

              {/* BÖLÜM 3: FOTOĞRAFLI VARYASYON YÖNETİCİSİ */}
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Sliders className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Fotoğraflı Varyasyon Sistemi
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Farklı renk gövdeler, portal akslı şasiler veya ölçekler için fotoğraf ve fiyat tanımlayın.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentVariants = Array.isArray(editingProduct.variants) ? [...editingProduct.variants] : [];
                      setEditingProduct({
                        ...editingProduct,
                        variants: [
                          ...currentVariants,
                          {
                            id: `var-${Date.now()}`,
                            name: "",
                            price: Number(editingProduct.basePrice) || 0,
                            stock: 5,
                            sku: "",
                            image: "",
                          },
                        ],
                      });
                    }}
                    className="px-3 py-1.5 bg-[#F27A1A] hover:bg-[#E06A0A] text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Varyasyon Ekle</span>
                  </button>
                </div>

                {Array.isArray(editingProduct.variants) && editingProduct.variants.length > 0 ? (
                  <div className="space-y-2.5">
                    {editingProduct.variants.map((v: any, vIdx: number) => (
                      <div
                        key={vIdx}
                        className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-3"
                      >
                        {/* Fotoğraf Yükleme / Önizleme */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 group flex items-center justify-center">
                          {v.image ? (
                            <>
                              <img src={v.image} alt={v.name || "Varyasyon"} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...editingProduct.variants];
                                  updated[vIdx] = { ...updated[vIdx], image: null };
                                  setEditingProduct({ ...editingProduct, variants: updated });
                                }}
                                className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Fotoğrafı Kaldır"
                              >
                                ✕ Sil
                              </button>
                            </>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-[#F27A1A] cursor-pointer hover:bg-orange-50/50 transition-colors">
                              <ImageIcon className="w-4 h-4" />
                              <span className="text-[8px] font-bold mt-0.5">Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = await handleUploadImageFile(file);
                                    if (url) {
                                      const updated = [...editingProduct.variants];
                                      updated[vIdx] = { ...updated[vIdx], image: url };
                                      setEditingProduct({ ...editingProduct, variants: updated });
                                    }
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>

                        {/* Bilgiler Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1 w-full">
                          <div className="sm:col-span-1">
                            <input
                              type="text"
                              required
                              placeholder="Varyasyon Adı (Örn: Mat Siyah)"
                              value={v.name || ""}
                              onChange={(e) => {
                                const updated = [...editingProduct.variants];
                                updated[vIdx] = { ...updated[vIdx], name: e.target.value };
                                setEditingProduct({ ...editingProduct, variants: updated });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#F27A1A] font-semibold text-slate-900"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              min={0}
                              step="any"
                              placeholder="Fiyat ($ USD)"
                              value={
                                v.priceUsd !== undefined && v.priceUsd !== null
                                  ? v.priceUsd
                                  : (v.price ? (Number(v.price) / (settings?.usdRate || 38.5)).toFixed(2) : "")
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                const currentRate = settings?.usdRate && settings.usdRate > 0 ? settings.usdRate : 38.5;
                                const updated = [...editingProduct.variants];
                                if (val === "") {
                                  updated[vIdx] = { ...updated[vIdx], priceUsd: "", price: 0 };
                                } else {
                                  const usdNum = parseFloat(val);
                                  const tlNum = Math.round(usdNum * currentRate);
                                  updated[vIdx] = { ...updated[vIdx], priceUsd: val, price: tlNum };
                                }
                                setEditingProduct({ ...editingProduct, variants: updated });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs bg-emerald-50/70 border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600 font-mono font-bold text-emerald-950"
                              title="Dolar Fiyatı ($)"
                            />
                            <div className="text-[9px] font-mono text-slate-500 text-right pr-1">
                              {v.price ? Number(v.price).toLocaleString("tr-TR") : 0} ₺
                            </div>
                          </div>
                          <div>
                            <input
                              type="number"
                              min={0}
                              placeholder="Stok"
                              value={v.stock ?? ""}
                              onChange={(e) => {
                                const updated = [...editingProduct.variants];
                                updated[vIdx] = { ...updated[vIdx], stock: Number(e.target.value) };
                                setEditingProduct({ ...editingProduct, variants: updated });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#F27A1A] font-medium text-slate-800"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="SKU"
                              value={v.sku || ""}
                              onChange={(e) => {
                                const updated = [...editingProduct.variants];
                                updated[vIdx] = { ...updated[vIdx], sku: e.target.value };
                                setEditingProduct({ ...editingProduct, variants: updated });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#F27A1A] font-mono text-slate-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...editingProduct.variants];
                                updated.splice(vIdx, 1);
                                setEditingProduct({ ...editingProduct, variants: updated });
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                              title="Varyasyonu Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-2 px-1">
                    Bu ürün için henüz varyasyon eklenmedi. (Örn: Farklı renk gövdeler, portal akslı versiyonlar vb.)
                  </p>
                )}
              </div>

              {/* Açıklamalar */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kısa Açıklama (Vitrin Özeti)
                </label>
                <input
                  type="text"
                  placeholder="Kısa vitrin açıklaması..."
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
                  placeholder="Teknik detaylar, parça özellikleri, montaj bilgileri..."
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27A1A] font-medium text-slate-900 leading-relaxed resize-y"
                />
              </div>

              {/* Öne Çıkarılan Checkbox */}
              <div className="pt-1">
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

              {/* Modal Butonları */}
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
                  {isSavingProduct ? (
                    <span>Kaydediliyor...</span>
                  ) : (
                    <span>{editingProduct.id ? "Değişiklikleri Kaydet" : "Ürünü Oluştur & Yayınla"}</span>
                  )}
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

      {/* YENİ DİNAMİK IBAN HESABI EKLEME MODALI */}
      {isIbanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Yeni Dinamik IBAN Hesabı Ekle
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Rotasyon havuzuna yeni banka hesabı tanımlayın.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIbanModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIban} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banka Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Garanti BBVA, Enpara, Kuveyt Türk"
                  value={newIbanBank}
                  onChange={(e) => setNewIbanBank(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hesap Sahibi (Alıcı Adı) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Cihan Polat veya Şirket Ünvanı"
                  value={newIbanHolder}
                  onChange={(e) => setNewIbanHolder(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  IBAN Numarası *
                </label>
                <input
                  type="text"
                  required
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  value={newIbanNumber}
                  onChange={(e) => setNewIbanNumber(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Günlük Maksimum Tutar (₺)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={newIbanDailyLimit}
                    onChange={(e) => setNewIbanDailyLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">Bu limit dolunca sıradaki hesaba geçer</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Günlük Maksimum İşlem Sayısı
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newIbanDailyOrders}
                    onChange={(e) => setNewIbanDailyOrders(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">Gün içi sipariş kotası</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Öncelik Sırası (0 en yüksek öncelik)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newIbanPriority}
                  onChange={(e) => setNewIbanPriority(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Özel Not / Açıklama (Opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Şahıs hesabı A, yedek şirket hesabı..."
                  value={newIbanNotes}
                  onChange={(e) => setNewIbanNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsIbanModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isSavingIban}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSavingIban ? "Kaydediliyor..." : "Hesabı Havuza Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
