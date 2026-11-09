import { productData } from "@/constants/productData";
import { OrderReceipt, OrderRequest, PromoDiscount } from "@/types/order";

// ============================================================================
// 1. PRE-BUILT ASYNC FUNCTION WRAPPER
// Operasi asynchronous bawaan (setTimeout) yang dibungkus menjadi Promise
// ============================================================================
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// 2. FUNGSI PROMISE DENGAN .resolve() DAN .reject() (Validasi Promo & Stok)
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

// Fungsi Promise untuk mengecek dan mengurangi stok produk secara nyata
export function validateAndDeductStock(productId: string, quantity: number): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = productData.find((p) => p.id === productId);

      if (!product) {
        reject(new Error("Produk tidak ditemukan di gudang."));
        return;
      }

      if (quantity <= 0) {
        reject(new Error("Jumlah pesanan minimal harus 1 botol."));
        return;
      }

      // Jika stok habis (0), panggil reject()
      if (!product.inStock || product.stock <= 0) {
        reject(new Error(`Maaf, stok ${product.name} saat ini sedang habis (0 botol)!`));
        return;
      }

      // Jika jumlah pesanan melebihi stok yang tersedia, panggil reject()
      if (quantity > product.stock) {
        reject(
          new Error(
            `Stok tidak mencukupi! Anda memesan ${quantity} botol, tetapi sisa stok ${product.name} hanya ${product.stock} botol.`,
          ),
        );
        return;
      }

      // Jika stok mencukupi, kurangi stok dan panggil resolve() dengan sisa stok terbaru
      product.stock -= quantity;
      product.inStock = product.stock > 0;
      resolve(product.stock);
    }, 800);
  });
}

// ============================================================================
// 3. CUSTOM ASYNC FUNCTION (async & await)
// Function buatan sendiri ber-keyword 'async' yang mengembalikan Promise<OrderReceipt>
// ============================================================================
export async function processOrderTransaction(order: OrderRequest): Promise<OrderReceipt> {
  // Menunggu (await) simulasi koneksi ke server
  await delay(500);

  // Mengecek ketersediaan stok dan mengurangi stok jika mencukupi (akan throw/reject jika kurang/habis)
  const remainingStock = await validateAndDeductStock(order.productId, order.quantity);

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
    remainingStock,
    subtotal,
    discountAmount,
    finalPrice,
    status: "CONFIRMED",
    timestamp: new Date().toLocaleTimeString("id-ID"),
  };
}

