import express from "express";
import { PageInfo } from "../types";
export function ontdekRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        const info: PageInfo = {
            currentPage: "ontdek"
        }
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
        const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&q=${q}`);

    });
    router.get("/game/:rawgId", async (req, res) => {
    const id = req.params.rawgId;
    try {
        const response = await fetch(
            `https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`
        );

        if (!response.ok) {
            return res.status(404).json({ error: "Game niet gevonden" });
        }

        const gameData = await response.json();
        
        res.json(gameData); 
    } catch (error) {
        res.status(500).json({ error: "Server fout" });
    }
});


    return router;
}