import express from "express";

export function authRouter() {
    const router = express.Router();

    router.get("/login", (req, res) => {
        res.render("login");
    });

    router.get("/signup", (req, res) => {
        res.render("signup");
    });

    return router;
}