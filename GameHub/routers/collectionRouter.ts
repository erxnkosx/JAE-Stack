import express from "express";
import {pageInfo} from "../types";

export function collectionRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        const info: pageInfo = {
            currentPage: "collectie"
        }
        res.render("collection", { info });
    });

    return router;
}