import { Alert } from "react-native";

export function handlePressProduct(productName: string, isAvailable: boolean) {
  if (isAvailable) {
    Alert.alert("Tersedia!", `Anda memilih ${productName}.`);
  } else {
    Alert.alert("Mohon maaf, ", `stok ${productName} sedang kosong.`);
  }
}
