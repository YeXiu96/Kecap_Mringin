// app/index.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import { styles } from "@/constants/styles";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/productCard";

// 1. Menerapkan Type & Array of Objects
const productList: Product[] = [
  {
    id: "1",
    name: "Kecap Mringin Manis",
    price: 15000,
    variant: "Manis",
    inStock: true,
    sizeMl: 250,
  },
  {
    id: "2",
    name: "Kecap Mringin Asin",
    price: 14000,
    variant: "Asin",
    inStock: true,
    sizeMl: 250,
  },
  {
    id: "3",
    name: "Kecap Inggris Mringin",
    price: 20000,
    variant: "Inggris",
    inStock: false,
    sizeMl: 300,
  },
  {
    id: "4",
    name: "Kecap Mringin Pedas",
    price: 16000,
    variant: "Manis",
    inStock: true,
    sizeMl: 250,
  },
];

export default function Index() {
  // Fungsi render untuk FlatList
  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard item={item} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Katalog Kecap Mringin</Text>

      {/* 2. Menerapkan Loop menggunakan FlatList */}
      <FlatList
        data={productList}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
