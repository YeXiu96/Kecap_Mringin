import { ProductCard } from "@/components/productCard";
import { productData } from "@/constants/productData";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(productData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 50 }}>
        <ActivityIndicator size="large" color="#78350f" />
        <Text style={{ marginTop: 12, color: "#78350f", fontWeight: "600" }}>
          Memuat produk...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Cari produk kecap..."
        placeholderTextColor="#9ca3af"
        value={query}
        onChangeText={setQuery}
        style={{
          backgroundColor: "#ffffff",
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 10,
          fontSize: 15,
          color: "#451a03",
          marginBottom: 14,
        }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 16, color: "#78350f", fontWeight: "600" }}>
              Produk tidak ditemukan
            </Text>
            <Text style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              Coba cari dengan kata kunci lain.
            </Text>
          </View>
        }
      />
    </View>
  );
}
