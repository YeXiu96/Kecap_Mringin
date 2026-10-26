/* ================================== TABLE OF CONTENTS =================================

1.1 IMPORT SECTION
1.2 CREATE DATA SECTION
    2.1 CREATE CHARACTERS DATA
    2.2 CREATE ANIME DATA
1.3 CREATE API FUNCTIONS SECTION
    2.3 CREATE FUNCTION TO FETCH ALL CHARACTERS DATA
    2.4 CREATE FUNCTION TO FETCH ALL CHARACTERS DATA BY ID
    2.5 CREATE FUNCTION TO FETCH ALL ANIME DATA BY CHARACTER'S ID
    2.6 CREATE FUNCTION TO FETCH RATING DATA BY CHARACTER'S ID

========================================================================================== */

// 1.1 IMPORT SECTION
import { delay } from "../utils/delay";
import { Character, Anime, CharacterStatistics } from "../types/character";

// 1.2 CREATE DATA SECTION
    // 2.1 CREATE CHARACTERS DATA
    const characters: Character[] = [
        {
            id: 1,
            name: "Gon Freecss",
            image: "🟢",
            description: "Gon is a young Hunter who leaves his home to find his father and become a Hunter.",
            anime: "Hunter x Hunter",
            age: 12,
            gender: "Male",
        },
        {
            id: 2,
            name: "Killua Zoldyck",
            image: "⚡",
            description: "Killua is the best friend of Gon and comes from the famous Zoldyck assassin family.",
            anime: "Hunter x Hunter",
            age: 12,
            gender: "Male",
        },
        {
            id: 3,
            name: "Naruto Uzumaki",
            image: "🍥",
            description: "Naruto is a ninja who dreams of becoming Hokage and gaining recognition from his village.",
            anime: "Naruto",
            age: 17,
            gender: "Male",
        },
        {
            id: 4,
            name: "Monkey D. Luffy",
            image: "🏴‍☠️",
            description: "Luffy is a pirate who wants to become the Pirate King.",
            anime: "One Piece",
            age: 19,
            gender: "Male",
        },
        {
            id: 5,
            name: "Levi Ackerman",
            image: "⚔️",
            description:"Levi is one of the strongest soldiers in the Scout Regiment.",
            anime: "Attack on Titan",
            age: 30,
            gender: "Male",
        },
        {
            id: 6,
            name: "Mikasa Ackerman",
            image: "🧣",
            description: "Mikasa is an elite soldier and one of the strongest members of the Scout Regiment.",
            anime: "Attack on Titan",
            age: 19,
            gender: "Female",
        },
    ];

    // 2.2 CREATE ANIME DATA
    const animeList: Anime[] = [
        {
            id: 1,
            title: "Hunter x Hunter",
            episodes: 148,
            score: 9.1,
            year: 2011,
        },
        {
            id: 2,
            title: "Naruto",
            episodes: 220,
            score: 8.3,
            year: 2002,
        },
        {
            id: 3,
            title: "One Piece",
            episodes: 1100,
            score: 9.0,
            year: 1999,
        },
        {
            id: 4,
            title: "Attack on Titan",
            episodes: 89,
            score: 9.0,
            year: 2013,
        },
    ];

// 1.3 CREATE API FUNCTIONS SECTION
    // 2.3 CREATE FUNCTION TO FETCH ALL CHARACTERS DATA
    export async function fetchCharacters(): Promise<Character[]> {
        await delay(1200); // [1]

        return characters; // [4]
    }

    // 2.4 CREATE FUNCTION TO FETCH CHARACTER DATA BY ID
    export async function fetchCharacter(id: number): Promise<Character> {
        await delay(1000); // [1]

        const character = characters.find((item) => item.id === id); // [2]
        if (!character) { throw new Error("Character tidak ditemukan.");} // [3]

        return character; // [4]
    }

    // 2.5 CREATE FUNCTION TO FETCH ANIME DATA BY CHARACTER'S ID
    export async function fetchAnime( characterId: number ): Promise<Anime[]> {
        await delay(1500); // [1]

        const character = characters.find( (item) => item.id === characterId ); // [2]
        if (!character) {throw new Error("Anime character tidak ditemukan.");} // [3]

        return animeList.filter((anime) => anime.title === character.anime); // [4]
    }

    // 2.6 CREATE FUNCTION TO FETCH ANIME DATA BY CHARACTER'S ID
    export async function fetchStatistics( characterId: number ): Promise<CharacterStatistics> {
        await delay(1300); // [1]

        const statistics: Record<number,CharacterStatistics> = {
            1: { popularity: 92, favorites: 180000, rank: 5},
            2: { popularity: 96, favorites: 220000,rank: 2},
            3: {popularity: 99,favorites: 500000,rank: 1},
            4: {popularity: 98, favorites: 450000,rank: 3},
            5: { popularity: 95,favorites: 300000,rank: 4},
            6: {popularity: 90,favorites: 190000,rank: 8},
        };

        const result = statistics[characterId]; // [2]
        if (!result) { throw new Error("Statistics tidak ditemukan.");} // [3]

        return result; // [4]
    }

/* ================ EXPLANATION ================

[1]: SIMULATE A DELAY WHEN FETCHING A DATA
[2]: TAKE THE DATA AND STORE IT IN A VARIABLE
[3]: IF THE DATA DIDN'T FOUND, GIVE AN ERROR MESSAGE
[4]: LASTLY, WE RETURN THE DATA TO THE VARIABLE

================================================*/
