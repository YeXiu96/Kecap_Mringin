// app/index.tsx
import { ProductCatalog } from "@/components/ProductCatalog";
import { styles } from "@/constants/styles";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Katalog Kecap Mringin</Text>
      <ProductCatalog />
    </View>
  );
}
