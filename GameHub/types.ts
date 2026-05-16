type currentPage = "ontdek" | "collectie" | "vergelijk" | "raad";

export interface Cache {
    games: Game[];
    expiresAt: Number;
}

export interface PageInfo {
    currentPage: currentPage;
}

export interface PlatformDetails {
    name: string;
}
export interface PlatformInfo {
    platform: PlatformDetails;
}

interface Genre {
    name: string;
}

export interface Game {
    id: number
    name: string;
    rating: number;
    released: string;
    background_image: string;
    metacritic: number;
    platforms: PlatformInfo[];
    genres: Genre[];
    description_raw?: string;
}

export interface Progression {
    level: number;
    experience: number;
}
export interface User {
    _id?: string;
    progression: Progression;
    avatar: string;
    email: string;
    password?: string;
}

export interface GuessGame {
    guess: string;
    tries: number;
    game: Game;
    isGuessable: boolean;
}

export interface FlashMessage {
    type: "error" | "success"
    message: string;
}

export interface GameEntry {
    user_id: string;
    rawg_id: number;
    title: string;
    nickname: string;
    status: "backlog" | "playing" | "finished";
    background_image: string;
    rating: number;
    released: string;
    description: string;
}