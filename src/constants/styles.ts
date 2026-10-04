// constants/styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef3c7", // Warna latar kuning pucat
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#78350f", // Cokelat tua (tema kecap)
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3, // Bayangan untuk Android
    shadowColor: "#000", // Bayangan untuk iOS
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#451a03",
  },
  productPrice: {
    fontSize: 16,
    color: "#16a34a", // Hijau untuk harga
    marginTop: 4,
  }
});