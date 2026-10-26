import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Character } from "../types/character";

interface CharacterCardProps {
  character: Character;
  onPress: () => void;
  onFavorite?: () => void;
  favorite?: boolean;
}

export default function CharacterCard({
  character,
  onPress,
  onFavorite,
  favorite = false,
}: CharacterCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {character.image}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {character.name}
        </Text>

        <Text style={styles.anime}>
          {character.anime}
        </Text>

        <Text style={styles.description}>
          {character.description}
        </Text>
      </View>

      {onFavorite && (
        <Pressable
          style={styles.favorite}
          onPress={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
        >
          <Text style={styles.favoriteText}>
            {favorite ? "❤️" : "🤍"}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 30,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
  },

  anime: {
    marginTop: 2,
    color: "#6366f1",
    fontWeight: "600",
  },

  description: {
    marginTop: 5,
    color: "#666",
    fontSize: 12,
  },

  favorite: {
    padding: 5,
  },

  favoriteText: {
    fontSize: 22,
  },
});
