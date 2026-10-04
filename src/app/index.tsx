// app/index.tsx
import React from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { styles } from "../constants/styles"; // Memanggil External Style

// 1. Menerapkan Type & Interface 
type VariantType = "Manis" | "Asin" | "Inggris";

interface Product {
  id: string;
  name: string;
  price: number;
  variant: VariantType;
  inStock: boolean;
}

// 2. Menerapkan Array of Objects 
const productList: Product[] = [
  { id: "1", name: "Kecap Mringin Manis", price: 15000, variant: "Manis", inStock: true },
  { id: "2", name: "Kecap Mringin Asin", price: 14000, variant: "Asin", inStock: true },
  { id: "3", name: "Kecap Inggris Mringin", price: 20000, variant: "Inggris", inStock: false },
  { id: "4", name: "Kecap Mringin Pedas", price: 16000, variant: "Manis", inStock: true },
];

export default function Index() {
  
  // 3. Menerapkan Custom Function 
  // Fungsi ini dipanggil ketika produk ditekan
  const handlePressProduct = (productName: string, isAvailable: boolean) => {
    if (isAvailable) {
      Alert.alert("Tersedia!", `Anda memilih ${productName}.`);
    } else {
      Alert.alert("Mohon Maaf", `Stok ${productName} sedang kosong.`);
    }
  };

  // Fungsi Custom untuk merender setiap Card (Digunakan oleh FlatList)
  const renderProductCard = ({ item }: { item: Product }) => {
    return (
      <Pressable onPress={() => handlePressProduct(item.name, item.inStock)}>
        <View style={styles.card}>
          <View>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>Rp {item.price.toLocaleString("id-ID")}</Text>
            
            {/* 4. Menerapkan Inline Styling (10%) */}
            <Text style={{ 
              marginTop: 8, 
              fontSize: 12, 
              color: item.inStock ? "white" : "gray",
              backgroundColor: item.inStock ? "#ea580c" : "#e5e7eb",
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 4,
              alignSelf: "flex-start"
            }}>
              Varian: {item.variant}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Katalog Kecap Mringin</Text>

      {/* 5. Menerapkan Loop menggunakan FlatList */}
      <FlatList
        data={productList}
        keyExtractor={(item) => item.id}
        renderItem={renderProductCard}
      />
    </View>
  );
}