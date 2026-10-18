import { Product } from "@/types/product";
import { styles } from "@/constants/styles";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

export function ProductCard({ item }: { item: Product }) {
  // Menerapkan router.push() dengan parameter (Kriteria Penilaian Modul 2)
  const handlePress = () => {
    router.push({
      pathname: "/details",
      params: {
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        variant: item.variant,
        inStock: item.inStock ? "true" : "false",
        sizeMl: item.sizeMl ? item.sizeMl.toString() : "",
      },
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.card}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.productName}>
            {item.name} {item.sizeMl ? `(${item.sizeMl}ml)` : ""}
          </Text>
          
          {/* Menerapkan Inline Styling (Kriteria Penilaian Modul 1) */}
          <Text
            style={{
              marginTop: 6,
              fontSize: 12,
              fontWeight: "600",
              color: item.inStock ? "#ffffff" : "#6b7280",
              backgroundColor: item.inStock ? "#ea580c" : "#e5e7eb",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
              alignSelf: "flex-start",
            }}
          >
            Varian: {item.variant} • {item.inStock ? "Tersedia" : "Stok Habis"}
          </Text>
        </View>

        <Text style={styles.productPrice}>
          Rp {item.price.toLocaleString("id-ID")}
        </Text>
      </View>
    </Pressable>
  );
}
