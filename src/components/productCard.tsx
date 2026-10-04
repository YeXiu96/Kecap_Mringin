import { Product } from "???";
import { styles } from "@/constants/styles";
import { handlePressProduct } from "@/functions/productActions";
import { Pressable, Text, View } from "react-native";

export function ProductCard({ item }: { item: Product }) {
  return (
    <Pressable onPress={() => handlePressProduct(item.name, item.inStock)}>
      <View style={styles.card}>
        <Text style={styles.productName}>
          {item.name} ({item.sizeMl}ml)
        </Text>
        <Text style={styles.productPrice}>
          Rp {item.price.toLocaleString("id-ID")}
        </Text>
      </View>
    </Pressable>
  );
}
