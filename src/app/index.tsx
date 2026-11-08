import { ProductCatalog } from "@/components/ProductCatalog";
import { styles } from "@/constants/styles";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Katalog Kecap Mringin</Text>

      {/* TUGAS 1: tombol menuju halaman data dari External API */}
      <Pressable
        onPress={() => router.push("/market" as any)}
        style={{
          backgroundColor: "#78350f",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          🛒 Lihat Produk Kecap Mringin (API)
        </Text>
      </Pressable>

      <ProductCatalog />
    </View>
  );
}