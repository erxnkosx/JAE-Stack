import express from "express";
import {PageInfo, Cache, Game} from "../types";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { getGames } from "../database";
import {cacheGames, fetchAllGamesWithQuery, findQueryInCache, getGamesDetail} from "../services/gamesService";

export default function ontdekRouter() {
    const router = express.Router();
    const cachedGames = new Map<string, Cache>();
    router.get("/", secureMiddleware, async (req, res) => {
        const info: PageInfo = { currentPage: "ontdek" };
        const isSearching: boolean = false;
        const page = Number(req.query.page) || 1;
        const pageSize = 12;
        const response = await fetch(
            `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}&page_size=${pageSize}&ordering=-rating`
        );
        const data = await response.json();

        const games = await getGamesDetail(data.results);


        res.render("ontdek", {
            info,
            games,
            isSearching,
            currentPage: page,
            hasNextPage: Boolean(data.next),
            hasPreviousPage: Boolean(data.previous)
        });
    });

    router.get("/suggestions", secureMiddleware, async (req, res) => {
        const q = req.query.q as string;
        const id = req.query.id as string;
        const info: PageInfo = { currentPage: "ontdek" };
        const isSearching: boolean = true;
        const page: number = 0;
        let games: Game[] = [];

        if (id) {
            const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`);
            if (response.ok) {
                const game = await response.json();
                games = [game];
            }
        } else {
            if (cachedGames.size !== 0) {
                games = findQueryInCache(q, cachedGames);
            }

            if (games.length === 0) {
                games = await fetchAllGamesWithQuery(q);
                cacheGames(q, cachedGames, games);
            }

            games = games.filter(g => g.name.toLowerCase().includes(q.toLowerCase()));

            console.log("Fetched: ", games.length);
            console.log("Cache", cachedGames.size);

            games = await getGamesDetail(games);
        }


        res.render("ontdek", {
            info,
            isSearching,
            games: games,
            currentPage: page,
            hasNextPage: false,
            hasPreviousPage: false
        });
    });


    router.get("/suggest", async (req, res) => {
        const q = String(req.query.q);
        const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${q}&page_size=5`);
        const data = await response.json();
        res.json(data.results);

    });
    router.get("/game/:rawgId", async (req, res) => {
    const id = req.params.rawgId;
    try {
        const response = await fetch(
            `https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`
        );
        console.log("raw");
        if (!response.ok) {
            return res.status(404).json({ error: "Game niet gevonden" });
        }

        const gameData = await response.json();
        const description = gameData.description_raw || "Geen beschrijving beschikbaar.";
        const descriptionShort = description.length > 200 ? description.substring(0, 200) : description;
        res.json({ ...gameData, description_raw: descriptionShort });
    } catch (error) {
        res.status(500).json({ error: "Server fout" });
    }
});

    router.get("/api", secureMiddleware, async (req, res) => {
        const games = await getGames();
        res.json(games);
    });

    router.get("/:id", secureMiddleware, async (req, res) => {
        const response = await fetch(`https://api.rawg.io/api/games/${req.params.id}?key=${process.env.API_KEY}`);
        const data = await response.json();
        const description = data.description_raw || "Geen beschrijving beschikbaar.";
        console.log("substring");
        res.json({ description: description.length > 200 ? description.substring(0, 200) + "..." : description });
    });

    return router;
}