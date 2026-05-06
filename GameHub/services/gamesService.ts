// import { Request, Response } from "express";
import { Cache } from "../types";
import {Game} from "../types";

const TTL: number = 60 * 5 * 1000;

export async function fetchAllGames() {
    const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=1`);
    const data = await response.json();
    console.log("fetch length: ", data);
    return data.results;
}

export async function fetchAllGamesWithQuery(q: string) {
    const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${q}&ordering=-rating&page=1`);
    const data = await response.json();
    return data.results;
}

export function cacheGames(query: string, cachedGames: Map<string, Cache>, newGames: Game[]) {
    cachedGames.set(query.trim().toLowerCase(), { games: newGames, expiresAt: Date.now() + TTL });
}

export function findQueryInCache(query: string, cache: Map<string, Cache>) {
    if (cache.size === 0) return [];
    return cache.get(query)?.games ?? [];

}

export async function getGamesDetail(games: Game[]) {
    return await Promise.all(games.map(async (game) => {
        const detail = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${process.env.API_KEY}`);
        const detailData = await detail.json();
        return { ...game, description_raw: detailData.description_raw || "" };
    }));
}