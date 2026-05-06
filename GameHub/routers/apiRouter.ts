import express from "express";
import {Game, Cache} from "../types";

export default function apiRouter() {
    const router = express.Router();
    const caches = new Map<string, Cache>();
    const cacheTTL = 60 * 5 * 1000;

    router.get("/api/suggestions", async (req, res) => {
        const q: string = req.query.q as string;

        const cached = caches.get(q);
        if (cached && cached.expiresAt > Date.now()) {
            return res.json(cached.data);
        }

        const result = await fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${encodeURIComponent(q)}&page_size=6`);
        const response = await result.json();
        caches.set(q, { data: response.results, expiresAt: Date.now() + cacheTTL });
        return res.json(response.results);
    });

    return router;
}