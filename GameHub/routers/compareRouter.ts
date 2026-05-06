import express from "express";
import { PageInfo } from "../types";
import { secureMiddleware } from "../middleware/secureMiddleware";

export default function compareRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async (req, res) => {
        const info: PageInfo = {
            currentPage: "vergelijk"
        }
        const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page_size=40&ordering=-rating`);
        const data = await response.json();
        res.render("compare", { info, games: data.results });
    });

    router.get("/api", secureMiddleware, async (req, res) => {
        const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}`);
        const data = await response.json();
        res.json(data.results);
    });
    return router;
}