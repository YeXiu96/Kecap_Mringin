export interface Character {
  id: number;
  name: string;
  image: string;
  description: string;
  anime: string;
  age: number;
  gender: string;
}

export interface Anime {
  id: number;
  title: string;
  episodes: number;
  score: number;
  year: number;
}

export interface CharacterStatistics {
  popularity: number;
  favorites: number;
  rank: number;
}

export interface CharacterDetail {
  character: Character;
  anime: Anime[];
  statistics: CharacterStatistics;
}
