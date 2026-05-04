import express from "express";
import { PageInfo } from "../types";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { getGames } from "../database";

export function ontdekRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async (req, res) => {
        const info: PageInfo = { currentPage: "ontdek" };
        const page = Number(req.query.page) || 1;
        const pageSize = 12;
        const response = await fetch(
            `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}&page_size=${pageSize}&ordering=-rating`
        );
        const data = await response.json();
        res.render("ontdek", {
            info,
            games: data.results,
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

    return router;
}