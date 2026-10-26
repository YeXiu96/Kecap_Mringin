import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>
        🎌
      </Text>

      <Text style={styles.title}>
        Anime Hunter
      </Text>

      <Text style={styles.subtitle}>
        Learn Async Programming with React Native
      </Text>

      <Pressable
        style={styles.button}
        onPress={() =>
          router.push("/search")
        }
      >
        <Text style={styles.buttonText}>
          🔎 Search Character
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          styles.secondary,
        ]}
        onPress={() =>
          router.push("/favorites")
        }
      >
        <Text style={styles.buttonText}>
          ❤️ My Favorites
        </Text>
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>
          Async concepts
        </Text>

        <Text style={styles.infoText}>
          • Promise
        </Text>

        <Text style={styles.infoText}>
          • async / await
        </Text>

        <Text style={styles.infoText}>
          • .then() / .catch()
        </Text>

        <Text style={styles.infoText}>
          • try / catch / finally
        </Text>

        <Text style={styles.infoText}>
          • Promise.all()
        </Text>

        <Text style={styles.infoText}>
          • Promise.allSettled()
        </Text>

        <Text style={styles.infoText}>
          • AsyncStorage
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },

  emoji: {
    textAlign: "center",
    fontSize: 60,
  },

  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 8,
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#6366f1",
    padding: 17,
    borderRadius: 14,
    marginBottom: 12,
  },

  secondary: {
    backgroundColor: "#ec4899",
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  info: {
    marginTop: 25,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
  },

  infoTitle: {
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 10,
  },

  infoText: {
    color: "#475569",
    marginBottom: 5,
  },
});