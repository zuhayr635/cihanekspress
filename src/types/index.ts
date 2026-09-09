export type StoreMode = "CATALOG_ONLY" | "INVITE_ONLY" | "PUBLIC_SALE";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PROCESSING"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED"
  | "FAILED";

export type PaymentMethod = "BANK_TRANSFER" | "WHATSAPP" | "CREDIT_CARD";

export interface BankAccount {
  bankName: string;
  accountHolder: string;
  iban: string;
}

export interface StoreSettingsData {
  id: string;
  storeName: string;
  storeTagline: string;
  storeMode: StoreMode;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  pricesIncludeTax: boolean;
  freeShippingThreshold: number;
  defaultShippingFee: number;
  bankTransferEnabled: boolean;
  bankAccounts: BankAccount[];
  whatsappOrderEnabled: boolean;
  whatsappPhone: string;
  whatsappMessageTemplate: string;
  creditCardEnabled: boolean;
  creditCardProvider: string;
  creditCardMerchantId?: string;
  ccApiKey: string;
  ccSecretKey: string;
  ccMerchantId: string;
  ccTestMode: boolean;
  panicMode?: boolean;
  usdRate?: number;
  blockedIps?: string[];
}

export interface CartItem {
  id: string; // product id or product-variant composite id
  productId: string;
  variantId?: string;
  title: string;
  variantName?: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
}

export interface VipSessionData {
  isVip: boolean;
  tokenId?: string;
  discountPercent?: number;
  note?: string;
}

export interface ProductVariantItem {
  id?: string;
  name: string;
  sku?: string | null;
  price: number;
  stock: number;
  image?: string | null;
  attributes?: string;
}

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  images: string; // JSON string array
  videoUrl?: string | null;
  type?: string;
  basePrice: number;
  salePrice?: number | null;
  costPrice?: number | null;
  sku?: string | null;
  stockQuantity: number;
  isFeatured?: boolean;
  compatibleModels?: string | null;
  categoryId?: string | null;
  category?: { id: string; name: string; slug?: string } | null;
  variants?: ProductVariantItem[];
}
