import express from "express";
import { PageInfo } from "../types";
import { getCollection, addToCollection, updateStatus, removeFromCollection } from "../database";
import { secureMiddleware } from "../middleware/secureMiddleware";

export default function collectionRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async (req, res) => {
        const info: PageInfo = { currentPage: "collectie" };
        const userId = String(req.session.user?._id);
        const collection = await getCollection(userId);
        res.render("collection", { info, collection });
    });

    router.get("/api", secureMiddleware, async (req, res) => {
        const userId = String(req.session.user?._id);
        const collection = await getCollection(userId);
        res.json(collection);
    });

    router.post("/api", secureMiddleware, async (req, res) => {
        try {
            const userId = String(req.session.user?._id);
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
            const userId = String(req.session.user?._id);
            const rawgId = parseInt(String(req.params.rawg_id));
            await updateStatus(userId, rawgId, req.body.status);
            res.json({ success: true });
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });

    router.delete("/api/:rawg_id", secureMiddleware, async (req, res) => {
        try {
            const userId = String(req.session.user?._id);
            const rawgId = parseInt(String(req.params.rawg_id));
            await removeFromCollection(userId, rawgId);
            res.json({ success: true });
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });

    return router;
}