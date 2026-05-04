import express from "express";
import { PageInfo } from "../types";

export function collectionRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        const info: PageInfo = {
            currentPage: "collectie"
        }
        res.render("collection", { info });
    });

    return router;
}