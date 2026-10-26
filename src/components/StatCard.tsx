import {
  StyleSheet,
  Text,
  View,
} from "react-native";

interface StatCardProps {
  title: string;
  value: string | number;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 12,
    backgroundColor: "#eef2ff",
    alignItems: "center",
  },

  value: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4f46e5",
  },

  title: {
    marginTop: 5,
    color: "#666",
    fontSize: 12,
  },
});
