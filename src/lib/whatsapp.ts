/**
 * WhatsApp telefon numarasını uluslararası standart formata temizler.
 * Başındaki +, 00, boşluk, tire gibi karakterleri ayıklar.
 * Türkiye numaralarında 05XX veya 5XX ile girilmişse otomatik 905XX yapar.
 */
export function formatWhatsAppNumber(phone?: string | null, fallback = "905304784944"): string {
  if (!phone || typeof phone !== "string") return fallback;
  let digits = phone.replace(/[^0-9]/g, "");
  if (!digits) return fallback;

  // 0090... -> 90...
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // 05XXXXXXXXX (11 hane) -> 905XXXXXXXXX
  if (digits.length === 11 && digits.startsWith("05")) {
    digits = "90" + digits.slice(1);
  }

  // 5XXXXXXXXX (10 hane) -> 905XXXXXXXXX
  if (digits.length === 10 && digits.startsWith("5")) {
    digits = "90" + digits;
  }

  return digits;
}

/**
 * Verilen telefon ve opsiyonel mesaj için doğrudan tıklandığında açılacak wa.me bağlantısını üretir.
 */
export function getWhatsAppUrl(
  phone?: string | null,
  message?: string,
  fallback = "905304784944"
): string {
  const cleanPhone = formatWhatsAppNumber(phone, fallback);
  if (!message) {
    return `https://wa.me/${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
