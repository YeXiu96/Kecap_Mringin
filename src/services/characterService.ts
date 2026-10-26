import { fetchCharacter, fetchAnime, fetchStatistics, fetchCharacters} from "./api";
import { CharacterDetail, Character } from "../types/character";

/**
 * Sequential request.
 *
 * Character harus selesai terlebih dahulu.
 * Setelah itu baru anime dan statistics dijalankan.
 */
export async function getCharacterDetailSequential( id: number ): Promise<CharacterDetail> {
    const character = await fetchCharacter(id);
    const anime = await fetchAnime(id);
    const statistics = await fetchStatistics(id);

    return { character, anime, statistics };
}

/**
 * Parallel request.
 *
 * Character harus didapatkan terlebih dahulu,
 * tetapi anime dan statistics tidak saling bergantung.
 */
export async function getCharacterDetail( id: number ): Promise<CharacterDetail> {
    const character = await fetchCharacter(id);

    const [anime, statistics] = await Promise.all([
        fetchAnime(id), fetchStatistics(id),
    ]);

    return { character,anime,statistics };
}

/**
 * Promise.allSettled
 *
 * Semua request tetap ditunggu walaupun
 * salah satunya gagal.
 */
export async function getCharacterDetailSafe( id: number ) {
    const character = await fetchCharacter(id);

    const results = await Promise.allSettled([
        fetchAnime(id), fetchStatistics(id),
    ]);

    const anime = results[0].status === "fulfilled" ? results[0].value : [];

    const statistics = results[1].status === "fulfilled" ? results[1].value : null;

    return { character, anime,statistics };
}

/**
 * Contoh .then()
 *
 * Sengaja menggunakan Promise chain.
 */
export function searchCharacters( keyword: string ): Promise<Character[]> {
    return fetchCharacters().then((characters) => {
        const normalizedKeyword = keyword.toLowerCase().trim();

        return characters.filter((character) => character.name.toLowerCase().includes(normalizedKeyword));
    })
    .catch((error) => {
        console.error("Search error:",error);
        throw error;
    })
    .finally(() => {
        console.log("Search request selesai.");
    });
}
