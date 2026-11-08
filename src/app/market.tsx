import { fetchMarketProducts } from "@/services/marketService";
import { MarketProduct } from "@/types/marketProduct";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Linking, Pressable, StyleSheet, Text, View } from "react-native";

export default function MarketScreen() {
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0); 

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await fetchMarketProducts();
        setProducts(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1); // memicu useEffect di atas berjalan lagi
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#78350f" />
        <Text style={s.info}>Mengambil data dari Apify...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={s.center}>
        <Text style={s.errorText}>{error}</Text>
        <Pressable onPress={handleRetry} style={s.retryButton}>
          <Text style={s.retryText}>Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={s.container}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      data={products}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <Text style={s.subtitle}>
          {products.length} produk Kecap Mringin dari Apify API.
        </Text>
      }
      ListEmptyComponent={<Text style={s.info}>Belum ada data.</Text>}
      renderItem={({ item }) => (
        <Pressable onPress={() => Linking.openURL(item.link)} style={s.card}>
          <Image source={{ uri: item.imageUrl }} style={s.image} contentFit="cover" />
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{item.name}</Text>
            <Text style={s.meta}>{item.packaging} • {item.sizeMl} ml</Text>
            <Text style={s.price}>€{item.priceEur.toFixed(2)}</Text>
            <Text style={s.meta}>€{item.pricePerLiterEur.toFixed(2)} / liter</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fef3c7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fef3c7", padding: 20 },
  info: { marginTop: 12, color: "#78350f", fontWeight: "600", textAlign: "center" },
  errorText: { color: "#b91c1c", fontWeight: "600", textAlign: "center", marginBottom: 12 },
  retryButton: { backgroundColor: "#78350f", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: "#fff", fontWeight: "700" },
  subtitle: { color: "#78350f", marginBottom: 14 },
  card: { flexDirection: "row", gap: 12, backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: "700", color: "#451a03" },
  meta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  price: { fontSize: 16, fontWeight: "700", color: "#16a34a", marginTop: 4 },
});