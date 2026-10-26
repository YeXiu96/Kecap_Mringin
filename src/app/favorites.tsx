import {
  useCallback,
  useState,
} from "react";

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  router,
  useFocusEffect,
} from "expo-router";

import CharacterCard from "../components/CharacterCard";
import Loading from "../components/Loading";

import {
  getFavorites,
  removeFavorite,
  clearFavorites,
} from "../services/favoriteService";

import { Character } from "../types/character";

export default function FavoritesScreen() {
  const [favorites, setFavorites] =
    useState<Character[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadFavorites =
    useCallback(async () => {
      try {
        setLoading(true);

        const result =
          await getFavorites();

        setFavorites(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  async function handleRemove(
    id: number
  ) {
    try {
      await removeFavorite(id);

      setFavorites((current) =>
        current.filter(
          (character) =>
            character.id !== id
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function handleClear() {
    try {
      await clearFavorites();

      setFavorites([]);
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <Loading message="Loading favorites..." />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            My Favorites
          </Text>

          <Text style={styles.count}>
            {favorites.length} character
          </Text>
        </View>

        {favorites.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={handleClear}
          >
            <Text
              style={
                styles.clearButtonText
              }
            >
              Clear
            </Text>
          </Pressable>
        )}
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>
            💔
          </Text>

          <Text style={styles.emptyTitle}>
            No favorites yet
          </Text>

          <Text style={styles.emptyText}>
            Add some characters to your
            favorites.
          </Text>

          <Pressable
            style={styles.searchButton}
            onPress={() =>
              router.push("/search")
            }
          >
            <Text
              style={
                styles.searchButtonText
              }
            >
              Search Character
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) =>
            item.id.toString()
          }
          contentContainerStyle={
            styles.list
          }
          renderItem={({ item }) => (
            <CharacterCard
              character={item}
              favorite
              onFavorite={() =>
                handleRemove(item.id)
              }
              onPress={() =>
                router.push(
                  `/character/${item.id}`
                )
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
  },

  count: {
    color: "#64748b",
    marginTop: 3,
  },

  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fee2e2",
    borderRadius: 10,
  },

  clearButtonText: {
    color: "#dc2626",
    fontWeight: "700",
  },

  list: {
    paddingBottom: 20,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyEmoji: {
    fontSize: 60,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 15,
  },

  emptyText: {
    color: "#64748b",
    marginTop: 5,
  },

  searchButton: {
    marginTop: 20,
    backgroundColor: "#6366f1",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  searchButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
