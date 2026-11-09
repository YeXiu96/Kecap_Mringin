import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  Modal,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { productData } from "@/constants/productData";
import { processOrderTransaction, validatePromoCode } from "@/services/orderService";
import { OrderReceipt, PromoDiscount } from "@/types/order";

// Helper agar Alert bekerja di Mobile maupun Web
function showAlert(title: string, message: string, onOk?: () => void) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(`${title}\n\n${message}`);
    }
    if (onOk) onOk();
  } else {
    Alert.alert(title, message, [{ text: "OK", onPress: onOk }]);
  }
}

export default function ProductDetailScreen() {
  // Mengambil parameter dari route menggunakan hook useLocalSearchParams (Modul 2)
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    price?: string;
    variant?: string;
    inStock?: string;
    stock?: string;
    sizeMl?: string;
  }>();

  const foundProduct = productData.find((p) => p.id === (params.id || "1"));
  const initialStock = foundProduct
    ? foundProduct.stock
    : params.stock !== undefined
      ? Number(params.stock)
      : params.inStock === "false"
        ? 0
        : 5;
  const numericPrice = params.price ? Number(params.price) : 15000;

  // State untuk interaktivitas Pemesanan & Stok (Modul 1 & 3)
  const [currentStock, setCurrentStock] = useState(initialStock);
  const [quantity, setQuantity] = useState(1);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoDiscount | null>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<OrderReceipt | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const isAvailable = currentStock > 0;

  // 1. Menerapkan router.back() dan router.canGoBack() (Materi Modul 2)
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  // ==========================================================================
  // MODUL 3: PEMANGGILAN PROMISE DENGAN .then() DAN .catch() (Fitur Validasi Promo)
  // Memanggil validatePromoCode() yang menggunakan new Promise((resolve, reject))
  // ==========================================================================
  const handleCheckPromo = () => {
    setCheckingPromo(true);

    // Pemanggilan fungsi Promise custom menggunakan .then() dan .catch()
    validatePromoCode(promoInput)
      .then((promoResult) => {
        // Callback .then() dieksekusi jika Promise menghasilkan resolve()
        setAppliedPromo(promoResult);
        showAlert(
          "Promo Berhasil Digunakan! 🎉",
          `${promoResult.description}\nPotongan diskon ${promoResult.discountPercent}% berhasil diterapkan.`,
        );
      })
      .catch((error: Error) => {
        // Callback .catch() dieksekusi jika Promise menghasilkan reject()
        setAppliedPromo(null);
        showAlert("Promo Gagal ❌", error.message);
      })
      .finally(() => {
        setCheckingPromo(false);
      });
  };

  // ==========================================================================
  // MODUL 3: PEMANGGILAN ASYNC FUNCTION & CHAINING .then().then() (Pemesanan)
  // Jika stok mencukupi -> resolve() & stok berkurang
  // Jika pesanan melebihi stok atau stok habis -> reject() & ditangkap .catch()
  // ==========================================================================
  const handleOrder = () => {
    setOrderError(null);
    setOrderReceipt(null);
    setIsProcessingOrder(true);

    // 1. Memanggil Custom Async Function
    processOrderTransaction({
      productId: params.id || "1",
      productName: params.name || "Kecap Mringin",
      quantity,
      unitPrice: numericPrice,
      promoCode: appliedPromo?.code,
    })
      // 2. Chaining .then() Pertama: Update sisa stok & format data struk yang di-resolve
      .then((receipt) => {
        setCurrentStock(receipt.remainingStock);
        setOrderReceipt(receipt);
        const diskonInfo = receipt.discountAmount > 0
          ? `\nDiskon: -Rp ${receipt.discountAmount.toLocaleString("id-ID")}`
          : "";
        return (
          `ID Pesanan: ${receipt.orderId}\n` +
          `Produk: ${receipt.productName} (${receipt.quantity} botol)\n` +
          `Sisa Stok: ${receipt.remainingStock} botol\n` +
          `Subtotal: Rp ${receipt.subtotal.toLocaleString("id-ID")}` +
          diskonInfo + "\n" +
          `Total Bayar: Rp ${receipt.finalPrice.toLocaleString("id-ID")}\n` +
          `Waktu: ${receipt.timestamp}\n` +
          `Status: ${receipt.status}`
        );
      })
      // 3. Chaining .then() Kedua: Menampilkan hasil struk ke Modal antarmuka pengguna
      .then((_formattedReceipt) => {
        setOrderError(null);
      })
      // 4. .catch(): Menangkap reject() saat pesanan melebihi stok atau stok habis
      .catch((err: Error) => {
        setOrderReceipt(null);
        setOrderError(err.message);
      })
      // 5. .finally(): Reset state loading saat Promise selesai
      .finally(() => {
        setIsProcessingOrder(false);
      });
  };

  const calculatedSubtotal = quantity * numericPrice;
  const discountVal = appliedPromo ? (calculatedSubtotal * appliedPromo.discountPercent) / 100 : 0;
  const grandTotal = calculatedSubtotal - discountVal;

  return (
    <ScrollView style={detailStyles.container} contentContainerStyle={detailStyles.contentContainer}>
      {/* Tombol Back (Modul 2) */}
      <Pressable onPress={handleBack} style={detailStyles.backButton}>
        <Text style={detailStyles.backButtonText}>← Kembali</Text>
      </Pressable>

      <Text style={detailStyles.pageTitle}>Detail Produk</Text>

      {/* Card Info Produk (Modul 1 & 2) */}
      <View style={detailStyles.card}>
        <Text style={detailStyles.title}>
          {params.name || "Kecap Mringin"} {params.sizeMl ? `(${params.sizeMl}ml)` : ""}
        </Text>

        <View style={detailStyles.badgeContainer}>
          <Text
            style={[
              detailStyles.badge,
              {
                backgroundColor: isAvailable ? "#ea580c" : "#9ca3af",
                color: "#ffffff",
              },
            ]}
          >
            {isAvailable ? `Tersedia • Stok: ${currentStock} botol` : "Stok Habis (0 botol)"}
          </Text>
          <Text style={detailStyles.variantText}>
            Varian: <Text style={{ fontWeight: "700" }}>{params.variant || "-"}</Text>
          </Text>
        </View>

        <Text style={detailStyles.price}>
          Rp {numericPrice.toLocaleString("id-ID")}
        </Text>

        <View style={detailStyles.divider} />

        <Text style={detailStyles.sectionTitle}>Deskripsi Produk</Text>
        <Text style={detailStyles.description}>
          Kecap Mringin diolah secara tradisional menggunakan kedelai hitam berkualitas tinggi dan rempah-rempah pilihan Nusantara. Memberikan cita rasa gurih, manis legit alami, dan aroma sedap untuk masakan keluarga Anda.
        </Text>
      </View>

      {/* ================================================================== */}
      {/* CARD KELOLA PESANAN & ASYNCHRONOUS DEMO (MODUL 3) */}
      {/* ================================================================== */}
      <View style={detailStyles.card}>
        <Text style={detailStyles.sectionTitle}>Atur Pemesanan (Modul 3 Async)</Text>

        {/* Counter Kuantitas */}
        <View style={detailStyles.quantityRow}>
          <Text style={detailStyles.label}>Jumlah Botol:</Text>
          <View style={detailStyles.counterBox}>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={detailStyles.counterBtn}
            >
              <Text style={detailStyles.counterBtnText}>−</Text>
            </Pressable>
            <Text style={detailStyles.quantityText}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity((q) => q + 1)}
              style={detailStyles.counterBtn}
            >
              <Text style={detailStyles.counterBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Form Kupon Promo (Demonstrasi .resolve() & .reject()) */}
        <Text style={[detailStyles.label, { marginTop: 12 }]}>
          Kupon Promo (Coba: <Text style={{ fontWeight: "700", color: "#ea580c" }}>MRINGIN20</Text>):
        </Text>
        <View style={detailStyles.promoRow}>
          <TextInput
            placeholder="Masukkan kode promo..."
            placeholderTextColor="#9ca3af"
            value={promoInput}
            onChangeText={setPromoInput}
            autoCapitalize="characters"
            style={detailStyles.promoInput}
          />
          <Pressable
            onPress={handleCheckPromo}
            disabled={checkingPromo}
            style={detailStyles.promoButton}
          >
            {checkingPromo ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={detailStyles.promoButtonText}>Terapkan</Text>
            )}
          </Pressable>
        </View>

        {appliedPromo && (
          <View style={detailStyles.appliedBadge}>
            <Text style={detailStyles.appliedText}>
              ✓ {appliedPromo.description} (-{appliedPromo.discountPercent}%)
            </Text>
          </View>
        )}

        {/* Ringkasan Total */}
        <View style={detailStyles.summaryBox}>
          <View style={detailStyles.summaryLine}>
            <Text style={detailStyles.summaryLabel}>Subtotal ({quantity} item):</Text>
            <Text style={detailStyles.summaryValue}>Rp {calculatedSubtotal.toLocaleString("id-ID")}</Text>
          </View>
          {discountVal > 0 && (
            <View style={detailStyles.summaryLine}>
              <Text style={[detailStyles.summaryLabel, { color: "#16a34a" }]}>Potongan Promo:</Text>
              <Text style={[detailStyles.summaryValue, { color: "#16a34a" }]}>-Rp {discountVal.toLocaleString("id-ID")}</Text>
            </View>
          )}
          <View style={[detailStyles.summaryLine, { marginTop: 6, borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 6 }]}>
            <Text style={[detailStyles.summaryLabel, { fontWeight: "bold" }]}>Total Akhir:</Text>
            <Text style={[detailStyles.summaryValue, { fontWeight: "bold", fontSize: 16, color: "#78350f" }]}>
              Rp {grandTotal.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
      </View>

      {/* Tombol Aksi Transaksi Async */}
      <Pressable
        onPress={handleOrder}
        style={[
          detailStyles.orderButton,
          isProcessingOrder && detailStyles.disabledButton,
        ]}
        disabled={isProcessingOrder}
      >
        {isProcessingOrder ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ActivityIndicator color="#ffffff" size="small" />
            <Text style={detailStyles.orderButtonText}>Mengecek Stok & Memproses...</Text>
          </View>
        ) : (
          <Text style={detailStyles.orderButtonText}>
            Pesan Sekarang ({quantity} Botol)
          </Text>
        )}
      </Pressable>

      {/* MODAL POPUP UNTUK STRUK BERHASIL (.resolve) ATAU ERROR (.reject) */}
      <Modal
        visible={Boolean(orderReceipt || orderError)}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setOrderReceipt(null);
          setOrderError(null);
        }}
      >
        <View style={detailStyles.modalOverlay}>
          {orderReceipt && (
            <View style={[detailStyles.modalContent, detailStyles.receiptCard]}>
              <Text style={detailStyles.receiptTitle}>Struk Transaksi Berhasil! 🎉</Text>
              <View style={detailStyles.divider} />
              <Text style={detailStyles.receiptLine}>
                No. Pesanan: <Text style={detailStyles.receiptBold}>{orderReceipt.orderId}</Text>
              </Text>
              <Text style={detailStyles.receiptLine}>
                Produk:{" "}
                <Text style={detailStyles.receiptBold}>
                  {orderReceipt.productName} ({orderReceipt.quantity} botol)
                </Text>
              </Text>
              <Text style={detailStyles.receiptLine}>
                Sisa Stok Gudang:{" "}
                <Text style={detailStyles.receiptBold}>{orderReceipt.remainingStock} botol</Text>
              </Text>
              <Text style={detailStyles.receiptLine}>
                Subtotal: Rp {orderReceipt.subtotal.toLocaleString("id-ID")}
              </Text>
              {orderReceipt.discountAmount > 0 && (
                <Text style={[detailStyles.receiptLine, { color: "#16a34a" }]}>
                  Diskon: -Rp {orderReceipt.discountAmount.toLocaleString("id-ID")}
                </Text>
              )}
              <Text style={[detailStyles.receiptLine, { fontSize: 16, marginTop: 4 }]}>
                Total Bayar:{" "}
                <Text style={[detailStyles.receiptBold, { color: "#15803d" }]}>
                  Rp {orderReceipt.finalPrice.toLocaleString("id-ID")}
                </Text>
              </Text>
              <Text style={detailStyles.receiptLine}>Waktu: {orderReceipt.timestamp}</Text>
              <Text style={detailStyles.receiptLine}>
                Status:{" "}
                <Text style={{ color: "#16a34a", fontWeight: "bold" }}>{orderReceipt.status}</Text>
              </Text>

              <View style={detailStyles.modalButtonRow}>
                <Pressable
                  onPress={() => setOrderReceipt(null)}
                  style={[detailStyles.backCatalogBtn, { flex: 1, backgroundColor: "#6b7280" }]}
                >
                  <Text style={detailStyles.backCatalogText}>Tutup</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setOrderReceipt(null);
                    router.replace("/");
                  }}
                  style={[detailStyles.backCatalogBtn, { flex: 1 }]}
                >
                  <Text style={detailStyles.backCatalogText}>Kembali ke Katalog</Text>
                </Pressable>
              </View>
            </View>
          )}

          {orderError && (
            <View style={[detailStyles.modalContent, detailStyles.errorCard]}>
              <Text style={detailStyles.errorCardTitle}>Transaksi Ditolak ⚠️</Text>
              <Text style={detailStyles.errorCardText}>{orderError}</Text>
              <Pressable
                onPress={() => setOrderError(null)}
                style={detailStyles.errorCloseBtn}
              >
                <Text style={detailStyles.backCatalogText}>Mengerti</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef3c7",
  },
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#78350f",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  backButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#78350f",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#451a03",
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  badge: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
  variantText: {
    fontSize: 13,
    color: "#4b5563",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4b5563",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    overflow: "hidden",
  },
  counterBtn: {
    backgroundColor: "#78350f",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  counterBtnText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "bold",
    color: "#451a03",
  },
  promoRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1f2937",
    backgroundColor: "#f9fafb",
  },
  promoButton: {
    backgroundColor: "#78350f",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  promoButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  appliedBadge: {
    marginTop: 8,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  appliedText: {
    color: "#15803d",
    fontSize: 13,
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff7ed",
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9a3412",
  },
  switchSub: {
    fontSize: 11,
    color: "#c2410c",
  },
  summaryBox: {
    marginTop: 14,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
  },
  orderButton: {
    backgroundColor: "#ea580c",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  orderButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  receiptCard: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#065f46",
    textAlign: "center",
  },
  receiptLine: {
    fontSize: 14,
    color: "#374151",
    marginVertical: 2,
  },
  receiptBold: {
    fontWeight: "bold",
    color: "#111827",
  },
  backCatalogBtn: {
    backgroundColor: "#059669",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  backCatalogText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  errorCard: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b91c1c",
  },
  errorCardText: {
    fontSize: 14,
    color: "#7f1d1d",
    marginTop: 6,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginBottom: 0,
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  errorCloseBtn: {
    backgroundColor: "#b91c1c",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 14,
  },
});
