import { Product } from "@/types/product";
import { styles } from "@/constants/styles";
import { handlePressProduct } from "@/functions/productActions";
import { Pressable, Text, View } from "react-native";

export function ProductCard({ item }: { item: Product }) {
  return (
    <Pressable onPress={() => handlePressProduct(item.name, item.inStock)}>
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
