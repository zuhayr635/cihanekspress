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
  ccApiKey: string;
  ccSecretKey: string;
  ccMerchantId: string;
  ccTestMode: boolean;
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
