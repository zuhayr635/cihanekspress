# CLAUDE.md — market-app (cihanekspress.com)

## Proje Nedir

Türkçe e-ticaret uygulaması. Next.js 14 App Router + Prisma + MySQL.
Canlı domain: `cihanekspress.com`, deploy: Docker + Coolify.

---

## Komutlar

```bash
npm run dev          # Geliştirme sunucusu (port 3000)
npm run dev:clean    # .next temizleyip başlat
npm run build        # Production build
npm run start        # Production başlat
npm run lint         # ESLint
npm run seed         # Veritabanı seed (prisma/seed.ts)

npx prisma migrate dev   # Migration oluştur + uygula
npx prisma db push       # Schema push (migration olmadan)
npx prisma studio        # DB GUI
npx prisma generate      # Client yeniden oluştur (schema değişince)
```

---

## Mimari

```
src/
  app/
    (auth)/          # Giriş sayfaları (layout olmadan)
    (store)/         # Kullanıcı mağazası sayfaları
    admin/
      (dashboard)/   # Admin paneli sayfaları
    api/             # Route handlers
  components/
    ui/              # shadcn/ui base bileşenleri (14 dosya)
    admin/           # Admin form/yönetim bileşenleri
    auth/            # Login/register formları
    layout/          # Header, footer, sidebar
    store/           # Ürün kartı, filtreler, sepet vs.
    providers/       # SessionProvider wrapper
  context/           # React context'leri
  hooks/             # Custom React hook'ları
  lib/               # Yardımcı modüller
  types/             # TypeScript tip tanımları
  generated/prisma/  # Prisma client (buraya dokunma, generate edilir)
```

### Önemli Dosyalar

| Dosya | Amaç |
|-------|------|
| `src/lib/db.ts` | Prisma singleton (global cache ile) |
| `src/lib/auth.ts` | NextAuth v5 — dual auth (user + admin) |
| `src/middleware.ts` | Route koruması |
| `src/lib/cache.ts` | In-memory TTL cache utility |
| `src/lib/currency.ts` | USD/TL format fonksiyonları |
| `src/lib/email.ts` | Nodemailer + template render |
| `src/lib/stripe.ts` | Stripe client (lazy singleton) |
| `src/lib/notify.ts` | Sistem bildirimleri |
| `prisma/schema.prisma` | Veritabanı şeması (23 model) |

---

## Kritik Mimari Kararlar

### Çift Auth Sistemi
`NextAuth v5 beta` kullanılıyor. **İki ayrı Credentials provider** var:
- `user-login` → `User` tablosu
- `admin-login` → `AdminUser` tablosu

Session'da `type: "user" | "admin"` alanı var. Admin route'larını korurken `session.user.type === "admin"` kontrolü yap.

**Hesap kilitleme:** 5 hatalı giriş → 15 dakika kilitli. `AdminLog` tablosuna yazılır.

### Çift Fiyatlama (USD + TL)
Her ürünün `priceUsd` ve `priceTl` alanı var. Döviz kuru `ExchangeRate` tablosunda tutulur. Kullanıcıya gösterirken `currency.ts` fonksiyonlarını kullan.

### In-Memory Cache
`src/lib/cache.ts`'deki `getCached(key, ttlMs, fn)` kullan. Ayarlar değişince `clearCache(key)` çağır. Cache container restart'ta sıfırlanır.

### Prisma Client Konumu
`@prisma/client` yerine `@/generated/prisma` import et:
```ts
import { PrismaClient } from '@/generated/prisma'
```

### URL Route'ları Türkçe
Tüm kullanıcı route'ları Türkçe: `/giris`, `/urunler`, `/sepet`, `/hesabim`, `/siparislerim`, `/favorilerim`. Yeni route eklerken Türkçe slug kullan.

### API Pattern'i
- Kullanıcı API'leri: `/api/*` (auth gerektiren → session kontrol et)
- Admin API'leri: `/api/admin/*` (sadece admin session ile erişilebilir)
- Tüm API route'ları JSON döndürür, hata durumunda `{ error: string }` formatında

---

## Ödeme Akışı

### IBAN (Havale/EFT)
```
Sipariş oluştur → Admin IBAN gönderir → Müşteri dekontu yükler
→ Admin onaylar → PAYMENT_CONFIRMED
```
- `PaymentLink` tablosu: süresi dolan tekil ödeme URL'leri
- `Receipt` tablosu: dekont yükleme + `PENDING | APPROVED | REJECTED`

### Stripe
```
Admin "ödeme linki oluştur" → Stripe Checkout Session → Webhook → STRIPE_PAID
POST /api/stripe/checkout  →  POST /api/stripe/webhook
```

---

## Order Status State Machine

```
PENDING
  → IBAN_SENT          (admin IBAN gönderdi)
  → PAYMENT_WAITING    (ödeme bekleniyor)
  → RECEIPT_UPLOADED   (müşteri dekont yükledi)
  → PAYMENT_CONFIRMED  (admin onayladı)
  → STRIPE_PAID        (Stripe webhook)
  → PREPARING          (hazırlanıyor)
  → SHIPPED            (kargoya verildi)
  → DELIVERED          (teslim edildi)
  → CANCELLED          (iptal)
  → RETURNED           (iade)
```
Her durum değişikliği `OrderHistory` tablosuna yazılır.

---

## Ürün Varyasyon Sistemi

```
VariationType (örn: "Renk", "Beden")
  └─ VariationValue (örn: "Kırmızı", "M", "L")
       └─ ProductVariationValueImage (varyasyon görseli)

ProductVariation
  └─ combination: JSON  // { "renk": "kirmizi", "beden": "M" }
  └─ priceUsd / priceTl (opsiyonel — ürün fiyatını override eder)
  └─ stock
  └─ sku
```
Varyasyonlu ürünlerde fiyat `ProductVariation`'dan alınır, yoksa `Product`'tan alınır.

---

## Veritabanı Modelleri (Özet)

| Model | Amaç |
|-------|------|
| `User` | Müşteri hesabı (ACTIVE/INACTIVE/BANNED) |
| `AdminUser` | Admin hesabı (ayrı tablo) |
| `Product` | Ürün (DRAFT/PUBLISHED/PENDING/HIDDEN) |
| `Category` | Hiyerarşik kategori (parent/children) |
| `ProductVariation` | SKU + fiyat + stok per kombinasyon |
| `Order` | Sipariş (USD+TL fiyat, kupon, Stripe ref) |
| `OrderItem` | Sipariş satır kalemleri |
| `Cart` / `CartItem` | Kullanıcı sepeti |
| `PaymentLink` | Tek kullanımlık ödeme URL'i |
| `Receipt` | Dekont yükleme + onay |
| `Coupon` | İndirim kodu (PERCENTAGE/FIXED) |
| `Banner` | Anasayfa slider/banner |
| `Setting` | Anahtar-değer konfigürasyon |
| `ThemeSetting` | Renk şeması |
| `ExchangeRate` | USD/TRY kuru |
| `EmailTemplate` | E-posta şablonları (`{degisken}` syntax) |
| `AdminLog` | Admin eylem audit trail |

---

## Email Template Sistemi

`EmailTemplate` modeli veritabanında tutulur. Değişkenler `{degiskenAdi}` formatında:
```ts
// Kullanım: lib/email.ts
await sendTemplatedEmail('order-confirmed', {
  customerName: 'Ali',
  orderNumber: '12345'
})
```
SMTP ayarları `Setting` tablosunda. SMTP ayarı yoksa console'a log düşer.

---

## Environment Variables

```env
DATABASE_URL           # MySQL bağlantı URL'i
NEXTAUTH_SECRET        # NextAuth secret (openssl rand -base64 32)
NEXTAUTH_URL           # https://cihanekspress.com
NEXT_PUBLIC_BASE_URL   # https://cihanekspress.com
IMGBB_API_KEY          # imgbb.com image hosting API key
STRIPE_SECRET_KEY      # Stripe backend key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Stripe frontend key
STRIPE_WEBHOOK_SECRET  # Stripe webhook imzalama secret
APP_PORT               # 3000

# Opsiyonel (admin panelinden de ayarlanabilir)
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM
```

---

## Deploy

Production: Docker + Coolify. `next.config.mjs`'de `output: 'standalone'`.

```bash
# Coolify üzerinden
docker-compose logs -f app          # Log izle
docker-compose restart app          # Restart
docker exec $(docker ps -qf name=db) mysqldump -uroot -p$DB_PASSWORD market_db > yedek.sql
```

Migration production'da `docker-migrate.js` ile çalışır (`prisma/docker-migrate.js`).

---

## Gotcha'lar

- `prisma generate` sonrası `src/generated/prisma/` güncellenir — commit et.
- Admin şifresi ilk kurulumda `Admin123!`, hemen değiştir.
- WhatsApp numarası admin paneli kaydedilince cache temizlenir (özel clear logic var).
- imgbb'ye yüklenen görseller URL olarak DB'de tutulur, fiziksel dosya yok.
- `next-auth` v5 hâlâ beta — session tipi `any` cast gerektiriyor, bu kasıtlı.
- Ürün varyasyon görsellerinde `ProductVariationValueImage` modeli kullanılır (ayrı tablo).
- 5 hatalı giriş → 15 dakika hesap kilidi (hem user hem admin için).
- Stripe webhook'u imzalı — `STRIPE_WEBHOOK_SECRET` olmadan işlenmez.
- Kupon indirimi `OrderItem` değil `Order` seviyesinde tutulur.
- `Order.addressJson` — teslimat adresi snapshot olarak JSON'da tutulur (adres değişse bile sipariş adresi sabit kalır).
