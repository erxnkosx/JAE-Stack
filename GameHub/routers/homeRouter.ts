import express from "express";
import {secureMiddleware} from "../middleware/secureMiddleware"

export function homeRouter() {
    const router = express.Router();

    router.get("/",secureMiddleware, (req, res) => {
        res.render("index");
    });

    return router;
}