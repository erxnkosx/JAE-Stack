import express from "express";

export function collectionRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("collection");
    });

    return router;
}