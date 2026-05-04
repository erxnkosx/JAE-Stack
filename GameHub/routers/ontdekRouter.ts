import express from "express";
import { PageInfo } from "../types";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { getGames } from "../database";

export default function ontdekRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async (req, res) => {
        const info: PageInfo = { currentPage: "ontdek" };
        const page = Number(req.query.page) || 1;
        const pageSize = 12;
        const response = await fetch(
            `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}&page_size=${pageSize}&ordering=-rating`
        );
        const data = await response.json();

        const games = await Promise.all(data.results.map(async (game: any) => {
            const detail = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${process.env.API_KEY}`);
            const detailData = await detail.json();
            return { ...game, description_raw: detailData.description_raw || "" };
        }));

        res.render("ontdek", {
            info,
            games,
            currentPage: page,
            hasNextPage: Boolean(data.next),
            hasPreviousPage: Boolean(data.previous)
        });
    });

    router.get("/suggest", async (req, res) => {
        const q = String(req.query.q);
        const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${q}&page_size=5`);
        const data = await response.json();
        res.json(data.results);
    });

    router.get("/api", secureMiddleware, async (req, res) => {
        const games = await getGames();
        res.json(games);
    });

    router.get("/:id", secureMiddleware, async (req, res) => {
        const response = await fetch(`https://api.rawg.io/api/games/${req.params.id}?key=${process.env.API_KEY}`);
        const data = await response.json();
        const description = data.description_raw || "Geen beschrijving beschikbaar.";
        res.json({ description: description.length > 200 ? description.substring(0, 200) + "..." : description });
    });

    return router;
}