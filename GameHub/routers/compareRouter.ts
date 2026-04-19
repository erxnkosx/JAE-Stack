import express from "express";

export function compareRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("compare");
    });

    return router;
}