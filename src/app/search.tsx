import {
  useEffect,
  useState,
} from "react";

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";

import CharacterCard from "../components/CharacterCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import {
  searchCharacters,
} from "../services/characterService";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favoriteService";

import { Character } from "../types/character";

export default function SearchScreen() {
  const [keyword, setKeyword] =
    useState("");

  const [characters, setCharacters] =
    useState<Character[]>([]);

  const [favorites, setFavorites] =
    useState<Character[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    getFavorites()
      .then((result) => {
        setFavorites(result);
      })
      .catch((error) => {
        console.log(
          "Favorite error:",
          error
        );
      });
  }, []);

  function handleSearch() {
    if (!keyword.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    searchCharacters(keyword)
      .then((result) => {
        setCharacters(result);
      })
      .catch((error) => {
        console.log(error);

        setError(
          "Gagal mengambil data character."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleFavorite(
    character: Character
  ) {
    const exists = favorites.some(
      (item) => item.id === character.id
    );

    if (exists) {
      removeFavorite(character.id)
        .then(() => {
          setFavorites((current) =>
            current.filter(
              (item) =>
                item.id !== character.id
            )
          );
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }

    addFavorite(character)
      .then(() => {
        setFavorites((current) => [
          ...current,
          character,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Search Anime Character
      </Text>

      <View style={styles.searchContainer}>
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Gon, Naruto, Luffy..."
          style={styles.input}
          onSubmitEditing={handleSearch}
        />

        <Pressable
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchText}>
            Search
          </Text>
        </Pressable>
      </View>

      {loading && (
        <Loading message="Searching..." />
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!loading &&
        !error &&
        characters.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>
              🔎
            </Text>

            <Text>
              Search for an anime character
            </Text>
          </View>
        )}

      <FlatList
        data={characters}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            favorite={favorites.some(
              (favorite) =>
                favorite.id === item.id
            )}
            onFavorite={() =>
              handleFavorite(item)
            }
            onPress={() =>
              router.push(
                `/character/${item.id}`
              )
            }
          />
        )}
        contentContainerStyle={
          styles.list
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 15,
  },

  searchContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  searchButton: {
    marginLeft: 8,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  searchText: {
    color: "#fff",
    fontWeight: "700",
  },

  list: {
    paddingBottom: 20,
  },

  empty: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
});
