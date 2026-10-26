import AsyncStorage from "@react-native-async-storage/async-storage";
import { Character } from "../types/character";
const FAVORITES_KEY = "@anime_hunter_favorites";

export async function getFavorites(): Promise<Character[]> {
    const data = await AsyncStorage.getItem( FAVORITES_KEY );
    if (!data) { return []; }
    return JSON.parse(data);
}

export async function isFavorite( id: number ): Promise<boolean> {
    const favorites = await getFavorites();
    return favorites.some( (character) => character.id === id );
}

export async function addFavorite( character: Character): Promise<void> {
    const favorites = await getFavorites();

    const alreadyExists = favorites.some((item) => item.id === character.id);

    if (alreadyExists) {return;}

    const updatedFavorites = [...favorites, character];

    await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
    );
}

export async function removeFavorite(id: number): Promise<void> {
    const favorites = await getFavorites();

    const updatedFavorites = favorites.filter((character) => character.id !== id);

    await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
    );
}

export async function clearFavorites(): Promise<void> {
    await AsyncStorage.removeItem(FAVORITES_KEY);
}
