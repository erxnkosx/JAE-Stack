import express from "express";
import { PageInfo } from "../types";
export function ontdekRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        const info: PageInfo = {
            currentPage: "ontdek"
        }
        res.render("ontdek", { info });
    });

    router.get("/suggest", async (req, res) => {
        const q = String(req.query.q);
        const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&q=${q}`);

    });


    return router;
}