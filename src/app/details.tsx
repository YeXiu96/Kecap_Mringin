import React from "react";
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function ProductDetailScreen() {
  // Mengambil parameter dari route menggunakan hook useLocalSearchParams
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    price?: string;
    variant?: string;
    inStock?: string;
    sizeMl?: string;
  }>();

  const isAvailable = params.inStock === "true";
  const numericPrice = params.price ? Number(params.price) : 0;

  // 1. Menerapkan router.back() dan router.canGoBack() (Materi Modul 2)
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  // 2. Menerapkan router.replace() (Materi Modul 2)
  const handleOrder = () => {
    if (!isAvailable) {
      Alert.alert("Stok Habis", "Maaf, produk ini sedang tidak tersedia.");
      return;
    }

    Alert.alert(
      "Konfirmasi Pemesanan",
      `Apakah Anda ingin memesan ${params.name || "produk ini"} seharga Rp ${numericPrice.toLocaleString("id-ID")}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Pesan Sekarang",
          onPress: () => {
            Alert.alert(
              "Pesanan Berhasil!",
              "Pesanan Anda sedang diproses. Anda akan dialihkan ke halaman utama.",
              [
                {
                  text: "OK",
                  // Menggunakan router.replace() agar halaman detail di-replace dan tidak menumpuk di riwayat
                  onPress: () => router.replace("/"),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={detailStyles.container} contentContainerStyle={detailStyles.contentContainer}>
      {/* Tombol Back */}
      <Pressable onPress={handleBack} style={detailStyles.backButton}>
        <Text style={detailStyles.backButtonText}>← Kembali</Text>
      </Pressable>

      <Text style={detailStyles.pageTitle}>Detail Produk</Text>

      {/* Card Info Produk */}
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
            {isAvailable ? "Tersedia" : "Stok Habis"}
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

      {/* Tombol Aksi */}
      <Pressable
        onPress={handleOrder}
        style={[
          detailStyles.orderButton,
          !isAvailable && detailStyles.disabledButton,
        ]}
        disabled={!isAvailable}
      >
        <Text style={detailStyles.orderButtonText}>
          {isAvailable ? "Pesan Sekarang" : "Stok Tidak Tersedia"}
        </Text>
      </Pressable>
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
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4b5563",
  },
  orderButton: {
    backgroundColor: "#ea580c",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  orderButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
