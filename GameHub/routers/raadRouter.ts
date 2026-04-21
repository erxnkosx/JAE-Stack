import express from "express";

export function raadRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("raad-page");
    });

    return router;
}