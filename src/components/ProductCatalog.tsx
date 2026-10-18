import { ProductCard } from "@/components/productCard";
import { productData } from "@/constants/productData";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput } from "react-native";

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

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <>
      <TextInput
        placeholder="Cari Produk..."
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 8,
          marginBottom: 12,
        }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        ListEmptyComponent={<Text>Produk tidak ditemukan.</Text>}
      />
    </>
  );
}
