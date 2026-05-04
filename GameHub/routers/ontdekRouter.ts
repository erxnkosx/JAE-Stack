import express from "express";
import { pageInfo } from "../types";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { getGames } from "../database";

export function ontdekRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async (req, res) => {
        const info: pageInfo = { currentPage: "ontdek" };
        const games = await getGames();
        res.render("ontdek", { info, games });
    });

    router.get("/api", secureMiddleware, async (req, res) => {
        const games = await getGames();
        res.json(games);
    });
    return router;
}