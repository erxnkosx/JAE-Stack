import express from "express";
import {PageInfo} from "../types";
import { getCollection, addToCollection, updateStatus, removeFromCollection } from "../database";
import { secureMiddleware } from "../middleware/secureMiddleware";

export function collectionRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async (req, res) => {
        const info: PageInfo = { currentPage: "collectie" };
        const userId = req.session.user!._id!.toString();
        const collection = await getCollection(userId);
        res.render("collection", { info, collection });
    });

    router.get("/api", secureMiddleware, async (req, res) => {
        const userId = req.session.user!._id!.toString();
        const collection = await getCollection(userId);
        res.json(collection);
    });

    router.post("/api", secureMiddleware, async (req, res) => {
        try {
            const userId = req.session.user!._id!.toString();
            await addToCollection({
                user_id: userId,
                rawg_id: req.body.rawg_id,
                title: req.body.title,
                nickname: req.body.nickname || "",
                status: req.body.status || "backlog",
                background_image: req.body.background_image,
                rating: req.body.rating,
                released: req.body.released,
                description: req.body.description
            });
            res.json({ success: true });
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });

    router.put("/api/:rawg_id", secureMiddleware, async (req, res) => {
        try {
            const userId = req.session.user!._id!.toString();
            await updateStatus(userId, parseInt(req.params.rawg_id as string), req.body.status);
            res.json({ success: true });
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });

    router.delete("/api/:rawg_id", secureMiddleware, async (req, res) => {
        try {
            const userId = req.session.user!._id!.toString();
            await removeFromCollection(userId, parseInt(req.params.rawg_id as string));
            res.json({ success: true });
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });
    return router;
}