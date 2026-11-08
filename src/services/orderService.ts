import { OrderReceipt, OrderRequest, PromoDiscount } from "@/types/order";

// ============================================================================
// 1. PRE-BUILT ASYNC FUNCTION WRAPPER
// Operasi asynchronous bawaan (setTimeout) yang dibungkus menjadi Promise
// ============================================================================
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// 2. FUNGSI PROMISE DENGAN .resolve() DAN .reject()
// Mendemonstrasikan new Promise((resolve, reject) => { ... })
// ============================================================================
export function validatePromoCode(code: string): Promise<PromoDiscount> {
  return new Promise((resolve, reject) => {
    // Simulasi delay pengecekan server
    setTimeout(() => {
      const cleanCode = code.trim().toUpperCase();

      if (!cleanCode) {
        // Pemanggilan reject() saat validasi input gagal
        reject(new Error("Kode promo tidak boleh kosong!"));
        return;
      }

      if (cleanCode === "MRINGIN20") {
        // Pemanggilan resolve() saat kode promo valid
        resolve({
          code: "MRINGIN20",
          discountPercent: 20,
          description: "Promo Spesial Kecap Mringin 20%",
        });
      } else if (cleanCode === "MANISLEGIT") {
        // Pemanggilan resolve() variasi lain
        resolve({
          code: "MANISLEGIT",
          discountPercent: 10,
          description: "Diskon Manis Legit Nusantara 10%",
        });
      } else {
        // Pemanggilan reject() saat kode tidak ditemukan
        reject(new Error(`Kode promo "${cleanCode}" tidak terdaftar atau sudah kedaluwarsa.`));
      }
    }, 1000);
  });
}

// ============================================================================
// 3. CUSTOM ASYNC FUNCTION (async & await)
// Function buatan sendiri ber-keyword 'async' yang mengembalikan Promise<OrderReceipt>
// ============================================================================
export async function processOrderTransaction(order: OrderRequest): Promise<OrderReceipt> {
  // Menunggu (await) simulasi network request
  await delay(1200);

  // Jika opsi simulasi kegagalan diaktifkan (misal demo stok server kosong)
  if (order.simulateFailure) {
    throw new Error("Transaksi ditolak server: Stok gudang mendadak habis!");
  }

  if (order.quantity <= 0) {
    throw new Error("Jumlah pesanan minimal harus 1 botol.");
  }

  const subtotal = order.quantity * order.unitPrice;
  let discountAmount = 0;

  // Jika ada promo code, validasi menggunakan async/await Promise
  if (order.promoCode) {
    try {
      const promo = await validatePromoCode(order.promoCode);
      discountAmount = (subtotal * promo.discountPercent) / 100;
    } catch {
      // Jika promo gagal, diskon 0 dan transaksi tetap lanjut
      discountAmount = 0;
    }
  }

  const finalPrice = Math.max(0, subtotal - discountAmount);

  // Return nilai otomatis dibungkus Promise oleh 'async function'
  return {
    orderId: `KM-${Date.now().toString().slice(-6)}`,
    productName: order.productName,
    quantity: order.quantity,
    subtotal,
    discountAmount,
    finalPrice,
    status: "CONFIRMED",
    timestamp: new Date().toLocaleTimeString("id-ID"),
  };
}

