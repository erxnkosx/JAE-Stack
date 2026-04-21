import express from "express";

export function homeRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("collection");
    });

    return router;
}