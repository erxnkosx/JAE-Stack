import express from "express";
import {Game} from "../types";

export default function apiRouter() {
    const router = express.Router();

    router.get("/api/suggestions", async (req, res) => {
        const q: string = req.query.q as string;
        const result = await fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${encodeURIComponent(q)}&page_size=6`);
        const response = await result.json();
        const filtered = (response.results as Game[]).filter(g => g.name.toLowerCase().includes(q.toLowerCase()));
        return res.json(filtered);
    });

    router.get("/api/allGames", async (req, res) => {

        let next: boolean = true;
        let page: number = 1;
        const response = await fetch(
            `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}&ordering=-rating`
        );
        const data = await response.json();
        return res.json(data.results);
    })

    return router;
}