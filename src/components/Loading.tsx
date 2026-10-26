import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface LoadingProps {
  message?: string;
}

export default function Loading({
  message = "Loading...",
}: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#6366f1"
      />

      <Text style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    marginTop: 10,
    color: "#555",
  },
});
